const teachers = require("../models/teachers");
const students = require("../models/students");
const groups = require("../models/groups");
const subjects = require("../models/subjects");
const departments = require("../models/departments");
const courseOutcomes = require("../models/courseOutcomes");
const questions = require("../models/questions");
const { default: mongoose } = require("mongoose");

async function viewGroup(group_id){
    let group = await groups.findOne({_id:group_id}).populate('students',"enrollment");
    return group;
}
async function deptGroup(department, semester)
{
    let student_ids = [];
    let student_id = await students.find({department_id:department,semester:semester},{_id:1});
    student_id.forEach(element=>{
        student_ids.push(element._id);
    })
    let group = await groups.find({students:student_ids});
    if(group.length < 1)
    {
        let new_group = new groups({students:student_ids,is_active:1,name:department+semester,is_shown:0});
        await new_group.save();
    }
}
async function getStudentId(enrollment)
{
    let id = await students.findOne({enrollment:enrollment, is_active:1},{_id:1});
    return id;
}

async function fetchDepartments() {
    var dept_data = await departments.find({ is_active: 1 });
    return dept_data;
}

async function fetchGroups() {
    var group_data = await groups.find({ is_active: 1 , is_shown:1});
    return group_data;
}

async function addGroup(groupName, obj)
{
    let student_ids = [];
    for (let index = 0; index < obj.length; index++) {
        const element = obj[index];
        let id = await getStudentId(element["Enrollment No"]);
        student_ids.push(id._id);
    }
    let group = new groups({is_active:1,name:groupName,students:student_ids, is_shown:1});
    await group.save();
}

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
    return question._id;
}

async function addQuestionFile(questionId, filePath, description)
{
    let question = await questions.findOne({_id:questionId});
    if(question)
    {
        question.files.push({description:description,file:filePath});
        await question.save();
    }
}

module.exports = {loginFetch, loginCheck, addStudent,subjectFetch, addTopic, getTopics, addQuestion, fetchDepartments, fetchGroups, addGroup, deptGroup, viewGroup, addQuestionFile};