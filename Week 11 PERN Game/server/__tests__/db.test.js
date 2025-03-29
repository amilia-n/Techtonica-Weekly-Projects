const pool = require('../db');

describe('Database Tests', () => {
  let testPlayerId;

  test('should connect to database', async () => {
    const result = await pool.query('SELECT NOW()');
    expect(result.rows).toBeDefined();
  });

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

  test('should update player score in database', async () => {
    const result = await pool.query(
      'UPDATE players SET score = $1 WHERE id = $2 RETURNING *',
      [10, testPlayerId]
    );
    expect(result.rows[0].score).toBe(10);
  });


  afterAll(async () => {
    await pool.query('DELETE FROM players WHERE name LIKE $1', ['Test%']);
    await pool.end();
  });
}); 