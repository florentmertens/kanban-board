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

saveBtn.addEventListener("click", function () {
  overlayModal.classList.remove("open");
  addTaskBtn.disabled = false;
  form.reset();
});
