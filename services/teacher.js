const teachers = require("../models/teachers");

async function loginFetch(username, password) {
    let data = await teachers.findOne({username:username, password:password});
    return data;
}

async function loginCheck(jwttoken) {
    console.log("hello");
}

module.exports = {loginFetch, loginCheck};