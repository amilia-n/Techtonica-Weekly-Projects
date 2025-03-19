const express = require('express');
const client = require('./db/connect');

const app = express();

// Middleware
app.use(express.json());

// GET all species
app.get('/api/species', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM species');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single species by ID
app.get('/api/species/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.query('SELECT * FROM species WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Species not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;