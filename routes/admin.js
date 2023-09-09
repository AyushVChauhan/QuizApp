const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./public/files",
    filename: (req, file, cb) => {
        cb(null, "schema.xlsx");
    },
});
const upload = multer({ storage: storage, limits: { fileSize: 15000000 } });

router.use(middleware);
router.get("/", adminControllers.adminDashboard);
router.post("/addDepartment", adminControllers.addDepartment);
router.get("/departments/delete/:id", adminControllers.deleteDepartment);
router.get("/departments", adminControllers.departments);
router.post("/addSubject", adminControllers.addSubject);
router.get("/subjects", adminControllers.subjects);
router.post("/addStudent", upload.single("excel"), adminControllers.addStudent);
router.get("/students", adminControllers.students);
router.get("/quiz", adminControllers.quiz);
router.post("/getQuiz", adminControllers.getQuiz);
router.get("/quiz/quizDetails/:quizId",adminControllers.quizDetails);


router.post("/addTeacher", adminControllers.addTeacher);
router.get("/teachers", adminControllers.teachers);
router.post("/getSubject", adminControllers.getSubject);

router.post("/getStudent", adminControllers.getStudent);
router.post("/getTeacher", adminControllers.getTeacher);


//move middleware above get() afterwards
function middleware(req, res, next) {
    let cookie = req.cookies.auth;
    if (cookie) {
        let data = jwt.verify(cookie, process.env.JWT_SECRET);
        if (data.role === 2) {
            console.log("Next");
            next();
        } else {
            res.redirect("/teacher/login");
        }
    }
}

module.exports = router;
