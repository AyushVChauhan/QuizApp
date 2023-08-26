const adminServices = require("../services/admin");
const myCache = require("./cache")
const commonServices = require("../services/common");
const xlsx = require("xlsx")
const mailer = require("./mailer");
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
async function deleteDepartment(req, res) {

    await adminServices.deleteDepartment(req.params.id);
    myCache.set("errors", { text: "Department Deleted Successfully", icon: "success" });
    res.redirect("/admin/departments");
}
async function adminDashboard(req, res) {
    let errors = null
    if (myCache.has('errors')) {
        errors = myCache.take('errors')//take will empty the myCache
        // console.log(errors)
    }
    let dept_data = await adminServices.fetchDepartments()
    res.render("./admin/admin_dashboard", { errors, dept_data });
}

async function addSubject (req, res) {
    let errors = null;
    //to validate
    let sub = await adminServices.addSubject(req.body);
    if(sub === 0)
    {
        myCache.set("errors", { text: "Subject Added Successfully", icon: "success" });
    }
    else
    {
        myCache.set("errors", { text: "Subject Already Exists!", icon: "warning" });
    }
    res.redirect("/admin");
}
async function addTeacher (req, res) {
    let errors = null;
    //to validate
    let teacher = await adminServices.addTeacher(req.body);
    if(teacher === 0)
    {
        myCache.set("errors", { text: "Teacher Added Successfully", icon: "success" });
    }
    else
    {
        myCache.set("errors", { text: "Teacher Already Exists!", icon: "warning" });
    }
    res.redirect("/admin");
}
async function departments(req, res) {
    let errors = null
    if (myCache.has('errors')) {
        errors = myCache.take('errors')//take will empty the myCache
        // console.log(errors)
    }
    let dept_data = await adminServices.fetchDepartments()
    res.render("./admin/departments",{dept_data, errors});
}
async function addStudent(req, res) {
    var mySheet = xlsx.readFile("./public/files/schema.xlsx");
    var sheets = mySheet.SheetNames;
    var obj = xlsx.utils.sheet_to_json(mySheet.Sheets[sheets[0]]);
    if (obj[0]["Enrollment No"] === undefined) {
        myCache.set("errors", { text: "No (Enrollment No) field", icon: "warning" });
        console.log("hell");
    }
    else if(obj[0]["Email"] === undefined)
    {
        myCache.set("errors", { text: "No (Email) field", icon: "warning" });
    }
    else {
        let records = 0;
        for (let index = 0; index < obj.length; index++) {
            const element = obj[index];
            let password = commonServices.randomPassword();
            records += await adminServices.addStudent(element["Enrollment No"], element["Email"], password, req.body.semester, req.body.department );
        }
        myCache.set("errors", { text: `${records} records added`, icon: "success" });
    }
    res.redirect("/admin");
}
async function subjects(req,res)
{
    let sub_data = await adminServices.fetchSubjects();
    let dept_data = await adminServices.fetchDepartments()
    res.render("./admin/subjects", {dept_data, sub_data});
}
async function students(req,res)
{
    let sub_data = await adminServices.fetchSubjects();
    let dept_data = await adminServices.fetchDepartments()
    res.render("./admin/students", {dept_data, sub_data, errors:null});
}
async function teachers(req,res)
{
    let sub_data = await adminServices.fetchSubjects();
    let dept_data = await adminServices.fetchDepartments()
    let teacher_data = await adminServices.fetchTeachers()
    res.render("./admin/teachers", {dept_data, sub_data,teacher_data,errors:null});
}
module.exports = { addDepartment, adminDashboard, addSubject, departments, addStudent, subjects, students,teachers,addTeacher,deleteDepartment };