//created delete but only want administrators to use
//instead of create can we suggest? admin approval?

const ResourcesService = {
  getAllResources(knex) {
    return knex.select("*").from("hatchlink_resources");
  },

  insertResource(knex, newResource) {
    return knex
      .insert(newResource)
      .into("hatchlink_resources")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("hatchlink_resources").select("*").where("id", id).first();
  },

  deleteResource(knex, id) {
    return knex("hatchlink_resources").where({ id }).delete();
  },
  updateResource(knex, id, newResourceFields) {
    return knex("hatchlink_resources").where({ id }).update(newResourceFields);
  },
};

module.exports = ResourcesService;
