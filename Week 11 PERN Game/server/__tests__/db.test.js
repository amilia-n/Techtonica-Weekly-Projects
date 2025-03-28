const pool = require('../db');

describe('Database Tests', () => {
  let testPlayerId;

  // Test database connection
  test('should connect to database', async () => {
    const result = await pool.query('SELECT NOW()');
    expect(result.rows).toBeDefined();
  });

  // Test creating a player in database
  test('should insert a player into database', async () => {
    const result = await pool.query(
      'INSERT INTO players (name, score) VALUES ($1, $2) RETURNING *',
      ['Test DB Player', 0]
    );
    expect(result.rows[0]).toHaveProperty('id');
    expect(result.rows[0].name).toBe('Test DB Player');
    expect(result.rows[0].score).toBe(0);
    testPlayerId = result.rows[0].id;
  });

  // Test updating a player's score in database
  test('should update player score in database', async () => {
    const result = await pool.query(
      'UPDATE players SET score = $1 WHERE id = $2 RETURNING *',
      [10, testPlayerId]
    );
    expect(result.rows[0].score).toBe(10);
  });

  // Test getting top players from database
  test('should get top players from database', async () => {
    const result = await pool.query(
      'SELECT * FROM players ORDER BY score DESC LIMIT 10'
    );
    expect(Array.isArray(result.rows)).toBe(true);
    expect(result.rows.length).toBeGreaterThan(0);
  });

  // Test deleting a player from database
  test('should delete a player from database', async () => {
    await pool.query('DELETE FROM players WHERE id = $1', [testPlayerId]);
    
    // Verify player is deleted
    const result = await pool.query(
      'SELECT * FROM players WHERE id = $1',
      [testPlayerId]
    );
    expect(result.rows.length).toBe(0);
  });

  // Clean up after all tests
  afterAll(async () => {
    await pool.query('DELETE FROM players WHERE name LIKE $1', ['Test%']);
    await pool.end();
  });
}); 