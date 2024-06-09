// import sqlite from 'sqlite3';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
/**
 * @module dbMgr
 * @description This module is responsible for managing the database connection and executing queries. This uses a SQLite Database and interfaces using the sqlite3 package.
 */
const sqlite = require("sqlite3");
const path = require("path");

const defaultPath = path.resolve(__dirname, "../../data/data.db");
let db = {};
/**
 * @description Connects to the database with a specified path. If no path is provided, the default path is used.
 * @param {string} pathToDB - the path to the database file.
 * @param {function} callback - the callback function to execute after the connection is established.
 * @returns {void}
 
 */
function connect(pathToDB, callback) {
	// Connects to the specified database file or the default path.
	// Throws an error if the connection fails.
	if (pathToDB != "") {
		db = new sqlite.Database(path.resolve(pathToDB, "data.db"), (err) => {
			if (err) throw err;
			callback();
		});
	} else {
		db = new sqlite.Database(defaultPath, (err) => {
			if (err) throw err;
			callback();
		});
	}
}

/**
 * An object representing a task
 * @typedef {Object} Task
 * @property {string} task_id - the task's unique id.
 * @property {string} task_name - the task's name or title.
 * @property {string} task_content - the task's content.
 * @property {string} creation_date - the task's creation date, in string format.
 * @property {string} due_date - the task's due date, in string format.
 * @property {string} priority - the task's priority in some string.
 * @property {string} expected_time - the task's expected time.
 * @property {string[]} labels - the task's labels
 */

/**
 * An object representing a journal entry
 * @typedef {Object} Entry
 * @property {string} entry_id - the entry's unique id.
 * @property {string} entry_title - the entry's title.
 * @property {string} entry_content - the entry's content.
 * @property {string} creation_date - the entry's creation date, in string format.
 * @property {string[]} labels - the entry's labels
 */

/**
 * tasksRenderCallback should be called when an edit to tasks is made and a render is required.
 *
 * @callback tasksRenderCallback
 * @param {task[]} tasks - the updated array of task objects.
 */

/**
 * entriesRenderCallback should be called when an edit to entries is made and a render is required.
 *
 * @callback entriesRenderCallback
 * @param {entry[]} entries - the updated array of entry objects.
 */

/**
 * labelRendererCallback should be called when an edit to labels is made and a render is required.
 *
 * @callback labelRendererCallback
 * @param {string[]} labels - the updated array of label strings.
 */

/**
 * beginCallback should be called when loading the initial mainview.html, after initializing connection to database.
 *
 * @callback beginCallback
 */

/**
 * callback functions are used for general functions to notify the front-end that the query has been executed.
 *
 * @callback callback
 */

/**
 * @description Initializes database by creating tables if needed.
 * Must call this function before any queries to prevent error.
 *
 * @param {beginCallback} bcb - beginCallback to load main window.
 * @returns {void}
 
 * 
 */

const init = (bcb) => {
	// Enable foreign key constraints
	const fk_sql = `PRAGMA foreign_keys=ON`;
	// SQL queries for each table
	const tasks_sql = `CREATE TABLE IF NOT EXISTS tasks (
        task_id TEXT PRIMARY KEY,
        task_name TEXT,
        task_content TEXT,
        creation_date TEXT,
        due_date TEXT,
        priority TEXT,
        expected_time TEXT);`; // Create tasks table if it does not exist
	const entries_sql = `CREATE TABLE IF NOT EXISTS entries (
        entry_id TEXT PRIMARY KEY,
        entry_title TEXT,
        entry_content TEXT,
        creation_date TEXT);`; // Create entries table if it does not exist
	const labels_sql = `CREATE TABLE IF NOT EXISTS labels(
        label TEXT PRIMARY KEY,
        color TEXT);`; // Create labels table if it does not exist
	const task_labels_sql = `CREATE TABLE IF NOT EXISTS task_labels (
        task_id TEXT,
        label TEXT,
        CONSTRAINT fk_task_id
            FOREIGN KEY (task_id)
            REFERENCES tasks(task_id)
            ON DELETE CASCADE,
        CONSTRAINT fk_label
            FOREIGN KEY (label)
            REFERENCES labels(label)
            ON DELETE CASCADE
        );`; // Create task_labels table if it does not exist
	const entry_labels_sql = `CREATE TABLE IF NOT EXISTS entry_labels (
        entry_id TEXT,
        label TEXT,
        CONSTRAINT fk_entry_id
            FOREIGN KEY (entry_id)
            REFERENCES entries(entry_id)
            ON DELETE CASCADE,
        CONSTRAINT fk_label
            FOREIGN KEY (label)
            REFERENCES labels(label)
            ON DELETE CASCADE
        );`; // Create entry_labels table if it does not exist

	// Table creation queries are serialized to ensure key constraints are followed.
	db.serialize(() => {
		db.run(fk_sql, [], (err) => {
			if (err) throw err;
		});
		db.run(tasks_sql, [], (err) => {
			if (err) throw err;
		});
		db.run(entries_sql, [], (err) => {
			if (err) throw err;
		});
		db.run(labels_sql, [], (err) => {
			if (err) throw err;
		});
		db.run(entry_labels_sql, [], (err) => {
			if (err) throw err;
		});
		db.run(
			task_labels_sql,
			[],
			(err) => {
				if (err) throw err;
			},
			bcb
		);
	});
};

