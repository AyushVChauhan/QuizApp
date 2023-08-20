const mongoose = require("mongoose");



const studentSchema = new mongoose.Schema({
    enrollment: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    department_id: { type: mongoose.SchemaTypes.ObjectId, ref: "departments" },
    semester: Number,
    email: String,
    phone: String,
    password: String,
    course: String,
    year_of_admission: String,
    is_active: Number,
});

const teacherSchema = new mongoose.Schema({
    username: String,
    first_name: String,
    middle_name: String,
    last_name: String,
    department_id: { type: mongoose.SchemaTypes.ObjectId, ref: "departments" },
    email: String,
    phone: String,
    password: String,
    role: Number,
    subjects: [{ type: mongoose.SchemaTypes.ObjectId, ref: "subjects" }],
    is_active: Number,
});

const departmentSchema = new mongoose.Schema({
    name: String,
    is_active: Number,
});

const subjectsSchema = new mongoose.Schema({
    code: String,
    name: String,
    course_outcomes: Number,
    semester: Number,
    is_active: Number,
});

const cousrseOutcomesSchema = new mongoose.Schema({
    course_outcome: Number,
    subjectId: { type: mongoose.SchemaTypes.ObjectId, ref: "subjects" },
    topic: String,
    is_active: Number,
});

const questionsSchema = new mongoose.Schema({
    course_outcome_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: "course_outcomes" }],
    question: String,
    marks: Number,
    type: Number,
    files: [{ description: String, file: String }],
    difficulty: Number,
    options: [{ option: String, file: String }],
    answer: String,
    is_active: Number,
});

const quizSchema = new mongoose.Schema({
    name: String,
    created_on: Date,
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teachers" },
    valid_from: Date,
    valid_to: Date,
    duration: Number,
    subject_id: { type: mongoose.SchemaTypes.ObjectId, ref: "subjects" },
    marks: Number,
    guest_flag: Number,
    guest_to: Date,
    compulsary_questions: [{ type: mongoose.SchemaTypes.ObjectId, ref: "questions" }],
    random_questions: [{ type: mongoose.SchemaTypes.ObjectId, ref: "questions" }],
    group_id: { type: mongoose.SchemaTypes.ObjectId, ref: "groups" },
    students: [{ type: mongoose.SchemaTypes.ObjectId, ref: "students" }],
    is_active: Number,
});


const sessionSchema = new mongoose.Schema({
    student_id: mongoose.SchemaTypes.ObjectId,
    quiz_id: { type: mongoose.SchemaTypes.ObjectId, ref: "quiz" },
    total_marks: Number,
    status: Number,
    start_time: Date,
    end_time: Date,
    ip: String,
    questions_answers: [{ question: { type: mongoose.SchemaTypes.ObjectId, ref: "questions" }, answer: String, marks: Number }],
    is_active: Number,
});

const groupSchema = new mongoose.Schema({
    name: String,
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teacher" },
    students: [mongoose.SchemaTypes.ObjectId],
    is_active: Number,
});

const subjectsModel = mongoose.model("subjects", subjectsSchema);
const courseOutcomesModel = mongoose.model("course_outcomes", cousrseOutcomesSchema);
const questionsModel = mongoose.model("questions", questionsSchema);
const quizModel = mongoose.model("quiz", quizSchema);
const sessionsModel = mongoose.model("sessions", sessionSchema);

module.exports = { subjectsModel: subjectsModel, courseOutcomesModel: courseOutcomesModel, questionsModel: questionsModel, quizModel: quizModel, sessionsModel: sessionsModel };