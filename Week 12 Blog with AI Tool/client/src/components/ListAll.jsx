import React, { useState, useEffect } from 'react';
import './ListAll.css';

function ListAll() {
  const [savedMatches, setSavedMatches] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedMatches, setExpandedMatches] = useState(new Set());

  useEffect(() => {
    fetchSavedMatches();
  }, []);

  const fetchSavedMatches = async () => {
    try {
      console.log('Fetching matches from server...');
      
      // Now fetch matches
      const response = await fetch('http://localhost:3000/matches');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response not OK:', response.status, errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Received matches:', data);
      
      if (!Array.isArray(data)) {
        console.error('Received invalid data format:', data);
        throw new Error('Invalid data format received from server');
      }
      
      setSavedMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    console.log('Attempting to delete match:', matchId);
    
    if (!window.confirm('Are you sure you want to delete this match?')) {
      console.log('Delete operation cancelled by user');
      return;
    }

    try {
      console.log('Sending DELETE request to:', `http://localhost:3000/matches/${matchId}`);
      const response = await fetch(`http://localhost:3000/matches/${matchId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Failed to delete match';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If we can't parse the error response as JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        console.error('Delete request failed:', errorMessage);
        throw new Error(errorMessage);
      }

      // Try to parse the response as JSON
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.log('Response was not JSON, continuing with UI update');
        responseData = { success: true };
      }

      console.log('Delete successful, updating UI state');
      // Remove the deleted match from the state
      setSavedMatches(prev => {
        const newMatches = prev.filter(match => match.match_id !== matchId);
        console.log('Updated matches count:', newMatches.length);
        return newMatches;
      });
      
      // If the match was expanded, remove it from expanded matches
      setExpandedMatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(matchId);
        return newSet;
      });
    } catch (err) {
      console.error('Error deleting match:', err);
      alert(err.message || 'Failed to delete match');
    }
  };

  const toggleMatch = (matchId) => {
    setExpandedMatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matchId)) {
        newSet.delete(matchId);
      } else {
        newSet.add(matchId);
      }
      return newSet;
    });
  };

  const processSavedMatchData = (match) => {
    if (!match || !match.all_players_data || !match.all_players_data.teams) {
      console.error('Invalid match data:', match);
      return { yourTeam: [], opponentTeam: [] };
    }
    
    const yourTeam = [];
    const opponentTeam = [];
    
    match.all_players_data.teams.forEach(team => {
      team.players.forEach(player => {
        const playerData = [
          player.agent || '',
          player.rank || '',
          player.acs || '',
          player.kda || '',
          player.ddDelta || '',
          player.adr || '',
          player.hsPercentage || '',
          player.fk || '',
          player.fd || ''
        ];
        
        if (team.team === 'yourTeam') {
          yourTeam.push(playerData);
        } else if (team.team === 'opponentTeam') {
          opponentTeam.push(playerData);
        }
      });
    });
    
    while (yourTeam.length < 5) {
      yourTeam.push(Array(9).fill(''));
    }
    
    while (opponentTeam.length < 5) {
      opponentTeam.push(Array(9).fill(''));
    }
    
    return { yourTeam, opponentTeam };
  };

  const renderMatchCell = (value, rowIndex, colIndex) => {
    return <td key={`${rowIndex}-${colIndex}`} className="list-all-table-cell">{value}</td>;
  };

  if (loading) {
    return (
      <div className="list-all">
        <h2 className="text-lg font-bold mb-4">Match History</h2>
        <div className="text-gray-500 bg-gray-50 p-4 rounded-md">
          Loading match history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-all">
        <h2 className="text-lg font-bold mb-4">Match History</h2>
      </div>
    );
  }

  if (savedMatches.length === 0) {
    return (
      <div className="list-all">
        <h2 className="text-lg font-bold mb-4">Match History</h2>
      </div>
    );
  }

  return (
    <div className="list-all">
      <h2 className="text-lg font-bold mb-4">Match History</h2>
      {savedMatches.map((match) => {
        const { yourTeam, opponentTeam } = processSavedMatchData(match);
        const isExpanded = expandedMatches.has(match.match_id);

        return (
          <div key={match.match_id} className="list-all-match-container">
            <div 
              className="list-all-match-header"
              onClick={() => toggleMatch(match.match_id)}
            >
              <div className="list-all-match-info">
                <div className="font-semibold">Map: {match.map}</div>
                <div className={`font-semibold ${match.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
                  {match.result}
                </div>
                <div className="font-semibold">Duration: {match.duration}</div>
                <div className="font-semibold">Match Date: {new Date(match.match_date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}</div>
              </div>
              <div className="list-all-match-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMatch(match.match_id);
                  }}
                  className="delete-button"
                >
                  Delete
                </button>
                <div className="list-all-match-toggle">
                  {isExpanded ? '-' : '+'}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="list-all-match-content">
                {/* Your Team Table */}
                <div className="list-all-table-container">
                  <h3 className="list-all-table-title">Your Team</h3>
                  <div className="list-all-table-wrapper">
                    <table className="list-all-table">
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
                            {row.map((cell, colIndex) => renderMatchCell(cell, rowIndex, colIndex))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Opponent Team Table */}
                <div className="list-all-table-container">
                  <h3 className="list-all-table-title">Opponent Team</h3>
                  <div className="list-all-table-wrapper">
                    <table className="list-all-table">
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
                            {row.map((cell, colIndex) => renderMatchCell(cell, rowIndex, colIndex))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="list-all-analysis-container">
                  <h3 className="text-md font-semibold mb-2">Match Analysis</h3>
                  <div className="analysis-content">
                    {match.analysis || 'No analysis available'}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListAll;