/**
 * @description Queries and returns all labels.
 * @param {labelRendererCallback} lrcb - the label render callback to update the frontend.
 * @returns {void}
 
 */
function getLabels(lrcb) {
	const sql = `
    SELECT label
    FROM labels;
  `;

	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}

		const labels = rows.map((row) => row.label);

		lrcb(labels);
	});
}

/**
 * @description Queries and returns a map of labels to their corresponding colors.
 * @param {function} callback - the callback function to handle the resulting map.
 * @returns {void}
 
 */
function getLabelColorMap(callback) {
	const sql = `
    SELECT label, color
    FROM labels;
  `; // Select all labels from the labels table
	const labelColorMap = new Map();
	db.each(
		sql,
		[],
		(err, row) => {
			if (err) {
				throw err;
			}
			// Sets the key-value pair in map
			labelColorMap.set(row.label, row.color);
		},
		() => {
			callback(labelColorMap);
		}
	);
}

/**
 * @description Queries and returns all tasks.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 * @returns {void}
 
 */
const getTasks = (trcb) => {
	// Join tasks with their labels, and group concatenates the labels to be comma separated
	const sql = `
    SELECT t.task_id, t.task_name, t.task_content, t.creation_date, t.due_date, t.priority, t.expected_time, GROUP_CONCAT(l.label) as labels
    FROM tasks t
    LEFT JOIN task_labels l ON t.task_id = l.task_id
    GROUP BY t.task_id
    ORDER BY t.due_date ASC;
    `;

	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}
		// Map the rows to task objects, splitting the labels into an array if they exist
		const tasks =
			rows.length > 0
				? rows.map((row) => ({
						task_id: row.task_id,
						task_name: row.task_name,
						task_content: row.task_content,
						creation_date: row.creation_date,
						due_date: row.due_date,
						priority: row.priority,
						expected_time: row.expected_time,
						labels: row.labels ? row.labels.split(",") : []
					}))
				: [];
		trcb(tasks);
	});
};

/**
 * @description Queries and returns all tasks that have ALL labels specified.
 * @param {string[]} labels - an array of labels that each task must contain
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 * @returns {void} if we have a nonzero length. Otherwise just returns the callback.
 *
 */
const getTasksConjunctLabels = (labels, trcb) => {
	if (labels.length === 0) {
		return trcb([]);
	}

	const placeholders = labels.map(() => "?").join(",");
	const sql = `
        SELECT t.task_id, t.task_name, t.task_content, t.creation_date, t.due_date, t.priority, t.expected_time, GROUP_CONCAT(l.label) as labels
        FROM tasks t
        JOIN task_labels l ON t.task_id = l.task_id
        WHERE l.label IN (${placeholders})
        GROUP BY t.task_id
        HAVING COUNT(DISTINCT l.label) = ?
    `;

	db.all(sql, [...labels, labels.length], (err, rows) => {
		if (err) {
			throw err;
		}

		const tasks =
			rows.length > 0
				? rows.map((row) => ({
						task_id: row.task_id,
						task_name: row.task_name,
						task_content: row.task_content,
						creation_date: row.creation_date,
						due_date: row.due_date,
						priority: row.priority,
						expected_time: row.expected_time,
						labels: row.labels ? row.labels.split(",") : []
					}))
				: [];

		trcb(tasks);
	});
};

