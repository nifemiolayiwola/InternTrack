-- Spike S-01 schema (throwaway)
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE applications (
  id      SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status  TEXT NOT NULL CHECK (status IN ('Applied', 'Interviewing', 'Offered', 'Rejected'))
);

CREATE INDEX idx_applications_user_id ON applications(user_id);
