const { default: mongoose } = require("mongoose");
const departments = require("../models/departments");
const subjects = require("../models/subjects");
const teachers = require("../models/teachers");
const students = require("../models/students");
const quizzes = require("../models/quizzes");
const mailer = require("../controllers/mailer");
const md5 = require("md5");

/* ------ DEPARTMENT ------- */
async function departmentFetch(name) {
    let fetchData = await departments.findOne({ name: name });
    return fetchData;
}
async function newDepartment(name) {
    let data = new departments({ name: name, is_active: 1 });
    await data.save();
    return data;
}
async function deleteDepartment(id) {
    let data = await departments.findOne({_id: new mongoose.Types.ObjectId(id)});
    data.is_active=0;
    await data.save();
    return data;
}
async function fetchDepartments() {
    var dept_data = await departments.find({ is_active: 1 });
    return dept_data;
}
async function countDepartments() {
    let department_count = await departments.count({ is_active: 1 });
    // console.log(teacher_count);
    return department_count;
}

/* ------ SUBJECT ------- */
async function addSubject(subObject) {
    let subjectData = await subjects.findOne({ code: subObject.subcode });
    if (subjectData) {
        return 1;
    }
    else {
        let deptids = [];
        subObject.departments.forEach(element => {
            deptids.push(new mongoose.Types.ObjectId(element));
        });
        console.log(subObject);
        let subject = new subjects({ name: subObject.subname, code: subObject.subcode, is_active: 1, semester: subObject.semester, course_outcomes: subObject.co, departments: deptids });
        await subject.save();
        return 0;
    }
}
async function fetchSubjects() {
    let sub_data = await subjects.find({});
    return sub_data;
}
async function countSubjects() {
    let subject_count = await subjects.count({ is_active: 1 });
    // console.log(teacher_count);
    return subject_count;
}

/* ------ TEACHER ------- */
async function addTeacher(teacherObject) {
    let teacherData = await teachers.findOne({ username:teacherObject.username });
    if (teacherData) {
        return 1;
    }
    else {
        
        let teacher = new teachers({ username: teacherObject.username, first_name: teacherObject.firstname, is_active: 1, middle_name: teacherObject.middlename, last_name: teacherObject.lastname, department_id: new mongoose.Types.ObjectId(teacherObject.department),email: teacherObject.email,password: teacherObject.password,role:0 });
        await teacher.save();
        return 0;
    }
}
async function fetchTeachers() {
    let teacher_data = await teachers.find({}).populate("department_id");
    console.log(teacher_data);
    return teacher_data;
}
async function countTeachers() {
    let teacher_count = await teachers.count({ is_active: 1 });
    console.log(teacher_count);
    return teacher_count;
}
// async function newTeacher(name) {
//     let data = new departments({ name: name, is_active: 1 });
//     await data.save();
//     return data;
// }

/* ------ STUDENT ------- */
async function addStudent(enrollment, email, password, semester, department) {
    let preData = await students.findOne({ enrollment: enrollment });
    if (!preData) {
        let record = 1;
        //send mail
        let mailDetails = {
            from: 'avcthehero@gmail.com',
            to: email,
            subject: 'Registration',
            text: `Your Username is ${enrollment} and Password is ${password}`,
        };
        mailer.sendMail(mailDetails, async function (err, data) {
            if (err) {
                console.log('Error Occurs');
                record = 0;
            } else {
                console.log('Email sent successfully');
                let data = new students({ enrollment: enrollment, email: email, password: md5(password), semester: semester, department_id: new mongoose.Types.ObjectId(department),is_active:1 });
                await data.save();
            }
        });
        return record;
    }
    return 0;
}
async function fetchStudents() {
    let student_data = await students.find({is_active:1}).populate("department_id");
    console.log(student_data);
    return student_data;
}
async function countStudents() {
    let student_count = await students.count({ is_active: 1 });
    return student_count;
}
/* ------ QUIZZES ------ */
 async function countQuizzes() {
    let quiz_count = await quizzes.count({ is_active: 1 });
    return quiz_count;
 }
module.exports = { departmentFetch, newDepartment, deleteDepartment, fetchDepartments, countDepartments, addSubject, fetchSubjects, countSubjects, fetchTeachers, addTeacher, countTeachers, addStudent,fetchStudents, countStudents,countQuizzes};
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department
//Teacher Delete
//Quiz
//Question list only
//Student List