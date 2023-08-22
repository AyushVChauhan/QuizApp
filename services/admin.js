const departments = require("../models/departments");

async function newDepartment(name) {
    let data = new departments({name:name,is_active:1});
     await data.save();
    return data;
}
module.exports = {newDepartment};
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department 
//Teacher Delete
//Quiz
//Question list only
//Student List