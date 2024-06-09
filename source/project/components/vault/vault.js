// Declare a variable to manage file operations
let fileMgr;

document.addEventListener("DOMContentLoaded", async () => {
	// Retrieve DOM elements
	const uploadForm = document.getElementById("uploadForm");
	const fileInput = document.getElementById("file");
	const searchInput = document.getElementById("search-input");
	const menuButton = document.getElementById("menu");
	const menuOptions = document.getElementById("menu-options");
	const tasksLink = document.getElementById("tasks");
	const calendarLink = document.getElementById("calendar");

	// Initialize the file manager with user data path
	fileMgr = await window.path.getUserData().then((appDataPath) => {
		// console.log("App data path:", appDataPath); // Log the path
		const manager = window.file.fileManager(appDataPath);
		return manager;
	});

	// Get file and image names from the file manager
	const files = fileMgr.getFileNames();
	const images = fileMgr.getImageNames();

	// Display all files and images
	for (const i in files) {
		displayFile(files[i], false);
	}

	for (const i in images) {
		displayFile(images[i], true);
	}

	// Add event listener for file upload form changes
	uploadForm.addEventListener("change", (event) => {
		event.preventDefault(); // Prevent default form submission
		const files = fileInput.files;
		if (files.length > 0) {
			for (const file of files) {
				// console.log("Uploading file:", file.name); // Log the file name
				try {
					fileMgr.add(file); // Add file to file manager
					console.log(`File added: ${file.name}`);
					const is_img = file.type.includes("image");
					displayFile(file.name, is_img); // Display the uploaded file
				} catch (err) {
					console.error("Error adding file:", err);
				}
			}
		} else {
			console.error("No files selected");
		}
	});

	// Get filter input element
	const filterFiles = document.getElementById("filter");

	// Add event listener for filter changes
	filterFiles.addEventListener("change", () => {
		// console.log("filter!");
		const filesSection = document.getElementById("files");
		const imagesSection = document.getElementById("images");

		// Show/hide sections based on filter value
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

	// Add event listener for search input changes
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.toLowerCase();
		// console.log("Searching for:", query); // Log search query
		searchFiles(query); // Perform the search
	});

	// Add event listener for menu button click
	menuButton.addEventListener("click", function () {
		if (menuOptions.classList.contains("visible")) {
			menuOptions.classList.remove("visible");
			setTimeout(() => {
				menuOptions.style.display = "none";
			}, 300);
		} else {
			menuOptions.style.display = "block";
			setTimeout(() => {
				menuOptions.classList.add("visible");
			}, 10);
		}
	});

	document.addEventListener("click", function (event) {
		if (
			!menuButton.contains(event.target) &&
			!menuOptions.contains(event.target)
		) {
			menuOptions.classList.remove("visible");
			setTimeout(() => {
				menuOptions.style.display = "none";
			}, 300);
		}
	});

	// Add event listener for tasks link click
	tasksLink.addEventListener("click", () => {
		window.location.href = "../all-tasks/all-tasks.html";
	});

	// Add event listener for calendar link click
	calendarLink.addEventListener("click", () => {
		window.location.href = "../mainview/mainview.html";
	});
});

// Function to search files based on query
function searchFiles(query) {
	const files = fileMgr.getFileNames();
	const images = fileMgr.getImageNames();

	// Retrieve the file and image sections
	const fileSection = document
		.getElementById("files")
		.getElementsByClassName("grid")[0];
	const imageSection = document
		.getElementById("images")
		.getElementsByClassName("grid")[0];

	// Clear the current content of sections
	fileSection.innerHTML = "";
	imageSection.innerHTML = "";

	// Display files matching the query
	for (const i in files) {
		if (files[i].toLowerCase().includes(query)) {
			displayFile(files[i], false);
		}
	}

	// Display images matching the query
	for (const i in images) {
		if (images[i].toLowerCase().includes(query)) {
			displayFile(images[i], true);
		}
	}
}

// Function to display a file or image
function displayFile(file_name, is_img) {
	// console.log("Displaying file:", file_name, "is_img:", is_img); // Log file display

	// Retrieve the appropriate section based on file type
	const fileSection = is_img
		? document.getElementById("images").getElementsByClassName("grid")[0]
		: document.getElementById("files").getElementsByClassName("grid")[0];

	// Check if the section exists
	if (!fileSection) {
		console.error("File section not found!");
		return;
	}

	// Create a button element for the file
	const fileElement = document.createElement("button");
	fileElement.classList.add("file-item");
	fileElement.addEventListener("click", () => {
		window.open(fileMgr.getFileLocation(file_name, is_img));
	});

	if (is_img) {
		// Display image preview
		const img = document.createElement("img");
		img.src = fileMgr.getFileLocation(file_name, true);
		img.alt = file_name;
		img.classList.add("file-preview");
		fileElement.appendChild(img);
	} else {
		const img = document.createElement("img");
		img.classList.add("file-preview");

		// Determine the file type and assign appropriate icon
		const fileExtension = file_name.split(".").pop().toLowerCase();
		switch (fileExtension) {
			case "pdf":
				img.src = "../../assets/res/file-images/pdf.png";
				img.alt = file_name;
				break;
			case "doc":
			case "docx":
				img.src = "../../assets/res/file-images/doc.png";
				img.alt = file_name;
				break;
			case "html":
				img.src = "../../assets/res/file-images/html.png";
				img.alt = file_name;
				break;
			case "js":
				img.src = "../../assets/res/file-images/js.png";
				img.alt = file_name;
				break;
			case "txt":
				img.src = "../../assets/res/file-images/txt.png";
				img.alt = file_name;
				break;
			case "css":
				img.src = "../../assets/res/file-images/css.png";
				img.alt = file_name;
				break;
			default:
				img.src = "../../assets/res/file-images/generic.png";
				img.alt = file_name;
		}
		fileElement.appendChild(img);
	}

	// Add file title
	const title = document.createElement("p");
	title.classList.add("file-title");
	title.textContent = file_name;
	fileElement.appendChild(title);

	// Add delete button with functionality
	const deleteButton = document.createElement("button");
	deleteButton.classList.add("delete");
	deleteButton.innerHTML = `<img id="deleteBtn" src="../../assets/res/delete-icon-no-bg.jpg" alt="Delete">`;
	deleteButton.setAttribute("data-tooltip", "double click to delete");
	deleteButton.addEventListener("click", (event) => {
		event.stopPropagation();
		fileMgr.remove(file_name, is_img);
		fileElement.remove();
	});
	fileElement.appendChild(deleteButton);

	// Append the file element to the section
	fileSection.appendChild(fileElement);
}
