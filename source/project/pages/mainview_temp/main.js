window.addEventListener('DOMContentLoaded', init);

function init() {
    
    var addTask = document.getElementById('add-task');
    var imageList = document.getElementById('UL1');

    addTask.addEventListener('click', function() {
        console.log("Hi")
        // Create a new list item (li) and image element (img)
        const listItem = document.createElement('li');
        const placeholder = document.createElement('img');

        // Set the src attribute of the image
        placeholder.src = 'res/newTask.png'; 
        placeholder.alt = 'Image';
        placeholder.style.width = '100px';

        // Append the placeholder task to the list item and the list item to the task list
        listItem.appendChild(placeholder);
        imageList.appendChild(listItem);
    });

}