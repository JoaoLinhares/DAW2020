/*
    Module HTML page - to create template for html page
    Exports: 
         writePage(res, d) - write to response the html page
        String generateHTML(tasks, d) - generates html template
*/

var axios = require('axios')

// Get Tasks

function writePage(res, d){
    axios.get("http://localhost:3000/tasks").
    then(response => {
        tasks = response.data
        res.write(generateHTML(tasks, d))
        res.end()
    })
    .catch(function(error){
        console.log('Error getting tasks....' + error)
    })

}

exports.writePage = writePage

// HTML Page Template ------------------------------------------
function generateHTML(tasks,  d ){
    var html= `
    <html>
        <head>
            <title>To Do List</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="/w3.css"/>
            <link rel="stylesheet" href="/site.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal" style="margin-bottom:2%;">
                <h2 class="title">Add Task</h2>
            </div>

            <form class="w3-container" action="/addTask" method="POST" style="text-align: center; margin-left:10%; margin-right:10%;">
                <label class="w3-text-teal"><b>Responsible:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="name">
                <hr>
                <label class="w3-text-teal"><b>Task:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="task">
                <hr>
                <label class="w3-text-teal"><b>Type:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="type">
                <hr>
                <label class="w3-text-teal"><b>Deadline:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="datetime-local" name="deadline">
                <hr>
                <input class="w3-btn w3-blue-grey" type="submit" value="Register"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Clean"/> 
            </form>

            <div class="w3-container w3-teal" style="margin-bottom:2%;">
                <h2 class="title">Tasks</h2>
            </div>`

            var num_tasks = 0
            var line_break = false

            tasks.forEach(t => {
                
                if(t.done == 'false') {
                    if(line_break){
                        html += `
                        <hr style="height:20px;margin-left:10%; margin-right:10%;" class="w3-teal">
                        `
                    }
                    num_tasks++

                html += `
                <form class="w3-container" action="/edit/${t.id}" method="POST" style="text-align: center; margin-left:10%; margin-right:10%;">
                <label class="w3-text-teal"><b>Responsible:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="name" value="${t.name}">
                <hr>
                <label class="w3-text-teal"><b>Task:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="task" value="${t.task}">
                <hr>
                <label class="w3-text-teal"><b>Type:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="type" value="${t.type}">
                <hr>
                <label class="w3-text-teal"><b>Register Date:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id" value="${t.id}" readonly>
                <hr>
                <label class="w3-text-teal"><b>Deadline:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="datetime-local" name="deadline" value="${t.deadline}">
                <hr>

                <div class="w3-row" style="margin-top: 5%; margin-right:10%; margin-left:10%; text-align: center;">
                    <div class="w3-half w3-container" style="text-align: left;">
                        <label class="w3-text-teal"><b>Mark as Resolved:</b></label>
                        <input type="radio" id="true" name="done" value="true">
                    </div>
                    <div class="w3-half w3-container" style="text-align: right;">
                        <input class="w3-btn w3-blue-grey" type="submit" value="Edit"/>
                    </div>
                </div>
                </form>`
                line_break = true
                }
            })

            if(num_tasks == 0) {
                html += `
                <h3 style="text-align: center;">No Tasks Avaiable</h3>
                `
            }
            
            html += `
            <div class="w3-container w3-teal" style="margin-bottom:2%;">
                <h2 class="title">Resolved Tasks</h2>
            </div>`

            var num_completed_tasks = 0
            line_break = false

            tasks.forEach(t => {
                if(t.done == 'true') {
                    if(line_break){
                        html += `
                        <hr style="height:20px;margin-left:10%; margin-right:10%;" class="w3-teal">
                        `
                    }
                    
                    num_completed_tasks++

                html += `
                <hr>
                <form class="w3-container" action="/remove/${t.id}" method="POST" style="text-align: center; margin-left:10%; margin-right:10%;">
                <label class="w3-text-teal"><b>Responsible:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="name" value="${t.name}">
                <hr>
                <label class="w3-text-teal"><b>Task:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="task" value="${t.task}">
                <hr>
                <label class="w3-text-teal"><b>Type:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="type" value="${t.type}">
                <hr>
                <label class="w3-text-teal"><b>Register Date:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="id" value="${t.id}" readonly>
                <hr>
                <label class="w3-text-teal"><b>Deadline:</b></label>
                <input class="w3-input w3-border w3-light-grey" type="datetime-local" name="deadline" value="${t.deadline}">
                <hr>
                <input class="w3-btn w3-blue-grey" type="submit" value="Remove"/>
            </form>
            <hr>`

                line_break = true
                }
            })

            if(num_completed_tasks == 0) {
                html += `
                <h3 style="text-align: center;">No Completed Tasks</h3>
                `
            }

            html += `<footer class="w3-container w3-teal" style="text-align: center;">
                <address>Generated by toDoList::DAW2020 on ${d}</address>
            </footer>
        </body>
    </html>
    `

    return html
}

exports.generateHTML = generateHTML