$(document).ready(function () {
    $("#chart").css("width",$("#chart").width())
    getuserdata()

    $(".opentaskmodal").click(() =>{
        $("#taskmodal").fadeIn(100)
    })

    $(".closetaskmodal").click(() =>{
        $("#taskmodal").fadeOut(100)
        $("#addtask").trigger("reset")
    })

    $(".addtask").click(() =>{
        var name = $("#ajax-task-name").val()
        var start = $("#ajax-task-date-start").val()
        var end = $("#ajax-task-date-end").val()
        
        if (name && start && end)
            addtask(name, start, end)
        else
            alert('Non puoi lasciare vuoti dei campi.')
    })

    $(".toggleuserpopup").click(() =>{
        $("#userpopup").fadeToggle(100)
    })

    $("#login").submit(function (e){
        $(".slds-form-element__control").removeClass("slds-has-error")
        e.preventDefault()

        var user = $("#user").val()
        var pass = $("#pass").val()

        if (user !== "" && pass !== "")
            login(user, pass)
        else{
            if (user === "")
                $("#username-field").addClass("slds-has-error")
            if (pass === "")
                $("#password-field").addClass("slds-has-error")
        }      
    })

    $("#logout").click(() =>{
        localStorage.removeItem("ttk")
        window.open("/login","_self")
    })

    $("li.slds-nav-vertical__item").click(function(){
        $(".slds-nav-vertical__item").removeClass("slds-is-active")

        var e = $(this)
        var i = $(".slds-nav-vertical__item").index(e)
        e.addClass("slds-is-active")
        $("#ajax-current-project-name").html(e.children().html())
        
        build_table(projects_data[i].head,projects_data[i].body)
    })
})
