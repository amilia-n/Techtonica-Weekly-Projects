DROP TABLE IF EXISTS match_analysis CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

CREATE DATABASE valorant_tracker;

\c valorant_tracker;

CREATE TABLE IF NOT EXISTS matches (
    match_id SERIAL PRIMARY KEY,
    map VARCHAR(50) NOT NULL,
    result VARCHAR(10) NOT NULL CHECK (result IN ('Victory', 'Defeat')),
    match_date TIMESTAMP NOT NULL,
    duration VARCHAR(10) NOT NULL,
    all_players_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_stats (
    stat_id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(match_id) ON DELETE CASCADE,
    player_id VARCHAR(50) NOT NULL,
    agent VARCHAR(20) NOT NULL,
    rank VARCHAR(20) NOT NULL,
    acs INTEGER NOT NULL,
    kills INTEGER NOT NULL,
    deaths INTEGER NOT NULL,
    assists INTEGER NOT NULL,
    kda VARCHAR(20) NOT NULL,
    damage_delta VARCHAR(20) NOT NULL,
    adr FLOAT NOT NULL,
    hs_percent VARCHAR(20) NOT NULL,
    first_kills INTEGER NOT NULL,
    first_deaths INTEGER NOT NULL,
    team VARCHAR(10) NOT NULL CHECK (team IN ('yourTeam', 'opponentTeam')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_analysis (
    analysis_id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(match_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

