CREATE TABLE ideas (
  id      TEXT PRIMARY KEY,
  title   TEXT NOT NULL,
  text    TEXT NOT NULL,
  time    INTEGER NOT NULL,
  updated INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_ideas_time ON ideas(time);
