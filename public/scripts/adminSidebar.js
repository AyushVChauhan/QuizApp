function openSidebar() {
    let sidebar = document.getElementsByClassName("sidebar")[0];
    $("#sidebar").toggleClass("sidebar-open");
    console.log($(".main-container").css("opacity"));
    if($(".main-container").css("opacity") === "0.5")
        $(".main-container").css("opacity","100%")
    else
    $(".main-container").css("opacity","50%")

}