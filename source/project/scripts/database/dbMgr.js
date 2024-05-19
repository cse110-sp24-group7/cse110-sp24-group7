const sqlite = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../data/data.db');
const db = new sqlite.Database(dbPath);

/**
 * An object representing a task
 * @typedef {Object} task
 * @property {string} task_id - the task's unique id.
 * @property {string} task_name - the task's name or title.
 * @property {string} task_content - the task's content.
 * @property {string} creation_date - the task's creation date, in string format.
 * @property {string} due_date - the task's due date, in string format.
 * @property {string} priority - the task's priority in some string.
 * @property {string} label - the task's label
 * @property {string} expected_time - the task's expected time.
 */

/**
 * An object representing a journal entry
 * @typedef {Object} entry
 * @property {string} entry_id - the entry's unique id.
 * @property {string} entry_title - the entry's title.
 * @property {string} entry_content - the entry's content.
 * @property {string} creation_date - the entry's creation date, in string format.
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
 * Initializes the tasks table
 */
function tasksInit() {
    const sql = `CREATE TABLE IF NOT EXISTS tasks (
        task_id TEXT PRIMARY KEY,
        task_name TEXT,
        task_content TEXT,
        creation_date TEXT,
        due_date TEXT,
        priority TEXT,
        label TEXT
        expected_time TEXT);`;
    db.run(sql, [], (err) => {if(err) throw err;});
}

/**
 * Initializes the entries table
 */
function entriesInit() {
    const sql = `CREATE TABLE IF NOT EXISTS entries (
        entry_id TEXT PRIMARY KEY,
        entry_title TEXT,
        entry_content TEXT,
        creation_date TEXT);`;
    db.run(sql, [], (err) => {if(err) throw err;});
}

/**
 * Initializes database by creating tables if needed.
 * Must call this function before any queries to prevent error.
 */
function init() {
    tasksInit();
    entriesInit();
}

/**
 * Queries and returns all tasks.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function getTasks(trcb) {
    const sql = "SELECT * FROM tasks";
    db.each(sql, [], (err, row) => {
        if (err) {
            throw err;
        }
        ret.push(row);
    }, () => {
        callback(trcb);
    });
}

/**
 * Queries and returns all entries.
 * @param {entriesRenderCallback} ercb - the tasks render callback to update the frontend.
 */
function getEntries(ercb) {
    const sql = "SELECT * FROM entries";
    db.each(sql, [], (err, row) => {
        if (err) {
            throw err;
        }
        ret.push(row);
    }, () => {
        callback(ercb);
    });
}

/**
 * Adds a task to the database
 * @param {task} task - the task to add
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function addTask(task, trcb) {
    const sql = `INSERT INTO tasks (task_id, task_name, task_content, creation_date, due_date, priority, label, expected_time)
        VALUES('${task.task_id}', '${task.task_name}', '${task.task_content}', '${task.creation_date}', '${task.due_date}', '${task.priority}', '${task.label}', '${task.expected_time}');`;
    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
        this.getTasks(trcb);
    });
}

/**
 * Adds a entry to the database
 * @param {entry} entry - the entry to add
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 */
function addEntry(entry, ercb) {
    const sql = `INSERT INTO entries (entry_id, entry_title, entry_content)
        VALUES('${entry.entry_id}', '${entry.entry_title}', '${entry.entry_content}');`;
    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
        this.getEntries(ercb);
    });
}

/**
 * Edits a task in the database
 * @param {task} task - the task to edit. The ID must exist in 
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function editTask(task, trcb) {
    const sql = `UPDATE tasks SET
            task_name = '${task.task_name}',
            task_content = '${task.task_content}',
            creation_date = '${task.creation_date}',
            due_date = '${task.due_date}',
            priority = '${task.priority}',
            label = '${task.label}',
            expected_time = '${task.expected_time}'
        WHERE task_id = '${task.task_id}';`;
    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
        this.getTasks(trcb);
    });
}

/**
 * Edits a entry in the database
 * @param {entry} entry - the entry to add
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 */
function editEntry(entry, ercb) {
    const sql = `UPDATE entries SET
            entry_title = '${entry.entry_title}',
            entry_content = '${entry.entry_content}',
            creation_date = '${entry.creation_date}'
        WHERE entry_id = '${entry.entry_id}';`;
    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
        this.getEntries(ercb);
    });
}

/**
 * Deletes an entry in the database
 * @param {string} task_id - the ID of the task to be deleted.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function deleteTask(task_id, trcb){
    const sql = `DELETE FROM tasks WHERE task_id = '${task_id}'`;
    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
        this.getTasks(trcb);
    });
}

/**
 * Deletes an entry in the database
 * @param {string} entry_id - the ID of the entry to be deleted.
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 */
function deleteEntry(entry_id, ercb){
    const sql = `DELETE FROM entries WHERE entry_id = '${entry_id}'`;
    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
        this.getTasks(ercb);
    });
}

exports.init = init;
exports.getTasks = getTasks;
exports.getEntries = getEntries;
exports.addTask = addTask;
exports.addEntry = addEntry;
exports.editTask = editTask;
exports.editEntry = editEntry;
exports.deleteTask = deleteTask;
exports.deleteEntry = deleteEntry;