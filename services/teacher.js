const teachers = require("../models/teachers");
const students = require("../models/students");
const groups = require("../models/groups");
const subjects = require("../models/subjects");

const departments = require("../models/departments");
const courseOutcomes = require("../models/courseOutcomes");
const questions = require("../models/questions");
const quizzes = require("../models/quizzes");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

async function viewGroup(group_id) {
    let group = await groups
        .findOne({ _id: group_id })
        .populate("students", "enrollment");
    return group;
}
async function deptGroup(department, semester) {
    let group_id = null;
    let student_ids = [];
    let student_id = await students.find(
        { department_id: department, semester: semester },
        { _id: 1 }
    );
    student_id.forEach((element) => {
        student_ids.push(element._id);
    });
    let group = await groups.find({ students: student_ids });
    if (group.length == 0) {
        let new_group = new groups({
            students: student_ids,
            is_active: 1,
            name: department + semester,
            is_shown: 0,
        });
        await new_group.save();
        return new_group._id;
    }
    else
    {
        console.log(group);
        return group[0]._id;
    }

}
async function getStudentId(enrollment) {
    let id = await students.findOne(
        { enrollment: enrollment, is_active: 1 },
        { _id: 1 }
    );
    return id;
}

async function fetchDepartments() {
    var dept_data = await departments.find({ is_active: 1 });
    return dept_data;
}

async function fetchGroups() {
    var group_data = await groups.find({ is_active: 1, is_shown: 1 });
    return group_data;
}

async function addGroup(groupName, obj) {
    let student_ids = [];
    for (let index = 0; index < obj.length; index++) {
        const element = obj[index];
        let id = await getStudentId(element["Enrollment No"]);
        student_ids.push(id._id);
    }
    let group = new groups({
        is_active: 1,
        name: groupName,
        students: student_ids,
        is_shown: 1,
    });
    await group.save();
    return group._id;
}

async function setGroup(group_id, quiz_id)
{
    let quiz = await quizzes.findOne({_id:quiz_id});
    quiz.group_id = new mongoose.Types.ObjectId(group_id);
    await quiz.save();
}


async function loginFetch(username, password) {
    let data = await teachers.findOne({
        username: username,
        password: password,
    });
    return data;
}

async function loginCheck(jwttoken) {
    console.log("hello");
}

async function addStudent(enrollment) {
    let preData = await students.findOne({ enrollment: enrollment });
    if (!preData) {
        let data = new students({ enrollment: enrollment });
        await data.save();
    }
}

async function subjectFetch() {
    let subData = await subjects.find({});
    return subData;
}

async function addTopic(topicObject) {
    let topic = new courseOutcomes({
        course_outcome: topicObject.co,
        is_active: 1,
        subjectId: new mongoose.Types.ObjectId(topicObject.subject),
        topic: topicObject.topic,
    });
    await topic.save();
}

async function getTopics(topicObject) {
    console.log(topicObject);
    let topic = await courseOutcomes.find({
        course_outcome: topicObject.co,
        is_active: 1,
        subjectId: new mongoose.Types.ObjectId(topicObject.subject),
    });
    return topic;
}

async function addQuestion(quesobject) {
    let question = new questions(quesobject);
    await question.save();
    return question._id;
}

async function addQuestionFile(questionId, filePath, description) {
    let question = await questions.findOne({ _id: questionId });
    if (question) {
        question.files.push({ description: description, file: filePath });
        await question.save();
    }
}
async function fetchQuestions() {
    let question_data = await questions.find({});
    return question_data;
}
async function getQuestion(data, id) {
    let questionData = null;
    console.log(data);
    let createdby =
        data.createdby == "All" ? { $exists: true } : id;
    let type = data.type == "All" ? { $exists: true } : data.type;
    let mark = data.mark == "All" ? { $exists: true } : data.mark;
    let topic = data.topic == "All" ? { $exists: true } : { $in: data.topic };

    let co =
        data.co == "All"
            ? { $and: [{ course_outcome: { $exists: true } }] }
            : {
                  $and: [
                      { course_outcome: { $exists: true } },
                      { course_outcome: { $eq: data.co } },
                  ],
              };
    let difficulty =
        data.difficulty == "All" ? { $exists: true } : data.difficulty;
    console.log(co);
    let subjects =
        data.subject == "All"
            ? { $and: [{ subjectId: { $exists: true } }] }
            : {
                  $and: [
                      { subjectId: { $exists: true } },
                      { subjectId: { $eq: data.subject } },
                  ],
              };
    questionData = await questions
        .find({
            course_outcome_id: topic,
            marks: mark,
            created_by: createdby,
            type: type,
            difficulty: difficulty,
            is_active: 1,
        })
        .populate({
            path: "course_outcome_id",
            model: "course_outcomes",
            match: { $and: [subjects, co] },
            populate: {
                path: "subjectId",
                model: "subjects",
                select: "name",
            },
        })
        .populate({
            path: "created_by",
            model: "teachers",
            select: "username",
        });
    return questionData;
}

