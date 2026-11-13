
require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const { migrate } = require('./db');

const requestId = require('./middleware/requestId');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const AppError = require('./utils/AppError');

const app = express();

app.use(requestId);

// Cho phép Frontend truy cập Backend từ các cổng được cấu hình.
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5175'
  ],
  exposedHeaders: ['X-Request-Id']
}));

app.use(express.json());

// API kiểm tra HTTP.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    requestId: req.requestId
  });
});

// Đăng nhập.
app.use('/auth', require('./routes/auth'));

// Các Router tự kiểm tra đăng nhập và vai trò tại từng endpoint.
app.use('/tickets', require('./routes/tickets'));
app.use('/', require('./routes/lookup'));

// API không tồn tại.
app.use((req, res, next) => {
  next(new AppError('KHONG_TIM_THAY_API', 404));
});

app.use(errorHandler);

function validateRuntimeConfig() {
  const required = [
    'STAFF_USER',
    'STAFF_PASSWORD',
    'MANAGER_USER',
    'MANAGER_PASSWORD',
    'AUTH_SECRET'
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Thiếu cấu hình môi trường: ${missing.join(', ')}`
    );
  }

  if (process.env.AUTH_SECRET.length < 32) {
    throw new Error('AUTH_SECRET phải có ít nhất 32 ký tự.');
  }

  if (process.env.STAFF_USER === process.env.MANAGER_USER) {
    throw new Error('Tài khoản nhân viên và quản lý phải khác nhau.');
  }
}

const startServer = async () => {
  try {
    validateRuntimeConfig();

    await migrate();

    logger.info('Khởi tạo cơ sở dữ liệu PostgreSQL thành công.');

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      logger.info('Server CRM đang chạy', {
        path: `http://localhost:${PORT}`
      });
    });
  } catch (error) {
    logger.error('Không thể khởi động server', {
      errorName: error.name
    });

    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
module.exports.validateRuntimeConfig = validateRuntimeConfig;
