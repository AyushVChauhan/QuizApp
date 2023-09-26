let count = 2;
let sum = 0;

$(document).ready(function () {
    // console.log(document.getElementById("guest").value);
    $("#guest").change(function () {
    if(document.getElementById("guest").checked == true)
    {
        let x = document.getElementById("guestDate");
        x.style.display = "block";
    }
    else{
        let x = document.getElementById("guestDate");
        x.style.display = "none"; 
    }
})
})
function nextPage() {
    let errors ="Please fill out ";
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
            // console.log(marks_questions);
        }
        else{
            errors+="Marks,No.of Questions, "
        }
    }
    
    let name = document.getElementById("quizname").value;
    if(!name){
        errors+="Quiz Name, "
    }
    let subject_id = document.getElementById("subject").value;
    if(subject_id=="0"){
        errors+="Subject, "
    }
    let guest_flag = 0;
    // console.log(document.getElementById('guest').checked);
    if (document.getElementById("guest").checked == true) {
        guest_flag = 1;
    } else {
        guest_flag = 0;
    }
    let valid_from = document.getElementById("quizdate_from").value;
    if(!valid_from){
        errors+="Valid Quiz Start Date, "
    }
    let valid_to = document.getElementById("quizdate_to").value;
    
    if((!valid_to) || (valid_to<valid_from)){
        errors+="Valid Quiz End Date, "
    }
    let visible_from = document.getElementById("visible_from").value;
    if(!visible_from || (visible_from>valid_from) || (visible_from>valid_to)){
        errors+="Valid Quiz visible from date(should be less than quiz date), "
    }
    let visible_to = document.getElementById("visible_to").value;
    if((!visible_to || (visible_to<valid_to) || (visible_to<valid_from) || (visible_to<visible_from))&&  guest_flag==1){
        errors+="Valid Quiz End Date for guests(should be greater than quiz date), "
    }
    let duration = document.getElementById("duration").value;
    if(!duration){
        errors+="Duration Time, "
    }

    let marks = document.getElementById("total").innerHTML;
   
   console.log();
    if(errors!="Please fill out ")
    {
        Swal.fire({icon:"error",text:errors.substring(0,errors.length-2)})
    }
    else{
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
}
function show() {
    $("#total").html(sum);
}
// FOR DISABLING ADD BUTTON ON EMPTY VALUE
function disableAdd() {
    let a = document.querySelectorAll(".temp");
    sum = 0;
    console.log(a);
    for (let i = 0; i <= a.length - 1; i=i+2) {
        if (!a[i].value || (a[i+1].value==null)) {
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
