const students = require("../Models/students");
const quizzes = require("../Models/quizzes");
const questions = require("../Models/questions");
const sessions = require("../Models/sessions");
const commonServices = require("../services/common");
const mailer = require("../controllers/mailer");
const md5 = require("md5");
const { default: mongoose } = require("mongoose");
const session = require("express-session");

async function loginFetch(username, password) {
    let data = await students
        .findOne({
            enrollment: username,
            password: password,
        })
        .populate("department_id");
    return data;
}

async function loginCheck(jwttoken) {
    console.log("hello");
}
async function registerStudent(enrollment) {
    var student = await students.findOne({
        enrollment: enrollment,
        password: null,
    });
    console.log(student);
    return student;
}
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function forgetPassword(data) {
    var student = await students.findOne({ enrollment: data });
    let password = commonServices.randomPassword();
    if (student) {
        let record = 1;
        //send mail
        let mailDetails = {
            from: "avcthehero@gmail.com",
            to: student.email,
            subject: "Forget Password",
            text: `Your Username is ${data} and Password is ${password}`,
        };
        mailer.sendMail(mailDetails, async function (err, data) {
            if (err) {
                console.log(`${enrollment} : ERROR`);
                console.log(err.message);
                record = 0;
            } else {
                // console.log(`${enrollment} : SENT`);
            }
        });
        await timeout(500);
        if (record) {
            student.password = md5(password);
            await student.save();
        }
        return record;
    }
    return 2;
    // console.log(student);
}

async function quizCheck(quizId, studentId) {
    let quiz = await quizzes
        .findOne({ _id: quizId })
        .populate("group_id")
        .populate("subject_id");
    if (quiz) {
        let current_date = new Date();
        // console.log(current_date.toLocaleString());
        let valid_to = new Date(quiz.valid_to);
        // console.log(valid_to.toLocaleString());

        // console.log(valid_to - current_date);
        if (quiz.valid_to > current_date && quiz.valid_from < current_date) {
            console.log(quiz.valid_to - current_date);
            let flag = 0;
            quiz.group_id.students.forEach((element) => {
                if (element == studentId) {
                    flag = 1;
                    return;
                }
            });
            if (flag) {
                return [quiz, 0];
            }
        } else {
            if (
                quiz.visible_to > current_date &&
                current_date > quiz.valid_to &&
                quiz.guest_flag
            ) {
                return [quiz, 1];
            }
            return 0;
        }
    }
    return 0;
}

async function createSession(quizId, studentId) {
    let quiz = await quizzes.findOne({ _id: quizId });
    let selectedQuestions = [];
    quiz.marks_questions.forEach((ele) => {
        let flag = 0;
        quiz.compulsary_questions.forEach((compQues) => {
            if (compQues.marks == ele.marks) {
                flag++;
                selectedQuestions.push({
                    question: compQues.question,
                    answer: "",
                    marks: 0,
                    time_spent: 0,
                });
            }
        });
        let random_questions = [];
        if (flag < ele.count) {
            quiz.random_questions.forEach((randQues) => {
                if (randQues.marks == ele.marks) {
                    random_questions.push({
                        question: randQues.question,
                        answer: "",
                        marks: 0,
                        time_spent: 0,
                    });
                }
            });
            for (let index = 0; index < ele.count - flag; index++) {
                let temp = Math.floor(Math.random() * random_questions.length);
                selectedQuestions.push(random_questions[temp]);
                random_questions.splice(temp, 1);
            }
        }
    });
    let i = selectedQuestions.length;
    let randomIndex = 0;
    while (i != 0) {
        randomIndex = Math.floor(Math.random() * i);
        i--;
        [selectedQuestions[i], selectedQuestions[randomIndex]] = [
            selectedQuestions[randomIndex],
            selectedQuestions[i],
        ];
    }
    let session = new sessions({
        quiz_id: quizId,
        is_active: 1,
        student_id: studentId,
        start_time: Date.now(),
        status: 0,
        questions_answers: selectedQuestions,
    });
    await session.save();
    return session;
}

