import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import axios from 'axios';
import Leaderboard from './Leaderboard';
import './Board.css'; 

const GomokuBoard = () => {
  const [board, setBoard] = useState(Array(15).fill().map(() => Array(15).fill(null))); 
  const [isBlackTurn, setIsBlackTurn] = useState(true); 
  const [blackTime, setBlackTime] = useState(600); 
  const [whiteTime, setWhiteTime] = useState(600); 
  const [activePlayer, setActivePlayer] = useState(null); 
  const [gameStarted, setGameStarted] = useState(false); 
  const [winner, setWinner] = useState(null); 
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (!gameStarted || winner) return; 

    const timer = setInterval(() => {
      activePlayer === 'black'
        ? setBlackTime(prevTime =>
            prevTime <= 1
              ? (setWinner('W'), shootConfetti(), 0)
              : prevTime - 1
          )
        : setWhiteTime(prevTime =>
            prevTime <= 1
              ? (setWinner('B'), shootConfetti(), 0)
              : prevTime - 1
          );
    }, 1000);

    return () => clearInterval(timer);
  }, [activePlayer, gameStarted, winner]);

  const checkWin = (row, col, player) => {
    const directions = [
      { x: 1, y: 0 },  
      { x: 0, y: 1 },  
      { x: 1, y: 1 },  
      { x: 1, y: -1 } 
    ];

    for (let { x, y } of directions) {
      let count = 1;
      for (let i = 1; i < 5; i++) {
        const newRow = row + i * y;
        const newCol = col + i * x;
        if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || board[newRow][newCol] !== player) break;
        count++;
      }
      for (let i = 1; i < 5; i++) {
        const newRow = row - i * y;
        const newCol = col - i * x;
        if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15 || board[newRow][newCol] !== player) break;
        count++;
      }
      if (count === 5) return true;
    }
    return false;
  };

  const checkTie = () => board.every(row => row.every(cell => cell !== null));

  const handleWin = async (player) => {
    setWinner(player);
    shootConfetti();

    // Wait for win message to be displayed
    setTimeout(async () => {
      // Prompt for player name
      const playerName = prompt('Enter your name to be added to the leaderboard (or cancel to skip):');
      if (!playerName) return;

      try {
        // Check if player exists
        const response = await axios.get(`http://localhost:5001/api/players/leaderboard`);
        const existingPlayer = response.data.find(p => p.name.toLowerCase() === playerName.toLowerCase());

        if (existingPlayer) {
          // Update existing player's score
          await axios.put(`http://localhost:5001/api/players/${existingPlayer.id}`, {
            score: existingPlayer.score + 1
          });
        } else {
          // Create new player with initial score of 1
          await axios.post('http://localhost:5001/api/players', {
            name: playerName,
            score: 1
          });
        }
      } catch (error) {
        console.error('Error updating leaderboard:', error);
      }
    }, 1000); // Wait 1 second after win message appears
  };

  const handleCellClick = (row, col) => {
    if (checkTie()) setWinner('T');
    if (board[row][col] || winner) return;

    const newBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === row && cIdx === col ? (isBlackTurn ? 'B' : 'W') : cell
      )
    );

    setBoard(newBoard);

    const currentPlayer = isBlackTurn ? 'B' : 'W';
    if (checkWin(row, col, currentPlayer)) {
      handleWin(currentPlayer);
    } else {
      setIsBlackTurn(!isBlackTurn);
      setActivePlayer(isBlackTurn ? 'white' : 'black');
    }
    if (!gameStarted) setGameStarted(true);
  };

  const shootConfetti = () => {
    const shoot = () => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.5 },
        colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.5 },
        colors: ['#A17D58', '#FAB3B3', '#FDF1D9', '#FFF8F0']
      });
    };
    shoot();
    setTimeout(shoot, 500);
    setTimeout(shoot, 1000);
  };

  const resetBoard = () => {
    setBoard(Array(15).fill().map(() => Array(15).fill(null)));
    setIsBlackTurn(true);
    setBlackTime(600);
    setWhiteTime(600);
    setActivePlayer(null);
    setGameStarted(false);
    setWinner(null);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const rowLabels = Array.from({ length: 15 }, (_, i) => 15 - i);

  const columnLabels = Array.from({ length: 15 }, (_, i) => String.fromCharCode(65 + i));

  const starPoints = [
    { row: 3, col: 3 },
    { row: 3, col: 11 },
    { row: 7, col: 7 },
    { row: 11, col: 3 },
    { row: 11, col: 11 }
  ];

  return (
    <div className="main">
      <div className="header">
        <h1 className="title">Gomoku Game</h1>
      </div>
      <p className="directions">
        Place five stones in a row to win.
        <br />Black goes first.
      </p>
      <button 
        className="leaderboard-link"
        onClick={() => setShowLeaderboard(true)}
      >
        Leaderboard
      </button>
      <div className="controls">
        <div className="timer-container">
          <div className="timer-label">Black's Time</div>
          <div className="timer">{formatTime(blackTime)}</div>
        </div>
        <button onClick={resetBoard} className="reset-button">Reset</button>
        <div className="timer-container">
          <div className="timer-label">White's Time</div>
          <div className="timer">{formatTime(whiteTime)}</div>
        </div>
      </div>
      {winner && (
        <div className="winner">
          {winner === 'B'
            ? 'Black Wins!'
            : winner === 'W'
            ? 'White Wins!'
            : "It's a Tie!"}
        </div>
      )}
      <div className="gomoku-board">
        <div className="border-left"></div>
        <div className="border-right"></div>
        {/* row labels */}
        {rowLabels.map((label, rowIndex) => (
          <div
            key={`row-${label}`}
            className="label row-label"
            style={{ top: `${rowIndex * 30 + 15}px` }}
          >
            {label}
          </div>
        ))}
        {/* column labels */}
        {columnLabels.map((label, colIndex) => (
          <div
            key={`col-${label}`}
            className="label column-label"
            style={{ left: `${colIndex * 30 + 15}px` }}
          >
            {label}
          </div>
        ))}
        {/* star points */}
        {starPoints.map(point => (
          <div
            key={`star-${point.row}-${point.col}`}
            className="star"
            style={{
              top: `${point.row * 30 + 15}px`,
              left: `${point.col * 30 + 15}px`
            }}
          ></div>
        ))}
        {/* board cells */}
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="cell"
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell === 'B'
                ? <div className="stone stone-black" />
                : cell === 'W'
                ? <div className="stone stone-white" />
                : null}
            </div>
          ))
        )}
      </div>
      <Leaderboard 
        isOpen={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
    </div>
  );
};

export default GomokuBoard;
