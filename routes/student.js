const express = require("express");
const router = express.Router();
const studentControllers = require("../controllers/student");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

router.post("/login", studentControllers.login);
router.get('/login', studentControllers.loginPage);
router.get('/forgetPassword', studentControllers.forgetPage);
router.post('/forgetPassword', studentControllers.forgetPassword);
router.use(middleware)

router.get('/upcomingQuiz', studentControllers.upcomingQuiz);
router.get('/availableQuiz', studentControllers.availableQuiz);
router.get('/otherQuiz', studentControllers.otherQuiz);

router.get("/history", studentControllers.history);
router.get("/history/:sessionId", studentControllers.quizHistory);
router.get("/analysis/:sessionId", studentControllers.quizAnalysis);
// router.get("/enrollmentcheck", studentControllers.enrollment_confirmation_page);
// router.post("/enrollmentcheck", studentControllers.enrollment_check);
// router.get("/register", studentControllers.register_page);
// router.post("/register", studentControllers.enrollment_check);
router.get("/instructions/:quizId", studentControllers.instructions);
router.get("/takeQuiz",studentControllers.takeQuiz);
router.post("/getQuestion",studentControllers.getQuestion);
router.post("/submitQuiz",studentControllers.submitQuiz);
router.get("/", studentControllers.dashboardPage);
function middleware(req, res, next) {
  let cookie = req.cookies.auth;
  if (cookie) {
    let data = jwt.verify(cookie, process.env.JWT_SECRET);
    if (data.role === 0) {
      next();
    }
    else {
        res.redirect("/student/login");
      }
  } 
  else {
    res.redirect("/student/login");
  }
}

module.exports = router;