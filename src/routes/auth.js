const router = require('express').Router();
const { createToken } = require('../utils/auth');
const AppError = require('../utils/AppError');

// Tài khoản mẫu cấu hình qua .env; không sử dụng tài khoản/mật khẩu mặc định.
router.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    const okUser = process.env.APP_USER;
    const okPass = process.env.APP_PASSWORD;

    if (!okUser || !okPass || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
      return next(new AppError('CHUA_CAU_HINH_DANG_NHAP', 503));
    }
    if (username !== okUser || password !== okPass) {
      return next(new AppError('SAI_TAI_KHOAN_HOAC_MAT_KHAU', 401));
    }
    return res.json({ data: { token: createToken(username), username } });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
