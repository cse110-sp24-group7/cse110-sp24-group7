//***To run the test: $ npx playwright test source/project/__tests__/playwright/mainview.test.js

const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');

const dbMgr = require('../../scripts/database/dbMgr');

test('should open and interact with the TaskPopup and JournalPopup', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const window = await electronApp.firstWindow();
  const userDataPath = await electronApp.evaluate(async ({app}) => app.getPath("userData"));
  await new Promise(resolve => {
    dbMgr.connect(userDataPath, () => {
      dbMgr.init(() => {
        resolve();
      });
    });
  });

  // Get tasks length
  const tasksLength = await new Promise(resolve => {
    dbMgr.getTasks((tasks) => {
      resolve(tasks ? tasks.length : 0);
    });
  });

  // Open the TaskPopup
  await window.click('.add-task');

  // Interact with the TaskPopup
  await window.fill('task-popup #title', 'Test Task');
  await window.fill('task-popup #description', 'Test Description');
  await window.fill('task-popup #dueDate', '2024-06-08T01:30');
  await window.selectOption('task-popup #priority', 'P1');
  await window.fill('task-popup #expectedTime', '2');

  await window.waitForTimeout(200);
  // Submit the form
  const submitButton = await window.$('task-popup #addBtn');
  await submitButton.click();

  await window.waitForTimeout(200);
  // Verify form submission
  const tasks = await new Promise(resolve => {
    dbMgr.getTasks( (tasks) => {
        expect(tasks.length).toBe(tasksLength + 1);
        resolve(tasks);
    });
  });

  expect(tasks.length).toBeGreaterThanOrEqual(1); // Ensure at least one task is present
  const addedTask = tasks.find(task => task.task_name === 'Test Task');
  await window.waitForTimeout(1000);
  expect(addedTask).toBeTruthy();
  expect(addedTask.task_content).toBe('Test Description');
  expect(addedTask.priority).toBe('P1');
  expect(addedTask.expected_time).toBe('2');
  expect(addedTask.due_date).toBe('2024-06-08T01:30');


  // Open the JournalPopup
  await window.click('.add-journal');
//   const journalPopup = await window.$('journal-popup');
//   expect(await journalPopup.isVisible()).toBeTruthy();

  // Interact with the JournalPopup
  await window.fill('journal-popup #title', 'Test Journal');
  await window.fill('journal-popup #description', 'Test Journal Description');
  await window.fill('journal-popup #dueDate', '2024-06-08T01:30');

  // Ensure the add button is interactable and click it
  const addButton = await window.$('journal-popup #addBtn');
  // await expect(addButton).toBeEnabled();
  await addButton.click();

  // Verify form submission

  const journals = await new Promise(resolve => {
    dbMgr.getEntries(entries => {
        resolve(entries);
    });
  });


  expect(journals.length).toBeGreaterThanOrEqual(1); // Ensure at least one journal entry is present
  const addedJournal = journals.find(journal => journal.entry_title === 'Test Journal');
  expect(addedJournal).toBeTruthy();
  expect(addedJournal.entry_content).toBe('Test Journal Description');
  expect(addedJournal.creation_date).toBe('2024-06-08T01:30');

  await electronApp.close();
});