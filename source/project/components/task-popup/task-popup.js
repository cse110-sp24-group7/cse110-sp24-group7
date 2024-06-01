/**
 * @class
 * @description Represents a popup component that can be dynamically added to the DOM. This component
 * supports custom styling and behavior through a Shadow DOM, and handles form submissions to save task data.
 */
class PopupComponent extends HTMLElement {
  /**
   * @constructor
   * @description Creates an instance of PopupComponent, sets up the shadow DOM, and initializes
   * the component with CSS and HTML content loaded asynchronously.
   */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // set to store selected labels
    this.selectedLabels = new Set();

    // get the css file and append it to the shadow root
    const style = document.createElement("link");
    style.rel = "stylesheet";
    // NOTE this is relative to the integrate.js loading it from pages/integrate.js
    style.href = "../task-popup/task-popup.css";
    this.shadowRoot.append(style);

    // adds the overlay css style to our program(makes the background grey out)
    // click anywhere outside the container to close the container and remove overlay
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    overlay.addEventListener("click", () => {
      this.remove();
    });

    // waits for the css to load before the html popup occurs
    const div = document.createElement("div");
    style.onload = async () => {
      div.setAttribute("class", "popup-container");
      const response = await fetch("../task-popup/task-popup.html");
      const html = await response.text();
      div.innerHTML = html;

      // append everything to the shadow root after loading HTML
      this.shadowRoot.append(div, overlay);

      // add the close button event listener here
      this.shadowRoot
        .querySelector("#closeBtn")
        .addEventListener("click", () => {
          this.remove();
        });

      // populate the labels from local storage
      this.populateLabels();
    };
  }

  openForEdit(taskDetails) {
    // Populate the task popup with the details of the selected task for editing
    const titleInput = this.shadowRoot.getElementById("title");
    const descriptionTextarea = this.shadowRoot.getElementById("description");
    const dueDateInput = this.shadowRoot.getElementById("dueDate");
    const prioritySelect = this.shadowRoot.getElementById("priority");
    const expectedTimeInput = this.shadowRoot.getElementById("expectedTime");

    titleInput.value = taskDetails.task_name;
    descriptionTextarea.value = taskDetails.task_content;
    dueDateInput.value = taskDetails.due_date;
    prioritySelect.value = taskDetails.priority;
    expectedTimeInput.value = taskDetails.expected_time;

    // Show the popup for editing
    this.style.display = "block";
}

  /**
   * @method connectedCallback
   * @description Lifecycle method that is called when the component is inserted into the DOM.
   * It sets up event listeners for form submission within the shadow DOM.
   */
  connectedCallback() {
    // event listener to form submission
    setTimeout(() => {
      this.shadowRoot
        .querySelector("#taskForm")
        .addEventListener("submit", this.onSubmit.bind(this));
    }, 3000);
  }

  /**
   * @method populateLabelSelector
   * @description Populates the label selector with labels from local storage.
   */
  populateLabels() {
    const labelContainer = this.shadowRoot.getElementById("label");
    const labels = JSON.parse(window.localStorage.getItem("labels")) || [];

    // clear the label container
    labelContainer.innerHTML = "";

    // add "New Label" option
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("label-input");
    input.placeholder = "New Label";
    labelContainer.appendChild(input);
    labelContainer.appendChild(document.createElement("hr"));

    // add event listener for input to save new label
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const newLabel = input.value.trim();
        if (newLabel) {
          let labels = JSON.parse(localStorage.getItem("labels")) || [];
          if (!labels.includes(newLabel)) {
            labels.push(newLabel);
            localStorage.setItem("labels", JSON.stringify(labels));
          }
          this.selectedLabels.add(newLabel);
          this.populateLabels();
        }
      }
    });

    // populate the dropdown with stored labels
    labels.forEach((label) => {
      let div = document.createElement("div");
      div.textContent = label;
      div.classList.add("label-item");
      if (this.selectedLabels.has(label)) {
        div.classList.add("selected");
      }
      div.addEventListener("click", () => this.selectLabel(div));
      div.addEventListener("dblclick", () => this.deleteLabel(div));
      labelContainer.appendChild(div);
    });
  }

  /**
   * @method selectLabel
   * @description Toggles the selection state of a label.
   * @param {HTMLElement} labelElement - The label element to toggle
   */
  selectLabel(labelElement) {
    const label = labelElement.textContent;
    if (this.selectedLabels.has(label)) {
      this.selectedLabels.delete(label);
      labelElement.classList.remove("selected");
    } else {
      this.selectedLabels.add(label);
      labelElement.classList.add("selected");
    }
  }

  /**
   * @method deleteLabel
   * @description Deletes a label from the list and updates local storage.
   * @param {HTMLElement} labelElement - The label element to delete
   */
  deleteLabel(labelElement) {
    const label = labelElement.textContent;
    let labels = JSON.parse(window.localStorage.getItem("labels")) || [];

    // remove the label from the local storage array
    labels = labels.filter((item) => item !== label);
    window.localStorage.setItem("labels", JSON.stringify(labels));

    // remove the label from the selected labels set
    this.selectedLabels.delete(label);

    // remove the label element from the DOM
    labelElement.remove();
  }

  /**
   * @method getUserID
   * @description Generates a unique user ID for the current user, or retrieves an existing one from local storage.
   * @returns {string} The user ID
   */
  getUserID() {
    // check if the user ID already exists in local storage
    let userID = window.localStorage.getItem("userID");
    if (!userID) {
      // if not, generate a new user ID and store it
      userID = Math.random().toString(36).substr(2, 9);
      window.localStorage.setItem("userID", userID);
    }
    return userID;
  }

  /**
   * @method getTasksFromStorage
   * @description Retrieves the tasks array from local storage, or returns an empty array if no tasks are found.
   * @returns {Array} The array of tasks
   */
  getTasksFromStorage() {
    return JSON.parse(window.localStorage.getItem("tasks")) || [];
  }

  /**
   * @method saveTasksToStorage
   * @description Saves the given tasks array to local storage after converting it to a JSON string, then closes the popup.
   * @param {Array} tasks - The array of tasks to save
   */
  saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    let event = new CustomEvent("storageUpdate", {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
    this.remove();
  }

  /**
   * @method onSubmit
   * @description Handles form submission, prevents default submission, saves and logs data, resets form, and hides popup.
   * @param {Event} event - The form submission event
   */
  onSubmit(event) {
    event.preventDefault();

    // get the current date and time
    let currentDate = new Date();
    let dateString = currentDate.toString();

    // get the user ID
    let userID = this.getUserID();

    // get the users input and store it in a task object
    let task = {
      task_id: Math.random().toString(36).substr(2, 9),
      // creator_id: userID,
      task_name: this.shadowRoot.getElementById("title").value,
      task_content: this.shadowRoot.getElementById("description").value,
      creation_date: dateString,
      due_date: this.shadowRoot.getElementById("dueDate").value,
      priority: this.shadowRoot.getElementById("priority").value,
      labels: Array.from(this.selectedLabels),
      expected_time: this.shadowRoot.getElementById("expectedTime").value,
    };

    window.api.addTask(task, (tasks) => {
      this.saveTasksToStorage(tasks);
    });
    event.target.reset();
  }
}

// define the custom element
customElements.define("task-popup", PopupComponent);
