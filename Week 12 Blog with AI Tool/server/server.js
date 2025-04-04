require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const pool = require('./db/connect');

// Validate required environment variables
const requiredEnvVars = ['GEMINI_API_KEY', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// specified model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: "text/plain",
};

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Route to process pasted data with Gemini
app.post('/process-match-data', async (req, res) => {
  const { pastedData, agentName } = req.body;
  
  if (!pastedData) {
    return res.status(400).json({ error: 'Pasted data is required' });
  }

  try {
    console.log('Starting match data processing...');
    console.log('Agent name:', agentName);
    console.log('Data length:', pastedData.length);
    console.log('First 100 chars of data:', pastedData.substring(0, 100));

    const prompt = `
      You are a friendly and helpful assistant.
      Ensure your answers are complete, unless the user requests a more concise approach.
      When generating code, offer explanations for code segments as necessary and maintain good coding practices.
      When presented with inquiries seeking information, provide answers that reflect a deep understanding of the field, guaranteeing their correctness.
      For any non-english queries, respond in the same language as the prompt unless otherwise specified by the user.
      For prompts involving reasoning, provide a clear explanation of each step in the reasoning process before presenting the final answer.

      Extract the following information from this Valorant match data and format it as a JSON object:
      Match date, map, result (Victory/Defeat), match duration
      
      For the match duration:
      - Format should be "MM:SS" (e.g., "13:45" for 13 minutes and 45 seconds)
      - If the duration is in seconds, convert it to minutes and seconds
      - If the duration is in minutes, add ":00" for seconds
      
      For the match date:
      - Format should be "YYYY-MM-DD HH:MM:SS" in 24-hour format
      - The server will convert it to 12-hour format for display
      
      For each player in both teams, extract these EXACT fields with these EXACT names:
      - agent: The agent name
      - rank: The player's rank
      - acs: The Combat Score (numeric value only)
      - kda: The K/D/A in format "K/D/A" (e.g., "15/10/5")
      - ddDelta: The Damage Delta (numeric value with +/- sign, e.g., "+123" or "-456")
      - adr: The Average Damage per Round (numeric value only)
      - hsPercentage: The Headshot Percentage (numeric value with % symbol, e.g., "45.6%")
      - fk: First Kills (numeric value only)
      - fd: First Deaths (numeric value only)
      
      Important formatting rules:
      1. All numeric values should be numbers, not strings
      2. KDA should be a string in the format "K/D/A"
      3. Headshot percentage should be a string with the % symbol (e.g., "45.6%")
      4. DDΔ should be a string with the +/- sign (e.g., "+123" or "-456")
      5. All other stats should be numbers
      
      Special instructions for parsing:
      1. Look for DDΔ in various formats: "DDΔ", "Damage Delta", "DD", etc.
      2. Look for HS% in various formats: "HS%", "Headshot %", "Headshot", etc.
      3. Look for FK in various formats: "FK", "First Kills", "First Kill", etc.
      4. Look for FD in various formats: "FD", "First Deaths", "First Death", etc.
      5. If a value is missing, use 0 as the default value
      6. For DDΔ, preserve the +/- sign in the output
      7. For HS%, preserve the % symbol in the output
      8. IMPORTANT: Make sure to extract ALL fields for EVERY player, even if some values are missing
      9. No two players on the same team can have the same agent.
      10. If you can't find a specific value, use a reasonable default (0 for numbers, "0%" for percentages, "+0" for damage delta)
      11. The user's team should be listed first in the data, followed by the opponent team
      12. Each team should have exactly 5 players
      13. The user's data will be the first entry in the yourTeam array
      14. For match duration, look for patterns like "MM:SS", "X minutes", "X seconds", etc.
      15. For match date, look for patterns like "MM/DD/YYYY", "YYYY-MM-DD", etc.
      
      Format the response as a JSON object with this EXACT structure:
      {
        "matchInfo": {
          "date": "YYYY-MM-DD HH:MM:SS",
          "map": "Map Name",
          "result": "Victory/Defeat",
          "duration": "MM:SS"
        },
        "yourTeam": [
          {
            "agent": "Agent Name",
            "rank": "Rank",
            "acs": 123,
            "kda": "15/10/5",
            "ddDelta": "+123",
            "adr": 123.4,
            "hsPercentage": "45.6%",
            "fk": 3,
            "fd": 2
          }
        ],
        "opponentTeam": [
          {
            "agent": "Agent Name",
            "rank": "Rank",
            "acs": 123,
            "kda": "15/10/5",
            "ddDelta": "+123",
            "adr": 123.4,
            "hsPercentage": "45.6%",
            "fk": 3,
            "fd": 2
          }
        ]
      }
      
      Here's the pasted data:
      ${pastedData}
      
      The user's agent is: ${agentName || 'Not specified'}
      
      Return ONLY the JSON object, no other text. Make sure to preserve the +/- signs for DDΔ and the % symbol for HS%.
    `;

    console.log('Initializing Gemini API call...');
    
    try {
      // Check if the API key is valid
      if (!apiKey || apiKey === 'undefined') {
        console.error('Invalid or missing Gemini API key');
        return res.status(500).json({ 
          error: 'Server configuration error',
          details: 'Invalid or missing Gemini API key'
        });
      }

      // Use chat session for better context handling
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      console.log('Sending prompt to Gemini...');
      const result = await chatSession.sendMessage(prompt);
      console.log('Received response from Gemini');
      
      if (!result || !result.response) {
        console.error('Invalid response from Gemini:', result);
        return res.status(500).json({ 
          error: 'Invalid response from Gemini API',
          details: 'Response object is missing or invalid'
        });
      }

      const responseText = result.response.text();
      console.log('Raw response from Gemini:', responseText);
      
      // Try to parse the response as JSON
      let matchData;
      try {
        matchData = JSON.parse(responseText);
        console.log('Successfully parsed JSON response');
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Raw response:', responseText);
        
        // Try to extract JSON from the response if it's not pure JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            matchData = JSON.parse(jsonMatch[0]);
            console.log('Successfully extracted and parsed JSON from response');
          } catch (extractError) {
            console.error('Error extracting JSON from response:', extractError);
            return res.status(500).json({ 
              error: 'Failed to parse AI response as JSON',
              details: extractError.message,
              rawResponse: responseText
            });
          }
        } else {
          return res.status(500).json({ 
            error: 'AI response is not in JSON format',
            details: parseError.message,
            rawResponse: responseText
          });
        }
      }
      
      res.json(matchData);
    } catch (geminiError) {
      console.error('Error with Gemini API:', geminiError);
      return res.status(500).json({ 
        error: 'Gemini API error',
        details: geminiError.message,
        stack: process.env.NODE_ENV === 'development' ? geminiError.stack : undefined
      });
    }
  } catch (error) {
    console.error("Error processing match data:", error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Route to save match data to database
app.post('/save-match', async (req, res) => {
  const { matchInfo, yourTeam, opponentTeam } = req.body;
  
  if (!matchInfo || !yourTeam || !opponentTeam) {
    return res.status(400).json({ error: 'Match data is incomplete' });
  }

  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Insert match data
    const matchResult = await client.query(
      `INSERT INTO matches (map, result, match_date, all_players_data) 
       VALUES ($1, $2, $3, $4) RETURNING match_id`,
      [
        matchInfo.map, 
        matchInfo.result, 
        matchInfo.date,
        JSON.stringify({ yourTeam, opponentTeam })
      ]
    );
    
    const matchId = matchResult.rows[0].match_id;
    
    // Insert user stats for all players
    const insertPlayerStats = async (player, team) => {
      await client.query(
        `INSERT INTO user_stats (
          match_id, agent, rank, acs, kills, deaths, assists, 
          damage_delta, adr, hs_percent, first_kills, first_deaths
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          matchId,
          player.agent,
          player.rank,
          player.acs,
          parseInt(player.kda.split('/')[0]) || 0,
          parseInt(player.kda.split('/')[1]) || 0,
          parseInt(player.kda.split('/')[2]) || 0,
          player.ddDelta || '0',
          player.adr,
          player.hsPercentage || '0%',
          player.fk || 0,
          player.fd || 0
        ]
      );
    };
    
    // Insert stats for both teams
    await Promise.all(yourTeam.map(player => insertPlayerStats(player, 'yourTeam')));
    await Promise.all(opponentTeam.map(player => insertPlayerStats(player, 'opponentTeam')));
    
    await client.query('COMMIT');
    res.json({ success: true, matchId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error saving match data:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// Route to get all matches
app.get('/matches', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        m.match_id,
        m.map,
        m.result,
        m.match_date,
        m.all_players_data,
             json_agg(json_build_object(
          'stat_id', us.stat_id,
          'agent', us.agent,
          'rank', us.rank,
          'acs', us.acs,
          'kills', us.kills,
          'deaths', us.deaths,
          'assists', us.assists,
          'damage_delta', us.damage_delta,
          'adr', us.adr,
          'hs_percent', us.hs_percent,
          'first_kills', us.first_kills,
          'first_deaths', us.first_deaths
        )) as player_stats
      FROM matches m
      LEFT JOIN user_stats us ON m.match_id = us.match_id
      GROUP BY m.match_id, m.map, m.result, m.match_date, m.all_players_data
      ORDER BY m.match_date DESC`
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to verify Gemini API
app.get('/test-gemini', async (req, res) => {
  try {
    console.log('Testing Gemini API...');
    
    // Check if the API key is valid
    if (!apiKey || apiKey === 'undefined') {
      console.error('Invalid or missing Gemini API key');
      return res.status(500).json({ 
        error: 'Server configuration error',
        details: 'Invalid or missing Gemini API key'
      });
    }
    
    const systemInstruction = `
      You are a helpful assistant.
      Ensure your answers are concise and complete.
      When generating code, offer explanations for code segments as necessary and maintain good coding practices.
      When presented with inquiries seeking information, provide answers that reflect a deep understanding of the field, guaranteeing their correctness.
      For prompts involving reasoning, provide a clear explanation of each step in the reasoning process before presenting the final answer.

    `;
    
    const result = await model.generateContent(`${systemInstruction}\n\nHello, can you respond with a simple JSON object like {"test": "success"}?`);
    const response = result.response;
    const text = response.text();
    
    console.log('Gemini test response:', text);
    
    res.json({ 
      success: true, 
      message: 'Gemini API is working',
      response: text
    });
  } catch (error) {
    console.error('Error testing Gemini API:', error);
    res.status(500).json({ 
      error: 'Gemini API test failed',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
