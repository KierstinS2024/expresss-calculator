// expressError.js
class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
        console.error(this.stack);
    }
}

module.exports = ExpressError;

// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
    let status = err.status || 500;
    if (req.accepts('html')) {
        res.status(status).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Error</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-100 flex items-center justify-center min-h-screen">
                <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-sm">
                    <h1 class="text-2xl font-bold text-red-600 mb-4">Error ${status}</h1>
                    <p class="text-lg">${err.message}</p>
                </div>
            </body>
            </html>
        `);
    } else {
        res.status(status).json({
            error: {
                message: err.message,
                status: status
            }
        });
    }
}

module.exports = errorHandler;
