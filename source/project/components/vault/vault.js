document.addEventListener("DOMContentLoaded", async function () {
	const uploadForm = document.getElementById("uploadForm");
	const fileInput = document.getElementById("file");

	// temp file manager that works on liveserver
	const fileMgr = {
		addFile: (file) => {
			return new Promise((resolve, reject) => {
				const fileType = file.type.startsWith("image/")
					? "image"
					: "file";
				resolve(fileType);
			});
		},
		getFiles: () => {
			return [];
		}
    };
    
    // having problems with this
    // const fileMgr = await window.path.getUserData().then((appDataPath) => {
    //     console.log("App data path:", appDataPath); // Log the path
    //     let manager = window.file.fileManager(appDataPath);
    //     return manager;
    // });

	uploadForm.addEventListener("change", function (event) {
		event.preventDefault(); // Prevent default form submission
		const files = fileInput.files;
		if (files.length > 0) {
			for (let file of files) {
				console.log("Uploading file:", file.name); // Log the file name
				fileMgr
					.addFile(file)
					.then((fileType) => {
						console.log(`File added: ${file.name}`);
						displayFile(file, fileType);
					})
					.catch((err) => {
						console.error("Error adding file:", err);
					});
			}
		} else {
			console.error("No files selected");
		}
	});
});

function displayFile(file, fileType) {
	console.log("Displaying file:", file.name, "Type:", fileType); // Log file display
	const fileSection =
		fileType === "image"
			? document.querySelector(".images .grid")
			: document.querySelector(".files .grid");

	if (!fileSection) {
		console.error("File section not found!");
		return;
	}

	const fileElement = document.createElement("div");
	fileElement.classList.add("file-item");

	if (fileType === "image") {
		const img = document.createElement("img");
		img.src = URL.createObjectURL(file);
		img.alt = file.name;
		img.classList.add("file-preview");
		fileElement.appendChild(img);
	} else {
		const icon = document.createElement("div");
		icon.classList.add("file-icon");
		icon.textContent = "📄"; // temp icon
		fileElement.appendChild(icon);
	}

	const title = document.createElement("div");
	title.classList.add("file-title");
	title.textContent = file.name;
	fileElement.appendChild(title);

	fileSection.appendChild(fileElement);
}