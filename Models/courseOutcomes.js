const mongoose = require("mongoose");

const cousrseOutcomesSchema = new mongoose.Schema({
  course_outcome: Number,
  subjectId: { type: mongoose.SchemaTypes.ObjectId, ref: "subjects" },
  topic: String,
  is_active: Number,
});

const courseOutcomesModel = mongoose.model("course_outcomes", cousrseOutcomesSchema);
module.exports = courseOutcomesModel;
