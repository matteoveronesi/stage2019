function login(user, pass, type){
    $.post( "/login",{ 
        username: user, 
        password: pass,
        auth: type 
    })
    .done(function(res){
        if (res.accept){
            localStorage.ttk = res.ttk;    
            window.open("/home","_self")
        }
        else if (res.refuse){
            $("#username-field").addClass("slds-has-error")
            $("#password-field").addClass("slds-has-error")
        }
    })
    .fail(function(res){
        console.error("LOGIN REQUEST ERROR")
        console.table(res)       
    })
}

function getuserdata(){
    $.post( "/data",{ 
        ttk: localStorage.ttk
    })      
    .done(function(res){
        if (res.accept){
            $("#ajax-username").text(res.username)
            var rows = build_rows(res.projects_data[0].body)

            google.charts.setOnLoadCallback(() => draw_chart(rows))
            build_table(res.projects_data[0].head, rows)
            build_list(res.projects_name)

            setTimeout(()=>$("#loader").fadeOut(100),900)
            setTimeout(()=>$("body").removeClass("noscroll"),1000)
        }
        else if (res.refuse){
            if (localStorage.ttk)
                setTimeout(()=>{
                    $("#loader-message").hide()
                    $("#loader-message-1").css("display","flex")
                },1000)
            else
                setTimeout(()=>{
                    $("#loader-message").hide()
                    $("#loader-message-2").css("display","flex")
                },1000)
        }
    })
    .fail(function(res){
        console.error("GETDATA REQUEST ERROR")
        console.table(res)       
    })
}


function addtask(name, start, end){
    $.post( "/add/task",{
        ttk: localStorage.ttk,
        name: name,
        start: start,
        end: end
    })      
    .done(function(res){
        if (res.accept){
            console.log("accettato")
            
            $("#addtask").trigger("reset")
            $("#taskmodal").fadeOut(100)
        }
        else if (res.refuse){
            console.log("non accettato")
        }
    })
    .fail(function(res){
        console.error("ADDTASK REQUEST ERROR")
        console.table(res)       
    })
}