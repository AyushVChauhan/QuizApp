const adminServices = require("../services/admin");
async function addDepartment(req, res) {
    let data = await adminServices.newDepartment(req.body.name);
    
        res.redirect("/admin");

}
module.exports = {addDepartment};