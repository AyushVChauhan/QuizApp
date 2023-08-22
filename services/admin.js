const adminServices = require("../services/admin");
async function addDepartment(req, res) {
    let data = await adminServices.newDepartment(req.body.name);
   
    // if(data!=null)
    // {
    //     let token = jwt.sign({username:req.body.username,password:req.body.password,role:0},process.env.JWT_SeCRET);
    //     res.cookie("auth",token);
    //     res.redirect("/student");
    // }
    
    
        res.redirect("/admin");

}
module.exports = {addDepartment};
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department 
//Teacher Delete
//Quiz
//Question list only
//Student List