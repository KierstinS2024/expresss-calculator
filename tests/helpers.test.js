//  tests/helpers.test.js
const { mean, median, mode } = require("../helpers");

describe("helpers", () => {
  test("mean works", () => {
    expect(mean([1, 2, 3])).toBe(2);
  });

  test("median works with odd length", () => {
    expect(median([1, 3, 5])).toBe(3);
  });

  test("median works with even length", () => {
    expect(median([1, 3, 5, 7])).toBe(4);
  });

  // Corrected test for single mode - now expects an array
  test("mode works with single mode", () => {
    expect(mode([1, 2, 2, 3])).toEqual([2]);
  });

  // Corrected test for multiple modes - expects an array
  test("mode works with multiple modes", () => {
    expect(mode([1, 1, 2, 2, 3])).toEqual([1, 2]);
  });

  // New test for when there is no mode
  test("mode returns an empty array when there is no mode", () => {
    expect(mode([1, 2, 3])).toEqual([]);
  });
});
