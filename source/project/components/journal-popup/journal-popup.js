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

			// close the popup when user presses x
			const closeButton = div.querySelector("#closeBtn");
			closeButton.addEventListener("click", () => {
				this.remove();
			});

			// populate the labels from local storage
			this.populateLabels();
		};

		// append everything to the shadow root
		shadowRoot.append(div, overlay);
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
		}, 500);
	}

	/**
	 * @method populateLabels
	 * @description Populates the label selector with labels from local storage.
	 */
	populateLabels() {
		const labelContainer = this.shadowRoot.getElementById("label");
		const labels = JSON.parse(localStorage.getItem("labels")) || [];

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
					const labels =
						JSON.parse(localStorage.getItem("labels")) || [];
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
			const div = document.createElement("div");
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
			creation_date: this.shadowRoot.querySelector("#currDate").value,
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
