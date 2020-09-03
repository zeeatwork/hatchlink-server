const express = require("express");
const uuid = require("uuid");
const logger = require("../logger");
const { isWebUrl } = require("valid-url");
const ResourcesService = require("./resources-service");
const { requireAuth } = require("../middleware/jwt-auth");

const resourcesRouter = express.Router();
const bodyParser = express.json();

const serializeResource = (resource) => ({
  id: resource.id,
  name: resource.name,
  url: resource.url,
  cost: resource.cost,
  subject: resource.subject,
});

resourcesRouter.route("/").get((req, res, next) => {
  ResourcesService.getAllResources(req.app.get("db"))
    .then((resource) => {
      res.json(resource.map(serializeResource));
    })
    .catch(next);
});

resourcesRouter
  .route("/:resource_id")
  // .all(requireAuth)
  .all(checkResourceExists)
  .get((req, res) => {
    res.json(serializeResource(res.resource));
  });

resourcesRouter
  .route("/:resource_id/reviews/")
  // .all(requireAuth)
  .all(checkResourceExists)
  .get((req, res, next) => {
    ResourcesService.getReviewsForResource(
      req.app.get("db"),
      req.params.resource_id
    )
      .then((reviews) => {
        res.json(ResourcesService.serializeResource(reviews));
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
