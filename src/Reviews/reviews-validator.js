const logger = require("../logger");

const NO_ERRORS = null;

function getReviewValidationError({
  up_down_rating,
  review_comments,
  parent_resource,
}) {
  if (!up_down_rating) {
    logger.error(`Invalid '${up_down_rating}' supplied`);
    return {
      error: {
        message: `'up_down_rating' must be supplied.`,
      },
    };
  } else if (!review_comments) {
    logger.error(`Invalid name'${review_comments}' supplied`);
    return {
      error: {
        message: `'review_comments' must be supplied.`,
      },
    };
  } else if (!parent_resource) {
    logger.error(`Invalid resource'${parent_resource}' supplied`);
    return {
      error: {
        message: `'parent_resource' must be supplied.`,
      },
    };
  }

  return NO_ERRORS;
}

module.exports = {
  getReviewValidationError,
};
