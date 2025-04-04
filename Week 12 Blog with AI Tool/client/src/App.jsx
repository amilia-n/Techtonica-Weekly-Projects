import './App.css'
import React, { useState, useRef, useEffect } from 'react'
import Browser from './components/Browser'

const VALORANT_AGENTS = [
  'Astra', 'Breach', 'Brimstone', 'Chamber', 'Clove', 'Cypher', 
  'Deadlock', 'Fade', 'Gekko', 'Harbor', 'Iso', 'Jett', 'KAY/O', 
  'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage', 
  'Skye', 'Sova', 'Viper', 'Yoru', 'Tejo', 'Waylay'
];

function App() {
  const [tableData, setTableData] = useState({
    yourTeam: Array(5).fill().map(() => Array(9).fill('')),
    opponentTeam: Array(5).fill().map(() => Array(9).fill(''))
  });
  const [agentInput, setAgentInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [pastedData, setPastedData] = useState('');
  const [matchInfo, setMatchInfo] = useState({
    date: '',
    map: '',
    result: '',
    duration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const pasteBoxRef = useRef(null);
  const [savedMatches, setSavedMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Add loading animation styles
  const loadingGunStyle = {
    width: '60px',
    height: '60px',
    marginTop: '5px',
    marginLeft: '-8px',
    verticalAlign: 'middle'
  };

  // Fetch saved matches when component mounts
  useEffect(() => {
    fetchSavedMatches();
  }, []);

  const fetchSavedMatches = async () => {
    try {
      const response = await fetch('http://localhost:3000/matches');
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      const data = await response.json();
      setSavedMatches(data);
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  };

  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
  };

  const handleAgentInputChange = (e) => {
    const value = e.target.value;
    setAgentInput(value);
    
    if (value.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = VALORANT_AGENTS.filter(agent => 
      agent.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleAgentSelect = (agent) => {
    setAgentInput(agent);
    setSuggestions([]);
  };

  const handleCellEdit = (team, rowIndex, colIndex, value) => {
    setTableData(prev => {
      const newData = { ...prev };
      newData[team][rowIndex][colIndex] = value;
      return newData;
    });
  };

  const handlePasteChange = (e) => {
    setPastedData(e.target.value);
  };

  const handleSubmitPaste = async () => {
    if (!pastedData.trim()) {
      setError('Please paste match data first');
      return;
    }

    if (!agentInput.trim()) {
      setError('Please enter your agent name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/process-match-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pastedData,
          agentName: agentInput
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Failed to process match data');
      }

      // Update match info
      setMatchInfo({
        date: responseData.matchInfo?.date || '',
        map: responseData.matchInfo?.map || '',
        result: responseData.matchInfo?.result || '',
        duration: responseData.matchInfo?.duration || ''
      });

      // Update table data
      const newTableData = {
        yourTeam: Array(5).fill().map(() => Array(9).fill('')),
        opponentTeam: Array(5).fill().map(() => Array(9).fill(''))
      };

      // Fill your team data
      if (Array.isArray(responseData.yourTeam)) {
        responseData.yourTeam.forEach((player, index) => {
          if (index < 5) {
            newTableData.yourTeam[index] = [
              player.agent || '',
              player.rank || '',
              player.acs || '',
              player.kda || '',
              player.ddDelta || '0',
              player.adr || '',
              player.hsPercentage || '0%',
              player.fk || '0',
              player.fd || '0'
            ];
          }
        });
      } else {
        console.error('Invalid yourTeam data:', responseData.yourTeam);
        throw new Error('Invalid response format: missing or invalid yourTeam data');
      }

      // Fill opponent team data
      if (Array.isArray(responseData.opponentTeam)) {
        responseData.opponentTeam.forEach((player, index) => {
          if (index < 5) {
            newTableData.opponentTeam[index] = [
              player.agent || '',
              player.rank || '',
              player.acs || '',
              player.kda || '',
              player.ddDelta || '0',
              player.adr || '',
              player.hsPercentage || '0%',
              player.fk || '0',
              player.fd || '0'
            ];
          }
        });
      } else {
        console.error('Invalid opponentTeam data:', responseData.opponentTeam);
        throw new Error('Invalid response format: missing or invalid opponentTeam data');
      }

      setTableData(newTableData);
    } catch (err) {
      console.error('Error processing match data:', err);
      setError(err.message || 'Failed to process match data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTable = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Convert table data to the format expected by the server
      const yourTeam = tableData.yourTeam.map(row => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: parseInt(row[4]) || 0,
        adr: parseFloat(row[5]) || 0,
        hsPercentage: parseFloat(row[6]) || 0,
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0
      }));

      const opponentTeam = tableData.opponentTeam.map(row => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: parseInt(row[4]) || 0,
        adr: parseFloat(row[5]) || 0,
        hsPercentage: parseFloat(row[6]) || 0,
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0
      }));

      const response = await fetch('http://localhost:3000/save-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchInfo,
          yourTeam,
          opponentTeam
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save match data');
      }

      // Clear form after successful submission
      setPastedData('');
      setAgentInput('');
      setTableData({
        yourTeam: Array(5).fill().map(() => Array(9).fill('')),
        opponentTeam: Array(5).fill().map(() => Array(9).fill(''))
      });
      setMatchInfo({
        date: '',
        map: '',
        result: '',
        duration: ''
      });
      
      // Refresh saved matches
      fetchSavedMatches();
      
      alert('Match data saved successfully!');
    } catch (err) {
      console.error('Error saving match data:', err);
      setError('Failed to save match data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderEditableCell = (team, rowIndex, colIndex, value) => {
    if (colIndex === 0) {
      return (
        <td key={`${team}-${rowIndex}-${colIndex}`} className="px-1 py-0.5 border text-center">
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(team, rowIndex, colIndex, e.target.value)}
            className="w-full h-full text-center"
            placeholder="Agent name"
          />
        </td>
      );
    }
    return (
      <td key={`${team}-${rowIndex}-${colIndex}`} className="px-1 py-0.5 border text-center">
        <input
          type="text"
          value={value}
          onChange={(e) => handleCellEdit(team, rowIndex, colIndex, e.target.value)}
          className="w-full h-full text-center"
        />
      </td>
    );
  };

  // Render a non-editable cell for the saved match display
  const renderSavedMatchCell = (value, rowIndex, colIndex) => {
    return <td key={`saved-${rowIndex}-${colIndex}`} className="px-1 py-0.5 border text-center">{value}</td>;
  };

  // Process saved match data for display
  const processSavedMatchData = (match) => {
    if (!match || !match.players) return { yourTeam: [], opponentTeam: [] };
    
    const yourTeam = [];
    const opponentTeam = [];
    
    match.players.forEach(player => {
      const playerData = [
        player.agent || '',
        player.rank || '',
        player.acs || '',
        player.kda || '',
        player.dd_delta || '',
        player.adr || '',
        player.hs_percentage || '',
        player.fk || '',
        player.fd || ''
      ];
      
      if (player.team === 'yourTeam') {
        yourTeam.push(playerData);
      } else if (player.team === 'opponentTeam') {
        opponentTeam.push(playerData);
      }
    });
    
    // Ensure we have 5 rows for each team
    while (yourTeam.length < 5) {
      yourTeam.push(Array(9).fill(''));
    }
    
    while (opponentTeam.length < 5) {
      opponentTeam.push(Array(9).fill(''));
    }
    
    return { yourTeam, opponentTeam };
  };

  return (
    
    <div className='home-container'>
      <datalist id="agent-list">
        {VALORANT_AGENTS.map(agent => (
          <option key={agent} value={agent} />
        ))}
      </datalist>
      Home Page
      <div className='nav'>Toggle: 1) Home  2) All Entries</div>
      <div className='instructions'>
        Instructions:
        <ol>
          <li>how to get match data from tracker.gg</li>
          <li>enter info to convert</li>
          <li>review and edit table</li>
          <li>submit to save to db</li>
          <li>drop table for ai analysis</li>
        </ol>
      </div>
      <div className="p-4"> {/* Simple container div */}
      <Browser /> {/* Clean component usage */}
    </div>
    <div className='raw-game-stat'>
    <label className='paste-container'>
      <textarea  
      className='paste-box'
      placeholder='Paste your information here'
      rows={4} 
      cols={40} 
      value={pastedData}
      onChange={handlePasteChange}
      ref={pasteBoxRef}
      />
      <div className="agent-input-container">
        <input 
          className='agent-name' 
          placeholder="Select Agent" 
          value={agentInput}
          onChange={handleAgentInputChange}
        />
        {suggestions.length > 0 && (
          <div className="agent-suggestions">
            {suggestions.map((agent, index) => (
              <div
                key={agent}
                className="agent-suggestion"
                onClick={() => handleAgentSelect(agent)}
              >
                {agent}
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
        className='submit-paste'
        onClick={handleSubmitPaste}
        disabled={isLoading}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto',
          minWidth: '120px',
          padding: '8px 16px'
        }}
      >
        {isLoading ? (
          <>
            <img 
              src="/loading.gif" 
              alt="Loading..." 
              style={loadingGunStyle}
            />Loading...
          </>
        ) : (
          'Convert'
        )}
      </button>
      <div className="key-explanation">
        {/* Key explanation will go here */}
        <div style={{ fontSize: "12px" }}>
  <div><strong>ACS:</strong> Average Combat Score</div>
  <div><strong>K/D/A:</strong> Kills / Deaths / Assists</div>
  <div><strong>DDΔ:</strong> Damage Delta Difference</div>
  <div><strong>ADR:</strong> Average Damage per Round</div>
  <div><strong>HS%:</strong> Headshot Percentage</div>
  <div><strong>FK/FD:</strong> First Kills/First Deaths</div>
  <div><strong>Nine Ranks:</strong> Three Division Per Rank [1 → 3]</div>
  <div>Iron → Bronze → Silver → Gold → Platinum → Diamond → Ascendant → Immortal → Radiant</div>
</div>

      </div>
      </label>

      <div className='table-render'>
        <div className='table-display'>
          {/* Match Header */}
          <div className="mb-2 p-2 bg-gray-100 rounded text-xs">
            <div className="flex justify-between items-center">
              <div className="font-semibold">Map: {matchInfo.map}</div>
              <div className={`font-semibold ${matchInfo.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
                {matchInfo.result}
              </div>
              <div className="font-semibold">Duration: {matchInfo.duration}</div>
              <div className="font-semibold">Match Date: {matchInfo.date ? new Date(matchInfo.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : ''}</div>
            </div>
          </div>

          {error && <div className="text-red-500 mb-2">{error}</div>}

          {/* Team 1 Table (Self Team) */}
          <div className="mb-4">
            <h3 className="text-xs font-semibold mb-1">Your Team</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 py-0.5 border">Agent</th>
                    <th className="px-1 py-0.5 border">Rank</th>
                    <th className="px-1 py-0.5 border">ACS</th>
                    <th className="px-1 py-0.5 border">K/D/A</th>
                    <th className="px-1 py-0.5 border">DDΔ</th>
                    <th className="px-1 py-0.5 border">ADR</th>
                    <th className="px-1 py-0.5 border">HS%</th>
                    <th className="px-1 py-0.5 border">FK</th>
                    <th className="px-1 py-0.5 border">FD</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.yourTeam.map((row, rowIndex) => (
                    <tr key={rowIndex} className={`hover:bg-gray-50 ${rowIndex === 0 ? 'bg-green-50' : ''}`}>
                      {row.map((cell, colIndex) => renderEditableCell('yourTeam', rowIndex, colIndex, cell))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team 2 Table (Opponent Team) */}
          <div>
            <h3 className="text-xs font-semibold mb-1">Opponent Team</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-1 py-0.5 border">Agent</th>
                    <th className="px-1 py-0.5 border">Rank</th>
                    <th className="px-1 py-0.5 border">ACS</th>
                    <th className="px-1 py-0.5 border">K/D/A</th>
                    <th className="px-1 py-0.5 border">DDΔ</th>
                    <th className="px-1 py-0.5 border">ADR</th>
                    <th className="px-1 py-0.5 border">HS%</th>
                    <th className="px-1 py-0.5 border">FK</th>
                    <th className="px-1 py-0.5 border">FD</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.opponentTeam.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, colIndex) => renderEditableCell('opponentTeam', rowIndex, colIndex, cell))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      <button 
        className='analyze'
        onClick={handleSubmitTable}
        disabled={isLoading}
      >
        Analyze Game
        {/* Submit table for gpt query, create table to log match 
        + table for individual (player stat) with gpt response 
        future implementation: player summary*/}
      </button>
      </div>
      
    </div>

      <div className='list-all'> 
      {/* Generate Game Entrt */}
      <div className='add-new-form'> 
        
      </div>
        <div className='single-game'>
          {selectedMatch ? (
            <div>
              <h2 className="text-lg font-bold mb-2">Saved Match Details</h2>
              <div className="mb-2 p-2 bg-gray-100 rounded text-xs">
                <div className="flex justify-between items-center">
                  <div className="font-semibold">Match Date: {new Date(selectedMatch.match_date).toLocaleString()}</div>
                  <div className={`font-semibold ${selectedMatch.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedMatch.result}
                  </div>
                  <div className="font-semibold">Map: {selectedMatch.map}</div>
                </div>
              </div>
              
              {/* Your Team Table */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold mb-1">Your Team</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-1 py-0.5 border">Agent</th>
                        <th className="px-1 py-0.5 border">Rank</th>
                        <th className="px-1 py-0.5 border">ACS</th>
                        <th className="px-1 py-0.5 border">K/D/A</th>
                        <th className="px-1 py-0.5 border">DDΔ</th>
                        <th className="px-1 py-0.5 border">ADR</th>
                        <th className="px-1 py-0.5 border">HS%</th>
                        <th className="px-1 py-0.5 border">FK</th>
                        <th className="px-1 py-0.5 border">FD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processSavedMatchData(selectedMatch).yourTeam.map((row, rowIndex) => (
                        <tr key={rowIndex} className={`hover:bg-gray-50 ${rowIndex === 0 ? 'bg-green-50' : ''}`}>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="px-1 py-0.5 border text-center">
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
              <div>
                <h3 className="text-xs font-semibold mb-1">Opponent Team</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-1 py-0.5 border">Agent</th>
                        <th className="px-1 py-0.5 border">Rank</th>
                        <th className="px-1 py-0.5 border">ACS</th>
                        <th className="px-1 py-0.5 border">K/D/A</th>
                        <th className="px-1 py-0.5 border">DDΔ</th>
                        <th className="px-1 py-0.5 border">ADR</th>
                        <th className="px-1 py-0.5 border">HS%</th>
                        <th className="px-1 py-0.5 border">FK</th>
                        <th className="px-1 py-0.5 border">FD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processSavedMatchData(selectedMatch).opponentTeam.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="px-1 py-0.5 border text-center">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-2">Saved Matches</h2>
              {savedMatches.length > 0 ? (
                <div className="mb-4">
                  <p className="mb-2">Select a match to view details:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {savedMatches.map((match) => (
                      <div 
                        key={match.id} 
                        className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                        onClick={() => handleMatchSelect(match)}
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">{new Date(match.match_date).toLocaleDateString()}</span>
                          <span className={`font-semibold ${match.result === 'Victory' ? 'text-green-600' : 'text-red-600'}`}>
                            {match.result}
                          </span>
                          <span className="font-semibold">{match.map}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No saved matches found. Submit a match to see it here.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='ai-query-form'> 
        Form for AI query 

      </div>
      <div className='ai-response'> 
        Collection of AI responses
        Route to this page
      </div>
    </div>
  )
}

export default App
