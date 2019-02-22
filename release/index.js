const encoded = require('body-parser').urlencoded({ extended: false })
const ttk = require('./keygen/timetokey')
const{exec} = require('child_process')
const conf = require('./auth/conf')
const express = require('express')
const jsforce = require('jsforce')
const colors = require('colors')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const ip = require('ip')
const server = express()

var TOKEN_PATH = __dirname + '\\auth\\token.json'
var accounts_name = []
var accounts_id = []
var users_token = []
var users_email = []
var users_name = []
var users_id = []
var salesforce
var auth_route = true

function log(str, n){ 
    if (n == 1)
        console.log(str.red)
    else if (n == 2)
        console.log(str.green) 
    else if (n == 3)
        console.log(str.yellow) 
    else if (n == 4)
        console.log(str.cyan) 
    else
        console.log(str) 
}

server.use(express.static(path.join(__dirname, 'src')))

server.get('/', function(req, res){
    res.redirect('/login')
})

server.get('/login', function(req, res){
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})

server.get('/home', function(req, res){
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

server.get('/done', function (req, res, next){
    if (auth_route){
        auth_route = false
        res.sendFile(path.join(__dirname, 'views', 'success.html'))
    }
    else
        next()
})

/**
 * Convalida i dati di login inviati dal client e invia il token
 * per identificarlo.
 */
server.post('/login', encoded, function(req, res, next){
    // resetta i dati se vi sono più di 100 utenti salvati
    if (users_token.length > 100){
        log('Pulizia dati...',3)
        accounts_name = []
        accounts_id = []
        users_token = []
        users_email = []
        users_name = []
        users_id = []
        log('Pulizia completata.',3)
    }

    var name = req.body.username
    var pass = req.body.password    
    var token = ""

    if (name && pass){
        if (name.match(/[']/) == null && pass.match(/[']/) == null){
            log('Contact query in corso...')
            query("SELECT Id, AccountId, Account.Name, Name, Email FROM Contact"
                + " WHERE PortalUsername__c='"+ name +"' AND PortalPassword__c='"+ pass +"'")
                .then(result =>{
                    if (result.done){
                        if (result.totalSize == 1){
                            var rid = result.records[0].Id
                            var rname = result.records[0].Name
                            var email = result.records[0].Email
                            var ridaccount = result.records[0].AccountId
                            var raccount = result.records[0].Account.Name

                            log('Contact trovato.')
                            //log('id contact: ' + rid)
                            //log('contact name: ' + rname)
                            //log('id account: ' + ridaccount)
                            //log('account name: ' + raccount)
                            
                            do{
                                log('Generazione token...')
                                token = ttk.keygen()
                            } while (users_token.indexOf(token) !== -1)
                            log('Generazione completata.')
                            
                            log('Salvataggio dei dati...')
                            accounts_name.push(raccount)
                            accounts_id.push(ridaccount)
                            users_token.push(token)
                            users_email.push(email)
                            users_name.push(rname)
                            users_id.push(rid)
                            log('Salvataggio completato.')

                            res.json({
                                accept: true,
                                ttk: token
                            })
                        }
                        else{
                            log('Nessun Contact trovato. Accesso negato.',1)
                            res.json({
                                refuse: true
                            })
                        }
                    }
                    else
                        log('Contact query non eseguita. Errore di Salesforce.',1) 
                })
        }
        else
            log('Trovati caratteri non validi, Contact query non eseguita.',1)
    }
    else
        next()
})

/**
 * Invia i dati dei progetti al client.
 */
server.post('/data', encoded, function(req, res){
    var index = users_token.indexOf(req.body.ttk)

    if (index != -1){
        log('Case query in corso...')
        query("SELECT CaseNumber, Subject, WorkingStartDate__c, ForecastedEndingDate__c"
            + " FROM Case WHERE AccountId='"+ accounts_id[index] +"' AND IsVisibleOnPortal__c=true")
            .then(result =>{
                if (result.done){
                    if (result.totalSize > 0){
                        var subject = []
                        var number = []
                        var start = []
                        var end = []

                        log(result.records.length + ' Case trovati, invio in corso...')
                        for(var i = 0; i < result.records.length; ++i){
                            //log('Case ' + i)
                            //log('Case number: ' + result.records[i].CaseNumber)
                            //log('Subject: ' + result.records[i].Subject)

                            subject.push(result.records[i].Subject)
                            number.push(result.records[i].CaseNumber)
                            start.push(result.records[i].WorkingStartDate__c)
                            end.push(result.records[i].ForecastedEndingDate__c)
                        }

                        res.json({
                            accept: true,
                            username: users_name[index],
                            email: users_email[index],
                            account: accounts_name[index],
                            projects_name: ["Elenco Casi"],
                            projects_data: data_to_charts(subject, number, start, end)
                        })     
                        log('Case inviati.')
                    }
                    else
                        log('Nessun Case trovato.',1)
                }
                else
                    log('Case query non eseguita.',1)
            })       
    }
    else{
        res.json({
            refuse: true
        })
    }
})

/**
 * Crea l'oggetto Case dai dati inviati dal portale.
 */
server.post('/add/task', encoded, function(req, res, next){
    var index = users_token.indexOf(req.body.ttk)

    if (index != -1){
        log('Richiesta aggiunta di un Case...')
        var task_name = req.body.name
        var task_start = req.body.start
        var task_end = req.body.end

        if(task_start.match(/[\d-]/) != null &&
            task_end.match(/[\d-]/) != null &&
            task_name.match(/[']/) == null){
            //log("TASK RICEVUTO DA " + users_name[index] + " (" + users_id[index] + "):\n" 
            //+ "Oggetto:" + task_name+"\n" + task_start + "\n" + task_end)
    
            salesforce.sobject("Case").create({ 
                status: 'new', 
                origin: 'web', 
                subject: task_name,
                contactid: users_id[index],
                WorkingStartDate__c: task_start, 
                ForecastedEndingDate__c: task_end,
                IsVisibleOnPortal__c: true
            }, 
            function(err, ret) {
                if (err) 
                    log(err, 1)
                if (!ret.success)
                    log('Case non creato.', 1)
                else
                    log("Case creato. ID: " + ret.id)
            })

            res.json({
                accept: true
            })   
        }
        else{
            log('Trovati caratteri non validi, richiesta nuovo Case non accettata.',1)
            res.json({
                refuse: true
            })  
        }
    }
})

server.post('/status', encoded, function(req, res){
    var index = users_token.indexOf(req.body.ttk)

    if (index != -1)
        res.json({
            accept: true
        }) 
    else
        res.json({
            refuse: true
        }) 
})

/**
 * Route riservata che aspetta il token di connessione da Salesforce
 * per poi salvarlo sul file indicato dal TOKEN_PATH.
 */
server.get('/auth', function(req, res, next){
    if (auth_route){
        var refresh_token = req.query.refresh_token
        var code = req.query.code

        if (code != undefined){
            log('Conferma di connessione a Salesforce ricevuta.')
            create_token(code)
            res.redirect('/done')
        }
        else
            next()

        if (refresh_token){
            log('Trovato refresh_token, salvataggio in corso...',3)
            save_token(refresh_token)
        }
    }
    else
        next()
})

server.all('*', function(req, res, next){
    res.sendFile(path.join(__dirname, 'views', 'error.html'))
})

/**
 * Inizializza la procedura di connessione a Salesforce
 * la prima volta che viene avviata l'applicazione.
 */
function init(){
    log('\n +-------------------------------+\n '
        + '|   Salesforce Project Viewer   |\n '
        + '|   Creato da Matteo Veronesi   |\n '
        + '|   github.com/matteoveronesi   |\n '
        + '|    Ver:2.0.0   www.gnet.it    |\n '
        + '+-------------------------------+\n',4)
    log('Ricerca token in ' + TOKEN_PATH + ' ...')
    
    if (fs.existsSync(TOKEN_PATH)){
        log('Token trovato, lettura in corso...')
        fs.readFile(TOKEN_PATH, function(err, token){
            if (err)
                log(err,1)
            else{
                log('Lettura completata.')
                connect(JSON.parse(token))       
                start_server()   
            }
        })
    }
    else{
        log('Token non trovato, procedura di login avviata.',3)
        login()
        start_server()
    }     
}

/**
 * Crea una nuova connessione OAuth2 a Salesforce tramite le
 * credenziali precedentemente salvate e i dati del proprio
 * Salesforce.
 * 
 * @param {Object} cred contiene le credenziali per l'accesso
 */
function connect(cred){
    log('Connessione a Salesforce in corso...')
    salesforce = new jsforce.Connection({
        oauth2:{
            loginUrl: conf.loginUrl,
            clientId: conf.cid,
            clientSecret: conf.cs,
            redirectUri: conf.cb
        },
            instanceUrl: cred.instance_url,
            accessToken: cred.access_token,
            refreshToken: cred.refresh_token,
            maxRequest: 200
        })

    salesforce.on("refresh", function(accessToken, res){
        log('Richiesta refresh token...')
        cred.access_token = accessToken
        log('Refresh token salvato.')
    })

    log('Connessione effettuata.')
}

/**
 * Esegue il primo login a Salesforce tramite il link costruito 
 * sui dati del proprio Salesforce.
 */
function login(){
    var url = conf.urlauth
    url += '?response_type=code'
    url += '&client_id=' + encodeURIComponent(conf.cid)
    url += '&redirect_uri=' + conf.cb

    log('Richiesta login a Salesforce in corso...')
    axios.get(url)
        .then(response =>{
            if (response.status == 200){
                log('Richiesta completata.')
                exec('start ' + response.request.res.responseUrl, (err, stdout, stderr) =>{
                    if (err){
                        log('Impossibile aprire il link, prova manualmente:',2)                        
                        log(response.request.res.responseUrl,4)
                        if (process.platform === "win32")
                            log(stderr,1)
                    }
                })
            } 
            else{
                log('Impossibile completare la richiesta.',1)
                log(response.data.url,1)
                log(response.data.explanation,1)
            }
        })
        .catch(error =>{
            log('Impossibile effettuare la richiesta.',1)
            log(error,1)
        })
}

/**
 * Crea il token da salvare richiedendolo tramite il link costruito 
 * sui dati del proprio Salesforce.
 * 
 * @param {string} code il codice creato da salesforce per la connessione
 */
function create_token(code){
    var url = conf.urltoken
    url += '?grant_type=authorization_code'
    url += '&client_id=' + conf.cid
    url += '&client_secret=' + conf.cs
    url += '&code=' + code
    url += '&redirect_uri=' + conf.cb

    log('Richiesta token in corso...')
    axios.get(url)
        .then(response =>{
            log('Richiesta completata, salvataggio token in corso...')
            save_token(response.data)
        })
        .catch(error =>{
            log('Impossibile effettuare la richiesta.',1)
            log(error,1)
        })
}

/**
 * Salva sul file indicato dal TOKEN_PATH il relativo token.
 * 
 * @param {*} token il token da salvare sul file
 */
function save_token(token){
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), () =>{
        log('Token salvato in ' + TOKEN_PATH)
    })
}

/**
 * Esegue la relativa query a salesforce.
 * 
 * @param  {string} query la query da eseguire su Salesforce
 * @return {object}       l'oggetto contenente il risultato della query
 */
function query(query){
    return new Promise(function(resolve){
        salesforce.query(query, function(err, result){
            if (err)
                log(err, 1)
            else
                resolve(result) 
        })
    })
}

/**
 * Converte i dati di Salesforce (divisi in vari array) 
 * in un oggetto comprensibile da Google Charts.
 * 
 * @param  {array}  subject contiene i nomi dei task
 * @param  {array}  number  contiene i campi id
 * @param  {array}  start   contiene le date di inizio
 * @param  {array}  end     contiene le date di fine
 * @return {array}          l'array di oggetti convertito 
 */
function data_to_charts(subject, number, start, end){
    var projects_data = [{
        head: [
            "Numero Task", "Nome Task", "Risorsa", "Data di Inizio Lavorazione", 
            "Data di Fine Lavorazione Prevista", "Durata", "Stato", "Dipendenze"
        ],
        body: []
    }]

    // ricava per ogni case la data e costruisce l'array dei dati in modo che Charts li capisca
    for (var i = 0; i < subject.length; ++i){
        var syear = start[i].slice(0,4)
        var smonth = start[i].slice(5,7)
        var sday = start[i].slice(8,10)
        var eyear = end[i].slice(0,4)
        var emonth = end[i].slice(5,7)
        var eday = end[i].slice(8,10)

        projects_data[0].body.push([
            number[i], subject[i], subject[i], [syear, --smonth+"", sday], 
            [eyear, --emonth+"", eday], 0, 0, null
        ])
    }

    return projects_data
}

/**
 * Mette il server in ascolto sulla porta 3000
 */
function start_server(){
    server.listen(3000,() => log('[Server in esecuzione su ' + ip.address() + ':3000]', 2))
}

// init salesforce auth phase
init()