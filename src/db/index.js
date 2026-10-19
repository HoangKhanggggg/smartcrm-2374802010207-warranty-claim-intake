require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''), // Ép kiểu chuỗi bắt buộc
  database: process.env.DB_NAME || 'smart_crm',
});

const query = (text, params) => pool.query(text, params);
const getClient = () => pool.connect();

const migrate = async () => {
  const client = await pool.connect();
  console.log('Đã kết nối cơ sở dữ liệu PostgreSQL thành công!');
  client.release();
};

module.exports = {
  pool,
  query,
  getClient,
  migrate,
};