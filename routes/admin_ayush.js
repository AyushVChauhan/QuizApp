const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const storage = multer.diskStorage({destination:"./public/images",filename:(req,file,cb)=>{
  cb(null,file.originalname)
}})
const upload = multer({storage:storage});
router.use(middleware);
const xlsx = require("xlsx");


router.get("/", (req, res) => {
  res.render("./admin/admin_dashboard");
});
router.get("/upload",(req,res)=>{
  res.render("./admin/upload_form");
})
router.post("/upload", upload.single('excel'),(req,res)=>{
  var mySheet = xlsx.readFile("./public/images/schema.xlsx");
  var sheets = mySheet.SheetNames;
  var obj = xlsx.utils.sheet_to_json(mySheet.Sheets[sheets[0]]);
  console.log(obj);
  res.redirect("/admin");
})
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