/**
 * @description Queries and returns all tasks that have ANY of the labels specified. If none is provided, then all tasks are returned.
 * @param {string[]} labels - an array of labels; each task must contain AT LEAST one
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 
 */
const getTasksDisjunctLabels = (labels, trcb) => {
	let sql = `
    SELECT t.task_id, t.task_name, t.task_content, t.creation_date, t.due_date, t.priority, t.expected_time, GROUP_CONCAT(l.label) as labels
    FROM tasks t
    LEFT JOIN task_labels l ON t.task_id = l.task_id
    `;

	const params = [];

	if (labels.length > 0) {
		const labelPlaceholders = labels.map(() => "?").join(",");
		sql += ` WHERE l.label IN (${labelPlaceholders}) GROUP BY t.task_id HAVING COUNT(DISTINCT l.label) >= 1`;
		params.push(...labels);
	} else {
		sql += ` GROUP BY t.task_id`;
	}

	db.all(sql, params, (err, rows) => {
		if (err) {
			throw err;
		}

		const tasks =
			rows.length > 0
				? rows.map((row) => ({
						task_id: row.task_id,
						task_name: row.task_name,
						task_content: row.task_content,
						creation_date: row.creation_date,
						due_date: row.due_date,
						priority: row.priority,
						expected_time: row.expected_time,
						labels: row.labels ? row.labels.split(",") : []
					}))
				: [];

		trcb(tasks);
	});
};

/**
 * An object representing the filter criteria for querying tasks.
 * @typedef {Object} filters
 * @property {string} startTime - The start date and time for filtering tasks, in ISO 8601 format (yyyy-mm-ddTHH:MM).
 * @property {string} endTime - The end date and time for filtering tasks, in ISO 8601 format (yyyy-mm-ddTHH:MM).
 * @property {string[]} labels - An array of labels to filter tasks by.
 * @property {string[]} priorities - An array of priorities to filter tasks by.
 * @property {boolean} exclusive - If true, perform a conjunctive (AND) search on labels, otherwise perform a disjunctive (OR) search.
 */

/**
 * @description Queries and returns all tasks based on the provided filter criteria.
 * @param {filters} filterCriteria - The filter criteria object.
 * @param {tasksRenderCallback} trcb - The tasks render callback to update the frontend.
 
 */
function getFilteredTasks(filterCriteria, trcb) {
	const { startTime, endTime, labels, priorities, exclusive } =
		filterCriteria;

	let sql = `
    SELECT t.task_id, t.task_name, t.task_content, t.creation_date, t.due_date, t.priority, t.expected_time, GROUP_CONCAT(l.label) as labels
    FROM tasks t
    LEFT JOIN task_labels l ON t.task_id = l.task_id
  `;

	const conditions = [];
	const params = [];

	// Filter by time range
	if (startTime && endTime) {
		conditions.push(`t.due_date BETWEEN ? AND ?`);
		params.push(startTime, endTime);
	}

	// Filter by priorities
	if (priorities.length > 0) {
		const priorityPlaceholders = priorities.map(() => "?").join(",");
		conditions.push(`t.priority IN (${priorityPlaceholders})`);
		params.push(...priorities);
	}

	// Filter by labels
	if (labels.length > 0) {
		const labelPlaceholders = labels.map(() => "?").join(",");
		conditions.push(`l.label IN (${labelPlaceholders})`);
		params.push(...labels);
	}

	if (conditions.length > 0) {
		sql += ` WHERE ` + conditions.join(" AND ");
	}

	sql += ` GROUP BY t.task_id`;

	// Apply the HAVING clause for label filtering
	if (labels.length > 0) {
		if (exclusive) {
			// Conjunctive (AND) filtering: Ensure the task has all specified labels
			sql += ` HAVING COUNT(DISTINCT l.label) = ?`;
			params.push(labels.length);
		}
		// Disjunctive (OR) filtering: Ensure the task has at least one of the specified labels
	}

	sql += ` ORDER BY t.due_date ASC`;

	db.all(sql, params, (err, rows) => {
		if (err) {
			throw err;
		}

		const tasks =
			rows.length > 0
				? rows.map((row) => ({
						task_id: row.task_id,
						task_name: row.task_name,
						task_content: row.task_content,
						creation_date: row.creation_date,
						due_date: row.due_date,
						priority: row.priority,
						expected_time: row.expected_time,
						labels: row.labels ? row.labels.split(",") : []
					}))
				: [];

		trcb(tasks);
	});
}

