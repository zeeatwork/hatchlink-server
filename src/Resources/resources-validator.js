const logger = require("../logger");
const resourcesRouter = require("./resources-router");

const NO_ERRORS = null;

function getResourcesValidationError({ resource_name }) {
  if (!resource_name) {
    logger.error(`Invalid name'${resource_name}' supplied`);
    return {
      error: {
        message: `'resource_name' must be supplied.`,
      },
    };
  }

  return NO_ERRORS;
}

module.exports = {
  getResourceValidationError,
};
