/**
 * @module All_Tasks
 * @description This module is responsible for displaying all tasks in a seperate view, with dynamic filtering and search functionality.
 */

let filters = {
	startTime: "",
	endTime: "",
	labels: [],
	priorities: [],
	exclusive: false
};

let allTasks = [];

/**
 * @description Generates an HTML element for task preview given a task object
 * @param {Task} task - the task to append
 * @param {Object} taskContainer - the HTML element to append tasks to.
 * @returns {Object} taskContainer - the HTML element with appended task
 */
function appendTaskHTML(task, taskContainer) {
	const msDay = 60 * 60 * 24 * 1000;
	const creationDate = new Date(task.creation_date);
	const dueDate = new Date(task.due_date);
	const currDate = new Date();

	// Handle label coloring first
	const labelBox = document.createElement("div");
	labelBox.classList.add("label-box");
	//TODO: implement label coloring here
	taskContainer.appendChild(labelBox);

	// Task preview
	const taskPv = document.createElement("div");
	taskPv.classList.add("task-pv");

	const taskName = document.createElement("h2");
	taskName.textContent = task.task_name;
	taskPv.appendChild(taskName);

	const taskContent = document.createElement("p");
	taskContent.textContent = task.task_content;
	taskPv.appendChild(taskContent);

	// const taskDueDate = document.createElement("p");
	// taskDueDate.textContent = `Due: ${dueDate.toDateString()}`;
	// taskPv.appendChild(taskDueDate);

	const taskPriority = document.createElement("p");
	taskPriority.textContent = `Priority: ${task.priority}`;
	taskPv.appendChild(taskPriority);

	const taskExpectedTime = document.createElement("p");
	taskExpectedTime.textContent = `Expected Time: ${task.expected_time} hours`;
	taskPv.appendChild(taskExpectedTime);

	taskContainer.appendChild(taskPv);

	// Days left functionality
	const totalDays = Math.floor((dueDate - creationDate) / msDay);
	const daysLeft = Math.floor((dueDate - currDate) / msDay);
	const daysPast = totalDays - daysLeft;

	// Edge case: total days negative (task is created after it was due...?)
	// In this case should be no greens, all gray.
	const graySquares =
		totalDays <= 0
			? 10
			: Math.min(Math.round((daysPast / totalDays) * 10), 10);
	const greenSquares = 10 - graySquares;

	const timeLeftContainer = document.createElement("div");
	timeLeftContainer.classList.add("time-left-container");
	const daysLeftSquares = document.createElement("div");
	daysLeftSquares.classList.add("days-left");

	for (let i = 0; i < graySquares; i++) {
		const square = document.createElement("div");
		square.classList.add("day-left-square");
		square.style.backgroundColor = "#bdbdbd";
		daysLeftSquares.appendChild(square);
	}

	for (let i = 0; i < greenSquares; i++) {
		const square = document.createElement("div");
		square.classList.add("day-left-square");
		square.style.backgroundColor = "#4caf50";
		daysLeftSquares.appendChild(square);
	}

	const daysLeftText = document.createElement("div");
	daysLeftText.classList.add("days-left-text");
	const daysLeftTextContent = document.createElement("h3");
	if (dueDate > currDate) {
		daysLeftTextContent.textContent = `${daysLeft} days left`;
	} else {
		daysLeftTextContent.textContent = `${daysLeft == 0 ? 0 : -daysLeft} days overdue`;
	}

	daysLeftText.appendChild(daysLeftTextContent);
	timeLeftContainer.appendChild(daysLeftSquares);
	timeLeftContainer.appendChild(daysLeftText);

	taskContainer.append(timeLeftContainer);

	return taskContainer;
}

/**
 * @description Generates the dates to show for each row of visible tasks
 * @param {Task[]} tasks - an array of task objects.
 */
