const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        student_id: { type: mongoose.SchemaTypes.ObjectId, ref: "students" },
        quiz_id: { type: mongoose.SchemaTypes.ObjectId, ref: "quizzes" },
        status: Number, //0=Pending,1=Submitted,2=Disqualify
        start_time: Date,
        end_time: Date,
        ip: String,
        questions_answers: [
            {
                question: {
                    type: mongoose.SchemaTypes.ObjectId,
                    ref: "questions",
                },
                answer: String,
                marks: Number,
                time_spent: Number, //Seconds
            },
        ],
        is_evaluated: { type: Number, default: 0 },
        is_active: Number,
    },
    { timestamps: true }
);
const sessionsModel = mongoose.model("sessions", sessionSchema);
module.exports = sessionsModel;
