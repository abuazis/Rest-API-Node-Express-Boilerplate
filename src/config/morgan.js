const morgan = require("morgan");
const config = require("./config");
const logger = require("./logger");

/// Set custom token which to use logging format
morgan.token("message", (req, res) => res.locals.errorMessage || "");

/// Set response string format based on environment mode
const getIpFormat = () => config.env === "production" ? ":remote-addr - " : "";
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

/// Handle success response format based on status code
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

/// Handle error response format based on status code
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};
