const express = require('express');
const app = express();
const ExpressError = require('./expressError');
const allRoutes = require('./routes/all');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

app.get("/", function(req, res, next) {
    if (req.accepts('html')) {
        return res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Express Calculator API</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: sans-serif; }
                </style>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen p-4">
                <div class="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                    <h1 class="text-3xl font-bold mb-4">Express Calculator API</h1>
                    <p class="mb-4">Welcome to the API. Here are the available routes:</p>
                    <ul class="list-disc list-inside space-y-2">
                        <li><code>/mean?nums=1,2,3...</code></li>
                        <li><code>/median?nums=1,2,3...</code></li>
                        <li><code>/mode?nums=1,2,3...</code></li>
                        <li><code>/all?nums=1,2,3...</code></li>
                    </ul>
                    <p class="mt-4">You can also add <code>?save=true</code> to any route to save the result to <code>data/results.json</code>.</p>
                </div>
            </body>
            </html>
        `);
    }
    return res.json({
        "message": "Welcome to the Express Calculator API. Use the following routes with a `nums` query parameter: /mean, /median, /mode, /all. Add `?save=true` to save results."
    });
});

app.use('/', allRoutes);

app.use(errorHandler);

module.exports = app;
