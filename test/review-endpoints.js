const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");
const supertest = require("supertest");
const { expect } = require("chai");

describe("Reviews Endpoints", function () {
  let db;

  const { testResources, testUsers } = helpers.makeResourcesFixtures();

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

  describe(`POST /api/reviews`, () => {
    beforeEach("insert resources", () =>
      helpers.seedResourcesTables(db, testUsers, testResources)
    );

    it(`creates a review, responding with 201 and the new review`, function () {
      const testResource = testResources[0];
      const testUser = testUsers[0];
      const newReview = {
        comment: "Test new review",
        resource_id: testResource.id,
        user_name: testUser.user_name,
      };
      return supertest(app)
        .post("/api/auth/login")
        .send({
          user_name: testUsers[0].user_name,
          password: testUsers[0].password,
        })
        .expect(200)
        .expect((response) => {
          // let data = response.json();
          // let authToken = data.authToken;
          return supertest(app)
            .post("/api/reviews")
            .set("Authorization", `Bearer ${response.body.authToken}`)
            .send(newReview)
            .expect(201);
          expect(response.body).to.have.property("id");
          expect(response.body.comment).to.eql(newReview.comment);
          expect(response.body.parent_id).to.eql(newReview.parent_id);
          expect(response.body.user.user_name).to.eql(testUser.user_name);
          expect(response.headers.location).to.eql(
            `/api/reviews/${response.body.id}`
          );
          const expectedDate = new Date().toLocaleString("en", {
            timeZone: "UTC",
          });
          const actualDate = new Date(
            response.body.date_created
          ).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        });
      expect((response) =>
        db
          .from("hatchlink_reviews")
          .select("*")
          .where({ id: response.body.id })
          .first()
          .then((row) => {
            expect(row.comment).to.eql(newReview.comment);
            expect(row.parent_id).to.eql(newReview.parent_id);
            expect(row.user_name).to.eql(newReview.user_name);
            const expectedDate = new Date().toLocaleString("en", {
              timeZone: "UTC",
            });
            const actualDate = new Date(row.date_created).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
      );
    });

    const requiredFields = ["review", "user_name", "resource_id"];

    requiredFields.forEach((field) => {
      const testResource = testResources[0];
      const testUser = testUsers[0];
      const newReview = {
        comment: "Test new comment",
        user_name: testUser.user_name,
        parent_id: testResource.id,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newReview[field];

        return supertest(app).post("/api/reviews").send(newReview);
        return supertest(app)
          .post("/api/auth/login")
          .send({
            user_name: testUsers[0].user_name,
            password: testUsers[0].password,
          })
          .expect(200)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
  });
});