async function getQuestion(questionId) {
    let question = await questions.findOne({ _id: questionId });
    return question;
}

async function getSession(studentId, quizId, validTo) {
    let session = await sessions.findOne({
        student_id: studentId,
        quiz_id: quizId,
        start_time: { $lt: validTo },
    });
    return session;
}
async function getOtherQuizSession(studentId, quizId, validTo, duration) {
    let session = await sessions.find({
        student_id: studentId,
        quiz_id: quizId,
        start_time: { $gt: validTo },
    });
    for (let index = 0; index < session.length; index++) {
        const element = session[index];
        if ((new Date() - element.start_time) / (1000 * 60) < duration) {
            return element;
        }
    }
    return null;
}
async function submitQuiz(sessionId, questionAnswer) {
    let session = await sessions.findOne({ _id: sessionId });
    if (session) {
        let quiz = await quizzes.findOne(
            { _id: session.quiz_id },
            { duration: 1 }
        );
        session.questions_answers = questionAnswer;
        session.end_time = new Date();
        if (
            session.end_time - session.start_time <
            (quiz.duration * 60 + 10) * 1000
        ) {
            session.status = 1; //submitted
            await session.save();
        } else {
            return 0;
        }
        return 1;
    }
    return 0;
}
async function upcomingQuiz(studentId) {
    let quizData = await quizzes
        .find({ is_active: 1 })
        .populate({
            path: "group_id",
            model: "groups",
            match: { students: { $in: [studentId] } },
        })
        .populate("subject_id");
    // console.log(studentId);
    let current_date = new Date();
    // current_date=current_date.toUTCString();
    // console.log(current_date);
    for (let index = 0; index < quizData.length; index++) {
        const element = quizData[index];
        // console.log(element.visible_from);
        if (
            element.visible_from <= current_date &&
            current_date <= element.valid_from
        ) {
        } else {
            quizData.splice(index, 1);
            index--;
        }
    }
    // console.log(quizData);
    return quizData;
}
async function availableQuiz(studentId) {
    let quizData = await quizzes
        .find({ is_active: 1 })
        .populate({
            path: "group_id",
            model: "groups",
            match: { students: { $in: [studentId] } },
        })
        .populate("subject_id");
    let current_date = new Date();
    console.log(current_date);
    console.log(quizData);

    for (let index = 0; index < quizData.length; index++) {
        const element = quizData[index];
        console.log(element.valid_from);
        console.log(element.valid_to);
        if (
            element.valid_from <= current_date &&
            current_date <= element.valid_to
        ) {
        } else {
            quizData.splice(index, 1);
            index--;
        }
    }
    console.log(quizData);
    return quizData;
}
async function otherQuiz(studentId) {
    let quizData = await quizzes
        .find({ is_active: 1, guest_flag: 1 })
        .populate("subject_id");
    let current_date = new Date();

    for (let index = 0; index < quizData.length; index++) {
        const element = quizData[index];

        if (
            element.valid_to <= current_date &&
            current_date <= element.visible_to
        ) {
        } else {
            quizData.splice(index, 1);
            index--;
        }
    }
    return quizData;
}

async function history(studentId) {
    let session = await sessions
        .find({ student_id: studentId ,is_active:1})
        .populate({
            path: "quiz_id",
            populate: { path: "subject_id", model: "subjects" },
        })
        .populate({
            path: "questions_answers.question",
           
        });
    if (session) {
        let curr_date = new Date();
        for (let index = 0; index < session.length; index++) {
            const element = session[index];
            if (element.quiz_id.valid_to > curr_date) {
                element.questions_answers = [];
            }
        }
        
    }
    console.log(session);
    return session;
}

async function quizHistory(studentId, sessionId) {
    let session = await sessions
        .findOne({ _id: sessionId, student_id: studentId })
        .populate({
            path: "questions_answers.question",
            populate: { path: "course_outcome_id", model: "course_outcomes" },
        })
        .populate("quiz_id");
    let curr_date = new Date();
    if (session.quiz_id.valid_to > curr_date) {
        return null;
    }
    return session;
}

