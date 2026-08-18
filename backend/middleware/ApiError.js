// Lightweight error class that carries an HTTP status code so the
// centralized error handler knows what to send back to the client.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ApiError;
