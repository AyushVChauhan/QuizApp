const adminServices = require("../services/admin");

async function addDepartment(req, res) {
   
    let fetchData = await adminServices.departmentFetch(req.body.name);
    if(fetchData == null){
        let data = await adminServices.newDepartment(req.body.name);
    }
    else{
        console.log("cannot add");
    }
    res.redirect("/admin");
}
module.exports = {addDepartment};