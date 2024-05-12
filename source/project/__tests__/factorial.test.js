import { factorial } from "../scripts/factorial";

describe("factorial function", () => {
	it("should return 1 for 0", () => {
		expect(factorial(0)).toBe(1);
	});

	it("should return 1 for 1", () => {
		expect(factorial(1)).toBe(1);
	});

	it("should return the correct factorial for positive integers", () => {
		expect(factorial(5)).toBe(120);
		expect(factorial(10)).toBe(3628800);
	});

	it("should throw an error for negative numbers", () => {
		expect(() => factorial(-1)).toThrow(
			"Input must be a non-negative integer"
		);
	});

	it("should throw an error for non-integer numbers", () => {
		expect(() => factorial(3.5)).toThrow(
			"Input must be a non-negative integer"
		);
	});

	it("should throw an error for non-numeric inputs", () => {
		expect(() => factorial("abc")).toThrow(
			"Input must be a non-negative integer"
		);
	});
});
