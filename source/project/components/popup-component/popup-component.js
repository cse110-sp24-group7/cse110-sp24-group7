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

    // get the css file and append it to the shadow root
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "popup-component.css";
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
      const response = await fetch("popup-component.html");
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

      this.shadowRoot
        .querySelector("#label")
        .addEventListener("change", this.newLabel.bind(this));

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
    // get the label and the labels from local storage
    const labelSelector = this.shadowRoot.querySelector("#label");
    const labels = JSON.parse(localStorage.getItem("labels")) || [];

    // populate the selector with stored labels
    labels.forEach((label) => {
      let option = document.createElement("option");
      option.value = label;
      option.textContent = label;
      labelSelector.appendChild(option);
    });
  }

  /**
   * @method newLabel
   * @description Handles the creation of a new label and saves it to local storage.
   * @param {Event} event - The change event
   */
  newLabel(event) {
    // load labels from local storage
    let labels = JSON.parse(localStorage.getItem("labels")) || [];
    if (event.target.value === "New-Label") {
      // let the user input a new label and add it to the selector list
      let newLabel = prompt("Enter a new label:");
      // check if the label is valid and not already in the list
      if (newLabel === null || newLabel === "") {
        // default back to Label
        event.target.value = "Label";
        return;
      }
      else if (labels.includes(newLabel)) {
        // select the already existing label
        event.target.value = newLabel;
      }
      else {
        let option = document.createElement("option");
        option.value = newLabel;
        option.textContent = newLabel;
        event.target.appendChild(option);
        event.target.value = newLabel;
        // save the new label to local storage
        let labels = JSON.parse(localStorage.getItem("labels")) || [];
        labels.push(newLabel);
        localStorage.setItem("labels", JSON.stringify(labels));
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
      label: this.shadowRoot.getElementById("label").value,
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
customElements.define("popup-component", PopupComponent);

// creates the popup when the add task button is clicked
document.getElementById("open-popup").addEventListener("click", function () {
  const popup = document.createElement("popup-component");
  document.body.appendChild(popup);
});
