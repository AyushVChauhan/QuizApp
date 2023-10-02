const departments = require("../Models/departments");
const students = require("../Models/students");

async function departmentFetch(name) {
    let fetchData = await departments.findOne({name:name});
    return fetchData;
}
async function newDepartment(name) {
    let data = new departments({name:name,is_active:1});
     await data.save();
    return data;
}
async function addStudent(enrollment){
    let preData = await students.findOne({enrollment:enrollment});
    if(!preData)
    {
        let data = new students({enrollment:enrollment});
        await data.save();
    }
}

module.exports = {departmentFetch,newDepartment,addStudent};
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department 
//Teacher Delete
//Quiz
//Question list only
//Student List