async function questionDetail(data) {
    let questionDetail = await questions
        .findById(data)
        .populate({
            path: "course_outcome_id",
            model: "course_outcomes",
            populate: {
                path: "subjectId",
                model: "subjects",
            },
        })
        .populate({
            path: "created_by",
            model: "teachers",
            select: "username",
        });
    // console.log(questionDetail);
    return questionDetail;
}
async function getCOs(data) {
    console.log(data);
    let coData = await subjects.findOne({ _id: data });

    return coData;
}

async function setQuiz(data)
{
    let quiz = new quizzes(data);
    await quiz.save();
    return quiz._id;
}

async function setQuestions(data, quizId)
{
    let quiz = await quizzes.findOne({_id:quizId});
    quiz.random_questions = data;
    await quiz.save();
}
async function setCompulsaryQuestionsPost(id,compulsaryQuestions,randomQuestions){
    let quiz = await quizzes.findOne({_id:id});
quiz.compulsary_questions=compulsaryQuestions;
quiz.random_questions=randomQuestions;
await quiz.save()
}
async function getMyQuiz(data,id){

    const nextDate = new Date();
    const date = new Date(data.date);
    nextDate.setTime(date.getTime() + 86400000);
    console.log(date);
    console.log(nextDate);
    let datequery = data.date == "" ? { _id:{$exists: true} } : {$and:[{valid_from:{$gte:date}},{valid_from:{$lte:nextDate}}]};

    let subjectquery = data.subject == "All" ? {subject_id: {$exists: true} } :{subject_id:data.subject};
    let createdbyquery={created_by:id}
    // let quiz=await quizzes.find({$and:[{subject_id:subject},{date}]});
    let quiz=await quizzes.find({$and:[subjectquery,datequery,createdbyquery]});
    return quiz;
}
async function getAllQuiz(data,id){

    const nextDate = new Date();
    const date = new Date(data.date);
    nextDate.setTime(date.getTime() + 86400000);
    console.log(date);
    console.log(nextDate);
    let datequery = data.date == "" ? { _id:{$exists: true} } : {$and:[{valid_from:{$gt:date}},{valid_from:{$lt:nextDate}}]};

    let subjectquery = data.subject == "All" ? {subject_id: {$exists: true} } :{subject_id:data.subject};
    // let quiz=await quizzes.find({$and:[{subject_id:subject},{date}]});
    let quiz=await quizzes.find({$and:[subjectquery,datequery]}).populate("created_by");
    return quiz;
}
async function quizDetails(data){
    let quiz=await quizzes.findOne({_id:data}).populate("random_questions").populate("compulsary_questions").populate("subject_id").populate({
        path: "group_id",
        model: "groups",
        populate: {
            path: "students",
            model: "students",
        },
    });
    return quiz;
}
async function fetchStudents() {
    let student_data = await students.find({ is_active: 1 }).populate("department_id");
    console.log(student_data);
    return student_data;
}

module.exports = {
    loginFetch,
    loginCheck,
    addStudent,
    subjectFetch,
    addTopic,
    getTopics,
    addQuestion,
    fetchDepartments,
    fetchGroups,
    addGroup,
    deptGroup,
    viewGroup,
    addQuestionFile,
    getQuestion,
    fetchQuestions,
    questionDetail,
    getCOs,
    setQuiz,
    setGroup,
    setQuestions,
    setCompulsaryQuestionsPost,
    getMyQuiz,
    quizDetails,
    fetchStudents,
    getAllQuiz,
};
