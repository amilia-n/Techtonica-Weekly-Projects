require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database');
  release();
});

app.get('/contacts', async (req, res) => {
  try {
    const search = req.query.search || '';
    const result = await pool.query(
      `SELECT c.id as contact_id, c.name as contact_name, c.phone, c.email, c.note,
        COALESCE(string_agg(t.name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.name ILIKE $1 
      OR c.phone ILIKE $1
      OR t.name ILIKE $1
      GROUP BY c.id, c.name, c.phone, c.email, c.note
      ORDER BY c.name`,
      [`%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.id as contact_id, c.name as contact_name, c.phone, c.email, c.note,
        COALESCE(string_agg(t.name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.phone, c.email, c.note`,
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

app.post('/contacts', async (req, res) => {
  const { contact_name, phone, email, note, tags } = req.body;
  
  if (!contact_name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Contact name and phone number are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const contactResult = await client.query(
      `INSERT INTO contacts (name, phone, email, note)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [contact_name.trim(), phone.trim(), email || null, note || null]
    );
    
    const contactId = contactResult.rows[0].id;
    
    if (tags && tags.length > 0) {
      for (const tagName of tags) {

        const tagResult = await client.query(
          `INSERT INTO tags (name)
           VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [tagName]
        );
        
        await client.query(
          `INSERT INTO contact_tags (contact_id, tag_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [contactId, tagResult.rows[0].id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    const result = await pool.query(
      `SELECT c.id as contact_id, c.name as contact_name, c.phone, c.email, c.note,
        COALESCE(string_agg(t.name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.phone, c.email, c.note`,
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

app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { contact_name, phone, email, note, tags } = req.body;
  
  if (!contact_name?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'Contact name and phone number are required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE contacts 
       SET name = $1, phone = $2, email = $3, note = $4
       WHERE id = $5`,
      [contact_name.trim(), phone.trim(), email || null, note || null, id]
    );
    
    await client.query(
      'DELETE FROM contact_tags WHERE contact_id = $1',
      [id]
    );
    
    if (tags && tags.length > 0) {
      for (const tagName of tags) {

        const tagResult = await client.query(
          `INSERT INTO tags (name)
           VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [tagName]
        );
        
        await client.query(
          `INSERT INTO contact_tags (contact_id, tag_id)
           VALUES ($1, $2)`,
          [id, tagResult.rows[0].id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    const result = await pool.query(
      `SELECT c.id as contact_id, c.name as contact_name, c.phone, c.email, c.note,
        COALESCE(string_agg(t.name, ', '), 'No Tags') as tags
      FROM contacts c
      LEFT JOIN contact_tags ct ON c.id = ct.contact_id
      LEFT JOIN tags t ON ct.tag_id = t.id
      WHERE c.id = $1
      GROUP BY c.id, c.name, c.phone, c.email, c.note`,
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

app.delete('/contacts/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    console.log('Delete request received for contact ID:', id);
    
    const checkResult = await client.query(
      'SELECT id FROM contacts WHERE id = $1',
      [id]
    );
    
    console.log('Contact check result:', checkResult.rows);
    
    if (checkResult.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log('Contact not found with ID:', id);
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const result = await client.query(
      'DELETE FROM contacts WHERE id = $1 RETURNING id',
      [id]
    );
    
    console.log('Delete result:', result.rows);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      console.log('Contact not found with ID:', id);
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await client.query('COMMIT');
    console.log('Successfully deleted contact with ID:', id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: 'Server error while deleting contact' });
  } finally {
    client.release();
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
