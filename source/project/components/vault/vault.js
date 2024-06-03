document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('file');

    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission



        const files = fileInput.files; 
        if (files.length > 0) {
            for(file of files){
                console.log(file);
            }
        } else {
            console.error('No files selected');
        }
    });
});