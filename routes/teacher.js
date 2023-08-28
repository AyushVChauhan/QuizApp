const express = require("express");
const router = express.Router();
const teacherControllers = require("../controllers/teacher");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./public/images", filename: (req, file, cb) => {
    cb(null, "schema.xlsx")
  }
})
const upload = multer({ storage: storage });

router.post("/login", teacherControllers.login);
router.get("/login", teacherControllers.loginGet);

router.use(middleware);

router.get("/", teacherControllers.teacherDashboard);
router.get("/addQuestion/topics", teacherControllers.addQue_subSelect);
// router.post("/addQuestion/topics", teacherControllers.addQue_subSelect);

function middleware(req, res, next) {
  let cookie = req.cookies.auth;
  if (cookie) {
    let data = jwt.verify(cookie, process.env.JWT_SECRET);
    console.log
    if (data.role === 1) {
      //console.log("Next");
      next();
    }
    else {
      res.redirect("/teacher/login");
    }
  }
  else {
    res.redirect("/teacher/login");
  }
}

module.exports = router;
