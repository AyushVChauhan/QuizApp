let a = 0;
let currentQuestion = 1;

let allQuestions = [];
questionsId.forEach(element => {
    allQuestions.push({questionId:element.question,question:null,type:null,options:[],marks:null,files:null});
});

function nextQuestion(e) {
    currentQuestion++;
    if(allQuestions[currentQuestion - 1].question == null)
    {
        getQuestion(allQuestions[currentQuestion - 1].questionId);
    }
    showQuestion();
    

    if(currentQuestion == allQuestions.length)
    {
        e.style.display = "none";
    }
    else {
        e.style.display = "inline";
    }
}

function showQuestion() {
    if(currentQuestion == allQuestions.length)
    {
        document.getElementById("next").style.display = "none";
    }
    else {
        document.getElementById("next").style.display = "inline";
    }
    let question = allQuestions[currentQuestion - 1].question;
    for (let index = 0; index < allQuestions.length; index++) {
        const element = allQuestions[index];
        if(element.question)
        {
            if(!$(`#${index+1}`).hasClass("text-bg-warning"))
            {
                $(`#${index+1}`).addClass("text-bg-warning");
            }
            if($(`#${index+1}`).hasClass("text-bg-dark"))
            {
                $(`#${index+1}`).removeClass("text-bg-dark");
            }
        }
    }
    $(`#${currentQuestion}`).addClass("text-bg-dark");
    $("#questionContent").html(question);
}

function getQuestion(questionId) {
    $.ajax({
        type: "POST",
        url: "/student/getQuestion",
        data: {questionId},
        success: function (response) {
            console.log(response);
            allQuestions.forEach(ele=>{
                if(ele.questionId == questionId)
                {
                    ele.question = response.question.question;
                    ele.type = response.question.type;
                    if(response.question.options)
                    {
                        ele.options = response.question.options;
                    }
                    ele.marks = response.question.files;
                    if(response.question.files)
                    {
                        ele.files = response.question.files;
                    }
                    return;
                }
            })
            showQuestion();
        }
    });
}

function clickQuestion(e)
{
    currentQuestion = e.id;
    if(allQuestions[currentQuestion - 1].question == null)
    {
        getQuestion(allQuestions[currentQuestion - 1].questionId);
    }
    else
    {
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
        clearInterval(x);
        document.getElementById("remTime").innerHTML = "EXPIRED";
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
