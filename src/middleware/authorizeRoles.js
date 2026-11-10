
const AppError = require('../utils/AppError');

// Chỉ cho phép người dùng có một trong các vai trò được chỉ định.
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Chưa xác thực hoặc không có thông tin vai trò.
    if (!req.user || !req.user.role) {
      return next(new AppError('CHUA_DANG_NHAP', 401));
    }

    // Đã đăng nhập nhưng không đủ quyền.
    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('KHONG_CO_QUYEN_TRUY_CAP', 403));
    }

    next();
  };
}

module.exports = authorizeRoles;
