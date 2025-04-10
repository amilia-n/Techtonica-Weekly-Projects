import React, { useState, useEffect } from "react";
import EmptyTable from "./EmptyTable";
import GenerateTable from "./GenerateTable";
import "./RecentAnalysis.css";


function RecentAnalysis({ recentAnalysis: initialAnalysis }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(initialAnalysis);

  useEffect(() => {
    console.log("RecentAnalysis received new data:", initialAnalysis);
    if (initialAnalysis) {
      setAnalysis(initialAnalysis);
      handleAnalysis(initialAnalysis);
    }
  }, [initialAnalysis]);

  const handleAnalysis = async (matchData) => {
    setIsAnalyzing(true);
    setError("");

    try {
      const userAgent = matchData.agentName || matchData.agent;

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
              matchId: matchData.match_id,
              map: matchData.map,
              result: matchData.result,
              date: matchData.match_date,
              duration: matchData.duration,
            },
            all_players_data: {
              teamA: matchData.all_players_data.teamA,
              teamB: matchData.all_players_data.teamB
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
        analysis: analysisResult.analysis,
      });
    } catch (err) {
      console.error("Error processing match data:", err);
      const errorMessage = err.message || "Failed to process match data. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
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
        player.agent ?? "",
        player.rank ?? "",
        player.acs ?? "0",
        player.kda ?? "0/0/0",
        player.damage_delta ?? player.ddDelta ?? "0",
        player.adr ?? "0",
        player.hs_percent ?? player.hsPercentage ?? "0%",
        player.first_kills ?? player.fk ?? "0",
        player.first_deaths ?? player.fd ?? "0",
      ]);

    return {
      teamA: formatTeam(data.all_players_data.teamA),
      teamB: formatTeam(data.all_players_data.teamB),
    };
  };

  if (!analysis) {
    return (
      <div className="analysis-container">
        Enter match data to get started.
      </div>
    );
  }

  if (error) {
    return (
      <div className="analysis-container">
        <div className="text-center text-red-600">
          <h2 className="text-lg font-bold mb-4">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="analysis-container">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-bold mb-4">Generating Analysis...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis.analysis) {
    return (
      <div className="analysis-container">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-4">Analysis Not Ready</h2>
          <p>Please wait while we generate your match analysis.</p>
        </div>
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
        <h2 className="text-lg font-bold mb-4">Game Analysis</h2>
        <div className="bg-white p-4 rounded-md shadow analysis-text">
          {analysis.analysis}
        </div>
      </div>
    </div>
  );
}

export default RecentAnalysis;
