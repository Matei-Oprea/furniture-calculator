const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pool connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'furniture_calculator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: process.env.DB_PORT || 3306
});

// Test the connection
async function testConnection()
{
  try
  {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully');
    connection.release();
    return true;
  } catch (error)
  {
    console.error('Database connection failed:', error.message);
    console.log('Please check if the database "furniture_calculator" exists');
    return false;
  }
}

// Initialize database connection
testConnection();

module.exports = pool;