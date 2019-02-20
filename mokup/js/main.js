$(".opentaskmodal").click(_=>{
    $("#taskmodal").fadeIn("50")
})

$(".closetaskmodal").click(_=>{
    $("#taskmodal").fadeOut("50")
})

$(".toggleuserpopup").click(_=>{
    $("#userpopup").fadeToggle("50")
})

$("#login").click(_=>{
    window.open("index.html","_self")
})

$("#logout").click(_=>{
    window.open("login.html","_self")
})

$(".slds-nav-vertical__item").click(function(){
    $(".slds-nav-vertical__item").removeClass("slds-is-active")
    $(this).addClass("slds-is-active")
})