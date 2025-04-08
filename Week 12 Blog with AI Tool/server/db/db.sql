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

INSERT INTO matches (match_id, map, result, match_date, duration, all_players_data, created_at) VALUES
(1, 'Haven', 'Victory', '2025-03-20 23:28:00', '38m 32s',
'{"teamA": [{"fd": 0, "fk": 1, "acs": 300, "adr": 204.9, "kda": "27/20/10", "rank": "Silver 2", "agent": "Clove", "ddDelta": "+59", "is_user": false, "hsPercentage": "23%"}, {"fd": 3, "fk": 1, "acs": 277, "adr": 191.8, "kda": "27/15/5", "rank": "Silver 2", "agent": "Jett", "ddDelta": "+63", "is_user": false, "hsPercentage": "22%"}, {"fd": 9, "fk": 8, "acs": 241, "adr": 168.5, "kda": "19/19/7", "rank": "Silver 2", "agent": "Reyna", "ddDelta": "+13", "is_user": false, "hsPercentage": "23%"}, {"fd": 4, "fk": 0, "acs": 166, "adr": 114.9, "kda": "16/18/4", "rank": "Unranked", "agent": "Sova", "ddDelta": "-9", "is_user": false, "hsPercentage": "20%"}, {"fd": 0, "fk": 0, "acs": 120, "adr": 86.3, "kda": "9/18/6", "rank": "Bronze 2", "agent": "Killjoy", "ddDelta": "-37", "is_user": false, "hsPercentage": "16%"}], "teamB": [{"fd": 2, "fk": 7, "acs": 287, "adr": 183, "kda": "27/18/8", "rank": "Silver 3", "agent": "Reyna", "ddDelta": "+45", "is_user": false, "hsPercentage": "18%"}, {"fd": 0, "fk": 1, "acs": 242, "adr": 148.8, "kda": "21/17/4", "rank": "Unranked", "agent": "Vyse", "ddDelta": "+15", "is_user": false, "hsPercentage": "9%"}, {"fd": 4, "fk": 4, "acs": 192, "adr": 130.7, "kda": "16/20/9", "rank": "Silver 2", "agent": "Omen", "ddDelta": "-22", "is_user": false, "hsPercentage": "10%"}, {"fd": 1, "fk": 3, "acs": 182, "adr": 126.1, "kda": "16/19/5", "rank": "Silver 2", "agent": "Sage", "ddDelta": "-31", "is_user": false, "hsPercentage": "19%"}, {"fd": 3, "fk": 1, "acs": 122, "adr": 87.7, "kda": "10/24/4", "rank": "Silver 1", "agent": "Waylay", "ddDelta": "-97", "is_user": false, "hsPercentage": "28%"}]}',
'2025-04-07 21:00:06.434273'),

(2, 'Icebox', 'Victory', '2025-03-26 22:05:00', '21m 11s',
'{"teamA": [{"fd": 0, "fk": 2, "acs": 567, "adr": 367.3, "kda": "32/4/5", "rank": "Unranked", "agent": "Reyna", "ddDelta": "+258", "is_user": false, "hsPercentage": "32%"}, {"fd": 2, "fk": 1, "acs": 303, "adr": 218.9, "kda": "15/8/7", "rank": "Silver 2", "agent": "Phoenix", "ddDelta": "+78", "is_user": false, "hsPercentage": "23%"}, {"fd": 1, "fk": 1, "acs": 208, "adr": 151.4, "kda": "12/9/5", "rank": "Silver 3", "agent": "Omen", "ddDelta": "+37", "is_user": false, "hsPercentage": "32%"}, {"fd": 2, "fk": 5, "acs": 205, "adr": 128.1, "kda": "13/10/1", "rank": "Silver 1", "agent": "Chamber", "ddDelta": "+6", "is_user": false, "hsPercentage": "33%"}, {"fd": 1, "fk": 0, "acs": 46, "adr": 43.3, "kda": "1/8/5", "rank": "Silver 1", "agent": "Killjoy", "ddDelta": "-49", "is_user": false, "hsPercentage": "12%"}], "teamB": [{"fd": 0, "fk": 0, "acs": 289, "adr": 185.5, "kda": "15/15/3", "rank": "Silver 2", "agent": "Clove", "ddDelta": "-10", "is_user": false, "hsPercentage": "16%"}, {"fd": 3, "fk": 2, "acs": 205, "adr": 134.9, "kda": "9/15/4", "rank": "Silver 1", "agent": "Iso", "ddDelta": "-54", "is_user": false, "hsPercentage": "12%"}, {"fd": 0, "fk": 1, "acs": 126, "adr": 110.5, "kda": "4/14/4", "rank": "Gold 2", "agent": "Reyna", "ddDelta": "-72", "is_user": false, "hsPercentage": "13%"}, {"fd": 0, "fk": 1, "acs": 109, "adr": 79.1, "kda": "5/14/3", "rank": "Bronze 2", "agent": "Killjoy", "ddDelta": "-93", "is_user": false, "hsPercentage": "5%"}, {"fd": 6, "fk": 2, "acs": 106, "adr": 69.1, "kda": "5/15/2", "rank": "Bronze 3", "agent": "Chamber", "ddDelta": "-101", "is_user": false, "hsPercentage": "0%"}]}',
'2025-04-07 21:12:18.943954'),

