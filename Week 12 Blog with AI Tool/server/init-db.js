require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Create a new pool without specifying a database
// This is different from connect.js which includes the database name
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'db', 'db.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content by statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    // Execute each statement
    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('Executed SQL statement successfully');
      } catch (err) {
        console.error('Error executing SQL statement:', err.message);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Database initialization completed');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    pool.end();
  }
}

initializeDatabase(); 