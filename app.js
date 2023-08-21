require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const models = require('./models/teachers');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

app.use(cookieParser())
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://0.0.0.0:27017/QuizApp");


app.get("/",(req,res)=>{
    let cookie = req.cookies.auth;
    if(cookie)
    {
        let data = jwt.verify(cookie,process.env.JWT_SECRET);
        if(data.role === 0)
        {
            res.redirect("/student");
        }
        else if(data.role === 1)
        {
            res.redirect("/teacher");
        }
        else if(data.role === 2)
        {
            res.redirect("/admin");
        }
    }
    else
    {
        res.redirect("/teacher/login");
    }
})
const studentRoutes = require("./routes/student");
app.use("/student",studentRoutes);
const teacherRoutes = require("./routes/teacher");
app.use("/teacher",teacherRoutes);
const adminRoutes = require("./routes/admin");
app.use("/admin",adminRoutes);


app.listen(process.env.PORT,()=>{
    console.log("Listening at port 3000");
})

// run1();
// async function run1(){
    // const teacher = new models({
    //     email:"avcthehero@gmail.com",department_id:null,subjects:null,first_name:"admin",is_active:1,last_name:"admin",middle_name:"admin",password:"1bbd886460827015e5d605ed44252251",phone:"8200125511",role:1,username:"admin"
    // });
    // await teacher.save();
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
    // const questions = await models.subjectsModel.findOne({_id:"64e07b44c4b95e6242fcb109"});
    // questions.name = "abc";
    // await questions.save();
    // console.log(questions);
// }