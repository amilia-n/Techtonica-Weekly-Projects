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
  const [matchResult, setMatchResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const pasteBoxRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [processedData, setProcessedData] = useState(null);

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

    if (!matchResult) {
      setError('Please select Victory or Defeat');
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
          agentName: agentInput,
          matchResult,
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
        result: matchResult,
        duration: responseData.matchInfo?.duration || ''
      });

      const newTableData = {
        teamA: Array(5).fill().map(() => Array(9).fill('')),
        teamB: Array(5).fill().map(() => Array(9).fill(''))
      };

      setProcessedData(responseData);

      if (Array.isArray(responseData.all_players_data?.teamA)) {
        responseData.all_players_data.teamA.forEach((player, index) => {
          if (index < 5) {
            newTableData.teamA[index] = [
              player.agent ?? '',
              player.rank ?? '',
              player.acs ?? '0',
              player.kda ?? '0/0/0',
              player.damage_delta ?? player.ddDelta ?? '0',
              player.adr ?? '0',
              player.hs_percent ?? player.hsPercentage ?? '0%',
              player.first_kills ?? player.fk ?? '0',
              player.first_deaths ?? player.fd ?? '0'
            ];
          }
        });
      }

      if (Array.isArray(responseData.all_players_data?.teamB)) {
        responseData.all_players_data.teamB.forEach((player, index) => {
          if (index < 5) {
            newTableData.teamB[index] = [
              player.agent ?? '',
              player.rank ?? '',
              player.acs ?? '0',
              player.kda ?? '0/0/0',
              player.damage_delta ?? player.ddDelta ?? '0',
              player.adr ?? '0',
              player.hs_percent ?? player.hsPercentage ?? '0%',
              player.first_kills ?? player.fk ?? '0',
              player.first_deaths ?? player.fd ?? '0'
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
      setSelectedUser({ team, rowIndex });
      setAgentInput(tableData[team][rowIndex][0]);
    }
  };

  const handleSubmitTable = async () => {
    try {
      if (!pastedData || !matchResult) {
        setError('Please ensure all match data is filled out');
        return;
      }

      setIsAnalyzing(true);
      setError('');

      const safeParseInt = (value, fallback = 0) => {
        const parsed = parseInt(value);
        return isNaN(parsed) ? fallback : parsed;
      };

      const safeParseFloat = (value, fallback = 0) => {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? fallback : parsed;
      };

      const teamAData = tableData.teamA.map((row, index) => {
        const processedPlayer = processedData?.all_players_data?.teamA?.[index] || {};
        const [kills = 0, deaths = 0, assists = 0] = (row[3] || '0/0/0').split('/').map(val => safeParseInt(val));
        const playerId = processedPlayer.player_id || `player_${row[0]}_teamA_${index}`;
        const acs = safeParseInt(row[2]);
        const adr = safeParseFloat(row[5]);
        const firstKills = safeParseInt(row[7]);
        const firstDeaths = safeParseInt(row[8]);
        const damageDelta = row[4] || '0';
        const hsPercent = (row[6] || '0%').toString();
        const kdaString = `${kills}/${deaths}/${assists}`;
        
        return {
          player_id: playerId,
          agent: row[0] || '',
          rank: row[1] || '',
          acs: acs,
          kills: kills,
          deaths: deaths,
          assists: assists,
          kda: kdaString,
          damage_delta: damageDelta,
          adr: adr,
          hs_percent: hsPercent,
          first_kills: firstKills,
          first_deaths: firstDeaths,
          team: 'teamA'
        };
      });

      const teamBData = tableData.teamB.map((row, index) => {
        const processedPlayer = processedData?.all_players_data?.teamB?.[index] || {};
        const [kills = 0, deaths = 0, assists = 0] = (row[3] || '0/0/0').split('/').map(val => safeParseInt(val));
        const playerId = processedPlayer.player_id || `player_${row[0]}_teamB_${index}`;
        const acs = safeParseInt(row[2]);
        const adr = safeParseFloat(row[5]);
        const firstKills = safeParseInt(row[7]);
        const firstDeaths = safeParseInt(row[8]);
        const damageDelta = row[4] || '0';
        const hsPercent = (row[6] || '0%').toString();
        const kdaString = `${kills}/${deaths}/${assists}`;
        
        return {
          player_id: playerId,
          agent: row[0] || '',
          rank: row[1] || '',
          acs: acs,
          kills: kills,
          deaths: deaths,
          assists: assists,
          kda: kdaString,
          damage_delta: damageDelta,
          adr: adr,
          hs_percent: hsPercent,
          first_kills: firstKills,
          first_deaths: firstDeaths,
          team: 'teamB'
        };
      });


      const formattedData = {
        map: matchInfo.map || "Unknown Map",
        result: matchResult,
        duration: matchInfo.duration || '00:00',
        match_date: matchInfo.date || new Date().toISOString(),
        all_players_data: {
          teamA: teamAData,
          teamB: teamBData,
        },
        agentName: agentInput
      };

      console.log("Sending data to server:", JSON.stringify(formattedData, null, 2));

      const response = await fetch('http://localhost:3000/save-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save match data');
      }

      const result = await response.json();
      console.log('Match data saved successfully:', result);
      
      setPastedData('');
      setAgentInput('');
      setMatchResult(null);
      setError(null);
      
      if (onAnalysisComplete) {
        onAnalysisComplete({
          match_id: result.match_id,
          map: matchInfo.map,
          result: matchResult,
          duration: matchInfo.duration,
          match_date: matchInfo.date,
          all_players_data: {
            teamA: teamAData,
            teamB: teamBData
          },
          agentName: agentInput
        });
      }
      
      alert('Match data saved successfully!');
    } catch (error) {
      console.error('Error submitting table:', error);
      setError('Failed to submit match data. Please try again.');
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
        <div className="win-loss-container">
          <div className="flex justify-center gap-2">
          It was a:
            <button
              className={`px-3 py-1 rounded ${matchResult === 'Victory' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}
              onClick={() => setMatchResult('Victory')}
            >
              Victory
            </button>
            <button
              className={`px-3 py-1 rounded ${matchResult === 'Defeat' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-300'}`}
              onClick={() => setMatchResult('Defeat')}
            >
              Defeat
            </button>
            <button
              className={`px-3 py-1 rounded ${matchResult === 'Tie' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-300'}`}
              onClick={() => setMatchResult('Tie')}
            >
              Tie
            </button>
          </div>
        </div>
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
            result: matchInfo.result,
            duration: matchInfo.duration,
            date: matchInfo.date
          }}
          selectedUser={selectedUser}
          handleCellEdit={handleCellEdit}
          handleCellClick={handleCellClick}
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
