let a = 0;
let currentQuestion = 1;

let allQuestions = [];
questionsId.forEach((element) => {
    allQuestions.push({
        questionId: element.question,
        question: null,
        type: null,
        options: [],
        marks: null,
        files: null,
        answer: null,
        saved: 0,
    });
});

function nextQuestion(e) {
    currentQuestion++;
    if (allQuestions[currentQuestion - 1].question == null) {
        getQuestion(allQuestions[currentQuestion - 1].questionId);
    }
    showQuestion();

    if (currentQuestion == allQuestions.length) {
        e.style.display = "none";
    } else {
        e.style.display = "inline";
    }
}
function backQuestion(e) {
    currentQuestion--;
    if (allQuestions[currentQuestion - 1].question == null) {
        getQuestion(allQuestions[currentQuestion - 1].questionId);
    }
    showQuestion();

    if (currentQuestion == 1) {
        e.style.display = "none";
    } else {
        e.style.display = "inline";
    }
}
function answerSelect(e) {
    let optionValue = e.value;
    allQuestions.forEach((ele) => {
        if (ele.questionId == e.getAttribute("data-id")) {
            ele.answer = optionValue;
            return;
        }
    });
}

function saveAndNext() {
    let question = allQuestions[currentQuestion - 1];
    if (question.answer) {
        allQuestions[currentQuestion - 1].saved = 1;
        if (currentQuestion < allQuestions.length)
            nextQuestion(document.getElementById("next"));
        else showQuestion();
    } else {
        Swal.fire({
            title: "Select Answer",
            icon: "warning",
        });
    }
}
function showQuestion() {
    if (currentQuestion == allQuestions.length) {
        document.getElementById("next").style.display = "none";
    } else {
        document.getElementById("next").style.display = "inline";
    }
    if (currentQuestion == 1) {
        document.getElementById("back").style.display = "none";
    } else {
        document.getElementById("back").style.display = "inline";
    }
    let notVisited = allQuestions.length;
    let notAnswered = 0;
    let answered = 0;

    let id = allQuestions[currentQuestion - 1].questionId;
    let question = allQuestions[currentQuestion - 1].question;
    let option = allQuestions[currentQuestion - 1].options;
    let file = allQuestions[currentQuestion - 1].files;
    console.log(allQuestions);
    for (let index = 0; index < allQuestions.length; index++) {
        const element = allQuestions[index];
        if (element.question) {
            if ($(`#${index + 1}`).hasClass("text-bg-dark")) {
                $(`#${index + 1}`).removeClass("text-bg-dark");
            }
            if ($(`#${index + 1}`).hasClass("text-bg-warning")) {
                $(`#${index + 1}`).removeClass("text-bg-warning");
            }
            if ($(`#${index + 1}`).hasClass("text-bg-success")) {
                $(`#${index + 1}`).removeClass("text-bg-success");
            }
            notVisited--;
            if (element.saved) {
                $(`#${index + 1}`).addClass("text-bg-success");
                answered++;
            } else {
                $(`#${index + 1}`).addClass("text-bg-warning");
                notAnswered++;
            }
        }
    }
    $(`#${currentQuestion}`).addClass("text-bg-dark");
    $("#questionContent").html(question);
    $("#notVisited").html(notVisited);
    $("#notAnswered").html(notAnswered);
    $("#answered").html(answered);
    $("#marksContent").html("Marks:" + allQuestions[currentQuestion - 1].marks)
    let temp = null;
    let fileBody = `<div class="row">`;
    if (file) {
        file.forEach((element) => {
            fileBody += `<div class="col-12"><div><img src="${element.file}"><p>${element.description}</p></div></div>`;
        });
    }
    fileBody += `</div>`;
    $("#fileContent").html(fileBody);
    let optionBody=null;
    if (allQuestions[currentQuestion - 1].type == 1) {
          optionBody = `<form>`;
        for (let index = 0; index < option.length; index++) {
            const element = option[index];
            if (
                allQuestions[currentQuestion - 1].answer &&
                allQuestions[currentQuestion - 1].answer == element.option
            ) {
                temp = index + 1;
               
            }
            optionBody += `<label for="option-${index + 1}" id="option2-${index+1}" ><input type="radio" name="${id}" value="${element.option}" id="option-${index + 1}" data-id="${id}" onchange="answerSelect(this)" `;
            if(temp){
                optionBody+= "checked ";
               
            }
            optionBody+= `/><span>${element.option}</span></label>`
            temp=null;
        }
        
        optionBody += `</form>`;
    }
    else if(allQuestions[currentQuestion - 1].type == 2){
        optionBody=`<input type="text" class="form-control" placeholder="Answer" oninput="answerSet(this)" value="${allQuestions[currentQuestion-1].answer  != null?allQuestions[currentQuestion-1].answer : ""}"/>`
    }
    else{
        optionBody=`<textarea class="form-control" placeholder="Answer" oninput="answerSet(this)" value="${allQuestions[currentQuestion-1].answer}"></textarea>`
        
    }
    $("#optionContent").html(optionBody);
}
function answerSet(e){
    let ans=e.value;
    allQuestions[currentQuestion-1].answer=ans;
}
function resetAnswer() {
    allQuestions[currentQuestion - 1].saved = 0;
    allQuestions[currentQuestion - 1].answer = null;
    showQuestion();
}
function submitQuiz() {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to submit the quiz ",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Submit it!",
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: "post",
                url: "/student/submitQuiz",
                data: { allQuestions },
                success: function (response) {
                    //   Swal.fire("Submitted!", "Your Quiz has been Submitted.", "success");
                    window.open("/student", "_self");
                },
            });
        }
    });
}
function getQuestion(questionId) {
    $.ajax({
        type: "POST",
        url: "/student/getQuestion",
        data: { questionId },
        success: function (response) {
            console.log(response);
            allQuestions.forEach((ele) => {
                if (ele.questionId == questionId) {
                    ele.question = response.question.question;
                    ele.type = response.question.type;
                    if (response.question.options) {
                        ele.options = response.question.options;
                    }
                    ele.marks = response.question.marks;
                    if (response.question.files) {
                        ele.files = response.question.files;
                    }

                    return;
                }
            });
            showQuestion();
        },
    });
}

