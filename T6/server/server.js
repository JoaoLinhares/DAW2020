var http = require('http')
var axios = require('axios')
var static = require('./static')
var page = require('./html_page')

var {parse} = require('querystring')
const { geraHTML } = require('./html_page')


var json_server_url = 'http://localhost:3000'

// Aux. Functions
// Retrieves student info from request body --------------------------------
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

// Server setup

var toDoList = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Request processing
    // Tests if a static resource is requested
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
        // Normal request
        switch(req.method){
            case "GET":
                if(/\/$/.test(req.url)){
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    page.writePage(res, d)
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " not supported.</p>")
                    res.end()
                }
                break
            case "POST":
                if(/\/addTask$/.test(req.url)){
                    recuperaInfo(req, resultado => {
                        resultado.id = new Date().toISOString().substr(0, 19)
                        resultado.done = "false"
                        console.log('POST task:' + JSON.stringify(resultado))
                        axios.post(json_server_url + '/tasks', resultado)
                            .then(resp => {
                                res.writeHead(301, {'Content-Type': 'text/html;charset=utf-8', 'Location' : '/'})
                                page.writePage(res, d)
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Error POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Back</a></p>')
                                res.end()
                            })
                    })
                } else if(/\/edit\/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(req.url)){
                    var idTask = req.url.split("/").pop()
                    recuperaInfo(req, resultado => {
                        console.log('PUT task:' + JSON.stringify(resultado))
                        if(resultado["done"] != "true")
                            resultado.done = "false"
                        axios.put(json_server_url + '/tasks/' + idTask, resultado)
                            .then(resp => {
                                res.writeHead(301, {'Content-Type': 'text/html;charset=utf-8', 'Location' : '/'})
                                page.writePage(res, d)
                            })
                            .catch(erro => {
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Error PUT: ' + erro + '</p>')
                                res.write('<p><a href="/">Back</a></p>')
                                res.end()
                            })
                    })
                } else if(/\/remove\/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(req.url)){
                    var idTask = req.url.split("/").pop()
                    axios.delete(json_server_url + '/tasks/' + idTask)
                        .then(resp => {
                            res.writeHead(301, {'Content-Type': 'text/html;charset=utf-8', 'Location' : '/'})
                            page.writePage(res, d)
                        })
                        .catch(erro => {
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>Error Delete: ' + erro + '</p>')
                            res.write('<p><a href="/">Back</a></p>')
                            res.end()
                        })
                } else {
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " not supported.</p>")
                    res.end()
                }
                break
            default:
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " not supported.</p>")
                res.end() 
        }
    }
})

toDoList.listen(7666)
console.log('Servidor à escuta na porta 7666...')