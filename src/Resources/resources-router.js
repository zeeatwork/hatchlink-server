const express = require("express");
const path = require("path");
const uuid = require("uuid");
const logger = require("../logger");
const { isWebUrl } = require("valid-url");
const ResourcesService = require("./resources-service");
const { requireAuth } = require("../middleware/jwt-auth");
const UsersService = require("../Users/users-service");

const resourcesRouter = express.Router();
const jsonParser = express.json();

const serializeResource = (resource) => ({
  id: resource.id,
  name: resource.name,
  url: resource.url,
  cost: resource.cost,
  format: resource.format,
  subject: resource.subject,
});

const serializeReview = (review) => ({
  id: review.id,
  comment: review.comment,
  user_name: review.user_name,
  overall_rating: review.overall_rating,
  date_created: review.date_created,
});

resourcesRouter
  .route("/")
  .get((req, res, next) => {
    ResourcesService.getAllResources(req.app.get("db"))
      .then((resource) => {
        res.json(resource.map(serializeResource));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, url, cost, format, subject } = req.body;
    const newResource = {
      name,
      url,
      cost,
      format,
      subject,
    };

    for (const [key, value] of Object.entries(newResource)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }
    newResource.name = name;

    ResourcesService.insertResource(req.app.get("db"), newResource)
      .then((resource) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${resource.id}`))
          .json(serializeResource(resource));
      })
      .catch(next);
  });
resourcesRouter
  .route("/:resource_id")
  // .all(requireAuth)
  .all(checkResourceExists)
  .get((req, res) => {
    res.json(serializeResource(res.resource));
  })
  .delete((req, res, next) => {
    ResourcesService.deleteResource(req.app.get("db"), req.params.resource_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { resource_name } = req.body;
    const resourceToUpdate = { resource_name };

    const numberOfValues = Object.values(resourceToUpdate).filter(Boolean)
      .length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain 'resource_name'`,
        },
      });
    ResourcesService.updateResource(
      req.app.get("db"),
      req.params.resource_id,
      resourceToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

resourcesRouter
  .route("/:resource_id/reviews/")
  // .all(requireAuth)
  .all(checkResourceExists)
  .get((req, res, next) => {
    ResourcesService.getReviewsForResources(
      req.app.get("db"),
      req.params.resource_id
    )
      .then((reviews) => {
        res.json(reviews.map(serializeReview));
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkResourceExists(req, res, next) {
  try {
    const resource = await ResourcesService.getById(
      req.app.get("db"),
      req.params.resource_id
    );

    if (!resource)
      return res.status(404).json({
        error: `Resource doesn't exist`,
      });

    res.resource = resource;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = resourcesRouter;
