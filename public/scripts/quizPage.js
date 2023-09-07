let a = 0;
if(a>=3)
{
    
}
async function activate(ele) {
    if (ele.requestFullscreen) {
       await ele.requestFullscreen();
       $("#staticBackdrop").modal('hide');
    }
}
document.documentElement.addEventListener("fullscreenchange",(e)=>{
    if(!document.fullscreenElement)
    {
        a++;
        $("#staticBackdrop").modal('show');
        console.log(a);
    }
})
document.documentElement.addEventListener("copy",(e)=>{
    e.preventDefault();
    Swal.fire({title:"Error",text:"Restricted Action",icon:"error"});
})

document.documentElement.addEventListener("dragover",(e)=>{
    e.preventDefault();
    Swal.fire({title:"Error",text:"Restricted Action",icon:"error"});
})
$(document).ready(function () {
    $("#staticBackdrop").modal('show');
});