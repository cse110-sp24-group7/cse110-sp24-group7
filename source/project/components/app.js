
//***UPDATED app.js */
class PopupComponent extends HTMLElement {
  /**
   * @constructor
   * @description Creates an instance of PopupComponent, sets up the shadow DOM, and initializes
   * the component with CSS and HTML content loaded asynchronously.
   */
  constructor() {
    super();
    let shadowRoot = this.attachShadow({ mode: "open" });

    // get the css file and append it to the shadow root
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "styles.css";
    shadowRoot.append(style);

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
      const response = await fetch("popup.html");
      const html = await response.text();
      div.innerHTML = html;

      // close the popup when user presses x
      const closeButton = div.querySelector("#closeBtn");
      closeButton.addEventListener("click", () => {
        this.style.display = "none";
      });
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
   * @param {Array} tasks - The array of Journals to save
   */
   saveJournalsToStorage(journalData) {
    localStorage.setItem("journalData", JSON.stringify(journalData));
  }

  /**
   * @method onSubmit
   * @description Handles form submission, prevents default submission, saves and logs data, resets form, and hides popup.
   * @param {Event} event - The form submission event
   */
  onSubmit(event) {
    event.preventDefault();

    // get the users input from form
    let journalData = {
      entry_id: Math.random().toString(36).substr(2, 9),
      entry_title: this.shadowRoot.querySelector("#title").value,
      entry_content: this.shadowRoot.querySelector("#description").value,
      creation_date: this.shadowRoot.querySelector("#currDate").value,
      enrty_label: this.shadowRoot.querySelector("#label").value,
    };

    // get existing tasks from local storage or initialize an empty array
    let journalDatas = this.getJournalsFromStorage();

    // add the new task to the array
    journalDatas.push(journalData);

    // convert the updated array to JSON and save it back to local storage
    this.saveJournalsToStorage(journalDatas);

    // log the data to the console
    console.log("Journal Form Data Saved:", journalData);

    // reset form
    event.target.reset();
    this.style.display = "none";
  }

  onClose(event) {
    event.preventDefault();
    event.target.reset();
    document.getElementById("title").removeAttribute("required");
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



