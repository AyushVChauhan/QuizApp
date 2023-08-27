const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    name: String,
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
    is_active: Number,
}, { timestamps: true });

const quizzesModel = mongoose.model("quizzes", quizSchema);
module.exports = quizzesModel;
