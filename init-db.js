const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase()
{
  // First, create a connection without specifying a database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    multipleStatements: true // Allow multiple statements in a single query
  });

  try
  {
    console.log('Reading database schema...');
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing database schema...');
    await connection.query(schema);

    console.log('Database initialized successfully!');
  } catch (error)
  {
    console.error('Error initializing database:', error.message);
  } finally
  {
    await connection.end();
  }
}

initializeDatabase();