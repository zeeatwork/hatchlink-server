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
