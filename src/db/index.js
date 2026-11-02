
require('dotenv').config({ quiet: true });

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || ''),
  database: process.env.DB_NAME || 'smart_crm',
});

// Thực thi truy vấn bằng parameterized query.
const query = (text, params) => pool.query(text, params);

// Lấy kết nối riêng để thực hiện transaction.
const getClient = () => pool.connect();

// Đọc và thực thi các file migration theo thứ tự.
const migrate = async () => {
  const client = await pool.connect();

  try {
    const dir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(dir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      await client.query(
        fs.readFileSync(path.join(dir, file), 'utf8')
      );

      // Ghi log JSON, không ghi thông tin kết nối hoặc dữ liệu nhạy cảm.
      logger.info('Đã chạy migration', { path: file });
    }
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  getClient,
  migrate
};
