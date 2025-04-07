import React from 'react';
import './RecentAnalysis.css';

function RecentAnalysis({ recentAnalysis }) {
  console.log('RecentAnalysis received:', recentAnalysis);
  console.log('Data structure:', {
    hasData: !!recentAnalysis,
    hasAllPlayersData: recentAnalysis?.all_players_data,
    hasTeams: recentAnalysis?.all_players_data?.teams,
    teamsLength: recentAnalysis?.all_players_data?.teams?.length,
    hasAnalysis: !!recentAnalysis?.analysis
  });

  // Process saved match data for display
  const processSavedMatchData = (data) => {
    console.log('Processing saved match data:', data);
    
    if (!data) {
      console.error('No data provided to processSavedMatchData');
      return { yourTeam: [], opponentTeam: [] };
    }

    if (!data.all_players_data || !data.all_players_data.teams) {
      console.error('Invalid data structure:', data);
      return { yourTeam: [], opponentTeam: [] };
    }

    const yourTeamData = data.all_players_data.teams.find(team => team.team === 'yourTeam');
    const opponentTeamData = data.all_players_data.teams.find(team => team.team === 'opponentTeam');

    if (!yourTeamData || !opponentTeamData) {
      console.error('Missing team data:', { yourTeamData, opponentTeamData });
      return { yourTeam: [], opponentTeam: [] };
    }

    if (!yourTeamData.players || !opponentTeamData.players) {
      console.error('Missing players data:', { yourTeamData, opponentTeamData });
      return { yourTeam: [], opponentTeam: [] };
    }

    const yourTeam = yourTeamData.players.map(player => [
      player.agent || '',
      player.rank || '',
      player.acs || '',
      player.kda || '',
      player.ddDelta || '',
      player.adr || '',
      player.hsPercentage || '',
      player.fk || '',
      player.fd || ''
    ]);

    const opponentTeam = opponentTeamData.players.map(player => [
      player.agent || '',
      player.rank || '',
      player.acs || '',
      player.kda || '',
      player.ddDelta || '',
      player.adr || '',
      player.hsPercentage || '',
      player.fk || '',
      player.fd || ''
    ]);

    return { yourTeam, opponentTeam };
  };

  if (!recentAnalysis) {
    return (
      <div className="recent-analysis">
        <h2 className="text-lg font-bold mb-4">Recent Analysis</h2>
        <div className="text-gray-500 bg-gray-50 p-4 rounded-md">
          No recent analysis available. Analyze a match to see your performance breakdown.
        </div>
      </div>
    );
  }

  const { yourTeam, opponentTeam } = processSavedMatchData(recentAnalysis);

  return (
    <div className="recent-analysis">
      <h2 className="text-lg font-bold mb-4">Recent Analysis</h2>
      <div className="match-info mb-4">
        <div className="font-semibold">Map: {recentAnalysis.map}</div>
        <div className={`font-semibold ${recentAnalysis.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
          {recentAnalysis.result}
        </div>
        <div className="font-semibold">Duration: {recentAnalysis.duration}</div>
        <div className="font-semibold">Match Date: {new Date(recentAnalysis.match_date).toLocaleString('en-US', {
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
              {yourTeam.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="px-1 py-0.5 border text-center">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
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
              {opponentTeam.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="px-1 py-0.5 border text-center">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="analysis-container">
        <h3 className="text-md font-semibold mb-2">Match Analysis</h3>
        <div className="analysis-content">
          {recentAnalysis.analysis || 'No analysis available'}
        </div>
      </div>
    </div>
  );
}

export default RecentAnalysis;
