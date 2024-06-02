/* eslint-disable no-undef */
/**
 * Adds tasks to the task containers.
 * @param {Task[]} tasks - an array of task objects.
 */
function tasksRendererCallback(tasks) {
  // Clear all existing task entries first
  document.querySelectorAll(".task-container").forEach((container) => {
    container.innerHTML = ""; // Clears all child elements
  });

  // Add new tasks
  tasks.forEach((task) => {
    // Create elements for the task entry
    const taskPv = document.createElement("div");
    taskPv.classList.add("task-pv");

    const taskName = document.createElement("h2");
    taskName.textContent = task.task_name;
    taskPv.appendChild(taskName);

    const taskContent = document.createElement("p");
    taskContent.textContent = task.task_content;
    taskPv.appendChild(taskContent);

    const taskDueDate = document.createElement("p");
    taskDueDate.textContent = `Due: ${task.due_date}`;
    taskPv.appendChild(taskDueDate);

    const taskPriority = document.createElement("p");
    taskPriority.textContent = `Priority: ${task.priority}`;
    taskPv.appendChild(taskPriority);

    const taskExpectedTime = document.createElement("p");
    taskExpectedTime.textContent = `Expected Time: ${task.expected_time}`;
    taskPv.appendChild(taskExpectedTime);

    // Find the appropriate day container based on the task's due date
    // Assuming due_date is in 'YYYY-MM-DD' format and you need to map it to a specific day
    const dueDate = new Date(task.due_date);
    const dayIndex = dueDate.getDay(); // Sunday - Saturday : 0 - 6
    const dayContainer = document.querySelector(
      `.day${dayIndex + 1} .task-container`
    );

    if (dayContainer) {
      dayContainer.appendChild(taskPv);
    }
  });
}

/**
 * Adds journal entries to the journal containers.
 * @param {Entry[]} entries - an array of journal entry objects.
 */
function entriesRendererCallback(entries) {
  // Clear all existing journal entries first
  document.querySelectorAll(".journal-container").forEach((container) => {
    container.innerHTML = ""; // Clears all child elements
  });

  entries.forEach((entry) => {
    // Create elements for the journal entry
    const journalPv = document.createElement("div");
    journalPv.classList.add("journal-pv");

    const journalTitle = document.createElement("h2");
    journalTitle.textContent = entry.entry_title;
    journalPv.appendChild(journalTitle);

    const journalDesc = document.createElement("p");
    journalDesc.textContent = entry.entry_content;
    journalPv.appendChild(journalDesc);

    // Find the appropriate day container based on the entry's creation date
    // Assuming creation_date is in 'YYYY-MM-DD' format and you need to map it to a specific day
    const creationDate = new Date(entry.creation_date);
    const dayIndex = creationDate.getDay(); // Sunday - Saturday : 0 - 6
    const dayContainer = document.querySelector(`.day${dayIndex + 1} .journal-container`);

    if (dayContainer) {
      dayContainer.appendChild(journalPv);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("storageUpdate", () => {
    let storedEntries = JSON.parse(localStorage.getItem("journalData"));
    storedEntries = Array.isArray(storedEntries) ? storedEntries : [];
    let storedTasks = JSON.parse(localStorage.getItem("tasks"));
    storedTasks = Array.isArray(storedTasks) ? storedTasks : [];
    tasksRendererCallback(storedTasks);
    entriesRendererCallback(storedEntries);
  });

  window.api.getTasks((tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasksRendererCallback(tasks);
  });
  window.api.getEntries((entries) => {
    localStorage.setItem("journalData", JSON.stringify(entries));
    entriesRendererCallback(entries);
  });

  // creates the popup when the add task button is clicked
  document.querySelectorAll(".add-task").forEach((button) => {
    button.addEventListener("click", () => {
      const popup = document.createElement("task-popup");
      document.body.appendChild(popup);
    });
  });

  // creates the popup when the add journal entry button is clicked
  document.querySelectorAll(".add-journal").forEach((button) => {
    button.addEventListener("click", () => {
      const popup = document.createElement("journal-popup");
      document.body.appendChild(popup);
    });
  });
});
