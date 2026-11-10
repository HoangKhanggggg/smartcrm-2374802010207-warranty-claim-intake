const router = require('express').Router();
const { createToken } = require('../utils/auth');
const AppError = require('../utils/AppError');

// Danh sách tài khoản và vai trò được cấu hình từ môi trường.
function getAccounts() {
  return [
    {
      username: process.env.STAFF_USER,
      password: process.env.STAFF_PASSWORD,
      role: 'NHAN_VIEN_TIEP_NHAN'
    },
    {
      username: process.env.MANAGER_USER,
      password: process.env.MANAGER_PASSWORD,
      role: 'QUAN_LY_TRUNG_TAM'
    }
  ];
}

router.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    const accounts = getAccounts();

    // Kiểm tra cấu hình đăng nhập.
    const configured = accounts.every(
      (account) => account.username && account.password
    );

    if (
      !configured ||
      !process.env.AUTH_SECRET ||
      process.env.AUTH_SECRET.length < 32
    ) {
      return next(new AppError('CHUA_CAU_HINH_DANG_NHAP', 503));
    }

    // Tìm tài khoản hợp lệ.
    const account = accounts.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    if (!account) {
      return next(
        new AppError('SAI_TAI_KHOAN_HOAC_MAT_KHAU', 401)
      );
    }

    // Backend tự gán vai trò, không nhận role từ Client.
    const token = createToken(account.username, account.role);

    return res.json({
      data: {
        token,
        username: account.username,
        role: account.role
      }
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
