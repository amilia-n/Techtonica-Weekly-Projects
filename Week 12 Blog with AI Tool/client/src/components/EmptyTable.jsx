import React from 'react';
import './EmptyTable.css';

function EmptyTable({ 
  tableData, 
  matchInfo, 
  handleCellEdit,
  error,
  isSavedData = false 
}) {
  const renderEditableCell = (team, rowIndex, colIndex, value) => {
    const isAgentCell = colIndex === 0;

    if (isSavedData) {
      return (
        <td 
          key={`${team}-${rowIndex}-${colIndex}`} 
          className="px-1 py-0.5 border text-center"
        >
          {value}
        </td>
      );
    }

    return (
      <td 
        key={`${team}-${rowIndex}-${colIndex}`} 
        className="px-1 py-0.5 border text-center"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => handleCellEdit(team, rowIndex, colIndex, e.target.value)}
          className="w-full h-full text-center"
          placeholder={isAgentCell ? "Agent name" : ""}
        />
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
              matchInfo?.result === 'Victory' 
                ? 'text-green-600' 
                : matchInfo?.result === 'Tie' 
                  ? 'text-yellow-600' 
                  : 'text-red-600'
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
                  <tr key={rowIndex} className="hover:bg-gray-50">
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
                  <tr key={rowIndex} className="hover:bg-gray-50">
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
}

export default EmptyTable;
