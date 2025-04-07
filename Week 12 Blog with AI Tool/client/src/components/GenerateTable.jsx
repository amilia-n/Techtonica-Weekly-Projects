import React, { useState, useRef } from 'react';
import './GenerateTable.css';

const VALORANT_AGENTS = [
  'Astra', 'Breach', 'Brimstone', 'Chamber', 'Clove', 'Cypher',
  'Deadlock', 'Fade', 'Gekko', 'Harbor', 'Iso', 'Jett', 'KAY/O',
  'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage',
  'Skye', 'Sova', 'Viper', 'Yoru', 'Tejo', 'Waylay'
];

function GenerateTable() {
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const pasteBoxRef = useRef(null);
  const [aiAnalysis, setAiAnalysis] = useState('');

  // Add loading animation styles
  const loadingGunStyle = {
    width: '60px',
    height: '60px',
    marginTop: '5px',
    marginLeft: '-8px',
    verticalAlign: 'middle'
  };
  const loadingGunStyle2 = {
    width: '60px',
    height: '60px',
    marginTop: '5px',
    marginLeft: '-8px',
    verticalAlign: 'start'
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
    setIsAnalyzing(true);
    setError('');

    try {
      // Convert table data to the format expected by the server
      const yourTeam = tableData.yourTeam.map(row => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: row[4],
        adr: parseFloat(row[5]) || 0,
        hsPercentage: row[6],
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0,
        playerId: row[0] === agentInput ? agentInput : null // Set player ID for matching agent
      }));

      const opponentTeam = tableData.opponentTeam.map(row => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: row[4],
        adr: parseFloat(row[5]) || 0,
        hsPercentage: row[6],
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0,
        playerId: null // Opponent team players don't have IDs
      }));

      // First, save the match data
      const saveResponse = await fetch('http://localhost:3000/save-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchInfo: {
            map: matchInfo.map,
            result: matchInfo.result,
            date: matchInfo.date,
            duration: matchInfo.duration || '00:00'
          },
          yourTeam,
          opponentTeam,
          playerId: agentInput
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save match data');
      }

      const saveResult = await saveResponse.json();
      const matchId = saveResult.matchId;

      // Then, get AI analysis
      const analysisResponse = await fetch('http://localhost:3000/analyze-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchInfo: {
            ...matchInfo,
            matchId,
            duration: matchInfo.duration || '00:00'
          },
          yourTeam,
          opponentTeam
        }),
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Failed to get AI analysis');
      }


      const savedMatchesResponse = await fetch('http://localhost:3000/matches');
      if (savedMatchesResponse.ok) {
        const savedMatchesData = await savedMatchesResponse.json();
        localStorage.setItem('savedMatches', JSON.stringify(savedMatchesData));
      }
      
      alert('Match data saved and analyzed successfully!');
    } catch (err) {
      console.error('Error processing match data:', err);
      setError(err.message || 'Failed to process match data. Please try again.');
    } finally {
      setIsAnalyzing(false);
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

  return (
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
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <img 
                src="/rifle.gif" 
                alt="Analyzing Data..." 
                style={loadingGunStyle2}
              />Analyzing...
            </>
          ) : (
            'Analyze Game'
          )}
        </button>
      </div>
    </div>
  );
}

export default GenerateTable;
