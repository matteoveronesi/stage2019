/**
 * Esegue una chiamata di login al server con le credenziali inserite
 * 
 * @param {string} user contiene il nome utente inserito
 * @param {string} pass contiene la password inserita
 */
function login(user, pass){
    $.post( "/login",{ 
        username: user, 
        password: pass
    })
    .done(function(res){
        if (res.accept){
            localStorage.ttk = res.ttk;    
            window.open("/home","_self")
        }
        else if (res.refuse){
            $("#login-error").text("Credenziali errate.")
            $("#username-field").addClass("slds-has-error")
            $("#password-field").addClass("slds-has-error")
        }

        $("#waiting").hide()
    })
    .fail(function(res){
        $("#login-error").text("Non è stato possibile eseguire la richiesta di login, riprova più tardi.")
        $("#waiting").hide()
    })
}

/**
 * Esegue una chiamata al server per ricevere i dati dell'utente
 * 
 * @param {boolean} load indica se la richiesta viene fatta al caricamento della pagina o no
 */
function getuserdata(load){
    $("#waiting").show()

    $.post( "/data",{ 
        ttk: localStorage.ttk
    })      
    .done(function(res){
        if (res.accept){
            $("#ajax-username").text(res.username)
            $("#ajax-account-contact-info").text(res.account + " • " + res.username)
            
            var rows = build_rows(res.projects_data[0].body)
            
            google.charts.setOnLoadCallback(() => draw_chart(rows))
            build_table(res.projects_data[0].head, rows)
            build_list(res.projects_name)

            setTimeout(()=>$("#loader").fadeOut(100),700)
            setTimeout(()=>{
                $("body").removeClass("noscroll")   
                $("#waiting").hide()
                if (load)
                    build_alert("login", "", "logout", "Esci", res.username, res.email)
            },800)
        }
        else if (res.refuse){
            if (localStorage.ttk)
                setTimeout(()=>{
                    $("#loader-message").hide()
                    $("#loader-message-1").css("display","flex")
                    $("#waiting").hide()
                },800)
            else
                setTimeout(()=>{
                    $("#loader-message").hide()
                    $("#loader-message-2").css("display","flex")
                    $("#waiting").hide()
                },800)
        }
    })
    .fail(function(res){
        build_alert("error", "Non è stato possibile recuperare i dati, riprova più tardi.","","") 
        $("#waiting").hide()
    })
}

/**
 * Esegue una chiamata al server per aggiungere un nuovo task
 * 
 * @param {string} name contiene il nome del task da aggiungere
 * @param {string} start contiene la data di inizio sotto forma di stringa
 * @param {string} end contiene la data di fine sotto forma di stringa
 */
function addtask(name, start, end){
    $.post( "/add/task",{
        ttk: localStorage.ttk,
        name: name,
        start: start,
        end: end
    })      
    .done(function(res){
        if (res.accept){
            build_alert("success", "Task " + name + " aggiunto.","","") 
            
            $("#addtask").trigger("reset")
            $("#taskmodal").fadeOut(100)

            setTimeout(() => {
                getuserdata()
            }, 500)
        }
        else if (res.refuse){
            build_alert("error", "Il Task " + name + " non è stato aggiunto poiché contiene caratteri non validi (').","","") 
        }
        
        $("#waiting").hide()
    })
    .fail(function(res){
        build_alert("error", "Non è stato possibile aggiungere il Task, riprova più tardi.","","") 
        $("#waiting").hide()
    })
}

/**
 * Osserva la connessione al server per informare l'utente nel caso non possa collegarsi
 */
function startobserver(){
    var obs = setInterval(() => {
        $.post("/status",{
            ttk: localStorage.ttk
        })      
        .done(function(res){
            if (res.accept)
                $(".slds-theme_offline").fadeOut(300)
            else{
                $(".slds-theme_offline").fadeOut(300)
                if ($("#loader-message").css("display") != "none")
                    build_alert("disconnected", "Sei stato disconnesso dal server: alcune funzionalità non saranno disponibili.", "logout", "Accedi")
                clearInterval(obs) 
            }
        })
        .fail(function(res){
            if ($("#loader-message").css("display") != "none")
                build_alert("offline", "Sei in modalità offline: alcune funzionalità non saranno disponibili.","","") 
        })
    }, 2000)
}