const mongoose = require("mongoose");

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

const questionsModel = mongoose.model("questions", questionsSchema);
module.exports = questionsModel;
