const adminServices = require("../services/admin");
const myCache = require("./cache")


async function addDepartment(req, res) {


    if (req.body.name.trim() !== "") {
        let fetchData = await adminServices.departmentFetch(req.body.name);
        if (fetchData == null) {
            let data = await adminServices.newDepartment(req.body.name);
            myCache.set("errors", { text: "Department Added Successfully", icon: "success" });
        }
        else {
            myCache.set("errors", { text: "Department Already Exist!!", icon: "warning" });
        }
    }


    res.redirect("/admin");
}
async function adminDashboard(req, res) {

    let errors = null
    if (myCache.has('errors')) {
        errors = myCache.take('errors')//take will empty the myCache
        // console.log(errors)
    }

    let dept_data = await adminServices.fetchDepartments()
    
    res.render("./admin/admin_dashboard", { errors, dept_data });
}

async function addSubject (req, res) {
    let errors = null;
    //to validate
    let sub = await adminServices.addSubject(req.body);
    if(sub === 0)
    {
        myCache.set("errors", { text: "Subject Added Successfully", icon: "success" });
    }
    else
    {
        myCache.set("errors", { text: "Subject Already Exists!", icon: "warning" });
    }
    res.redirect("/admin");
}
async function departments(req, res) {
    let errors = null
    if (myCache.has('errors')) {
        errors = myCache.take('errors')//take will empty the myCache
        // console.log(errors)
    }
    let dept_data = await adminServices.fetchDepartments()
    res.render("./admin/departments",{dept_data, errors});
}

module.exports = { addDepartment, adminDashboard, addSubject, departments };