const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY start_time');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

// Add new event
app.post('/api/events', async (req, res) => {
  const { name, start_time, end_time, location, category, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO events (name, start_time, end_time, location, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, start_time, end_time, location, category, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Get all participants
app.get('/api/participants', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, e.name as event_name 
      FROM participants p 
      LEFT JOIN events e ON p.event_id = e.id 
      ORDER BY p.last_name, p.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching participants' });
  }
});

// Add new participant
app.post('/api/participants', async (req, res) => {
  const { firstName, lastName, email, status, note, eventId } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO participants (first_name, last_name, email, status, note, event_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstName, lastName, email, status, note, eventId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating participant' });
  }
});

// Get participants by event
app.get('/api/events/:eventId/participants', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM participants WHERE event_id = $1 ORDER BY last_name, first_name',
      [req.params.eventId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching event participants' });
  }
});

// Toggle participant attendance
app.patch('/api/participants/:id/attendance', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE participants SET attendance = NOT attendance WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating attendance' });
  }
});

// Toggle event pinned status
app.patch('/api/events/:id/pin', async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE events SET pinned = NOT pinned WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating pinned status' });
  }
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully', timestamp: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete event
app.delete('/api/events/:id', async (req, res) => {
  try {
    // First delete all participants associated with this event
    await db.query('DELETE FROM participants WHERE event_id = $1', [req.params.id]);
    
    // Then delete the event
    const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting event' });
  }
});

// Delete participant
app.delete('/api/participants/:id', async (req, res) => {
  try {
    const result = await db.query('DELETE FROM participants WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    res.json({ message: 'Participant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting participant' });
  }
});

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching event' });
  }
});

// Get single participant
app.get('/api/participants/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM participants WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching participant' });
  }
});

// Only start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 