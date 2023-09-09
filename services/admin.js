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
    let data = await departments.findOne({ _id: new mongoose.Types.ObjectId(id) });
    data.is_active = 0;
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
    let teacherData = await teachers.findOne({ username: teacherObject.username });
    if (teacherData) {
        return 1;
    }
    else {

        let teacher = new teachers({ username: teacherObject.username, first_name: teacherObject.firstname, is_active: 1, middle_name: teacherObject.middlename, last_name: teacherObject.lastname, department_id: new mongoose.Types.ObjectId(teacherObject.department), email: teacherObject.email, password: teacherObject.password, role: 0 });
        await teacher.save();
        return 0;
    }
}
async function fetchTeachers() {
    let teacher_data = await teachers.find({}).populate("department_id");
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
        await timeout(300);
        mailer.sendMail(mailDetails, function (err, data) {
            if (err) {
                record = 0;
            } else {
                console.log(`${enrollment} : SENT`);
            }
        });
        if (record) {
            let data = new students({ enrollment: enrollment, email: email, password: md5(password), semester: semester, department_id: new mongoose.Types.ObjectId(department), is_active: 1 });
            await data.save();
        }
        return record;
    }
    return 0;
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function fetchStudents() {
    let student_data = await students.find({ is_active: 1 }).populate("department_id");
    return student_data;
}
async function countStudents() {
    let student_count = await students.count({ is_active: 1 });
    return student_count;
}
async function getSubject(data) {
    let subData = null;
    console.log(data);
    let semester = data.semester == "All" ? { $exists: true } : data.semester;

    subData = await subjects
        .find({
            semester: semester,
            is_active: 1,
        })

    return subData;
}
async function getStudent(data) {
    let studentData = null;
    console.log(data);
    let semester = data.semester == "All" ? { $exists: true } : data.semester;
    let department = data.department == "All" ? { $exists: true } : data.department;


    studentData = await students
        .find({
            semester: semester,
            department_id: department,
            is_active: 1,
        }).populate("department_id")

    return studentData;
}
async function getTeacher(data) {
    let teacherData = null;
    let department = data.department == "All" ? { $exists: true } : data.department;

    teacherData = await teachers
        .find({
            department_id: department,
            is_active: 1,
        }).populate("department_id")

    return teacherData;
}
/* ------ QUIZZES ------ */
async function countQuizzes() {
    let quiz_count = await quizzes.count({ is_active: 1 });
    return quiz_count;
}
async function getQuiz(data) {
    const nextDate = new Date();
    const date = new Date(data.date);
    nextDate.setTime(date.getTime() + 86400000);
    console.log(date);
    console.log(nextDate);
    let datequery = data.date == "" ? { _id: { $exists: true } } : { $and: [{ valid_from: { $gte: date } }, { valid_from: { $lte: nextDate } }] };

    let subjectquery = data.subject == "All" ? { subject_id: { $exists: true } } : { subject_id: data.subject };

    // let quiz=await quizzes.find({$and:[{subject_id:subject},{date}]});
    let quiz = await quizzes.find({ $and: [subjectquery, datequery] }).populate("created_by");
    return quiz;
}
async function quizDetails(data) {
    let quiz = await quizzes.findOne({ _id: data }).populate("random_questions").populate("compulsary_questions").populate("subject_id").populate({
        path: "group_id",
        model: "groups",
        populate: {
            path: "students",
            model: "students",
        },
    });
    return quiz;
}
module.exports = { departmentFetch, newDepartment, deleteDepartment, fetchDepartments, countDepartments, addSubject, fetchSubjects, countSubjects, fetchTeachers, addTeacher, countTeachers, addStudent, fetchStudents, countStudents, countQuizzes, getSubject, getStudent, getTeacher, getQuiz, quizDetails };
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department
//Teacher Delete
//Quiz
//Question list only
//Student List