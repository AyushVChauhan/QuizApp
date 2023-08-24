const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: String,
  course:{be:Boolean,me:Boolean},
  is_active: Number,
});

const departmentsModel = mongoose.model("departments", departmentSchema);
module.exports = departmentsModel;
