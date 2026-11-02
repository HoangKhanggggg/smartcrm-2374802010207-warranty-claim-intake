const { randomUUID } = require('crypto');
const logger = require('../utils/logger');

// Mỗi request có một mã riêng để đối chiếu response và log.
function requestId(req, res, next) {
  const incomingId = req.get('x-request-id');
  // Chấp nhận ID do gateway cấp nếu hợp lệ; nếu không tự sinh UUID.
  req.requestId = typeof incomingId === 'string' && /^[a-zA-Z0-9._-]{1,80}$/.test(incomingId)
    ? incomingId
    : randomUUID();

  res.setHeader('X-Request-Id', req.requestId);
  const startedAt = Date.now();
  res.on('finish', () => {
    logger.info('HTTP request completed', {
      requestId: req.requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt
    });
  });
  next();
}

module.exports = requestId;
