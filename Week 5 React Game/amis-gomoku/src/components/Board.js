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

  return (
    <div className="main">
      <div className="gomoku-board">
      </div>
    </div>
  );
};

export default GomokuBoard;