const request = require('supertest');
const express = require('express');
const app = require('./index');
const db = require('./db');

// Mock event data
const mockEvent = {
  name: "Test Event",
  start_time: "2024-03-20T18:00:00Z",
  end_time: "2024-03-20T20:00:00Z",
  location: "Test Location",
  category: "Test Category",
  description: "Test Description"
};

// Mock participant data
const mockParticipant = {
  firstName: "John",
  lastName: "Doe",
  email: "john@test.com",
  status: "confirmed",
  note: "Test note",
  eventId: 1
};

describe('Event API Endpoints', () => {
  let createdEventId;

  // Clean up after tests
  afterAll(async () => {
    await db.query('DELETE FROM participants WHERE email = $1', [mockParticipant.email]);
    await db.query('DELETE FROM events WHERE name = $1', [mockEvent.name]);
    await db.end();
  });

  // Test POST /api/events
  test('POST /api/events - should create a new event', async () => {
    const response = await request(app)
      .post('/api/events')
      .send(mockEvent);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(mockEvent.name);
    createdEventId = response.body.id;
  });

  // Test PUT /api/events/:id
  test('PATCH /api/events/:id/pin - should toggle event pinned status', async () => {
    const response = await request(app)
      .patch(`/api/events/${createdEventId}/pin`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pinned');
  });

  // Test DELETE /api/events/:id (you'll need to add this endpoint)
  test('DELETE /api/events/:id - should delete an event', async () => {
    const response = await request(app)
      .delete(`/api/events/${createdEventId}`);

    expect(response.status).toBe(200);
    
    // Verify event is deleted
    const checkEvent = await request(app)
      .get(`/api/events/${createdEventId}`);
    expect(checkEvent.status).toBe(404);
  });
});

describe('Participant API Endpoints', () => {
  let createdParticipantId;
  let eventId;

  // Create a test event before testing participants
  beforeAll(async () => {
    const eventResult = await db.query(
      'INSERT INTO events (name, start_time, end_time, location, category, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [mockEvent.name, mockEvent.start_time, mockEvent.end_time, mockEvent.location, mockEvent.category, mockEvent.description]
    );
    eventId = eventResult.rows[0].id;
    mockParticipant.eventId = eventId;
  });

  // Clean up after tests
  afterAll(async () => {
    await db.query('DELETE FROM participants WHERE email = $1', [mockParticipant.email]);
    await db.query('DELETE FROM events WHERE id = $1', [eventId]);
    await db.end();
  });

  // Test POST /api/participants
  test('POST /api/participants - should create a new participant', async () => {
    const response = await request(app)
      .post('/api/participants')
      .send(mockParticipant);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(mockParticipant.email);
    createdParticipantId = response.body.id;
  });

  // Test PATCH /api/participants/:id/attendance
  test('PATCH /api/participants/:id/attendance - should toggle attendance', async () => {
    const response = await request(app)
      .patch(`/api/participants/${createdParticipantId}/attendance`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('attendance');
  });

  // Test DELETE /api/participants/:id (you'll need to add this endpoint)
  test('DELETE /api/participants/:id - should delete a participant', async () => {
    const response = await request(app)
      .delete(`/api/participants/${createdParticipantId}`);

    expect(response.status).toBe(200);
    
    // Verify participant is deleted
    const checkParticipant = await request(app)
      .get(`/api/participants/${createdParticipantId}`);
    expect(checkParticipant.status).toBe(404);
  });
}); 