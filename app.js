document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const welcomeScreen = document.getElementById("welcome-screen");
    const startBtn = document.getElementById("start-btn");
    const mainContainer = document.getElementById("main-container");
    const taskInput = document.getElementById("text-input");
    const addBtnTask = document.getElementById("task-add-btn");
    const taskList = document.getElementById("task-list");
    const emptyState = document.getElementById("empty-state");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const body = document.body;

    // Array to store tasks
    let tasks = [];

    // --- Theme Toggle Logic ---

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });


    // --- Utility Functions ---

    const timeAgo = (timestamp) => {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateEmptyState();
    };

    const loadTasks = () => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
            renderTasks();
        }
    };

    const updateEmptyState = () => {
        if (tasks.length === 0) {
            emptyState.style.display = "block";
        } else {
            emptyState.style.display = "none";
        }
    };

    // --- UI Rendering Functions ---

    const renderTask = (task, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}/>
            <span class="task-text ${task.completed ? "completed" : ""}"> ${task.text} </span>
            <span class="task-timestamp">${timeAgo(task.timestamp)}</span>
            <div class="task-buttons">
                <button class="edit-btn" aria-label="Edit task" ${task.completed ? "disabled" : ""}>
                    <i class="fa-solid fa-file-pen"></i>
                </button>
                <button class="delete-btn" aria-label="Delete task">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        li.querySelector(".task-checkbox").addEventListener("change", () => toggleComplete(index));
        li.querySelector(".edit-btn").addEventListener("click", () => editTask(index));
        li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(index));

        taskList.appendChild(li);
    };

    const renderTasks = () => {
        taskList.innerHTML = "";
        tasks.forEach(renderTask);
        updateEmptyState();
    };

    setInterval(() => {
        document.querySelectorAll(".task-timestamp").forEach((span, index) => {
            if (tasks.length > index) {
                span.textContent = timeAgo(tasks[(tasks.length - 1) - index].timestamp);
            }
        });
    }, 60000);

    // --- Core Logic Functions ---

    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a task!",
                background: "var(--clr-card)",
                color: "var(--clr-text-primary)"
            });
            return;
        }

        tasks.unshift({
            text: taskText,
            completed: false,
            timestamp: new Date().toISOString()
        });
        saveTasks();
        renderTasks();
        taskInput.value = "";
        Swal.fire({
            icon: "success",
            title: "Task Added!",
            text: "Your new task has been successfully added.",
            showConfirmButton: false,
            timer: 1500,
            background: "var(--clr-card)",
            color: "var(--clr-text-primary)"
        });
    };

    const toggleComplete = async (index) => {
        const task = tasks[(tasks.length - 1) - index];
        const confirmation = await Swal.fire({
            title: task.completed ? "Mark as incomplete?" : "Mark as complete?",
            text: `Are you sure you want to mark "${task.text}" as ${task.completed ? "incomplete" : "complete"}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "var(--clr-accent)",
            cancelButtonColor: "#d14141",
            confirmButtonText: "Yes, do it!",
            background: "var(--clr-card)",
            color: "var(--clr-text-primary)"
        });

        if (confirmation.isConfirmed) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        } else {
            const listItem = taskList.children[(tasks.length - 1) - index];
            if (listItem) {
                const checkbox = listItem.querySelector('.task-checkbox');
                checkbox.checked = task.completed;
            }
        }
    };

    const editTask = async (index) => {
        const task = tasks[(tasks.length - 1) - index];
        if (task.completed) return;

        const { value: newText } = await Swal.fire({
            title: "Edit Task",
            input: "text",
            inputValue: task.text,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "You need to write something!";
                }
            },
            background: "var(--clr-card)",
            color: "var(--clr-text-primary)"
        });

        if (newText) {
            task.text = newText;
            saveTasks();
            renderTasks();
            Swal.fire({
                icon: "success",
                title: "Task Updated!",
                showConfirmButton: false,
                timer: 1500,
                background: "var(--clr-card)",
                color: "var(--clr-text-primary)"
            });
        }
    };

    const deleteTask = async (index) => {
        const taskToDelete = tasks[(tasks.length - 1) - index];
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete the task: "${taskToDelete.text}". This cannot be undone.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d14141",
            cancelButtonColor: "var(--clr-accent)",
            confirmButtonText: "Yes, delete it!",
            background: "var(--clr-card)",
            color: "var(--clr-text-primary)"
        });

        if (confirmation.isConfirmed) {
            tasks.splice((tasks.length - 1) - index, 1);
            saveTasks();
            renderTasks();
            Swal.fire({
                title: "Deleted!",
                text: "Your task has been deleted.",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                background: "var(--clr-card)",
                color: "var(--clr-text-primary)"
            });
        }
    };

    // --- Event Listeners and Initial Load ---

    startBtn.addEventListener("click", () => {
        welcomeScreen.style.display = "none";
        mainContainer.style.display = "flex";
        AOS.refresh();
        Swal.fire({
            title: "Welcome!",
            text: "Your to-do list is ready. Start adding tasks!",
            icon: "info",
            showConfirmButton: false,
            timer: 2000,
            background: "var(--clr-card)",
            color: "var(--clr-text-primary)"
        });
    });

    addBtnTask.addEventListener("click", (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTask();
        }
    });

    loadTasks();
});