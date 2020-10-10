const express = require("express");
const path = require("path");
const ReviewsService = require("./reviews-service");
const { requireAuth } = require("../middleware/jwt-auth");

const reviewsRouter = express.Router();
const jsonBodyParser = express.json();

reviewsRouter.route("/").post(requireAuth, jsonBodyParser, (req, res, next) => {
  const {
    comment,
    overall_rating,
    communication_rating,
    has_exercises,
    has_materials,
    has_quizzes,
    parent_id,
  } = req.body;

  newReview = {
    comment,
    communication_rating,
    has_exercises,
    has_materials,
    has_quizzes,
    overall_rating,
    parent_id,
    thumbs_up: false,
  };

  for (const [key, value] of Object.entries(newReview))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`,
      });

  newReview.user_id = req.user.id;
  console.log(newReview, "new review test");
  ReviewsService.insertReview(req.app.get("db"), newReview)
    .then((review) => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${review.id}`))
        .json(ReviewsService.serializeReview(review));
    })
    .catch((error) => console.log(error));
});

module.exports = reviewsRouter;