/**
 * @description Queries and returns all entries based on the provided filter criteria.
 * @param {entryFilters} filterCriteria - The filter criteria object.
 * @param {entriesRenderCallback} ercb - The entries render callback to update the frontend.
 
 */
function getFilteredEntries(filterCriteria, ercb) {
	const { startTime, endTime, labels, exclusive } = filterCriteria;

	let sql = `
    SELECT e.entry_id, e.entry_title, e.entry_content, e.creation_date, GROUP_CONCAT(l.label) as labels
    FROM entries e
    LEFT JOIN entry_labels l ON e.entry_id = l.entry_id
  `;

	const conditions = [];
	const params = [];

	// Filter by time range
	if (startTime && endTime) {
		conditions.push(`e.creation_date BETWEEN ? AND ?`);
		params.push(startTime, endTime);
	}

	// Filter by labels
	if (labels.length > 0) {
		const labelPlaceholders = labels.map(() => "?").join(",");
		conditions.push(`l.label IN (${labelPlaceholders})`);
		params.push(...labels);
	}

	if (conditions.length > 0) {
		sql += ` WHERE ` + conditions.join(" AND ");
	}

	sql += ` GROUP BY e.entry_id`;

	// Apply the HAVING clause for label filtering
	if (labels.length > 0) {
		if (exclusive) {
			// Conjunctive (AND) filtering: Ensure the entry has all specified labels
			sql += ` HAVING COUNT(DISTINCT l.label) = ?`;
			params.push(labels.length);
		}
		// Disjunctive (OR) filtering: Ensure the entry has at least one of the specified labels
	}

	db.all(sql, params, (err, rows) => {
		if (err) {
			throw err;
		}

		const entries =
			rows.length > 0
				? rows.map((row) => ({
						entry_id: row.entry_id,
						entry_title: row.entry_title,
						entry_content: row.entry_content,
						creation_date: row.creation_date,
						labels: row.labels ? row.labels.split(",") : []
					}))
				: [];

		ercb(entries);
	});
}

/**
 * @description Queries and returns all entries.
 * @param {entriesRenderCallback} ercb - the tasks render callback to update the frontend.
 
 */
function getEntries(ercb) {
	const sql = `
    SELECT e.entry_id, e.entry_title, e.entry_content, e.creation_date, GROUP_CONCAT(l.label) as labels
    FROM entries e
    LEFT JOIN entry_labels l ON e.entry_id = l.entry_id
    GROUP BY e.entry_id;
  `;

	db.all(sql, [], (err, rows) => {
		if (err) {
			throw err;
		}

		const entries =
			rows.length > 0
				? rows.map((row) => ({
						entry_id: row.entry_id,
						entry_title: row.entry_title,
						entry_content: row.entry_content,
						creation_date: row.creation_date,
						labels: row.labels ? row.labels.split(",") : []
					}))
				: [];

		ercb(entries);
	});
}

/**
 * @description Adds a task to the database
 * @param {task} task - the task to add
 * @param {callback} callback - callback to update the frontend.
 
 */
