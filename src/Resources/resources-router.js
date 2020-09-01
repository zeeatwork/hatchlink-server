const express = require("express");
const ResourcesService = require("./resources-service");
const { requireAuth } = require("../middleware/jwt-auth");

const resourcesRouter = express.Router();

resourcesRouter.route("/").get((req, res, next) => {
  ResourcesService.getAllResources(req.app.get("db"))
    .then((resources) => {
      res.json(ResourcesService.serializeResources(resources));
    })
    .catch(next);
});

resourcesRouter
  .route("/:resource_id")
  .all(requireAuth)
  .all(checkResourceExists)
  .get((req, res) => {
    res.json(ResourcesService.serializeResource(res.resource));
  });

resourcesRouter
  .route("/:resource_id/reviews/")
  .all(requireAuth)
  .all(checkResourceExists)
  .get((req, res, next) => {
    ResourcesService.getReviewsForResources(
      req.app.get("db"),
      req.params.resource_id
    )
      .then((reviews) => {
        res.json(ResourcesService.serializeResourceReviews(reviews));
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

module.exports = ResourcesRouter;
