const teacherServices = require("../services/teacher");
const jwt = require("jsonwebtoken");
const xlsx = require("xlsx");
async function login(req, res) {
  let data = await teacherServices.loginFetch(
    req.body.username,
    req.body.password
  );
  if (data != null) {
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
      console.log("login");
      res.redirect("/teacher");
    } else {
      res.redirect("/admin");
    }
  } else {
    res.redirect("/teacher/login");
  }
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
  else{
      let excelData = [];
      obj.forEach(async(element) => {
          await adminServices.addStudent(element["Enrollment No"]);
      });
  }
}
module.exports = { login, loginGet, uploadStudent, uploadStudentGet };
