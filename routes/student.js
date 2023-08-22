const express = require("express");
const router = express.Router();
const studentControllers = require("../controllers/student");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

router.post("/login", studentControllers.login);
// router.get('/login', studentControllers.loginGet)
router.use(middleware)
router.get("/", (req, res) => {
  res.render("./student/student_dashboard");
});
module.exports = router;
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
