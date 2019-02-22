/**
 * Converte i campi relativi alle date da String a Date
 * 
 * @param {array} rows contiene le righe di un progetto, ovvero i case
 */
function build_rows(rows){
    for (var i = 0; i < rows.length; ++i){
        for (var j = 0; j < rows[i].length; ++j){
            // i campi delle date sono alla posizione 3 e 4 (vedi data_to_charts() in index.js)
            if (j === 3 || j === 4){
                temp = new Date(rows[i][j][0], rows[i][j][1], rows[i][j][2])
                rows[i][j] = temp
            }
        }
    }
    return rows
}

/**
 * Costruisce la tabella in HTML partendo dai dati di un progetto
 * 
 * @param {array} head contiene i label dei campi selezionati per i Case di un progetto
 * @param {array} body contiene i valori dei Case di un progetto
 */
function build_table(head, body){    
    var outhead = '<tr class="slds-line-height_reset">'
    head.forEach((e,i) =>{
        // filtra i campi voluti
        if (i < 5)
            if (i != 2)
                outhead += '<th scope="col"><div class="slds-p-around_xx-small slds-p-vertical_x-small" title="' + e + '"><b>' + e + '</b></div></th>'  
    })
    outhead += '</tr>'
    
    var outbody = ''
    body.forEach(e =>{
        outbody += '<tr class="slds-hint-parent">'
        e.forEach((e,i) =>{            
            //if (i > 1)
                //e = e.getDate() + "/" + e.getMonth() + "/" + e.getFullYear()
        
            // filtra i campi voluti
            if (i == 0)
                outbody += '<th scope="row"><div class="slds-p-around_xx-small">' + e + '</div></th>'
            else
                if (i < 5)
                    if (i != 2)
                        if (i == 3 || i == 4){
                            var month = e.getMonth() + 1
                            outbody += '<td><div class="slds-p-around_xx-small">' + e.getDate() + "/" + month + "/" + e.getFullYear() + '</div></td>'
                        }
                        else
                            outbody += '<td><div class="slds-p-around_xx-small">' + e + '</div></td>'
        })
        outbody += '</tr>'
    })
    
    $("#ajax-table-head").html(outhead)
    $("#ajax-table-body").html(outbody)
}

/**
 * Costruisce la lista dei progetti 
 * 
 * @param {array} projects_name contiene i nomi dei progetti presenti
 */
function build_list(projects_name){
    var out = ''
    projects_name.forEach((e,i) => {
        if (i == 0)
            out += '<li class="slds-nav-vertical__item slds-is-active">'
        else
            out += '<li class="slds-nav-vertical__item">'
        out += '<a class="slds-nav-vertical__action">' + e + '</a></li>'
    })

    $("#ajax-current-project-name").html(projects_name[0])
    $("#ajax-projects-list").html(out)
}

var alertid = 0
/**
 * Costruisce in HTML un slds alert in base ai parametri dati
 * 
 * @param {string} type contiene il tipo di alert 
 * @param {string} text contiene il messaggio dell'alert
 * @param {string} funcname contiene il nome della funzione da richiamare
 * @param {string} functext contiene il nome del link
 * @param {string} user contiene il nome dell'utente
 * @param {string} email contiene l'email dell'utente
 */
