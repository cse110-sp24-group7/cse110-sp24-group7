// import { contextBridge } from 'electron';
// import * as dbMgr from './database/dbMgr.js';

const { contextBridge } = require('electron');
const dbMgr = require("./database/dbMgr");

const init = (bcb) => {
    dbMgr.init(bcb);
}

const getTasks = (trcb) => {
    return dbMgr.getTasks(trcb);
}

const getTasksConjunctLabels = (labels, trcb) => {
    return dbMgr.getTasksConjunctLabels(labels, trcb);
}

const getTasksDisjunctLabels = (labels, trcb) => {
    return dbMgr.getTasksDisjunctLabels(labels, trcb);
}

const getEntries = (ercb) => {
    return dbMgr.getEntries(ercb);
}

const addTask = (task, trcb) => {
    return dbMgr.addTask(task, trcb);
}

const addTasks = (tasks, trcb) => {
    return dbMgr.addTasks(tasks, trcb);
}

const addEntry = (entry, ercb) => {
    return dbMgr.addEntry(entry, ercb);
}

const editTask = (task, trcb) => {
    return dbMgr.editTask(task, trcb);
}

const editEntry = (entry, ercb) => {
    return dbMgr.editEntry(entry, ercb);
}

const deleteTask = (task_id, trcb) => {
    return dbMgr.deleteTask(task_id, trcb);
}

const deleteTasks = (task_ids, trcb) => {
    return dbMgr.deleteTasks(task_ids, trcb);
}

const deleteEntry = (entry_id, ercb) => {
    return dbMgr.deleteEntry(entry_id, ercb);
}

contextBridge.exposeInMainWorld("api", {
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
    deleteEntry: deleteEntry
});