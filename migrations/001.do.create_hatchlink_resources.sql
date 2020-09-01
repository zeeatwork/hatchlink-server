CREATE TABLE hatchlink_resources(
  id SERIAL PRIMARY KEY,
  image TEXT,
  name TEXT NOT NULL,
  url TEXT,
  cost INTEGER,
  format TEXT,
  subject TEXT,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
