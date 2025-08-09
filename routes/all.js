const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');
const { mean, median, mode, parseNums } = require('../helpers');
const ExpressError = require('../expressError');

// Path to the data file
const DATA_FILE = path.join(__dirname, '../data/results.json');

/**
 * A reusable function to save results to a file.
 * It uses async/await to prevent blocking the server.
 */
async function saveResult(operation, value) {
    let results = [];
    const resultToSave = { operation, value, timestamp: new Date().toISOString() };
    
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        results = JSON.parse(data);
    } catch (readErr) {
        // If file doesn't exist or is empty, we create a new one.
        if (readErr.code !== 'ENOENT') {
            console.error('Error reading results.json:', readErr);
        }
    }

    results.push(resultToSave);
    await fs.writeFile(DATA_FILE, JSON.stringify(results, null, 2));
}

/**
 * A reusable function to handle the response based on the accept header.
 * It generates a simple HTML or JSON response.
 */
function handleResponse(req, res, operation, value) {
    const response = { operation, value };
    
    if (req.accepts('html')) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>${operation}</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
                    <h1 class="text-2xl font-bold mb-4">${operation.toUpperCase()}</h1>
                    <p class="text-lg">Value: <span class="font-semibold text-green-600">${Array.isArray(value) ? value.join(', ') : value}</span></p>
                </div>
            </body>
            </html>
        `);
    }
    
    return res.json(response);
}

// Route for mean calculation
router.get("/mean", async (req, res, next) => {
    try {
        const nums = parseNums(req.query.nums);
        const value = mean(nums);
        if (req.query.save === "true") {
            await saveResult("mean", value);
        }
        return handleResponse(req, res, "mean", value);
    } catch (e) {
        return next(e);
    }
});

// Route for median calculation
router.get("/median", async (req, res, next) => {
    try {
        const nums = parseNums(req.query.nums);
        const value = median(nums);
        if (req.query.save === "true") {
            await saveResult("median", value);
        }
        return handleResponse(req, res, "median", value);
    } catch (e) {
        return next(e);
    }
});

// Route for mode calculation
router.get("/mode", async (req, res, next) => {
    try {
        const nums = parseNums(req.query.nums);
        const value = mode(nums);
        if (req.query.save === "true") {
            await saveResult("mode", value);
        }
        return handleResponse(req, res, "mode", value);
    } catch (e) {
        return next(e);
    }
});

// Route for all calculations
router.get("/all", async (req, res, next) => {
    try {
        const nums = parseNums(req.query.nums);
        const meanVal = mean(nums);
        const medianVal = median(nums);
        const modeVal = mode(nums);

        const results = {
            operation: "all",
            mean: meanVal,
            median: medianVal,
            mode: modeVal
        };

        if (req.query.save === "true") {
            await saveResult("all", results);
        }
        
        if (req.accepts('html')) {
            return res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>All Results</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                </head>
                <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                    <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
                        <h1 class="text-2xl font-bold mb-4">ALL RESULTS</h1>
                        <p class="text-lg">Mean: <span class="font-semibold text-green-600">${meanVal}</span></p>
                        <p class="text-lg">Median: <span class="font-semibold text-green-600">${medianVal}</span></p>
                        <p class="text-lg">Mode: <span class="font-semibold text-green-600">${Array.isArray(modeVal) ? modeVal.join(', ') : modeVal}</span></p>
                    </div>
                </body>
                </html>
            `);
        }
        return res.json(results);
    } catch (e) {
        return next(e);
    }
});

module.exports = router;
