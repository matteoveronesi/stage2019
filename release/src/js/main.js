$(document).ready(function () {
    $(".opentaskmodal").click(() =>{
        $("#taskmodal").fadeIn(100)
    })

    $(".closetaskmodal").click(() =>{
        $("#taskmodal").fadeOut(100)
        $("#addtask").trigger("reset")
    })

    $(".addtask").click(() =>{
        $("#waiting").show()
        var name = $("#ajax-task-name").val()
        var start = $("#ajax-task-date-start").val()
        var end = $("#ajax-task-date-end").val()
        if (name && start && end){
            addtask(name, start, end)
            $("#modal-error").removeClass("slds-m-bottom_medium")
        }
        else{
            $("#modal-error").text("Non puoi lasciare vuoti dei campi.")
            $("#modal-error").addClass("slds-m-bottom_medium")
            $("#waiting").hide()
        }
    })

    $(".toggleuserpopup").click(() =>{
        $("#userpopup").fadeToggle(100)
    })

    $("#login").submit(function (e){
        $("#waiting").show()
        $(".slds-form-element__control").removeClass("slds-has-error")
        e.preventDefault()

        var user = $("#user").val()
        var pass = $("#pass").val()

        if (user !== "" && pass !== "")
            login(user, pass)
        else{
            if (user === ""){
                $("#username-field").addClass("slds-has-error")
                if (pass != "") 
                    $("#login-error").text("Inserisci un Nome Utente.")
            }
            if (pass === ""){
                $("#password-field").addClass("slds-has-error")
                if (user != "") 
                    $("#login-error").text("Inserisci la Password.")
            }
            if (user == "" && pass == "")
                $("#login-error").text("Inserisci le credenziali.")

            $("#waiting").hide()
        }      
    })

    $("#logout").click(() =>{
        logout()
    })

    $("li.slds-nav-vertical__item").click(function(){
        $(".slds-nav-vertical__item").removeClass("slds-is-active")

        var e = $(this)
        var i = $(".slds-nav-vertical__item").index(e)
        e.addClass("slds-is-active")
        $("#ajax-current-project-name").html(e.children().html())
        
        build_table(projects_data[i].head, projects_data[i].body)
    })

    $(".change").click(() =>{
        $("body").toggleClass("body")
        $("div#gradient").fadeToggle(300)
        var ico1 = $("#avatar1")
        var ico2 = $("#avatar2")
        
        if (ico1.attr("src") == "assets/avatar.png"){
            ico1.attr("src","assets/avatar2.png")
            ico2.attr("src","assets/avatar2.png")
        }
        else{
            ico1.attr("src","assets/avatar.png")
            ico2.attr("src","assets/avatar.png")
        }
    })
})

function logout(){
    localStorage.removeItem("ttk")
    window.open("/login","_self")
}