CREATE TABLE hatchlink_reviews (
    id SERIAL PRIMARY KEY,
    comment TEXT NULL,
    overall_rating INTEGER NOT NULL DEFAULT 5,
    communication_rating INTEGER NULL DEFAULT 5,
    has_exercises BOOLEAN DEFAULT false,
    has_quizzes BOOLEAN DEFAULT false,
    has_materials BOOLEAN DEFAULT false,
    thumbs_up BOOLEAN NOT NULL DEFAULT false,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    parent_id INTEGER
        REFERENCES hatchlink_resources(id) ON DELETE CASCADE NOT NULL,
    user_name INTEGER
        REFERENCES hatchlink_users(id) ON DELETE CASCADE NOT NULL
);
