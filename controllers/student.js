const studentServices = require("../services/student");
const jwt = require("jsonwebtoken");
const myCache = require("./cache");

async function login(req, res) {
  let data = await studentServices.loginFetch(
    req.body.username,
    req.body.password
  );
  if (data != null) {
    let token = jwt.sign(
      { username: req.body.username, password: req.body.password, role: 0 },
      process.env.JWT_SECRET
    );
    res.cookie("auth", token);
    res.redirect("/student");
  } else {
    res.redirect("/student/login");
  }
}

async function enrollment_confirmation_page(req, res) {
  res.render("./student/enrollment_confirmation");
}
async function enrollment_check(req, res) {
  let student = await studentServices.registerStudent(req.body.Enrollment);
  if (student) {
    myCache.set("enrollment", student.enrollment, 300);
    res.redirect("/student/register");
  } else {
    res.redirect("/student/enrollmentcheck");
  }
  // let data=JSON.parse(JSON.stringify(studentServices.registerStudent(req.body.Enrollment)));
  // console.log(data)
}

function register_page(req, res) {
    if (myCache.has("enrollment")) {
      let enrollment = myCache.get("enrollment");
    res.render("./student/student_register", { enrollment });
  } else {
    res.redirect("/student/enrollmentcheck");
  }
}

module.exports = {
  login,
  enrollment_confirmation_page,
  enrollment_check,
  register_page,
};
