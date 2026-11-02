const { verifyToken } = require('../utils/auth');
const AppError = require('../utils/AppError');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const user = verifyToken(token);

  if (!user) return next(new AppError('CHUA_DANG_NHAP', 401));
  req.user = user;
  next();
}

module.exports = requireAuth;
