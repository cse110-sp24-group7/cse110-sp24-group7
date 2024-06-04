document.addEventListener('DOMContentLoaded', async function () {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('file');

    const fileMgr = await window.path.getPath()
    .then((appDataPath) => {
      let manager = window.file.fileManager(appDataPath);
      return manager;
    })

    console.log(fileMgr.getFiles());

    uploadForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission
        const files = fileInput.files; 
        if (files.length > 0) {
            for(let file of files){
                fileMgr.addFile(file);
            }
        } else {
            console.error('No files selected');
        }
    });
});
  