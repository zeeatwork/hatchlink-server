const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: "Test user 1",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: "Test user 2",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "Test user 3",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      user_name: "test-user-4",
      full_name: "Test user 4",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeResourcesArray() {
  return [
    {
      id: 1,
      name: "First test post!",
      url: "How-to",
      cost: 30,
      format: "video",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      name: "Second test post!",
      url: "How-to",
      cost: 30,
      format: "video",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      name: "Third test post!",
      url: "How-to",
      cost: 37,
      format: "article",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      name: "Fourth test post!",
      url: "How-to",
      cost: 30,
      format: "book",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}

function makeReviewsArray(users, resources) {
  return [
    {
      id: 2,
      comment: "First test comment!",
      overall_rating: 5,
      parent_id: resources[1].id,
      user_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 1,
      comment: "Second test comment!",
      overall_rating: 5,
      parent_id: resources[2].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      comment: "Third test comment!",
      overall_rating: 5,
      parent_id: resources[3].id,
      user_id: users[3].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      comment: "Fourth test comment!",
      overall_rating: 5,
      parent_id: resources[0].id,
      user_id: users[3].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 5,
      comment: "Fifth test comment!",
      overall_rating: 5,
      parent_id: resources[resources.length - 1].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 6,
      comment: "Sixth test comment!",
      overall_rating: 5,
      parent_id: resources[resources.length - 1].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 7,
      comment: "Seventh test comment!",
      overall_rating: 5,
      parent_id: resources[3].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}
function makeExpectedResource(resource, reviews = []) {
  return {
    id: resource.id,
    name: resource.name,
    url: resource.url,
    cost: resource.cost,
    format: resource.format,
    subject: resource.subject,
    date_created: resource.date_created,
  };
}

function makeExpectedResourceReviews(users, parentId, reviews) {
  const expectedReviews = reviews.filter(
    (review) => review.parent_id === parentId
  );

  return expectedReviews.map((review) => {
    const reviewUser = users.find((user) => user.id === review.user_id);
    console.log("looking for user", reviewUser);
    return {
      id: review.id,
      comment: review.comment,
      date_created: review.date_created.toISOString(),
      user_id: reviewUser.id,
      overall_rating: 5,
    };
  });
}

function makeMaliciousResource() {
  const maliciousResource = {
    id: 911,
    date_created: new Date(),
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    format: "",
    subject: "",
  };
  const expectedResource = {
    ...makeExpectedResource(maliciousResource),
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    format: "",
    subject: "",
  };
  return {
    maliciousResource,
    expectedResource,
  };
}

function makeResourcesFixtures() {
  const testUsers = makeUsersArray();
  const testResources = makeResourcesArray();
  const testReviews = makeReviewsArray(testUsers, testResources);
  return { testUsers, testResources, testReviews };
}

function cleanTables(db) {
  return db.transaction((trx) =>
    trx
      .raw(
        `TRUNCATE
        hatchlink_resources,
        hatchlink_users,
        hatchlink_reviews
      `
      )
      .then(() =>
        Promise.all([
          trx.raw(
            `ALTER SEQUENCE hatchlink_resources_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE hatchlink_users_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(
            `ALTER SEQUENCE hatchlink_reviews_id_seq minvalue 0 START WITH 1`
          ),
          trx.raw(`SELECT setval('hatchlink_resources_id_seq', 0)`),
          trx.raw(`SELECT setval('hatchlink_users_id_seq', 0)`),
          trx.raw(`SELECT setval('hatchlink_reviews_id_seq', 0)`),
        ])
      )
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db
    .into("hatchlink_users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('hatchlink_users_id_seq', ?)`, [
        users[users.length - 1].id,
      ])
    );
}

function seedResourcesTables(db, users, resources, reviews = []) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into("hatchlink_resources").insert(resources);
    // update the auto sequence to match the forced id values
    await trx.raw(`SELECT setval('hatchlink_resources_id_seq', ?)`, [
      resources[resources.length - 1].id,
    ]);

    // only insert comments if there are some, also update the sequence counter
    if (reviews.length) {
      await trx.into("hatchlink_reviews").insert(reviews);
      await trx.raw(`SELECT setval('hatchlink_reviews_id_seq', ?)`, [
        reviews[reviews.length - 1].id,
      ]);
    }
  });
}

function seedMaliciousResource(db, user, resource) {
  return seedUsers(db, [user]).then(() =>
    db.into("hatchlink_resources").insert([resource])
  );
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeUsersArray,
  makeResourcesArray,
  makeExpectedResource,
  makeExpectedResourceReviews,
  makeMaliciousResource,
  makeReviewsArray,

  makeResourcesFixtures,
  cleanTables,
  seedResourcesTables,
  seedMaliciousResource,
  makeAuthHeader,
  seedUsers,
};
