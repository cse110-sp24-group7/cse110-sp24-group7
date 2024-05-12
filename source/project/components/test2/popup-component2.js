
class PopupComponent extends HTMLElement {
  constructor() {
    super();
    // Attaching shadow DOM if encapsulation is required
    // this.attachShadow({ mode: 'open' });

    // Ensure elements are selected from the correct DOM context
    this.app = document.getElementById('journalApp');
    this.popup = document.querySelector('.journal-popup');
    this.overlay = document.getElementById('overlay');

    this.attachEvents();
  }

  attachEvents() {
    // Load all entries on page load
    document.addEventListener('DOMContentLoaded', () => {
      Object.keys(localStorage).forEach(key => {
        const entry = JSON.parse(localStorage.getItem(key));
        this.renderJournalEntry(entry);
      });
    });
  }

  openPopup() {
    this.popup.style.display = 'block';
    this.overlay.style.display = 'block';
  }

  closePopup() {
    this.popup.style.display = 'none';
    this.overlay.style.display = 'none';
  }

  saveEntry() {
    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const entry = { title, date, description };
    localStorage.setItem(title, JSON.stringify(entry));
    this.closePopup();
    this.renderJournalRequest(entry);
  }

  renderJournalEntry(entry) {
    const div = document.createElement('div');
    div.classList.add('journal-box');
    div.innerHTML = `
      <h3>${entry.title}</h3>
      <p class="description">${entry.description.substring(0, 40)}</p>
    `;
    div.onclick = () => this.loadEntry(entry.title);
    this.app.appendChild(div);
  }

  loadEntry(title) {
    const entry = JSON.parse(localStorage.getItem(title));
    document.getElementById('title').value = entry.title;
    document.getElementById('date').value = entry.date;
    document.getElementById('description').value = entry.description;
    this.openPopup();
  }
}

customElements.define('popup-component', PopupComponent);



//   class PersonName extends HTMLElement {
//     constructor() {
//         super();

//         let shadowEl = this.attachShadow({mode:'closed'});
//         let elementRoot = document.createElement('div');

//         let fNameLabelEl = document.createElement('label');
//         fNameLabelEl.innerText = 'First Name: ';

//         let lNameLabelEl = document.createElement('label');
//         lNameLabelEl.innerText = 'Last Name: ';

//         let fNameEl = document.createElement('input');
//         let lNameEl = document.createElement('input');

//         elementRoot.append(fNameLabelEl);
//         elementRoot.append(fNameEl);
//         elementRoot.append(document.createElement('br'));

//         elementRoot.append(lNameLabelEl);
//         elementRoot.append(lNameEl);
        
//         let spanOutput = document.createElement('span');
//         elementRoot.append(document.createElement('br'));
//         elementRoot.append(spanOutput);

//         this.nameELChange = () => {
//             spanOutput.innerHTML = `Hello ${fNameEl.value} ${lName.value}`;
//         }

//         fNameEl.addEventListener('change', this.nameElChange);
//         lNameEl.addEventListener('change', this.nameElChange);

//         shadowEl.append(elementRoot);

//   }
// }
// customElements.define('person-name', PersonName);

  



// class JournalPopup extends HTMLElement {
//     constructor() {
//         super();
//         this.attachShadow({ mode: 'open' });
//         this.shadowRoot.innerHTML = `
//             <style>
//                 :host {
//                     display: block;
//                 }
//                 #journalEntry {
//                     width: 100%;
//                     box-sizing: border-box;
//                 }
//             </style>
//             <div id="journalPopup" style="display: none;">
//                 <textarea id="journalEntry" rows="10" cols="30"></textarea>
//                 <button id="saveButton">Save Entry</button>
//                 <button id="closeButton">Close</button>
//             </div>
//         `;

//         this.journalPopup = this.shadowRoot.querySelector('#journalPopup');
//         this.saveButton = this.shadowRoot.querySelector('#saveButton');
//         this.closeButton = this.shadowRoot.querySelector('#closeButton');
//         this.journalEntry = this.shadowRoot.querySelector('#journalEntry');

//         this.saveButton.addEventListener('click', () => this.saveEntry());
//         this.closeButton.addEventListener('click', () => this.closePopup());
//     }

//     connectedCallback() {
//         const entry = localStorage.getItem('journalEntry');
//         if (entry) {
//             this.journalEntry.value = entry;
//         }
//     }

//     saveEntry() {
//         localStorage.setItem('journalEntry', this.journalEntry.value);
//         this.closePopup();
//     }

//     closePopup() {
//         this.journalPopup.style.display = 'none';
//     }

//     openPopup() {
//         this.journalPopup.style.display = 'block';
//     }
// }

// window.customElements.define('journal-popup', JournalPopup);

// document.getElementById('openPopup').addEventListener('click', () => {
//     document.createElement('journal-popup').openPopup();
// });