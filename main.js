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
const deleteBtn = document.getElementById("delete-button");

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
  const status = form.status.value;

  clearErrors();

  let valid = true;

  if (title.length === 0) {
    setError("title", "Le titre est obligatoire.");
    valid = false;
  }

  if (description.length === 0) {
    setError("description", "La description est obligatoire.");
    valid = false;
  }

  if (!valid) {
    return;
  }

  if (editingTaskId) {
    const task = tasks.find((task) => task.id === editingTaskId);
    task.title = title;
    task.description = description;
    task.status = status;
  } else {
    const newTask = new Task(Date.now().toString(), title, description, status);
    tasks.push(newTask);
  }

  saveTask();
  renderTasks();
  closeModal();
  resetForm();
  editingTaskId = null;
});

deleteBtn.addEventListener("click", function (e) {
  e.preventDefault();

  if (editingTaskId) {
    tasks = tasks.filter((task) => task.id !== editingTaskId);
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
  clearErrors();
}

function resetForm(data) {
  const form = document.getElementById("form");

  if (data) {
    form.title.value = data.title;
    form.description.value = data.description;
    form.status.value = data.status;
    document.getElementById("modal-title").textContent = "Modifier la tâche";
    deleteBtn.style.display = "flex";
  } else {
    form.reset();
    document.getElementById("modal-title").textContent =
      "Ajouter une nouvelle tâche";
    deleteBtn.style.display = "none";
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
  ["todo", "inprogress", "done"].forEach((status) => {
    const column = document.getElementById(`kanban-column-${status}`);
    column.innerHTML = "";
  });

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "kanban-card";
    taskCard.dataset.id = task.id;
    taskCard.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
    taskCard.draggable = true;

    taskCard.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
      taskCard.classList.add("dragging");
    });

    taskCard.addEventListener("dragend", () => {
      taskCard.classList.remove("dragging");
    });

    taskCard.addEventListener("click", () => {
      openModal(task);
    });

    document
      .getElementById(`kanban-column-${task.status}`)
      .appendChild(taskCard);
  });

  ["todo", "inprogress", "done"].forEach((status) => {
    const dropZone = document.createElement("div");
    dropZone.className = "kanban-drop-zone";
    dropZone.textContent = "Glisser une tâche ici";

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("dragover");
    });

    dropZone.addEventListener("drop", (e) => {
      e.preventDefault();

      const data = e.dataTransfer.getData("text/plain");
      const task = tasks.find((task) => task.id === data);
      if (task) {
        task.status = status;
        saveTask();
        renderTasks();
      }
    });

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

function setError(fieldId, message) {
  const field = document.getElementById(fieldId);
  let errorElem = field.nextElementSibling;

  if (!errorElem || !errorElem.classList.contains("error-message")) {
    field.classList.add("error");
    errorElem = document.createElement("div");
    errorElem.className = "error-message";
    field.parentNode.insertBefore(errorElem, field.nextSibling);
  }

  errorElem.textContent = message;
}

function clearErrors() {
  const errors = document.querySelectorAll(".error-message");
  errors.forEach((elem) => elem.remove());
  const fields = document.querySelectorAll(".error");
  fields.forEach((field) => field.classList.remove("error"));
}
