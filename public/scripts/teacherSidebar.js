function openSidebar() {
    let sidebar = document.getElementsByClassName("sidebar")[0];
    $("#sidebar").toggleClass("sidebar-open");
    console.log($(".main-container").css("opacity"));
    if($(".main-container").css("opacity") === "0.5")
        $(".main-container").css("opacity","100%")
    else
    $(".main-container").css("opacity","50%")
}
$(document).ready(function () {
    let path = window.location.pathname;
    let arr = path.split("/");
    if(arr.includes("createQuiz"))
    {
        $("#createQuiz").toggleClass("hovered")
    }
    else if(arr.includes("viewQuiz"))
    {
        $("#viewQuiz").toggleClass("hovered")
    }
    else if(arr.includes("questions"))
    {
        $("#questions").toggleClass("hovered")
    }
    else if(arr.includes("students"))
    {
        $("#students").toggleClass("hovered")
    }
    else if(arr.includes("subjects"))
    {
        $("#subjects").toggleClass("hovered")
    }
    else
    {
        $("#dashboard").toggleClass("hovered")
    }
});