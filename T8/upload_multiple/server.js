var express = require('express')
var bodyParser = require('body-parser')
var templates = require('./html-templates')
var jsonfile = require('jsonfile')
var logger = require('morgan')
var fs = require('fs')
var favicon = require('serve-favicon')
var path = require('path');

var multer = require('multer')
const { maxHeaderSize } = require('http')
const depd = require('depd')
const { fstat } = require('fs')
var upload = multer({dest: 'uploads/'})

var app = express()

app.use(logger('dev'))

// parse application/x--www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use(express.static('public'))

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(function(req, res, next) {
    console.log(JSON.stringify(req.body))
    next()
})

app.get('/', function(req, res){
    var d = new Date().toISOString().substr(0,16)
    var files = jsonfile.readFileSync('./dbFiles.json')
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileList(files, d))
    res.end()
})


app.get('/files/upload', function(req, res){
    var d = new Date().toISOString().substr(0,16)
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
    res.write(templates.fileForm(d))
    res.end()
})

app.get('/files/download/:fname', function(req, res){
    res.download(__dirname +  '/public/fileStore/' + req.params.fname)
})

app.post('/files', upload.array('myFiles'), function(req, res){
    var d = new Date().toISOString().substr(0,16)
    // req.file is the 'myFile' file
    // req.body will holde the text fields if any

    var files = jsonfile.readFileSync('./dbFiles.json')

    for(var i = 0; i < req.files.length; i++){
            var single_file = req.files[i]
            let oldPath = __dirname + '/' + single_file.path
            let newPath = __dirname + '/public/filestore/' + single_file.originalname

            fs.rename(oldPath, newPath, function(err){
                if(err) throw err
            })
            
            files.push(
                {
                    date: d,
                    name: single_file.originalname,
                    size: single_file.size,
                    mimetype: single_file.mimetype,
                    desc: req.files.length == 1 ? req.body.desc : req.body.desc[i]
                }
            )
        }

    jsonfile.writeFileSync('./dbFiles.json', files)

    res.redirect('/')
})

app.listen(7701, () => console.log('Servidor à escuta na porta 7701...'))