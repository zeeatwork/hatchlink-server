CREATE TABLE hatchlink_resources(
  id SERIAL PRIMARY KEY,
  image TEXT,
  name TEXT NOT NULL,
  url TEXT,
  cost INTEGER,
  format TEXT NOT NULL,
  subject TEXT NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
