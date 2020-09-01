/*CRUD OPERATIONS for Reviews*/

const ReviewsService = {
  getAllReviews(knex) {
    return knex.select("*").from("hatchlink_reviews");
  },

  insertReview(knex, newReview) {
    return knex
      .insert(newReview)
      .into("hatchlink_reviews")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("hatchlink_reviews").select("*").where("id", id).first();
  },

  deleteReview(knex, id) {
    return knex("hatchlink_reviews").where({ id }).delete();
  },
  updateReview(knex, id, newReviewsFields) {
    return knex("hatchlink_reviews").where({ id }).update(newReviewsFields);
  },
};

module.exports = ReviewsService;
