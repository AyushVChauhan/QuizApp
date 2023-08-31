let dynamicDivdept = "<form method='post' action='/teacher/addQuiz/deptGroup'><select name='department' id='department'>";
departments.forEach((ele) => {
    dynamicDivdept += `<option value='${ele._id}'>${ele.name}</option>`;
});
dynamicDivdept += "</select>";
dynamicDivdept += "<select name='semester' id='semester'>";
for (let index = 1; index <= 8; index++) {
    dynamicDivdept += `<option value='${index}'>${index}</option>`;
}
dynamicDivdept += "</select>";
dynamicDivdept += '<button style="border-radius: 900px; height: min-content" class="btn btn-primary">Next</button></form>';
function see(e) {
    let group = e.getAttribute("data-id");
    $("#viewGroupModal").modal('show');
    $.ajax({
        type: "post",
        url: "/teacher/viewGroup",
        data: {group},
        success: function (response) {
            let enrolls = "<ul class='list-group'>";
            response.forEach(ele=>{
                enrolls += `<li class="list-group-item">${ele.enrollment}</li>`;
            })
            enrolls+="</ul>";
            $("#viewGroupModalBody").html(enrolls);
        }
    });
}
function changeSelect(e) {
    if (e.value === "department") {
        $("#dynamicDiv").html(dynamicDivdept);
        createSelect();
    } else {
        let def =
            "<table class='uk-table uk-table-hover uk-table-striped text-center' id='datatable'><thead><th>Sr No.</th><th>Name</th><th>Actions</th></thead>";
        let data = "";

        groups.forEach((ele, ind) => {
            data += "<tr>";
            data += `<td>${ind + 1}</td>`;
            data += `<td>${ele.name}</td>`;
            data += `<td><a data-id='${ele._id}' onclick='see(this)' class='see' ><i class='fa-regular fa-eye'></i></a><a data-id='${ele._id}' onclick='next(this)' class='next ms-5'><i class="fa-solid fa-arrow-right"></i></a></td>`;
            data += "</tr>";
        });
        $("#dynamicDiv").html(def + data + "</table>");
        var myTable;

        myTable = $("#datatable").DataTable({
            pagingType: "simple_numbers",
            language: {
                paginate: {
                    previous: "<",
                    next: ">",
                },
            },
        });
    }
}
function createSelect() {
    $("#dept_group").select2();
    $("#department").select2();
}
$(document).ready(function () {
    $("#dept_group").val("department");
    $("#dynamicDiv").html(dynamicDivdept);
    createSelect();
});
