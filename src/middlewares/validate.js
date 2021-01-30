const Joi = require('joi');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');

/// Define validation method
const validate = (schema) => (req, res, next) => {
  /// Define schema, object, value and error for validation
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema).prefs({ errors: { label: 'key' } }).validate(object);

  /// Check if error has value
  if (error) {
    /// Joining each detail error message and return as next callback
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  
  /// Assign value from request parameter and return next callback
  Object.assign(req, value);
  return next();
};

module.exports = validate;