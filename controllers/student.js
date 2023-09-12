const studentServices = require("../services/student");
const jwt = require("jsonwebtoken");
const myCache = require("./cache");
const { default: mongoose } = require("mongoose");

function dashboardPage(req, res) {
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    res.render("./student/student_dashboard", { errors });
}

async function login(req, res) {
    let data = await studentServices.loginFetch(
        req.body.username,
        req.body.password
    );
    if (data != null) {
        req.session.errors = { text: "Logged in", icon: "success" };
        let token = jwt.sign(
            {
                _id: data._id,
                enrollment: data.enrollment,
                department: data.department_id.name,
                role: 0,
            },
            process.env.JWT_SECRET
        );
        res.cookie("auth", token);
        res.redirect("/student");
    } else {
        res.redirect("/student/login");
    }
}
function loginPage(req, res) {
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    console.log(errors);
    res.render("./student/student_login", { errors });
}
function forgetPage(req, res) {
    res.render("./student/forgetPassword");
}
async function forgetPassword(req, res) {
    // res.render("./student/forgetPassword");
    console.log(req.body);
    let suc = await studentServices.forgetPassword(req.body.enrollment);
    console.log(suc);
    if (suc === 1) {
        req.session.errors = {
            text: "Password Changed Successfully",
            icon: "success",
        };
    } else if (suc === 2) {
        req.session.errors = {
            text: "Student Does not Exist!!",
            icon: "error",
        };
    } else {
        req.session.errors = {
            text: "Password has not been Changed",
            icon: "warning",
        };
    }
    res.redirect("/student/login");
}
async function upcomingQuiz(req, res) {
    let error = null;
    //subject,quizData
    let token = req.cookies.auth;
    let studentId = jwt.verify(token, process.env.JWT_SECRET)["_id"];
    console.log(studentId);
    let quizData=await studentServices.upcomingQuiz(studentId);
    res.render("./student/upcomingQuiz", { error ,quizData});
}
async function availableQuiz(req, res) {
    let error = null;

    res.render("./student/availableQuiz", { error });
}
async function otherQuiz(req, res) {
    let error = null;

    res.render("./student/otherQuiz", { error });
}

// async function enrollment_confirmation_page(req, res) {
//   res.render("./student/enrollment_confirmation");
// }
// async function enrollment_check(req, res) {
//   let student = await studentServices.registerStudent(req.body.Enrollment);
//   if (student) {
//     myCache.set("enrollment", student.enrollment, 300);
//     res.redirect("/student/register");
//   } else {
//     res.redirect("/student/enrollmentcheck");
//   }
//   // let data=JSON.parse(JSON.stringify(studentServices.registerStudent(req.body.Enrollment)));
//   // console.log(data)
// }

// function register_page(req, res) {
//     if (myCache.has("enrollment")) {
//       let enrollment = myCache.get("enrollment");
//     res.render("./student/student_register", { enrollment });
//   } else {
//     res.redirect("/student/enrollmentcheck");
//   }
// }
async function instructions(req, res) {
    let quizId = req.params.quizId;
    let token = req.cookies.auth;
    let studentId = jwt.verify(token, process.env.JWT_SECRET)["_id"];
    console.log(studentId);
    let quizCheck = await studentServices.quizCheck(quizId, studentId);
    if (!quizCheck) {
        res.redirect("/");
    } else {
        req.session.quiz = quizCheck;
        res.render("./student/instructionPage");
    }
}
async function takeQuiz(req, res) {
    let quizId = req.session.quiz._id;
    let token = req.cookies.auth;
    let student_data = jwt.verify(token, process.env.JWT_SECRET);
    let studentId = student_data["_id"];
    let guest = 0;
    console.log(quizId);
    if (!quizId) {
        res.redirect("/");
    } else {
        let quiz = req.session.quiz;
        let session = req.session.session;
        if (!guest && !session) {
            session = await studentServices.getSession(
                studentId,
                quizId,
                quiz.valid_to
            );
        }
        if (!session) {
            session = await studentServices.createSession(quizId, studentId);
        }
        req.session.session = session;
        let questions = session.questions_answers;
        let enrollment = student_data["enrollment"];
        let department = student_data["department"];
        let valid_to = new Date(quiz.valid_to);
        let duration = quiz.duration;
        let quizTitle = quiz.name;
        let subject = quiz.subject_id.name;
        // let current_date = new Date();
        // current_date.setTime(current_date.getTime() + 1000*60*30);
        // console.log(current_date.toISOString());
        if ((valid_to - Date.now()) / (1000 * 60) < duration) {
            duration = (valid_to - Date.now()) / (1000 * 60);
        }
        if(session.end_time){
        req.session.errors = { text: "Quiz Already Given", icon: "error" };
        res.redirect("/student");
        }
        else{
            res.render("./student/quizPage", {
                questions,
                enrollment,
                duration,
                quizTitle,
                department,
                subject,
            });
        }
        //questions(session), enrollment(jwt), duration, quiz title, department(jwt), subject
    }
}

async function getQuestion(req, res) {
    let questionId = req.body.questionId;
    if (!req.session.session) {
        res.json({ error: "Invalid Request" });
    } else {
        // console.log(questionId);
        questionId = new mongoose.Types.ObjectId(questionId);

        let question = await studentServices.getQuestion(questionId);

        res.json({ question: question, success: 1 });
    }
}
async function submitQuiz(req, res) {
    let questions_answers = req.body.allQuestions;
    let session = req.session.session._id;
    let questionAnswer = [];
    questions_answers.forEach((element) => {
        questionAnswer.push({
            question: element.questionId,
            marks: 0,
            answer: element.answer,
        });
    });
    let flag = await studentServices.submitQuiz(session, questionAnswer);
    if (flag) {
        req.session.errors = {
            text: "Quiz Submitted Successfully",
            icon: "success",
        };
        res.json({ success: 1 });
    } else {
        req.session.errors = { text: "Quiz Submission failed!", icon: "error" };
        res.json({ error: "Invalid Request" });
    }
}
module.exports = {
    login,
    loginPage,
    forgetPage,
    forgetPassword,
    dashboardPage,
    upcomingQuiz,
    availableQuiz,
    takeQuiz,
    instructions,
    otherQuiz,
    getQuestion,
    submitQuiz,
};
