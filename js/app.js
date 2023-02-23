const importantIcon = 'fas'
const notImportantIcon = 'far'

// Configuracion de Firebase
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

// Inilizacion de Firebase
firebase.initializeApp(firebaseConfig)

// Clase Task para crear objetos
async function saveTask () {
  // Recibe los valores de los inputs
  let title = $("#task-name").val()
  let dueDate = $("#due-date").val()
  let description = $("#description").val()
  let tag = $("#tag").val()
  let color = $("#color").val()
  let category = $("#category").val()
  // Verifica si el icono es importante o no
  let important = $("#toggleImportance").hasClass(importantIcon)
  // Crea un objeto de la clase Task
  let task = new Task(title, dueDate, description, tag, color, category, important)

  // Envio de datos a Firebase
  await firebase.database().ref('Tasks/' + Date.now()).update(task)
  displayTask(task)
  clearForm()
}

// Clase para limpiar el formulario y poner la fecha actual
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

// Clase para desplegar las tareas en el DOM
function displayTask (task) {
  // Crea un elemento div con la clase task
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
  // Agrega el elemento div a la lista de tareas
  $("#tasks-list").append(html)
}

// Clase para ocultar el formulario
function toggleForm () {
  console.log("Form toggled")
  $(".info").slideToggle()
}

// Clase para cambiar el icono de importante
function toogleImportance () {
  console.log("Icon clicked")

  $("#toggleImportance").toggleClass(notImportantIcon).toggleClass(importantIcon)
}

// Clase para inicializar la aplicacion
function init () {
  console.log("Task Manager")

  // Lllama la funcion para obtener las tareas del servidor
  fetchTasks()

  // Valores por defecto del formulario
  $("#color").val("#9900ff")
  let today = new Date()
  $('#due-date').val(today.toISOString().substr(0, 10))

  // Eventos
  $("#btnSave").click(saveTask)
  $("#toggleImportance").click(toogleImportance)
  $("#toggleForm").click(toggleForm)
}

// Inicializa la aplicacion
window.onload = init

// Clase para obtener las tareas del servidor
function fetchTasks () {
  const ref = firebase.database().ref('Tasks')
  ref.on("child_added", function (snapshot) {
    displayTask(snapshot.val())
  })
}
