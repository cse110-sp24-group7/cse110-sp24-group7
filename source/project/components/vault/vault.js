let fileMgr;

document.addEventListener("DOMContentLoaded", async function () {
	const uploadForm = document.getElementById("uploadForm");
	const fileInput = document.getElementById("file");
	const searchInput = document.getElementById("search-input");
	const menuButton = document.getElementById("menu");
	const menuOptions = document.getElementById("menu-options");

	fileMgr = await window.path.getUserData().then((appDataPath) => {
		console.log("App data path:", appDataPath); // Log the path
		let manager = window.file.fileManager(appDataPath);
		return manager;
	});

	const files = fileMgr.getFileNames();
	const images = fileMgr.getImageNames();

	for (let i in files) {
		displayFile(files[i], false);
	}

	for (let i in images) {
		displayFile(images[i], true);
	}

	uploadForm.addEventListener("change", function (event) {
		event.preventDefault(); // Prevent default form submission
		const files = fileInput.files;
		if (files.length > 0) {
			for (let file of files) {
				console.log("Uploading file:", file.name); // Log the file name
				try {
					fileMgr.add(file);
					console.log(`File added: ${file.name}`);
					const is_img = file.type.includes("image");
					displayFile(file.name, is_img);
				} catch (err) {
					console.error("Error adding file:", err);
				}
			}
		} else {
			console.error("No files selected");
		}
	});

	// filter
	const filterFiles = document.getElementById("filter");

	filterFiles.addEventListener("change", (event) => {
		console.log("filter!");
		const filesSection = document.getElementById("files");
		const imagesSection = document.getElementById("images");

		if (filterFiles.value == "images") {
			filesSection.classList.add("hidden");
			imagesSection.classList.remove("hidden");
		} else if (filterFiles.value == "files") {
			filesSection.classList.remove("hidden");
			imagesSection.classList.add("hidden");
		} else {
			filesSection.classList.remove("hidden");
			imagesSection.classList.remove("hidden");
		}
	});

	// search
	searchInput.addEventListener("input", function () {
		const query = searchInput.value.toLowerCase();
		console.log("Searching for:", query); // Log search query
		searchFiles(query);
	});

	// // menu
	// menuButton.addEventListener("click", function () {
	// 	console.log("Menu clicked"); // Log menu click
	// 	menuOptions.style.display =
	// 		menuOptions.style.display === "block" ? "none" : "block";
	// });

	// document.addEventListener("click", function (event) {
	// 	if (
	// 		!menuButton.contains(event.target) &&
	// 		!menuOptions.contains(event.target)
	// 	) {
	// 		menuOptions.style.display = "none";
	// 	}
	// });
});

function searchFiles(query) {
	const files = fileMgr.getFileNames();
	const images = fileMgr.getImageNames();

	const fileSection = document.getElementById("files").getElementsByClassName("grid")[0];
	const imageSection = document.getElementById("images").getElementsByClassName("grid")[0];

	fileSection.innerHTML = "";
	imageSection.innerHTML = "";

	for (let i in files) {
		if (files[i].toLowerCase().includes(query)) {
			displayFile(files[i], false);
		}
	}

	for (let i in images) {
		if (images[i].toLowerCase().includes(query)) {
			displayFile(images[i], true);
		}
	}
}

function displayFile(file_name, is_img) {
	console.log("Displaying file:", file_name, "is_img:", is_img); // Log file display
	const fileSection = is_img
		? document.getElementById("images").getElementsByClassName("grid")[0]
		: document.getElementById("files").getElementsByClassName("grid")[0];

	if (!fileSection) {
		console.error("File section not found!");
		return;
	}

	const fileElement = document.createElement("button");
	fileElement.classList.add("file-item");
	fileElement.addEventListener("click", function (event) {
		window.open(fileMgr.getFileLocation(file_name, is_img));
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

	// delete functionality and button
	const deleteButton = document.createElement("button");
	deleteButton.classList.add("delete");
	deleteButton.innerHTML = `<img id="deleteBtn" src="./delete-icon.jpg" alt="Delete">`;
	deleteButton.setAttribute("data-tooltip", "double click to delete");
	deleteButton.addEventListener("click", (event) => {
		event.stopPropagation();
		fileMgr.remove(file_name, is_img);
		fileElement.remove();
	});
	fileElement.appendChild(deleteButton);

	fileSection.appendChild(fileElement);
}
