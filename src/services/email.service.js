const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");

/// Define nodemailer transport smpt configuration
const transport = nodemailer.createTransport(config.email.smtp);

/// Print logger info if environment is not test
if (config.env !== "test") {
  transport.verify().then(
    () => logger.info("Connected to email server")
  ).catch(() =>
    logger.warn(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    )
  );
}

/// Send email based on nodemailer transport
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/// Define subject, url, and message, then send reset password link
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset Password';
  const resetPasswordUrl = `http://link-to-app/reset-password?token${token}`;
  const text = `Dear user, To reset your password, click on this link: ${resetPasswordUrl} If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
};