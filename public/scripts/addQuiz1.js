let count = 2;
let sum = 0;

function nextPage() {
    let marks_questions = [];
    let elements = document.getElementsByClassName("temp");
    for (let index = 0; index < elements.length; index+=2) {
        const element1 = elements[index];
        const element2 = elements[index+1];
        if(element1.value && element2.value)
        {
            let marks = element1.value;
            let count = element2.value;
            marks_questions.push({marks:marks,count:count});
        }
    }
    let name = document.getElementById("quizname").value;
    let subject_id = document.getElementById("subject").value;
    let valid_from = document.getElementById("quizdate_from").value;
    let valid_to = document.getElementById("quizdate_to").value;
    let visible_from = document.getElementById("visible_from").value;
    let visible_to = document.getElementById("visible_to").value;
    let duration = document.getElementById("duration").value;
    let marks = document.getElementById("total").innerHTML;
    let guest_flag = 0;
    // console.log(document.getElementById('guest').checked);
    if (document.getElementById("guest").checked == true) {
        guest_flag = 1;
    } else {
        guest_flag = 0;
    }
    $.ajax({
        type: "POST",
        url: "/teacher/addQuiz/setQuiz",
        data: {
            name,
            valid_from,
            valid_to,
            duration,
            visible_from,
            visible_to,
            subject_id,
            marks,
            guest_flag,
            marks_questions,
        },

        success: function (response) {
            location.href = "http://localhost:3000/teacher/addQuiz/getGroups";
        },
    });
}
function show() {
    $("#total").html(sum);
}
// FOR DISABLING ADD BUTTON ON EMPTY VALUE
function disableAdd() {
    let a = document.querySelectorAll(".temp");
    sum = 0;
    console.log(a);
    for (let i = 0; i <= a.length - 1; i++) {
        if (!a[i].value) {
            document.getElementById("rowAdder").disabled = true;
        } else {
            document.getElementById("rowAdder").disabled = false;
        }
    }
    for (let i = 0; i <= a.length - 1; i = i + 2) {
        if(a[i].value && a[i+1].value)
        {
            sum += parseInt(a[i].value) * parseInt(a[i + 1].value);
        }
    }
    if (sum) {
        $("#total").html(sum);
    }
}
function add() {
    // disableAdd();
    console.log("hi");
    newRowAdd =
        '<div class="input-group" id="inputGroup' +
        count +
        '" >' +
        '<input type="number" id="mark' +
        count +
        '" class="form-control mb-3 temp" oninput="disableAdd()" placeholder="Marks " name="mark' +
        count +
        '"/> ' +
        '<input type="number" id="count' +
        count +
        '" class="form-control mb-3 temp" oninput="disableAdd()" placeholder="No. of Questions " name="count' +
        count +
        '"/> </div>';
    $(".markcount").append(newRowAdd);
    count++;

    disableAdd();
}
function remove() {
    if ($(".markcount > div").length > 1) {
        // REMOVING OPTION TEXT FEILD
        document.querySelector(".markcount > :last-child").remove();

        count--;
    }
    disableAdd();
}
$(document).ready(function () {
    disableAdd();
});
