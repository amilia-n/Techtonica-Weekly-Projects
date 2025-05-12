import React, { useState, useEffect } from 'react';
import './ListAll.css';
import EmptyTable from './EmptyTable';

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

      setSavedMatches(prev => prev.filter(match => match.match_id !== matchId));
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
    if (!match.all_players_data) return { teamA: [], teamB: [] };

    const formatTeamData = (players) => {
      return players.map(player => [
        player.agent ?? '',
        player.rank ?? '',
        player.acs ?? '0',
        player.kda ?? '0/0/0',
        player.damage_delta ?? player.ddDelta ?? '0',
        player.adr ?? '0',
        player.hs_percent ?? player.hsPercentage ?? '0%',
        player.first_kills ?? player.fk ?? '0',
        player.first_deaths ?? player.fd ?? '0'
      ]);
    };

    return {
      teamA: formatTeamData(match.all_players_data.teamA),
      teamB: formatTeamData(match.all_players_data.teamB)
    };
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


  return (
    <div className="list-all">
      <h2 className="text-lg font-bold mb-4">Saved Matches</h2>
      <div className="space-y-4">
        {savedMatches.map(match => {
          const { teamA, teamB } = processMatchData(match);
          const isExpanded = expandedMatches.has(match.match_id);

          return (
            <div key={match.match_id} className="match-container">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleMatchExpansion(match.match_id)}
              >
                <div>
                  <span className="font-semibold">{match.map}</span>
                  <span className={`ml-2 ${
                    match.result === 'Victory' 
                      ? 'text-green-600' 
                      : match.result === 'Tie' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
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
                  <EmptyTable 
                    tableData={{ teamA, teamB }}
                    matchInfo={{
                      map: match.map,
                      result: match.result,
                      duration: match.duration,
                      date: match.match_date
                    }}
                    isSavedData={true}
                  />

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
//TODO: display userAgent in header for different agent analysis in the same game 
// Do not save duplicate match, analysis should call the same matchid
export default ListAll;
