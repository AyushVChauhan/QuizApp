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
    console.log(arr);
    if(arr.includes("myQuiz"))
    {
        // $("#myQuiz").toggleClass('hovered')
        document.getElementById("myQuiz").classList.toggle("hovered");
    }
    else if(arr.includes("addQuiz"))
    {
        document.getElementById("createQuiz").classList.toggle("hovered");

        // $("#createQuiz").toggleClass("hovered")
    }
    else if(arr.includes("allQuiz"))
    {
        document.getElementById("allQuiz").classList.toggle("hovered");

        // console.log("hii");
        // $("#allQuiz").toggleClass("hovered")
    }
    else if(arr.includes("questions"))
    {
        document.getElementById("questions").classList.toggle("hovered");
        
        // $("#questions").toggleClass("hovered")
    }
    else if(arr.includes("students"))
    {
        document.getElementById("students").classList.toggle("hovered");
        
        // $("#students").toggleClass("hovered")
    }
    else if(arr.includes("subjects"))
    {
        document.getElementById("subjects").classList.toggle("hovered");

        // $("#subjects").toggleClass("hovered")
        // $("#subjects").toggleClass("hovered")
    }
    else
    {
        document.getElementById("dashboard").classList.toggle("hovered");

        // $("#dashboard").toggleClass("hovered")
    }
});