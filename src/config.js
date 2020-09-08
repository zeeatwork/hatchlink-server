module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN || "dummy-api-token",
  DB_URL:
    process.env.DATABASE_URL || "postgresql://zenziali@localhost/hatchlink",
  JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
};
