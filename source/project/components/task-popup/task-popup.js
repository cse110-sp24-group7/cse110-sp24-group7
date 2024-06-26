/**
 * @class
 * @description Represents a popup component that can be dynamically added to the DOM. This component
 * supports custom styling and behavior through a Shadow DOM, and handles form submissions to save task data.
 */
class TaskPopup extends HTMLElement {
	/**
	 * @constructor TaskPopup
	 * @description Creates an instance of TaskPopup, sets up the shadow DOM, and initializes
	 * the component with CSS and HTML content loaded asynchronously.
	 */
	constructor() {
		super();
		this.attachShadow({ mode: "open" });

		// set to store selected labels
		this.selectedLabels = new Set();

		this.colors = [
			"#e1c6b1",
			"#e3a896",
			"#d15f3a",
			"#e5ac29",
			"#b5af61",
			"#9dc0ba",
			"#769cc0",
			"#ccb89f",
			"#de9f74",
			"#4e7c57",
			"#0b4d4b",
			"#667f86",
			"#aa7529",
			"#c1685a",
			"#c4c9e9",
			"#99779e",
			"#ccbdcf"
		];

		this.editMode = false; // Track whether we're editing an existing task
		this.editTaskId = null; // Track the ID of the task being edited

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

		// waits for the css to load before the html popup occurs to avoid weird loading glitches
		const div = document.createElement("div");
		style.onload = async () => {
			div.setAttribute("class", "popup-container");
			const response = await fetch("../task-popup/task-popup.html");
			const html = await response.text();
			div.innerHTML = html;

			this.shadowRoot.append(div, overlay);

			// add the close button event listener to the close button
			this.shadowRoot
				.querySelector("#closeBtn")
				.addEventListener("click", () => {
					this.remove();
				});
			this.shadowRoot
				.querySelector("#taskForm")
				.addEventListener("submit", this.onSubmit.bind(this));
			window.api.getLabelColorMap((map) => {
				this.labelToColor = map;
				// populate the labels from database
				this.populateLabels();
				this.dispatchEvent(
					new CustomEvent("popupReady", {
						bubbles: true,
						composed: true
					})
				);
			});
			if (this.dueDate) {
				this.setDueDate(this.dueDate);
			}
		};
	}

	/**
	 * @method setDueDate
	 * @description Sets the due date input field to the specified date.
	 * @param {Date} date - The date to set in the due date input field.
	 * @memberof TaskPopup
	 */
	setDueDate(date) {
		this.dueDate = date; // Store the date to use it later if needed
		const dueDateInput = this.shadowRoot.getElementById("dueDate");
		if (dueDateInput) {
			date.setHours(16, 59, 0, 0); // Set time to 11:59 PM
			const isoString = date.toISOString();
			const formattedDate = isoString.substring(0, isoString.length - 8);
			dueDateInput.value = formattedDate;
		}
	}

	/**
	 * @method taskEdit
	 * @param {Task} task - the task to edit
	 * @description Populates the popup component with data from taskpv when edit button is
	 * clicked.
	 * @memberof TaskPopup
	 */
	taskEdit(task) {
		this.editMode = true;
		this.editTaskId = task.task_id;

		// Selects the ids from the shadow DOM of the current componenet
		const titleInput = this.shadowRoot.getElementById("title");
		const descriptionText = this.shadowRoot.getElementById("description");
		const dueDateInput = this.shadowRoot.getElementById("dueDate");
		const prioritySelect = this.shadowRoot.getElementById("priority");
		const expectedTimeInput =
			this.shadowRoot.getElementById("expectedTime");

		// Populate the task with the information from taskDetails into a popup
		titleInput.value = task.task_name;
		descriptionText.value = task.task_content;
		dueDateInput.value = task.due_date;
		prioritySelect.value = task.priority;
		expectedTimeInput.value = task.expected_time;

		// Clear and populate selectedLabels set with task labels
		this.selectedLabels.clear();
		task.labels.forEach((label) => {
			this.selectedLabels.add(label);
		});
		this.populateLabels();

		// Show the popup for editing
		this.style.display = "block";
	}

	/**
	 * @method connectedCallback
	 * @description Lifecycle method that is called when the component is inserted into the DOM.
	 * It sets up event listeners for form submission within the shadow DOM.
	 * @memberof TaskPopup
	 */
	connectedCallback() {}

