const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

let tasks = [];

// Event listeners
taskForm.addEventListener('submit', addTask);

// Functions
function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') return; // Do not add empty tasks

    const task = {
        id: Date.now().toString(),
        text: taskText,
        completed: false,
        datetime: new Date().toISOString() // Store date and time in ISO format
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    taskInput.value = '';
}

function saveTasks() {
    // Save tasks to localStorage or backend
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    // Load tasks from localStorage or backend
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <span>${task.text}</span>
            <span class="task-datetime">${formatDatetime(task.datetime)}</span>
            <div class="actions">
                <button onclick="toggleComplete('${task.id}')">${task.completed ? 'Undo' : 'Done'}</button>
                <button onclick="editTask('${task.id}')">Edit</button>
                <button onclick="deleteTask('${task.id}')">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

function toggleComplete(id) {
    const selectedTask = tasks.find(task => task.id === id);
    if (selectedTask) {
        selectedTask.completed = !selectedTask.completed;
        saveTasks();
        renderTasks();
    }
}

function editTask(id) {
    const selectedTask = tasks.find(task => task.id === id);
    if (selectedTask) {
        const newText = prompt('Edit task:', selectedTask.text);
        if (newText !== null && newText.trim() !== '') {
            selectedTask.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function formatDatetime(datetime) {
    const dt = new Date(datetime);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dt.toLocaleDateString('en-US', options);
}

// Load initial tasks from storage
loadTasks();
