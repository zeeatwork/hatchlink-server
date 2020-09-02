CREATE TABLE hatchlink_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  admin BOOLEAN NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ
);

ALTER TABLE hatchlink_resources
  ADD COLUMN
    user_id INTEGER REFERENCES hatchlink_users(id)
    ON DELETE SET NULL;
