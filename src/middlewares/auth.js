const httpStatus = require("http-status");
const passport = require("passport");
const ApiError = require("../utils/ApiError");
const { roleRights } = require("../config/roles");

/// Verifying callback from passport authenticate
const verifyCallback = (req, resolve, reject, requiredRights) => async (
  err,
  user,
  info
) => {
  /// Check if error, info, or user not logged in, then return reject error
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  /// Assign user to be request
  req.user = user;

  /// Check role privileges ["getUsers", "manageUsers"]
  if (requiredRights.length) {
    /// Check each registered user privileges
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) =>
      userRights.includes(requiredRight)
    );
    /// Check if privilege isn;t registeres or param isn't match with user id
    if (!hasRequiredRights && req.params.userId !== user.id) {
      return reject(new ApiError(httpStatus.FORBIDDEN, "Forbidden"));
    }
  }
  /// Call resolve if all corresponded
  resolve();
};  

/// Checking user privileges using passport jwt and return as promise
const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject, requiredRights)
    )(req, res, next);
  }).then(() => next()).catch((err) => next(err));
};

module.exports = auth;
