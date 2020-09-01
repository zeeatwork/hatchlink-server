const path = require("path");
const express = require("express");
const xss = require("xss");
const ResourcesService = require("./resources-service");

const resourcesRouter = express.Router();
const jsonParser = express.json();

const serializeResource = (resource) => ({
  id: resource.id,
  name: xss(resourcer.resourcer_name),
  date_published: resourcer.date_published,
});

resourcesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    resourcesService
      .getAllresources(knexInstance)
      .then((resources) => {
        res.json(resources.map(serializeresource));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newResource = { resource_name: name };

    for (const [key, value] of Object.entries(newResource)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    newResource.resource_name = name;

    resourcesService
      .insertResources(req.app.get("db"), newResource)
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
  .all((req, res, next) => {
    resourcesService
      .getById(req.app.get("db"), req.params.resource_id)
      .then((resource) => {
        if (!resource) {
          return res.status(404).json({
            error: { message: `resource doesn't exist` },
          });
        }
        res.resource = resource;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeResource(res.resource));
  })
  .delete((req, res, next) => {
    resourcesService
      .deleteResource(req.app.get("db"), req.params.resource_id)
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

    resourcersService
      .updateresource(
        req.app.get("db"),
        req.params.resource_id,
        resourceToUpdate
      )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = resourcesRouter;
