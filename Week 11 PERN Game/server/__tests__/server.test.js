const axios = require('axios');

const API_URL = 'http://localhost:5001/api/players';

describe('Game API Tests', () => {
  let testPlayerId;

  test('should create a new player', async () => {
    const response = await axios.post(API_URL, {
      name: 'Test Player',
      score: 0
    });
    expect(response.status).toBe(201);
    const player = response.data;
    expect(player).toHaveProperty('id');
    expect(player.name).toBe('Test Player');
    expect(player.score).toBe(0);
    testPlayerId = player.id;
  });

  test('should get leaderboard', async () => {
    const response = await axios.get(`${API_URL}/leaderboard`);
    expect(response.status).toBe(200);
    const leaderboard = response.data;
    expect(Array.isArray(leaderboard)).toBe(true);
    expect(leaderboard.length).toBeGreaterThan(0);
  });

  test('should update player score', async () => {
    const response = await axios.put(`${API_URL}/${testPlayerId}`, {
      score: 5
    });
    expect(response.status).toBe(200);
    const player = response.data;
    expect(player.score).toBe(5);
  });

  test('should handle invalid player ID', async () => {
    try {
      await axios.get(`${API_URL}/999999`);
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
}); 