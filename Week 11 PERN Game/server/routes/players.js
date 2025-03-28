const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/test', (req, res) => {
    res.json({ message: 'Players API is working' });
});

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

router.post('/', async (req, res) => {
    const { name, score } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO players (name, score) VALUES ($1, $2) RETURNING *',
            [name, score]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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