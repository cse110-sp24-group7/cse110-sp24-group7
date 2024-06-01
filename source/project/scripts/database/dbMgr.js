// import sqlite from 'sqlite3';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const sqlite = require("sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "../../data/data.db");
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
 * @property {string} expected_time - the task's expected time.
 * @property {string[]} labels - the task's labels
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
 * Initializes database by creating tables if needed.
 * Must call this function before any queries to prevent error.
 *
 * @param {beginCallback} bcb - beginCallback to load main window.
 */
function init(bcb) {
  const fk_sql = `PRAGMA foreign_keys=ON`;
  // SQL queries for each table
  const tasks_sql = `CREATE TABLE IF NOT EXISTS tasks (
        task_id TEXT PRIMARY KEY,
        task_name TEXT,
        task_content TEXT,
        creation_date TEXT,
        due_date TEXT,
        priority TEXT,
        expected_time TEXT);`;
  const entries_sql = `CREATE TABLE IF NOT EXISTS entries (
        entry_id TEXT PRIMARY KEY,
        entry_title TEXT,
        entry_content TEXT,
        creation_date TEXT);`;
  const labels_sql = `CREATE TABLE IF NOT EXISTS labels(
        label TEXT PRIMARY KEY);`;
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
        );`;

  // Table creation queries are serialized to ensure key constraints are followed.
  db.serialize(function () {
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
    db.run(
      task_labels_sql,
      [],
      (err) => {
        if (err) throw err;
      },
      bcb,
    );
  });
}

/**
 * Queries and returns all labels.
 * @param {labelRendererCallback} lrcb - the label render callback to update the frontend.
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
 * Queries and returns all tasks.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function getTasks(trcb) {
  const sql = `
    SELECT t.task_id, t.task_name, t.task_content, t.creation_date, t.due_date, t.priority, t.expected_time, GROUP_CONCAT(l.label) as labels
    FROM tasks t
    LEFT JOIN task_labels l ON t.task_id = l.task_id
    GROUP BY t.task_id;
    `;

  db.all(sql, [], (err, rows) => {
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
            labels: row.labels ? row.labels.split(",") : [],
          }))
        : [];

    trcb(tasks);
  });
}

/**
 * Queries and returns all tasks that have ALL labels specified.
 * @param {string[]} labels - an array of labels that each task must contain
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function getTasksConjunctLabels(labels, trcb) {
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
            labels: row.labels ? row.labels.split(",") : [],
          }))
        : [];

    trcb(tasks);
  });
}

/**
 * Queries and returns all tasks that have ANY of the labels specified. If none is provided, then all tasks are returned.
 * @param {string[]} labels - an array of labels; each task must contain AT LEAST one
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function getTasksDisjunctLabels(labels, trcb) {
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
            labels: row.labels ? row.labels.split(",") : [],
          }))
        : [];

    trcb(tasks);
  });
}

/**
 * An object representing the filter criteria for querying tasks.
 * @typedef {Object} filters
 * @property {string} startTime - The start date and time for filtering tasks, in ISO 8601 format (yyyy-mm-ddTHH:MM).
 * @property {string} endTime - The end date and time for filtering tasks, in ISO 8601 format (yyyy-mm-ddTHH:MM).
 * @property {string[]} labels - An array of labels to filter tasks by.
 * @property {string} priority - The priority level to filter tasks by.
 * @property {boolean} exclusive - If true, perform a conjunctive (AND) search on labels, otherwise perform a disjunctive (OR) search.
 */

/**
 * Queries and returns all tasks based on the provided filter criteria.
 * @param {filters} filterCriteria - The filter criteria object.
 * @param {tasksRenderCallback} trcb - The tasks render callback to update the frontend.
 */
function getFilteredTasks(filterCriteria, trcb) {
  const { startTime, endTime, labels, priority, exclusive } = filterCriteria;

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

  // Filter by priority
  if (priority) {
    conditions.push(`t.priority = ?`);
    params.push(priority);
  }

  // Filter by labels
  if (labels.length > 0) {
    const labelPlaceholders = labels.map(() => "?").join(",");
    if (exclusive) {
      conditions.push(`l.label IN (${labelPlaceholders})`);
      params.push(...labels);
    } else {
      conditions.push(`l.label IN (${labelPlaceholders})`);
      params.push(...labels);
    }
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
    } else {
      // Disjunctive (OR) filtering: Ensure the task has at least one of the specified labels
      sql += ` HAVING COUNT(DISTINCT l.label) >= 1`;
    }
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
            labels: row.labels ? row.labels.split(",") : [],
          }))
        : [];

    trcb(tasks);
  });
}

/**
 * Queries and returns all entries.
 * @param {entriesRenderCallback} ercb - the tasks render callback to update the frontend.
 */
function getEntries(ercb) {
  const sql = "SELECT * FROM entries";
  const ret = [];
  db.each(
    sql,
    [],
    (err, row) => {
      if (err) {
        throw err;
      }
      ret.push(row);
    },
    () => {
      ercb(ret);
    },
  );
}

/**
 * Adds a task to the database
 * @param {task} task - the task to add
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function addTask(task, trcb) {
  const taskSql = `INSERT INTO tasks (task_id, task_name, task_content, creation_date, due_date, priority, expected_time)
        VALUES('${task.task_id}', '${task.task_name}', '${task.task_content}', '${task.creation_date}', '${task.due_date}', '${task.priority}', '${task.expected_time}');`;

  const labelSql = `INSERT INTO task_labels (task_id, label) VALUES (?, ?);`;

  db.run(taskSql, [], (err) => {
    if (err) {
      throw err;
    }

    const stmt = db.prepare(labelSql);
    task.labels.forEach((label) => {
      stmt.run([task.task_id, label], (err) => {
        if (err) {
          throw err;
        }
      });
    });
    stmt.finalize();

    this.getTasks(trcb);
  });
}

/**
 * Adds multiple tasks to the database
 * @param {task[]} tasks - the tasks to add
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function addTasks(tasks, trcb) {
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
          task.expected_time,
        ],
        (err) => {
          if (err) {
            throw err;
          }
        },
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
}

/**
 * Adds an entry to the database
 * @param {entry} entry - the entry to add
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 */
function addEntry(entry, ercb) {
  const sql = `INSERT INTO entries (entry_id, entry_title, entry_content, creation_date)
        VALUES('${entry.entry_id}', '${entry.entry_title}', '${entry.entry_content}', '${entry.creation_date}');`;
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    getEntries(ercb);
  });
}

/**
 * Adds a label to the database
 * @param {string} label - the label to add
 * @param {labelRendererCallback} lrcb - the labels render callback to update the frontend.
 */
function addLabel(label, lrcb) {
  const sql = `INSERT INTO labels (label) VALUES (?);`;
  db.run(sql, [label], (err) => {
    if (err) {
      throw err;
    }
    getLabels(lrcb);
  });
}

/**
 * Adds multiple labels to the database
 * @param {string[]} labels - the labels to add
 * @param {labelRendererCallback} lrcb - the labels render callback to update the frontend.
 */
function addLabels(labels, lrcb) {
  const sql = `INSERT INTO labels (label) VALUES (?);`;
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
 * Edits a task in the database
 * @param {task} task - the task to edit. The ID must exist in the database.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function editTask(task, trcb) {
  const sql = `UPDATE tasks SET
            task_name = '${task.task_name}',
            task_content = '${task.task_content}',
            creation_date = '${task.creation_date}',
            due_date = '${task.due_date}',
            priority = '${task.priority}',
            expected_time = '${task.expected_time}'
        WHERE task_id = '${task.task_id}';`;
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    getTasks(trcb);
  });
}

/**
 * Edits an entry in the database
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
    getEntries(ercb);
  });
}

/**
 * Deletes a task in the database
 * @param {string} task_id - the ID of the task to be deleted.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function deleteTask(task_id, trcb) {
  const sql = `DELETE FROM tasks WHERE task_id = '${task_id}'`;
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    getTasks(trcb);
  });
}

/**
 * Deletes tasks in the database
 * @param {string[]} task_ids - the IDs of tasks to be deleted.
 * @param {tasksRenderCallback} trcb - the tasks render callback to update the frontend.
 */
function deleteTasks(task_ids, trcb) {
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
}

/**
 * Deletes an entry in the database
 * @param {string} entry_id - the ID of the entry to be deleted.
 * @param {entriesRenderCallback} ercb - the entries render callback to update the frontend.
 */
function deleteEntry(entry_id, ercb) {
  const sql = `DELETE FROM entries WHERE entry_id = '${entry_id}'`;
  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
    getEntries(ercb);
  });
}

/**
 * Deletes a label from the database
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
 * Deletes multiple labels from the database
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

module.exports = {
  init,
  getTasks,
  getTasksConjunctLabels,
  getTasksDisjunctLabels,
  getFilteredTasks,
  getEntries,
  addTask,
  addTasks,
  addEntry,
  editTask,
  editEntry,
  deleteTask,
  deleteTasks,
  deleteEntry,
  getLabels,
  addLabel,
  addLabels,
  deleteLabel,
  deleteLabels,
};