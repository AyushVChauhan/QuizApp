const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    name: String,
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teachers" },
    updated_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teachers" },
    valid_from: Date,
    valid_to: Date,
    duration: Number,
    visible_from: Date,
    visible_to: Date,
    subject_id: { type: mongoose.SchemaTypes.ObjectId, ref: "subjects" },
    marks: Number,
    guest_flag: Number,
    compulsary_questions: [{question: { type: mongoose.SchemaTypes.ObjectId, ref: "questions" }, marks:Number}],
    random_questions: [{question: { type: mongoose.SchemaTypes.ObjectId, ref: "questions" }, marks:Number}],
    marks_questions : [{marks:Number,count:Number}],
    group_id: { type: mongoose.SchemaTypes.ObjectId, ref: "groups" },
    is_active: {type:Number,default:1},
}, { timestamps: true });

const quizzesModel = mongoose.model("quizzes", quizSchema);
module.exports = quizzesModel;
//for compulsary students
//quiz will be shown on dashboard === visible_from -> valid_to

//for guests
//quiz will be shown on dashboard === valid_to -> visible_to