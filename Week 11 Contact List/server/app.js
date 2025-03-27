require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all contacts with tags
app.get('/contacts', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await pool.query(
      `SELECT c.*, 
        COALESCE(string_agg(t.tag_name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.contact_id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.tag_id
      WHERE c.contact_name ILIKE $1
      GROUP BY c.contact_id
      ORDER BY c.contact_name`,
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.*, 
        COALESCE(string_agg(t.tag_name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.contact_id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.tag_id
      WHERE c.contact_id = $1
      GROUP BY c.contact_id`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new contact
app.post('/contacts', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { contact_name, phone, email, note, tags } = req.body;
    
    // Insert contact
    const contactResult = await client.query(
      `INSERT INTO contacts (contact_name, phone, email, note)
       VALUES ($1, $2, $3, $4)
       RETURNING contact_id`,
      [contact_name, phone, email, note]
    );
    
    const contactId = contactResult.rows[0].contact_id;
    
    // Handle tags if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Get or create tag
        const tagResult = await client.query(
          `INSERT INTO tags (tag_name)
           VALUES ($1)
           ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name
           RETURNING tag_id`,
          [tagName]
        );
        
        // Create contact-tag relationship
        await client.query(
          `INSERT INTO contact_tags (contact_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [contactId, tagResult.rows[0].tag_id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Fetch the complete contact with tags
    const result = await pool.query(
      `SELECT c.*, 
        COALESCE(string_agg(t.tag_name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.contact_id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.tag_id
      WHERE c.contact_id = $1
      GROUP BY c.contact_id`,
      [contactId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// PUT update contact
app.put('/contacts/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const { contact_name, phone, email, note, tags } = req.body;
    
    // Update contact
    await client.query(
      `UPDATE contacts 
       SET contact_name = $1, phone = $2, email = $3, note = $4
       WHERE contact_id = $5`,
      [contact_name, phone, email, note, id]
    );
    
    // Remove existing tag relationships
    await client.query(
      'DELETE FROM contact_tags WHERE contact_id = $1',
      [id]
    );
    
    // Add new tag relationships if provided
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        // Get or create tag
        const tagResult = await client.query(
          `INSERT INTO tags (tag_name)
           VALUES ($1)
           ON CONFLICT (tag_name) DO UPDATE SET tag_name = EXCLUDED.tag_name
           RETURNING tag_id`,
          [tagName]
        );
        
        // Create contact-tag relationship
        await client.query(
          `INSERT INTO contact_tags (contact_id, tag_id)
           VALUES ($1, $2)`,
          [id, tagResult.rows[0].tag_id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Fetch the updated contact with tags
    const result = await pool.query(
      `SELECT c.*, 
        COALESCE(string_agg(t.tag_name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.contact_id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.tag_id
      WHERE c.contact_id = $1
      GROUP BY c.contact_id`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
