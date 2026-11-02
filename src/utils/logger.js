// Logger JSON ghi stdout; không ghi body, token, mật khẩu, SQL hoặc SĐT.
const LEVELS = { DEBUG: 10, INFO: 20, WARN: 30, ERROR: 40 };
const configuredLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
const threshold = LEVELS[configuredLevel] || LEVELS.INFO;

function write(level, message, context = {}) {
  if (LEVELS[level] < threshold) return;

  // Chỉ cho phép các trường ngữ cảnh an toàn đi vào log.
  const safeContext = {};
  for (const key of ['requestId', 'method', 'path', 'statusCode', 'durationMs', 'errorCode', 'errorName']) {
    const value = context[key];
    if (value !== undefined && value !== null) safeContext[key] = value;
  }

  process.stdout.write(`${JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message: String(message),
    ...safeContext
  })}\n`);
}

module.exports = {
  debug: (message, context) => write('DEBUG', message, context),
  info: (message, context) => write('INFO', message, context),
  warn: (message, context) => write('WARN', message, context),
  error: (message, context) => write('ERROR', message, context)
};
