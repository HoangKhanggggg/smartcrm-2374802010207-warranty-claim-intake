const { verifyToken } = require('../utils/auth');

// Thiếu hoặc sai token -> 401 để frontend xoá token và quay về trang đăng nhập.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const user = verifyToken(token);

  if (!user) return res.status(401).json({ error: 'CHUA_DANG_NHAP' });

  req.user = user;
  next();
}

module.exports = requireAuth;
