const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const { expect } = require("chai");

describe("Resources Endpoints", function () {
  let db;

  const {
    testUsers,
    testResources,
    testReviews,
  } = helpers.makeResourcesFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/resources`, () => {
    context(`Given no resources`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/resources").expect(200, []);
      });
    });

    context("Given there are resources in the database", () => {
      beforeEach("insert resources", () =>
        helpers.seedResourcesTables(db, testUsers, testResources, testReviews)
      );

      it("responds with 200 and all of the resources", () => {
        return supertest(app)
          .get("/api/resources")
          .expect(200)
          .expect((res) => {
            expect(res.body[0].name).to.eql(testResources[0].name);
            expect(res.body.length).to.eql(testResources.length);
          });
      });
    });

    context(`Given an XSS attack resource`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousResource,
        expectedResource,
      } = helpers.makeMaliciousResource(testUser);

      beforeEach("insert malicious resource", () => {
        return helpers.seedMaliciousResource(db, testUser, maliciousResource);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/resources`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].name).to.eql(expectedResource.name);
            expect(res.body[0].content).to.eql(expectedResource.content);
          });
      });
    });
  });

  describe(`GET /api/resources/:resource_id`, () => {
    context(`Given no resources`, () => {
      it(`responds with 404`, () => {
        const resourceId = 123456;
        return supertest(app)
          .get(`/api/resources/${resourceId}`)
          .expect(404, { error: `Resource doesn't exist` });
      });
    });

    context("Given there are resources in the database", () => {
      beforeEach("insert resources", () =>
        helpers.seedResourcesTables(db, testUsers, testResources, testReviews)
      );

      it("responds with 200 and the specified resource", () => {
        const resourceId = 1;

        return supertest(app)
          .get(`/api/resources/${resourceId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.eql(testResources[0].name);
          });
      });
    });

    context(`Given an XSS attack resource`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousResource,
        expectedResource,
      } = helpers.makeMaliciousResource(testUser);

      beforeEach("insert malicious resource", () => {
        return helpers.seedMaliciousResource(db, testUser, maliciousResource);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/resources/${maliciousResource.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.eql(expectedResource.name);
            expect(res.body.content).to.eql(expectedResource.content);
          });
      });
    });
  });

  describe(`GET /api/resources/:resource_id/reviews`, () => {
    context(`Given no resources`, () => {
      it(`responds with 404`, () => {
        const resourceId = 123456;
        return supertest(app)
          .get(`/api/resources/${resourceId}/reviews`)
          .expect(404, { error: `Resource doesn't exist` });
      });
    });

    context("Given there are reviews for resource in the database", () => {
      beforeEach("insert resources", () =>
        helpers.seedResourcesTables(db, testUsers, testResources, testReviews)
      );

      it("responds with 200 and the specified reviews", () => {
        const resourceId = 2;
        const expectedReviews = helpers.makeExpectedResourceReviews(
          testUsers,
          resourceId,
          testReviews
        );

        return supertest(app)
          .get(`/api/resources/${resourceId}/reviews`)
          .expect(200, expectedReviews);
      });
    });
  });
});
