// File: PopupComponent.js

class JournalPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Using Shadow DOM for encapsulation
        this.shadowRoot.innerHTML = `
        <style>
        .journal-box {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 10px;
            cursor: pointer;
        }

        .journal-popup {
            /* display: none; */
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid black;
            padding: 20px;
            z-index: 2;
        }

        #overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1;
        }

        .highlight {
            color: green;
        }

        .description {
            color: gray;
        }
    </style>
            <div id="overlay"></div>
            <div class="popup-content">
                <h2>Create New Journal</h2>
                <input type="text" id="title" placeholder="Title">
                <input type="date" id="date">
                <textarea id="description" placeholder="Description"></textarea>
                <button class="close">X</button>
                <button class="submit">Submit</button>
            </div>
        `;

        this.shadowRoot.querySelector('.close').addEventListener('click', () => this.close());
        this.shadowRoot.querySelector('.submit').addEventListener('click', () => this.submit());
        this.shadowRoot.getElementById('overlay').addEventListener('click', () => this.close());  // Click on overlay to close
    }

    connectedCallback() {
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'dialog');
        }
    }

    open() {
        this.style.display = 'block';
        this.shadowRoot.getElementById('overlay').style.display = 'block';
    }

    close() {
        this.style.display = 'none';
        this.shadowRoot.getElementById('overlay').style.display = 'none';
    }

    submit() {
        const title = this.shadowRoot.getElementById('title').value;
        const date = this.shadowRoot.getElementById('date').value;
        const description = this.shadowRoot.getElementById('description').value;

        const entry = { title, date, description };
        localStorage.setItem(title, JSON.stringify(entry));
        this.dispatchEvent(new CustomEvent('entry-submitted', { detail: entry }));
        this.close();
    }
}

customElements.define('journal-popup', JournalPopup);
