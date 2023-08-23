const adminServices = require("../services/admin");
const myCache = require("./cache")


async function addDepartment(req, res) {
   
   
    if(req.body.name.trim() !== "")
    {
        let fetchData = await adminServices.departmentFetch(req.body.name);
        if(fetchData == null ){
            let data = await adminServices.newDepartment(req.body.name);
            myCache.set("errors", {text:"Department Added Successfully",icon:"success"});
        }
        else{
            myCache.set("errors", {text:"Department Already Exist!!",icon:"warning"});
        }
    }
   

    res.redirect("/admin");
}
async function adminDashboard(req,res){

    let errors=null
    if(myCache.has('errors'))
    {
        errors=myCache.take('errors')//take will empty the myCache
        // console.log(errors)
    }
    res.render("./admin/admin_dashboard",{errors});

}
module.exports = {addDepartment,adminDashboard};