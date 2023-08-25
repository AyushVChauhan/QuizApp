const { default: mongoose } = require("mongoose");
const departments = require("../models/departments");
const subjects = require("../models/subjects");
const students = require("../models/students");
const mailer = require("../controllers/mailer");
const md5 = require("md5");
async function departmentFetch(name) {
    let fetchData = await departments.findOne({ name: name });
    return fetchData;
}
async function newDepartment(name) {
    let data = new departments({ name: name, is_active: 1 });
    await data.save();
    return data;
}
async function fetchDepartments() {
    var dept_data = await departments.find({ is_active: 1 });
    return dept_data;
}
async function addSubject(subObject) {
    let subjectData = await subjects.findOne({code:subObject.subcode});
    if(subjectData)
    {
        return 1;
    }
    else
    {
        let deptids = [];
        subObject.departments.forEach(element => {
            deptids.push(new mongoose.Types.ObjectId(element));
        });
        console.log(subObject);
        let subject = new subjects({name:subObject.subname,code:subObject.subcode,is_active:1,semester:subObject.sem,course_outcomes:subObject.co,departments:deptids});
        await subject.save();
        return 0;
    }
}
async function addStudent(enrollment, email, password){
    let preData = await students.findOne({enrollment:enrollment});
    if(!preData)
    {
        let record = 1;
        //send mail
        let mailDetails = {
            from: 'avcthehero@gmail.com',
            to: email,
            subject: 'Registration',
            text: `Your Username is ${enrollment} and Password is ${password}`,
        };
        mailer.sendMail(mailDetails,async function(err, data) {
            if(err) {
                console.log('Error Occurs');
                record = 0;
            } else {
                console.log('Email sent successfully');
                let data = new students({enrollment:enrollment, email:email, password:md5(password)});
                await data.save();
            }
        });
        return record;
    }
    return 0;
}
async function fetchSubjects() {
    let sub_data = await subjects.find({});
    return sub_data;
}
module.exports = { departmentFetch, newDepartment, fetchDepartments, addSubject, addStudent, fetchSubjects };
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department
//Teacher Delete
//Quiz
//Question list only
//Student List