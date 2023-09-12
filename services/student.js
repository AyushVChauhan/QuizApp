const students = require("../models/students");
const quizzes = require("../models/quizzes");
const questions = require("../models/questions");
const sessions = require("../models/sessions");
const commonServices = require("../services/common");
const mailer = require("../controllers/mailer");
const md5 = require("md5");
const { default: mongoose } = require("mongoose");

async function loginFetch(username, password) {
    let data = await students.findOne({
        enrollment: username,
        password: password,
    }).populate('department_id');
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
    let quiz = await quizzes.findOne({ _id: quizId }).populate("group_id").populate('subject_id');
    if (quiz) {
        let current_date = new Date();
        // console.log(current_date.toLocaleString());
        let valid_to = new Date(quiz.valid_to);
        // console.log(valid_to.toLocaleString());

        // console.log(valid_to - current_date);
        if (quiz.valid_to > current_date && quiz.valid_from < current_date) {
            console.log(quiz.valid_to - current_date);
            let flag = 0;
            quiz.group_id.students.forEach(element => {
                if (element == studentId) {
                    flag = 1;
                    return;
                }
            });
            if (flag) {
                return quiz;
            }
        } else {
            return 0;
        }
    }
    return 0;
}

async function createSession(quizId, studentId) {
    let quiz = await quizzes.findOne({ _id: quizId });
    let selectedQuestions = [];
    quiz.marks_questions.forEach(ele => {
        let flag = 0;
        quiz.compulsary_questions.forEach(compQues => {
            if (compQues.marks == ele.marks) {
                flag++;
                selectedQuestions.push({ question: compQues.question, answer: "", marks: 0 });
            }
        });
        let random_questions = [];
        if (flag < ele.count) {
            quiz.random_questions.forEach(randQues => {
                if (randQues.marks == ele.marks) {
                    random_questions.push({ question: randQues.question, answer: "", marks: 0 });
                }
            });
            for (let index = 0; index < ele.count - flag; index++) {
                let temp = Math.floor(Math.random() * random_questions.length)
                selectedQuestions.push(random_questions[temp]);
                random_questions.splice(temp, 1);
            }
        }
    })
    let session = new sessions({ quiz_id: quizId, is_active: 1, student_id: studentId, start_time: Date.now(), status: 0, questions_answers: selectedQuestions });
    await session.save();
    return session;
}

async function getQuestion(questionId) {
    let question = await questions.findOne({ _id: questionId });
    return question;
}

async function getSession(studentId, quizId, validTo) {
    let session = await sessions.findOne({ student_id: studentId, quiz_id: quizId, start_time: { $lt: validTo } });
    return session;
}
async function submitQuiz(sessionId, questionAnswer) {
    let session = await sessions.findOne({ _id: sessionId });
    if (session) {
        let quiz = await quizzes.findOne({_id: session.quiz_id}, {duration:1});
        session.questions_answers = questionAnswer;
        session.end_time = new Date();
        if((session.end_time - session.start_time) < (quiz.duration*60 + 10)*1000)
        {
            await session.save();
        }
        else{
            return 0;
        }
        return 1;
    }
    return 0;
}
async function upcomingQuiz(studentId) {
    let quizData = await quizzes.find({ is_active: 1 }).populate({
        path: "group_id",
        model: "groups",
        match: { students: { $in: [studentId] } },
    }).populate('subject_id');
    // console.log(studentId);
    let current_date = new Date();
    // current_date=current_date.toUTCString();
    // console.log(current_date);
    for (let index = 0; index < quizData.length; index++) {
        const element = quizData[index];
        // console.log(element.visible_from);
        if ((element.visible_from <= current_date) && (current_date <= element.valid_from)) {
        }
        else {
            quizData.splice(index, 1);
            index--;
        }
    }
    // console.log(quizData);
    return quizData;
}
async function availableQuiz(studentId) {
    let quizData = await quizzes.find({ is_active: 1 }).populate({
        path: "group_id",
        model: "groups",
        match: { students: { $in: [studentId] } },
    }).populate('subject_id');
    let current_date = new Date();
    console.log(current_date);
    console.log(quizData);
   
    for (let index = 0; index < quizData.length; index++) {
        const element = quizData[index];
        console.log(element.valid_from);
        console.log(element.valid_to);
        if ((element.valid_from <= current_date) && (current_date <= element.valid_to)) {
           console.log("hii");
        }
        else {
            quizData.splice(index, 1);
            index--;
        }
    }
    console.log(quizData);
    return quizData;
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
    submitQuiz, upcomingQuiz,
    availableQuiz
};
