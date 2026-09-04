ALTER TABLE ideas ADD COLUMN status TEXT NOT NULL DEFAULT 'todo';
ALTER TABLE ideas ADD COLUMN notes TEXT NOT NULL DEFAULT '';
CREATE INDEX idx_ideas_status ON ideas(status);
