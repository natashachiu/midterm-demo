
DROP TABLE IF EXISTS upvoted_contributions CASCADE;
CREATE TABLE upvoted_contributions (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  contribution_id INTEGER REFERENCES contributions(id) ON DELETE CASCADE
);
