//import * as dbMgr from '../scripts/database/dbMgr';
const dbMgr = require("../scripts/database/dbMgr");

describe('Database functions', () => {
  let dbLength = 0;
  let labelLength = 0;

  let test1 = {};
  test1.task_id = "test1_test";
  test1.task_name = "test1_name";
  test1.task_content = "test1_content";
  test1.creation_date = "today";
  test1.due_date = "1900-01-01T23:20";
  test1.priority = "P1_test";
  test1.expected_time = "3 hours";
  test1.labels = ["test_label_1", "test_label_2"];

  let test2 = {};
  test2.task_id = "test2_test";
  test2.task_name = "test2_name";
  test2.task_content = "test2_content";
  test2.creation_date = "today";
  test2.due_date = "1900-01-02T23:20";
  test2.priority = "P2_test";
  test2.expected_time = "3 hours";
  test2.labels = ["test_label_2", "test_label_3"];

  let test3 = {};
  test3.task_id = "test3_test";
  test3.task_name = "test3_name";
  test3.task_content = "test3_content";
  test3.creation_date = "today";
  test3.due_date = "1900-01-03T23:20";
  test3.priority = "P3_test";
  test3.expected_time = "3 hours";
  test3.labels = ["test_label_1", "test_label_2", "test_label_3"];

  test("Initializing tables", (done) => {
    dbMgr.init(() => {
      done();
    });
  });

  test('Get table length', done => {
    function trcbLengthTest(tasks) {
      dbLength = tasks.length;
      done();
    }
    dbMgr.getTasks(trcbLengthTest);
  });

  test("Get labels table length", (done) => {
    function lrcbLengthTest(labels) {
      labelLength = labels.length;
      done();
    }
    dbMgr.getLabels(lrcbLengthTest);
  });

  test("Testing addLabel", (done) => {
    function lrcbAddLabel(labels) {
      expect(labels.length).toBe(labelLength + 1);
      done();
    }
    dbMgr.addLabel("test_label_1", lrcbAddLabel);
  });

  test("Testing addLabels", (done) => {
    function lrcbAddLabels(labels) {
      expect(labels.length).toBe(labelLength + 3);
      done();
    }
    dbMgr.addLabels(["test_label_2", "test_label_3"], lrcbAddLabels);
  });

	test("Testing addTask", (done) => {
		function trcbAddTest(tasks) {
			expect(tasks.length).toBe(dbLength + 1);
			done();
		}
		dbMgr.addTask(test1, trcbAddTest);
	});

  test("Testing addTasks", (done) => {
    function trcbAddTests(tasks) {
      expect(tasks.length).toBe(dbLength + 3);
      done();
    }
    dbMgr.addTasks([test2, test3], trcbAddTests);
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
		dbMgr.editTask(test1, trcbEditTest);
	});

  test('Testing conjunctive label search', done => {
    function trcbConjunctiveTest(tasks) {
      expect(tasks.length).toBe(2);

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
		dbMgr.getTasksConjunctLabels(
			["test_label_1", "test_label_2"],
			trcbConjunctiveTest
		);
	});

  test('Testing disjunctive label search', done => {
    function trcbDisjunctiveTest(tasks) {
      expect(tasks.length).toBe(3);

			let task_ids = [
				tasks[0].task_id,
				tasks[1].task_id,
				tasks[2].task_id
			];
			expect(task_ids.sort()).toEqual(
				[test1.task_id, test2.task_id, test3.task_id].sort()
			);

			done();
		}
		dbMgr.getTasksDisjunctLabels(["test_label_2"], trcbDisjunctiveTest);
	});

  test("Testing getFilteredTasks with time range", (done) => {
    const filters = {
      startTime: "1900-01-01T00:00",
      endTime: "1900-01-02T23:59",
      labels: [],
      priority: "",
      exclusive: false,
    };

    function trcbFilteredTest(tasks) {
      expect(tasks.length).toBe(2);
      let task_ids = tasks.map(task => task.task_id);
      expect(task_ids.sort()).toEqual(
        [test1.task_id, test2.task_id].sort(),
      );
      done();
    }

    dbMgr.getFilteredTasks(filters, trcbFilteredTest);
  });

  test("Testing getFilteredTasks with priority", (done) => {
    const filters = {
      startTime: "",
      endTime: "",
      labels: [],
      priority: "P1_test",
      exclusive: false,
    };

    function trcbFilteredTest(tasks) {
      expect(tasks.length).toBe(1);
      expect(tasks[0].task_id).toBe(test1.task_id);
      done();
    }

    dbMgr.getFilteredTasks(filters, trcbFilteredTest);
  });

  test("Testing getFilteredTasks with disjunctive labels", (done) => {
    const filters = {
      startTime: "",
      endTime: "",
      labels: ["test_label_2"],
      priority: "",
      exclusive: false,
    };

    function trcbFilteredTest(tasks) {
      expect(tasks.length).toBe(3);
      let task_ids = tasks.map(task => task.task_id);
      expect(task_ids.sort()).toEqual(
        [test1.task_id, test2.task_id, test3.task_id].sort(),
      );
      done();
    }

    dbMgr.getFilteredTasks(filters, trcbFilteredTest);
  });

  test("Testing getFilteredTasks with conjunctive labels", (done) => {
    const filters = {
      startTime: "",
      endTime: "",
      labels: ["test_label_1", "test_label_2"],
      priority: "",
      exclusive: true,
    };

    function trcbFilteredTest(tasks) {
      expect(tasks.length).toBe(2);
      let task_ids = tasks.map(task => task.task_id);
      expect(task_ids.sort()).toEqual(
        [test1.task_id, test3.task_id].sort(),
      );
      done();
    }

    dbMgr.getFilteredTasks(filters, trcbFilteredTest);
  });

  test("Testing getFilteredTasks with labels and priority", (done) => {
    const filters = {
      startTime: "",
      endTime: "",
      labels: ["test_label_2"],
      priority: "P2_test",
      exclusive: false,
    };

    function trcbFilteredTest(tasks) {
      expect(tasks.length).toBe(1);
      expect(tasks[0].task_id).toBe(test2.task_id);
      done();
    }

    dbMgr.getFilteredTasks(filters, trcbFilteredTest);
  });

  test("Testing getFilteredTasks with time range", (done) => {
    const filters = {
      startTime: "1900-01-01T00:00",
      endTime: "1900-01-02T23:59",
      labels: [],
      priority: "",
      exclusive: false,
    };

    function trcbFilteredTest(tasks) {
      expect(tasks.length).toBe(2);
      let task_ids = tasks.map(task => task.task_id);
      expect(task_ids.sort()).toEqual(
        [test1.task_id, test2.task_id].sort(),
      );
      done();
    }

    dbMgr.getFilteredTasks(filters, trcbFilteredTest);
  });

  test('Testing deleteTask', (done) => {
    function trcbDeleteTest(tasks) {
      expect(tasks.length).toBe(dbLength + 2);
      done();
    }
    dbMgr.deleteTask(test1.task_id, trcbDeleteTest);
  });

  test('Testing deleteTasks', (done) => {
    function trcbDeleteTests(tasks) {
      expect(tasks.length).toBe(dbLength);
      done();
    }
    dbMgr.deleteTasks([test2.task_id, test3.task_id], trcbDeleteTests);
  });

  test("Testing deleteLabel", (done) => {
    function lrcbDeleteLabel(labels) {
      expect(labels.length).toBe(labelLength + 2);
      done();
    }
    dbMgr.deleteLabel("test_label_1", lrcbDeleteLabel);
  });

  test("Testing deleteLabels", (done) => {
    function lrcbDeleteLabels(labels) {
      expect(labels.length).toBe(labelLength);
      done();
    }
    dbMgr.deleteLabels(["test_label_2", "test_label_3"], lrcbDeleteLabels);
  });
});
