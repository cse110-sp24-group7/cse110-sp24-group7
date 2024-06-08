/**
 * @module Renderer
 * @description This module is responsible for rendering the app and handling launching the app window and loading the app.
 */
/* eslint-disable no-unused-vars */
const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
const journals = JSON.parse(localStorage.getItem("journalData") || "[]");
