const adminServices = require("../services/admin");
const myCache = require("./cache")
const xlsx = require("xlsx");

async function addDepartment(req, res) {


    if (req.body.name.trim() !== "") {
        let fetchData = await adminServices.departmentFetch(req.body.name);
        if (fetchData == null) {
            let data = await adminServices.newDepartment(req.body.name);
            myCache.set("errors", { text: "Department Added Successfully", icon: "success" });
        }
        else {
            myCache.set("errors", { text: "Department Already Exist!!", icon: "warning" });
        }
    }


    res.redirect("/admin");
}
async function adminDashboard(req, res) {

    let errors = null
    if (myCache.has('errors')) {
        errors = myCache.take('errors')//take will empty the myCache
        // console.log(errors)
    }
    res.render("./admin/admin_dashboard", { errors });
}
function uploadStudentGet(req, res) {
    res.render("./admin/upload_form", { errors: null });
}
async function uploadStudent(req, res) {
    var mySheet = xlsx.readFile("./public/images/schema.xlsx");
    var sheets = mySheet.SheetNames;
    var obj = xlsx.utils.sheet_to_json(mySheet.Sheets[sheets[0]]);
    if (obj[0]["Enrollment No"] === undefined) {
        res.json({ error: "no 'Enrollment No' field" });
    }
    else{
        let excelData = [];
        obj.forEach(async(element) => {
            await adminServices.addStudent(element["Enrollment No"]);
        });
    }
    res.json({errors:"none"});
}
module.exports = { addDepartment, adminDashboard, uploadStudent, uploadStudentGet };