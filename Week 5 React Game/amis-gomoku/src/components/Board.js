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
  
  return (
    <div className="main">
      <div className="gomoku-board">
      </div>
    </div>
  );
};

export default GomokuBoard;