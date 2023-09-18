function evaluateInput(e, maxMarks) {
    let id = e.getAttribute("data-id");
    let value = e.value;
    console.log(value)
    try{
        parseInt(value)
    }
    catch(exc) {
        Swal.fire({text:"Invalid Marks", icon:"error"});
        e.value = 1;
        return;
    }
    if(parseInt(value) < 0 || parseInt(value) > maxMarks)
    {
        Swal.fire({text:"Invalid Marks", icon:"error"});
        $(`#span${id}`).html("<i class='fa-regular fa-clock'></i>");
        e.value = "0";
    }
    else if(value == "")
    {
        $(`#span${id}`).html("<i class='fa-regular fa-clock'></i>");
    }
    else{
        $(`#span${id}`).html("<i class='fa-solid fa-lg fa-check text-light'></i>");
    }
}

function submitEvaluate() {
    let elements = document.getElementsByClassName("eval");
    let data = [];
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        data.push({questionId:element.getAttribute("data-id") , marks:element.value});
    }
    let url = window.location.href.split("/");
    let sessionId = url[url.length-1];
    $.ajax({
        type: "POST",
        url: "/teacher/evaluate",
        data: {data, sessionId},
        success: function (response) {
            if(response.success)
            {
                Swal.fire({text:"Evaluated Successfully" , icon:"success"}).then(()=>{window.open(`/teacher/generateReport/${quizId}`,"_self")});
            }
            else {
                Swal.fire({text:"Evaluation Unsuccessful" , icon:"error"});
            }
        }
    });
}