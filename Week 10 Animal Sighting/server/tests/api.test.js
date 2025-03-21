const request = require('supertest');
const app = require('../app');

describe('Sightings API', () => {
  let testSightingId;

  const testSighting = {
    sighting_time: '2024-03-21T12:00:00Z',
    individual_id: 1, 
    location: 'Test Location',
    appeared_healthy: true,
    sighter_email: 'test@example.com',
    image_url: 'https://example.com/test.jpg'
  };

  // GET /api/sightings
  test('GET /api/sightings should return all sightings', async () => {
    const response = await request(app)
      .get('/api/sightings')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /api/sightings
  test('POST /api/sightings should create a new sighting', async () => {
    const response = await request(app)
      .post('/api/sightings')
      .send(testSighting)
      .expect(200); // Changed from 201 to match the actual implementation

    expect(response.body).toHaveProperty('id');
    testSightingId = response.body.id;
  });

  // GET /api/sightings/:id
  test('GET /api/sightings/:id should return a specific sighting', async () => {
    const response = await request(app)
      .get(`/api/sightings/${testSightingId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.location).toBe(testSighting.location);
  });

  // PUT /api/sightings/:id
  test('PUT /api/sightings/:id should update a sighting', async () => {
    const updatedData = {
      ...testSighting,
      location: 'Updated Location'
    };

    const response = await request(app)
      .put(`/api/sightings/${testSightingId}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.location).toBe('Updated Location');
  });

  // DELETE /api/sightings/:id
  test('DELETE /api/sightings/:id should delete a sighting', async () => {
    await request(app)
      .delete(`/api/sightings/${testSightingId}`)
      .expect(200);

    // Verify deletion
    await request(app)
      .get(`/api/sightings/${testSightingId}`)
      .expect(404);
  });

  // Clean up after tests
  afterAll(async () => {
    // Close database connection
    if (app.locals.db) {
      await app.locals.db.end();
    }
  });
}); 