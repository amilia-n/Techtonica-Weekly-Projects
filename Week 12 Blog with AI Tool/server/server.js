require("dotenv").config();
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);
const express = require("express");
const cors = require("cors");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const pool = require("./db/connect");
const fs = require("node:fs");
const mime = require("mime-types");

const app = express();
const PORT = process.env.PORT || 3000;

const stringToInteger = (str) => {
  if(typeof str === "number") return str;
  if(typeof str !== "string") return 0;
  const regex = /\D/g;
  str.replaceAll(regex, "");

  return parseInt(str);
}

const formatKDA = (kda) => {
  if (!kda) return "0/0/0";
  const parts = kda.replace(/\s+/g, '').split('/');
  if (parts.length !== 3) return "0/0/0";
  return parts.join('/');
}

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use(express.json());

console.log("Setting up routes...");

app.get("/test", (req, res) => {
  console.log("GET /test called");
  res.json({ message: "Server is working" });
});

app.post("/test-post", (req, res) => {
  console.log("POST /test-post called");
  const { data } = req.body;
  res.json({
    message: "Test endpoint working",
    receivedData: data,
  });
});

console.log("Routes set up");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const requiredEnvVars = ["GEMINI_API_KEY", "PORT"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(
    "Missing required environment variables:",
    missingEnvVars.join(", ")
  );
  process.exit(1);
}

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      matchInfo: {
        type: "object",
        properties: {
          date: {
            type: "string",
          },
          map: {
            type: "string",
          },
          result: {
            type: "string",
            enum: ["Victory", "Defeat", "Tie"],
          },
          duration: {
            type: "string",
          },
        },
        required: ["date", "map", "result", "duration"],
      },
      teamA: {
        type: "array",
        items: {
          type: "object",
          properties: {
            player_id: {
              type: "string",
            },
            agent: {
              type: "string",
            },
            rank: {
              type: "string",
            },
            acs: {
              type: "number",
            },
            kda: {
              type: "string",
              pattern: "^\\d+\\/\\d+\\/\\d+$"
            },
            damage_delta: {
              type: "string",
            },
            adr: {
              type: "number",
            },
            hs_percent: {
              type: "string",
            },
            first_kills: {
              type: "number",
            },
            first_deaths: {
              type: "number",
            },
          },
          required: [
            "player_id",
            "agent",
            "rank",
            "acs",
            "kda",
            "damage_delta",
            "adr",
            "hs_percent",
            "first_kills",
            "first_deaths",
          ],
        },
      },
      teamB: {
        type: "array",
        items: {
          type: "object",
          properties: {
            player_id: {
              type: "string",
            },
            agent: {
              type: "string",
            },
            rank: {
              type: "string",
            },
            acs: {
              type: "number",
            },
            kda: {
              type: "string",
              pattern: "^\\d+\\/\\d+\\/\\d+$"
            },
            damage_delta: {
              type: "string",
            },
            adr: {
              type: "number",
            },
            hs_percent: {
              type: "string",
            },
            first_kills: {
              type: "number",
            },
            first_deaths: {
              type: "number",
            },
          },
          required: [
            "player_id",
            "agent",
            "rank",
            "acs",
            "kda",
            "damage_delta",
            "adr",
            "hs_percent",
            "first_kills",
            "first_deaths",
          ],
        },
      },
    },
    required: ["matchInfo", "teamA", "teamB"],
  },
};

app.post("/process-match-data", async (req, res) => {
  const { pastedData, agentName } = req.body;

  if (!pastedData) {
    return res.status(400).json({ error: "Pasted data is required" });
  }

  try {
    console.log("Starting match data processing...");
    console.log("Agent name:", agentName);
    console.log("Data length:", pastedData.length);
    console.log("First 100 chars of data:", pastedData.substring(0, 100));

    console.log("Initializing Gemini API call...");

    try {
      if (!apiKey || apiKey === "undefined") {
        console.error("Invalid or missing Gemini API key");
        return res.status(500).json({
          error: "Server configuration error",
          details: "Invalid or missing Gemini API key",
        });
      }

      const prompt = {
        contents: [
          {
            parts: [
              {
                text: `Parse this raw match data into the structured JSON format specified.
                ONLY include data from:\n${pastedData} and return in this format ${JSON.stringify(
                  generationConfig.responseSchema
                )}.`,
              },
            ],
          },
        ],
      };

      console.log("Sending prompt to Gemini...");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      console.log("Received response from Gemini");

      let matchData;
      try {
        responseText.replaceAll("```", "");
        responseText.replace("json", "");

        matchData = JSON.parse(responseText);
        console.log("Successfully parsed JSON response");
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        console.error("Raw response:", responseText);

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            matchData = JSON.parse(jsonMatch[0]);
            console.log("Successfully extracted and parsed JSON from response");
          } catch (extractError) {
            console.error("Error extracting JSON from response:", extractError);
            return res.status(500).json({
              error: "Failed to parse AI response as JSON",
              details: extractError.message,
              rawResponse: responseText,
            });
          }
        } else {
          return res.status(500).json({
            error: "AI response is not in JSON format",
            details: parseError.message,
            rawResponse: responseText,
          });
        }
      }

      const formattedData = {
        matchInfo: matchData.matchInfo,
        all_players_data: {
          teamA: matchData.teamA,
          teamB: matchData.teamB,
        },
      };

      res.json(formattedData);
    } catch (geminiError) {
      console.error("Error with Gemini API:", geminiError);
      return res.status(500).json({
        error: "Gemini API error",
        details: geminiError.message,
        stack:
          process.env.NODE_ENV === "development"
            ? geminiError.stack
            : undefined,
      });
    }
  } catch (error) {
    console.error("Error processing match data:", error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});


