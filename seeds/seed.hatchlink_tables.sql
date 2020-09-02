BEGIN;

TRUNCATE
  hatchlink_reviews,
  hatchlink_resources,
  hatchlink_users
  RESTART IDENTITY CASCADE;

INSERT INTO hatchlink_users (user_name, full_name, admin, password)
VALUES
  (
  'laurie22',
  'Laurie Sampson',
  FALSE,
  'juice1'
),
(
  'sourpatch',
  'Lady Bunny',
  TRUE,
  'arrow'
),
(
  'c.bloggs',
  'Charlie Bloggs',
  FALSE,
  'bloggsc'
),
(
  's.smith',
  'Sam Smith',
  FALSE,
  'syrup'
),
(
  'lexlor',
  'Alex Taylor',
  FALSE,
  'alexone'
),
(
  'wippy',
  'Maxwell Houser',
  FALSE,
  'wippypassword'
);

INSERT INTO hatchlink_resources (name, image, cost, format, url, subject)
VALUES
  ('FreeCodeCamp', 'https://loremflickr.com/750/300/landscape?random=1', 0, 'e-learning', 'https://www.freecodecamp.org/learn', 'web development'),
  ('Team Treehouse', 'https://loremflickr.com/750/300/landscape?random=2', 19.99, 'video', 'https://www.teamtreehouse.com', 'web development'),
  ('Oreilly', 'https://loremflickr.com/750/300/landscape?random=3', 19.99, 'e-book','https://www.oreilly.com', 'general'),
  ('Traversy Media', 'https://loremflickr.com/750/300/landscape?random=4',  0, 'video','https://www.traversymedia.com', 'web development'),
  ('Wes Bos', 'https://loremflickr.com/750/300/landscape?random=5', 0, 'video', 'https://www.wesbos.com', 'web development'),
  ('Pluralsight', 'https://loremflickr.com/750/300/landscape?random=6', 30.00, 'video', 'https://www.pluralsight.com', 'web development'),
  ('Code Academy', 'https://loremflickr.com/750/300/landscape?random=7', 19.99, 'e-learning', 'https://www.codeacademy.com', 'web development'),
  ('Edabit', 'https://loremflickr.com/750/300/landscape?random=8', 0, 'challenge', 'https://www.edabit.com', 'web development'),
  ('Mozilla Developer Network', 'https://loremflickr.com/750/300/landscape?random=9', 0, 'reference', 'https://www.developer.mozilla.org', 'web development'),
  ('CSS Tricks', 'https://loremflickr.com/750/300/landscape?random=10', 0, 'reference', 'https://www.css-tricks.com', 'CSS');

INSERT INTO hatchlink_reviews (
  comment,
  overall_rating,
  communication_rating,
  parent_id,
  user_id,
  has_exercises,
  has_quizzes,
  has_materials,
  thumbs_up

) VALUES
  (
    'This thing is amazing.',
    4,
    1,
    2,
    1,
    TRUE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    'Put a bird on it!',
    4,
    1,
    3,
    2,
    FALSE,
    FALSE,
    TRUE,
    TRUE
  ),
  (
    'All the other reviewers are obviously insane, but this thing is actually pretty amazing.',
    5,
    1,
    4,
    3,
    TRUE,
    TRUE,
    TRUE,
    TRUE
  ),
  (
    'When life gives you lemons, trade them for this thing.',
    4,
    1,
    5,
    4,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  ),
  (
    'This cured my psoriasis, but left me unable to tell the difference between the taste of squash and the concept of increasing.',
    3,
    2,
    5,
    5,
    FALSE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'I think I swallowed a bug.',
    1,
    2,
    1,
    5,
    FALSE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'I have not used it or even seen it, and I do not actually know what it is. I do not know why I am writing this review, how I got here, or what my name is. Three stars!',
    3,
    2,
    3,
    6,
    FALSE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Ew.',
    1,
    4,
    5,
    6,
    FALSE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'I heard about this one time at band camp.',
    3,
    4,
    4,
    4,
    TRUE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'big time many goodness!!!',
    5,
    5,
    3,
    5,
   TRUE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'Iste, architecto obcaecati tenetur quidem voluptatum ipsa quam!',
    2,
    1,
    5,
    2,
    FALSE,
    TRUE,
    FALSE,
    FALSE
  ),
  (
    'There are some better things. There are also some worse things.',
    3,
    7,
    1,
    3,
    FALSE,
    TRUE,
    TRUE,
    TRUE
  ),
  (
    'Great holiday present for extraterrestrials (only the kind with the lightbulb heads).',
    4,
    7,
    2,
    4,
    FALSE,
    TRUE,
    FALSE,
    TRUE
  ),
  (
    'It does not say this on the label, but this thing can be used to summon rain on the spring equinox with the proper incantation.',
    3,
    7,
    3,
    2,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  ),
  (
    'Do not believe the hype!',
    1,
    7,
    4,
    1,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  ),
  (
    'I would rather have a shoulder rub.',
    3,
    9,
    1,
    2,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  ),
  (
    'I heard this has lead in it! Run! RRUUUUUUNNNN!',
    1,
    6,
    5,
    1,
    TRUE,
    FALSE,
    FALSE,
    TRUE
  ),
  (
    'This would not fit inside the cabin of my horse-and-buggy, but it was a useful bribe after the string cheese incident.',
    4,
    6,
    1,
    4,
    TRUE,
    FALSE,
    TRUE,
    FALSE
  ),
  (
    'Slightly better than waking up deep in the forests of Madagascar and having no idea how you got there, but not THAT much better.',
    3,
    2,
    5,
    4,
    TRUE,
    FALSE,
    TRUE,
    FALSE
  ),
  (
    'Octopii give it eight tentacles up!',
    5,
    8,
    1,
    4,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  );

COMMIT;
