const Joi = require("joi");
const { password } = require("./custom.validation");

/// Register validation request
const register = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
  }),
};

/// Login validation request
const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

/// Logout validation request
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

/// Refresh token validation request
const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

/// Forgot password validation request
const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

/// Reset password validation request
const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
