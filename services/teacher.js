const teachers = require("../models/teachers");
const students = require("../models/students");
const subjects = require("../models/subjects");
const courseOutcomes = require("../models/courseOutcomes");
const questions = require("../models/questions");
const { default: mongoose } = require("mongoose");


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
    return subData;
}

async function addTopic(topicObject) {
    let topic = new courseOutcomes({course_outcome:topicObject.co,is_active:1,subjectId:new mongoose.Types.ObjectId(topicObject.subject),topic:topicObject.topic});
    await topic.save();
}

async function getTopics(topicObject) {
    console.log(topicObject);
    let topic = await courseOutcomes.find({course_outcome:topicObject.co,is_active:1,subjectId:new mongoose.Types.ObjectId(topicObject.subject)});
    return topic;
}

async function addQuestion(quesobject)
{
    let question = new questions(quesobject);
    await question.save();
}


module.exports = {loginFetch, loginCheck, addStudent,subjectFetch, addTopic, getTopics, addQuestion};