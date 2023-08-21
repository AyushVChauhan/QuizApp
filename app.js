const mongoose = require("mongoose");
const models = require('./models');
mongoose.connect("mongodb://0.0.0.0:27017/QuizApp");
run1();
async function run1(){
    // const subject = new models.subjectsModel({code:"3140701",course_outcomes:2,name:"OOP",semester:4});
    // await subject.save();
    // const subject = await models.subjectsModel.find();
    // const course_outcome = new models.courseOutcomesModel({course_outcome:1,subjectId:"64e07b6703eed82939d94a68",topic:"1st topic"});
    // course_outcome.save();
    // const course_outcome = await models.courseOutcomesModel.where().populate("subjectId");
    // const question = new models.questionsModel({type:1,marks:1,question:"Good or bad",course_outcome_id:"64e07c5eb175c96be8c940af",difficulty:1,answer:"yes",options:[{option:"yes",file:null},{option:"no",file:null}],files:null});
    // await question.save();
    // let questions= await models.questionsModel.find().populate({path:"course_outcome_id",populate:{
    //     path:"subjectId",model:"subjects"
    // }});
    const questions = await models.subjectsModel.findOne({_id:"64e07b44c4b95e6242fcb109"});
    questions.name = "abc";
    await questions.save();
    console.log(questions);
}