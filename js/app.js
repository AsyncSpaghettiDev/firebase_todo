const importantIcon = 'fas'
const notImportantIcon = 'far'

var firebaseConfig = {
  apiKey: "AIzaSyCJbnos0dvTcvGOAObNdO8QW7mOivzz4as",
  authDomain: "fir-2-3c298.firebaseapp.com",
  databaseURL: "https://fir-2-3c298-default-rtdb.firebaseio.com",
  projectId: "fir-2-3c298",
  storageBucket: "fir-2-3c298.appspot.com",
  messagingSenderId: "865478188475",
  appId: "1:865478188475:web:35f5a6a1d174ac86c6789e",
  measurementId: "G-VQRQS2EGBV"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

async function saveTask () {
  // get data
  let title = $("#task-name").val()
  let dueDate = $("#due-date").val()
  let description = $("#description").val()
  let tag = $("#tag").val()
  let color = $("#color").val()
  let category = $("#category").val()
  let important = $("#toggleImportance").hasClass(importantIcon)

  let task = new Task(title, dueDate, description, tag, color, category, important)

  // Save the task in the server using Firebase
  await firebase.database().ref('Tasks/' + Date.now()).update(task)
  displayTask(task)
  clearForm()
}


/**
 * Clear form function
 * and set date to today
 */

function clearForm () {
  $("#task-name").val("")
  let today = new Date()
  $('#due-date').val(today.toISOString().substr(0, 10))
  $("#description").val("")
  $("#tag").val("")
  $("#color").val("#9900ff")
  $("#category").val("work")
  $("#toggleImportance").removeClass(importantIcon)
  $("#toggleImportance").addClass(notImportantIcon)
}

/**
 * Create a display function
 * the fn should accept a task object as a parameter
 * console log the task object
 */

function displayTask (task) {
  // create div with class="task"
  // Separate title and description of the task in a div with a class of "task_info"
  // Separate the due date in a div with a class of "task_info"
  // Separate the tag and the category in a div with a class of "task_info"
  // Set the background color of the task to the color of the task using iline css
  // Create all this using string template
  // Do something with isImportant wonder me copilot
  // Add the task to the tasks-list in the DOM

  let html = `
    <div class="task" style="background-color:${task.color}">
        <div class="task_info">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
        </div>
        <div class="task_info">
            <p>Due Date</p>
            <p>${task.dueDate}</p>
        </div>
        <div class="task_info">
            <p>Tag: ${task.tag}</p>
            <p>Category: ${task.category}</p>
        </div>
        <div class="task_info task_actions">
            <i class="task_toggleImportance ${task.isImportant ? importantIcon : notImportantIcon} fa-star"></i> 
        </div>
    </div>
                `

  $("#tasks-list").append(html)
}

function toggleForm () {
  console.log("Form toggled")
  $(".info").slideToggle()
}

function toogleImportance () {
  console.log("Icon clicked")

  $("#toggleImportance").toggleClass(notImportantIcon).toggleClass(importantIcon)
}

function init () {
  console.log("Task Manager")

  // load prev data
  fetchTasks()

  // Set initial values
  $("#color").val("#9900ff")
  let today = new Date()
  $('#due-date').val(today.toISOString().substr(0, 10))

  // hook events
  $("#btnSave").click(saveTask)
  $("#toggleImportance").click(toogleImportance)
  $("#toggleForm").click(toggleForm)
}

window.onload = init

/**
 * Create a function to fetch the tasks from the server
 * send a get request to 'http://fsdiapi.azurewebsites.net/api/tasks'
 * console log the response from the server
 * 
 * 
 * 
 */

function fetchTasks () {
  const ref = firebase.database().ref('Tasks')
  ref.on("child_added", function (snapshot) {
    displayTask(snapshot.val())
  })
}
