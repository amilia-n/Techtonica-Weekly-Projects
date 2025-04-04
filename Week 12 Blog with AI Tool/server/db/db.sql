-- Create the database
CREATE DATABASE valorant_tracker;

-- Switch to database
\c valorant_tracker;

-- Matches Table 
CREATE TABLE matches (
    match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    map VARCHAR(50) NOT NULL,
    result VARCHAR(10) NOT NULL CHECK (result IN ('Victory', 'Defeat')),
    match_date TIMESTAMP NOT NULL,
    duration VARCHAR(10) NOT NULL,
    all_players_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Stats Table
CREATE TABLE user_stats (
    stat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(match_id) ON DELETE CASCADE,
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

-- AI Analysis Table 
CREATE TABLE match_analysis (
    analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(match_id) ON DELETE CASCADE,
    analysis_type VARCHAR(20) NOT NULL CHECK (analysis_type IN ('match_summary', 'user_focus')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

