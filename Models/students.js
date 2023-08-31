const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  enrollment: String,
  first_name: String,
  middle_name: String,
  last_name: String,
  department_id: { type: mongoose.SchemaTypes.ObjectId, ref: "departments" },
  created_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teachers" },
  updated_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teachers" },
  semester: Number,
  email: String,
  phone: String,
  password: String,
  course: String,
  year_of_admission: String,
  is_active: Number,
});
const studentsModel = mongoose.model("students", studentSchema);
module.exports = studentsModel;
