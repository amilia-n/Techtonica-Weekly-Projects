import React, { useState } from "react";
import EmptyTable from "./EmptyTable";
import GenerateTable from "./GenerateTable";
import "./RecentAnalysis.css";


function RecentAnalysis({ recentAnalysis: initialAnalysis }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(initialAnalysis);

  const handleAnalysis = async (matchData) => {
    setIsAnalyzing(true);
    setError("");

    try {
      const saveResponse = await fetch("http://localhost:3000/save-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        body: JSON.stringify(matchData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || "Failed to save match data");
      }

      const saveResult = await saveResponse.json();
      const matchId = saveResult.match_id;

      const userAgent = matchData.all_players_data[matchData.all_players_data.userTeam]
        .find(player => player.is_user)?.agent;

      const analysisResponse = await fetch(
        "http://localhost:3000/analyze-match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          mode: "cors",
          body: JSON.stringify({
            matchInfo: {
              matchId,
              map: matchData.map,
              result: matchData.result,
              date: matchData.match_date,
              duration: matchData.duration,
            },
            all_players_data: {
              teamA: matchData.all_players_data.teamA,
              teamB: matchData.all_players_data.teamB,
              userTeam: matchData.all_players_data.userTeam,
              matchResult: matchData.all_players_data.matchResult
            },
            agentName: userAgent,
          }),
        }
      );

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || "Failed to get AI analysis");
      }

      const analysisResult = await analysisResponse.json();

      const savedMatchesResponse = await fetch(
        "http://localhost:3000/matches",
        {
          headers: {
            Accept: "application/json",
          },
          mode: "cors",
        }
      );
      if (!savedMatchesResponse.ok) {
        throw new Error("Failed to fetch updated matches list");
      }

      const savedMatchesData = await savedMatchesResponse.json();
      localStorage.setItem("savedMatches", JSON.stringify(savedMatchesData));

      setAnalysis({
        ...matchData,
        match_id: matchId,
        analysis: analysisResult.analysis,
      });
    } catch (err) {
      console.error("Error processing match data:", err);
      setError(
        err.message || "Failed to process match data. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processSavedMatchData = (data) => {
    if (!data) {
      console.error("No data provided to processSavedMatchData");
      return { teamA: [], teamB: [] };
    }

    if (!data.all_players_data) {
      console.error("Invalid data structure:", data);
      return { teamA: [], teamB: [] };
    }

    const formatTeam = (team) =>
      team.map((player) => [
        player.agent || "",
        player.rank || "",
        player.acs || "",
        player.kda || "",
        player.damage_delta || player.ddDelta || "",
        player.adr || "",
        player.hs_percent || player.hsPercentage || "",
        player.first_kills || player.fk || "",
        player.first_deaths || player.fd || "",
      ]);

    return {
      teamA: formatTeam(data.all_players_data.teamA),
      teamB: formatTeam(data.all_players_data.teamB),
    };
  };

  if (!analysis) {
    return (

          <div className="analysis-container" >
            Enter match data to get started.
          </div>

    );
  }

  const { teamA, teamB } = processSavedMatchData(analysis);

  return (
    <div className="analysis-container">
      <div className="analysis-table-container">
        <EmptyTable 
          tableData={{ teamA, teamB }}
          matchInfo={{
            map: analysis.map,
            result: analysis.result,
            duration: analysis.duration,
            date: analysis.match_date
          }}
          isSavedData={true}
        />
      </div>
      <div className="recent-analysis">
        <h2 className="text-lg font-bold mb-4">Recent Analysis</h2>
        <div className="bg-white p-4 rounded-md shadow">
          {analysis.analysis}
        </div>
      </div>
    </div>
  );
}

export default RecentAnalysis;
