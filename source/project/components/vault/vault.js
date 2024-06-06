let fileMgr;

document.addEventListener("DOMContentLoaded", async function () {
	const uploadForm = document.getElementById("uploadForm");
	const fileInput = document.getElementById("file");

	fileMgr = await window.path.getUserData().then((appDataPath) => {
		console.log("App data path:", appDataPath); // Log the path
		let manager = window.file.fileManager(appDataPath);
		return manager;
	});
	
	const files = fileMgr.getFileNames();
	const images =  fileMgr.getImageNames();
	

	for(let i in files) {
		displayFile(files[i], false);
	}

	for(let i in images) {
		displayFile(images[i], true);
	}

	uploadForm.addEventListener("change", function (event) {
		event.preventDefault(); // Prevent default form submission
		const files = fileInput.files;
		if (files.length > 0) {
			for (let file of files) {
				console.log("Uploading file:", file.name); // Log the file name
				try {
					fileMgr.add(file)
					console.log(`File added: ${file.name}`);
					const is_img = file.type.includes('image');
					displayFile(file.name, is_img);
				} catch(err) {
					console.error("Error adding file:", err);
				}
			}
		} else {
			console.error("No files selected");
		}
	});

    // filter
    const filterFiles = document.getElementById("filter");
    const filterButton = document.getElementById("filter-button");

    filterButton.addEventListener("click", function (event) {
        console.log("filter!");
        const filesSection = document.querySelector(".sub-section .files");
        const imagesSection = document.querySelector(".sub-section .images");

        if(filterFiles.value == "images"){
            filesSection.style.display = "none";
            imagesSection.style.display = "block";
        } else if (filterFiles.value == "files") {
            filesSection.style.display = "block";
            imagesSection.style.display = "none";
        } else {
            filesSection.style.display = "block";
            imagesSection.style.display = "block";
        }
    });
});

function displayFile(file_name, is_img) {
	console.log("Displaying file:", file_name, "is_img:", is_img); // Log file display
	const fileSection =
		is_img
			? document.querySelector(".images .grid")
			: document.querySelector(".files .grid");

	if (!fileSection) {
		console.error("File section not found!");
		return;
	}

	const fileElement = document.createElement("button");
	fileElement.classList.add("file-item");
	fileElement.addEventListener("click", function (event) {
        window.open(fileMgr.getFileLocation(file_name, is_img))
    });

	if (is_img) {
		const img = document.createElement("img");
		img.src = fileMgr.getFileLocation(file_name, true);
		img.alt = file_name;
		img.classList.add("file-preview");
		fileElement.appendChild(img);
	} else {
		const icon = document.createElement("div");
		icon.classList.add("file-icon");
		icon.textContent = "📄"; // temp icon
		fileElement.appendChild(icon);
	}

	const title = document.createElement("p");
	title.classList.add("file-title");
	title.textContent = file_name;
	fileElement.appendChild(title);

	fileSection.appendChild(fileElement);
}