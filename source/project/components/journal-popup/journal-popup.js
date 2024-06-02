/* eslint-disable */
class JournalPopup extends HTMLElement {
	/**
	 * @constructor
	 * @description Creates an instance of JournalPopup, sets up the shadow DOM, and initializes
	 * the component with CSS and HTML content loaded asynchronously.
	 */
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: "open" });

		// set to store selected labels
		this.selectedLabels = new Set();

		// map to store label colors with labels
		this.labelToColor = new Map(
			Object.entries(
				JSON.parse(window.localStorage.getItem("labelColors") || "{}")
			)
		);

		this.colors = [
			"#ffd0f7",
			"#e1a9f8",
			"#bdbbfa",
			"#a9dcf8",
			"#a5d3a3",
			"#edf7b5",
			"#f7e1a3",
			"#f7a9a9",
			"#d1s8f4",
			"#ebad6f",
			"#cdb4db"
		];

		// get the css file and append it to the shadow root
		const style = document.createElement("link");
		style.rel = "stylesheet";
		style.href = "../journal-popup/journal-popup.css";
		shadowRoot.append(style);

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
			const response = await fetch("../journal-popup/journal-popup.html");
			const html = await response.text();
			div.innerHTML = html;

			// append everything to the shadow root
			this.shadowRoot.append(div, overlay);

			// add the close button event listener to the close button
			this.shadowRoot
				.querySelector("#closeBtn")
				.addEventListener("click", () => {
					this.remove();
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
				.querySelector("#journalForm")
				.addEventListener("submit", this.onSubmit.bind(this));
		}, 3000);
	}

	/**
	 * @method populateLabels
	 * @description Populates the label selector with labels from local storage.
	 */
	populateLabels() {
		const labelContainer = this.shadowRoot.getElementById("label");
		const selectedLabelsContainer =
			this.shadowRoot.querySelector(".selectedLabels");
		const labels = JSON.parse(window.localStorage.getItem("labels")) || [];

		// Clear the label container
		labelContainer.innerHTML = "";

		// Add new label input
		this.addNewLabelInput(labelContainer);

		// Populate the dropdown with stored labels
		this.populateLabelDropdown(labelContainer, labels);

		// Populate the selected labels
		this.populateSelectedLabels(selectedLabelsContainer);
	}

	/**
	 * @method addNewLabelInput
	 * @description Adds an input field for creating new labels.
	 * @param {HTMLElement} container - The container to add the input field to
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
					let labels =
						JSON.parse(localStorage.getItem("labels")) || [];
					if (!labels.includes(newLabel)) {
						labels.push(newLabel);
						localStorage.setItem("labels", JSON.stringify(labels));
						this.labelToColor.set(newLabel, newColor);
						this.saveLabelColors();
					}
					this.selectedLabels.add(newLabel);
					this.populateLabels();
				}
			}
		});
	}

	/**
	 * @method setColors
	 * @description Sets the colors for the given labels if they do not already have a color.
	 * @param {Array} labels - The list of labels to set colors for
	 * @returns {void}
	 */
	setColors(labels) {
		labels.forEach((label) => {
			if (!this.labelToColor.has(label)) {
				const newColor = this.randomColor();
				this.labelToColor.set(label, newColor);
				this.saveLabelColors();
			}
		});
	}

	/**
	 * @method saveLabelColors
	 * @description Saves the label colors to local storage.
	 * @returns {void}
	 */
	saveLabelColors() {
		const obj = Object.fromEntries(this.labelToColor);
		localStorage.setItem("labelColors", JSON.stringify(obj));
	}

	/**
	 * @method randomColor
	 * @description Returns a random color from the colors array.
	 * @returns {string} - A random color from the colors array
	 */
	randomColor() {
		return this.colors[Math.floor(Math.random() * this.colors.length)];
	}

	/**
	 * @method populateLabelDropdown
	 * @description Populates the label dropdown with stored labels.
	 * @param {HTMLElement} container - The container to add the labels to
	 * @param {Array} labels - The list of labels to populate
	 */
	populateLabelDropdown(container, labels) {
		this.setColors(labels);
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
	 */
	deleteLabel(labelElement) {
		const labelDiv = labelElement.parentElement;
		const label = labelElement.textContent;
		let labels = JSON.parse(window.localStorage.getItem("labels")) || [];

		// Remove the label from the local storage array
		labels = labels.filter((item) => item !== label);
		window.localStorage.setItem("labels", JSON.stringify(labels));

		// Remove the label from the selected labels set
		this.selectedLabels.delete(label);

		// Remove the entire label div from the DOM
		labelDiv.remove();

		this.labelToColor.delete(label);
		this.saveLabelColors();
	}

	/**
	 * @method getJournalsFromStorage
	 * @description Retrieves the tasks array from local storage, or returns an of journal entries if no entries are found.
	 * @returns {Array} The array of journal entries
	 */
	getJournalsFromStorage() {
		const storedData = JSON.parse(localStorage.getItem("journalData"));
		return Array.isArray(storedData) ? storedData : [];
	}

	/**
	 * @method saveJournalsToStorage
	 * @description Saves the given journalData array to local storage after converting it to a JSON string.
	 * @param {Array} journalData - The array of Journals to save
	 */
	saveJournalsToStorage(journalData) {
		localStorage.setItem("journalData", JSON.stringify(journalData));
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
	 */
	onSubmit(event) {
		event.preventDefault();

		// get the users input from form
		const journalData = {
			entry_id: Math.random().toString(36).substr(2, 9),
			entry_title: this.shadowRoot.querySelector("#title").value,
			entry_content: this.shadowRoot.querySelector("#description").value,
			creation_date: this.shadowRoot.querySelector("#dueDate").value,
			labels: Array.from(this.selectedLabels)
		};

		window.api.addEntry(journalData, (entries) => {
			this.saveJournalsToStorage(entries);
		});
		event.target.reset();
	}
}

// define the custom element
customElements.define("journal-popup", JournalPopup);
