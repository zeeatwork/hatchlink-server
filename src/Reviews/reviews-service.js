const xss = require("xss");

const ReviewsService = {
  getById(db, id) {
    return db
      .from("hatchlink_reviews AS rev")
      .select(
        "rev.id",
        "rev.rating",
        "rev.comment",
        "rev.date_created",
        "rev.parent_id",
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.full_name,
                usr.date_created,
                usr.date_modified
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin("hatchlink_users AS usr", "rev.user_id", "usr.id")
      .where("rev.id", id)
      .first();
  },

  insertReview(db, newReview) {
    return db
      .insert(newReview)
      .into("hatchlink_reviews")
      .returning("*")
      .then(([review]) => review);
    //   .then((review) => ReviewsService.getById(db, review.id));
  },

  serializeReview(review) {
    return {
      id: review.id,
      rating: review.rating,
      comment: xss(review.comment),
      parent_id: review.parent_id,
      date_created: review.date_created,
      user: review.user || {},
    };
  },
};

module.exports = ReviewsService;
