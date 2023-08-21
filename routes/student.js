const express = require("express");
const router = express.Router();
const studentControllers = require("../controllers/student");
router.post('/login', studentControllers.login)
// router.get('/login', studentControllers.loginGet)
router.get('/',(req,res)=>{
    res.render("./student/student_dashboard");
})
module.exports = router;