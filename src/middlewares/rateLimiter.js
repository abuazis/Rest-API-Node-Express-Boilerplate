const rateLimit = require("express-rate-limit");

/// Define limiter configuration for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
});

module.exports = { authLimiter };