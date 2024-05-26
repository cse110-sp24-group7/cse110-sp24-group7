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
    style.href = "/source/project/components/popup-component/task-popup.css";
    this.shadowRoot.append(style);

    // adds the overlay css style to our program(makes the background grey out)
    // click anywhere outside the container to close the container and remove overlay
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    overlay.addEventListener("click", () => {
      this.style.display = "none";
    });

    // waits for the css to load before the html popup occurs
    const div = document.createElement("div");
    style.onload = async () => {
      div.setAttribute("class", "popup-container");
      const response = await fetch("/source/project/components/popup-component/popup-component.html");
      const html = await response.text();
      div.innerHTML = html;

      // append everything to the shadow root after loading HTML
      this.shadowRoot.append(div, overlay);

      // add the close button event listener here
      this.shadowRoot
        .querySelector("#closeBtn")
        .addEventListener("click", () => {
          this.style.display = "none";
        });

      // populate the labels from local storage
      this.populateLabels();
    };
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
    const labels = JSON.parse(localStorage.getItem("labels")) || [];

    // clear the label container
    labelContainer.innerHTML = "";

    // add "New Label" option
    let newLabelDiv = document.createElement("div");
    newLabelDiv.textContent = "New Label";
    newLabelDiv.classList.add("label-item");
    newLabelDiv.addEventListener("click", this.newLabel.bind(this));
    labelContainer.appendChild(newLabelDiv);
    labelContainer.appendChild(document.createElement("hr"));

    // populate the dropdown with stored labels
    labels.forEach((label) => {
      let div = document.createElement("div");
      div.textContent = label;
      div.classList.add("label-item");
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
    let labels = JSON.parse(localStorage.getItem("labels")) || [];

    // remove the label from the local storage array
    labels = labels.filter((item) => item !== label);
    localStorage.setItem("labels", JSON.stringify(labels));

    // remove the label from the selected labels set
    this.selectedLabels.delete(label);

    // remove the label element from the DOM
    labelElement.remove();
  }

  /**
   * @method newLabel
   * @description Handles the creation of a new label and saves it to local storage.
   * @param {Event} event - The change event
   */
  newLabel() {
    let newLabel = prompt("Enter a new label:");
    if (newLabel !== null && newLabel.trim() !== "") {
      let labels = JSON.parse(localStorage.getItem("labels")) || [];
      if (!labels.includes(newLabel)) {
        labels.push(newLabel);
        localStorage.setItem("labels", JSON.stringify(labels));
        this.populateLabels();
      }
    }
  }

  /**
   * @method getUserID
   * @description Generates a unique user ID for the current user, or retrieves an existing one from local storage.
   * @returns {string} The user ID
   */
  getUserID() {
    // check if the user ID already exists in local storage
    let userID = localStorage.getItem("userID");
    if (!userID) {
      // if not, generate a new user ID and store it
      userID = Math.random().toString(36).substr(2, 9);
      localStorage.setItem("userID", userID);
    }
    return userID;
  }

  /**
   * @method getTasksFromStorage
   * @description Retrieves the tasks array from local storage, or returns an empty array if no tasks are found.
   * @returns {Array} The array of tasks
   */
  getTasksFromStorage() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  /**
   * @method saveTasksToStorage
   * @description Saves the given tasks array to local storage after converting it to a JSON string.
   * @param {Array} tasks - The array of tasks to save
   */
  saveTasksToStorage(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
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
      creator_id: userID,
      task_name: this.shadowRoot.getElementById("title").value,
      task_content: this.shadowRoot.getElementById("description").value,
      creation_date: dateString,
      due_date: this.shadowRoot.getElementById("dueDate").value,
      priority: this.shadowRoot.getElementById("priority").value,
      labels: Array.from(this.selectedLabels),
      expectedTime: this.shadowRoot.getElementById("expectedTime").value,
    };

    // get existing tasks from local storage or initialize an empty array
    let tasks = this.getTasksFromStorage();

    // add the new task to the array
    tasks.push(task);

    // convert the updated array to JSON and save it back to local storage
    this.saveTasksToStorage(tasks);
    // log the updated tasks array so see it working
    console.log("Form Data Saved:", tasks);

    // reset form and hide popup
    event.target.reset();
    this.style.display = "none";
  }
}

// define the custom element
customElements.define("task-popup-component", PopupComponent);

// creates the popup when the add task button is clicked
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("open-task-popup").addEventListener("click", function () {
    const popup = document.createElement("task-popup-component");
    document.body.appendChild(popup);
  });
});
