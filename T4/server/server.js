var http = require('http')
var url = require('url') 
var fs = require('fs');
const { send } = require('process');

const numFiles =  fs.readdirSync('./site/conteudo').length;

var path_index = "./site/index.html"
var path_conteudo = './site/conteudo/arqelem'
var path_w3css = './css/w3.css'
var path_sitecss = './css/site.css'
var path_logo = './images/logo.png'

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
    console.log(req.method + " " + req.url + " " + new Date().toISOString().substring(0,16))

    if(req.url.match(/^\/$/) || req.url.match(/^\/index.html(#arqs=[1-9][0-9]*)?$/)){
        send_File(path_index, res, mime.html)

    } else if(req.url.match(/^\/arqs\/[1-9][0-9]*$/)){
        var num = req.url.split("/").pop()

        var num_Int = Number(num)
        if(num_Int < numFiles + 1 ){
            send_File(path_conteudo + num + '.html', res, mime.html)
        } else{
            send_Error(res)
        }
    } else if(req.url.match(/^\/css\/w3.css$/)){
        send_File(path_w3css, res, mime.css)

    } else if(req.url.match(/^\/css\/site.css$/)){
        send_File(path_sitecss, res, mime.css)

    } else if(req.url.match(/^\/img\/favicon.ico$/)){
        send_File(path_logo, res, mime.png)
    }
    else{
        send_Error(res)
    }
}).listen(7444);

console.log('Servidor à escuta na porta 7444...')

function send_File(path, res, content){
    fs.readFile(path, function(err, data) {
        res.writeHead(200, {'Content-Type': content});
        res.write(data);
        res.end();
    });
}

function send_Error(res){
    res.writeHead(404, {'Content-Type' : 'text/html; charset=utf-8'})
    res.write("<h1> 404 - Page Not Found </h1>")
    res.end()
}