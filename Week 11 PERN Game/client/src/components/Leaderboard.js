import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Leaderboard.css';

const API_URL = 'http://localhost:5001/api/players';

const Leaderboard = ({ isOpen, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log('Opening leaderboard...');
      fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching leaderboard data...');
      await axios.get(`${API_URL}/test`);
      console.log('API test successful');
      
      const response = await axios.get(`${API_URL}/leaderboard`);
      console.log('Received leaderboard data:', response.data);
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please make sure the server is running.');
      } else {
        setError('Failed to load leaderboard. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="leaderboard-modal">
      <div className="leaderboard-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Leaderboard</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="leaderboard-list">
            {players.length === 0 ? (
              <div className="no-data">No players yet</div>
            ) : (
              players.map((player, index) => (
                <div key={player.id} className="leaderboard-item">
                  <span className="rank">{index + 1}</span>
                  <span className="name">{player.name}</span>
                  <span className="score">{player.score} wins</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard; 