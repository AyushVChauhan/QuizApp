const students = require("../models/students");

async function loginFetch(username, password) {
    let data = await students.findOne({enrollment:username, password:password});
    return data;
}

async function loginCheck(jwttoken) {
    console.log("hello");
}

module.exports = {loginFetch, loginCheck};