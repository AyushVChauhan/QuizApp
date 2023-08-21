const express = require("express");
const router = express.Router();
router.get('/',(req,res)=>{
    res.render("./admin/admin_dashboard");
})
module.exports = router;