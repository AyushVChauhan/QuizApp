const adminServices = require("../services/admin");
const myCache = require("./cache")
async function addDepartment(req, res) {
    let data = await adminServices.newDepartment(req.body.name);
    myCache.set("errors", {text:"Department Added Successfully",icon:"success"});
    // myCache.set("errors_icon", "info");
    res.redirect("/admin");

}

async function adminDashboard(req,res){

    let errors=null
    if(myCache.has('errors'))
    {
        
        errors=myCache.take('errors')
        console.log(errors)
    }
    res.render("./admin/admin_dashboard",{errors});

}
module.exports = {addDepartment,adminDashboard};