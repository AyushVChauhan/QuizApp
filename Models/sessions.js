const mongoose = require("mongoose");

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
},{timestamps:true});
const sessionsModel = mongoose.model("sessions", sessionSchema);
module.exports = sessionsModel;
