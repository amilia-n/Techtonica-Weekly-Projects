import React, { useState, useRef } from "react";
import Browser from "../components/Browser";
import GenerateTable from "../components/GenerateTable";
import RecentAnalysis from "../components/RecentAnalysis";
import ListAll from "../components/ListAll";
import "./Home.css";

const VALORANT_AGENTS = [
  "Astra",
  "Breach",
  "Brimstone",
  "Chamber",
  "Clove",
  "Cypher",
  "Deadlock",
  "Fade",
  "Gekko",
  "Harbor",
  "Iso",
  "Jett",
  "KAY/O",
  "Killjoy",
  "Neon",
  "Omen",
  "Phoenix",
  "Raze",
  "Reyna",
  "Sage",
  "Skye",
  "Sova",
  "Viper",
  "Yoru",
  "Tejo",
  "Waylay",
];

const Home = () => {
  const [tableData, setTableData] = useState({
    yourTeam: Array(5)
      .fill()
      .map(() => Array(9).fill("")),
    opponentTeam: Array(5)
      .fill()
      .map(() => Array(9).fill("")),
  });
  const [recentAnalysis, setRecentAnalysis] = useState(null);
  const [agentInput, setAgentInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [pastedData, setPastedData] = useState("");
  const [matchInfo, setMatchInfo] = useState({
    map: "",
    result: "",
    date: "",
    duration: "00:00",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const pasteBoxRef = useRef(null);

  const handleAgentInputChange = (e) => {
    const value = e.target.value;
    setAgentInput(value);
    const filtered = VALORANT_AGENTS.filter((agent) =>
      agent.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleAgentSelect = (agent) => {
    setAgentInput(agent);
    setSuggestions([]);
  };

  const handlePasteChange = (e) => {
    setPastedData(e.target.value);
  };

  const handleSubmitPaste = async () => {
    if (!pastedData.trim()) {
      console.log("Please paste match data first");
      return;
    }

    if (!agentInput.trim()) {
      console.log("Please enter your agent name");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/process-match-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pastedData,
          agentName: agentInput,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            responseData.details ||
            "Failed to process match data"
        );
      }

      setMatchInfo({
        date: responseData.matchInfo?.date || "",
        map: responseData.matchInfo?.map || "",
        result: responseData.matchInfo?.result || "",
        duration: responseData.matchInfo?.duration || "",
      });

      const newTableData = {
        yourTeam: Array(5)
          .fill()
          .map(() => Array(9).fill("")),
        opponentTeam: Array(5)
          .fill()
          .map(() => Array(9).fill("")),
      };

      if (Array.isArray(responseData.yourTeam)) {
        responseData.yourTeam.forEach((player, index) => {
          if (index < 5) {
            newTableData.yourTeam[index] = [
              player.agent || "",
              player.rank || "",
              player.acs || "",
              player.kda || "",
              player.ddDelta || "0",
              player.adr || "",
              player.hsPercentage || "0%",
              player.fk || "0",
              player.fd || "0",
            ];
          }
        });
      }

      if (Array.isArray(responseData.opponentTeam)) {
        responseData.opponentTeam.forEach((player, index) => {
          if (index < 5) {
            newTableData.opponentTeam[index] = [
              player.agent || "",
              player.rank || "",
              player.acs || "",
              player.kda || "",
              player.ddDelta || "0",
              player.adr || "",
              player.hsPercentage || "0%",
              player.fk || "0",
              player.fd || "0",
            ];
          }
        });
      }

      setTableData(newTableData);
    } catch (err) {
      console.log("Error processing match data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCellEdit = (team, rowIndex, colIndex, value) => {
    setTableData((prev) => {
      const newData = { ...prev };
      newData[team][rowIndex][colIndex] = value;
      return newData;
    });
  };

  const handleSubmitTable = async () => {
    setIsAnalyzing(true);

    try {
      const yourTeam = tableData.yourTeam.map((row) => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: row[4],
        adr: parseFloat(row[5]) || 0,
        hsPercentage: row[6],
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0,
      }));

      const opponentTeam = tableData.opponentTeam.map((row) => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: row[4],
        adr: parseFloat(row[5]) || 0,
        hsPercentage: row[6],
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0,
      }));

      console.log("Sending match data to server:", {
        matchInfo: {
          map: matchInfo.map,
          result: matchInfo.result,
          date: matchInfo.date,
          duration: matchInfo.duration || "00:00",
        },
        teams: [
          { team: "yourTeam", players: yourTeam },
          { team: "opponentTeam", players: opponentTeam },
        ],
      });

      const saveResponse = await fetch("http://localhost:3000/save-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          map: matchInfo.map,
          result: matchInfo.result,
          duration: matchInfo.duration || "00:00",
          match_date: matchInfo.date,
          all_players_data: {
            teamA: yourTeam,
            teamB: opponentTeam,
          },
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save match data");
      }

      const saveResult = await saveResponse.json();
      console.log("Save response:", saveResult);
      const matchId = saveResult.matchId;

      const analysisResponse = await fetch(
        "http://localhost:3000/analyze-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            matchInfo: {
              ...matchInfo,
              matchId,
              duration: matchInfo.duration || "00:00",
            },
            all_players_data: {
              teamA: yourTeam,
              teamB: opponentTeam,
            },
            agentName: agentInput,
          }),
        }
      );

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || "Failed to get AI analysis");
      }

      const analysisResult = await analysisResponse.json();
      console.log("Analysis response:", analysisResult);

      if (!analysisResult || !analysisResult.all_players_data) {
        console.error("Invalid analysis result:", analysisResult);
        throw new Error("Invalid analysis result from server");
      }

      console.log("Setting recent analysis:", analysisResult);
      setRecentAnalysis(analysisResult);

      setTableData({
        yourTeam: Array(5)
          .fill()
          .map(() => Array(9).fill("")),
        opponentTeam: Array(5)
          .fill()
          .map(() => Array(9).fill("")),
      });
      setMatchInfo({
        map: "",
        result: "",
        date: "",
        duration: "00:00",
      });
      setPastedData("");
      setAgentInput("");
      setSuggestions([]);
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error in handleSubmitTable:", error);
      setIsAnalyzing(false);
      alert(error.message || "Failed to analyze match");
    }
  };

  const renderEditableCell = (team, rowIndex, colIndex, value) => {
    if (colIndex === 0) {
      return (
        <td
          key={`${team}-${rowIndex}-${colIndex}`}
          className="px-1 py-0.5 border text-center"
        >
          <input
            type="text"
            value={value}
            onChange={(e) =>
              handleCellEdit(team, rowIndex, colIndex, e.target.value)
            }
            className="w-full h-full text-center"
            placeholder="Agent name"
          />
        </td>
      );
    }
    return (
      <td
        key={`${team}-${rowIndex}-${colIndex}`}
        className="px-1 py-0.5 border text-center"
      >
        <input
          type="text"
          value={value}
          onChange={(e) =>
            handleCellEdit(team, rowIndex, colIndex, e.target.value)
          }
          className="w-full h-full text-center"
        />
      </td>
    );
  };

  return (
    <div className="home-container">
      <h1>AMI'S VALORANT BLOG</h1>
      <datalist id="agent-list">
        {VALORANT_AGENTS.map((agent) => (
          <option key={agent} value={agent} />
        ))}
      </datalist>
      <div className="instructions">
        Instructions:
        <ul>
          <li>1) In the browser below, enter your player ID and #.</li>
          <li>
            2) Once loaded, select "Matches" in the header. Scroll down to view
            all matches.
          </li>
          <li>3) Select the match you'd like to analyze.</li>
          <li>
            4) Copy the entire table onto clipboard and paste under in the empty
            textbox.
          </li>
          <li>
            5) Enter your agent and press Convert! This should render this data
            into the table on the right.
          </li>
          <li>
            6) Double check the information, if correct, select Analyze to
            process a game analysis.{" "}
          </li>
          <li>
            7) Hang tight while it runs! The most recent analysis will always be
            rendered underneath.
          </li>
          <li>
            Below our most recent analysis will be a list of all past matches!
          </li>
        </ul>
      </div>

      {/* Browser Section */}
      <div className="browser-container">
        <Browser />
      </div>

      {/* <div className="generate-table-container">
        <GenerateTable
          pastedData={pastedData}
          agentInput={agentInput}
          suggestions={suggestions}
          tableData={tableData}
          matchInfo={matchInfo}
          isLoading={isLoading}
          isAnalyzing={isAnalyzing}
          pasteBoxRef={pasteBoxRef}
          onPasteChange={handlePasteChange}
          onAgentInputChange={handleAgentInputChange}
          onAgentSelect={handleAgentSelect}
          onCellEdit={handleCellEdit}
          onSubmitPaste={handleSubmitPaste}
          onSubmitTable={handleSubmitTable}
          renderEditableCell={renderEditableCell}
        />
      </div> */}

      {/* RecentAnalysis Section */}
      <RecentAnalysis
        recentAnalysis={recentAnalysis}
        pastedData={pastedData}
        agentInput={agentInput}
        suggestions={suggestions}
        tableData={tableData}
        matchInfo={matchInfo}
        isLoading={isLoading}
        isAnalyzing={isAnalyzing}
        pasteBoxRef={pasteBoxRef}
        onPasteChange={handlePasteChange}
        onAgentInputChange={handleAgentInputChange}
        onAgentSelect={handleAgentSelect}
        onCellEdit={handleCellEdit}
        onSubmitPaste={handleSubmitPaste}
        onSubmitTable={handleSubmitTable}
        renderEditableCell={renderEditableCell}
      />

      {/* ListAll Section */}
      <div className="list-all-container">
        <ListAll />
      </div>
    </div>
  );
};

export default Home;
