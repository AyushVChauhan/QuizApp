const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

router.post('/abc', adminControllers.addDepartment)

router.get('/', adminControllers.adminDashboard);
//move middleware above get() afterwards
router.use(middleware);
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