function clickQuestion(e) {
    currentQuestion = e.id;
    if (allQuestions[currentQuestion - 1].question == null) {
        getQuestion(allQuestions[currentQuestion - 1].questionId);
    } else {
        showQuestion();
    }
}

let countDownDate = new Date();
countDownDate.setTime(countDownDate.getTime() + duration * 60 * 1000);
var x = setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("remTime").innerHTML =
        "Remaining Time - " + hours + ":" + minutes + ":" + seconds;

    // If the count down is finished, write some text
    if (distance < 0) {
        //submit
        $.ajax({
            type: "post",
            url: "/student/submitQuiz",
            data: { allQuestions },
            success: function (response) {
                //   Swal.fire("Submitted!", "Your Quiz has been Submitted.", "success");
                window.open("/student", "_self");
            },
        });
    }
}, 1000);
async function activate(ele) {
    if (ele.requestFullscreen) {
        await ele.requestFullscreen();
        $("#staticBackdrop").modal("hide");
        clickQuestion(document.getElementById("1"));
       

    }
}
document.documentElement.addEventListener("fullscreenchange", (e) => {
    //timer
    if (!document.fullscreenElement) {
        a++;
        $("#staticBackdrop").modal("show");
        console.log(a);
        Swal.fire({ title: "Restricted Action", text: "Further Action will lead to Disqualification", icon: "warning" }).then(()=>{activate(document.documentElement)});
    }
});
document.documentElement.addEventListener("copy", (e) => {
    e.preventDefault();
    Swal.fire({ title: "Error", text: "Restricted Action", icon: "error" });
});

document.documentElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    Swal.fire({ title: "Error", text: "Restricted Action", icon: "error" });
});
$(document).ready(function () {
    $("#staticBackdrop").modal("show");
});
