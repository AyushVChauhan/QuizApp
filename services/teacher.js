const teachers = require("../models/teachers");
const students = require("../models/students");
const subjects = require("../models/subjects");


async function loginFetch(username, password) {
    let data = await teachers.findOne({username:username, password:password});
    return data;
}

async function loginCheck(jwttoken) {
    console.log("hello");
}

async function addStudent(enrollment){
    let preData = await students.findOne({enrollment:enrollment});
    if(!preData)
    {
        let data = new students({enrollment:enrollment});
        await data.save();
    }
}

async function subjectFetch()
{
    let subData=await subjects.find({});
    console.log(subData);
    return subData;
}

module.exports = {loginFetch, loginCheck, addStudent,subjectFetch};