app.post("/save-match", async (req, res) => {
  const { map, result, duration, match_date, all_players_data, agentName } = req.body;

  try {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Format KDA for all players
      const formattedPlayersData = {
        teamA: all_players_data.teamA.map(player => ({
          ...player,
          kda: formatKDA(player.kda)
        })),
        teamB: all_players_data.teamB.map(player => ({
          ...player,
          kda: formatKDA(player.kda)
        }))
      };

      // Insert match data into the matches table
      const matchResult = await client.query(
        `INSERT INTO matches (map, result, match_date, duration, all_players_data)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING match_id`,
        [
          map,
          result,
          match_date,
          duration,
          JSON.stringify(formattedPlayersData),
        ]
      );

      const matchId = matchResult.rows[0].match_id;

      // Insert only the required fields into user_stats table
      if (agentName) {
        // Make sure we're only inserting the fields that exist in the user_stats table
        await client.query(
          `INSERT INTO user_stats (match_id, agent, result)
           VALUES ($1, $2, $3)`,
          [matchId, agentName, result]
        );
      }

      await client.query("COMMIT");
      res.json({ match_id: matchId });
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error saving match:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/matches", async (req, res) => {
  try {
    console.log("Fetching matches from database...");
    const result = await pool.query(`SELECT 
            matches.*, 
            match_analysis.content AS analysis
          FROM matches
          LEFT JOIN match_analysis
            ON matches.match_id = match_analysis.match_id 
          ORDER BY matches.match_date DESC`);
    console.log("Found matches:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Error retrieving matches:", err);
    res.status(500).json({ error: "Failed to retrieve matches" });
  }
});


app.post("/analyze-match", async (req, res) => {
  const { matchInfo, all_players_data, agentName } = req.body;

  try {
    const matchResult = matchInfo.result;

    const processedData = {
      ...all_players_data,
      teamA: all_players_data.teamA.map((player) => ({
        ...player,
        team_type: 'team A'
      })),
      teamB: all_players_data.teamB.map((player) => ({
        ...player,
        team_type: 'team B'
      }))
    };

    const promptText = `You are a professional Valorant coach with extensive experience in both game strategy and performance analysis.
Evaluate the match information, team statistics, and individual player performance metrics.
Focus your analysis on the overall match performance, where ${agentName} was played in a match that ended in ${matchResult}.
Output a comprehensive analysis under 150 words to help improve gameplay. Omit the use of player_id in the analysis.

Here is the match data:
${JSON.stringify(processedData)}`;

    const prompt = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    await pool.query(
      `INSERT INTO match_analysis (match_id, content) VALUES ($1, $2)`,
      [matchInfo.matchId, analysis]
    );

    res.json({
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing match data:", error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

app.post("/save-match-analysis", async (req, res) => {
  try {
    const { match_id, content } = req.body;
    console.log("Saving match analysis...");

    const queryResult = await pool.query(
      `INSERT INTO match_analysis (match_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [match_id, content]
    );

    console.log("Analysis saved successfully");
    res.json(queryResult.rows[0]);
  } catch (err) {
    console.error("Error saving analysis:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/matches/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM user_stats WHERE match_id = $1", [
      req.params.id,
    ]);

    await client.query("DELETE FROM match_analysis WHERE match_id = $1", [
      req.params.id,
    ]);

    await client.query("DELETE FROM matches WHERE match_id = $1", [
      req.params.id,
    ]);

    await client.query("COMMIT");
    res.json({ message: "Match deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error deleting match:", err);
    res.status(500).json({ error: "Failed to delete match" });
  } finally {
    client.release();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("- GET /test");
  console.log("- POST /test-post");
});

module.exports = app;
