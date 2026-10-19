require('dotenv').config();
const express = require('express');
const { migrate } = require('./db');

const app = express();

app.use(express.json());

// Khai báo các routes
app.use('/tickets', require('./routes/tickets'));

// Hàm khởi động server an toàn
const startServer = async () => {
  try {
    // 1. Chạy migration tạo bảng DB trước
    await migrate();
    console.log('Khởi tạo cơ sở dữ liệu PostgreSQL thành công.');

    // 2. Mở cổng nghe HTTP Request
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server CRM đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Lỗi khi khởi động server hoặc kết nối DB:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;