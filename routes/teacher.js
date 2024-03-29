const express = require("express");
const router = express.Router();
const teacherControllers = require("../controllers/teacher");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const myCache = require("../controllers/cache");
const storage = multer.diskStorage({
	destination: "./public/files",
	filename: (req, file, cb) => {
		cb(null, "schema.xlsx");
	},
});
const upload = multer({ storage: storage });
const questionStorage = multer.diskStorage({
	destination: "./public/files/questions",
	filename: (req, file, cb) => {
		cb(null, Date.now() + ".jpg");
	},
});
const questionUpload = multer({ storage: questionStorage });
router.post("/login", teacherControllers.login);
router.get("/login", teacherControllers.loginGet);
// router.get("/logout", teacherControllers.logout);

router.use(middleware);

router.get("/", teacherControllers.teacherDashboard);
router.post("/addTopic", teacherControllers.addTopic);
router.post("/viewGroup", teacherControllers.viewGroup);
router.get("/addQuestion/topics", teacherControllers.addQue_subSelect);
router.get("/students", teacherControllers.students);
router.get("/subjects", teacherControllers.subjects);


router.get(
	"/addQuestion/question",
	questionMiddleware,
	teacherControllers.addQue_question
);
router.post(
	"/addQuestion/question",
	questionMiddleware,
	teacherControllers.addQuestion
);
router.post(
	"/addQuestion/question/files",
	questionMiddleware,
	questionUpload.array("questionFiles"),
	teacherControllers.addQuestionFiles
);
router.post("/addQuestion/getTopics", teacherControllers.getTopics);
router.post("/addQuestion/setTopics", teacherControllers.setTopics);

router.get("/myQuiz", teacherControllers.myQuizPage);
router.get("/allQuiz", teacherControllers.allQuizPage);
router.post("/myQuiz/getMyQuiz", teacherControllers.getMyQuiz);
router.post("/myQuiz/getAllQuiz", teacherControllers.getAllQuiz);
router.get("/quiz/quizDetails/:quizId", teacherControllers.quizDetails);
router.get("/addQuiz/getGroups", teacherControllers.getGroups);
router.post("/addGroup", upload.single("excel"), teacherControllers.addGroup);
router.get("/addQuiz/setQuiz", teacherControllers.createQuiz);
router.post("/addQuiz/setQuiz", teacherControllers.setQuiz);
router.post("/addQuiz/deptGroup", teacherControllers.deptGroup);
router.post("/addQuiz/setGroup", teacherControllers.setGroup);
router.get("/addQuiz/questions", teacherControllers.addQuizQuestion);
router.post("/addQuiz/setQuestions", teacherControllers.setQuestions);
router.get("/addQuiz/setCompulsaryQuestions", teacherControllers.setCompulsaryQuestions);
router.post("/addQuiz/setCompulsaryQuestions", teacherControllers.setCompulsaryQuestionsPost);

router.get("/questions", teacherControllers.question);
router.post("/addQuestion/getQuestion", teacherControllers.getQuestion);
router.post("/questionDetail", teacherControllers.questionDetail);
// router.post("/addQuestion/topics", teacherControllers.addQue_subSelect);
router.get("/generateReport/:quizId", teacherControllers.generateReport);
router.get("/evaluate/:sessionId", teacherControllers.evaluate)
router.post("/evaluate", teacherControllers.evaluatePost);
function questionMiddleware(req, res, next) {
	if (req.session.topics) {
		next();
	} else {
		res.redirect("/teacher/addQuestion/topics");
	}
}

function middleware(req, res, next) {
	let cookie = req.cookies.auth;
	if (cookie) {
		let data = jwt.verify(cookie, process.env.JWT_SECRET);
		// console.log;
		if (data.role === 1) {
			//console.log("Next");
			next();
		} else {
			res.redirect("/teacher/login");
		}
	} else {
		res.redirect("/teacher/login");
	}
}

module.exports = router;
