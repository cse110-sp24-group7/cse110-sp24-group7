console.log("all-tasks.js script loaded"); // Add this line

/**
 * Adds tasks to the task containers.
 * @param {import("../scripts/database/dbMgr").task[]} tasks - an array of task objects.
 */
function tasksRendererCallback(tasks) {
    console.log("tasksRendererCallback called");
    console.log(tasks);


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
        const taskContainer = dayContainer.querySelector('.task-container');
        const daysLeftContainer = dayContainer.querySelector('.time-left-container .days-left');
        taskContainer.appendChild(taskPv);   

        // TODO: Calculate number of squares to shade and populate the squares into the view
        const totalDays = (dueDate - creationDate) / msDay;      // gives total number of days task can be done within
        const daysLeft = (dueDate - creationDate) / msDay;      // days left
        const daysPast = totalDays - daysLeft;
        const graySquares = Math.round((daysPast / totalDays) * 10); // # of gray squares for days past
        const greenSquares = 10 - graySquares; // # of gray squares for days past
        
        console.log("calculations completed with " + graySquares + " " + greenSquares);

        // Populate the gray squares
        for (let i = 0; i < graySquares; i++) {
            const square = document.createElement('div');
            square.classList.add('day-left-square');
            square.style.backgroundColor = '#bdbdbd';
            daysLeftContainer.appendChild(square);
        }
        
        // Populate the green squares
        for (let i = 0; i < greenSquares; i++) {
            const square = document.createElement('div');
            square.classList.add('day-left-square');
            square.style.backgroundColor = '#4caf50';
            daysLeftContainer.appendChild(square);
        }

        // Display amount of time left
        // Update days left text
        const daysLeftTextContainer = dayContainer.querySelector('.days-left-text');
        daysLeftTextContainer.querySelector('h3').textContent = `${Math.ceil(daysLeft)} days left`;
      } else {
        console.warn("No day container found for day index:", dayIndex); // Debugging log
      }
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
  
    /*
    window.api.getTasks((tasks) => {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      tasksRendererCallback(tasks);
    });
    */
  
    // creates the popup when the add task button is clicked
    document.querySelectorAll(".add-task").forEach((button) => {
      button.addEventListener("click", function () {
        const popup = document.createElement("task-popup");
        document.body.appendChild(popup);
      });
    });

    const testTask = {
        task_name: "Test Task",
        task_content: "This is a test task",
        due_date: "2024-06-10",
        creation_date: "2024-06-01",
        priority: "P1",
        expected_time: "2 hours"
    };
    tasksRendererCallback([testTask]);
  
  });






/**
 * @class Filter
 * @description A custom element that allows users to filter tasks based on their properties.
 * @extends HTMLElement
 */
