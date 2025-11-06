const addTaskBtn = document.getElementById("add-task-button");
const overlayModal = document.getElementById("overlay-modal");
const cancelBtn = document.getElementById("cancel-button");
const saveBtn = document.getElementById("save-button");
const form = document.getElementById("form");

addTaskBtn.addEventListener("click", function () {
  overlayModal.classList.add("open");
  addTaskBtn.disabled = true;
});

cancelBtn.addEventListener("click", function () {
  overlayModal.classList.remove("open");
  addTaskBtn.disabled = false;
  form.reset();
});

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const title = form.elements["title"].value.trim();
  const description = form.elements["description"].value.trim();
  
  if (!title || !description) {
    alert("Complète tous les champs !");
    return;
  }
  createNewTask(title, description);
  overlayModal.classList.remove("open");
  addTaskBtn.disabled = false;
  form.reset();
});

function createNewTask(title, description) {
  const newCard = document.createElement("div");
  newCard.className = "kanban-card";
  const cardTitle = document.createElement("h3");
  cardTitle.textContent = title;
  const cardDescription = document.createElement("p");
  cardDescription.textContent = description;
  newCard.appendChild(cardTitle);
  newCard.appendChild(cardDescription);
  const todoColumn = document.getElementById("kanban-column-todo");
  todoColumn.insertBefore(newCard, todoColumn.lastElementChild);
}