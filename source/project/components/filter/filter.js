/**
 * @class Filter
 * @description A custom element that allows users to filter tasks based on their properties.
 * @extends HTMLElement
 */
class Filter extends HTMLElement {
	/**
	 * @constructor Filter
	 * @description Initializes the filter component.
	 */
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
	 * @memberof Filter
	 */
	populateLabels() {
		const labelContainer = this.shadowRoot.getElementById("labels");

		window.api.getLabels((labels) => {
			// Clear the label container before populating it
			labelContainer.innerHTML = "";

			// Check if labels is a non-empty array and populate the dropdown
			if (Array.isArray(labels) && labels.length > 0) {
				labels.forEach((label) => {
					const div = document.createElement("div");
					div.classList.add("label-item");

					const checkbox = document.createElement("input");
					checkbox.type = "checkbox";
					checkbox.classList.add("checkbox");

					const labelBadge = document.createElement("span");
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
		});
	}

	/**
	 * @method addPriorityListeners
	 * @description Adds event listeners to priority items.
	 * @returns {void}
	 * @memberof Filter
	 */
	addPriorityListeners() {
		const priorityContainer = this.shadowRoot.getElementById("priority");
		if (priorityContainer) {
			const priorityItems =
				priorityContainer.getElementsByClassName("priority-item");
			Array.from(priorityItems).forEach((item) => {
				const checkbox = document.createElement("input");
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
	 * @memberof Filter
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
	 * @memberof Filter
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
	 * @memberof Filter
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

		// Dispatch event to update all tasks view
		const filters = {
			startTime: "",
			endTime: "",
			labels: JSON.parse(localStorage.getItem(`selectedlabels`)) || [],
			priorities:
				JSON.parse(localStorage.getItem(`selectedpriorities`)) || [],
			exclusive: false
		};
		this.dispatchEvent(
			new CustomEvent("filterUpdate", {
				bubbles: true,
				composed: true,
				detail: filters
			})
		);
	}

	/**
	 * @method clearFilter
	 * @description Clears the filter by removing the selected labels and priorities from local storage.
	 * @returns {void}
	 * @memberof Filter
	 */
	clearFilter() {
		localStorage.removeItem("selectedlabels");
		localStorage.removeItem("selectedpriorities");

		// clear the visual selections
		const labelContainer = this.shadowRoot.getElementById("labels");
		const priorityContainer = this.shadowRoot.getElementById("priority");

		// Remove the selected class from all labels and priorities
		if (labelContainer) {
			const labelItems =
				labelContainer.getElementsByClassName("label-item");
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

		// clear search bar
		const searchInput = document.getElementById("searchInput");
		if (searchInput) {
			searchInput.value = "";
		}

		const filters = {
			startTime: "",
			endTime: "",
			labels: [],
			priorities: [],
			exclusive: false
		};

		this.dispatchEvent(
			new CustomEvent("filterUpdate", {
				bubbles: true,
				composed: true,
				detail: filters
			})
		);
	}

	/**
	 * @method connectedCallback
	 * @description Called when the element is added to the DOM.
	 * @returns {void}
	 * @memberof Filter
	 */
	connectedCallback() {
		// Clear previous selections when the component is connected to the DOM
		this.clearFilter();
	}
}

customElements.define("filter-component", Filter);
