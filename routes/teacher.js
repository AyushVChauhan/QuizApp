const express = require("express");
const router = express.Router();
const teacherControllers = require("../controllers/teacher");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

router.post("/login", teacherControllers.login);
router.get("/login", teacherControllers.loginGet);

router.use(middleware);

router.get("/", (req, res) => {
  res.render("./teacher/teacher_dashboard");
});

function middleware(req, res, next) {
  let cookie = req.cookies.auth;
  if (cookie) {
    let data = jwt.verify(cookie, process.env.JWT_SECRET);
    console.log
    if (data.role === 1) {
      console.log("Next");
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