(3, 'Pearl', 'Defeat', '2025-03-24 22:23:00', '9m 40s',
'{"teamA": [{"fd": 0, "fk": 1, "acs": 260, "adr": 174.2, "kda": "4/6/0", "rank": "Silver 2", "agent": "Clove", "ddDelta": "-30", "is_user": false, "hsPercentage": "27%"}, {"fd": 0, "fk": 0, "acs": 217, "adr": 161.2, "kda": "3/5/0", "rank": "Bronze 2", "agent": "Killjoy", "ddDelta": "-8", "is_user": false, "hsPercentage": "9%"}, {"fd": 0, "fk": 2, "acs": 144, "adr": 93.2, "kda": "2/5/0", "rank": "Bronze 3", "agent": "Reyna", "ddDelta": "-88", "is_user": false, "hsPercentage": "0%"}, {"fd": 1, "fk": 0, "acs": 125, "adr": 72, "kda": "2/5/2", "rank": "Silver 2", "agent": "Deadlock", "ddDelta": "-112", "is_user": false, "hsPercentage": "17%"}, {"fd": 1, "fk": 0, "acs": 70, "adr": 45, "kda": "1/5/0", "rank": "Silver 3", "agent": "Jett", "ddDelta": "-129", "is_user": false, "hsPercentage": "14%"}], "teamB": [{"fd": 2, "fk": 1, "acs": 522, "adr": 316.4, "kda": "10/3/4", "rank": "Silver 1", "agent": "Clove", "ddDelta": "+160", "is_user": false, "hsPercentage": "23%"}, {"fd": 0, "fk": 1, "acs": 459, "adr": 265.2, "kda": "10/0/0", "rank": "Silver 2", "agent": "Reyna", "ddDelta": "+225", "is_user": false, "hsPercentage": "19%"}, {"fd": 0, "fk": 0, "acs": 182, "adr": 133, "kda": "3/3/4", "rank": "Silver 3", "agent": "Gekko", "ddDelta": "+10", "is_user": false, "hsPercentage": "31%"}, {"fd": 1, "fk": 0, "acs": 146, "adr": 109, "kda": "2/3/2", "rank": "Platinum 1", "agent": "Jett", "ddDelta": "+9", "is_user": false, "hsPercentage": "14%"}, {"fd": 0, "fk": 0, "acs": 122, "adr": 88.6, "kda": "1/3/4", "rank": "Silver 1", "agent": "Cypher", "ddDelta": "-37", "is_user": false, "hsPercentage": "17%"}]}',
'2025-04-07 21:23:58.926541');


INSERT INTO match_analysis (analysis_id, match_id, content, created_at) VALUES
(1, 1, 'This match highlights a significant fragging disparity. While both teams had strong top performers (Team A''s Clove/Jett, Team B''s Reyna/Vyse), Team B struggled with consistency further down the scoreboard.

Team B''s Waylay, Omen, and Sage had notably lower impact (ACS, ADR, DD Delta) compared to their counterparts. Waylay''s -97 Damage Delta and 10/24 KDA indicate difficulty finding advantageous engagements or surviving trades.

To improve, Team B should focus on better coordination to support entry fraggers (like Reyna) and enable players in supportive roles (Omen, Sage, Waylay) to contribute more consistently through utility usage, trading, and positioning. Reducing deaths without securing trades, especially for the bottom fraggers, is crucial. Analyzing individual VODs for positioning errors and utility timing would be beneficial.', '2025-04-07 21:00:17.632917'),

(2, 2, 'This was a heavily one-sided match, primarily driven by Team A''s Reyna, whose performance significantly outpaced everyone else. Team A showed strong fragging overall, with positive damage differentials across most players, except for Killjoy who struggled immensely.

Team B faced significant challenges. Multiple players had very low combat scores, high deaths, and negative damage differentials, indicating struggles in duels and overall impact. Key areas for improvement for Team B include fundamental gunplay (low headshot percentages), surviving opening engagements (high first deaths for Chamber), and coordinated utility usage to counter aggressive plays. Focus on trading effectively and improving crosshair placement to secure more impactful rounds.', '2025-04-07 21:12:28.882382'),

(3, 3, 'This was a challenging match, primarily due to significant deficits in duels across your team, reflected in the negative DD Deltas and low ACS scores. The opposing Clove and Reyna dominated engagements.

Focus areas for improvement:

1.  **Duel Efficiency:** Practice aim and crosshair placement to increase headshot percentage and win more initial fights. Your team collectively struggled in 1v1s.
2.  **Impact & Trading:** Key agents like Reyna and Jett had low impact (ADR, KDA). Work on coordinated entries, using utility effectively to create space, and ensuring teammates are positioned to trade kills.
3.  **Economic Management:** Losing rounds heavily impacts economy; focus on impactful buys and save-round strategies.

Improving fundamental gunplay and team coordination during site executes and retakes is crucial.', '2025-04-07 21:24:10.775622');
