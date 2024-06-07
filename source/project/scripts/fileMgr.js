const path = require("path");
const fs = require('fs');

const FileManager = (data_location) => {
    const route = path.join(data_location, 'assets');
    if (!fs.existsSync(route)) fs.mkdirSync(route);

    const img_route = path.join(route, 'images');
    if (!fs.existsSync(img_route)) fs.mkdirSync(img_route);

    const file_route = path.join(route, 'files');
    if (!fs.existsSync(file_route)) fs.mkdirSync(file_route);

    //check if file exists 
    const exists = (file_name, is_img=false) => {
        const location = getFileLocation(file_name, is_img);
        return fs.existsSync(location);
    }

    //check where a file with its name and type would be located
    const getFileLocation = (file_name, is_img=false) => {
        let fileLocation;
        if(is_img) fileLocation = path.join(img_route, file_name);
        else fileLocation = path.join(file_route, file_name);
        return fileLocation;
    }

    //get list of file names
    const getFileNames = () => {
        return fs.readdirSync(file_route);
    } 

    //get list of image names
    const getImageNames = () => {
        return fs.readdirSync(img_route);
    } 
    
    //get file contents
    const getContent = async (file_name, is_img=false) => {
        const location = getFileLocation(file_name, is_img);
        const blob = new Blob([fs.readFileSync(location)]);
        return await blob.text();
    }
    
    //add file to directory
    const add = (file) => {
        const is_img = file.type.includes('image');
        const fileLocation = getFileLocation(file.name, is_img);
        if (fs.existsSync(fileLocation)) return {errorCode: 403, errorMsg: `A file with the name ${file.name} already exists. No new file was created.`};
        try {
            fs.copyFileSync(file.path, fileLocation);
            console.log('file added at ' + fileLocation);
        }catch(err){
            throw err;
        }
    }
    
    //remove file from directory
    const remove = (file_name, is_img=false) => {
        const fileLocation = getFileLocation(file_name, is_img)
        if (!fs.existsSync(fileLocation)) return {errorCode: 404, errorMsg: `A file with the name ${file_name} was not found. No files were deleted.`};
        return new Promise((resolve, reject) => {
            fs.unlink(fileLocation, (err) => {
                if (err) reject(err);
                resolve(`Deleted ${file_name}`);
            }); 
        })
    }
    return {route, img_route, file_route, exists, getFileLocation, getFileNames, getImageNames, getContent, add, remove};
}

module.exports = {
    FileManager
}