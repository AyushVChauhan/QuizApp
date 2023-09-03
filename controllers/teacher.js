const teacherServices = require("../services/teacher");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const xlsx = require("xlsx");
const myCache = require("./cache");
const { default: mongoose } = require("mongoose");
async function viewGroup(req, res){
	let students = await teacherServices.viewGroup(req.body.group);
	res.json(students.students);
}
async function login(req, res) {

	let data = await teacherServices.loginFetch(
		req.body.username,
		req.body.password
	);
	if (data != null) {
		// res.redirect("/teacher");
		console.log(data.id);
		let token = jwt.sign(
			{
				username: req.body.username,
				password: req.body.password,
				id:data._id,
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
	} else {
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
	res.redirect("/teacher/addQuestion/topics");
}

async function getTopics(req, res) {
	let data = await teacherServices.getTopics(req.body);
	res.json(data);
}

async function setTopics(req, res) {
	req.session.topics = req.body.selectedTopics;
	res.json({ success: 1 });
}

async function addQue_question(req, res) {
	res.render("./teacher/addQuestion2");
}

async function addQuestion(req, res) {
	let topics = req.session.topics;
	let course_outcome_id = [];
	let options = [];
    let cookie = req.cookies.auth;
	let data = jwt.verify(cookie, process.env.JWT_SECRET);
	topics.forEach((ele) => {
		course_outcome_id.push(new mongoose.Types.ObjectId(ele["_id"]));
	});
	req.body.options.forEach((ele) => {
		options.push({ option: ele, file: null });
	});
	console.log(data.id);
	let question = {
		course_outcome_id: course_outcome_id,
		question: req.body.question,
		marks: req.body.marks,
		type: req.body.type,
		difficulty: req.body.difficulty,
		options: options,
		answer: req.body.options[req.body.answer - 1],
		is_active: 1,
		created_by:data.id
	};
	let questionId = await teacherServices.addQuestion(question);
	console.log(questionId);
	res.json({ success: 1, questionId: questionId});
}

async function addQuestionFiles(req, res){

	for (let index = 0; index < req.files.length; index++) {
		const element = req.files[index];
		let filePath = element.destination + element.filename;
		let description = element.originalname;
		await teacherServices.addQuestionFile(req.body.questionId,filePath,description);
	}
	res.json({success:1});
}

async function getGroups(req, res) {
	let dept_data = await teacherServices.fetchDepartments();
	let group_data = await teacherServices.fetchGroups();
	res.render("./teacher/addQuiz2", {
		dept_data: dept_data,
		group_data: group_data,
	});
}

async function addGroup(req, res) {
	let mySheet = xlsx.readFile("./public/files/schema.xlsx");
	let sheets = mySheet.SheetNames;
	let obj = xlsx.utils.sheet_to_json(mySheet.Sheets[sheets[0]]);
	if (obj[0]["Enrollment No"] === undefined) {
		req.session.errors = {
			text: "No (Enrollment No) field",
			icon: "warning",
		};
	} else {
		let group = await teacherServices.addGroup(req.body.group, obj);
		if (group === 1) {
			req.session.errors = {
				text: `Group Created Successfully`,
				icon: "success",
			};
		} else {
			req.session.errors = {
				text: "File Error",
				icon: "error",
			};
		}
	}
	res.redirect("/teacher");
}
async function deptGroup(req, res) {
	await teacherServices.deptGroup(req.body.department, req.body.semester);
}
async function createQuiz(req, res) {
    let subData = await teacherServices.subjectFetch();
    res.render("./teacher/addQuiz1", { subData });
}
async function setQuiz(req, res) {
	req.session.quiz = req.body;
    console.log(req.body);
    res.json({ success: 1 });
}
async function question(req,res){
	
	let subData = await teacherServices.subjectFetch();
	
    res.render("./teacher/question1", {subData});
}
async function getQuestion(req,res){
	let cookie = req.cookies.auth;
	let data = jwt.verify(cookie, process.env.JWT_SECRET);
	let questionData= await teacherServices.getQuestion(req.body,data.id);
	
	res.json({success:1,questionData});
}

async function questionDetail(req,res){
	let questionDetail=await teacherServices.questionDetail(req.body.id);
	res.json({success:1,questionDetail});

}

module.exports = {
	login,
	loginGet,
	uploadStudent,
	uploadStudentGet,
	teacherDashboard,
	addQue_subSelect,
	addTopic,
	getTopics,
	setTopics,
	addQue_question,
	addQuestion,
	getGroups,
	addGroup,
	deptGroup,
	viewGroup,
	createQuiz,
	setQuiz,
	addQuestionFiles,question,getQuestion,questionDetail
};
