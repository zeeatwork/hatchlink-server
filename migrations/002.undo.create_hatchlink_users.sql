ALTER TABLE hatchlink_resources
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS hatchlink_users CASCADE;

