class AppError extends Error {
  constructor(code, status = 400) {
    super(code);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace?.(this, AppError);
  }
}

module.exports = AppError;
