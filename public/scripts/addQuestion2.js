let count = 2;
let options = [];
let editor;
let filesData = "";
let divData = [];
divData.push({ id: 1, html: $("#files").html(), rendered: true });
// fOR CREATING CKEDITOR
ClassicEditor.create(document.querySelector("#editor"))
    .then((newEditor) => {
        editor = newEditor;
    })
    .catch((error) => {
        console.error(error);
    });
function descChange() {
    let flag = 0;
    divData.forEach((ele) => {
        if (
            document.getElementById(`questionDesc${ele.id}`).value.length ==
                0 &&
            document.getElementById(`questionFile${ele.id}`).files.length == 0
        ) {
            flag = ele.id;
            return;
        }
    });
    if (flag != 0) {
        removeFile(document.getElementById("fileButton" + flag));
    }

    filesData = "";
    let temp = 0;
    for (let index = 0; index < divData.length; index++) {
        const element = divData[index];
        if (index % 2 == 0 && index != 0) {
            filesData += "</div>";
            temp--;
        }
        if (index % 2 == 0) {
            filesData += "<div class='row'>";
            temp++;
        }
        filesData += "<div class='col'>";
        let descValue = document.getElementById(
            `questionDesc${element.id}`
        ).value;
        if (descValue.length == 0) descValue = index + 1;
        filesData += descValue;
        filesData += "</div>";
    }
    if (temp == 1) filesData += "</div>";

    filesData += "</div>";
    $(".filespreview").html(filesData);
}
function renderFileDiv() {
    let innerHTML = "";
    divData.forEach((ele) => {
        if (!ele.rendered) {
            innerHTML += ele.html;
            ele.rendered = true;
        }
    });
    $("#files").append(innerHTML);
}
// FOR DISABLING ADD BUTTON ON EMPTY VALUE
function disableAdd() {
    if (
        !document.querySelector(
            ".optionAddRemove > div:last-of-type > input:last-child "
        ).value
    ) {
        document.getElementById("rowAdder").disabled = true;
    } else {
        document.getElementById("rowAdder").disabled = false;
    }
}
function removeFile(e) {
    let id = e.getAttribute("data-id");
    console.log(divData);
    for (let index = 0; index < divData.length; index++) {
        const element = divData[index];
        if (element.id == id) {
            divData.splice(index, 1);
            break;
        }
    }
    console.log(divData);
    document.getElementById(`inputGroup${id}`).remove();
}
function addFile() {
    let flag = 1;
    divData.forEach((ele) => {
        if (
            document.getElementById(`questionDesc${ele.id}`).value.length ==
                0 ||
            document.getElementById(`questionFile${ele.id}`).files.length == 0
        ) {
            flag = 0;
            return;
        }
    });
    if (flag) {
        let curr_id =
            divData.length === 0 ? 0 : divData[divData.length - 1].id + 1;
        let innerHTML = `<div class="input-group" id="inputGroup${curr_id}"><input class="form-control" type="text" name="" id="questionDesc${curr_id}" placeholder="Description" oninput='descChange()'>
        <input
            type="file"
            class="form-control"
            id="questionFile${curr_id}"
            name="question"
            onchange="fileChange(this)"
        />
        <button data-id="${curr_id}" class="btn btn-danger" id="fileButton${curr_id}" onclick="removeFile(this)"><i class="fa-solid fa-xmark"></i></button></div>`;
        divData.push({ id: curr_id, html: innerHTML, rendered: false });
        renderFileDiv();
    }
}
function fileChange(e) {
    // let files = document.getElementById("question").files;
    // fileData = "<table>";
    // for (let index = 0; index < files.length; index++) {
    //     const element = files[index];
    //     if(index % 2 === 0 )
    //     {
    //         fileData += "<tr>";
    //     }
    //     fileData += ""
    // }
    // fileData += "</tr></table>";
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
        data: {
            question: editor.getData(),
            marks: marks,
            type: type,
            difficulty: difficulty,
            options: allOptions,
            answer: answer,
        },
        success: function (response) {
            if (
                divData.length > 0 &&
                document.getElementById(`questionDesc${divData[0].id}`).value &&
                document.getElementById(`questionFile${divData[0].id}`).files[0]
            ) {
                let formdata = new FormData();
                divData.forEach((ele, ind) => {
                    let myFile = document.getElementById(
                        `questionFile${ele.id}`
                    ).files[0];
                    let myName = document.getElementById(
                        `questionDesc${ele.id}`
                    ).value;
                    if (myName.length == 0) myName = ind;
                    formdata.append("questionFiles", myFile, myName);
                });
                console.log(formdata);
                let questionId = response.questionId;
                formdata.append("questionId", questionId);
                console.log(questionId);
                $.ajax({
                    type: "post",
                    url: "/teacher/addQuestion/question/files",
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.success == 1) {
                            Swal.fire({
                                text: "Question added succesfully",
                                icon: "success",
                                timer: 2000,
                            }).then(function () {
                                $("#reset").click();
                            });
                        } else {
                            Swal.fire({
                                text: "There was an error, Please Refresh Page",
                                icon: "error",
                                timer: 2000,
                            });
                        }
                    },
                });
            } else {
                Swal.fire({
                    text: "Question added succesfully",
                    icon: "success",
                    timer: 2000,
                }).then(function () {
                    $("#reset").click();
                });
            }
        },
    });
}
// FOR PREVIEW
// TO CREATE ARRAY OF OPTIONS
function arrayStore(data) {
    disableAdd();
    let id = data.id;
    options[id] = data.value;
    listOption();
}
// ADDING NEW LI
function listOption() {
    let ih = "";

    for (let i = 1; i < count; i++) {
        ih += `<li id="opt${i}" > ${options["option" + i]}</li>`;
    }
    $(".options").html(ih);
    disableAdd();
}
// FOR ADDING STYLE TO CORRECT ANS
function answerTick(data) {
    for (let index = 1; index < count; index++) {
        const element = options["option" + index];
        let str = "opt" + index;
        var row = document.getElementById(str);
        if (data == index) {
            row.innerHTML = element + "&nbsp;&nbsp;&nbsp;&#x2714;";
            row.style.color = "green";
        } else {
            row.innerHTML = element;
            row.style.color = "black";
        }
    }
    disableAdd();
    // console.log(data);
    // console.log(str.value);
    // row.style.fontStyle="bold";
}
$("#reset").on("click", function () {
    location.href = "/teacher/addQuestion/question";
});
// TO ADD A NEW OPTION
$("#rowAdder").click(function () {
    console.log(
        document.querySelector(
            ".optionAddRemove > div:last-of-type > input:last-child "
        ).value
    );

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
    // FOR ADDING OPTION IN SELECT ANSWER
    let options = "<option selected>Select Answer</option>";
    for (let i = 1; i < count; i++) {
        options += `<option id="option ${i}" value="${i}">Option ${i}</option>`;
    }
    $("#option").html(options);
});
// TO REMOVE
$("#rowRemover").click(function () {
    if ($(".optionAddRemove > div").length > 1) {
        // REMOVING OPTION TEXT FEILD
        document.querySelector(".optionAddRemove > :last-child").remove();
        // REMOVING OPTION SELECT ANSWER
        document.querySelector("#option > :last-child").remove();
        // REMOVING OPTION FROM PREVIEW
        if ($(".optionAddRemove > div").length == $(".options").length) {
            document.querySelector(".options > :last-child").remove();
        }
        count--;
    }
    disableAdd();
    listOption();
});
//      ********            For showing option(marks,ans,option)        *******
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
    });
    disableAdd();
    // FOR SHOWING QUESTION PREVIEW
    editor.model.document.on("change", () => {
        $(".questionpreview").html(editor.getData());
    });
});
