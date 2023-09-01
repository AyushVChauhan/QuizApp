const students = require("../models/students");
const commonServices = require("../services/common");
const mailer = require("../controllers/mailer");
const md5 = require("md5");



async function loginFetch(username, password) {
    let data = await students.findOne({enrollment:username, password:password});
    return data;
}

async function loginCheck(jwttoken) {
    console.log("hello");
}
async function registerStudent(enrollment){
    var student =await students.findOne({enrollment:enrollment,password:null});
    console.log(student)
    return student;
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function forgetPassword(data){
    var student=await students.findOne({enrollment:data});
    let password=commonServices.randomPassword();
    if (student) {
        let record = 1;
        //send mail
        let mailDetails = {
            from: 'avcthehero@gmail.com',
            to: student.email,
            subject: 'Forget Password',
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
        if(record)
        {
            student.password=md5(password);
            await student.save();
        }
        return record;
    }
    return 2;
    // console.log(student);
}
module.exports = {loginFetch, loginCheck,registerStudent,forgetPassword};