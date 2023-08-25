const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({destination:"./public/files",filename:(req,file,cb)=>{
  cb(null,"schema.xlsx")
}})
const upload = multer({storage:storage,limits:{fileSize:15000000}});

router.get('/', adminControllers.adminDashboard);
router.post('/addDepartment', adminControllers.addDepartment)
router.post('/addSubject', adminControllers.addSubject)
router.get("/departments",adminControllers.departments);
router.post("/addStudent",upload.single('excel'), adminControllers.addStudent)
router.get("/subjects", adminControllers.subjects);
//move middleware above get() afterwards
// router.use(middleware);
function middleware(req, res, next) {
  let cookie = req.cookies.auth;
  if (cookie) {
    let data = jwt.verify(cookie, process.env.JWT_SECRET);
    if (data.role === 2) {
      console.log("Next");
      next();
    } else {
      res.redirect("/teacher/login");
    }
  }
}

module.exports = router;
