var express = require('express');
var router = express.Router();

var Student = require('../controllers/student')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET list of students. */
router.get('/alunos', function(req, res) {
  // Data retrieve
  Student.list()
    .then(data => res.render('students', { list: data }))
    .catch(err => res.render('error', {error: err}))
});

/* GET Register Student. */
router.get('/alunos/registar', function(req, res) {
  res.render('student_register')
});

/* GET Edit Student. */
router.get('/alunos/editar/:id', function(req, res) {
  // Data retrieve
  console.log(req.params)
  Student.lookUp(req.params.id)
    .then(data => res.render('student_edit', { s: data }))
    .catch(err => res.render('error', {error: err}))
});

/* GET Student. */
router.get('/alunos/:id', function(req, res) {
  // Data retrieve
  Student.lookUp(req.params.id)
    .then(data => res.render('student_page', { s: data }))
    .catch(err => res.render('error', {error: err}))
});

/* POST Student. */
router.post('/alunos', function(req, res) {
  // Data retrieve
  console.log(req.body)
  data_retrieved = req.body
  var student = {};

  /* Create student with body */
  student["numero"] = data_retrieved["numero"]
  student["nome"] = data_retrieved["nome"]
  student["git"] = data_retrieved["git"]

  var tpc = []

  var i;
  for(i = 1; i < 9; i++){
    var key = "tpc" + i
    if(key in data_retrieved){
      tpc.push(1)
    } else {
      tpc.push(0)
    }
  }

  student["tpc"] = tpc

  Student.insert(student)
    .then(data => res.render('student_page', { s: data }))
    .catch(err => res.render('error', {error: err}))
});

/* PUT Student. */
router.put('/alunos/:id', function(req, res) {
  // Data retrieve
  console.log(req.body)
  data_retrieved = req.body
  var content = {};

  /* Create student with body */
  content["nome"] = data_retrieved["nome"]
  content["git"] = data_retrieved["git"]

  var tpc = []

  var i;
  for(i = 1; i < 9; i++){
    var key = "tpc" + i
    if(key in data_retrieved){
      tpc.push(1)
    } else {
      tpc.push(0)
    }
  }

  content["tpc"] = tpc

  Student.update(req.params.id, content)
    .then(data => res.render('student_page', { s: data }))
    .catch(err => res.render('error', {error: err}))
});

/* DELETE Student. */
router.delete('/alunos/:id', function(req, res) {
  // Data retrieve
  console.log("aqui")
  Student.delete(req.params.id);
  res.redirect("/alunos")
})

module.exports = router;
