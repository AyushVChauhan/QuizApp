require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
// const teachers = require("./Models/teachers");
// const departments = require("./Models/departments");
// const subjects = require("./Models/subjects");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require("express-session");
["log", "warn", "error"].forEach((methodName) => {
	const originalMethod = console[methodName];
	console[methodName] = (...args) => {
		let initiator = "unknown place";
		try {
			throw new Error();
		} catch (e) {
			if (typeof e.stack === "string") {
				let isFirst = true;
				for (const line of e.stack.split("\n")) {
					const matches = line.match(/^\s+at\s+(.*)/);
					if (matches) {
						if (!isFirst) {
							// first line - current function
							// second line - caller (what we are looking for)
							initiator = matches[1];
							break;
						}
						isFirst = false;
					}
				}
			}
		}
		originalMethod.apply(console, [...args, "\n", `  at ${initiator}`]);
	};
});
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: process.env.JWT_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

app.get("/", (req, res) => {
	let cookie = req.cookies.auth;
	if (cookie) {
		let data = jwt.verify(cookie, process.env.JWT_SECRET);
		if (data.role === 0) {
			res.redirect("/student");
		} else if (data.role === 1) {
			res.redirect("/teacher");
		} else if (data.role === 2) {
			res.redirect("/admin");
		}
	} else {
		res.redirect("/student/login");
	}
});
const studentRoutes = require("./routes/student");
app.use("/student", studentRoutes);
const teacherRoutes = require("./routes/teacher");
app.use("/teacher", teacherRoutes);
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

app.get("/logout", (req, res) => {
	res.clearCookie("auth");
	res.redirect("/");
})

app.get("*", (req, res) => {
	res.render("./partials/errorPage");
})
mongoose.connect(process.env.MONGODB_URI).then(() => {
	app.listen(process.env.PORT, () => {
		console.log("http://localhost:3000");
	});
});

// run1();
// async function run1(){
// const subject = await subjects.find().populate('departments');
// console.log(subject[0].departments);
//     const teacher = new models({
//         email:"avcthehero@gmail.com",department_id:null,subjects:null,first_name:"admin",is_active:1,last_name:"admin",middle_name:"admin",password:"1bbd886460827015e5d605ed44252251",phone:"8200125511",role:0,username:"admin"
//     });
// const teacher = new models({
//     email:"avcthehero@gmail.com",department_id:null,subjects:null,first_name:"admin",is_active:1,last_name:"admin",middle_name:"admin",password:"1bbd886460827015e5d605ed44252251",phone:"8200125511",role:1,username:"admin"
// });
// await teacher.save();
// const subject = new models.subjectsModel({code:"3140701",course_outcomes:2,name:"OOP",semester:4});
// await subject.save();
// const subject = await models.subjectsModel.find();
// const course_outcome = new models.courseOutcomesModel({course_outcome:1,subjectId:"64e07b6703eed82939d94a68",topic:"1st topic"});
// course_outcome.save();
// const course_outcome = await models.courseOutcomesModel.where().populate("subjectId");
// const question = new models.questionsModel({type:1,marks:1,question:"Good or bad",course_outcome_id:"64e07c5eb175c96be8c940af",difficulty:1,answer:"yes",options:[{option:"yes",file:null},{option:"no",file:null}],files:null});
// await question.save();

//deep populate
// let questions= await models.questionsModel.find().populate({path:"course_outcome_id",populate:{
//     path:"subjectId",model:"subjects"
// }});
// const questions = await models.subjectsModel.findOne({_id:"64e07b44c4b95e6242fcb109"});
// questions.name = "abc";
// await questions.save();
// console.log(questions);
// }
