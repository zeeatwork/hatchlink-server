const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Reviews Endpoints", function () {
  let db;

  const { testResources, testUsers } = helpers.makeResourcesFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
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

    it(`creates an review, responding with 201 and the new review`, function () {
      this.retries(3);
      const testResource = testResources[0];
      const testUser = testUsers[0];
      const newReview = {
        comment: "Test new review",
        resource_id: testResource.id,
        user_id: testUser.id,
      };
      return supertest(app)
        .post("/api/reviews")
        .send(newReview)
        .expect(201)
        .expect((res) => {
          expect(res.body).to.have.property("id");
          expect(res.body.comment).to.eql(newReview.comment);
          expect(res.body.parent_id).to.eql(newReview.parent_id);
          expect(res.body.user.id).to.eql(testUser.id);
          expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`);
          const expectedDate = new Date().toLocaleString("en", {
            timeZone: "UTC",
          });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        })
        .expect((res) =>
          db
            .from("hatchlink_reviews")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.comment).to.eql(newReview.comment);
              expect(row.parent_id).to.eql(newReview.parent_id);
              expect(row.user_id).to.eql(newReview.user_id);
              const expectedDate = new Date().toLocaleString("en", {
                timeZone: "UTC",
              });
              const actualDate = new Date(row.date_created).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

    const requiredFields = ["review", "user_id", "resource_id"];

    requiredFields.forEach((field) => {
      const testResource = testResources[0];
      const testUser = testUsers[0];
      const newReview = {
        comment: "Test new comment",
        user_id: testUser.id,
        parent_id: testParent.id,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newReview[field];

        return supertest(app)
          .post("/api/review")
          .send(newReview)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });
  });
});
