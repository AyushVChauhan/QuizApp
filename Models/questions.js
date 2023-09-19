const mongoose = require("mongoose");

const questionsSchema = new mongoose.Schema({
    course_outcome_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: "course_outcomes" }],
    question: String,
    created_by: {type:mongoose.SchemaTypes.ObjectId, ref: "teachers"},
    updated_by : {type:mongoose.SchemaTypes.ObjectId, ref: "teachers"},
    marks: Number,
    type: Number, //1-MCQ , 2-ONE_WORD , 3-DESCRIPTIVE
    files: [{ description: String, file: String }],
    difficulty: Number,
    options: [{ option: String, file: String }],
    answer: String,
    is_active: Number,
    time_required : Number, //Seconds
},{timestamps:true});

const questionsModel = mongoose.model("questions", questionsSchema);
module.exports = questionsModel;
