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
var users_token = []
var users_id = []
var salesforce

//developer mode - disable the login phase
var dev = true

function log(str){ console.log(str) }

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

server.post('/data', encoded, function(req, res){
    var index = users_token.indexOf(req.body.ttk)

    if (dev){
        index = 0
        users_id[0] = "MarioRossi"
    } 

    if (index != -1){
        res.json({
            accept: true,
            username: users_id[index],
            projects_name: ["Tutti"],
            projects_data: [
                {
                    head: ["Task ID", "Nome Task", "Risorsa", "Data di inizio lavorazione", "Data di fine lavorazione prevista", "Durata", "Stato", "Dipendenze"],
                    body: [
                        ['003245', 'Analisi', 'Analisi', ['2019', '0', '1'], ['2019', '0', '2'], 0, 0, null],
                        ['001249', 'Progettazione', 'Progettazione', ['2019', '0', '2'], ['2019', '0', '3'], 0, 0, null],
                        ['003243', 'Realizzazione', 'Realizzazione', ['2019', '0', '3'], ['2019', '0', '4'], 0, 0, null],
                        ['002302', 'Testing', 'Testing', ['2019', '0', '4'], ['2019', '0', '5'], 0, 0, null],
                        ['003421', 'Produzione', 'Produzione', ['2019', '0', '5'], ['2019', '0', '6'], 0, 0, null]/*,
                        ['007895', 'Analisi', 'Analisi', ['2019', '0', '1'], ['2019', '0', '2'], 0, 0, null],
                        ['008975', 'Progettazione', 'Progettazione', ['2019', '0', '2'], ['2019', '0', '3'], 0, 0, null],
                        ['006328', 'Realizzazione', 'Realizzazione', ['2019', '0', '3'], ['2019', '0', '4'], 0, 0, null],
                        ['008762', 'Testing', 'Testing', ['2019', '0', '4'], ['2019', '0', '5'], 0, 0, null],
                        ['001476', 'Produzione', 'Produzione', ['2019', '0', '5'], ['2019', '0', '6'], 0, 0, null],
                        ['004373', 'Analisi', 'Analisi', ['2019', '0', '1'], ['2019', '0', '2'], 0, 0, null],
                        ['007865', 'Progettazione', 'Progettazione', ['2019', '0', '2'], ['2019', '0', '3'], 0, 0, null],
                        ['008651', 'Realizzazione', 'Realizzazione', ['2019', '0', '3'], ['2019', '0', '4'], 0, 0, null],
                        ['007645', 'Testing', 'Testing', ['2019', '0', '4'], ['2019', '0', '5'], 0, 0, null],
                        ['008462', 'Produzione', 'Produzione', ['2019', '0', '5'], ['2019', '0', '6'], 0, 0, null],
                        ['0', 'Analisi', 'Analisi', ['2019', '0', '1'], ['2019', '0', '2'], 0, 0, null],
                        ['1', 'Progettazione', 'Progettazione', ['2019', '0', '2'], ['2019', '0', '3'], 0, 0, null],
                        ['2', 'Realizzazione', 'Realizzazione', ['2019', '0', '3'], ['2019', '0', '4'], 0, 0, null],
                        ['3', 'Testing', 'Testing', ['2019', '0', '4'], ['2019', '0', '5'], 0, 0, null],
                        ['4', 'Produzione', 'Produzione', ['2019', '0', '5'], ['2019', '0', '6'], 0, 0, null],
                        ['5', 'Analisi', 'Analisi', ['2019', '0', '1'], ['2019', '0', '2'], 0, 0, null],
                        ['6', 'Progettazione', 'Progettazione', ['2019', '0', '2'], ['2019', '0', '3'], 0, 0, null],
                        ['7', 'Realizzazione', 'Realizzazione', ['2019', '0', '3'], ['2019', '0', '4'], 0, 0, null],
                        ['8', 'Testing', 'Testing', ['2019', '0', '4'], ['2019', '0', '5'], 0, 0, null],
                        ['9', 'Produzione', 'Produzione', ['2019', '0', '5'], ['2019', '0', '6'], 0, 0, null]*/
                    ]
                }
            ]
            
        })            
    }
    else
        res.json({
            refuse: true
        })
})

server.post('/login', encoded, function(req, res, next){
    if (users_token.length > 100){
        users_token = []
        users_id = []
    }

    var name = req.body.username
    var pass = req.body.password    
    var token = ""

    if (name && pass){
        if (name === "MarioRossi" && pass === "ciao123"){
            do{
                token = ttk.keygen()
            } while (users_token.indexOf(token) !== -1)

            users_token.push(token)
            users_id.push(name)

            res.json({
                accept: true,
                ttk: token
            })            
        }
        else
            res.json({
                refuse: true
            })
    }
    else
        next()
})

server.post('/add/task', encoded, function(req, res, next){
    var index = users_token.indexOf(req.body.ttk)
    
    if (dev){
        index = 0
        users_id[0] = "MarioRossi"
    } 

    if (index != -1){
        var task_name = req.body.name
        var task_start = req.body.start
        var task_end = req.body.end

        log("TASK RICEVUTO DA " + users_id[index] + ":\n" + task_name+"\n" + task_start + "\n" + task_end)
        
        res.json({
            accept: true
        })   
    }
    else
        res.json({
            refuse: true
        })   
})

server.get('/auth', function(req, res, next){
    var refresh_token = req.query.refresh_token
    var code = req.query.code

    if (code != undefined){
        create_token(TOKEN_PATH, code)
        next()
        res.sendFile(path.join(__dirname, 'views', 'success.html'))
    }
    else
        next()

    if (refresh_token){
        log('Trovato refresh_token, salvataggio in corso...')
        save_token(TOKEN_PATH, refresh_token)
    }
})

server.get('/', function(req, res){
    res.redirect('/login')
})

server.all('*', function(req, res, next){
    res.sendFile(path.join(__dirname, 'views', 'error.html'))
})

function init(){
    log('Ricerca token in ' + TOKEN_PATH + ' ...')
    
    if (fs.existsSync(TOKEN_PATH)){
        log('Token trovato, lettura in corso...')
        fs.readFile(TOKEN_PATH, function(err, token){
            if (err)
                log(err)
            else{
                log('Lettura completata.')
                connect(JSON.parse(token))          
            }
        })
    }
    else{
        log('Token non trovato, procedura di login avviata.')
        login()
    }     
}

function connect(cred){
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

    //salva il token quando esegue il refresh
    salesforce.on("refresh", function(accessToken, res){
        log('Richiesta refresh token...')
        cred.access_token = accessToken
        log('Refresh token salvato.')
    })
    
}

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
                        log('Impossibile aprire il link, prova manualmente:')                        
                        log(response.request.res.responseUrl)
                        log(stderr)
                    }
                })
            } 
            else{
                log('Impossibile completare la richiesta.')
                log(response.data.url)
                log(response.data.explanation)
            }
        })
        .catch(error =>{
            log('Impossibile effettuare la richiesta.')
            log(error)
        })
}

function create_token(TOKEN_PATH, code){
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
            save_token(TOKEN_PATH, response.data)
        })
        .catch(error =>{
            log('Impossibile effettuare la richiesta.')
            log(error)
        })
}

function save_token(TOKEN_PATH, token){
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), () =>{})
    log('Token salvato in ' + TOKEN_PATH)
}

// init salesforce auth phase
init()

server.listen(3000,() => log(colors.green('[Running on ' + ip.address() + ':3000]')))