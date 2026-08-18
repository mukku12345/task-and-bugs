const ApiError = require("./ApiError");

// 404 handler for routes that don't match anything.
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Single centralized error handler. Any error passed to next(err)
// anywhere in the app (including asyncHandler-wrapped controllers)
// ends up here.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation errors (e.g. missing title, bad enum value).
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose bad ObjectId (e.g. GET /api/tasks/not-a-real-id).
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid id: ${err.value}`;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

module.exports = { notFound, errorHandler };
