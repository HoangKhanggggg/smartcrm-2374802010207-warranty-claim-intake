
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { migrate } = require('./db');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
}));

app.use(express.json());

// API kiểm tra HTTP
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Khai báo routes
app.use('/auth', require('./routes/auth'));

// Các API nghiệp vụ yêu cầu đăng nhập
const requireAuth = require('./middleware/requireAuth');
app.use('/tickets', requireAuth, require('./routes/tickets'));
app.use('/', requireAuth, require('./routes/lookup'));

// Hàm khởi động server
const startServer = async () => {
  try {
    await migrate();
    console.log('Khởi tạo cơ sở dữ liệu PostgreSQL thành công.');

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server CRM đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      'Lỗi khi khởi động server hoặc kết nối DB:',
      error.message
    );
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
