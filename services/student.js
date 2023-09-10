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
                if(element == studentId)
                {
                    flag = 1;
                    return;
                }
            });
            if(flag)
            {
                return quiz;
            }
        } else {
            return 0;
        }
    } 
    return 0;
}

async function createSession(quizId, studentId)
{
    let quiz = await quizzes.findOne({_id:quizId});
    let selectedQuestions = [];
    quiz.marks_questions.forEach(ele=>{
        let flag = 0;
        quiz.compulsary_questions.forEach(compQues=>{
            if(compQues.marks == ele.marks)
            {
                flag++;
                selectedQuestions.push({question:compQues.question,answer:"",marks:0});
            }
        });
        let random_questions = [];
        if(flag < ele.count)
        {
            quiz.random_questions.forEach(randQues=>{
                if(randQues.marks == ele.marks)
                {
                    random_questions.push({question:randQues.question,answer:"",marks:0});
                }
            });
            for (let index = 0; index < ele.count - flag; index++) {
                selectedQuestions.push(random_questions[Math.floor(Math.random() * random_questions.length)]);
            }
        }
    })
    let session = new sessions({quiz_id:quizId,is_active:1,student_id:studentId,start_time:Date.now(),status:0,questions_answers:selectedQuestions});
    await session.save();
    return session;
}

async function getQuestion(questionId) {  
    let question = await questions.findOne({_id:questionId});
    return question;
}

module.exports = {
    loginFetch,
    loginCheck,
    registerStudent,
    forgetPassword,
    quizCheck,
    createSession,
    getQuestion,
};
