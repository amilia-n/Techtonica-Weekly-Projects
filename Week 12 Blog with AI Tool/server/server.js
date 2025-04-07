require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const pool = require('./db/connect');
const fs = require("node:fs");
const mime = require("mime-types");

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const requiredEnvVars = ['GEMINI_API_KEY', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [
  ],
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      matchInfo: {
        type: "object",
        properties: {
          date: {
            type: "string"
          },
          map: {
            type: "string"
          },
          result: {
            type: "string",
            enum: [
              "Victory",
              "Defeat"
            ]
          },
          duration: {
            type: "string"
          }
        },
        required: [
          "date",
          "map",
          "result",
          "duration"
        ]
      },
      teamA: {
        type: "array",
        items: {
          type: "object",
          properties: {
            player_id: {
              type: "string"
            },
            agent: {
              type: "string"
            },
            rank: {
              type: "string"
            },
            acs: {
              type: "number"
            },
            kda: {
              type: "string"
            },
            ddDelta: {
              type: "string"
            },
            adr: {
              type: "number"
            },
            hsPercentage: {
              type: "string"
            },
            fk: {
              type: "number"
            },
            fd: {
              type: "number"
            }
          },
          required: [
            "player_id",
            "agent",
            "rank",
            "acs",
            "kda",
            "ddDelta",
            "adr",
            "hsPercentage",
            "fk",
            "fd"
          ]
        }
      },
      teamB: {
        type: "array",
        items: {
          type: "object",
          properties: {
            player_id: {
              type: "string"
            },
            agent: {
              type: "string"
            },
            rank: {
              type: "string"
            },
            acs: {
              type: "number"
            },
            kda: {
              type: "string"
            },
            ddDelta: {
              type: "string"
            },
            adr: {
              type: "number"
            },
            hsPercentage: {
              type: "string"
            },
            fk: {
              type: "number"
            },
            fd: {
              type: "number"
            }
          },
          required: [
            "player_id",
            "agent",
            "rank",
            "acs",
            "kda",
            "ddDelta",
            "adr",
            "hsPercentage",
            "fk",
            "fd"
          ]
        }
      }
    },
    required: [
      "matchInfo",
      "teamA",
      "teamB"
    ]
  },
};

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


    console.log('Initializing Gemini API call...');
    
    try {
      if (!apiKey || apiKey === 'undefined') {
        console.error('Invalid or missing Gemini API key');
        return res.status(500).json({ 
          error: 'Server configuration error',
          details: 'Invalid or missing Gemini API key'
        });
      }

      const chatSession = model.startChat({
        generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {text: "Parse this raw match data into the structured JSON format specified: \n${pastedData}\nThis is my sample data: \nCompetitive\nIcebox\nTeam A\n13\n \n:\nTeam B\n2\n3/26/25, 10:05 PM\n21m 11s\nAverage Rank\nSilver IISilver II\nScoreboard\nPerformance\nEconomy\nRounds\nDuels\nTeam A\n13\nTeam B\n2\n•\nElimination\n1\n•\nElimination\n2\nElimination\n•\n3\nElimination\n•\n4\nElimination\n•\n5\nElimination\n•\n6\nElimination\n•\n7\nElimination\n•\n8\nElimination\n•\n9\nElimination\n•\n10\nElimination\n•\n11\nElimination\n•\n12\nElimination\n•\n13\nElimination\n•\n14\nElimination\n•\n15\nTeam A\n•\nAvg. Rank:\nSilver ISilver I\nMatch Rank\nTRS\nACS\nK\nD\nA\n+/-\nK/D\nDDΔ\nADR\nHS%\nKAST\nFK\nFD\nMK\nReyna\n37\nPorchiewhippa69\n#AK10\nUnranked\nUnranked\nUnranked\n\n1,000\n567\n32\n4\n5\n+28\n8.0\n+258\n367.3\n32%\n93%\n2\n0\n5\nPhoenix\n147\nDeathonic\n#NA1\nSilver 2\nSilver 2\nSilver 2\n\n907\n303\n15\n8\n7\n+7\n1.9\n+78\n218.9\n23%\n80%\n1\n2\n2\nOmen\n139\nAGEBEEB\n#BBMFC\nSilver 3\nSilver 3\nSilver 3\n\n796\n208\n12\n9\n5\n+3\n1.3\n+37\n151.4\n32%\n87%\n1\n1\n1\nChamber\n132\nZawazawa\n#5518\nSilver 1\nSilver 1\nBronze 3\n\n692\n205\n13\n10\n1\n+3\n1.3\n+6\n128.1\n33%\n80%\n5\n2\n0\nKilljoy\n484\nvenus\n#jaz\nSilver 1\nSilver 1\nBronze 3\n\n437\n46\n1\n8\n5\n-7\n0.1\n-49\n43.3\n12%\n80%\n0\n1\n0\nTeam B\n•\nAvg. Rank:\nSilver IISilver II\nMatch Rank\nTRS\nACS\nK\nD\nA\n+/-\nK/D\nDDΔ\nADR\nHS%\nKAST\nFK\nFD\nMK\nClove\n37\nIlikebread\n#888\nSilver 2\nSilver 2\nSilver 2\n\n627\n289\n15\n15\n3\n1.0\n-10\n185.5\n16%\n80%\n0\n0\n2\nIso\n78\nSATCHEL OUT\n#2722\nSilver 1\nSilver 1\nSilver 2\n\n226\n205\n9\n15\n4\n-6\n0.6\n-54\n134.9\n12%\n53%\n2\n3\n0\nReyna\n37\nHubby\n#foyou\nGold 2\nGold 2\nGold 2\n\n100\n126\n4\n14\n4\n-10\n0.3\n-72\n110.5\n13%\n47%\n1\n0\n0\nKilljoy\n170\nMikeLiterus\n#264\nBronze 3\nBronze 3\nBronze 3\n\n100\n109\n5\n14\n3\n-9\n0.4\n-93\n79.1\n5%\n47%\n1\n0\n0\nChamber\n115\nDevil\n#NBG5\nBronze 3\nBronze 3\nSilver 2\n\n100\n106\n5\n15\n2\n-10\n0.3\n-101\n69.1\n0%\n47%\n2\n6\n0"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "The user wants to parse raw match data into a JSON format based on the provided schema.\n\nHere's the plan:\n1.  Extract the general match information: Date, Duration, Map, Result (based on Team A's perspective).\n2.  Extract player data for Team A.\n3.  Extract player data for Team B.\n4.  Structure the extracted data according to the JSON schema.\n\n**Match Info Extraction:**\n*   Date: \"3/26/25, 10:05 PM\"\n*   Duration: \"21m 11s\"\n*   Map: \"Icebox\"\n*   Result: Team A scored 13, Team B scored 2. Team A won. So, \"Victory\".\n\n**Team A Player Data Extraction:**\n*   **Player 1:**\n    *   Agent: \"Reyna\"\n    *   Player ID: \"Porchiewhippa69#AK10\"\n    *   Rank: \"Unranked\" (Use the first rank listed)\n    *   ACS: 567 (Need to convert to float 1.23 format - schema says 1.23, but example shows integer. Let's assume it should be float. ACS is Average Combat Score, usually an integer or float with decimals. The raw data shows 567. The schema expects 1.23 format. This seems like a mismatch. Let's use the raw number 567.0 for now, assuming schema meant float) -> Let's use 567.0\n    *   KDA: \"32/4/5\"\n    *   DDΔ: \"+258\"\n    *   ADR: 367.3\n    *   HS%: \"32%\"\n    *   FK: 2 (integer) -> Need to convert to float 2.0\n    *   FD: 0 (integer) -> Need to convert to float 0.0\n*   **Player 2:**\n    *   Agent: \"Phoenix\"\n    *   Player ID: \"Deathonic#NA1\"\n    *   Rank: \"Silver 2\"\n    *   ACS: 303.0\n    *   KDA: \"15/8/7\"\n    *   DDΔ: \"+78\"\n    *   ADR: 218.9\n    *   HS%: \"23%\"\n    *   FK: 1.0\n    *   FD: 2.0\n*   **Player 3:**\n    *   Agent: \"Omen\"\n    *   Player ID: \"AGEBEEB#BBMFC\"\n    *   Rank: \"Silver 3\"\n    *   ACS: 208.0\n    *   KDA: \"12/9/5\"\n    *   DDΔ: \"+37\"\n    *   ADR: 151.4\n    *   HS%: \"32%\"\n    *   FK: 1.0\n    *   FD: 1.0\n*   **Player 4:**\n    *   Agent: \"Chamber\"\n    *   Player ID: \"Zawazawa#5518\"\n    *   Rank: \"Silver 1\"\n    *   ACS: 205.0\n    *   KDA: \"13/10/1\"\n    *   DDΔ: \"+6\"\n    *   ADR: 128.1\n    *   HS%: \"33%\"\n    *   FK: 5.0\n    *   FD: 2.0\n*   **Player 5:**\n    *   Agent: \"Killjoy\"\n    *   Player ID: \"venus#jaz\"\n    *   Rank: \"Silver 1\"\n    *   ACS: 46.0\n    *   KDA: \"1/8/5\"\n    *   DDΔ: \"-49\"\n    *   ADR: 43.3\n    *   HS%: \"12%\"\n    *   FK: 0.0\n    *   FD: 1.0\n\n**Team B Player Data Extraction:**\n*   **Player 1:**\n    *   Agent: \"Clove\"\n    *   Player ID: \"Ilikebread#888\"\n    *   Rank: \"Silver 2\"\n    *   ACS: 289.0\n    *   KDA: \"15/15/3\"\n    *   DDΔ: \"-10\"\n    *   ADR: 185.5\n    *   HS%: \"16%\"\n    *   FK: 0.0\n    *   FD: 0.0\n*   **Player 2:**\n    *   Agent: \"Iso\"\n    *   Player ID: \"SATCHEL OUT#2722\"\n    *   Rank: \"Silver 1\"\n    *   ACS: 205.0\n    *   KDA: \"9/15/4\"\n    *   DDΔ: \"-54\"\n    *   ADR: 134.9\n    *   HS%: \"12%\"\n    *   FK: 2.0\n    *   FD: 3.0\n*   **Player 3:**\n    *   Agent: \"Reyna\"\n    *   Player ID: \"Hubby#foyou\"\n    *   Rank: \"Gold 2\"\n    *   ACS: 126.0\n    *   KDA: \"4/14/4\"\n    *   DDΔ: \"-72\"\n    *   ADR: 110.5\n    *   HS%: \"13%\"\n    *   FK: 1.0\n    *   FD: 0.0\n*   **Player 4:**\n    *   Agent: \"Killjoy\"\n    *   Player ID: \"MikeLiterus#264\"\n    *   Rank: \"Bronze 3\"\n    *   ACS: 109.0\n    *   KDA: \"5/14/3\"\n    *   DDΔ: \"-93\"\n    *   ADR: 79.1\n    *   HS%: \"5%\"\n    *   FK: 1.0\n    *   FD: 0.0\n*   **Player 5:**\n    *   Agent: \"Chamber\"\n    *   Player ID: \"Devil#NBG5\"\n    *   Rank: \"Bronze 3\"\n    *   ACS: 106.0\n    *   KDA: \"5/15/2\"\n    *   DDΔ: \"-101\"\n    *   ADR: 69.1\n    *   HS%: \"0%\"\n    *   FK: 2.0\n    *   FD: 6.0\n\n**Constructing the JSON:**\nCombine the extracted information following the schema structure. Ensure numeric values like ACS, ADR, FK, FD are represented as floats (e.g., 567.0, 2.0, 0.0). KDA, DDΔ, HS% should be strings."},
          {text: "{\n  \"matchInfo\": {\n    \"date\": \"3/26/25, 10:05 PM\",\n    \"duration\": \"21m 11s\",\n    \"map\": \"Icebox\",\n    \"result\": \"Victory\"\n  },\n  \"teamA\": [\n    {\n      \"acs\": 567.0,\n      \"adr\": 367.3,\n      \"agent\": \"Reyna\",\n      \"ddDelta\": \"+258\",\n      \"fd\": 0.0,\n      \"fk\": 2.0,\n      \"hsPercentage\": \"32%\",\n      \"kda\": \"32/4/5\",\n      \"player_id\": \"Porchiewhippa69#AK10\",\n      \"rank\": \"Unranked\"\n    },\n    {\n      \"acs\": 303.0,\n      \"adr\": 218.9,\n      \"agent\": \"Phoenix\",\n      \"ddDelta\": \"+78\",\n      \"fd\": 2.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"23%\",\n      \"kda\": \"15/8/7\",\n      \"player_id\": \"Deathonic#NA1\",\n      \"rank\": \"Silver 2\"\n    },\n    {\n      \"acs\": 208.0,\n      \"adr\": 151.4,\n      \"agent\": \"Omen\",\n      \"ddDelta\": \"+37\",\n      \"fd\": 1.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"32%\",\n      \"kda\": \"12/9/5\",\n      \"player_id\": \"AGEBEEB#BBMFC\",\n      \"rank\": \"Silver 3\"\n    },\n    {\n      \"acs\": 205.0,\n      \"adr\": 128.1,\n      \"agent\": \"Chamber\",\n      \"ddDelta\": \"+6\",\n      \"fd\": 2.0,\n      \"fk\": 5.0,\n      \"hsPercentage\": \"33%\",\n      \"kda\": \"13/10/1\",\n      \"player_id\": \"Zawazawa#5518\",\n      \"rank\": \"Silver 1\"\n    },\n    {\n      \"acs\": 46.0,\n      \"adr\": 43.3,\n      \"agent\": \"Killjoy\",\n      \"ddDelta\": \"-49\",\n      \"fd\": 1.0,\n      \"fk\": 0.0,\n      \"hsPercentage\": \"12%\",\n      \"kda\": \"1/8/5\",\n      \"player_id\": \"venus#jaz\",\n      \"rank\": \"Silver 1\"\n    }\n  ],\n  \"teamB\": [\n    {\n      \"acs\": 289.0,\n      \"adr\": 185.5,\n      \"agent\": \"Clove\",\n      \"ddDelta\": \"-10\",\n      \"fd\": 0.0,\n      \"fk\": 0.0,\n      \"hsPercentage\": \"16%\",\n      \"kda\": \"15/15/3\",\n      \"player_id\": \"Ilikebread#888\",\n      \"rank\": \"Silver 2\"\n    },\n    {\n      \"acs\": 205.0,\n      \"adr\": 134.9,\n      \"agent\": \"Iso\",\n      \"ddDelta\": \"-54\",\n      \"fd\": 3.0,\n      \"fk\": 2.0,\n      \"hsPercentage\": \"12%\",\n      \"kda\": \"9/15/4\",\n      \"player_id\": \"SATCHEL OUT#2722\",\n      \"rank\": \"Silver 1\"\n    },\n    {\n      \"acs\": 126.0,\n      \"adr\": 110.5,\n      \"agent\": \"Reyna\",\n      \"ddDelta\": \"-72\",\n      \"fd\": 0.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"13%\",\n      \"kda\": \"4/14/4\",\n      \"player_id\": \"Hubby#foyou\",\n      \"rank\": \"Gold 2\"\n    },\n    {\n      \"acs\": 109.0,\n      \"adr\": 79.1,\n      \"agent\": \"Killjoy\",\n      \"ddDelta\": \"-93\",\n      \"fd\": 0.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"5%\",\n      \"kda\": \"5/14/3\",\n      \"player_id\": \"MikeLiterus#264\",\n      \"rank\": \"Bronze 3\"\n    },\n    {\n      \"acs\": 106.0,\n      \"adr\": 69.1,\n      \"agent\": \"Chamber\",\n      \"ddDelta\": \"-101\",\n      \"fd\": 6.0,\n      \"fk\": 2.0,\n      \"hsPercentage\": \"0%\",\n      \"kda\": \"5/15/2\",\n      \"player_id\": \"Devil#NBG5\",\n      \"rank\": \"Bronze 3\"\n    }\n  ]\n}"},
        ],
      },
    ],
      });
      console.log('Sending prompt to Gemini...');
      const initTable = await chatSession.sendMessage();
      console.log('Received response from Gemini');
      
      if (!initTable || !initTable.response) {
        console.error('Invalid response from Gemini:', initTable);
        return res.status(500).json({ 
          error: 'Invalid response from Gemini API',
          details: 'Response object is missing or invalid'
        });
      }

      const responseText = await initTable.response.text();
      console.log('Raw response from Gemini:', responseText);
      
      let matchData;
      try {
        matchData = JSON.parse(responseText);
        console.log('Successfully parsed JSON response');
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.error('Raw response:', responseText);
        
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

app.post('/save-match', async (req, res) => {
  try {
    const { map, result, duration, match_date, all_players_data } = req.body;
    console.log('Saving new match...');

    const queryResult = await pool.query(
      `INSERT INTO matches (map, result, duration, match_date, all_players_data)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [map, result, duration, match_date, all_players_data]
    );

    console.log('Match saved successfully');
    res.json(queryResult.rows[0]);
  } catch (err) {
    console.error('Error saving match:', err);
    res.status(500).json({ error: err.message });
  }
});


app.get('/matches', async (req, res) => {
  try {
    console.log('Fetching matches from database...');
    const result = await pool.query('SELECT * FROM matches ORDER BY match_date DESC');
    console.log('Found matches:', result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/analyze-match', async (req, res) => {
  const { matchInfo, all_players_data } = req.body;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {text: "You are a professional Valorant coach with extensive experience in both game strategy and performance analysis.\nEvaluate the match information, team statistics, and individual player performance metrics.\nOutput a comprehensive analysis under 150 words to help the User improve. Omit the use of player_id in the analysis.\nHere is a sample of ${matchInfo.all_players_data}:\n{\n  \"matchInfo\": {\n    \"date\": \"3/26/25, 10:05 PM\",\n    \"duration\": \"21m 11s\",\n    \"map\": \"Icebox\",\n    \"result\": \"Defeat\"\n  },\n  \"teamA\": [\n    {\n      \"acs\": 567.0,\n      \"adr\": 367.3,\n      \"agent\": \"Reyna\",\n      \"ddDelta\": \"+258\",\n      \"fd\": 0.0,\n      \"fk\": 2.0,\n      \"hsPercentage\": \"32%\",\n      \"is_user\": false,\n      \"kda\": \"32/4/5\",\n      \"player_id\": \"Porchiewhippa69#AK10\",\n      \"rank\": \"Unranked\"\n    },\n    {\n      \"acs\": 303.0,\n      \"adr\": 218.9,\n      \"agent\": \"Phoenix\",\n      \"ddDelta\": \"+78\",\n      \"fd\": 2.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"23%\",\n      \"is_user\": false,\n      \"kda\": \"15/8/7\",\n      \"player_id\": \"Deathonic#NA1\",\n      \"rank\": \"Silver 2\"\n    },\n    {\n      \"acs\": 208.0,\n      \"adr\": 151.4,\n      \"agent\": \"Omen\",\n      \"ddDelta\": \"+37\",\n      \"fd\": 1.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"32%\",\n      \"is_user\": false,\n      \"kda\": \"12/9/5\",\n      \"player_id\": \"AGEBEEB#BBMFC\",\n      \"rank\": \"Silver 3\"\n    },\n    {\n      \"acs\": 205.0,\n      \"adr\": 128.1,\n      \"agent\": \"Chamber\",\n      \"ddDelta\": \"+6\",\n      \"fd\": 2.0,\n      \"fk\": 5.0,\n      \"hsPercentage\": \"33%\",\n      \"is_user\": false,\n      \"kda\": \"13/10/1\",\n      \"player_id\": \"Zawazawa#5518\",\n      \"rank\": \"Silver 1\"\n    },\n    {\n      \"acs\": 46.0,\n      \"adr\": 43.3,\n      \"agent\": \"Killjoy\",\n      \"ddDelta\": \"-49\",\n      \"fd\": 1.0,\n      \"fk\": 0.0,\n      \"hsPercentage\": \"12%\",\n      \"is_user\": false,\n      \"kda\": \"1/8/5\",\n      \"player_id\": \"venus#jaz\",\n      \"rank\": \"Silver 1\"\n    }\n  ],\n  \"teamB\": [\n    {\n      \"acs\": 289.0,\n      \"adr\": 185.5,\n      \"agent\": \"Clove\",\n      \"ddDelta\": \"-10\",\n      \"fd\": 0.0,\n      \"fk\": 0.0,\n      \"hsPercentage\": \"16%\",\n      \"is_user\": true,\n      \"kda\": \"15/15/3\",\n      \"player_id\": \"Ilikebread#888\",\n      \"rank\": \"Silver 2\"\n    },\n    {\n      \"acs\": 205.0,\n      \"adr\": 134.9,\n      \"agent\": \"Iso\",\n      \"ddDelta\": \"-54\",\n      \"fd\": 3.0,\n      \"fk\": 2.0,\n      \"hsPercentage\": \"12%\",\n      \"is_user\": false,\n      \"kda\": \"9/15/4\",\n      \"player_id\": \"SATCHEL OUT#2722\",\n      \"rank\": \"Silver 1\"\n    },\n    {\n      \"acs\": 126.0,\n      \"adr\": 110.5,\n      \"agent\": \"Reyna\",\n      \"ddDelta\": \"-72\",\n      \"fd\": 0.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"13%\",\n      \"is_user\": false,\n      \"kda\": \"4/14/4\",\n      \"player_id\": \"Hubby#foyou\",\n      \"rank\": \"Gold 2\"\n    },\n    {\n      \"acs\": 109.0,\n      \"adr\": 79.1,\n      \"agent\": \"Killjoy\",\n      \"ddDelta\": \"-93\",\n      \"fd\": 0.0,\n      \"fk\": 1.0,\n      \"hsPercentage\": \"5%\",\n      \"is_user\": false,\n      \"kda\": \"5/14/3\",\n      \"player_id\": \"MikeLiterus#264\",\n      \"rank\": \"Bronze 3\"\n    },\n    {\n      \"acs\": 106.0,\n      \"adr\": 69.1,\n      \"agent\": \"Chamber\",\n      \"ddDelta\": \"-101\",\n      \"fd\": 6.0,\n      \"fk\": 2.0,\n      \"hsPercentage\": \"0%\",\n      \"is_user\": false,\n      \"kda\": \"5/15/2\",\n      \"player_id\": \"Devil#NBG5\",\n      \"rank\": \"Bronze 3\"\n    }\n  ]\n}"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "The user wants me to act as a Valorant coach and provide a concise analysis (under 150 words) based on the provided match data. I need to focus on improvement points for the user, who is identified by `\"is_user\": true`. I must omit player IDs.\n\n1.  **Identify the User:** The user is playing Clove on Team B, with ACS 289, KDA 15/15/3, and ADR 185.5.\n2.  **Analyze User Performance:**\n    *   ACS (289) and ADR (185.5) are solid, the highest on their team (Team B).\n    *   KDA (15/15/3) is exactly even (1.0 K/D ratio), indicating they traded kills often but also died frequently.\n    *   HS% (16%) is relatively low, suggesting reliance on body shots or suboptimal crosshair placement.\n    *   DDDelta (-10) is slightly negative, meaning they took slightly more damage than they dealt on average per round.\n    *   FK/FD (0/0) indicates they weren't involved in opening duels (neither first kill nor first death). As Clove, a controller/duelist hybrid, this might suggest passive play or not being in impactful positions early round.\n3.  **Analyze Team Performance (User's Team - Team B):**\n    *   Overall defeat.\n    *   Significant performance disparity compared to Team A. Team A's Reyna dominated (567 ACS).\n    *   Team B had much lower ACS and ADR across the board compared to Team A.\n    *   Multiple players on Team B had high deaths and low impact (negative DDDelta, low ACS/ADR).\n    *   Team composition (Clove, Iso, Reyna, Killjoy, Chamber) lacks strong synergy, especially on Icebox attack. Limited smokes/controller utility beyond Clove.\n4.  **Analyze Opponent Performance (Team A):**\n    *   Dominated the match, led by an extremely high-performing Reyna.\n    *   Strong ACS/ADR across multiple players.\n    *   Positive DDDelta for most players.\n    *   Balanced agent composition (Reyna, Phoenix, Omen, Chamber, Killjoy) offers good site control and entry potential.\n5.  **Synthesize Feedback for User:**\n    *   Acknowledge their strong individual contribution (top fragger on team).\n    *   Highlight the even KDA (15/15) - suggests they need to find ways to secure kills *without* trading their life as often, perhaps through better utility usage (Clove smokes/self-heal) or positioning.\n    *   Mention the low HS% (16%) as an area for mechanical improvement (crosshair placement, aim training).\n    *   Suggest focusing on survivability and impact, possibly coordinating utility use with teammates (though team coordination seemed lacking overall).\n    *   Keep it concise and actionable. Avoid blaming teammates directly, focus on what the *user* can control.\n6.  **Draft Analysis (incorporating constraints - under 150 words, no player_id):**\n    \"This was a tough match on Icebox, ending in defeat despite your solid individual performance leading Team B with 289 ACS. Your 15/15 KDA shows you traded effectively, but improving survivability is key. Focus on utilizing Clove's utility (smokes, self-heal) more proactively to stay alive after engagements. Your 16% headshot rate indicates room for improvement in crosshair placement and aim mechanics. While your team struggled against a dominant opponent, refining your positioning and mechanical skill will help secure more impactful kills without trading your own life, ultimately contributing more to round wins.\"\n7.  **Review and Edit:** The draft is ~100 words, meets the requirements (coach persona, analysis, improvement focus, under 150 words, no player IDs). It addresses KDA, survivability, utility use, and mechanics (HS%). It acknowledges the team context without dwelling on it."},
            {text: "Okay, let's break down this Icebox match.\n\nIt was a challenging Defeat. You topped your team as Clove with a respectable 289 ACS and 185.5 ADR, showing strong engagement. However, your 15/15 KDA indicates you traded your life too often. Focus on using Clove's abilities for survivability *after* getting picks, not just for entry. Your 16% headshot rate suggests potential improvement in crosshair placement and aim consistency. While the opponent's Reyna had an exceptional game, work on staying alive longer in rounds to provide sustained controller presence and increase your overall impact beyond trading kills. Refining mechanics and tactical ability usage will be beneficial."},
          ],
        },
      ],
    });
    const result = await chatSession.sendMessage();
    const analysis = result.response.text();

    await pool.query(
      `INSERT INTO match_analysis (match_id, content) VALUES ($1, $2)`,
      [matchInfo.matchId, analysis]
    );
    
    res.json({
      analysis
    });
  } catch (error) {
    console.error("Error analyzing match data:", error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post('/save-match-analysis', async (req, res) => {
  try {
    const { match_id, content } = req.body;
    console.log('Saving match analysis...');

    const queryResult = await pool.query(
      `INSERT INTO match_analysis (match_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [match_id, content]
    );

    console.log('Analysis saved successfully');
    res.json(queryResult.rows[0]);
  } catch (err) {
    console.error('Error saving analysis:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});