$(document).ready(function () {
    quizzes.forEach((element) => {
        let totalMarks = 0;
        let questionAnswers = element.questions_answers;
        questionAnswers.forEach((question) => {
            if (question.question.answer == question.answer) {
                totalMarks += question.question.marks;
            }
        });
        $(`#${element._id}`).html(totalMarks + "/" + element.quiz_id.marks);
    });

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
});
