export const STORAGE_KEY = "todo-app:v1";
const VERSION = 1;

function isTask(value) {
  return (
    value &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.completed === "boolean" &&
    typeof value.createdAt === "number"
  );
}

function isStoredTaskList(value) {
  return (
    value &&
    value.version === VERSION &&
    Array.isArray(value.todos) &&
    value.todos.every(isTask)
  );
}

export function loadTasks(storage = window.localStorage) {
  let rawValue;

  try {
    rawValue = storage.getItem(STORAGE_KEY);
  } catch {
    return {
      tasks: [],
      warning: "Saved tasks are unavailable. Changes may not be saved."
    };
  }

  if (rawValue === null) {
    return { tasks: [], warning: "" };
  }

  try {
    const storedTaskList = JSON.parse(rawValue);
    if (isStoredTaskList(storedTaskList)) {
      return { tasks: storedTaskList.todos, warning: "" };
    }
  } catch {
    // Invalid saved data is handled as an empty list without overwriting it.
  }

  return {
    tasks: [],
    warning: "Saved tasks could not be read. Starting with an empty list."
  };
}

export function saveTasks(tasks, storage = window.localStorage) {
  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: VERSION,
        todos: tasks
      })
    );
    return { saved: true };
  } catch {
    return {
      saved: false,
      warning: "Changes may not be saved in this browser."
    };
  }
}
