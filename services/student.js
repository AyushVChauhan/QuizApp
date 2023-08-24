const students = require("../models/students");

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
module.exports = {loginFetch, loginCheck,registerStudent};