import { loadTasks, saveTasks } from "./storage.js";
import { createTask, setTaskCompletion } from "./todo.js";

const elements = {
  emptyState: document.querySelector("#empty-state"),
  persistenceWarning: document.querySelector("#persistence-warning"),
  statusMessage: document.querySelector("#status-message"),
  taskForm: document.querySelector("#task-form"),
  taskInput: document.querySelector("#task-input"),
  taskList: document.querySelector("#task-list"),
  validationMessage: document.querySelector("#validation-message")
};

const loadedState = loadTasks();
let tasks = loadedState.tasks;
let warning = loadedState.warning;

function renderEmptyState() {
  elements.emptyState.hidden = tasks.length > 0;
}

function renderTasks() {
  elements.taskList.replaceChildren();

  for (const task of tasks) {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const completionControl = document.createElement("input");
    completionControl.type = "checkbox";
    completionControl.checked = task.completed;
    completionControl.setAttribute("aria-label", `Complete: ${task.text}`);
    completionControl.addEventListener("change", () => {
      tasks = setTaskCompletion(tasks, task.id, completionControl.checked);
      const result = saveTasks(tasks);
      warning = result.warning ?? "";
      render();
      announce(`${completionControl.checked ? "Completed" : "Restored"}: ${task.text}`);
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.setAttribute("aria-label", `Delete: ${task.text}`);
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const deletedIndex = tasks.findIndex((currentTask) => currentTask.id === task.id);
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      const result = saveTasks(tasks);
      warning = result.warning ?? "";
      render();
      announce(`Deleted: ${task.text}`);
      focusAfterDeletion(deletedIndex);
    });

    item.append(completionControl, text, deleteButton);
    elements.taskList.append(item);
  }
}

function renderWarning() {
  elements.persistenceWarning.textContent = warning;
  elements.persistenceWarning.hidden = !warning;
}

function focusAfterDeletion(deletedIndex) {
  const completionControls = elements.taskList.querySelectorAll('input[type="checkbox"]');
  const nextFocusTarget =
    completionControls[deletedIndex] ??
    completionControls[deletedIndex - 1] ??
    elements.taskInput;

  nextFocusTarget.focus();
}

function render() {
  renderTasks();
  renderEmptyState();
  renderWarning();
}

function announce(message) {
  elements.statusMessage.textContent = message;
}

function setValidationMessage(message) {
  elements.validationMessage.textContent = message;
}

elements.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  setValidationMessage("");

  try {
    const task = createTask(elements.taskInput.value);
    tasks = [...tasks, task];
    const result = saveTasks(tasks);
    warning = result.warning ?? "";
    elements.taskInput.value = "";
    render();
    announce(`Added: ${task.text}`);
  } catch (error) {
    setValidationMessage(error.message);
  }
});

render();
