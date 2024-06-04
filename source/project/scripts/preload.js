// import { contextBridge } from 'electron';
// import * as dbMgr from './database/dbMgr.js';

const {contextBridge, ipcRenderer } = require("electron");
const { DatabaseManager } = require("./database/dbMgr.js");
const { FileManager } = require('./fileMgr.js');

//API for getting user data path
const getPath = () => ipcRenderer.invoke('getPath');

contextBridge.exposeInMainWorld("path", {
  getPath: getPath,
});

//API for interacting with database
const dbManager = (pathToDB, bcb) => {
  let manager = DatabaseManager(pathToDB);
  manager.init(bcb);
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

//API for uploading or retrieving files
const fileManager = (data_location) => {
  return FileManager(data_location);
}

/* const getFiles = cb => {
  return fileManager.getFiles(cb);
}

const getFile = (file_name, cb) => {
  return fileManager.getFile(file_name, cb);
}

const addFile = (file, cb) => {
  return fileManager.addFile(file, cb);
}

const deleteFile = (file_name, cb) => {
  return fileManager.deleteFile(file_name, cb);
} */

contextBridge.exposeInMainWorld("file", {
  fileManager: fileManager,
/*   getFiles: getFiles,
  getFile: getFile,
  addFile: addFile,
  deleteFile: deleteFile, */
});