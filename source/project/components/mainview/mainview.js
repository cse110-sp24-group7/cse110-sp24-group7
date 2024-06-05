/* eslint-disable no-undef */

const filters = {
	startTime: "",
	endTime: "",
	labels: [],
	priorities: [],
	exclusive: false
};

let labelColorMap = new Map();

/**
 * Adds tasks to the task containers.
 * @param {import("../../scripts/database/dbMgr").task[]} tasks - an array of task objects.
 */
function tasksRendererCallback(tasks) {
	// Clear all existing task entries first
	document.querySelectorAll(".task-container").forEach((container) => {
		container.innerHTML = ""; // Clears all child elements
	});

	// Add new tasks
	tasks.forEach((task) => {
		// Create elements for the task entry
		const taskPv = document.createElement("div");
		taskPv.classList.add("task-pv");
    taskPv.setAttribute('data-task-id', task.task_id);

		const taskName = document.createElement("h2");
		taskName.textContent = task.task_name;
		taskPv.appendChild(taskName);

    const taskContent = document.createElement("p1");
    taskContent.textContent = task.task_content;
    taskPv.appendChild(taskContent);

    const taskDueDate = document.createElement("p2");
    taskDueDate.textContent = `Due: ${task.due_date}`;
    taskPv.appendChild(taskDueDate);

    const taskPriority = document.createElement("p3");
    taskPriority.textContent = `Priority: ${task.priority}`;
    taskPv.appendChild(taskPriority);

    const taskExpectedTime = document.createElement("p4");
    taskExpectedTime.textContent = `Expected Time: ${task.expected_time}`;
    taskPv.appendChild(taskExpectedTime);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-task"); // Adding class for event delegation
    taskPv.appendChild(editButton);

    // Add Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const taskId = task.task_id;
  
      // Remove the task from local storage
      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks = tasks.filter(t => t.task_id !== taskId);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      taskPv.remove();
    });
    taskPv.appendChild(deleteButton);

		// for each label, create a small colored box representing that label
		if (task.labels.length > 0) {
			const taskLabels = document.createElement("div");
			taskLabels.classList.add("label-container");
			task.labels.forEach((label) => {
				const labelDiv = document.createElement("div");
				labelDiv.classList.add("label");
				labelDiv.style.backgroundColor = labelColorMap.get(label);
				taskLabels.appendChild(labelDiv);
			});
			taskPv.appendChild(taskLabels);
		}

    // Manipulation Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    //add Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-task"); // Adding class for event delegation
    editButton.innerHTML = `<img id="img1" src="edit-icon.png" alt="Edit">`;
    editButton.addEventListener("click", () => {
      // Open task popup for editing with task details
      openTaskPopupForEdit(taskPv.getAttribute('data-task-id'));
    });

    buttonContainer.appendChild(editButton);
    
    // Add Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<img id="img2" src="delete-icon.jpg" alt="Delete">`;
    deleteButton.addEventListener("click", () => {
      window.api.deleteTask(task.task_id, (tasks) => {
        updateMainview();
      });
    });
    buttonContainer.appendChild(deleteButton);

    taskPv.appendChild(buttonContainer);

    // Find the appropriate day container based on the task's due date
    // Assuming due_date is in 'YYYY-MM-DD' format and you need to map it to a specific day
    const dueDate = new Date(task.due_date);
    const dayIndex = dueDate.getDay(); // Sunday - Saturday : 0 - 6
    const dayContainer = document.querySelector(
      `.day${dayIndex + 1} .task-container`,
    );

		if (dayContainer) {
			dayContainer.appendChild(taskPv);
		}
	});
}

/**
 * Opens the task popup for editing with the provided task details and the corresponding task preview element.
 * @param {string} task_id - the task ID to edit
 */
function openTaskPopupForEdit(task_id) {
  window.api.fetchTask(task_id, (task) => {
    const popup = document.createElement("task-popup");
    document.body.appendChild(popup);
    popup.addEventListener('popupReady', () => {
      popup.taskEdit(task);
    });
  });
}

/**
 * Adds journal entries to the journal containers.
 * @param {import("../../scripts/database/dbMgr").entry[]} entries - an array of journal entry objects.
 */
function entriesRendererCallback(entries) {
	// Clear all existing journal entries first
	document.querySelectorAll(".journal-container").forEach((container) => {
		container.innerHTML = ""; // Clears all child elements
	});

	entries.forEach((entry) => {
		// Create elements for the journal entry
		const journalPv = document.createElement("div");
		journalPv.classList.add("journal-pv");
    journalPv.setAttribute('data-entry-id', entry.entry_id);

		const journalTitle = document.createElement("h2");
		journalTitle.textContent = entry.entry_title;
		journalPv.appendChild(journalTitle);

		const journalDesc = document.createElement("p");
		journalDesc.textContent = entry.entry_content;
		journalPv.appendChild(journalDesc);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-entry"); // Adding class for event delegation
    journalPv.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const entryId = entry.entry_id;
  
      // Remove the entry from local storage
      let entries = JSON.parse(localStorage.getItem("journalData")) || [];
      entries = entries.filter(e => e.entry_id !== entryId);
      localStorage.setItem("journalData", JSON.stringify(entries));

      journalPv.remove();
    });
    journalPv.appendChild(deleteButton);

		if (entry.labels.length > 0) {
			const journalLabels = document.createElement("div");
			journalLabels.classList.add("label-container");

			entry.labels.forEach((label) => {
				const journalDiv = document.createElement("div");
				journalDiv.classList.add("label");
				journalDiv.style.backgroundColor = labelColorMap.get(label);
				journalLabels.appendChild(journalDiv);
			});
			journalPv.appendChild(journalLabels);
		}

    // Manipulation Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    //add Edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-entry"); // Adding class for event delegation
    editButton.innerHTML = `<img id="img1" src="edit-icon.png" alt="Edit">`;
    editButton.addEventListener("click", () => {
      // Open journal popup for editing with task details
      openJournalPopupForEdit(journalPv.getAttribute('data-entry-id'));
    });

    buttonContainer.appendChild(editButton);

    // Add Delete Button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = `<img id="img2" src="delete-icon.jpg" alt="Delete">`;
    deleteButton.addEventListener("click", () => {
      window.api.deleteEntry(entry.entry_id, (entries) => {
        updateMainview();
      });
    });
    buttonContainer.appendChild(deleteButton);

    journalPv.appendChild(buttonContainer);

    // Find the appropriate day container based on the entry's creation date
    // Assuming creation_date is in 'YYYY-MM-DD' format and you need to map it to a specific day
    const creationDate = new Date(entry.creation_date);
    const dayIndex = creationDate.getDay(); // Sunday - Saturday : 0 - 6
    const dayContainer = document.querySelector(
      `.day${dayIndex + 1} .journal-container`,
    );

		if (dayContainer) {
			dayContainer.appendChild(journalPv);
		}
	});
}