class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Load the CSS file and attach it to the shadow DOM
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "../filter/filter.css";
    this.shadowRoot.append(style);

    // Create the main container for the filter component
    const body = document.createElement("div");
    body.setAttribute("class", "filter-container");

    // Load the HTML content and append it to the shadow DOM
    style.onload = async () => {
      const response = await fetch("../filter/filter.html");
      const html = await response.text();
      body.innerHTML = html;
      this.shadowRoot.append(body);

      // Populate labels and add event listeners for priorities and reset button
      this.populateLabels();
      this.addPriorityListeners();
      this.addResetListener();
    };
  }

  /**
   * @method populateLabels
   * @description Populates the labels as options in the multi-select dropdown.
   * @returns {void}
   */
  populateLabels() {
    const labels = this.getLabelsFromStorage();
    const labelContainer = this.shadowRoot.getElementById("labels");

    // Clear the label container before populating it
    labelContainer.innerHTML = "";

    // Check if labels is a non-empty array and populate the dropdown
    if (Array.isArray(labels) && labels.length > 0) {
      labels.forEach((label) => {
        let div = document.createElement("div");
        div.classList.add("label-item");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        let labelBadge = document.createElement("span");
        labelBadge.classList.add("theLabels");
        labelBadge.textContent = label;

        div.appendChild(checkbox);
        div.appendChild(labelBadge);
        div.addEventListener("click", (e) =>
          this.toggleSelection(e, div, "labels")
        );

        labelContainer.appendChild(div);
      });
    }
  }

  /**
   * @method addPriorityListeners
   * @description Adds event listeners to priority items.
   * @returns {void}
   */
  addPriorityListeners() {
    const priorityContainer = this.shadowRoot.getElementById("priority");
    if (priorityContainer) {
      const priorityItems =
        priorityContainer.getElementsByClassName("priority-item");
      Array.from(priorityItems).forEach((item) => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("checkbox");

        item.insertBefore(checkbox, item.firstChild);
        item.addEventListener("click", (e) =>
          this.toggleSelection(e, item, "priorities")
        );
      });
    }
  }

  /**
   * @method addResetListener
   * @description Adds an event listener to the reset button to clear the filter.
   * @returns {void}
   */
  addResetListener() {
    const resetButton = this.shadowRoot.getElementById("resetBtn");
    // Add click event listener to reset button to clear filter selections
    resetButton.addEventListener("click", () => this.clearFilter());
  }

  /**
   * @method getLabelsFromStorage
   * @description Retrieves the labels from local storage.
   * @returns {Array} An array of labels.
   */
  getLabelsFromStorage() {
    return JSON.parse(localStorage.getItem("labels")) || [];
  }

  /**
   * @method toggleSelection
   * @description Toggles the selection of a label or priority.
   * @param {Event} e - The click event.
   * @param {HTMLElement} element - The element to toggle.
   * @param {string} type - The type of selection ('labels' or 'priorities').
   * @returns {void}
   */
  toggleSelection(e, element, type) {
    // Prevent checkbox from toggling twice when clicked
    if (e.target.tagName === "INPUT") {
      e.stopPropagation();
      return;
    }

    const checkbox = element.querySelector('input[type="checkbox"]');
    const isChecked = !checkbox.checked;
    checkbox.checked = isChecked;

    const selectedClass = "selected";
    const isSelected = element.classList.toggle(selectedClass, isChecked);
    const selectedItems =
      JSON.parse(localStorage.getItem(`selected${type}`)) || [];

    if (isSelected) {
      selectedItems.push(element.textContent.trim());
    } else {
      const index = selectedItems.indexOf(element.textContent.trim());
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    }

    // Update local storage with the new selection state
    localStorage.setItem(`selected${type}`, JSON.stringify(selectedItems));
  }

  /**
   * @method clearFilter
   * @description Clears the filter by removing the selected labels and priorities from local storage.
   * @returns {void}
   */
  clearFilter() {
    localStorage.removeItem("selectedlabels");
    localStorage.removeItem("selectedpriorities");

    // clear the visual selections
    const labelContainer = this.shadowRoot.getElementById("labels");
    const priorityContainer = this.shadowRoot.getElementById("priority");

    // Remove the selected class from all labels and priorities
    if (labelContainer) {
      const labelItems = labelContainer.getElementsByClassName("label-item");
      Array.from(labelItems).forEach((item) => {
        item.classList.remove("selected");
        item.querySelector('input[type="checkbox"]').checked = false;
      });
    }
    if (priorityContainer) {
      const priorityItems =
        priorityContainer.getElementsByClassName("priority-item");
      Array.from(priorityItems).forEach((item) => {
        item.classList.remove("selected");
        item.querySelector('input[type="checkbox"]').checked = false;
      });
    }
  }

  /**
   * @method connectedCallback
   * @description Called when the element is added to the DOM.
   * @returns {void}
   */
  connectedCallback() {
    // Clear previous selections when the component is connected to the DOM
    this.clearFilter();
  }
}

customElements.define("filter-component", Filter);

  
