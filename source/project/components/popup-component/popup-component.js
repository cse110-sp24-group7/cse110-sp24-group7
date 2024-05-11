// popup-component.js
class PopupComponent extends HTMLElement {
  constructor() {
    super();
    let shadowRoot = this.attachShadow({ mode: 'open' });
    
    // get the css file and append it to the shadow root
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'popup-component.css';
    shadowRoot.append(style);

    // adds the overlay css style to our program(makes the background grey out)
    // click anywhere outside the container to close the container and remove overlay
    const overlay = document.createElement('div');
    overlay.setAttribute('class', 'overlay');
    overlay.addEventListener('click', () => {
      this.remove();
    });

    // waits for the css to load before the html popup occurs
    const div = document.createElement('div');
    style.onload = async () => {
      div.setAttribute('class', 'popup-container');
      const response = await fetch('popup-component.html');
      const html = await response.text();
      div.innerHTML = html;
    };
    
    // append everything to the shadow root
    shadowRoot.append(div, style, overlay);
  }

  connectedCallback() {
    // event listener to form submission
    this.shadowRoot.querySelector('#taskForm').addEventListener('submit', this.onSubmit.bind(this));
  }

  onSubmit(event) {
    event.preventDefault();

    const priority = this.shadowRoot.querySelector('#priority').value;
    const title = this.shadowRoot.querySelector('#title').value;
    const description = this.shadowRoot.querySelector('#description').value;
    const label = this.shadowRoot.querySelector('#label').value;

    console.log('Priority:', priority);
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Label:', label);

    // reset form
    event.target.reset();
    this.style.display = 'none';
  }
}

// define the custom element
customElements.define('popup-component', PopupComponent);

// creates the popup when the add task button is clicked
document.getElementById('open-popup').addEventListener('click', function() {
  const popup = document.createElement('popup-component');
  document.body.appendChild(popup);
});