const ExpressError = require('./expressError');

/**
 * Parses a comma-separated string of numbers from a query parameter.
 * It validates for empty input and non-numeric values, throwing an ExpressError.
 * @param {string} numsStr - The comma-separated string of numbers.
 * @returns {number[]} An array of numbers.
 */
const parseNums = (numsStr) => {
    if (!numsStr) {
        throw new ExpressError("nums are required.", 400);
    }
    const nums = numsStr.split(',').map(n => Number(n));
    if (nums.some(isNaN)) {
        const invalidNum = numsStr.split(',').find(n => isNaN(Number(n)));
        throw new ExpressError(`${invalidNum} is not a number.`, 400);
    }
    return nums;
};

/**
 * Calculates the mean (average) of an array of numbers.
 * @param {number[]} numbers - An array of numbers.
 * @returns {number} The mean.
 */
const mean = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
};

/**
 * Calculates the median (midpoint) of an array of numbers.
 * @param {number[]} numbers - An array of numbers.
 * @returns {number} The median.
 */
const median = (numbers) => {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
        return sorted[mid];
    } else {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
};

/**
 * Calculates the mode (most frequent number) of an array of numbers.
 * Returns an array for multiple modes, or an empty array if all numbers are unique.
 * @param {number[]} numbers - An array of numbers.
 * @returns {number[]} An array containing the mode(s).
 */
const mode = (numbers) => {
    if (numbers.length === 0) return [];
    const counts = {};
    numbers.forEach(n => counts[n] = (counts[n] || 0) + 1);
    let maxCount = 0;
    let modes = [];
    for (const key in counts) {
        if (counts[key] > maxCount) {
            maxCount = counts[key];
            modes = [Number(key)];
        } else if (counts[key] === maxCount) {
            modes.push(Number(key));
        }
    }
    // If every number appears once, there is no mode.
    if (maxCount === 1 && numbers.length > 1) {
        return [];
    }
    return modes.sort((a, b) => a - b);
};

module.exports = {
    parseNums,
    mean,
    median,
    mode
};
