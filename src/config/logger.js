const winston = require("winston");
const config = require("./config");

/// Format error message info 
const enumerateErrorFormat = winston.format((info) => {
  /// Assign info as object if it has type Error
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

/// Define logger with its configuration
const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === "development" ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

module.exports = logger;
