document.getElementById("add-journal").addEventListener("click", function() {
    document.getElementById("journal-popup").classList.remove("hidden");
    document.getElementById("journal-container").classList.add("blur");
});

function closePopup() {
    document.getElementById("journal-popup").classList.add("hidden");
    document.getElementById("journal-container").classList.remove("blur");
    document.getElementById("journal-form").reset();
}

document.getElementById("journal-form").addEventListener("submit", function(event) {
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

function loadJournals() {
    const entries = JSON.parse(localStorage.getItem("journals") || "[]");
    entries.forEach(entry => addJournalToPage(entry));
}

function addJournalToPage(entry) {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${entry.title}</strong><p>${entry.description.substring(0, 40)}</p>`;
    document.getElementById("journal-container").appendChild(div);
}

window.onload = loadJournals;
