const testing = require("../scripts/testing");

test("Sanity Testing Part 2", () => {
  expect(testing("test")).toBe("test testing");
});

test("Sanity Testing Part 3", () => {
  expect(testing("test")).toBe("test testing");
});
