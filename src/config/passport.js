const config = require("./config");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
const { tokenTypes } = require("./tokens");

/// Define JWT options
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/// Verify entered JWT value
const jwtVerify = async (payload, done) => {
  try {
    /// Throw error if token type is not ACCESS type
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }
    /// Check user existence
    const user = await User.findById(payload.sub);
    /// Return done callback based on condition
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

/// Define JWT strategy based on options and verify method 
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = { jwtStrategy };
