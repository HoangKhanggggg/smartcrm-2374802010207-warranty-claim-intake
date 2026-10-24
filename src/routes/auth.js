const router = require('express').Router();
const { createToken } = require('../utils/auth');

// Tài khoản mẫu cho Sprint 2 (cấu hình qua .env). Chưa phân quyền theo vai trò (QT-11 hoãn).
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const okUser = process.env.APP_USER || 'nhanvien';
  const okPass = process.env.APP_PASSWORD || '123456';

  if (username !== okUser || password !== okPass) {
    return res.status(401).json({ error: 'SAI_TAI_KHOAN_HOAC_MAT_KHAU' });
  }
  res.json({ data: { token: createToken(username), username } });
});

module.exports = router;