function build_alert(type, text, funcname, functext, user, email){
    var id = "alert" + alertid
    var sec = 4000
    var button = ''
    var path = ''

    if (type != "offline"){
        button += '<div class="slds-notify__close">'
            + '<button onclick="$(\'.' + id + '\').fadeOut(300)" class="slds-button slds-button_icon slds-button_icon-small slds-button_icon-inverse" title="Close">'
            + '<img src="assets/close.svg" width="10px" style="margin-bottom:1px">'
            + '<span class="slds-assistive-text">Close</span></button></div>'

        if (type != "disconnected")
            setTimeout(() => {
                $("." + id + "").fadeOut(300)
            }, sec)
    }

    if (type == "success"){
        type = "info"
        path = '<path d="M12 .9C5.9.9.9 5.9.9 12s5 11.1 11.1 11.1 11.1-5 11.1-11.1S18.1.9 12 .9zm6.2 8.3l-7.1 7.2c-.3.3-.7.3-1 0l-3.9-3.9c-.2-.3-.2-.8 0-1.1l1-1c.3-.2.8-.2 1.1 0l2 2.1c.2.2.5.2.7 0l5.2-5.3c.2-.3.7-.3 1 0l1 1c.3.2.3.7 0 1z"></path>'
    }
    else if (type == 'login'){
        type = 'info'
        text = 'Accesso effettuato come ' + user
        if (email != null)
            text += ' (' + email + ')'
        text += '.'
        sec = 6000
        path = '<path fill="#ffffff" fill="#ffffff" d="M23.1 19.8v1.1c0 1.2-1 2.2-2.2 2.2H3.1c-1.2 0-2.2-1-2.2-2.2v-1.1c0-2.6 3.2-4.3 6.1-5.6l.3-.1c.2-.1.5-.1.7 0 1.2.8 2.5 1.2 4 1.2s2.8-.4 3.9-1.2c.3-.1.5-.1.7 0l.3.1c3 1.3 6.2 2.9 6.2 5.6zM12 .9c3 0 5.5 2.7 5.5 6.1S15 13.1 12 13.1 6.5 10.4 6.5 7 9 .9 12 .9z"></path>'
    }
    else if (type == "error")
        path = '<path fill="#ffffff" d="M12 .9C5.9.9.9 5.9.9 12s5 11.1 11.1 11.1 11.1-5 11.1-11.1S18.1.9 12 .9zM3.7 12c0-4.6 3.7-8.3 8.3-8.3 1.8 0 3.5.5 4.8 1.5L5.2 16.8c-1-1.3-1.5-3-1.5-4.8zm8.3 8.3c-1.8 0-3.5-.5-4.8-1.5L18.8 7.2c1 1.3 1.5 3 1.5 4.8 0 4.6-3.7 8.3-8.3 8.3z"></path>'   
    else if (type == "disconnected")
        type = "offline"

    if (type == "offline")
        path = '<path fill="#ffffff" d="M16 16.7c.2-.3.2-.6 0-.9l-.8-.8c-.2-.2-.6-.2-.8 0l-2.1 2c-.1.2-.4.2-.5 0l-2.1-2c-.2-.2-.6-.2-.8 0l-.8.8c-.3.3-.3.6 0 .9l2 2c.1.1.1.4 0 .5l-2 2.1c-.3.2-.3.6 0 .8l.8.8c.2.3.6.3.8 0l2.1-2c.1-.1.4-.1.5 0l2.1 2c.2.3.6.3.8 0l.8-.8c.2-.2.2-.6 0-.8l-2-2.1c-.2-.1-.2-.4 0-.5l2-2zm6-11.3C19.5 2.5 15.9 1 12 1S4.6 2.5 2.1 5.4c-.2.1-.2.5 0 .6l1.4 1.2c.2.2.5.1.7 0C6.2 5 9 3.7 12 3.7s5.9 1.3 7.9 3.5c.2.1.5.1.7 0L22 6c.2-.2.2-.5 0-.6zm-10 2c-1.9 0-3.7.9-5 2.3-.2.2-.2.5 0 .7l1.5 1.1c.2.2.5.2.6 0 .8-.8 1.8-1.3 2.9-1.3s2.2.5 3 1.2c.1.2.4.2.6.1l1.4-1.1c.3-.2.3-.5.1-.7C15.8 8.3 14 7.4 12 7.4z"></path>'

    $(".slds-scope").append('<div class="' + id + ' slds-notify slds-notify_alert slds-theme_alert-texture slds-theme_' + type + '" role="alert" style="width:60%;position:fixed;top:60px;left:20%;right:20%;z-index:9009;">'
        + '<span class="slds-assistive-text">' + type + '</span>'
        + '<span class="slds-icon_container slds-icon-utility-user slds-m-right_x-small"><svg style="margin-bottom:2px" class="slds-icon slds-icon_x-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">' + path + '</svg></span>'
        + '<h2>' + text + ' <a href="javascript:' + funcname + '();">' + functext + '</a></h2>' + button + '</div>')
    
    ++alertid
}