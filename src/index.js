const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;

/// Set mongoose configuration to connect with MongoDB
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

/// Handle server listen state to print logger info
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

/// Handle error state to print logger error
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

/// Call error handler to process the event
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

/// Call logger info to process 'SIGTERM' status
process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
