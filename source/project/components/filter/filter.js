/**
 * @class Filter
 * @description A custom element that allows users to filter tasks based on their properties.
 * @extends HTMLElement
 */
class Filter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Load the CSS file
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "../filter/filter.css";
    this.shadowRoot.append(style);

    const body = document.createElement("div");
    body.setAttribute("class", "filter-container");

    style.onload = async () => {
      const response = await fetch("../filter/filter.html");
      const html = await response.text();
      body.innerHTML = html;
      this.shadowRoot.append(body);
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

    // Clear the label container
    labelContainer.innerHTML = "";

    // Check if labels is an array and has elements
    if (Array.isArray(labels) && labels.length > 0) {
      // Populate the dropdown with stored labels
      labels.forEach((label) => {
        let div = document.createElement("div");
        div.textContent = label;
        div.classList.add("label-item");
        div.addEventListener("click", () =>
          this.toggleSelection(div, "labels")
        );
        labelContainer.appendChild(div);
      });
    }
  }

  /**
   * @method addPriorityEventListeners
   * @description Adds event listeners to priority items.
   * @returns {void}
   */
  addPriorityListeners() {
    const priorityContainer = this.shadowRoot.getElementById("priority");
    if (priorityContainer) {
      const priorityItems =
        priorityContainer.getElementsByClassName("priority-item");
      Array.from(priorityItems).forEach((item) => {
        item.addEventListener("click", () =>
          this.toggleSelection(item, "priorities")
        );
      });
    }
  }
    
    addResetListener() {
        const resetButton = this.shadowRoot.getElementById("resetBtn");
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
   * @param {HTMLElement} element - The element to toggle.
   * @param {string} type - The type of selection ('labels' or 'priorities').
   * @returns {void}
   */
  toggleSelection(element, type) {
    const selectedClass = "selected";
    const isSelected = element.classList.toggle(selectedClass);
    const selectedItems =
      JSON.parse(localStorage.getItem(`selected${type}`)) || [];

    if (isSelected) {
      selectedItems.push(element.textContent);
    } else {
      const index = selectedItems.indexOf(element.textContent);
      if (index > -1) {
        selectedItems.splice(index, 1);
      }
    }

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
  }
  /**
   * @method connectedCallback
   * @description Called when the element is added to the DOM.
   * @returns {void}
   */
  connectedCallback() {
    this.clearFilter();
  }
}

customElements.define("filter-component", Filter);
