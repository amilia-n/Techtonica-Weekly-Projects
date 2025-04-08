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
      setLoading(true);
      const response = await fetch('http://localhost:3000/matches');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data);
      setSavedMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError(err.message || 'Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const toggleMatchExpansion = (matchId) => {
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

  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm('Are you sure you want to delete this match?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/matches/${matchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete match');
      }

      // Remove the deleted match from the state
      setSavedMatches(prev => prev.filter(match => match.match_id !== matchId));
      
      // If the match was expanded, remove it from expanded matches
      setExpandedMatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(matchId);
        return newSet;
      });
    } catch (err) {
      console.error('Error deleting match:', err);
      alert('Failed to delete match');
    }
  };

  const processMatchData = (match) => {
    if (!match.all_players_data) return { yourTeam: [], opponentTeam: [] };

    const yourTeam = match.all_players_data.teamA.map(player => ({
      agent: player.agent || '',
      rank: player.rank || '',
      acs: player.acs || '',
      kda: player.kda || '',
      ddDelta: player.ddDelta || '',
      adr: player.adr || '',
      hsPercentage: player.hsPercentage || '',
      fk: player.fk || '',
      fd: player.fd || '',
      is_user: player.is_user || false
    }));

    const opponentTeam = match.all_players_data.teamB.map(player => ({
      agent: player.agent || '',
      rank: player.rank || '',
      acs: player.acs || '',
      kda: player.kda || '',
      ddDelta: player.ddDelta || '',
      adr: player.adr || '',
      hsPercentage: player.hsPercentage || '',
      fk: player.fk || '',
      fd: player.fd || '',
      is_user: player.is_user || false
    }));

    return { yourTeam, opponentTeam };
  };

  if (loading) {
    return (
      <div className="list-all">
        <h2 className="text-lg font-bold mb-4">Saved Matches</h2>
        <div className="text-gray-500 bg-gray-50 p-4 rounded-md">
          Loading matches...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="list-all">
        <h2 className="text-lg font-bold mb-4">Saved Matches</h2>
        <div className="text-red-500 bg-red-50 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (savedMatches.length === 0) {
    return (
      <div className="list-all">
        <h2 className="text-lg font-bold mb-4">Saved Matches</h2>
        <div className="text-gray-500 bg-gray-50 p-4 rounded-md">
          No saved matches found.
        </div>
      </div>
    );
  }

  return (
    <div className="list-all">
      <h2 className="text-lg font-bold mb-4">Saved Matches</h2>
      <div className="space-y-4">
        {savedMatches.map(match => {
          const { yourTeam, opponentTeam } = processMatchData(match);
          const isExpanded = expandedMatches.has(match.match_id);

          return (
            <div key={match.match_id} className="border rounded-lg p-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleMatchExpansion(match.match_id)}
              >
                <div>
                  <span className="font-semibold">{match.map}</span>
                  <span className={`ml-2 ${match.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
                    {match.result}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    {new Date(match.match_date).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMatch(match.match_id);
                    }}
                    className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4">
                  {/* Your Team */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Your Team</h3>
                    <div className="overflow-x-auto">
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
                          {yourTeam.map((player, index) => (
                            <tr key={index} className={player.is_user ? 'bg-blue-50' : ''}>
                              <td>{player.agent}</td>
                              <td>{player.rank}</td>
                              <td>{player.acs}</td>
                              <td>{player.kda}</td>
                              <td>{player.ddDelta}</td>
                              <td>{player.adr}</td>
                              <td>{player.hsPercentage}</td>
                              <td>{player.fk}</td>
                              <td>{player.fd}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Opponent Team */}
                  <div>
                    <h3 className="text-md font-semibold mb-2">Opponent Team</h3>
                    <div className="overflow-x-auto">
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
                          {opponentTeam.map((player, index) => (
                            <tr key={index} className={player.is_user ? 'bg-blue-50' : ''}>
                              <td>{player.agent}</td>
                              <td>{player.rank}</td>
                              <td>{player.acs}</td>
                              <td>{player.kda}</td>
                              <td>{player.ddDelta}</td>
                              <td>{player.adr}</td>
                              <td>{player.hsPercentage}</td>
                              <td>{player.fk}</td>
                              <td>{player.fd}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Match Analysis */}
                  {match.analysis && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Match Analysis</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {match.analysis}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListAll;
