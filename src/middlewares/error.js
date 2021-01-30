const mongoose = require("mongoose");
const httpStatus = require("http-status");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

/// Define error converter to generate status code and message
const errorConverter = (err, req, res, next) => {
  let error = err;
  /// Check if error isn't type ApiError
  if (!(error instanceof ApiError)) {
    /// Check if error has status code or error has mongoose error type
    const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    /// Generate message as error message or status code
    const message = error.message || httpStatus[statusCode];
    /// Create ApiError object
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/// Define error handler based on environment mode
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  /// Check if environment is production and error can't identified
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }
  /// Assign local error message from error parameter 
  res.locals.errorMessage = err.message;

  /// Set response status code and message
  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  /// Check if environment is development
  if (config.env === "development") {
    logger.error(err);
  }
  /// Send response status 
  res.status(statusCode).send(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
