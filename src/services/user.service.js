const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/// Create new user document
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

/// Get all user documents
const getAllUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/// Get user document by id
const getUserById = async (id) => {
  return User.findById(id);
};

/// Get user document by email
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/// Update user document by id
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/// Delete user document by id
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
