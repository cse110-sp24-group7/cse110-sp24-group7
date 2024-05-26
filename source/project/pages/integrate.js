document.addEventListener('DOMContentLoaded', function() {
  fetch('/source/project/components/journalPopup/testingDeena.html')
      .then(response => response.text())
      .then(data => {
          document.getElementById('open-popup').innerHTML = data;
          // Optionally, add event listeners or other JS for the component
          const component = document.querySelector('.component');
          component.addEventListener('click', function() {
              alert('Component clicked!');
          });
      })
});