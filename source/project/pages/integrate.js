document.addEventListener('DOMContentLoaded', function() {
  fetch('/source/project/components/journalPopup/testingDeena.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('open-journal-popup').innerHTML = data;
          const addJournal = document.querySelector('.journal-container');
          addJournal.addEventListener('click', function() {
              alert('Component clicked!');
          });
      })
});

document.addEventListener('DOMContentLoaded', function() {
    fetch('/source/project/components/popup-component/task-popup.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('open-task-popup').innerHTML = data;
            const addJournal = document.querySelector('.');
            addJournal.addEventListener('click', function() {
                alert('Component clicked!');
            });
        })
  });