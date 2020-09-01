const path = require("path");
const express = require("express");
const xss = require("xss");
const ReviewsService = require("./reviews-service");
const resourcesRouter = require("../Resources/resources-router");

const reviewsRouter = express.Router();
const jsonParser = express.json();

const serializeReviews = (review) => ({
  id: String(review.id),
  comments: xss(review.review_comments),
  resourceId: xss(review.parent_resource),
  materialsIncluded: xss(review.materials_included),
  upDownRating: xss(review.up_down_rating),
  communicationRating: xss(review.communication_rating),
  quizzesIncluded: xss(review.quizzes_included),
  overallRating: xss(review.overall_rating),
  exercisesIncluded: xss(review.exercises_included),
  modified: note.date_created,
  commenterId: xss(review.commenter),
});

reviewsRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ReviewsService.getAllReviews(knexInstance)
      .then((reviews) => {
        res.json(reviews.map(serializeReviews));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, content, reviewId } = req.body;
    const newReview = {
      note_title: name,
      note_details: content,
      parent_folder: folderId,
    };

    for (const [key, value] of Object.entries(newReview)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    ReviewsService.insertReview(req.app.get("db"), newReview)
      .then((review) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(serializeReviews(review));
      })
      .catch(next);
  });

reviewsRouter
  .route("/:review_id")
  .all((req, res, next) => {
    ReviewsService.getById(req.app.get("db"), req.params.review_id)
      .then((review) => {
        if (!review) {
          return res.status(404).json({
            error: { message: `Reviews don't exist for this resource.` },
          });
        }
        res.review = review;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeReviews(res.review));
  })
  .delete((req, res, next) => {
    ReviewsService.deleteReview(req.app.get("db"), req.params.review_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { note_title, note_details } = req.body;
    const reviewToUpdate = { note_title, note_details };

    const numberOfValues = Object.values(reviewToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'note_title' or 'note_details'`,
        },
      });

    ReviewsService.updateReview(
      req.app.get("db"),
      req.params.note_id,
      reviewToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = reviewsRouter;
