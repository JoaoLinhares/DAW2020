var http = require('http')
var axios = require('axios')

var json_server = 'http://localhost:3001'

var mime = {
    html: 'text/html; charset=utf-8',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

http.createServer(function(req, res) {
    console.log(req.method + ' ' + req.url + ' ' + new Date().toISOString().substring(0,16))
    if(req.method == 'GET'){
        if(req.url.match(/^\/$/)){
            send_Index(res, mime.html)
        
        } else if(req.url.match(/^\/alunos($|\?)/)){
            send_Alunos(req, res, mime.html)
        
        } else if(req.url.match(/^\/cursos($|\?)/)){
            send_Cursos(req, res, mime.html)
        
        } else if(req.url.match(/^\/instrumentos($|\?)/)){
            send_Instrumentos(req, res, mime.html)
        
        } else if(req.url.match(/^\/alunos\/[a-zA-Z0-9\-]+$/)){
            send_Aluno(req, res, mime.html)
        
        } else if(req.url.match(/^\/cursos\/[a-zA-Z0-9]+$/)){
            send_Curso(req, res, mime.html)

        } else if(req.url.match(/^\/instrumentos\/[a-zA-Z0-9]+$/)){
            send_Instrumento(req, res, mime.html)

        } else {
            send_Error_Not_Found(res, mime.html)
        }
    } else{
        send_Error(req, res, mime.html)
    }
}).listen(7555);

console.log('Servidor à escuta na porta 7555...')


function send_Index(res, content){
    res.writeHead(200, {'Content-Type' : content})
    res.write('<h2>Escola de Música</h2>')
    res.write('<ul>')
    res.write('<li><a href="/alunos">Lista de Alunos</a></li>')
    res.write('<li><a href="/cursos">Lista de Cursos</a></li>')
    res.write('<li><a href="/instrumentos">Lista de Instrumentos</a></li>')
    res.write('</ul>')
    res.end()
}

function send_Alunos(req, res, content){
    axios.get(json_server +  req.url)
    .then(function(resp) {
        alunos = resp.data;
        res.writeHead(200, {'Content-Type' : content})
        res.write('<h2>Escola de Música: Lista de alunos</h2>')
        res.write('<ul>')
        alunos.forEach( a => {
           res.write('<li><a id=' + a.id + ' href="/alunos/' + a.id + '">' + a.id +  '</a> - ' + a.nome + '</li>')
        });
        res.write('</ul>')

        if(resp.headers['link']){
            paging(res, resp.headers['link'])
        }

        res.write('<address>[<a href="/"> Voltar </a>}</address>')
        res.end()
    })
    .catch(function(error){
        console.log('Erro ao obter a lista de alunos: ' + error)
        send_Error_Not_Found(res, mime.html)
    })
}

function send_Cursos(req, res, content){
    axios.get(json_server + req.url)
    .then(function(resp) {
        cursos = resp.data;
        res.writeHead(200, {'Content-Type' : content})
        res.write('<h2>Escola de Música: Lista de Cursos</h2>')
        res.write('<ul>')
        cursos.forEach( c => {
           res.write('<li><a id=' + c.id + ' href="/cursos/' + c.id + '">' + c.id +  '</a> - ' + c.designacao + '</li>') //tentar paginação
        });
        res.write('</ul>')

        if(resp.headers['link']){
            paging(res, resp.headers['link'])
        }

        res.write('<address>[<a href="/"> Voltar </a>}</address>')
        res.end()
    })
    .catch(function(error){
        console.log('Erro ao obter a lista de cursos: ' + error)
        send_Error_Not_Found(res, mime.html)
    })
}

function send_Instrumentos(req, res, content){
    axios.get(json_server + req.url)
    .then(function(resp) {
        instrumentos = resp.data;
        res.writeHead(200, {'Content-Type' : content})
        res.write('<h2>Escola de Música: Lista de Instrumentos</h2>')
        res.write('<ul>')
        instrumentos.forEach( i => {
           res.write('<li><a id=' + i.id + ' href="/instrumentos/' + i.id + '">' + i.id +  '</a> - ' + i['#text'] + '</li>') //tentar paginação
        });
        res.write('</ul>')
        
        if(resp.headers['link']){
            paging(res, resp.headers['link'])
        }

        res.write('<address>[<a href="/"> Voltar </a>}</address>')
        res.end()
    })
    .catch(function(error){
        console.log('Erro ao obter a lista de instrumentos: ' + error)
        send_Error_Not_Found(res, mime.html)
    })
}

function send_Aluno(req, res, content){
    axios.get(json_server + req.url)
        .then(function(resp) {
            aluno = resp.data;
            res.writeHead(200, {'Content-Type' : content})
            res.write("<h1>Aluno " + aluno.id + "</h1>");
            res.write("<h2>Nome: " + aluno.nome + "</h2>");
            res.write("<h2>Data de Nascimento: " + aluno.dataNasc + "</h2>");
            res.write('<h2>Curso: <a href="/cursos/' + aluno.curso + '">' + aluno.curso + '</a></h2>');
            res.write("<h2>Ano Curso: " + aluno.anoCurso + "</h2>");
            res.write("<h2>Instrumento: " + aluno.instrumento + "</h2>");

            res.write('<address>[<a href="/alunos#' + aluno.id + '"> Voltar </a>}</address>')
            res.end()
        })
        .catch(function(error){
            console.log('Erro ao obter aluno: ' + error)
            send_Error_Not_Found(res, mime.html)
        })
}

function send_Curso(req, res, content){
    axios.get(json_server + req.url)
        .then(function(resp) {
            curso = resp.data;
            res.writeHead(200, {'Content-Type' : content})
            res.write("<h1>Curso " + curso.id + "</h1>");
            res.write("<h2>Designação: " + curso.designacao + "</h2>");
            res.write("<h2>Duração: " + curso.duracao + "</h2>");
            res.write('<h2>Instrumento: <a href="/instrumentos/' + curso.instrumento.id + '">' + curso.instrumento['#text'] +  '</a></h2>');
            res.write('<address>[<a href="/cursos#' + curso.id + '"> Voltar </a>}</address>')
            res.end()
        })
        .catch(function(error){
            console.log('Erro ao obter curso: ' + error)
            send_Error_Not_Found(res, mime.html)
        })
}

function send_Instrumento(req, res, content){
    axios.get(json_server + req.url)
        .then(function(resp) {
            instrumento = resp.data;
            res.writeHead(200, {'Content-Type' : content})
            res.write("<h1>Instrumento " + instrumento.id + "</h1>");
            res.write("<h2>" + instrumento['#text'] + "</h2>");
            res.write('<address>[<a href="/instrumentos#' + instrumento.id + '"> Voltar </a>}</address>')
            res.end()
        })
        .catch(function(error){
            console.log('Erro ao obter instumento: ' + error)
            send_Error_Not_Found(res, mime.html)
        })
}

function send_Error(req, res, content){
    res.writeHead(404, {'Content-Type' : content})
    res.write("<p> Pedido não suportado: " + req.method + " " + req.url + "</p>")
    res.end()
}

function send_Error_Not_Found(res, content){
    res.writeHead(404, {'Content-Type' : content})
    res.write("<h1> 404 - Page Not Found </h1>")
    res.end()
}


function paging(res, header_link){
    array_link = header_link.split(",")

    extracted_links = {}
    i = 0
    for(single_link of array_link) {

        parsed = /\s*<([^>]+)>;\s*rel="([^"]+)"/ig.exec(single_link)
        
        extracted_links[parsed[2]] = parsed[1].replace(json_server, '') 
    }
    
    if(!extracted_links['prev']) {
        res.write('<addresss>[<a href="' + extracted_links['first'] + '">First</a>] | [<a href="' + extracted_links['next'] + '">Next</a>] | [<a href="' + extracted_links['last'] + '">Last</a>]</address>');
    
    } else if(!extracted_links['next']) {
        res.write('<addresss>[<a href="' + extracted_links['first'] + '">First</a>] | [<a href="' + extracted_links['prev'] + '">Previous</a>] | [<a href="' + extracted_links['last'] + '">Last</a>]</address>');
    
    } else {
        res.write('<addresss>[<a href="' + extracted_links['first'] + '">First</a>] | [<a href="' + extracted_links['prev'] + '">Previous</a>] | [<a href="' + extracted_links['next'] + '">Next</a>] | [<a href="' + extracted_links['last'] + '">Last</a>]</address>');
    }
    console.log(extracted_links)
}