const logger = require("../logger");
const usersRouter = require("./users-router");

const NO_ERRORS = null;

function getUsersValidationError({ user_name }) {
  if (!user_name) {
    logger.error(`Invalid name'${user_name}' supplied`);
    return {
      error: {
        message: `invalid credentials`,
      },
    };
  }

  return NO_ERRORS;
}

module.exports = {
  getResourceValidationError,
};
