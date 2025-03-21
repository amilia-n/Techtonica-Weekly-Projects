// Express server application with RESTful API endpoints for species, individuals, and sightings
const express = require('express');
const cors = require('cors');
const pool = require('./db/connect');
const app = express();

// CORS configuration
app.use(cors());
app.use(express.json());

// GET all species with their individuals and sightings
app.get('/api/species', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        i.id as individual_id,
        i.nickname,
        st.id as sighting_id,
        st.sighting_time,
        st.location,
        st.appeared_healthy,
        st.sighter_email,
        st.image_url
      FROM species s
      LEFT JOIN individuals i ON s.id = i.species_id
      LEFT JOIN sightings st ON i.id = st.individual_id
      ORDER BY s.id, i.id, st.sighting_time DESC;
    `);

    // Transform the flat results into nested structure
    const speciesMap = new Map();

    result.rows.forEach(row => {
      if (!speciesMap.has(row.id)) {
        speciesMap.set(row.id, {
          id: row.id,
          commonName: row.commonname,
          scientificName: row.scientificname,
          conservationStatus: row.conservationstatus,
          wildPopulation: parseInt(row.wildpopulation),
          individuals: new Map()
        });
      }

      const species = speciesMap.get(row.id);

      if (row.individual_id && !species.individuals.has(row.individual_id)) {
        species.individuals.set(row.individual_id, {
          id: row.individual_id,
          nickname: row.nickname,
          sightings: []
        });
      }

      if (row.individual_id && row.sighting_id) {
        const individual = species.individuals.get(row.individual_id);
        individual.sightings.push({
          id: row.sighting_id,
          dateTime: row.sighting_time,
          location: row.location,
          appearedHealthy: row.appeared_healthy,
          sighterEmail: row.sighter_email,
          imageUrl: row.image_url
        });
      }
    });

    // Convert Maps to arrays for JSON response
    const speciesArray = Array.from(speciesMap.values()).map(species => ({
      ...species,
      individuals: Array.from(species.individuals.values())
    }));

    res.json(speciesArray);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST new species
app.post('/api/species', async (req, res) => {
  const { commonName, scientificName, conservationStatus, wildPopulation } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO species (commonName, scientificName, conservationStatus, wildPopulation) VALUES ($1, $2, $3, $4) RETURNING *',
      [commonName, scientificName, conservationStatus, wildPopulation]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error creating species:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// POST new individual
app.post('/api/individuals', async (req, res) => {
  const { nickname, species_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO individuals (nickname, species_id) VALUES ($1, $2) RETURNING *',
      [nickname, species_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new sighting
app.post('/api/sightings', async (req, res) => {
  const { individual_id, sighting_time, location, appeared_healthy, sighter_email, image_url } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sightings (individual_id, sighting_time, location, appeared_healthy, sighter_email, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [individual_id, sighting_time, location, appeared_healthy, sighter_email, image_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update species
app.put('/api/species/:id', async (req, res) => {
  const { id } = req.params;
  const { commonName, scientificName, conservationStatus, wildPopulation } = req.body;
  try {
    const result = await pool.query(
      'UPDATE species SET commonName = $1, scientificName = $2, conservationStatus = $3, wildPopulation = $4 WHERE id = $5 RETURNING *',
      [commonName, scientificName, conservationStatus, wildPopulation, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update individual
app.put('/api/individuals/:id', async (req, res) => {
  const { id } = req.params;
  const { nickname, species_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE individuals SET nickname = $1, species_id = $2 WHERE id = $3 RETURNING *',
      [nickname, species_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update sighting
app.put('/api/sightings/:id', async (req, res) => {
  const { id } = req.params;
  const { sighting_time, location, appeared_healthy, sighter_email, image_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE sightings SET sighting_time = $1, location = $2, appeared_healthy = $3, sighter_email = $4, image_url = $5 WHERE id = $6 RETURNING *',
      [sighting_time, location, appeared_healthy, sighter_email, image_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE species (cascades to individuals and sightings)
app.delete('/api/species/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM species WHERE id = $1', [id]);
    res.json({ message: 'Species deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE individual (cascades to sightings)
app.delete('/api/individuals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM individuals WHERE id = $1', [id]);
    res.json({ message: 'Individual deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE sighting
app.delete('/api/sightings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sightings WHERE id = $1', [id]);
    res.json({ message: 'Sighting deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all sightings
app.get('/api/sightings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, i.nickname, sp.commonName as species_name
      FROM sightings s
      JOIN individuals i ON s.individual_id = i.id
      JOIN species sp ON i.species_id = sp.id
      ORDER BY s.sighting_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET sighting by ID
app.get('/api/sightings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, i.nickname, sp.commonName as species_name
      FROM sightings s
      JOIN individuals i ON s.individual_id = i.id
      JOIN species sp ON i.species_id = sp.id
      WHERE s.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sighting not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;