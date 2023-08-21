const teacherServices = require("../services/teacher");
const jwt = require("jsonwebtoken");
async function login(req, res) {
    let data = await teacherServices.loginFetch(req.body.username,req.body.password);
    if(data!=null)
    {
        let token = jwt.sign({username:req.body.username,password:req.body.password,role:data.role+1},process.env.JWT_SeCRET);
        res.cookie("auth",token);
        if(data.role === 1)
        {
            res.redirect("/admin");
        }
        else
        {
            res.redirect("/teacher");
        }
    }
    else
    {
        res.redirect("/teacher/login");
    }
}
function loginGet(req,res) {
    res.render("teacher/teacher_login");
}
module.exports = {login, loginGet};