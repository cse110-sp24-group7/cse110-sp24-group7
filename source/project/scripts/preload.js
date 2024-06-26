const { contextBridge, ipcRenderer } = require("electron");
const dbMgr = require("./database/dbMgr");
const fileMgr = require("./fileMgr");

const getUserData = () => ipcRenderer.invoke("getUserData");

contextBridge.exposeInMainWorld("path", {
	getUserData: getUserData
});

const init = (bcb) => {
	dbMgr.init(bcb);
};

const connect = (pathToDB, callback) => {
	dbMgr.connect(pathToDB, callback);
};

const getTasks = (trcb) => {
	return dbMgr.getTasks(trcb);
};

function getTasksConjunctLabels(labels, trcb) {
	return this.getTasksConjunctLabels(labels, trcb);
}

function getTasksDisjunctLabels(labels, trcb) {
	return this.getTasksDisjunctLabels(labels, trcb);
}

function getEntries(ercb) {
	return this.getEntries(ercb);
}

const addTask = (task, callback) => {
	return dbMgr.addTask(task, callback);
};

function addTasks(tasks, trcb) {
	return this.addTasks(tasks, trcb);
}

const addEntry = (entry, callback) => {
	return dbMgr.addEntry(entry, callback);
};

const addEntries = (entries, ercb) => {
	return dbMgr.addEntries(entries, ercb);
};

const editTask = (task, trcb) => {
	return dbMgr.editTask(task, trcb);
};

const editEntry = (entry, ercb) => {
	return dbMgr.editEntry(entry, ercb);
};

const deleteTask = (task_id, trcb) => {
	return dbMgr.deleteTask(task_id, trcb);
};

const deleteTasks = (task_ids, trcb) => {
	return dbMgr.deleteTasks(task_ids, trcb);
};

const deleteEntry = (entry_id, ercb) => {
	return dbMgr.deleteEntry(entry_id, ercb);
};

const deleteEntries = (entry_ids, ercb) => {
	return dbMgr.deleteEntries(entry_ids, ercb);
};

const getLabels = (lrcb) => {
	return dbMgr.getLabels(lrcb);
};

const getLabelColorMap = (callback) => {
	return dbMgr.getLabelColorMap(callback);
};

const addLabel = (label, color, lrcb) => {
	return dbMgr.addLabel(label, color, lrcb);
};

const addLabels = (labels, colors, lrcb) => {
	return dbMgr.addLabels(labels, colors, lrcb);
};

const deleteLabel = (label, lrcb) => {
	return dbMgr.deleteLabel(label, lrcb);
};

const deleteLabels = (labels, lrcb) => {
	return dbMgr.deleteLabels(labels, lrcb);
};

const getFilteredTasks = (filterCriteria, trcb) => {
	return dbMgr.getFilteredTasks(filterCriteria, trcb);
};

const getFilteredEntries = (filterCriteria, ercb) => {
	return dbMgr.getFilteredEntries(filterCriteria, ercb);
};

const fetchTask = (task_id, callback) => {
	return dbMgr.fetchTask(task_id, callback);
};

const fetchEntry = (entry_id, callback) => {
	return dbMgr.fetchEntry(entry_id, callback);
};

contextBridge.exposeInMainWorld("api", {
	init,
	connect,
	getTasks,
	getTasksConjunctLabels,
	getTasksDisjunctLabels,
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
	getFilteredTasks,
	getFilteredEntries,
	fetchTask,
	fetchEntry
});

//API for uploading or retrieving files
const fileManager = (data_location) => {
	return fileMgr.FileManager(data_location);
};

contextBridge.exposeInMainWorld("file", {
	fileManager: fileManager
});
