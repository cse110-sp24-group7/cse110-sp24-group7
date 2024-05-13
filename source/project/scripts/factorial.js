/**
 * Calculates the factorial of a non-negative integer.
 *
 * @param {number} n - The non-negative integer to calculate the factorial for.
 * @returns {number} The factorial of the given integer.
 * @throws {Error} If the input is not a non-negative integer.
 * @example
 * // returns 1
 * factorial(0);
 * // returns 6
 * factorial(3);
 */
function factorial(n) {
  if (typeof n !== 'number' || n < 0 || !Number.isInteger(n)) {
    throw new Error('Input must be a non-negative integer');
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export {factorial};
