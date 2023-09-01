


function nextPage() {
    let quizname = document.getElementById("quizname").value;
    let subject = document.getElementById("subject").value;
    let quizdate_from = document.getElementById('quizdate_from').value;
    let quizdate_to = document.getElementById('quizdate_to').value;
    let visible_from = document.getElementById('visible_from').value;
    let visible_to = document.getElementById('visible_to').value;
    let duration = document.getElementById('duration').value;
    let marks = document.getElementById('marks').value;
    let guest=0;
    // console.log(document.getElementById('guest').checked);
    if((document.getElementById('guest').checked)==true){
        guest=1;
    }
    else{
        guest=0;
    }
    $.ajax({
        type: "POST",
        url: "/teacher/addQuiz/setQuiz",
        data: {  quizname,quizdate_from,quizdate_to,visible_from , visible_to,duration, marks,guest},

        

        success: function (response) {
            location.href = "http://localhost:3000/teacher/addQuiz/getGroups"
        }
    });
}
