const mongoose = require("mongoose");
const { toJSON } = require("./plugins");
const { tokenTypes } = require("../config/tokens");

/// Define token collection schema
const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD],
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamp: true }
);

/// Call schema plugin
tokenSchema.plugin(toJSON);

/// Register mongoose model for token schema
const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
