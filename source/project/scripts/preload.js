// import { contextBridge } from 'electron';
// import * as dbMgr from './database/dbMgr.js';

const {contextBridge, ipcRenderer } = require("electron");
const { DatabaseManager } = require("./database/dbMgr.js");
const fs = require("fs");
const path = require("path");

const getPath = () => ipcRenderer.invoke('getPath');

contextBridge.exposeInMainWorld("path", {
  getPath: getPath,
});

/* let db = await window.path.getPath()
.then((appDataPath) => {
  let manager = window.api.dbManager(appDataPath, () => {});
  return manager;
})

  window.api.getTasks((tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasksRendererCallback(tasks);
  }); */

/*   console.log(path.resolve(__dirname, '..', 'data', 'data.db'));
  if (fs.existsSync(path.resolve(__dirname, '..', 'data', 'data.db'))) {
    console.log("file exists!");

    fs.readFile(path.resolve(__dirname, '..', 'data', 'data.db'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
  } else {
    console.log("file does not exist!");
  } */

const dbManager = (pathToDB, bcb) => {
  let manager = DatabaseManager(pathToDB);
  manager.init(bcb);

  if (fs.existsSync(path.resolve(pathToDB, 'data.db'))) {
    console.log("file exists!");

    fs.readFile(path.resolve(pathToDB, 'data.db'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
  } else {
    console.log("file does not exist!");
  }
  
  return manager;
}

function init(bcb) {
  console.log("INITIALIZE")
  this.init(bcb);
};

function getTasks(trcb) {
  console.log("GET TASKS")
  return this.getTasks(trcb);
};

function getTasksConjunctLabels(labels, trcb) {
  return this.getTasksConjunctLabels(labels, trcb);
};

function getTasksDisjunctLabels(labels, trcb) {
  return this.getTasksDisjunctLabels(labels, trcb);
};

function getEntries(ercb) {
  return this.getEntries(ercb);
};

function addTask(task, trcb) {
  return this.addTask(task, trcb);
};

function addTasks(tasks, trcb) {
  return this.addTasks(tasks, trcb);
};

function addEntry(entry, ercb) {
  return this.addEntry(entry, ercb);
};

function editTask(task, trcb) {
  return this.editTask(task, trcb);
};

function editEntry(entry, ercb) {
  return this.editEntry(entry, ercb);
};

function deleteTask(task_id, trcb) {
  return this.deleteTask(task_id, trcb);
};

function deleteTasks(task_ids, trcb) {
  return this.deleteTasks(task_ids, trcb);
};

function deleteEntry(entry_id, ercb) {
  return this.deleteEntry(entry_id, ercb);
};

contextBridge.exposeInMainWorld("api", {
  dbManager: dbManager,
  init: init,
  getTasks: getTasks,
  getTasksConjunctLabels: getTasksConjunctLabels,
  getTasksDisjunctLabels: getTasksDisjunctLabels,
  getEntries: getEntries,
  addTask: addTask,
  addTasks: addTasks,
  addEntry: addEntry,
  editTask: editTask,
  editEntry: editEntry,
  deleteTask: deleteTask,
  deleteTasks: deleteTasks,
  deleteEntry: deleteEntry,
});