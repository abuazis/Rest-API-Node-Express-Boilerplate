const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { roles } = require("../config/roles");
const { toJSON, paginate } = require("./plugins");

/// Define user collection schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      private: true,
    },
    role: {
      type: String,
      required: true,
      enum: roles,
      default: "user",
    },
  },
  { timestamps: true }
);

/// Call schema plugin
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/// Check if user email has been registered
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/// Check if new password request is match with old password
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

/// Add pre method schema on save is called 
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/// Register mongoose model for user schema
const User = mongoose.model("User", userSchema);

module.exports = User;
