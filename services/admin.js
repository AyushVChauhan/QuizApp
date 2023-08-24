const { default: mongoose } = require("mongoose");
const departments = require("../models/departments");
const subjects = require("../models/subjects");
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
        let subject = new subjects({name:subObject.subname,code:subObject.subcode,is_active:1,semester:subObject.semester,course_outcomes:subObject.co,departments:deptids});
        await subject.save();
        return 0;
    }
}
module.exports = { departmentFetch, newDepartment, fetchDepartments, addSubject };
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department
//Teacher Delete
//Quiz
//Question list only
//Student List