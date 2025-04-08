import React from 'react';
import './EmptyTable.css';

const EmptyTable = ({
  tableData,
  matchInfo,
  selectedUser,
  selectedTeam,
  handleCellEdit,
  handleTeamSelect,
  error,
  isSavedData = false
}) => {
  const renderEditableCell = (team, rowIndex, colIndex, value) => {
    return (
      <td 
        key={`${team}-${rowIndex}-${colIndex}`} 
        className={`px-1 py-0.5 border text-center ${!isSavedData ? 'cursor-pointer' : ''}`}
        onClick={() => !isSavedData && handleCellEdit(team, rowIndex, colIndex)}
      >
        {!isSavedData ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellEdit(team, rowIndex, colIndex, e.target.value)}
            className="w-full h-full text-center"
            placeholder=" "
          />
        ) : (
          <span>{value}</span>
        )}
      </td>
    );
  };

  return (
    <div>
      <div className='table-display'>
        {/* Match Header */}
        <div className="mb-2 p-2 bg-gray-100 rounded text-xs">
          <div className="flex justify-between items-center">
            <div className="font-semibold">Map: {matchInfo?.map}</div>
            <div className={`font-semibold ${
              typeof matchInfo?.result === 'string' 
                ? matchInfo.result === 'Victory' 
                  ? 'text-green-600' 
                  : matchInfo.result === 'Defeat'
                  ? 'text-red-600'
                  : 'text-gray-300'
                : 'text-gray-300'
            }`}>
              {matchInfo?.result}
            </div>
            <div className="font-semibold">Duration: {matchInfo?.duration}</div>
            <div className="font-semibold">
              Match Date: {matchInfo?.date ? new Date(matchInfo.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              }) : ''}
            </div>
          </div>
        </div>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        {/* Team A Table */}
        <div className="mb-4">
          <div className="font-semibold px-4 mb-2">Team A</div>
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
                {tableData?.teamA?.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`hover:bg-gray-50 ${
                      selectedUser?.team === 'teamA' && selectedUser?.rowIndex === rowIndex ? 'bg-blue-100' : ''
                    }`}
                  >
                    {row.map((cell, colIndex) => renderEditableCell('teamA', rowIndex, colIndex, cell))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team B Table */}
        <div>
          <div className="font-semibold px-4 mb-2">Team B</div>
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
                {tableData?.teamB?.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`hover:bg-gray-50 ${
                      selectedUser?.team === 'teamB' && selectedUser?.rowIndex === rowIndex ? 'bg-blue-100' : ''
                    }`}
                  >
                    {row.map((cell, colIndex) => renderEditableCell('teamB', rowIndex, colIndex, cell))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyTable;
