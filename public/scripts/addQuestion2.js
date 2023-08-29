
let count = 2;
let options = [];
let editor;
ClassicEditor.create(document.querySelector("#editor"))
    .then((newEditor) => {
        editor = newEditor;
    }) 
    .catch((error) => {
        console.error(error);
    });
    function disableAdd(){
        if(!document.querySelector(".optionAddRemove > div:last-of-type > input:last-child ").value){
            document.getElementById("rowAdder").disabled = true;
          
        } 
        else{
            document.getElementById("rowAdder").disabled = false;
        }
    }
function addQuestion() {
    let marks = 0;
    let type = 0;
    let difficulty = $('input[name="opt"]:checked').val();
    if ($("#type").val() == 1) {
        marks = 1;
        type = 1;
    }
    let allOptions = [];
    for (let index = 1; index < count; index++) {
        const element = options["option" + index];
        allOptions.push(element);
    }
    let answer = $("#option").val();
    $.ajax({
        type: "post",
        url: "/teacher/addQuestion/question",
        data: { question: editor.getData(), marks: marks, type: type, difficulty: difficulty, options: allOptions, answer: answer },
        success: function (response) {
            Swal.fire({ text: "Question added succesfully", icon: "success", timer: 2000 });

        }
    });
}
function arrayStore(data) {
    disableAdd();
    let id = data.id;
    options[id] = data.value;
    listOption();
}

function listOption() {
    let ih = "";

    for (let i = 1; i < count; i++) {
        ih += `<li id="opt${i}" > ${options["option" + i]}</li>`;
    }
    $(".options").html(ih);
    disableAdd();
}
function answerTick(data) {
    for (let index = 1; index < count; index++) {
        const element = options["option" + index];
        let str = "opt" + index;
        var row = document.getElementById(str);
        if (data == index) {
            row.innerHTML = element + "&nbsp;&nbsp;&nbsp;&#x2714;";
            row.style.color = "green";
        }
        else {
            row.innerHTML = element;
            row.style.color = "black";
        }
    }
    disableAdd();
    // console.log(data);
    // console.log(str.value);
    // row.style.fontStyle="bold";
}


$("#rowAdder").click(function () {
    console.log(document.querySelector(".optionAddRemove > div:last-of-type > input:last-child ").value);
   
    newRowAdd =
        ' <div class=" mb-3">' +
        ' <label for="option' +
        count +
        '" class="form-label">Option ' +
        count +
        " </label>" +
        '<input type="text" id="option' +
        count +
        '" oninput="arrayStore(this)" class="form-control mb-input" placeholder="option ' +
        count +
        '" name="option' +
        count +
        '">  </div>';

    $(".optionAddRemove").append(newRowAdd);
    count++;
    disableAdd();
    let options = "<option selected>Select Answer</option>";
    for (let i = 1; i < count; i++) {
        options += `<option id="option ${i}" value="${i}">Option ${i}</option>`;
    }
    $("#option").html(options);
});
$("#rowRemover").click(function () {
    
    if ($('.optionAddRemove > div').length >1) {
        document.querySelector(".optionAddRemove > :last-child").remove();
        document.querySelector("#option > :last-child").remove();
        if($('.optionAddRemove > div').length == $('.options').length){
           
            document.querySelector(".options > :last-child").remove();
        }
        count--;
    }
    disableAdd();
    listOption();
});
$(document).ready(function () {

    $("#type").change(function () {
        var value = $(this).val();
        var toAppend = "";
        if (value == 1) {
            let x = document.getElementById("opt");
            x.style.display = "block";
            let y = document.getElementById("ans");
            y.style.display = "none";
            let z = document.getElementById("mark");
            z.style.display = "none";
        }
        if (value == 2) {
            // toAppend = " <label>Answer :</label> &nbsp;&nbsp;&nbsp;<input type='text' >"; $("#answer").html(toAppend); return;
            let x = document.getElementById("opt");
            x.style.display = "none";
            let y = document.getElementById("ans");
            y.style.display = "block";
            let z = document.getElementById("mark");
            z.style.display = "none";
        }
        if (value == 3) {
            // toAppend = " <label>Marks :</label> &nbsp;&nbsp;&nbsp;<input type='text' >"; $("#mark").html(toAppend); return;
            let x = document.getElementById("opt");
            x.style.display = "none";
            let y = document.getElementById("ans");
            y.style.display = "none";
            let z = document.getElementById("mark");
            z.style.display = "block";
        }
    }
    );
    disableAdd();
    editor.model.document.on("change", () => {
        $(".questionpreview").html(editor.getData());
    });
    
});