	/**
	 * @method populateLabels
	 * @description Populates the label selector with labels.
	 * @memberof TaskPopup
	 */
	populateLabels() {
		const labelContainer = this.shadowRoot.getElementById("label");
		const selectedLabelsContainer =
			this.shadowRoot.querySelector(".selectedLabels");

		window.api.getLabels((labels) => {
			// Clear the label container
			labelContainer.innerHTML = "";

			// Add new label input
			this.addNewLabelInput(labelContainer);

			// Populate the dropdown with stored labels
			this.populateLabelDropdown(labelContainer, labels);

			// Populate the selected labels
			this.populateSelectedLabels(selectedLabelsContainer);
		});
	}

	/**
	 * @method addNewLabelInput
	 * @description Adds an input field for creating new labels.
	 * @param {HTMLElement} container - The container to add the input field to
	 * @memberof TaskPopup
	 */
	addNewLabelInput(container) {
		const newLabelDiv = document.createElement("div");
		newLabelDiv.classList.add("new-label-item");

		const create = document.createElement("span");
		create.textContent = "create: ";

		const input = document.createElement("input");
		input.type = "text";
		input.placeholder = "new label";

		newLabelDiv.appendChild(create);
		newLabelDiv.appendChild(input);
		container.appendChild(newLabelDiv);

		// Add event listener for input to save new label
		input.addEventListener("keydown", (e) => {
			if (e.key === "Enter") {
				e.preventDefault();
				const newLabel = input.value.trim();
				if (newLabel) {
					window.api.getLabels((labels) => {
						if (!labels.includes(newLabel)) {
							const newColor = this.randomColor();
							window.api.addLabel(
								newLabel,
								newColor,
								(newLabels) => {
									localStorage.setItem(
										"labels",
										JSON.stringify(newLabels)
									);
									window.api.getLabelColorMap((map) => {
										this.labelToColor = map;
										this.selectedLabels.add(newLabel);
										this.populateLabels();
									});
								}
							);
						} else {
							this.selectedLabels.add(newLabel);
							this.populateLabels();
						}
					});
				}
			}
		});
	}

