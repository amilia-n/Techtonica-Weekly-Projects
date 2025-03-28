const express = require('express');
const router = express.Router();
const pool = require('../db');

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Players API is working' });
});

// Get top 10 players (leaderboard)
router.get('/leaderboard', async (req, res) => {
    try {
        console.log('Fetching leaderboard...');
        const result = await pool.query(
            'SELECT * FROM players ORDER BY score DESC LIMIT 10'
        );
        console.log('Leaderboard data:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching leaderboard:', err);
        res.status(500).json({ error: err.message });
    }
});

// Create a new player
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO players (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update player's score
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { score } = req.body;
    try {
        const result = await pool.query(
            'UPDATE players SET score = $1 WHERE id = $2 RETURNING *',
            [score, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a player
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM players WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }
        res.json({ message: 'Player deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 