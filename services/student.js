const students = require("../models/students");
const quizzes = require("../models/quizzes");
const commonServices = require("../services/common");
const mailer = require("../controllers/mailer");
const md5 = require("md5");

async function loginFetch(username, password) {
    let data = await students.findOne({
        enrollment: username,
        password: password,
    });
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
                console.log(err);
                record = 0;
            } else {
                console.log(`${enrollment} : SENT`);
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
    let quiz = await quizzes.findOne({ _id: quizId }).populate("group_id");
    if (quiz) {
        let current_date = Date.now();
        if (quiz.valid_to > current_date && quiz.valid_from < current_date) {
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
                return 1;
            }
        } else {
            return 0;
        }
    } 
    return 0;
}
module.exports = {
    loginFetch,
    loginCheck,
    registerStudent,
    forgetPassword,
    quizCheck,
};
