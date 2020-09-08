/* eslint-disable strict */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  /**
   * We use this to verify that a JWT matches a user in the db
   * We also use this function when someone logs in to make sure that user actually exists
   * @param {KnexConnection} db this is a connection to the db that was established in server.js
   * @param {String} user_name the username that was provided in the jwt or login form
   */
  getUserWithUserName(db, user_name) {
    // connect to the users table, and grab the first user that matches that user_name
    return db("hatchlink_users").where({ user_name }).first();
  },

  /**
   *
   * @param {*} password
   * @param {*} hash
   */
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: "HS256",
    });
  },

  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  },
};

module.exports = AuthService;
