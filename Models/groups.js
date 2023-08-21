const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: String,
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teacher" },
    students: [mongoose.SchemaTypes.ObjectId],
    is_active: Number,
});

const groupsModel = mongoose.model("groups", groupSchema);
module.exports = groupsModel;
