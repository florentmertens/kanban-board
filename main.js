class Task {
  constructor(id, title, description, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

let tasks = [];
let editingTaskId = null;

const addTaskBtn = document.getElementById("add-task-button");
const cancelBtn = document.getElementById("cancel-button");
const saveTaskBtn = document.getElementById("save-button");

loadTasks();
renderTasks();

addTaskBtn.addEventListener("click", function () {
  addTaskBtn.disabled = true;
  openModal();
});

cancelBtn.addEventListener("click", function (e) {
  e.preventDefault();
  closeModal();
});

saveTaskBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const form = document.getElementById("form");
  const title = form.title.value.trim();
  const description = form.description.value.trim();

  if (editingTaskId) {
    const task = tasks.find((task) => task.id === editingTaskId);
    task.title = title;
    task.description = description;
  } else {
    const newTask = new Task(Date.now().toString(), title, description, "todo");
    tasks.push(newTask);
  }

  saveTask();
  renderTasks();
  closeModal();
  resetForm();
  editingTaskId = null;
});

function openModal(task) {
  const modal = document.getElementById("overlay-modal");
  modal.classList.remove("hidden");

  if (task) {
    editingTaskId = task.id;
    resetForm(task);
  } else {
    editingTaskId = null;
    resetForm();
  }
}

function closeModal() {
  const modal = document.getElementById("overlay-modal");
  modal.classList.add("hidden");
  addTaskBtn.disabled = false;
}

function resetForm(data) {
  const form = document.getElementById("form");

  if (data) {
    form.title.value = data.title;
    form.description.value = data.description;
    document.getElementById("modal-title").textContent = "Modifier la tâche";
  } else {
    form.reset();
    document.getElementById("modal-title").textContent =
      "Ajouter une nouvelle tâche";
  }
}

function saveTask() {
  localStorage.setItem("kabanTasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("kabanTasks");
  if (savedTasks) {
    const parsedTasks = JSON.parse(savedTasks);
    tasks = parsedTasks.map(
      (task) => new Task(task.id, task.title, task.description, task.status)
    );
  }
}

function renderTasks() {
  document.getElementById("kanban-column-todo").innerHTML = "";
  document.getElementById("kanban-column-inprogress").innerHTML = "";
  document.getElementById("kanban-column-done").innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "kanban-card";
    taskCard.dataset.id = task.id;
    taskCard.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;

    if (task.status === "todo") {
      document.getElementById("kanban-column-todo").appendChild(taskCard);
    } else if (task.status === "inprogress") {
      document.getElementById("kanban-column-inprogress").appendChild(taskCard);
    } else if (task.status === "done") {
      document.getElementById("kanban-column-done").appendChild(taskCard);
    }
  });

  ["todo", "inprogress", "done"].forEach((status) => {
    const dropZone = document.createElement("div");
    dropZone.className = "kanban-drop-zone";
    dropZone.textContent = "Glisser une tâche ici";
    document.getElementById(`kanban-column-${status}`).appendChild(dropZone);
  });

  document.querySelector(".todo-title span").textContent = tasks.filter(
    (task) => task.status === "todo"
  ).length;
  document.querySelector(".inprogress-title span").textContent = tasks.filter(
    (task) => task.status === "inprogress"
  ).length;
  document.querySelector(".done-title span").textContent = tasks.filter(
    (task) => task.status === "done"
  ).length;
}
