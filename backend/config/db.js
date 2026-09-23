const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'learnlike_lms',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
};

let pool = null;

async function getPool() {
  if (!pool) {
    // First ensure database exists
    try {
      const initConn = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        multipleStatements: true
      });

      await initConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
      await initConn.end();
    } catch (err) {
      console.warn(`[DB WARNING] Could not pre-create database "${dbConfig.database}":`, err.message);
    }

    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Helper to execute query using pool
async function query(sql, params = []) {
  const p = await getPool();
  const [results] = await p.query(sql, params);
  return results;
}

// Function to bootstrap database from database.sql if tables are empty
async function initDatabase() {
  try {
    const p = await getPool();
    const [tables] = await p.query('SHOW TABLES;');
    
    if (tables.length === 0) {
      console.log('[DB] No tables found. Initializing database from database.sql...');
      const sqlPath = path.join(__dirname, '..', '..', 'database', 'database.sql');
      if (fs.existsSync(sqlPath)) {
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        await p.query(sqlContent);
        console.log('[DB] Database schema and initial seeds created successfully.');
      }
    } else {
      console.log(`[DB] Connected to MySQL database "${dbConfig.database}" with ${tables.length} tables.`);
    }
  } catch (error) {
    console.error('[DB ERROR] Failed during database initialization:', error.message);
  }
}

module.exports = {
  getPool,
  query,
  initDatabase,
  dbConfig
};
