const express = require("express");
const router = express.Router();
const studentControllers = require("../controllers/student");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

router.post("/login", studentControllers.login);
router.get('/login', studentControllers.loginPage);
router.get('/forgetPassword', studentControllers.forgetPage);
router.post('/forgetPassword', studentControllers.forgetPassword);
router.get('/upcomingQuiz', studentControllers.upcomingQuiz);

// router.get("/enrollmentcheck", studentControllers.enrollment_confirmation_page);
// router.post("/enrollmentcheck", studentControllers.enrollment_check);
// router.get("/register", studentControllers.register_page);
// router.post("/register", studentControllers.enrollment_check);
// router.use(middleware)
router.get("/",middleware, studentControllers.dashboardPage);
function middleware(req, res, next) {
  let cookie = req.cookies.auth;
  console.log(cookie)
  if (cookie) {
    let data = jwt.verify(cookie, process.env.JWT_SECRET);
    if (data.role === 0) {
      next();
    }
    else {
        res.redirect("/teacher/login");
      }
  } 
  else {
    res.redirect("/teacher/login");
  }
}

module.exports = router;