function addTask(task, callback) {
	const taskSql = `INSERT INTO tasks (task_id, task_name, task_content, creation_date, due_date, priority, expected_time)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;

	const labelSql = `INSERT INTO task_labels (task_id, label) VALUES (?, ?);`;

	db.run(
		taskSql,
		[
			task.task_id,
			task.task_name,
			task.task_content,
			task.creation_date,
			task.due_date,
			task.priority,
			task.expected_time
		],
		(err) => {
			if (err) {
				throw err;
			}

			const stmt = db.prepare(labelSql);
			let remaining = task.labels.length;

			// Callback runs only after every label has been added.
			if (remaining === 0) {
				stmt.finalize((finalizeErr) => {
					if (finalizeErr) {
						throw finalizeErr;
					}
					callback();
				});
				return;
			}

			task.labels.forEach((label) => {
				stmt.run([task.task_id, label], (err) => {
					if (err) {
						throw err;
					}
					remaining--;
					if (remaining === 0) {
						stmt.finalize((finalizeErr) => {
							if (finalizeErr) {
								throw finalizeErr;
							}
							callback();
						});
					}
				});
			});
		}
	);
}

/**
 * @description Adds multiple tasks to the database
 * @param {task[]} tasks - the tasks to add
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 
 */
const addTasks = (tasks, trcb) => {
	const taskSql = `INSERT INTO tasks (task_id, task_name, task_content, creation_date, due_date, priority, expected_time)
        VALUES (?, ?, ?, ?, ?, ?, ?);`;
	const labelSql = `INSERT INTO task_labels (task_id, label) VALUES (?, ?);`;

	db.serialize(() => {
		const taskStmt = db.prepare(taskSql);
		const labelStmt = db.prepare(labelSql);

		tasks.forEach((task) => {
			taskStmt.run(
				[
					task.task_id,
					task.task_name,
					task.task_content,
					task.creation_date,
					task.due_date,
					task.priority,
					task.expected_time
				],
				(err) => {
					if (err) {
						throw err;
					}
				}
			);

			task.labels.forEach((label) => {
				labelStmt.run([task.task_id, label], (err) => {
					if (err) {
						throw err;
					}
				});
			});
		});

		taskStmt.finalize();
		labelStmt.finalize();

		getTasks(trcb);
	});
};

/**
 * @description Adds an entry to the database
 * @param {entry} entry - the entry to add
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 
 */
function addEntry(entry, callback) {
	const entrySql = `INSERT INTO entries (entry_id, entry_title, entry_content, creation_date)
        VALUES (?, ?, ?, ?);`;

	const labelSql = `INSERT INTO entry_labels (entry_id, label) VALUES (?, ?);`;

	db.run(
		entrySql,
		[
			entry.entry_id,
			entry.entry_title,
			entry.entry_content,
			entry.creation_date
		],
		(err) => {
			if (err) {
				throw err;
			}

			const stmt = db.prepare(labelSql);
			let remaining = entry.labels.length;

			if (remaining === 0) {
				stmt.finalize((finalizeErr) => {
					if (finalizeErr) {
						throw finalizeErr;
					}
					callback();
				});
				return;
			}

			entry.labels.forEach((label) => {
				stmt.run([entry.entry_id, label], (err) => {
					if (err) {
						throw err;
					}
					remaining--;
					if (remaining === 0) {
						stmt.finalize((finalizeErr) => {
							if (finalizeErr) {
								throw finalizeErr;
							}
							callback();
						});
					}
				});
			});
		}
	);
}

/**
 * @description Adds multiple entries to the database
 * @param {entry[]} entries - the entries to add
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 
 */
function addEntries(entries, ercb) {
	const entrySql = `INSERT INTO entries (entry_id, entry_title, entry_content, creation_date)
        VALUES (?, ?, ?, ?);`;
	const labelSql = `INSERT INTO entry_labels (entry_id, label) VALUES (?, ?);`;

	db.serialize(() => {
		const entryStmt = db.prepare(entrySql);
		const labelStmt = db.prepare(labelSql);

		entries.forEach((entry) => {
			entryStmt.run(
				[
					entry.entry_id,
					entry.entry_title,
					entry.entry_content,
					entry.creation_date
				],
				(err) => {
					if (err) {
						throw err;
					}
				}
			);

			entry.labels.forEach((label) => {
				labelStmt.run([entry.entry_id, label], (err) => {
					if (err) {
						throw err;
					}
				});
			});
		});

		entryStmt.finalize();
		labelStmt.finalize();

		getEntries(ercb);
	});
}

/**
 * @description Adds a label to the database
 * @param {string} label - the label to add
 * @param {string} color - the color of the label
 * @param {labelRendererCallback} lrcb - the labels render callback to update the frontend.
 
 */
function addLabel(label, color, lrcb) {
	const sql = `INSERT INTO labels (label, color) VALUES (?, ?);`;
	db.run(sql, [label, color], (err) => {
		if (err) {
			throw err;
		}
		getLabels(lrcb);
	});
}

/**
 * @description Adds multiple labels to the database
 * @param {string[]} labels - the labels to add
 * @param {string[]} colors - the colors of labels to add
 * @param {labelRendererCallback} lrcb - the labels render callback to update the frontend.
 
 */
function addLabels(labels, colors, lrcb) {
	const sql = `INSERT INTO labels (label, color) VALUES (?, ?);`;
	db.serialize(() => {
		const stmt = db.prepare(sql);
		for (let i = 0; i < labels.length; i++) {
			stmt.run([labels[i], colors[i]], (err) => {
				if (err) {
					throw err;
				}
			});
		}
		stmt.finalize();
		getLabels(lrcb);
	});
}

/**
 * @description Edits a task in the database
 * @param {task} task - the task to edit. The ID must exist in the database.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 
 */
function editTask(task, trcb) {
	const taskSql = `UPDATE tasks SET
            task_name = ?,
            task_content = ?,
            creation_date = ?,
            due_date = ?,
            priority = ?,
            expected_time = ?
        WHERE task_id = ?;`;

	const deleteLabelsSql = `DELETE FROM task_labels WHERE task_id = ?;`;

	const insertLabelSql = `INSERT INTO task_labels (task_id, label) VALUES (?, ?);`;

	db.serialize(() => {
		// Update the task details
		db.run(
			taskSql,
			[
				task.task_name,
				task.task_content,
				task.creation_date,
				task.due_date,
				task.priority,
				task.expected_time,
				task.task_id
			],
			(err) => {
				if (err) {
					throw err;
				}
			}
		);

		// Delete existing labels
		db.run(deleteLabelsSql, [task.task_id], (err) => {
			if (err) {
				throw err;
			}
		});

		// Insert updated labels
		const stmt = db.prepare(insertLabelSql);
		task.labels.forEach((label) => {
			stmt.run([task.task_id, label], (err) => {
				if (err) {
					throw err;
				}
			});
		});
		stmt.finalize();

		getTasks(trcb);
	});
}

/**
 * @description Edits an entry in the database
 * @param {entry} entry - the entry to edit. The ID must exist in the database.
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 
 */
function editEntry(entry, ercb) {
	const entrySql = `UPDATE entries SET
            entry_title = ?,
            entry_content = ?,
            creation_date = ?
        WHERE entry_id = ?;`;

	const deleteLabelsSql = `DELETE FROM entry_labels WHERE entry_id = ?;`;

	const insertLabelSql = `INSERT INTO entry_labels (entry_id, label) VALUES (?, ?);`;

	db.serialize(() => {
		db.run(
			entrySql,
			[
				entry.entry_title,
				entry.entry_content,
				entry.creation_date,
				entry.entry_id
			],
			(err) => {
				if (err) {
					throw err;
				}
			}
		);

		db.run(deleteLabelsSql, [entry.entry_id], (err) => {
			if (err) {
				throw err;
			}
		});

		const stmt = db.prepare(insertLabelSql);
		entry.labels.forEach((label) => {
			stmt.run([entry.entry_id, label], (err) => {
				if (err) {
					throw err;
				}
			});
		});
		stmt.finalize();

		getEntries(ercb);
	});
}

/**
 * @description Deletes a task in the database
 * @param {string} task_id - the ID of the task to be deleted.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 
 */
const deleteTask = (task_id, trcb) => {
	const sql = `DELETE FROM tasks WHERE task_id = '${task_id}'`;
	db.run(sql, [], (err) => {
		if (err) {
			throw err;
		}
		getTasks(trcb);
	});
};

/**
 * @description Deletes tasks in the database
 * @param {string[]} task_ids - the IDs of tasks to be deleted.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 
 */
const deleteTasks = (task_ids, trcb) => {
	const deleteTaskSql = `DELETE FROM tasks WHERE task_id = ?`;

	db.serialize(() => {
		const taskStmt = db.prepare(deleteTaskSql);
		task_ids.forEach((task_id) => {
			taskStmt.run([task_id], (err) => {
				if (err) {
					throw err;
				}
			});
		});

		taskStmt.finalize();

		getTasks(trcb);
	});
};

/**
 * @description Deletes an entry in the database
 * @param {string} entry_id - the ID of the entry to be deleted.
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 
 */
function deleteEntry(entry_id, ercb) {
	const sql = `DELETE FROM entries WHERE entry_id = ?;`;
	db.run(sql, [entry_id], (err) => {
		if (err) {
			throw err;
		}
		getEntries(ercb);
	});
}

/**
 * @description Deletes multiple entries in the database
 * @param {string[]} entry_ids - the IDs of entries to be deleted.
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 
 */
function deleteEntries(entry_ids, ercb) {
	const deleteEntrySql = `DELETE FROM entries WHERE entry_id = ?`;

	db.serialize(() => {
		const entryStmt = db.prepare(deleteEntrySql);

		entry_ids.forEach((entry_id) => {
			entryStmt.run([entry_id], (err) => {
				if (err) {
					throw err;
				}
			});
		});

		entryStmt.finalize();

		getEntries(ercb);
	});
}

/**
 * @description Deletes a label from the database
 * @param {string} label - the label to delete
 * @param {labelRendererCallback} lrcb - the labels render callback to update the frontend.
 
 */
function deleteLabel(label, lrcb) {
	const sql = `DELETE FROM labels WHERE label = ?;`;
	db.run(sql, [label], (err) => {
		if (err) {
			throw err;
		}
		getLabels(lrcb);
	});
}

/**
 * @description Deletes multiple labels from the database
 * @param {string[]} labels - the labels to delete
 * @param {labelRendererCallback} lrcb - the labels render callback to update the frontend.
 
 */
function deleteLabels(labels, lrcb) {
	const sql = `DELETE FROM labels WHERE label = ?;`;
	db.serialize(() => {
		const stmt = db.prepare(sql);
		labels.forEach((label) => {
			stmt.run([label], (err) => {
				if (err) {
					throw err;
				}
			});
		});
		stmt.finalize();
		getLabels(lrcb);
	});
}

/**
 * @description Fetches a task from the database based on the task_id.
 * @param {string} task_id - the ID of the task to fetch.
 * @param {function} callback - the callback function to handle the resulting task object.
 
 */
function fetchTask(task_id, callback) {
	const sql = `
        SELECT t.task_id, t.task_name, t.task_content, t.creation_date, t.due_date, t.priority, t.expected_time, GROUP_CONCAT(l.label) as labels
        FROM tasks t
        LEFT JOIN task_labels l ON t.task_id = l.task_id
        WHERE t.task_id = ?
        GROUP BY t.task_id;
    `;

	db.get(sql, [task_id], (err, row) => {
		if (err) {
			throw err;
		}

		const task = row
			? {
					task_id: row.task_id,
					task_name: row.task_name,
					task_content: row.task_content,
					creation_date: row.creation_date,
					due_date: row.due_date,
					priority: row.priority,
					expected_time: row.expected_time,
					labels: row.labels ? row.labels.split(",") : []
				}
			: null;

		callback(task);
	});
}

/**
 * @description Fetches an entry from the database based on the entry_id.
 * @param {string} entry_id - the ID of the entry to fetch.
 * @param {function} callback - the callback function to handle the resulting entry object.
 
 */
function fetchEntry(entry_id, callback) {
	const sql = `
        SELECT e.entry_id, e.entry_title, e.entry_content, e.creation_date, GROUP_CONCAT(l.label) as labels
        FROM entries e
        LEFT JOIN entry_labels l ON e.entry_id = l.entry_id
        WHERE e.entry_id = ?
        GROUP BY e.entry_id;
    `;

	db.get(sql, [entry_id], (err, row) => {
		if (err) {
			throw err;
		}

		const entry = row
			? {
					entry_id: row.entry_id,
					entry_title: row.entry_title,
					entry_content: row.entry_content,
					creation_date: row.creation_date,
					labels: row.labels ? row.labels.split(",") : []
				}
			: null;

		callback(entry);
	});
}

module.exports = {
	init,
	connect,
	getTasks,
	getTasksConjunctLabels,
	getTasksDisjunctLabels,
	getFilteredTasks,
	getFilteredEntries,
	getEntries,
	addTask,
	addTasks,
	addEntry,
	addEntries,
	editTask,
	editEntry,
	deleteTask,
	deleteTasks,
	deleteEntry,
	deleteEntries,
	getLabels,
	getLabelColorMap,
	addLabel,
	addLabels,
	deleteLabel,
	deleteLabels,
	fetchEntry,
	fetchTask
};
