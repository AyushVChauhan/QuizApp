const express = require("express");
const router = express.Router();
const teacherControllers = require("../controllers/teacher");
router.post('/login', teacherControllers.login)
router.get('/login', teacherControllers.loginGet)
router.get('/',(req,res)=>{
    res.render("./teacher/teacher_dashboard");
})
module.exports = router;