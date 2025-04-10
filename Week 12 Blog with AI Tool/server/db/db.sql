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
    agent VARCHAR(20) NOT NULL,
    result VARCHAR(10) NOT NULL CHECK (result IN ('Victory', 'Defeat')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS match_analysis (
    analysis_id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(match_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO matches (
  match_id, map, result, match_date, duration, all_players_data, created_at
) VALUES
(
  1,
  'Pearl',
  'Victory',
  '2025-04-08 23:39:00',
  '34m 42s',
  '{"teamA": [{"acs": 351, "adr": 223.6, "kda": "28/15/4", "rank": "Gold 1", "team": "teamA", "agent": "Clove", "kills": 28, "deaths": 15, "assists": 4, "player_id": "ArchieR#9250", "hs_percent": "22%", "first_kills": 4, "damage_delta": "+87", "first_deaths": 3}, {"acs": 198, "adr": 148.1, "kda": "14/16/5", "rank": "Bronze 1", "team": "teamA", "agent": "Breach", "kills": 14, "deaths": 16, "assists": 5, "player_id": "Ulquiorra#punch", "hs_percent": "25%", "first_kills": 1, "damage_delta": "+10", "first_deaths": 2}, {"acs": 197, "adr": 130.9, "kda": "14/18/5", "rank": "Silver 1", "team": "teamA", "agent": "Reyna", "kills": 14, "deaths": 18, "assists": 5, "player_id": "black flag bf#danie", "hs_percent": "14%", "first_kills": 4, "damage_delta": "-36", "first_deaths": 5}, {"acs": 188, "adr": 122, "kda": "14/14/9", "rank": "Silver 1", "team": "teamA", "agent": "Gekko", "kills": 14, "deaths": 14, "assists": 9, "player_id": "rakka#2515", "hs_percent": "18%", "first_kills": 1, "damage_delta": "-17", "first_deaths": 1}, {"acs": 128, "adr": 82.6, "kda": "9/12/2", "rank": "Bronze 2", "team": "teamA", "agent": "Killjoy", "kills": 9, "deaths": 12, "assists": 2, "player_id": "MikeLiterus#264", "hs_percent": "6%", "first_kills": 0, "damage_delta": "-42", "first_deaths": 0}], "teamB": [{"acs": 265, "adr": 179, "kda": "21/14/4", "rank": "Bronze 3", "team": "teamB", "agent": "Chamber", "kills": 21, "deaths": 14, "assists": 4, "player_id": "WOMPWOMP123#6969", "hs_percent": "13%", "first_kills": 2, "damage_delta": "+47", "first_deaths": 1}, {"acs": 259, "adr": 174.5, "kda": "17/14/6", "rank": "Silver 2", "team": "teamB", "agent": "Cypher", "kills": 17, "deaths": 14, "assists": 6, "player_id": "HighLightPR kick#5397", "hs_percent": "14%", "first_kills": 2, "damage_delta": "+43", "first_deaths": 2}, {"acs": 211, "adr": 145.9, "kda": "14/18/8", "rank": "Bronze 3", "team": "teamB", "agent": "Iso", "kills": 14, "deaths": 18, "assists": 8, "player_id": "Apollo#KBG7", "hs_percent": "19%", "first_kills": 2, "damage_delta": "-13", "first_deaths": 4}, {"acs": 196, "adr": 134.1, "kda": "15/17/7", "rank": "Bronze 2", "team": "teamB", "agent": "Omen", "kills": 15, "deaths": 17, "assists": 7, "player_id": "ƒlax#ƒlax", "hs_percent": "25%", "first_kills": 4, "damage_delta": "-12", "first_deaths": 2}, {"acs": 126, "adr": 73.1, "kda": "8/16/6", "rank": "Bronze 3", "team": "teamB", "agent": "Gekko", "kills": 8, "deaths": 16, "assists": 6, "player_id": "Sword#ANDY", "hs_percent": "14%", "first_kills": 1, "damage_delta": "-66", "first_deaths": 1}]}',
  '2025-04-09 20:31:05.828235'
),
(
  2,
  'Ascent',
  'Defeat',
  '2025-04-08 22:54:00',
  '27m 16s',
  '{"teamA": [{"acs": 276, "adr": 157.9, "kda": "14/15/3", "rank": "Bronze 1", "team": "teamA", "agent": "Breach", "kills": 14, "deaths": 15, "assists": 3, "player_id": "Ulquiorra#punch", "hs_percent": "6%", "first_kills": 1, "damage_delta": "-6", "first_deaths": 3}, {"acs": 180, "adr": 118.2, "kda": "9/14/3", "rank": "Bronze 3", "team": "teamA", "agent": "Tejo", "kills": 9, "deaths": 14, "assists": 3, "player_id": "비둘기가끼룩끼룩#한국사람", "hs_percent": "11%", "first_kills": 4, "damage_delta": "-50", "first_deaths": 2}, {"acs": 113, "adr": 74.5, "kda": "5/13/4", "rank": "Silver 1", "team": "teamA", "agent": "Brimstone", "kills": 5, "deaths": 13, "assists": 4, "player_id": "Zorn#not2b", "hs_percent": "6%", "first_kills": 0, "damage_delta": "-67", "first_deaths": 0}, {"acs": 102, "adr": 83, "kda": "3/13/2", "rank": "Bronze 2", "team": "teamA", "agent": "Killjoy", "kills": 3, "deaths": 13, "assists": 2, "player_id": "MikeLiterus#264", "hs_percent": "8%", "first_kills": 0, "damage_delta": "-52", "first_deaths": 1}, {"acs": 101, "adr": 63.5, "kda": "5/6/4", "rank": "Silver 2", "team": "teamA", "agent": "Reyna", "kills": 5, "deaths": 6, "assists": 4, "player_id": "Ilikebread#888", "hs_percent": "14%", "first_kills": 2, "damage_delta": "-13", "first_deaths": 2}], "teamB": [{"acs": 357, "adr": 225.2, "kda": "20/8/3", "rank": "Bronze 3", "team": "teamB", "agent": "Jett", "kills": 20, "deaths": 8, "assists": 3, "player_id": "Mr Man#PG13", "hs_percent": "25%", "first_kills": 4, "damage_delta": "+117", "first_deaths": 2}, {"acs": 249, "adr": 159.2, "kda": "15/5/7", "rank": "Bronze 1", "team": "teamB", "agent": "Sage", "kills": 15, "deaths": 5, "assists": 7, "player_id": "barkmaxxing#JnH24", "hs_percent": "10%", "first_kills": 0, "damage_delta": "+69", "first_deaths": 1}, {"acs": 180, "adr": 110.4, "kda": "11/4/2", "rank": "Silver 1", "team": "teamB", "agent": "Fade", "kills": 11, "deaths": 4, "assists": 2, "player_id": "yaoifemboy#slay", "hs_percent": "26%", "first_kills": 1, "damage_delta": "+54", "first_deaths": 0}, {"acs": 170, "adr": 105.1, "kda": "10/8/5", "rank": "Bronze 3", "team": "teamB", "agent": "Omen", "kills": 10, "deaths": 8, "assists": 5, "player_id": "meowmaxxing#mommy", "hs_percent": "13%", "first_kills": 1, "damage_delta": "-5", "first_deaths": 1}, {"acs": 106, "adr": 86.2, "kda": "5/11/4", "rank": "Bronze 2", "team": "teamB", "agent": "Iso", "kills": 5, "deaths": 11, "assists": 4, "player_id": "yurilatina#hawt", "hs_percent": "14%", "first_kills": 2, "damage_delta": "-46", "first_deaths": 3}]}',
  '2025-04-09 20:33:04.433068'
),
(
  3,
  'Split',
  'Defeat',
  '2025-04-08 00:33:00',
  '35m 37s',
  '{"teamA": [{"acs": 430, "adr": 283.1, "kda": "32/17/3", "rank": "Gold 3", "team": "teamA", "agent": "Reyna", "kills": 32, "deaths": 17, "assists": 3, "player_id": "Dua Lipa#NA3", "hs_percent": "26%", "first_kills": 8, "damage_delta": "+107", "first_deaths": 4}, {"acs": 235, "adr": 142.8, "kda": "18/17/4", "rank": "Bronze 1", "team": "teamA", "agent": "Viper", "kills": 18, "deaths": 17, "assists": 4, "player_id": "Ulquiorra#punch", "hs_percent": "16%", "first_kills": 0, "damage_delta": "-33", "first_deaths": 0}, {"acs": 228, "adr": 150.2, "kda": "15/21/5", "rank": "Silver 1", "team": "teamA", "agent": "Clove", "kills": 15, "deaths": 21, "assists": 5, "player_id": "black flag bf#danie", "hs_percent": "20%", "first_kills": 2, "damage_delta": "-28", "first_deaths": 2}, {"acs": 139, "adr": 96.9, "kda": "11/16/5", "rank": "Silver 3", "team": "teamA", "agent": "Skye", "kills": 11, "deaths": 16, "assists": 5, "player_id": "LlamaLord224#fluff", "hs_percent": "26%", "first_kills": 2, "damage_delta": "-45", "first_deaths": 2}, {"acs": 96, "adr": 79.6, "kda": "6/10/3", "rank": "Bronze 2", "team": "teamA", "agent": "Killjoy", "kills": 6, "deaths": 10, "assists": 3, "player_id": "MikeLiterus#264", "hs_percent": "12%", "first_kills": 0, "damage_delta": "-21", "first_deaths": 1}], "teamB": [{"acs": 408, "adr": 270.1, "kda": "33/12/6", "rank": "Silver 2", "team": "teamB", "agent": "Yoru", "kills": 33, "deaths": 12, "assists": 6, "player_id": "Kerropi#444", "hs_percent": "23%", "first_kills": 3, "damage_delta": "+128", "first_deaths": 2}, {"acs": 240, "adr": 172.1, "kda": "16/17/11", "rank": "Silver 3", "team": "teamB", "agent": "Sage", "kills": 16, "deaths": 17, "assists": 11, "player_id": "Steamroller42#xuxu", "hs_percent": "13%", "first_kills": 2, "damage_delta": "+21", "first_deaths": 3}, {"acs": 210, "adr": 140.7, "kda": "13/21/10", "rank": "Bronze 3", "team": "teamB", "agent": "Clove", "kills": 13, "deaths": 21, "assists": 10, "player_id": "Ehku#3235", "hs_percent": "12%", "first_kills": 2, "damage_delta": "-38", "first_deaths": 4}, {"acs": 158, "adr": 115.6, "kda": "12/18/5", "rank": "Silver 1", "team": "teamB", "agent": "Iso", "kills": 12, "deaths": 18, "assists": 5, "player_id": "BeJo#42069", "hs_percent": "31%", "first_kills": 2, "damage_delta": "-42", "first_deaths": 1}, {"acs": 89, "adr": 73.7, "kda": "6/15/4", "rank": "Unranked", "team": "teamB", "agent": "Sova", "kills": 6, "deaths": 15, "assists": 4, "player_id": "Kookie#Dooki", "hs_percent": "13%", "first_kills": 0, "damage_delta": "-50", "first_deaths": 2}]}',
  '2025-04-09 20:35:21.492884'
),
(
  4,
  'Icebox',
  'Tie',
  '2025-03-10 23:08:00',
  '44m 41s',
  '{"teamA": [{"acs": 262, "adr": 167.6, "kda": "25/18/10", "rank": "Gold 3", "team": "teamA", "agent": "Cypher", "kills": 25, "deaths": 18, "assists": 10, "player_id": "JayMo#deez", "hs_percent": "21%", "first_kills": 2, "damage_delta": "+43", "first_deaths": 0}, {"acs": 233, "adr": 139.8, "kda": "22/22/6", "rank": "Unranked", "team": "teamA", "agent": "Reyna", "kills": 22, "deaths": 22, "assists": 6, "player_id": "Lfholmes#4508", "hs_percent": "26%", "first_kills": 5, "damage_delta": "-14", "first_deaths": 6}, {"acs": 225, "adr": 144.1, "kda": "20/21/7", "rank": "Gold 1", "team": "teamA", "agent": "Viper", "kills": 20, "deaths": 21, "assists": 7, "player_id": "I XXP I#NA1", "hs_percent": "24%", "first_kills": 3, "damage_delta": "-8", "first_deaths": 3}, {"acs": 215, "adr": 148.8, "kda": "21/19/4", "rank": "Gold 2", "team": "teamA", "agent": "Sova", "kills": 21, "deaths": 19, "assists": 4, "player_id": "izak#4853", "hs_percent": "19%", "first_kills": 0, "damage_delta": "-2", "first_deaths": 1}, {"acs": 163, "adr": 88.1, "kda": "17/22/0", "rank": "Gold 1", "team": "teamA", "agent": "Iso", "kills": 17, "deaths": 22, "assists": 0, "player_id": "kungpaochicken#zest", "hs_percent": "28%", "first_kills": 3, "damage_delta": "-61", "first_deaths": 5}], "teamB": [{"acs": 344, "adr": 227, "kda": "33/21/6", "rank": "Silver 3", "team": "teamB", "agent": "Jett", "kills": 33, "deaths": 21, "assists": 6, "player_id": "Bread#264", "hs_percent": "20%", "first_kills": 7, "damage_delta": "+87", "first_deaths": 5}, {"acs": 261, "adr": 174.9, "kda": "26/22/11", "rank": "Platinum 1", "team": "teamB", "agent": "Brimstone", "kills": 26, "deaths": 22, "assists": 11, "player_id": "salami batman#444", "hs_percent": "23%", "first_kills": 3, "damage_delta": "+34", "first_deaths": 4}, {"acs": 204, "adr": 137.8, "kda": "18/24/5", "rank": "Silver 2", "team": "teamB", "agent": "Neon", "kills": 18, "deaths": 24, "assists": 5, "player_id": "Ilikebread#888", "hs_percent": "18%", "first_kills": 3, "damage_delta": "-16", "first_deaths": 2}, {"acs": 166, "adr": 101.7, "kda": "18/19/3", "rank": "Platinum 2", "team": "teamB", "agent": "Sage", "kills": 18, "deaths": 19, "assists": 3, "player_id": "PotatoStarch#4474", "hs_percent": "17%", "first_kills": 1, "damage_delta": "-30", "first_deaths": 2}, {"acs": 110, "adr": 89.3, "kda": "7/19/7", "rank": "Bronze 2", "team": "teamB", "agent": "Killjoy", "kills": 7, "deaths": 19, "assists": 7, "player_id": "MikeLiterus#264", "hs_percent": "5%", "first_kills": 1, "damage_delta": "-33", "first_deaths": 0}]}',
  '2025-04-09 20:38:04.51274'
);
INSERT INTO user_stats (stat_id, match_id, agent, result, created_at)
VALUES
  (1, 1, 'Killjoy', 'Victory', '2025-04-09 20:31:05.828235'),
  (2, 2, 'Killjoy', 'Defeat', '2025-04-09 20:33:04.433068'),
  (3, 3, 'Killjoy', 'Defeat', '2025-04-09 20:35:21.492884'),
  (4, 4, 'Killjoy', 'Tie', '2025-04-09 20:38:04.51274');

INSERT INTO match_analysis (analysis_id, match_id, content, created_at)
VALUES
    (1, 1, 'Team A secured the victory, primarily fueled by Clove''s dominant performance (351 ACS). While a win is positive, there was a significant reliance on one player.

The Killjoy contributed defensively but had the lowest combat score (128 ACS) and minimal impact in duels (9 kills, 82.6 ADR, 6% HS). While Killjoy often plays passively, focus on improving survivability and gunfight contribution during site holds or retakes. Enhance utility placement to maximize impact, potentially generating more assists and controlling space effectively even without direct kills. Aim for more consistent impact across all roles to ensure less dependency on standout individual performances for future wins. Refining crosshair placement and positioning will be beneficial.', '2025-04-09 20:31:21.09969'),
    (2, 2, 'Okay, let''s break down this match.

Team A clearly struggled, reflected in the overall low ACS and negative KDAs compared to Team B. Focusing on Killjoy, the performance (102 ACS, 3/13/2 KDA, 83 ADR) indicates a significant lack of impact. This suggests issues with either utility placement effectiveness (turret/mollies not getting value) or difficulties surviving engagements to maintain site control. The high death count across the team, especially on key roles like Killjoy and Brimstone, points to potential problems with site holds, retake coordination, or passive positioning.

**Improvement Focus:** Killjoy needs to optimize setup locations for better information gathering and delaying pushes. Prioritize survival to maintain map control longer. The team should work on coordinated pushes/retakes and trading kills more effectively to support site anchors like Killjoy.', '2025-04-09 20:34:29.189361'),
    (3, 3, 'Team A''s defeat highlights a significant performance disparity. While the Reyna achieved high impact (430 ACS), the team lacked consistent contribution, especially from Killjoy. With the lowest ACS (96) and ADR (79.6), Killjoy''s presence was minimally felt. The 6/10/3 KDA suggests setups were often broken without trade or significant delay.

Improvement requires Killjoy to focus on more impactful utility placement for intel and site control, enhancing survivability and contribution even if not securing kills directly. The team needs better coordination to support entries and avoid over-reliance on one player, ensuring sentinels can effectively anchor sites or play post-plant scenarios. Increased map control and trading efficiency are crucial.', '2025-04-09 20:35:39.997285'),
    (4, 4, 'Okay, let''s break down this tied match.

Team B showed strong top-end fragging from Jett and Brimstone, keeping the game close. However, the Killjoy''s performance was a significant weak point. An ACS of 110 and ADR of 89.3 indicate very low round impact, both through damage and utility effectiveness. The 7/19/7 KDA and particularly the 5% headshot rate suggest struggles in gunfights and possibly poor positioning leading to frequent deaths.

**Improvement Focus:** The Killjoy player needs dedicated aim training (crosshair placement, recoil control) and practice on defensive setups. Understanding how to use turrets for info/crossfires and mollies for denial, even without direct kills, is crucial. Reviewing VODs for better positioning to stay alive longer and contribute utility will be key to climbing.', '2025-04-09 20:38:22.37192');

