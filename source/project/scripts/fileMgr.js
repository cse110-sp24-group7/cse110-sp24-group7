const path = require("path");
const fs = require('fs');
/**
 * @module dbMgr
 * @description This module is responsible for managing files, with the ability to add & remove at the location provided.
 */

/**
 * @description Encapsulates functions for managing files
 * @param {string} data_location - the path to the directory that the file operations will be carried out.
 * @returns {object}
 */
const FileManager = (data_location) => {
    const route = path.join(data_location, 'assets');
    if (!fs.existsSync(route)) fs.mkdirSync(route);

    const img_route = path.join(route, 'images');
    if (!fs.existsSync(img_route)) fs.mkdirSync(img_route);

    const file_route = path.join(route, 'files');
    if (!fs.existsSync(file_route)) fs.mkdirSync(file_route);

    /**
     * @description Checks if file exists in the directory
     * @param {string} file_name - the name of the file
     * @param {boolean} is_img - whether the file is an image
     * @returns {boolean}
     
    */
    const exists = (file_name, is_img=false) => {
        const location = getFileLocation(file_name, is_img);
        return fs.existsSync(location);
    }

     /**
     * @description Check where the file would be located in the directory
     * @param {string} file_name - the name of the file 
     * @param {boolean} is_img - whether the file is an image
     * @returns {string}
    */
    const getFileLocation = (file_name, is_img=false) => {
        let fileLocation;
        if(is_img) fileLocation = path.join(img_route, file_name);
        else fileLocation = path.join(file_route, file_name);
        return fileLocation;
    }

    /**
     * @description Get the complete list of non-image file names
     * @returns {string[]}

    */
    const getFileNames = () => {
        return fs.readdirSync(file_route);
    } 

    /**
     * @description Get the complete list of image names
     * @returns {string[]}

    */
    const getImageNames = () => {
        return fs.readdirSync(img_route);
    } 
    
    /**
     * @description Get the contents of the file
     * @param {string} file_name - the name of the file 
     * @param {boolean} is_img - whether the file is an image
     * @returns {string}

    */
    const getContent = async (file_name, is_img=false) => {
        const location = getFileLocation(file_name, is_img);
        const blob = new Blob([fs.readFileSync(location)]);
        return await blob.text();
    }
    
    /**
     * @description Add a file to the directory
     * @param {file} file - a JS file object to be copied
     * @returns {void}

    */
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
    
    /**
     * @description Removes the file from the directory
     * @param {string} file_name - the name of the file 
     * @param {boolean} is_img - whether the file is an image
     * @returns {Promise}

    */
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