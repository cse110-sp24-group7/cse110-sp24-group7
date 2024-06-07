const fileMgr = require('../scripts/fileMgr');
const path = require('path');
const fs = require('fs');

const vault_location = path.join(__dirname);
const source_location = path.join(__dirname, 'fileSource');
const manager = fileMgr.FileManager(vault_location);

describe("File functions", () => {
    beforeAll(() => {
        clearFiles(manager.img_route);
        clearFiles(manager.file_route);
    });
    
    //Clears all user files
    async function clearFiles(directory){
        fs.readdir(directory, (err, files) => { 
            if (err) 
              console.log(err); 
            else { 
                for (const file of files) {
                    fs.unlink(path.join(directory, file.name), (err) => {
                        if (err) throw err;
                    });
                }
            } });
    }

    const File = (name, type) => {
        const location = path.join(source_location, name);
        return {name, path: location, type};
    }

    const file_js = File('code.js', 'other');
    const file_md = File('notes.md', 'other');
    const file_pdf = File('notes.pdf', 'other');
    const file_txt = File('notes.txt', 'other');

    const file_jpg = File('pikachu_jpg.jpg', 'image');
    const file_png = File('pikachu_png.png', 'image');
    const file_webp = File('pikachu_webp.webp', 'image');

    const files = [file_js, file_md, file_pdf, file_txt, file_jpg, file_png, file_webp];

    test("Add all files", () => {
		for(let i = 0; i < files.length; i++) {
            manager.add(files[i]);
        }
        expect(manager.getFileNames().length + manager.getImageNames().length).toBe(files.length);
	});

    test("Check that added file contents are the same as the file copied", () => {
        const doesPass = true;
		for(let i = 0; i < files.length; i++) {
            const is_img = files[i].type == 'image';
            const copied_file_location = manager.getFileLocation(files[i].name, is_img);
            const original_file_location = path.join(source_location, files[i].name);

            const copied_file_buffer = fs.readFileSync(copied_file_location);
            const original_file_buffer = fs.readFileSync(original_file_location);

            if(!copied_file_buffer.equals(original_file_buffer)) doesPass = false; 
        }
        expect(doesPass).toBe(true);
	});

    test("Retrieve names of all non-image files", () => {
		const non_image_files = files.filter(file => file.type != 'image').map(file => file.name);
        const retrieved_non_image_files = manager.getFileNames();

        expect(non_image_files.sort().join(',')).toEqual(retrieved_non_image_files.sort().join(','));
	});

    test("Retrieve names of all image files", () => {
		const image_files = files.filter(file => file.type == 'image').map(file => file.name);
        const retrieved_image_files = manager.getImageNames();

        expect(image_files.sort().join(',')).toEqual(retrieved_image_files.sort().join(','));
	});

    test("Remove all files", async () => {
		for(let i = 0; i < files.length; i++) {
            const is_img = files[i].type == 'image';
            await manager.remove(files[i].name, is_img);
        }
        await expect(manager.getFileNames().length + manager.getImageNames().length).toBe(0);
	});

    afterAll(() => {
        clearFiles(manager.img_route);
        clearFiles(manager.file_route);
    });
});