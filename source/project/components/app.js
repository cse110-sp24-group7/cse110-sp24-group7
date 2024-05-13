//Adding Event Listeners
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
    document.getElementById("journal-container").appendChild(div);
}


window.onload = loadJournals;
