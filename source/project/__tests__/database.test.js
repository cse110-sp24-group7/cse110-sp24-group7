//import * as dbMgr from '../scripts/database/dbMgr';
const dbMgr = require("../scripts/database/dbMgr");

describe("Database functions", () => {
	let taskLength = 0;
	let labelLength = 0;
	let entryLength = 0;

	// Define test tasks
	let test1 = {
		task_id: "test1_test",
		task_name: "test1_name",
		task_content: "test1_content",
		creation_date: "today",
		due_date: "1900-01-01T23:20",
		priority: "P1_test",
		expected_time: "3 hours",
		labels: ["test_label_1", "test_label_2"]
	};

	let test2 = {
		task_id: "test2_test",
		task_name: "test2_name",
		task_content: "test2_content",
		creation_date: "today",
		due_date: "1900-01-02T23:20",
		priority: "P2_test",
		expected_time: "3 hours",
		labels: ["test_label_2", "test_label_3"]
	};

	let test3 = {
		task_id: "test3_test",
		task_name: "test3_name",
		task_content: "test3_content",
		creation_date: "today",
		due_date: "1900-01-03T23:20",
		priority: "P3_test",
		expected_time: "3 hours",
		labels: ["test_label_1", "test_label_2", "test_label_3"]
	};

	// Define test entries
	let entry1 = {
		entry_id: "entry1_test",
		entry_title: "entry1_title",
		entry_content: "entry1_content",
		creation_date: "1900-01-01T23:20",
		labels: ["test_label_1", "test_label_2"]
	};

	let entry2 = {
		entry_id: "entry2_test",
		entry_title: "entry2_title",
		entry_content: "entry2_content",
		creation_date: "1900-01-02T23:20",
		labels: ["test_label_2", "test_label_3"]
	};

	let entry3 = {
		entry_id: "entry3_test",
		entry_title: "entry3_title",
		entry_content: "entry3_content",
		creation_date: "1900-01-03T23:20",
		labels: ["test_label_1", "test_label_2", "test_label_3"]
	};

	test("Connecting to database", (done) => {
		dbMgr.connect("", () => {
			done();
		});
	});

	test("Initializing tables", (done) => {
		dbMgr.init(() => {
			done();
		});
	});

	test("Get tasks table length", (done) => {
		function trcbLengthTest(tasks) {
			taskLength = tasks.length;
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

	test("Get entries table length", (done) => {
		function ercbLengthTest(entries) {
			entryLength = entries.length;
			done();
		}
		dbMgr.getEntries(ercbLengthTest);
	});

	test("Testing addLabel", (done) => {
		function lrcbAddLabel(labels) {
			expect(labels.length).toBe(labelLength + 1);
			done();
		}
		dbMgr.addLabel("test_label_1", "#ff0000", lrcbAddLabel);
	});

	test("Testing addLabels", (done) => {
		function lrcbAddLabels(labels) {
			expect(labels.length).toBe(labelLength + 3);
			done();
		}
		dbMgr.addLabels(
			["test_label_2", "test_label_3"],
			["#00ff00", "#0000ff"],
			lrcbAddLabels
		);
	});

	test("Testing getLabelColorMap", (done) => {
		function callback(labelColorMap) {
			expect(labelColorMap.get("test_label_1")).toBe("#ff0000");
			expect(labelColorMap.get("test_label_2")).toBe("#00ff00");
			expect(labelColorMap.get("test_label_3")).toBe("#0000ff");
			done();
		}
		dbMgr.getLabelColorMap(callback);
	});

	test("Testing addTask", (done) => {
		function trcbAddTest(tasks) {
			expect(tasks.length).toBe(taskLength + 1);
			done();
		}
		dbMgr.addTask(test1, () => {
			dbMgr.getTasks(trcbAddTest);
		});
	});

	test("Testing addTasks", (done) => {
		function trcbAddTests(tasks) {
			expect(tasks.length).toBe(taskLength + 3);
			done();
		}
		dbMgr.addTasks([test2, test3], trcbAddTests);
	});

	test("Testing addEntry", (done) => {
		function ercbAddTest(entries) {
			expect(entries.length).toBe(entryLength + 1);
			done();
		}
		dbMgr.addEntry(entry1, () => {
			dbMgr.getEntries(ercbAddTest);
		});
	});

	test("Testing addEntries", (done) => {
		function ercbAddTests(entries) {
			expect(entries.length).toBe(entryLength + 3);
			done();
		}
		dbMgr.addEntries([entry2, entry3], ercbAddTests);
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

	test("Testing editEntry", (done) => {
		function ercbEditTest(entries) {
			for (let i = 0; i < entries.length; i++) {
				if (entries[i].entry_id === entry1.entry_id) {
					expect(entries[i].entry_content).toBe(entry1.entry_content);
				}
			}
			done();
		}
		entry1.entry_content = "entry1_updated_content";
		dbMgr.editEntry(entry1, ercbEditTest);
	});

	test("Testing conjunctive label search", (done) => {
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

	test("Testing disjunctive label search", (done) => {
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
			priorities: [],
			exclusive: false
		};

		function trcbFilteredTest(tasks) {
			expect(tasks.length).toBe(2);
			let task_ids = tasks.map((task) => task.task_id);
			expect(task_ids.sort()).toEqual(
				[test1.task_id, test2.task_id].sort()
			);
			done();
		}

		dbMgr.getFilteredTasks(filters, trcbFilteredTest);
	});

	test("Testing getFilteredTasks with priorities", (done) => {
		const filters = {
			startTime: "",
			endTime: "",
			labels: [],
			priorities: ["P1_test", "P3_test"],
			exclusive: false
		};

		function trcbFilteredTest(tasks) {
			expect(tasks.length).toBe(2);
			let task_ids = tasks.map((task) => task.task_id);
			expect(task_ids.sort()).toEqual(
				[test1.task_id, test3.task_id].sort()
			);
			done();
		}

		dbMgr.getFilteredTasks(filters, trcbFilteredTest);
	});

	test("Testing getFilteredTasks with disjunctive labels", (done) => {
		const filters = {
			startTime: "",
			endTime: "",
			labels: ["test_label_1", "test_label_3"],
			priorities: [],
			exclusive: false
		};

		function trcbFilteredTest(tasks) {
			expect(tasks.length).toBe(3);
			let task_ids = tasks.map((task) => task.task_id);
			expect(task_ids.sort()).toEqual(
				[test1.task_id, test2.task_id, test3.task_id].sort()
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
			priorities: [],
			exclusive: true
		};

		function trcbFilteredTest(tasks) {
			expect(tasks.length).toBe(2);
			let task_ids = tasks.map((task) => task.task_id);
			expect(task_ids.sort()).toEqual(
				[test1.task_id, test3.task_id].sort()
			);
			done();
		}

		dbMgr.getFilteredTasks(filters, trcbFilteredTest);
	});

	test("Testing getFilteredTasks with labels and priorities", (done) => {
		const filters = {
			startTime: "",
			endTime: "",
			labels: ["test_label_2"],
			priorities: ["P2_test"],
			exclusive: false
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
			priorities: [],
			exclusive: false
		};

		function trcbFilteredTest(tasks) {
			expect(tasks.length).toBe(2);
			let task_ids = tasks.map((task) => task.task_id);
			expect(task_ids.sort()).toEqual(
				[test1.task_id, test2.task_id].sort()
			);
			done();
		}

		dbMgr.getFilteredTasks(filters, trcbFilteredTest);
	});

	test("Testing getFilteredEntries with time range", (done) => {
		const filters = {
			startTime: "1900-01-01T00:00",
			endTime: "1900-01-02T23:59",
			labels: [],
			exclusive: false
		};

		function ercbFilteredTest(entries) {
			expect(entries.length).toBe(2);
			let entry_ids = entries.map((entry) => entry.entry_id);
			expect(entry_ids.sort()).toEqual(
				[entry1.entry_id, entry2.entry_id].sort()
			);
			done();
		}

		dbMgr.getFilteredEntries(filters, ercbFilteredTest);
	});

	test("Testing getFilteredEntries with disjunctive labels", (done) => {
		const filters = {
			startTime: "",
			endTime: "",
			labels: ["test_label_1", "test_label_3"],
			exclusive: false
		};

		function ercbFilteredTest(entries) {
			expect(entries.length).toBe(3);
			let entry_ids = entries.map((entry) => entry.entry_id);
			expect(entry_ids.sort()).toEqual(
				[entry1.entry_id, entry2.entry_id, entry3.entry_id].sort()
			);
			done();
		}

		dbMgr.getFilteredEntries(filters, ercbFilteredTest);
	});

	test("Testing getFilteredEntries with conjunctive labels", (done) => {
		const filters = {
			startTime: "",
			endTime: "",
			labels: ["test_label_1", "test_label_2"],
			exclusive: true
		};

		function ercbFilteredTest(entries) {
			expect(entries.length).toBe(2);
			let entry_ids = entries.map((entry) => entry.entry_id);
			expect(entry_ids.sort()).toEqual(
				[entry1.entry_id, entry3.entry_id].sort()
			);
			done();
		}

		dbMgr.getFilteredEntries(filters, ercbFilteredTest);
	});

	test("Testing deleteTask", (done) => {
		function trcbDeleteTest(tasks) {
			expect(tasks.length).toBe(taskLength + 2);
			done();
		}
		dbMgr.deleteTask(test1.task_id, trcbDeleteTest);
	});

	test("Testing deleteTasks", (done) => {
		function trcbDeleteTests(tasks) {
			expect(tasks.length).toBe(taskLength);
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

	test("Testing deleteEntry", (done) => {
		function ercbDeleteTest(entries) {
			expect(entries.length).toBe(entryLength + 2);
			done();
		}
		dbMgr.deleteEntry(entry1.entry_id, ercbDeleteTest);
	});

	test("Testing deleteEntries", (done) => {
		function ercbDeleteTests(entries) {
			expect(entries.length).toBe(entryLength);
			done();
		}
		dbMgr.deleteEntries(
			[entry2.entry_id, entry3.entry_id],
			ercbDeleteTests
		);
	});
});
