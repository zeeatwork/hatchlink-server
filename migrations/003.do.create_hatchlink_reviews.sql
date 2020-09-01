CREATE TABLE hatchlink_reviews (
    id SERIAL PRIMARY KEY,
    comment TEXT NULL,
    overall_rating INTEGER NOT NULL DEFAULT 5,
    communication_rating INTEGER NULL DEFAULT 5,
    has_exercises BOOLEAN,
    has_quizzes BOOLEAN,
    has_materials BOOLEAN,
    thumbs_up BOOLEAN NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    parent_id INTEGER
        REFERENCES hatchlink_resources(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES hatchlink_users(id) ON DELETE CASCADE NOT NULL
);
