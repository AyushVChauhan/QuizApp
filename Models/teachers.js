const mongoose = require("mongoose");

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
  role: Number,
});

const teachersModel = mongoose.model("teachers", teacherSchema);
module.exports = teachersModel;
