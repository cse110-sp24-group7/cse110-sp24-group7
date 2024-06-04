const path = require("path");
const fs = require('fs');
const unlink = require('node:fs');

const FileManager = (data_location) => {
    const route = path.join(data_location, 'assets');
    console.log(route);

    if (!fs.existsSync(route)) fs.mkdirSync(route);

    //get list of file objects
    const getFiles = () => {
        return fs.readdirSync(route);
    } 
    
    //get file contents
    const getFile = async (file_name) => {
        const blob = new Blob([fs.readFileSync(path.join(route, file_name))]);
        const text = await blob.text();
        return text;
    }
    
    //add file to directory
    const addFile = (file) => {
        console.log(file);
        const fileLocation = path.join(route, file.name);
        if (fs.existsSync(fileLocation)) return {errorCode: 403, errorMsg: `A file with the name ${file.name} already exists. No new file was created.`};
        const fileReader = new FileReader();
        fileReader.onload = function (e) { fs.writeFileSync(fileLocation, e.target.result)};
        fileReader.readAsText(file);
        return getFile(file.name);
    }
    
    //remove file from directory
    const deleteFile = (file_name) => {
        const fileLocation = path.join(route, file_name);
        if (!fs.existsSync(fileLocation)) return {errorCode: 404, errorMsg: `A file with the name ${file_name} was not found. No files were deleted.`};
        unlink(fileLocation, (err) => {
            if (err) throw err;
            console.log(`${file_name} was deleted`);
        }); 
    }
    return {getFiles, getFile, addFile, deleteFile};
}

module.exports = {
    FileManager
}