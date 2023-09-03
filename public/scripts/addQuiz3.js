let selectedQuestions = [];
let allQuestions = [];
let allCos = [
    { co: 1, count: 0 },
    { co: 2, count: 0 },
    { co: 3, count: 0 },
    { co: 4, count: 0 },
    { co: 5, count: 0 },
    { co: 6, count: 0 },
    { co: 7, count: 0 },
    { co: 8, count: 0 },
    { co: 9, count: 0 },
    { co: 10, count: 0 },
];
function adder(e) {
    let id = e.getAttribute("data-id");
    let flag = 0;
    selectedQuestions.forEach((ele, ind) => {
        if (ele._id == id) {
            flag = 1;
            selectedQuestions.splice(ind, 1);
            return;
        }
    });
    if (flag) {
        e.innerHTML = "<i class='fa-solid fa-plus text-success ms-4'></i>";
    }
    if (!flag) {
        allQuestions.forEach((ele) => {
            if (ele._id == id) {
                selectedQuestions.push(ele);
            }
        });
        e.innerHTML = "<i class='fa-solid fa-minus text-danger ms-4'></i>";
    }
    renderCos();
}

function renderCos() {
    allCos = [
        { co: 1, count: 0 },
        { co: 2, count: 0 },
        { co: 3, count: 0 },
        { co: 4, count: 0 },
        { co: 5, count: 0 },
        { co: 6, count: 0 },
        { co: 7, count: 0 },
        { co: 8, count: 0 },
        { co: 9, count: 0 },
        { co: 10, count: 0 },
    ];

    allCos.forEach((ele) => {
        for (let index = 0; index < selectedQuestions.length; index++) {
            const element = selectedQuestions[index];
            if (element.course_outcome_id[0].course_outcome == ele.co) {
                ele.count++;
            }
        }
    });
    let body = ``;
    allCos.forEach((ele) => {
        if (ele.count > 0) {
            body += `<div class="accordion-item"><h2 class="accordion-header"><button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#CO${ele.co}"
                    aria-expanded="true"
                    aria-controls="CO${ele.co}"
                >
                    CO-${ele.co} -- ${ele.count}
                </button>
            </h2>
            <div
                id="CO${ele.co}"
                class="accordion-collapse collapse show"
                data-bs-parent="#coDiv"
            >
                <div class="accordion-body"><ol>`;
            selectedQuestions.forEach((element) => {
                if (element.course_outcome_id[0].course_outcome == ele.co) {
                    body += `<li>${element.question}</li>`;
                }
            });
            body += "</ol></div></div></div>";
        }
    });
    // console.log(body);
    $("#coDiv").html(body);
}
function seer(e) {
    let id = e.getAttribute("data-id");
    $.ajax({
        type: "POST",
        url: "/teacher/questionDetail",
        data: { id },
        success: function (response) {
            // console.log(response);
            let data = response.questionDetail;
            let subcodeqdetail = null;
            let subnameqdetail = null;
            let coqdetail = null;
            let topicqdetail = [];

            data.course_outcome_id.forEach((element) => {
                coqdetail = element.course_outcome;
                topicqdetail.push(element.topic);
                subcodeqdetail = element.subjectId.code;
                subnameqdetail = element.subjectId.name;
            });
            let typeqdetail = null;
            let difficultyqdetail = null;
            if (data.type == 1) {
                typeqdetail = "MCQ";
            }
            if (data.type == 2) {
                typeqdetail = "One Word";
            }
            if (data.type == 3) {
                typeqdetail = "Descriptive";
            }
            if (data.difficulty == 1) {
                difficultyqdetail = "Easy";
            }
            if (data.difficulty == 2) {
                difficultyqdetail = "Medium";
            }
            if (data.difficulty == 3) {
                difficultyqdetail = "Hard";
            }
            let html =
                "<div class='question'><div class='modalQuestion me-2'><h4><b>Question :</b></h4></div><div class='modalQuestion'> " +
                data.question +
                "</div></div><div class=' me-2' ><h4><b>Option :</b></h4></div><div class=''><ol style='list-style-type: upper-alpha;font-size:20px'>";
            data.options.forEach((element) => {
                if (element.option == data.answer)
                    html +=
                        "<li style='color:green;'>" + element.option + "</li>";
                else html += "<li>" + element.option + "</li>";
            });
            html +=
                "</ol></div><div><div class='modalQuestion me-2'><h4><b>Answer :</b></h4></div><div class='modalQuestion' style='color:green; font-size: 20px '> " +
                data.answer +
                "</b></div></div></div><div><div class='modalQuestion me-2'><h4><b>Marks :</b></h4></div><div class='modalQuestion'> " +
                data.marks +
                "</div></div></div><div><div class='modalQuestion me-2'><h4><b>Type :</b></h4></div><div class='modalQuestion'> " +
                typeqdetail +
                "</div></div></div><div><div class='modalQuestion me-2'><h4><b>Difficulty:</b></h4></div><div class='modalQuestion'> " +
                difficultyqdetail +
                "</div></div></div><div><div class='modalQuestion me-2'><h4><b>Subject:</b></h4></div><div class='modalQuestion'> " +
                subnameqdetail +
                "(" +
                subcodeqdetail +
                ")" +
                "</div></div></div><div><div class='modalQuestion me-2'><h4><b>CO : </b></h4></div><div class='modalQuestion'> " +
                coqdetail +
                "</div></div></div><div class='row'><div class='modalQuestion col-auto'><h4><b>Topics :</b></h4></div><div class='modalQuestion col'><ul>";
            topicqdetail.forEach((ele) => {
                html += `<li>${ele}</li>`;
            });
            html += "</ul></div></div></div>";
            $(".modal-body").html(html);
            // $('#largeModal').modal('show');
            $("#questionDetailModal").modal("show");
        },
    });
}
$("#generateDataTable").click(() => {
    let type = $("#typeselect").val();
    let difficulty = $("#difficultyselect").val();
    let createdby = $("#createdbyselect").val();

    // console.log("hi");
    $.ajax({
        type: "POST",
        url: "/teacher/addQuestion/getQuestion",
        data: { subject, type, difficulty, createdby },
        success: function (response) {
            if (response.length !== 0) {
                questions = response.questionData;
                // questions.forEach((ele)=>{console.log(ele.course_outcome_id)})
                let def =
                    "<table class='uk-table uk-table-hover uk-table-striped text-center' id='datatable'><thead><th>Sr No.</th><th>Type</th><th>Subject</th><th>Question</th><th>Action</th></thead>";
                let data = "";
                let type1 = null;
                let subject1 = null;
                let ind = 1;
                allQuestions = questions;
                questions.forEach((ele) => {
                    if (ele.course_outcome_id.length != 0) {
                        // console.log("hii");
                        if (ele.type == 1) {
                            type1 = "MCQ";
                        }
                        if (ele.type == 2) {
                            type1 = "ONE WORD";
                        }
                        if (ele.type == 3) {
                            type1 = "DESCRIPTIVE";
                        }
                        data += "<tr>";
                        data += `<td>${ind++}</td>`;
                        data += `<td>${type1}</td>`;
                        ele.course_outcome_id.forEach((element) => {
                            subject1 = element.subjectId.name;
                        });
                        data += `<td>${subject1}
                </td>`;
                        data += `<td class="add-read-more show-less-content">${ele.question}</td>`;
                        data += `<td><a data-id='${ele._id}' onclick='seer(this)' class='adder' ><i class='fa-solid fa-eye text-dark'></i></a><a data-id='${ele._id}' onclick='adder(this)' class='adder' ><i class='fa-solid fa-plus ms-4 text-success' ></i></a></td>`;
                        data += "</tr>";
                    }
                });

                $("#tableDiv").html(def + data + "</table>");
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
                // abc();
                AddReadMore();
            }
        },
    });
});
function AddReadMore() {
    //This limit you can set after how much characters you want to show Read More.
    var carLmt = 170;
    // Text to show when text is collapsed
    var readMoreTxt = " ...read more";
    // Text to show when text is expanded
    var readLessTxt = " read less";

    //Traverse all selectors with this class and manipulate HTML part to show Read More
    $(".add-read-more").each(function () {
        if ($(this).find(".first-section").length) return;

        var allstr = $(this).text();
        if (allstr.length > carLmt) {
            var firstSet = allstr.substring(0, carLmt);
            var secdHalf = allstr.substring(carLmt, allstr.length);
            var strtoadd =
                firstSet +
                "<span class='second-section'>" +
                secdHalf +
                "</span><span class='read-more'  title='Click to Show More'>" +
                readMoreTxt +
                "</span><span class='read-less' title='Click to Show Less'>" +
                readLessTxt +
                "</span>";
            $(this).html(strtoadd);
        }
    });

    //Read More and Read Less Click Event binding
    $(document).on("click", ".read-more,.read-less", function () {
        $(this)
            .closest(".add-read-more")
            .toggleClass("show-less-content show-more-content");
    });
}
