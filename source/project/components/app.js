document.getElementById("add-journal").addEventListener("click", function () {
    document.getElementById("journal-popup").classList.remove("hidden");
    document.getElementById("journal-container").classList.add("blur");
});

//Close Popup and Reset Form: 
// It adds the "hidden" class back to the popup, making it invisible, 
// removes the "blur" effect from the journal container, and resets the form fields within the "journal-form".
function closePopup() {
    document.getElementById("journal-popup").classList.add("hidden");
    document.getElementById("journal-container").classList.remove("blur");
    document.getElementById("journal-form").reset();
}

//Handling Form Submission: this function extracts data and save to local storage
document.getElementById("journal-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;

    const journalEntry = { title, description, date };
    const entries = JSON.parse(localStorage.getItem("journals") || "[]");
    entries.push(journalEntry);
    localStorage.setItem("journals", JSON.stringify(entries));

    addJournalToPage(journalEntry);
    closePopup();
    // Clear the title field after saving the entry
    document.getElementById("title").value = '';
});

//Loading Journals on Page Load
function loadJournals() {
    const entries = JSON.parse(localStorage.getItem("journals") || "[]");
    entries.forEach(entry => addJournalToPage(entry));
}

//display the journal entries
function addJournalToPage(entry) {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${entry.title}</strong><p>${entry.description.substring(0, 40)}</p>`;
    div.addEventListener("dblclick", function() {
        deleteJournal(entry);
    });
    document.getElementById("journal-container").appendChild(div);
}

//Deletes a single specific note with double click
function deleteJournal(entry) {
    let entries = JSON.parse(localStorage.getItem("journals") || "[]");
    entries = entries.filter(e => e.title !== entry.title || e.description !== entry.description || e.date !== entry.date);
    localStorage.setItem("journals", JSON.stringify(entries));
    loadJournals();
}

//deletes all notes with ctrl + shift + D
function deleteAllJournal(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        localStorage.removeItem("journals");
        loadJournals();
    }
}

// Add event listener for keydown event to handle deleteAllJournal
document.addEventListener("keydown", deleteAllJournal);

window.onload = loadJournals;