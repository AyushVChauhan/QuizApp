const studentServices = require("../services/student");
const jwt = require("jsonwebtoken");
const myCache = require("./cache");

function dashboardPage(req, res) {
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    res.render("./student/student_dashboard", { errors });
}

async function login(req, res) {
    let data = await studentServices.loginFetch(
        req.body.username,
        req.body.password
    );
    if (data != null) {
        req.session.errors = { text: "Logged in", icon: "success" };
        let token = jwt.sign(
            {
                username: req.body.username,
                password: req.body.password,
                role: 0,
            },
            process.env.JWT_SECRET
        );
        res.cookie("auth", token);
        res.redirect("/student");
    } else {
        res.redirect("/student/login");
    }
}
function loginPage(req, res) {
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    console.log(errors);
    res.render("./student/student_login", { errors });
}
function forgetPage(req, res) {
    res.render("./student/forgetPassword");
}
async function forgetPassword(req, res) {
    // res.render("./student/forgetPassword");
    console.log(req.body);
    let suc = await studentServices.forgetPassword(req.body.enrollment);
    console.log(suc);
    if (suc === 1) {
        req.session.errors = {
            text: "Password Changed Successfully",
            icon: "success",
        };
    } else if (suc === 2) {
        req.session.errors = {
            text: "Student Does not Exist!!",
            icon: "error",
        };
    } else {
        req.session.errors = {
            text: "Password has not been Changed",
            icon: "warning",
        };
    }
    res.redirect("/student/login");
}

// async function enrollment_confirmation_page(req, res) {
//   res.render("./student/enrollment_confirmation");
// }
// async function enrollment_check(req, res) {
//   let student = await studentServices.registerStudent(req.body.Enrollment);
//   if (student) {
//     myCache.set("enrollment", student.enrollment, 300);
//     res.redirect("/student/register");
//   } else {
//     res.redirect("/student/enrollmentcheck");
//   }
//   // let data=JSON.parse(JSON.stringify(studentServices.registerStudent(req.body.Enrollment)));
//   // console.log(data)
// }

// function register_page(req, res) {
//     if (myCache.has("enrollment")) {
//       let enrollment = myCache.get("enrollment");
//     res.render("./student/student_register", { enrollment });
//   } else {
//     res.redirect("/student/enrollmentcheck");
//   }
// }

module.exports = {
    login,
    loginPage,
    forgetPage,
    forgetPassword,
    dashboardPage,
};
