
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// Middleware xử lý lỗi tập trung, ghi log tại một nơi.
function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Chỉ AppError mới được xem là lỗi nghiệp vụ đã kiểm soát.
  const knownError = err instanceof AppError;

  // Nhận diện lỗi dữ liệu đầu vào từ Express/body-parser.
  const parserStatus =
    err &&
    [400, 413, 415].includes(err.status) &&
    err.type
      ? err.status
      : null;

  const status = knownError
    ? err.status
    : (parserStatus || 500);

  const code = knownError
    ? err.code
    : (parserStatus ? 'DU_LIEU_KHONG_HOP_LE' : 'LOI_HE_THONG');

  const context = {
    requestId: req.requestId,
    method: req.method,
    path: req.path,
    statusCode: status,
    errorCode: code,
    errorName: err?.name || 'Error'
  };

  if (status >= 500) {
    logger.error('Request failed', context);
  } else {
    logger.warn('Request rejected', context);
  }

  return res.status(status).json({
    error: code,
    requestId: req.requestId
  });
}

module.exports = errorHandler;
