CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    description TEXT,
    category VARCHAR(100),
    pinned BOOLEAN DEFAULT FALSE
);

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'Guest' CHECK (status IN ('Host', 'Volunteer', 'Student', 'Guest')),
    attendance BOOLEAN DEFAULT FALSE,
    note TEXT
);

CREATE TABLE IF NOT EXISTS event_participants (
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
  participant_id INTEGER REFERENCES participants(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, participant_id)
); 