/**
 * Adds tasks to the task containers.
 * @param {import("../scripts/database/dbMgr").task[]} tasks - an array of task objects.
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
      const creationDate = new Date(task.creation_date);
      const dueDate = new Date(task.due_date);
      const dayIndex = dueDate.getDay(); // Sunday - Saturday : 0 - 6
      const dayContainers = document.querySelectorAll('.calendar .day');
      const dayContainer = dayContainers[dayIndex];
      const msDay = 60*60*24*1000;
  
      if (dayContainer) {
        dayContainer.appendChild(taskPv);
      }

      // TODO: Calculate number of squares to shade and populate the squares into the view
      const totalDays = (dueDate - creationDate) / msDay;      // gives total number of days task can be done within
      const daysLeft = (dueDate - creationDate) / msDay;      // days left

    });
  }

  
  document.addEventListener("DOMContentLoaded", function () {
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
  
    // creates the popup when the add task button is clicked
    document.querySelectorAll(".add-task").forEach((button) => {
      button.addEventListener("click", function () {
        const popup = document.createElement("task-popup");
        document.body.appendChild(popup);
      });
    });
  
  });
  