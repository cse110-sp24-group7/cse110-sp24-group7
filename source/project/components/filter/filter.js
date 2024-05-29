/**
 * @class Filter
 * @description A custom element that allows users to filter tasks based on their properties.
 * @extends HTMLElement
 */
class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Create a button
    const button = document.createElement("button");
    button.textContent = "Filter";
    button.addEventListener("click", () => this.toggleDropdown());

    // Create the multi-select dropdown, initially hidden
    this.select = document.createElement("select");
    this.select.setAttribute("multiple", "");
    this.select.style.display = "none";
    this.select.innerHTML = `
      <option value="label">Label</option>
      <option value="time">Expected Time</option>
      <option value="priority">Priority</option>
      <option value="due-date">Due Date</option>
    `;
    this.select.addEventListener("change", () => this.filterItems());

    // Create the content container
    this.content = document.createElement("div");
    this.content.setAttribute("id", "content");
    this.content.innerHTML = `
      <!-- the tasks should be added here -->
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .item { display: none; }
      #filter-container { margin-bottom: 10px; }
      .indented-option { padding-left: 20px; }
    `;

    // Append elements to the shadow DOM
    this.shadowRoot.append(style, button, this.select, this.content);

    // Initial filter to show all items
    this.filterItems();
  }

  /**
   * @method toggleDropdown
   * @description Toggles the visibility of the multi-select dropdown.
   * If the dropdown is hidden, it will be displayed, and vice versa.
   * @returns {void}
   */
  toggleDropdown() {
    if (this.select.style.display === "none") {
      this.select.style.display = "block";
    } else {
      this.select.style.display = "none";
    }
  }

  /**
   * @method filterItems
   * @description Filters the items based on the selected options in the dropdown.
   * @returns {void}
   */
  filterItems() {
    const selectedOptions = Array.from(this.select.selectedOptions).map(
      (option) => option.value
    );

    // Check if label is selected
    if (selectedOptions.includes("label")) {
      // Populate the labels as options
      this.populateLabels();
    }

    // Check if "time" or "priority" is selected and add "High" and "Low" options
    if (selectedOptions.includes("time")) {
      this.addHighLowOptions("time");
    }

    if (selectedOptions.includes("priority")) {
      this.addHighLowOptions("priority");
    }

    const items = this.shadowRoot.querySelectorAll(".item");
    items.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      if (
        selectedOptions.includes(itemCategory) ||
        selectedOptions.length === 0
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }

  /**
   * @method populateLabels
   * @description Populates the labels as options in the multi-select dropdown.
   * @returns {void}
   */
  populateLabels() {
    const labels = this.getLabelsFromStorage();

    // Remove previous label options
    Array.from(this.select.options).forEach((option) => {
      if (
        option.classList.contains("indented-option") &&
        option.value.startsWith("label-")
      ) {
        this.select.removeChild(option);
      }
    });

    // Find the position of the "Label" option
    const labelOptionIndex = Array.from(this.select.options).findIndex(
      (option) => option.value === "label"
    );

    // Populate the labels as indented options
    labels.forEach((label) => {
      const option = document.createElement("option");
      option.value = `label-${label}`;
      option.textContent = label;
      option.classList.add("indented-option");
      this.select.add(option, this.select.options[labelOptionIndex + 1]);
    });
  }

  /**
   * @method addHighLowOptions
   * @description Adds "High" and "Low" options under the selected category.
   * @param {string} category - The category under which "High" and "Low" options will be added.
   */
  addHighLowOptions(category) {
    // Find the position of the category option
    const categoryOptionIndex = Array.from(this.select.options).findIndex(
      (option) => option.value === category
    );

    // Check if "High" option already exists under this category
    let highExists = false;
    let lowExists = false;
    for (let i = categoryOptionIndex + 1; i < this.select.options.length; i++) {
      const option = this.select.options[i];
      if (option && option.classList.contains("indented-option")) {
        if (option.value === `${category}-high`) highExists = true;
        if (option.value === `${category}-low`) lowExists = true;
      } else {
        break;
      }
    }

    if (!highExists) {
      // Create and add "High" option
      const high = document.createElement("option");
      high.value = `${category}-high`;
      high.textContent = "High";
      high.classList.add("indented-option");
      this.select.add(high, this.select.options[categoryOptionIndex + 1]);
    }

    if (!lowExists) {
      // Create and add "Low" option
      const low = document.createElement("option");
      low.value = `${category}-low`;
      low.textContent = "Low";
      low.classList.add("indented-option");
      this.select.add(low, this.select.options[categoryOptionIndex + 2]);
    }
  }

  /**
   * @method getLabelsFromStorage
   * @description Retrieves the labels from local storage.
   * @returns {Array} An array of labels.
   */
  getLabelsFromStorage() {
    // Get the labels from local storage
    return JSON.parse(localStorage.getItem("labels")) || [];
  }

  /**
   * @method connectedCallback
   * @description Called when the element is added to the DOM.
   * It initializes the filter by calling the filterItems method.
   * @returns {void}
   */
  connectedCallback() {
    this.filterItems();
  }
}

// Define the custom element
customElements.define("filter-component", Filter);
