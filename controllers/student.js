const studentServices = require("../services/student");
const jwt = require("jsonwebtoken");
async function login(req, res) {
    let data = await studentServices.loginFetch(req.body.username,req.body.password);
    if(data!=null)
    {
        let token = jwt.sign({username:req.body.username,password:req.body.password,role:0},process.env.JWT_SeCRET);
        res.cookie("auth",token);
        res.redirect("/student");
    }
    else
    {
        res.redirect("/student/login");
    }
}
module.exports = {login};