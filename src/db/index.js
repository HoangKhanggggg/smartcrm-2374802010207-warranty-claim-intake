
require('dotenv').config();

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'smart_crm',
});

const query = (text, params) => pool.query(text, params);

const getClient = () => pool.connect();

const migrate = async () => {
  const client = await pool.connect();

  try {
    const migrationPath = path.join(
      __dirname,
      'migrations',
      '001_create_tables.sql'
    );

    const sql = fs.readFileSync(migrationPath, 'utf8');

    await client.query(sql);

    console.log('Đã chạy migration PostgreSQL thành công.');
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getClient,
  migrate,
};
