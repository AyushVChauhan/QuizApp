const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    name: String,
    created_by: { type: mongoose.SchemaTypes.ObjectId, ref: "teachers" },
    students: [{ type: mongoose.SchemaTypes.ObjectId, ref: "students" }],
    is_active: Number,
    is_shown: Number,
}, { timestamps: true });

const groupsModel = mongoose.model("groups", groupSchema);
module.exports = groupsModel;
