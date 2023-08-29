const teacherServices = require("../services/teacher");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
const myCache = require("./cache");
const { default: mongoose } = require("mongoose");
async function login(req, res) {

  let data = await teacherServices.loginFetch(
    req.body.username,
    req.body.password
  );
  if (data != null) {

    // res.redirect("/teacher");

    let token = jwt.sign(
      {
        username: req.body.username,
        password: req.body.password,
        role: data.role + 1,
      },
      process.env.JWT_SECRET
    );
    res.cookie("auth", token);
    if (data.role === 0) {
      // console.log("login");
      res.redirect("/teacher");
    } else {
      res.redirect("/admin");
    }
  } else {
    res.redirect("/teacher/login");
  }

  // else{
  //   res.redirect("/teacher/login");
  // }  
}
function loginGet(req, res) {
  res.render("teacher/teacher_login");
}
function uploadStudentGet(req, res) {
  res.render("./admin/upload_form", { errors: null });
}
async function uploadStudent(req, res) {
  var mySheet = xlsx.readFile("./public/images/schema.xlsx");
  var sheets = mySheet.SheetNames;
  var obj = xlsx.utils.sheet_to_json(mySheet.Sheets[sheets[0]]);
  if (obj[0]["Enrollment No"] === undefined) {
    res.json({ error: "error" });
  }
  else {
    let excelData = [];
    obj.forEach(async (element) => {
      await adminServices.addStudent(element["Enrollment No"]);
    });
  }
}

function teacherDashboard(req, res) {
  let errors = null;
  res.render("./teacher/teacher_dashboard", { errors });
}
async function addQue_subSelect(req, res) {
  let subData = await teacherServices.subjectFetch();
  res.render("./teacher/addQuestion1", { subData });
}

async function addTopic(req, res) {
  await teacherServices.addTopic(req.body);
  res.redirect("/teacher/addQuestion/topics")
}

async function getTopics(req, res) {
  let data = await teacherServices.getTopics(req.body);
  res.json(data);
}

async function setTopics(req, res) {
  myCache.set("Topics", req.body.selectedTopics);
  res.json({ success: 1 });
}

async function addQue_question(req, res) {
  res.render("./teacher/addQuestion2");
}

async function addQuestion(req, res) {
  let topics = myCache.get("Topics");
  let course_outcome_id = [];
  let options = [];
  topics.forEach(ele => {
    course_outcome_id.push(new mongoose.Types.ObjectId(ele["_id"]));
  })
  req.body.options.forEach(ele => {
    options.push({ option: ele, file: null });
  })
  let question = 
  { 
    course_outcome_id: course_outcome_id, 
    question: req.body.question, 
    marks: req.body.marks, 
    type: req.body.type, 
    difficulty: req.body.difficulty, 
    options: options ,
    answer: req.body.options[req.body.answer - 1],
    is_active:1
  };
  await teacherServices.addQuestion(question);
  res.json({success:1})
}
module.exports = { login, loginGet, uploadStudent, uploadStudentGet, teacherDashboard, addQue_subSelect, addTopic, getTopics, setTopics, addQue_question, addQuestion };
