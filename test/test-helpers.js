function makeUsersArray() {
  return [
    {
      id: 102,
      user_name: "test-user-1",
      full_name: "Test user 1",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 211,
      user_name: "test-user-2",
      full_name: "Test user 2",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 321,
      user_name: "test-user-3",
      full_name: "Test user 3",
      password: "password",
      admin: "false",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 40,
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
      id: 19,
      name: "First test post!",
      url: "How-to",
      cost: 30,
      format: "video",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 27,
      name: "Second test post!",
      url: "How-to",
      cost: 30,
      format: "video",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 39,
      name: "Third test post!",
      url: "How-to",
      cost: 37,
      format: "article",
      subject: "JavaScript",
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 42,
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
      id: 1,
      comment: "First test comment!",
      parent_id: resources[0].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 2,
      comment: "Second test comment!",
      parent_id: resources[0].id,
      user_id: users[1].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 3,
      comment: "Third test comment!",
      parent_id: resources[0].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 4,
      comment: "Fourth test comment!",
      parent_id: resources[0].id,
      user_id: users[3].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 5,
      comment: "Fifth test comment!",
      parent_id: resources[resources.length - 1].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 6,
      comment: "Sixth test comment!",
      parent_id: resources[resources.length - 1].id,
      user_id: users[2].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
    {
      id: 7,
      comment: "Seventh test comment!",
      parent_id: resources[3].id,
      user_id: users[0].id,
      date_created: new Date("2029-01-22T16:28:32.615Z"),
    },
  ];
}
function makeExpectedResource(users, resource, reviews = []) {
  return {
    id: resource.id,
    name: resource.name,
    url: resource.url,
    cost: resource.cost,
    format: resource.format,
    subject: resource.subject,
    date_created: resource.date_created.toISOString(),
  };
}

function makeExpectedResourceReviews(users, parentId, reviews) {
  const expectedReviews = reviews.filter(
    (review) => review.resource_id === reviewId
  );

  return expectedReviews.map((review) => {
    const reviewUser = users.find((user) => user.id === review.user_id);
    return {
      id: review.id,
      comment: comment.text,
      date_created: comment.date_created.toISOString(),
      user: {
        id: reviewUser.id,
        user_name: reviewUser.user_name,
        date_created: reviewUser.date_created.toISOString(),
        date_modified: reviewUser.date_modified || null,
      },
    };
  });
}

function makeMaliciousResource() {
  const maliciousResource = {
    id: 911,
    date_created: new Date(),
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedResource = {
    ...makeExpectedResource(maliciousResource),
    title:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousResource,
    expectedResource,
  };
}

function makeResourcesFixtures() {
  const testUsers = makeUsersArray();
  const testResources = makeResourcesArray();
  const testReviews = makeReviewsArray(testUsers, testReviews);
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
      await trx.into("thinkful_reviews").insert(reviews);
      await trx.raw(`SELECT setval('thinkful_reviews_id_seq', ?)`, [
        reviews[reviews.length - 1].id,
      ]);
    }
  });
}

function seedMaliciousReview(db, user, resource) {
  return seedUsers(db, [user]).then(() =>
    db.into("thinkful_resources").insert([resource])
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
  seedMaliciousReview,
  makeAuthHeader,
  seedUsers,
};
