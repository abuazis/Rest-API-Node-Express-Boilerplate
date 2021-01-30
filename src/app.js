const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const routes = require("./routes/v1");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");

const app = express();

/// Check environment mode to print success or error status
if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

/// Set security HTTP headers
app.use(helmet());

/// Parse json request body
app.use(express.json());

/// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

/// Sanitize request data
app.use(xss());
app.use(mongoSanitize());

/// Set gzip compression
app.use(compression());

/// Set enable cors
app.use(cors());
app.options("*", cors());

/// Set init jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

/// Limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

/// Use v1 api routes
app.use("/v1", routes);

/// Send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

/// Convert error to ApiError, if needed
app.use(errorConverter);

/// Call handle error
app.use(errorHandler);

module.exports = app;