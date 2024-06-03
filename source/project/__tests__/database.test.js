//import * as dbMgr from '../scripts/database/dbMgr';
const dbMgr = require("../scripts/database/dbMgr");
const path = require('path');

describe("Database functions", () => {
  let dbLength = 0;

  let test1 = {};
  test1.task_id = "test1";
  test1.task_name = "test1_name";
  test1.task_content = "test1_content";
  test1.creation_date = "today";
  test1.due_date = "tomorrow";
  test1.priority = "moderate";
  test1.expected_time = "3 hours";
  test1.labels = ["test_label_1", "test_label_2"];

  let test2 = {};
  test2.task_id = "test2";
  test2.task_name = "test2_name";
  test2.task_content = "test2_content";
  test2.creation_date = "today";
  test2.due_date = "tomorrow";
  test2.priority = "moderate";
  test2.expected_time = "3 hours";
  test2.labels = ["test_label_2", "test_label_3"];

  let test3 = {};
  test3.task_id = "test3";
  test3.task_name = "test3_name";
  test3.task_content = "test3_content";
  test3.creation_date = "today";
  test3.due_date = "tomorrow";
  test3.priority = "moderate";
  test3.expected_time = "3 hours";
  test3.labels = ["test_label_1", "test_label_2", "test_label_3"];

  let manager = dbMgr.DatabaseManager(path.resolve(__dirname, '..', 'data'));

  test("Initializing tables", async () => {
    manager.init();
    // This is a hack to ensure that tables are initialized properly as there's no callbacks for initialization.
    await new Promise((r) => setTimeout(r, 4000));
  });

  test("Get table length", (done) => {
    function trcbLengthTest(tasks) {
      dbLength = tasks.length;
      done();
    }
    manager.getTasks(trcbLengthTest);
  });

  test("Testing addTask", (done) => {
    function trcbAddTest(tasks) {
      expect(tasks.length).toBe(dbLength + 1);
      done();
    }
    manager.addTask(test1, trcbAddTest);
  });

  test("Testing addTasks", (done) => {
    function trcbAddsTest(tasks) {
      expect(tasks.length).toBe(dbLength + 3);
      done();
    }
    manager.addTasks([test2, test3], trcbAddsTest);
  });

  test("Testing editTask", (done) => {
    function trcbEditTest(tasks) {
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task_id == test1.task_id) {
          expect(tasks[i].task_content).toBe(test1.task_content);
        }
      }
      done();
    }
    test1.task_content = "test1_updated_content";
    manager.editTask(test1, trcbEditTest);
  });

  test("Testing conjunctive label search", (done) => {
    function trcbConjunctiveTest(tasks) {
      expect(tasks.length).toBe(2); // Only two tasks should have the two tags

      let idMatch = false;
      if (
        tasks[0].task_id == test1.task_id &&
        tasks[1].task_id == test3.task_id
      ) {
        idMatch = true;
      }
      if (
        tasks[0].task_id == test3.task_id &&
        tasks[1].task_id == test1.task_id
      ) {
        idMatch = true;
      }
      expect(idMatch).toBe(true);
      done();
    }
    manager.getTasksConjunctLabels(
      ["test_label_1", "test_label_2"],
      trcbConjunctiveTest,
    );
  });

  test("Testing disjunctive label search", (done) => {
    function trcbDisjunctiveTest(tasks) {
      expect(tasks.length).toBe(3); // All three tasks should have label

      let task_ids = [tasks[0].task_id, tasks[1].task_id, tasks[2].task_id];
      expect(task_ids.sort()).toEqual(
        [test1.task_id, test2.task_id, test3.task_id].sort(),
      );

      done();
    }
    manager.getTasksDisjunctLabels(["test_label_2"], trcbDisjunctiveTest);
  });

  test("Testing deleteTask", (done) => {
    function trcbDeleteTest(tasks) {
      expect(tasks.length).toBe(dbLength + 2);
      done();
    }
    manager.deleteTask(test1.task_id, trcbDeleteTest);
  });

  test("Testing deleteTasks", (done) => {
    function trcbDeletesTest(tasks) {
      expect(tasks.length).toBe(dbLength);
      done();
    }
    manager.deleteTasks([test2.task_id, test3.task_id], trcbDeletesTest);
  });
});