const db = require('./db');
const mockData = require('./mockData.json');

async function loadMockData() {
  try {
    // Clear existing data
    await db.query('DELETE FROM participants');
    await db.query('DELETE FROM events');

    // Reset sequences
    await db.query('ALTER SEQUENCE events_id_seq RESTART WITH 1');
    await db.query('ALTER SEQUENCE participants_id_seq RESTART WITH 1');

    // Insert events
    for (const event of mockData.events) {
      await db.query(
        `INSERT INTO events (name, location, start_time, end_time, description, category, pinned) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [event.name, event.location, event.start_time, event.end_time, event.description, event.category, event.pinned]
      );
    }

    // Insert participants
    for (const participant of mockData.participants) {
      await db.query(
        `INSERT INTO participants (event_id, first_name, last_name, email, status, attendance, note) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [participant.event_id, participant.first_name, participant.last_name, participant.email, participant.status, participant.attendance, participant.note]
      );
    }

    console.log('Mock data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error loading mock data:', error);
    process.exit(1);
  }
}

loadMockData(); 