function displayTasks(tasks) {
	const calendar = document.querySelector(".calendar");
	calendar.innerHTML = ""; // Clear the calendar content

	let currDate = null;
	let currDayContainer = null;
	let currTaskWrapper = null;
	tasks.forEach((task) => {
		let needUpdate = false;
		let flushed = false;
		const dueDate = new Date(task.due_date);
		if (currDate == null) {
			needUpdate = true;
			currDate = dueDate;
		}
		const dueYear = dueDate.toLocaleString("en-US", { year: "numeric" });
		const dueMonth = dueDate.toLocaleString("en-US", { month: "long" });
		const dueDay = dueDate.toLocaleString("en-US", { day: "numeric" });

		const currYear = currDate.toLocaleString("en-US", { year: "numeric" });
		const currMonth = currDate.toLocaleString("en-US", { month: "long" });
		const currDay = currDate.toLocaleString("en-US", { day: "numeric" });

		if (needUpdate || dueYear != currYear) {
			if (!flushed && currDayContainer != null) {
				currDayContainer.appendChild(currTaskWrapper);
				calendar.appendChild(currDayContainer);
				flushed = true;
				currDate = dueDate;
			}
			const yearDivider = document.createElement("div");
			yearDivider.classList.add("month-divider");
			yearDivider.textContent = dueYear;
			calendar.appendChild(yearDivider);
		}

		if (needUpdate || dueMonth != currMonth) {
			if (!flushed && currDayContainer != null) {
				currDayContainer.appendChild(currTaskWrapper);
				calendar.appendChild(currDayContainer);
				flushed = true;
				currDate = dueDate;
			}
			const monthDivider = document.createElement("div");
			monthDivider.classList.add("month-divider");
			monthDivider.textContent = dueMonth;
			calendar.appendChild(monthDivider);
		}

		if (needUpdate || dueDay != currDay) {
			if (!flushed && currDayContainer != null) {
				currDayContainer.appendChild(currTaskWrapper);
				calendar.appendChild(currDayContainer);
				flushed = true;
				currDate = dueDate;
			}

			const dayOfWeek = dueDate
				.toLocaleDateString("en-US", { weekday: "short" })
				.toLowerCase()
				.slice(0, 3);
			currDayContainer = document.createElement("div");
			currDayContainer.classList.add("day");
			currDayContainer.id = dayOfWeek;

			currTaskWrapper = document.createElement("div");
			currTaskWrapper.classList.add("tasks-wrapper");

			const dayTitle = document.createElement("h4");
			const dayOfWeekNode = document.createTextNode(
				dayOfWeek.toUpperCase()
			);
			const lineBreak = document.createElement("br");
			const dueDateNode = document.createTextNode(`${dueDay}`);

			dayTitle.appendChild(dayOfWeekNode);
			dayTitle.appendChild(lineBreak);
			dayTitle.appendChild(dueDateNode);

			currDayContainer.appendChild(dayTitle);
		}

		let taskContainer = document.createElement("div");
		taskContainer.classList.add("task-container");
		taskContainer = appendTaskHTML(task, taskContainer);
		currTaskWrapper.appendChild(taskContainer);
	});

	if (currDayContainer != null) {
		currDayContainer.appendChild(currTaskWrapper);
		calendar.appendChild(currDayContainer);
	}
}

/**
 * @description Updates the tasklist based on the current filters selected
 * @returns {void}
 *
 */
function updateTasklist() {
	window.api.getFilteredTasks(filters, (tasks) => {
		allTasks = tasks;
		displayTasks(tasks);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	const menuButton = document.getElementById("menu");
	const menuOptions = document.getElementById("menu-options");
	const vaultLink = document.getElementById("vault");
	const calendarLink = document.getElementById("calendar");

	await window.path.getUserData().then((userData) => {
		console.log("Renderer access userdata: " + userData);
		window.api.connect(userData, () => {
			window.api.init(() => {
				console.log("Renderer init table.");
				updateTasklist();
			});
		});
	});

	document.addEventListener("filterUpdate", (e) => {
		filters = e.detail;
		updateTasklist();
	});

	document.querySelectorAll(".add-task").forEach((button) => {
		button.addEventListener("click", () => {
			const popup = document.createElement("task-popup");
			document.body.appendChild(popup);
		});
	});

	// menu slide in from the right
	menuButton.addEventListener("click", () => {
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

	document.addEventListener("click", (event) => {
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

	// tasks link
	calendarLink.addEventListener("click", () => {
		window.location.href = "../mainview/mainview.html";
	});

	// vault link
	vaultLink.addEventListener("click", () => {
		window.location.href = "../vault/vault.html";
	});

	// search
	const searchInput = document.getElementById("searchInput");
	searchInput.addEventListener("input", () => {
		const query = searchInput.value.toLowerCase();
		const filteredTasks = allTasks.filter((task) =>
			task.task_name.toLowerCase().includes(query)
		);
		displayTasks(filteredTasks);
	});

	updateTasklist();
});
