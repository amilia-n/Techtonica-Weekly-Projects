require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/connect');

const app = express();
app.use(cors());
app.use(express.json());

// Get all contacts with tags
app.get('/contacts', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await pool.query(
      `SELECT 
          c.id AS contact_id,
          c.name AS contact_name,
          c.phone,
          c.email,
          c.note,
          COALESCE(string_agg(t.name, ', '), 'No Tags') AS tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.name ILIKE $1
      GROUP BY c.id, c.name, c.phone, c.email, c.note;`,
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
