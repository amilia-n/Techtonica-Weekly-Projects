import React, { useState } from 'react';
import './RecentAnalysis.css';

function RecentAnalysis({ recentAnalysis: initialAnalysis }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(initialAnalysis);

  const loadingGunStyle = {
    width: '60px',
    height: '60px',
    marginTop: '5px',
    marginLeft: '-8px',
    verticalAlign: 'start'
  };

  const handleAnalysis = async (matchData) => {
    setIsAnalyzing(true);
    setError('');

    try {
      // First, save the match data
      const saveResponse = await fetch('http://localhost:3000/save-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(matchData),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save match data');
      }

      const saveResult = await saveResponse.json();
      const matchId = saveResult.match_id;

      // Then, get AI analysis
      const analysisResponse = await fetch('http://localhost:3000/analyze-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          matchInfo: {
            matchId,
            map: matchData.map,
            result: matchData.result,
            date: matchData.match_date,
            duration: matchData.duration
          },
          all_players_data: matchData.all_players_data,
          agentName: matchData.all_players_data.teamA.find(player => player.is_user)?.agent || 
                    matchData.all_players_data.teamB.find(player => player.is_user)?.agent
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Failed to get AI analysis');
      }

      const analysisResult = await analysisResponse.json();

      // Update saved matches list
      const savedMatchesResponse = await fetch('http://localhost:3000/matches', {
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      if (!savedMatchesResponse.ok) {
        throw new Error('Failed to fetch updated matches list');
      }

      const savedMatchesData = await savedMatchesResponse.json();
      localStorage.setItem('savedMatches', JSON.stringify(savedMatchesData));

      // Update the analysis state with the new data
      setAnalysis({
        ...matchData,
        match_id: matchId,
        analysis: analysisResult.analysis
      });
    } catch (err) {
      console.error('Error processing match data:', err);
      setError(err.message || 'Failed to process match data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processSavedMatchData = (data) => {
    if (!data) {
      console.error('No data provided to processSavedMatchData');
      return { yourTeam: [], opponentTeam: [] };
    }

    if (!data.all_players_data) {
      console.error('Invalid data structure:', data);
      return { yourTeam: [], opponentTeam: [] };
    }

    const yourTeam = data.all_players_data.teamA.map(player => [
      player.agent || '',
      player.rank || '',
      player.acs || '',
      player.kda || '',
      player.damage_delta || player.ddDelta || '',
      player.adr || '',
      player.hs_percent || player.hsPercentage || '',
      player.first_kills || player.fk || '',
      player.first_deaths || player.fd || ''
    ]);

    const opponentTeam = data.all_players_data.teamB.map(player => [
      player.agent || '',
      player.rank || '',
      player.acs || '',
      player.kda || '',
      player.damage_delta || player.ddDelta || '',
      player.adr || '',
      player.hs_percent || player.hsPercentage || '',
      player.first_kills || player.fk || '',
      player.first_deaths || player.fd || ''
    ]);

    return { yourTeam, opponentTeam };
  };

  if (!analysis) {
    return (
      <div className="recent-analysis">
        <h2 className="text-lg font-bold mb-4">Recent Analysis</h2>
        <div className="text-gray-500 bg-gray-50 p-4 rounded-md">
          No recent analysis available. Analyze a match to see your performance breakdown.
        </div>
      </div>
    );
  }

  const { yourTeam, opponentTeam } = processSavedMatchData(analysis);

  return (
    <div className="recent-analysis">
      <h2 className="text-lg font-bold mb-4">Recent Analysis</h2>
      <div className="match-info mb-4">
        <div className="font-semibold">Map: {analysis.map}</div>
        <div className={`font-semibold ${analysis.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
          {analysis.result}
        </div>
        <div className="font-semibold">Duration: {analysis.duration}</div>
        <div className="font-semibold">Match Date: {new Date(analysis.match_date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })}</div>
      </div>

      {/* Your Team Table */}
      <div className="table-container mb-8">
        <h3 className="text-md font-semibold mb-2">Your Team</h3>
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Rank</th>
                <th>ACS</th>
                <th>K/D/A</th>
                <th>DDΔ</th>
                <th>ADR</th>
                <th>HS%</th>
                <th>FK</th>
                <th>FD</th>
              </tr>
            </thead>
            <tbody>
              {yourTeam.map((row, rowIndex) => {
                const isUser = analysis.all_players_data.teamA[rowIndex]?.is_user;
                return (
                  <tr 
                    key={rowIndex} 
                    className={`${isUser ? 'bg-blue-100' : ''}`}
                  >
                    {row.map((cell, colIndex) => (
                      <td 
                        key={`${rowIndex}-${colIndex}`} 
                        className="px-1 py-0.5 border text-center"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Opponent Team Table */}
      <div className="table-container mb-8">
        <h3 className="text-md font-semibold mb-2">Opponent Team</h3>
        <div className="table-wrapper">
          <table className="w-full">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Rank</th>
                <th>ACS</th>
                <th>K/D/A</th>
                <th>DDΔ</th>
                <th>ADR</th>
                <th>HS%</th>
                <th>FK</th>
                <th>FD</th>
              </tr>
            </thead>
            <tbody>
              {opponentTeam.map((row, rowIndex) => {
                const isUser = analysis.all_players_data.teamB[rowIndex]?.is_user;
                return (
                  <tr 
                    key={rowIndex} 
                    className={`${isUser ? 'bg-blue-100' : ''}`}
                  >
                    {row.map((cell, colIndex) => (
                      <td 
                        key={`${rowIndex}-${colIndex}`} 
                        className="px-1 py-0.5 border text-center"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="analysis-container">
        <h3 className="text-md font-semibold mb-2">Match Analysis</h3>
        <div className="analysis-content">
          {analysis.analysis || 'No analysis available'}
        </div>
      </div>

      {/* Analysis Button */}
      <button 
        className='analyze'
        onClick={() => handleAnalysis(analysis)}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <img 
              src="/rifle.gif" 
              alt="Analyzing Data..." 
              style={loadingGunStyle}
            />Analyzing...
          </>
        ) : (
          'Analyze Game'
        )}
      </button>
    </div>
  );
}

export default RecentAnalysis;
