import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './Board.css';

const GomokuBoard = () => {
  const [board, setBoard] = useState(Array(15).fill().map(() => Array(15).fill(null)));
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const [blackTime, setBlackTime] = useState(600);
  const [whiteTime, setWhiteTime] = useState(600);
  const [activePlayer, setActivePlayer] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [winner, setWinner] = useState(null);

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

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
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
      setWinner(currentPlayer);
      shootConfetti();
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
      <div className="gomoku-board">
      </div>
    </div>
  );
};

export default GomokuBoard;