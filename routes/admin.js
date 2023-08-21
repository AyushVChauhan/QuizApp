const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin");
router.get('/',(req,res)=>{
    res.render("./admin/admin_dashboard");
})
module.exports = router;