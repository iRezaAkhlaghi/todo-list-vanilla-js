/// Open popup to write a new task
let addTask = document.querySelector(".add");
let popup = document.querySelector(".popup");

addTask.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    document.querySelector(".dateInput").setAttribute("min", today);
    popup.classList.add("active");
});



/// Close the popup
let Close = document.querySelector(".cancel");
Close.addEventListener("click", () => {
    popup.classList.remove("active");
});


/// Load tasks from local storage
let Tasks = JSON.parse(localStorage.getItem("todoList")) || [];


/// Save tasks to local storage
function saveTasks() {
    localStorage.setItem("todoList", JSON.stringify(Tasks));
}



/// Elements
let list = document.querySelector(".list");
let overDueList = document.querySelector(".overDue-List");
let currentFilter = "today";



/// Main render function
function render() {
    list.innerHTML = "";
    const today = new Date();
    const todayStr = today.toDateString();

    Tasks.forEach((task, index) => {

        const taskDate = new Date(task.date);
        const isToday = taskDate.toDateString() === todayStr;
        const isFuture = taskDate > today;

        // Only render if matches current filter
        if (
            (currentFilter === "today" && isToday && !task.Done) ||
            (currentFilter === "pendingBtn" && isFuture && !task.Done) ||
            (currentFilter === "overDueBtn" && task.Done === true)
        ) {
            let li = document.createElement("li");
            li.innerHTML = `
        <div>
          <input type="checkbox" ${task.Done ? "checked" : ""} onchange="toggleDone(${index})" />
          <label class="label">${task.text}</label><br>
        </div>
        <div class="Tzone">
          <time>${task.date}</time>
          <div class="Crud">
            <p class="edit" onclick="Edit(${index})">Edit</p>
            <p class="delete" onclick="Delete(${index})">Delete</p>
          </div>
        </div>`;

            
          
                list.appendChild(li);
           
        }
    });
}



/// Filter buttons click
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".Btns button").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.${filter}`).classList.add("active");
    render();
}



/// Checkbox toggle to mark as done or not
defineGlobal("toggleDone", function (index) {
    Tasks[index].Done = !Tasks[index].Done;
    saveTasks();
    render();
});



/// Delete a task
defineGlobal("Delete", function (index) {
    Tasks.splice(index, 1);
    saveTasks();
    render();
});

/// Edit mode variables
let isEditing = false;
let editIndex = null;




/// Open edit popup with existing task text
defineGlobal("Edit", function (index) {
    let Inp = document.querySelector(".text");
    let DateInp = document.querySelector(".dateInput");

    Inp.value = Tasks[index].text;
    DateInp.value = new Date(Tasks[index].date).toISOString().split("T")[0]; 

    popup.classList.add("active");
    isEditing = true;
    editIndex = index;
});




/// Submit button handler
function Submit() {
    let Inp = document.querySelector(".text");
    let DateInp = document.querySelector(".dateInput");
    let TaskText = Inp.value.trim();
    let TaskDate = DateInp.value;

    if (TaskText === "" || TaskDate === "") {
        return window.alert("Please fill in both the task and the date.");
    }

    if (isEditing) {
        Tasks[editIndex].text = TaskText;
        Tasks[editIndex].date = new Date(TaskDate).toDateString();
        isEditing = false;
        editIndex = null;
    } else {
        const Task = {
            text: TaskText,
            Done: false,
            date: new Date(TaskDate).toDateString()
        };
        Tasks.push(Task);
    }

    saveTasks();
    render();
    popup.classList.remove("active");
    Inp.value = "";
    DateInp.value = "";
}




/// Initialize filters and render document
render();
document.querySelector(".today").addEventListener("click", () => setFilter("today"));
document.querySelector(".pendingBtn").addEventListener("click", () => setFilter("pendingBtn"));
document.querySelector(".overDueBtn").addEventListener("click", () => setFilter("overDueBtn"));



/// Helper to bind global functions for inline handlers
function defineGlobal(name, fn) {
    window[name] = fn;
}
