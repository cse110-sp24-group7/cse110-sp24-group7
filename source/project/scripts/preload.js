const { contextBridge } = require('electron');
const dbMgr = require('./database/dbMgr');

const init = bcb => {
  dbMgr.init(bcb);
};

const getTasks = trcb => {
  return dbMgr.getTasks(trcb);
};

const getTasksConjunctLabels = (labels, trcb) => {
  return dbMgr.getTasksConjunctLabels(labels, trcb);
};

const getTasksDisjunctLabels = (labels, trcb) => {
  return dbMgr.getTasksDisjunctLabels(labels, trcb);
};

const getEntries = ercb => {
  return dbMgr.getEntries(ercb);
};

const addTask = (task, callback) => {
  return dbMgr.addTask(task, callback);
};

const addTasks = (tasks, trcb) => {
  return dbMgr.addTasks(tasks, trcb);
};

const addEntry = (entry, ercb) => {
  return dbMgr.addEntry(entry, ercb);
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

const getLabels = lrcb => {
  return dbMgr.getLabels(lrcb);
};

const addLabel = (label, lrcb) => {
  return dbMgr.addLabel(label, lrcb);
};

const addLabels = (labels, lrcb) => {
  return dbMgr.addLabels(labels, lrcb);
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

contextBridge.exposeInMainWorld('api', {
  init,
  getTasks,
  getTasksConjunctLabels,
  getTasksDisjunctLabels,
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
  getFilteredTasks,
});