async function quizAnalysis(sessionId, studentId) {
    let session = await sessions
        .findOne({ _id: sessionId, student_id: studentId })
        .populate("quiz_id")
        .populate({
            path: "questions_answers.question",
            populate: { path: "course_outcome_id", model: "course_outcomes" },
        });
    let allSessions = await sessions
        .find({
            quiz_id: session.quiz_id._id,
            student_id: { $ne: studentId },
            start_time: { $lt: session.quiz_id.valid_to },
        })
        .populate("questions_answers.question");

    //ranking
    //formula = sutdents with marks less than equal to current students / total students *100
    let myMarks = 0;
    let totalMarks = session.quiz_id.marks;
    let lessThanStudents = 1;
    let totalStudents = allSessions.length + 1;
    session.questions_answers.forEach((question) => {
        if (
            question.question.answer == question.answer &&
            question.question.type != 3
        ) {
            myMarks += question.question.marks;
        }
    });
    allSessions.forEach((sess) => {
        let otherMarks = 0;
        sess.questions_answers.forEach((question) => {
            if (
                question.question.answer == question.answer &&
                question.question.type != 3
            ) {
                otherMarks += question.question.marks;
            }
        });
        if (otherMarks <= myMarks) {
            lessThanStudents++;
        }
    });
    let betterThan = (lessThanStudents / totalStudents) * 100;
    //you are better than (betterThan)% of students

    let inTop = 100 - betterThan;
    //you are in top (inTop)% of students

    //difficulty wise marks, timeSpent
    let difficulty = new Map();
    difficulty.set("Easy", {
        totalMarks: 0,
        marks: 0,
        timeSpent: 0,
        timeRequired: 0,
    });
    difficulty.set("Medium", {
        totalMarks: 0,
        marks: 0,
        timeSpent: 0,
        timeRequired: 0,
    });
    difficulty.set("Hard", {
        totalMarks: 0,
        marks: 0,
        timeSpent: 0,
        timeRequired: 0,
    });

    session.questions_answers.forEach((element) => {
        let obtMarks = 0;
        if (element.question.answer == element.answer) {
            obtMarks += element.question.marks;
        }
        let myDiff = null;
        if (element.question.difficulty == 1) {
            myDiff = "Easy";
        } else if (element.question.difficulty == 2) {
            myDiff = "Medium";
        } else {
            myDiff = "Hard";
        }
        let tempget = difficulty.get(myDiff);
        difficulty.set(myDiff, {
            totalMarks: tempget.totalMarks + element.question.marks,
            marks: tempget.marks + obtMarks,
            timeSpent: tempget.timeSpent + element.time_spent,
            timeRequired: tempget.timeRequired + element.question.time_required,
        });
    });

    //topic wise
    let topics = new Map();

    session.questions_answers.forEach((element) => {
        let obtMarks = 0;
        if (element.question.answer == element.answer) {
            obtMarks += element.question.marks;
        }

        let tempget = topics.get(element.question.course_outcome_id[0].topic);
        if (tempget) {
            topics.set(element.question.course_outcome_id[0].topic, {
                totalMarks: tempget.totalMarks + element.question.marks,
                marks: tempget.marks + obtMarks,
                timeSpent: tempget.timeSpent + element.time_spent,
                timeRequired:
                    tempget.timeRequired + element.question.time_required,
            });
        } else {
            topics.set(element.question.course_outcome_id[0].topic, {
                totalMarks: element.question.marks,
                marks: obtMarks,
                timeSpent: element.time_spent,
                timeRequired: element.question.time_required,
            });
        }
    });

    return [myMarks, totalMarks, inTop, difficulty, topics];
}

module.exports = {
    loginFetch,
    loginCheck,
    registerStudent,
    forgetPassword,
    quizCheck,
    createSession,
    getQuestion,
    getSession,
    submitQuiz,
    upcomingQuiz,
    availableQuiz,
    otherQuiz,
    getOtherQuizSession,
    history,
    quizHistory,
    quizAnalysis,
};
