function build_rows(rows){
    for (var i = 0; i < rows.length; ++i){
        for (var j = 0; j < rows[i].length; ++j){
            if (j === 3 || j === 4){
                temp = new Date(rows[i][j][0], rows[i][j][1], rows[i][j][2])
                rows[i][j] = temp
            }
        }
    }
    return rows
}

function build_table(head, body){    
    var outhead = '<tr class="slds-line-height_reset">'
    head.forEach((e,i) =>{
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

//function build_chart(){}