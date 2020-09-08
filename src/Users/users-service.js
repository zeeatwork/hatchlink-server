const xss = require("xss");
const bcrypt = require("bcryptjs");

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/;

const UsersService = {
  serializeUser(user) {
    return {
      id: user.id,
      full_name: xss(user.full_name),
      user_name: xss(user.user_name),
      date_created: new Date(user.date_created),
    };
  },
  hasUserWithUserName(db, user_name) {
    return db("hatchlink_users")
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return "Password must be longer than 8 characters";
    }
    if (password.length > 72) {
      return "Password must be less than 72 characters";
    }
    if (password.startsWith(" ") || password.endsWith(" ")) {
      return "Password must not start or end with empty spaces";
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return "Password must contain 1 upper case, lower case, number and special character";
    }
    return null;
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into("hatchlink_users")
      .returning("*")
      .then(([user]) => user);
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  /*getById(db, id) {
    return db
      .from("hatchlink_users AS use")
      .select(
        "use.id",
        "use.user_name",
        "use.full_name",
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

  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("hatchlink_users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("hatchlink_users").select("*").where("id", id).first();
  },

  deleteUser(knex, id) {
    return knex("hatchlink_users").where({ id }).delete();
  },
  updateUser(knex, id, newUserFields) {
    return knex("hatchlink_users").where({ id }).update(newUserFields);
  },*/
};

module.exports = UsersService;
