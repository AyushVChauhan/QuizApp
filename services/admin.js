const { default: mongoose } = require("mongoose");
const departments = require("../Models/departments");
const subjects = require("../Models/subjects");
const teachers = require("../Models/teachers");
const students = require("../Models/students");
const quizzes = require("../Models/quizzes");
const groups = require("../Models/groups");
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
    let data = await departments.findOne({
        _id: new mongoose.Types.ObjectId(id),
    });
    data.is_active = 0;
    await data.save();
    return data;
}
async function deleteSubject(id) {
    let data = await subjects.findOne({ _id: new mongoose.Types.ObjectId(id) });
    data.is_active = 0;
    await data.save();
    return data;
}
async function deleteStudent(id){
    let data = await students.findOne({ _id: new mongoose.Types.ObjectId(id)});
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
    } else {
        let deptids = [];
        subObject.departments.forEach((element) => {
            deptids.push(new mongoose.Types.ObjectId(element));
        });
        console.log(subObject);
        let subject = new subjects({
            name: subObject.subname,
            code: subObject.subcode,
            is_active: 1,
            semester: subObject.semester,
            course_outcomes: subObject.co,
            departments: deptids,
        });
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
    let teacherData = await teachers.findOne({
        username: teacherObject.username,
    });
    if (teacherData) {
        return 1;
    } else {
        let teacher = new teachers({
            username: teacherObject.username,
            first_name: teacherObject.firstname,
            is_active: 1,
            middle_name: teacherObject.middlename,
            last_name: teacherObject.lastname,
            department_id: new mongoose.Types.ObjectId(
                teacherObject.department
            ),
            email: teacherObject.email,
            password: teacherObject.password,
            role: 0,
        });
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
            from: "avcthehero@gmail.com",
            to: email,
            subject: "Registration",
            text: `Hellow User Welcome to QuizApp \n Your Crendentials are:\nUsername:${enrollment}\nPassword:${password}`,
        };
        let msg = await mailer.sendMail(mailDetails);
        console.log(enrollment + ":" + msg.accepted);
        if (record) {
            let data = new students({
                enrollment: enrollment,
                email: email,
                password: md5(password),
                semester: semester,
                department_id: new mongoose.Types.ObjectId(department),
                is_active: 1,
            });
            await data.save();
        }
        return record;
    }
    return 0;
}
function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function fetchStudents() {
    let student_data = await students
        .find({ is_active: 1 })
        .populate("department_id");
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

    subData = await subjects.find({
        semester: semester,
        is_active: 1,
    });
    
    return subData;
}
async function getStudent(data) {
    let studentData = null;
    console.log(data);
    let semester = data.semester == "All" ? { $exists: true } : data.semester;
    let department =
        data.department == "All" ? { $exists: true } : data.department;

    studentData = await students
        .find({
            semester: semester,
            department_id: department,
            is_active: 1,
        })
        .populate("department_id");

    return studentData;
}
async function getTeacher(data) {
    let teacherData = null;
    let department =
        data.department == "All" ? { $exists: true } : data.department;

    teacherData = await teachers
        .find({
            department_id: department,
            is_active: 1,
        })
        .populate("department_id");

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
    let datequery =
        data.date == ""
            ? { _id: { $exists: true } }
            : {
                  $and: [
                      { valid_from: { $gte: date } },
                      { valid_from: { $lte: nextDate } },
                  ],
              };

    let subjectquery =
        data.subject == "All"
            ? { subject_id: { $exists: true } }
            : { subject_id: data.subject };

    // let quiz=await quizzes.find({$and:[{subject_id:subject},{date}]});
    let quiz = await quizzes
        .find({ $and: [subjectquery, datequery] })
        .populate("created_by");
    return quiz;
}
async function quizDetails(data) {
    let quiz = await quizzes
        .findOne({ _id: data })
        .populate("random_questions")
        .populate("compulsary_questions")
        .populate("subject_id")
        .populate({
            path: "group_id",
            model: "groups",
            populate: {
                path: "students",
                model: "students",
            },
        });
    return quiz;
}

async function fetchGroups() {
    var group_data = await groups.find({ is_active: 1, is_shown: 1 });
    return group_data;
}

async function getStudentId(enrollment) {
    let id = await students.findOne(
        { enrollment: enrollment, is_active: 1 },
        { _id: 1 }
    );
    console.log(id);
    return id;
}

async function addGroup(groupName, obj) {
    let student_ids = [];
    for (let index = 0; index < obj.length; index++) {
        const element = obj[index];
        console.log(element);
        let id = await getStudentId(element["Enrollment No"]);
        student_ids.push(id._id);
    }
    let group = new groups({
        is_active: 1,
        name: groupName,
        students: student_ids,
        is_shown: 1,
    });
    await group.save();
    return group._id;
}
async function viewGroup(group_id) {
    let group = await groups
        .findOne({ _id: group_id })
        .populate("students", "enrollment");
    return group;
}
module.exports = {
    departmentFetch,
    newDepartment,
    deleteDepartment,
    fetchDepartments,
    countDepartments,
    addSubject,
    fetchSubjects,
    countSubjects,
    fetchTeachers,
    addTeacher,
    countTeachers,
    addStudent,
    fetchStudents,
    countStudents,
    countQuizzes,
    getSubject,
    getStudent,
    getTeacher,
    getQuiz,
    quizDetails,
    deleteSubject,
    deleteStudent,
    fetchGroups,
    addGroup,
    viewGroup,
};
//Role=0 Teacher accept
//Add subject,Delete,Edit
//Department
//Teacher Delete
//Quiz
//Question list only
//Student List
