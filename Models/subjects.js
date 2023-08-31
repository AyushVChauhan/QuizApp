const mongoose = require("mongoose");

const subjectsSchema = new mongoose.Schema({
  code: String,
  name: String,
  course_outcomes: Number,
  semester: Number,
  departments: [{ type: mongoose.SchemaTypes.ObjectId, ref: "departments" }],
  is_active: Number,
},{timestamps:true});

const subjectsModel = mongoose.model("subjects", subjectsSchema);
module.exports = subjectsModel;
