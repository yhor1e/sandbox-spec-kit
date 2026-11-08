function createId() {
  return crypto.randomUUID();
}

export function createTask(text) {
  const trimmedText = text.trim();

  if (!trimmedText) {
    throw new Error("Enter a task before adding it.");
  }

  return {
    id: createId(),
    text: trimmedText,
    completed: false,
    createdAt: Date.now()
  };
}

export function setTaskCompletion(tasks, id, completed) {
  return tasks.map((task) => (task.id === id ? { ...task, completed } : task));
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}
