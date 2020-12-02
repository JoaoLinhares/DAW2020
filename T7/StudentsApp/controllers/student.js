// Student controller

var Student = require('../models/student')

// Returns student list
module.exports.list = () => {
    return Student
        .find()
        .sort({nome:1})
        .exec()
}

module.exports.lookUp = id => {
    return Student
        .findOne({numero: id})
        .exec()
}

module.exports.insert = student => {
    var new_student = new Student(student)
    return new_student.save()
}

module.exports.update = (id, data) => {
    return Student.findOneAndUpdate({numero: id}, data, {new: true})
}

module.exports.delete = id => {
    return Student.remove({numero: id}, {justOne: 1}).exec()
}