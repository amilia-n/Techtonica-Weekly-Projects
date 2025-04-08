import React, { useState, useRef } from 'react';
import EmptyTable from './EmptyTable';
import './GenerateTable.css';

const VALORANT_AGENTS = [
  'Astra', 'Breach', 'Brimstone', 'Chamber', 'Clove', 'Cypher',
  'Deadlock', 'Fade', 'Gekko', 'Harbor', 'Iso', 'Jett', 'KAY/O',
  'Killjoy', 'Neon', 'Omen', 'Phoenix', 'Raze', 'Reyna', 'Sage',
  'Skye', 'Sova', 'Viper', 'Yoru', 'Tejo', 'Waylay'
];

function GenerateTable({ onAnalysisComplete }) {
  const [tableData, setTableData] = useState({
    teamA: Array(5).fill().map(() => Array(9).fill('')),
    teamB: Array(5).fill().map(() => Array(9).fill(''))
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
  const [matchResult, setMatchResult] = useState('Victory');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const pasteBoxRef = useRef(null);
  const [selectedTeam, setSelectedTeam] = useState(null); // 'teamA' or 'teamB'
  const [selectedUser, setSelectedUser] = useState({ team: null, rowIndex: null });

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

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    // Reset selected user when team changes
    setSelectedUser({...selectedUser, team });
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

    if (selectedTeam) {
      const teamData = selectedTeam === 'teamA' ? tableData.teamA : tableData.teamB;
      const matchIndex = teamData.findIndex(row => 
        row[0].toLowerCase() === value.toLowerCase()
      );

      if (matchIndex !== -1) {
        setSelectedUser({ 
          team: selectedTeam === 'teamA' ? 'teamA' : 'teamB', 
          rowIndex: matchIndex 
        });
      }
    }
  };

  const handleAgentSelect = (agent) => {
    setAgentInput(agent);
    setSuggestions([]);

    // Only find matching agent in selected team
    if (selectedTeam) {
      const teamData = selectedTeam === 'teamA' ? tableData.teamA : tableData.teamB;
      const matchIndex = teamData.findIndex(row => 
        row[0].toLowerCase() === agent.toLowerCase()
      );

      if (matchIndex !== -1) {
        setSelectedUser({ 
          team: selectedTeam === 'teamA' ? 'teamA' : 'teamB', 
          rowIndex: matchIndex 
        });
      }
    }
  };

  const handleCellEdit = (team, rowIndex, colIndex, value) => {
    setTableData(prev => {
      const newData = { ...prev };
      newData[team][rowIndex][colIndex] = value;
      return newData;
    });

    if (colIndex === 0 && value.toLowerCase() === agentInput.toLowerCase()) {
      const currentTeam = team === 'teamA' ? 'teamA' : 'teamB';
      if (currentTeam === selectedTeam) {
        setSelectedUser({ team, rowIndex });
      }
    }
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
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({
          pastedData,
          agentName: agentInput
        }),
      });

      const responseData = await response.json();
      console.log("RESPONSE DATA", JSON.stringify(responseData));

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || 'Failed to process match data');
      }

      setMatchInfo({
        date: responseData.matchInfo?.date || '',
        map: responseData.matchInfo?.map || '',
        result: responseData.matchInfo?.result || '',
        duration: responseData.matchInfo?.duration || ''
      });

      const newTableData = {
        teamA: Array(5).fill().map(() => Array(9).fill('')),
        teamB: Array(5).fill().map(() => Array(9).fill(''))
      };

      if (Array.isArray(responseData.all_players_data?.teamA)) {
        responseData.all_players_data.teamA.forEach((player, index) => {
          if (index < 5) {
            newTableData.teamA[index] = [
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

      if (Array.isArray(responseData.all_players_data?.teamB)) {
        responseData.all_players_data.teamB.forEach((player, index) => {
          if (index < 5) {
            newTableData.teamB[index] = [
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

  const handleCellClick = (team, rowIndex, colIndex) => {
    if (colIndex === 0) { 
      const currentTeam = team === 'teamA' ? 'teamA' : 'teamB';
      setSelectedTeam(currentTeam);
      setSelectedUser({ team, rowIndex });
      setAgentInput(tableData[team][rowIndex][0]); 
    }
  };

  const renderEditableCell = (team, rowIndex, colIndex, value) => {
    const isSelected = selectedUser.team === team && selectedUser.rowIndex === rowIndex;
    const isAgentCell = colIndex === 0;

    if (isAgentCell) {
      return (
        <td 
          key={`${team}-${rowIndex}-${colIndex}`} 
          className={`px-1 py-0.5 border text-center cursor-pointer ${
            isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => handleCellClick(team, rowIndex, colIndex)}
        >
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
      <td 
        key={`${team}-${rowIndex}-${colIndex}`} 
        className={`px-1 py-0.5 border text-center ${
          isSelected ? 'bg-blue-50' : ''
        }`}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => handleCellEdit(team, rowIndex, colIndex, e.target.value)}
          className="w-full h-full text-center"
        />
      </td>
    );
  };

  const handleSubmitTable = async () => {
    try {
      if (!selectedTeam) {
        setError('Please select your team first');
        return;
      }

      if (!selectedUser.team) {
        setError('Please select your row or enter your agent name');
        return;
      }

      // Determine which team won based on match result and selected team
      const isUserTeamA = selectedUser.team === 'teamA';
      const isUserWinner = matchResult === 'Victory';
      
      // Create team data with proper structure
      const teamAData = isUserTeamA ? tableData[selectedUser.team] : tableData[selectedUser.team === 'teamA' ? 'teamB' : 'teamA'];
      const teamBData = isUserTeamA ? tableData[selectedUser.team === 'teamA' ? 'teamB' : 'teamA'] : tableData[selectedUser.team];

      const teamA = teamAData.map((row, index) => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: row[4],
        adr: parseFloat(row[5]) || 0,
        hsPercentage: row[6],
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0,
        is_user: isUserTeamA && selectedUser.rowIndex === index
      }));

      const teamB = teamBData.map((row, index) => ({
        agent: row[0],
        rank: row[1],
        acs: parseInt(row[2]) || 0,
        kda: row[3],
        ddDelta: row[4],
        adr: parseFloat(row[5]) || 0,
        hsPercentage: row[6],
        fk: parseInt(row[7]) || 0,
        fd: parseInt(row[8]) || 0,
        is_user: !isUserTeamA && selectedUser.rowIndex === index
      }));

      const matchData = {
        map: matchInfo.map,
        result: matchResult,
        duration: matchInfo.duration || '00:00',
        match_date: matchInfo.date,
        all_players_data: {
          teamA,
          teamB,
          // Add metadata to help with analysis
          userTeam: isUserTeamA ? 'teamA' : 'teamB',
          matchResult
        }
      };

      setIsAnalyzing(true);
      await onAnalysisComplete(matchData);
    } catch (err) {
      console.error('Error preparing match data:', err);
      setError(err.message || 'Failed to prepare match data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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
              {suggestions.map((agent) => (
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
        <EmptyTable 
          tableData={tableData}
          matchInfo={{
            map: matchInfo.map,
            result: (
              <div className="flex justify-center gap-2">
                <button
                  className={`px-3 py-1 rounded ${matchResult === 'Victory' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                  onClick={() => setMatchResult('Victory')}
                >
                  Victory
                </button>
                <button
                  className={`px-3 py-1 rounded ${matchResult === 'Defeat' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                  onClick={() => setMatchResult('Defeat')}
                >
                  Defeat
                </button>
              </div>
            ),
            duration: matchInfo.duration,
            date: matchInfo.date
          }}
          selectedUser={selectedUser}
          selectedTeam={selectedTeam}
          handleCellEdit={handleCellEdit}
          handleTeamSelect={handleTeamSelect}
          error={error}
        />
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
