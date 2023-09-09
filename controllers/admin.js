const adminServices = require("../services/admin");
const myCache = require("./cache")
const commonServices = require("../services/common");
const xlsx = require("xlsx")
const mailer = require("./mailer");
async function adminDashboard(req, res) {
    let errors = null;

    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let department_count = await adminServices.countDepartments()
    let teacher_count = await adminServices.countTeachers()
    let subject_count = await adminServices.countSubjects()
    let student_count = await adminServices.countStudents()
    let quiz_count = await adminServices.countQuizzes()
    res.render("./admin/admin_dashboard", { errors, department_count,teacher_count, subject_count, student_count,quiz_count});
}
async function addDepartment(req, res) {

    if (req.body.name.trim() !== "") {
        let fetchData = await adminServices.departmentFetch(req.body.name);
        if (fetchData == null) {
            let data = await adminServices.newDepartment(req.body.name);
            req.session.errors = { text: "Department Added Successfully", icon: "success" };
        }
        else {
            req.session.errors = { text: "Department Already Exist!!", icon: "warning" };
        }
    }
    res.redirect("/admin");
}
async function deleteDepartment(req, res) {

    await adminServices.deleteDepartment(req.params.id);
    req.session.errors = { text: "Department Deleted Successfully", icon: "success" };
    res.redirect("/admin/departments");
}

async function addSubject (req, res) {
    let errors = null;
    //to validate
    let sub = await adminServices.addSubject(req.body);
    if(sub === 0)
    {
        req.session.errors = { text: "Subject Added Successfully", icon: "success" };
    }
    else
    {
        req.session.errors = { text: "Subject Already Exists!", icon: "warning" };
    }
    res.redirect("/admin");
}
async function addTeacher (req, res) {
    let errors = null;
    //to validate
    let teacher = await adminServices.addTeacher(req.body);
    if(teacher === 0)
    {
        req.session.errors = { text: "Teacher Added Successfully", icon: "success" };
    }
    else
    {
        req.session.errors = { text: "Teacher Already Exists!", icon: "warning" };
    }
    res.redirect("/admin");
}
async function departments(req, res) {
    let errors = null
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let dept_data = await adminServices.fetchDepartments()
    res.render("./admin/departments",{dept_data, errors});
}
async function addStudent(req, res) {
    var mySheet = xlsx.readFile("./public/files/schema.xlsx");
    var sheets = mySheet.SheetNames;
    var obj = xlsx.utils.sheet_to_json(mySheet.Sheets[sheets[0]]);
    if (obj[0]["Enrollment No"] === undefined) {
        req.session.errors = { text: "No (Enrollment No) field", icon: "warning" };
    }
    else if(obj[0]["Email"] === undefined)
    {
        req.session.errors = { text: "No (Email) field", icon: "warning" };
    }
    else {
        let records = 0;
        for (let index = 0; index < obj.length; index++) {
            const element = obj[index];
            let password = commonServices.randomPassword();
            records += await adminServices.addStudent(element["Enrollment No"], element["Email"], password, req.body.semester, req.body.department );
        }
        req.session.errors = { text: `${records} records added`, icon: "success" };
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
    let dept_data = await adminServices.fetchDepartments();
    console.log(dept_data);
    let student_data = await adminServices.fetchStudents();
    res.render("./admin/students", {dept_data, sub_data,student_data, errors:null});
}
async function teachers(req,res)

{
    let sub_data = await adminServices.fetchSubjects();
    let dept_data = await adminServices.fetchDepartments()
    let teacher_data = await adminServices.fetchTeachers()
    res.render("./admin/teachers", {dept_data, sub_data,teacher_data,errors:null});
}
async function getSubject(req, res) {
    
    let subData = await adminServices.getSubject(req.body);

    res.json({ success: 1, subData });
}
async function getStudent(req, res) {
    
    let studentData = await adminServices.getStudent(req.body);

    res.json({ success: 1, studentData });
}
async function getTeacher(req, res) {
    
    let teacherData = await adminServices.getTeacher(req.body);

    res.json({ success: 1,teacherData });
}
async function quiz(req,res){
    let errors = null
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let subData = await adminServices.fetchSubjects();
    res.render("./admin/quiz",{subData,errors
    });
}
async function getQuiz(req,res){
    console.log(req.body);
   
    let quizData= await adminServices.getQuiz(req.body);
    res.json({success:1,quizData:quizData})
}
async function quizDetails(req,res){
    // console.log(req.params.quizId);
    let errors = null;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    let quiz=await adminServices.quizDetails(req.params.quizId);
    res.render("./admin/quizDetails",{quiz:quiz,errors:errors});
}
module.exports = { addDepartment, adminDashboard, addSubject, departments, addStudent, subjects, students,teachers,addTeacher,deleteDepartment,getSubject,getStudent,getTeacher,quiz,getQuiz,quizDetails};