	/**
	 * @method randomColor
	 * @description Returns a random color from the colors array.
	 * @returns {string} - A random color from the colors array
	 * @memberof TaskPopup
	 */
	randomColor() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}

	/**
	 * @method populateLabelDropdown
	 * @description Populates the label dropdown with stored labels.
	 * @param {HTMLElement} container - The container to add the labels to
	 * @param {Array} labels - The list of labels to populate
	 * @memberof TaskPopup
	 */
	populateLabelDropdown(container, labels) {
		// this.setColors(labels);
		labels.forEach((label) => {
			if (!this.selectedLabels.has(label)) {
				const labelDiv = document.createElement("div");
				labelDiv.classList.add("unselected-label-item");

				const labelContent = document.createElement("div");
				labelContent.classList.add("unselected-label-content");
				labelContent.style.backgroundColor =
					this.labelToColor.get(label);

				const addSpan = document.createElement("span");
				addSpan.textContent = "+";
				addSpan.classList.add("addBtn");
				addSpan.addEventListener("click", () =>
					this.selectLabel(label, labelDiv)
				);

				const labelText = document.createElement("span");
				labelText.textContent = label;
				labelText.addEventListener("dblclick", () =>
					this.deleteLabel(labelText)
				);

				labelContent.appendChild(addSpan);
				labelContent.appendChild(labelText);
				labelDiv.appendChild(labelContent);
				container.appendChild(labelDiv);
			}
		});
	}

	/**
	 * @method populateSelectedLabels
	 * @description Populates the container with the selected labels.
	 * @param {HTMLElement} container - The container to add the selected labels to
	 * @memberof TaskPopup
	 */
	populateSelectedLabels(container) {
		container.innerHTML = "";

		if (this.selectedLabels.size === 0) {
			container.classList.add("no-labels");
		} else {
			container.classList.remove("no-labels");
		}

		this.selectedLabels.forEach((label) => {
			const selectedLabelDiv = document.createElement("div");
			selectedLabelDiv.classList.add("selected-label-item");
			selectedLabelDiv.style.backgroundColor =
				this.labelToColor.get(label);

			const removeSpan = document.createElement("span");
			removeSpan.textContent = "x";
			removeSpan.classList.add("removeBtn");
			removeSpan.addEventListener("click", () =>
				this.removeLabel(label, selectedLabelDiv)
			);

			const labelText = document.createElement("span");
			labelText.textContent = label;

			selectedLabelDiv.appendChild(removeSpan);
			selectedLabelDiv.appendChild(labelText);
			container.appendChild(selectedLabelDiv);
		});
	}

	/**
	 * @method selectLabel
	 * @description Handles the selection of a label, moving it to the selected labels container.
	 * @param {string} label - The label to select
	 * @param {HTMLElement} labelElement - The label element to remove from the dropdown
	 * @memberof TaskPopup
	 */
	selectLabel(label, labelElement) {
		this.selectedLabels.add(label);
		labelElement.remove();
		this.populateLabels();
	}

	/**
	 * @method removeLabel
	 * @description Handles the removal of a selected label, moving it back to the dropdown.
	 * @param {string} label - The label to remove
	 * @param {HTMLElement} selectedLabelDiv - The selected label element to remove
	 * @memberof TaskPopup
	 */
	removeLabel(label, selectedLabelDiv) {
		this.selectedLabels.delete(label);
		selectedLabelDiv.remove();
		this.populateLabels();
	}

	/**
	 * @method deleteLabel
	 * @description Deletes a label from the local storage and the selected labels set.
	 * @param {HTMLElement} labelElement - The label element to delete
	 * @returns {void}
	 * @memberof TaskPopup
	 */
	deleteLabel(labelElement) {
		const labelDiv = labelElement.parentElement;
		const label = labelElement.textContent;
		let labels = JSON.parse(window.localStorage.getItem("labels")) || [];

		// Remove the label from the local storage elements
		labels = labels.filter((item) => item !== label);
		window.localStorage.setItem("labels", JSON.stringify(labels));
		this.labelToColor.delete(label);

		window.api.deleteLabel(label, (labels) => {
			// Update localStorage in sync with database
			window.localStorage.setItem("labels", JSON.stringify(labels));
			window.api.getLabelColorMap((map) => {
				this.labelToColor = map;
			});
		});

		// Remove the label from the selected labels set
		this.selectedLabels.delete(label);

		// Remove the entire label div from the DOM
		labelDiv.remove();
	}

	/**
	 * @method getTasksFromStorage
	 * @description Retrieves the tasks array from local storage, or returns an empty array if no tasks are found.
	 * @returns {Task[]} The array of tasks
	 * @memberof TaskPopup
	 */
	getTasksFromStorage() {
		return JSON.parse(window.localStorage.getItem("tasks")) || [];
	}

	/**
	 * @method saveTasksToStorage
	 * @description Saves the given tasks array to local storage after converting it to a JSON string, then closes the popup.
	 * @param {Task[]} tasks - The array of tasks to save
	 * @memberof TaskPopup
	 */
	saveTasksToStorage(tasks) {
		localStorage.setItem("tasks", JSON.stringify(tasks));
		const event = new CustomEvent("storageUpdate", {
			bubbles: true,
			composed: true
		});
		this.dispatchEvent(event);
		this.remove();
	}

	/**
	 * @method onSubmit
	 * @description Handles form submission, prevents default submission, saves and logs data, resets form, and hides popup.
	 * @param {Event} event - The form submission event
	 * @memberof TaskPopup
	 */
	onSubmit(event) {
		event.preventDefault();

		// get the current date and time
		const currentDate = new Date();
		const dateString = currentDate.toString();

		// get the users input and store it in a task object
		const task = {
			task_id: this.editMode
				? this.editTaskId
				: Math.random().toString(36).substr(2, 9),
			task_name: this.shadowRoot.getElementById("title").value,
			task_content: this.shadowRoot.getElementById("description").value,
			creation_date: dateString,
			due_date: this.shadowRoot.getElementById("dueDate").value,
			priority: this.shadowRoot.getElementById("priority").value,
			labels: Array.from(this.selectedLabels),
			expected_time: this.shadowRoot.getElementById("expectedTime").value
		};

		if (this.editMode) {
			window.api.editTask(task, (tasks) => {
				this.saveTasksToStorage(tasks);
			});
		} else {
			window.api.addTask(task, (tasks) => {
				this.saveTasksToStorage(tasks);
			});
		}

		event.target.reset();
	}
}

// define the custom element
customElements.define("task-popup", TaskPopup);