/**
 * Opens the journal popup for editing with the provided journal details.
 * @param {string} entry_id - the journal entry ID to edit
 */
function openJournalPopupForEdit(entry_id) {
  window.api.fetchEntry(entry_id, (entry) => {
    const popup = document.createElement("journal-popup");
    document.body.appendChild(popup);
    popup.addEventListener('entryReady', () => {
      popup.journalEdit(entry);
    });
  });
}

/**
 * Loads the dates on the weekly view
 * @param {number} weekOffset = index value relative to today's current week
 */
function setWeeklyView(weekOffset) {
	const daysOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
	const today = new Date();
	today.setDate(today.getDate() + weekOffset * 7);

	const currentDay = today.getDay();
	const currentDate = today.getDate();

	const startDate = new Date(today);
	startDate.setDate(startDate.getDate() - currentDay);
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + 6); // Move to Saturday
	endDate.setHours(23, 59, 59, 999); // Set to Saturday 23:59

	filters.startTime = startDate
		.toISOString()
		.substring(
			0,
			startDate
				.toISOString()
				.indexOf(":", startDate.toISOString().indexOf(":") + 1)
		);
	filters.endTime = endDate
		.toISOString()
		.substring(
			0,
			endDate
				.toISOString()
				.indexOf(":", endDate.toISOString().indexOf(":") + 1)
		);

	const monthNames = [
		"JANUARY",
		"FEBRUARY",
		"MARCH",
		"APRIL",
		"MAY",
		"JUNE",
		"JULY",
		"AUGUST",
		"SEPTEMBER",
		"OCTOBER",
		"NOVEMBER",
		"DECEMBER"
	];
	const currentMonthElement = document.getElementById("current-month");
	currentMonthElement.textContent = monthNames[today.getMonth()];

	daysOfWeek.forEach((day, index) => {
		const dayColumn = document.querySelector(`.day${index + 1}`);
		const dateElement = dayColumn.querySelector(".day-date");
		const dayDate = new Date(startDate);
		dayDate.setDate(startDate.getDate() + index);
		const dayNumber = dayDate.getDate();
		dateElement.textContent = dayNumber;

		if (dayNumber === currentDate && weekOffset === 0) {
			dateElement.classList.add("today");
		} else {
			dateElement.classList.remove("today");
		}
	});

	updateMainview();
}

function updateMainview() {
	// First update color map, then update tasks and entries.
	window.api.getLabelColorMap((map) => {
		labelColorMap = map;
		window.api.getFilteredTasks(filters, (tasks) => {
			localStorage.setItem("tasks", JSON.stringify(tasks));
			tasksRendererCallback(tasks);
		});
		window.api.getFilteredEntries(filters, (entries) => {
			localStorage.setItem("journalData", JSON.stringify(entries));
			entriesRendererCallback(entries);
		});
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	let currentWeekOffset = 0;
	await window.path.getUserData().then((userData) => {
		console.log("Renderer access userdata: " + userData);
		window.api.connect(userData, () => {
			window.api.init(() => {
				console.log("Renderer init table.");
				setWeeklyView(currentWeekOffset); // Load this week's dates
			});
		});
	});

	document.addEventListener("storageUpdate", () => {
		updateMainview();
	});

	// creates the popup when the add task button is clicked
	document.querySelectorAll(".add-task").forEach((button) => {
		button.addEventListener("click", () => {
			const popup = document.createElement("task-popup");
			document.body.appendChild(popup);
		});
	});

  // creates the popup when the add journal entry button is clicked
  document.querySelectorAll(".add-journal").forEach((button) => {
    button.addEventListener("click", () => {
      const popup = document.createElement("journal-popup");
      document.body.appendChild(popup);
    });
  });

	// Display correct week when clicking arrows
	document.getElementById("prev-week").addEventListener("click", () => {
		currentWeekOffset -= 1;
		setWeeklyView(currentWeekOffset);
	});

	document.getElementById("next-week").addEventListener("click", () => {
		currentWeekOffset += 1;
		setWeeklyView(currentWeekOffset);
	});

	// Display the current week when clicking "Today" Button
	document.getElementById("today-button").addEventListener("click", () => {
		currentWeekOffset = 0;
		setWeeklyView(currentWeekOffset);
	});

	// updateMainview();
});
