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
    let quizData = await studentServices.upcomingQuiz(studentId);
    res.render("./student/upcomingQuiz", { error, quizData });
}
async function availableQuiz(req, res) {
    let error = null;
    let token = req.cookies.auth;
    let studentId = jwt.verify(token, process.env.JWT_SECRET)["_id"];
    let quizData = await studentServices.availableQuiz(studentId);

    res.render("./student/availableQuiz", { error, quizData });
}
async function otherQuiz(req, res) {
    let error = null;
    let token = req.cookies.auth;
    let studentId = jwt.verify(token, process.env.JWT_SECRET)["_id"];
    let quizData = await studentServices.otherQuiz(studentId);

    res.render("./student/otherQuiz", { error, quizData });
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
        req.session.quiz = quizCheck[0];
        req.session.guestFlag= quizCheck[1];
        res.render("./student/instructionPage");
    }
}
async function takeQuiz(req, res) {
    let quizId = req.session.quiz._id;
    let token = req.cookies.auth;
    let student_data = jwt.verify(token, process.env.JWT_SECRET);
    let studentId = student_data["_id"];
    let guest = req.session.guestFlag;
    console.log(quizId);
    if (!quizId) {
        res.redirect("/");
    } else {
        let quiz = req.session.quiz;
        let session = null;
        if (!guest) {
            if (!session) {
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
            if (session.start_time) {
                duration -= (new Date() - session.start_time) / (1000 * 60);
            }
            if (duration <= 0) {
                req.session.errors = { text: "Quiz Expired", icon: "error" };
                res.redirect("/student");
            }
            else if (session.end_time) {
                req.session.errors = { text: "Quiz Already Given", icon: "error" };
                res.redirect("/student");
            } else {
                res.render("./student/quizPage", {
                    questions,
                    enrollment,
                    duration,
                    quizTitle,
                    department,
                    subject,
                });
            }
        }
        else {
            if (!session) {
                session = await studentServices.getOtherQuizSession(
                    studentId,
                    quizId,
                    quiz.valid_to,
                    quiz.duration
                );
            }
            if (!session) {
                session = await studentServices.createSession(quizId, studentId);
            }
            req.session.session = session;
            let questions = session.questions_answers;
            let enrollment = student_data["enrollment"];
            let department = student_data["department"];
            let duration = quiz.duration;
            let quizTitle = quiz.name;
            let subject = quiz.subject_id.name;
            let visible_to=new Date(quiz.visible_to);
            if ((visible_to - Date.now()) / (1000 * 60) < duration) {
                duration = (visible_to - Date.now()) / (1000 * 60);
            }
            if (session.start_time) {
                duration -= (new Date() - session.start_time) / (1000 * 60);
            }
            if (duration <= 0) {
                req.session.errors = { text: "Quiz Expired", icon: "error" };
                res.redirect("/student");
            }
            else if (session.end_time) {
                req.session.errors = { text: "Retry after sometime.", icon: "error" };
                res.redirect("/student");
            } else {
                res.render("./student/quizPage", {
                    questions,
                    enrollment,
                    duration,
                    quizTitle,
                    department,
                    subject,
                });
            }
        
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
    let questionAnswer = req.session.session.questions_answers;
    questionAnswer.forEach(element => {
        questions_answers.forEach(ele => {
            if (ele.questionId == element.question) {
                element.answer = ele.answer;
                element.time_spent = ele.time_spent;
                return;
            }
        })
    })
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

async function history(req, res) {
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let token = req.cookies.auth;
    let student_data = jwt.verify(token, process.env.JWT_SECRET);
    let studentId = student_data["_id"];

    let quizzes = await studentServices.history(studentId);
    
    let stringified=JSON.stringify(quizzes);
    stringified= Buffer.from(JSON.stringify(quizzes)).toString('base64') 
    res.render("./student/history",{errors, quizzes,stringified});

}

async function quizHistory(req, res)
{
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let token = req.cookies.auth;
    let student_data = jwt.verify(token, process.env.JWT_SECRET);
    let studentId = student_data["_id"];
    let sessionId = req.params.sessionId;
    if(sessionId.length < 24)
    {
        res.redirect("/student/history")
    }
    else {
        let questions = await studentServices.quizHistory(studentId,sessionId);
        if(!questions){
            res.redirect("/student/history");
        }
        else {
            res.render("./student/quizHistory",{errors, questions})
        }
    }
}

async function quizAnalysis(req, res) {
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let sessionId = req.params.sessionId;
    let token = req.cookies.auth;
    let studentId = jwt.verify(token, process.env.JWT_SECRET)["_id"];
    let analysis = await studentServices.quizAnalysis(sessionId, studentId);
    if(analysis)
    {
        let [myMarks, totalMarks, inTop, difficulty, topics] = analysis;
        difficulty = Array.from(difficulty);
        topics = Array.from(topics);
        console.log(topics);
        res.render("./student/analysis", {errors, myMarks, totalMarks, inTop, difficulty, topics});
    }
    else {
        res.redirect("/history");
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
    history,
    quizHistory,
    quizAnalysis,
};
