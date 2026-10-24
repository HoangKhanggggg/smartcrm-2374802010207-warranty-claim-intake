
require('dotenv').config({ quiet: true });

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
    const dir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      await client.query(fs.readFileSync(path.join(dir, file), 'utf8'));
      console.log(`Đã chạy migration: ${file}`);
    }
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
