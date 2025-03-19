const client = require('../db/connect');
const fs = require('fs');
const path = require('path');

async function loadData() {
    try {
        // Load the JSON data
        const speciesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../../mock.JSON'), 'utf8'));

        // Insert species data into the database
        for (const species of speciesData) {
            await client.query(`
                INSERT INTO species (id, commonName, scientificName, conservationStatus, wildPopulation)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (id) DO NOTHING;
            `, [
                species.id,
                species.commonName,
                species.scientificName,
                species.conservationStatus,
                species.wildPopulation
            ]);
        }

        console.log('Species data loaded successfully!');
    } catch (err) {
        console.error('Error loading species data:', err);
    } finally {
        await client.end();
        console.log('Disconnected from the database.');
    }
}

loadData();