const { contextBridge } = require('electron');
const dbMgr = require('./database/dbMgr');

const init = () => {
    dbMgr.init();
}

const getTasks = (trcb) => {
    return dbMgr.getTasks(trcb);
}

const getEntries = (ercb) => {
    return dbMgr.getEntries(ercb);
}

const addTask = (task, trcb) => {
    return dbMgr.addTask(task, trcb);
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

const deleteEntry = (entry_id, ercb) => {
    return dbMgr.deleteEntry(entry_id, ercb);
}

contextBridge.exposeInMainWorld("api", {
    init: init,
    getTasks: getTasks,
    getEntries: getEntries,
    addTask: addTask,
    addEntry: addEntry,
    editTask: editTask,
    editEntry: editEntry,
    deleteTask: deleteTask,
    deleteEntry: deleteEntry
})