const requestId = require('../src/middleware/requestId');
const errorHandler = require('../src/middleware/errorHandler');
const AppError = require('../src/utils/AppError');

jest.mock('../src/utils/logger', () => ({ info: jest.fn(), warn: jest.fn(), error: jest.fn(), debug: jest.fn() }));
const logger = require('../src/utils/logger');

describe('requestId middleware', () => {
  test('tạo request ID và trả về header X-Request-Id', () => {
    const req = { get: jest.fn().mockReturnValue(undefined), method: 'GET', path: '/health' };
    const res = { setHeader: jest.fn(), on: jest.fn() };
    const next = jest.fn();
    requestId(req, res, next);
    expect(req.requestId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', req.requestId);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('giữ request ID hợp lệ do gateway gửi', () => {
    const req = { get: jest.fn().mockReturnValue('gateway-123'), method: 'GET', path: '/health' };
    const res = { setHeader: jest.fn(), on: jest.fn() };
    requestId(req, res, jest.fn());
    expect(req.requestId).toBe('gateway-123');
  });
});

describe('errorHandler middleware', () => {
  beforeEach(() => jest.clearAllMocks());
  test('ánh xạ AppError thành HTTP status và mã lỗi an toàn', () => {
    const req = { requestId: 'req-123', method: 'GET', path: '/tickets' };
    const res = { headersSent: false, status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorHandler(new AppError('DU_LIEU_KHONG_HOP_LE', 400), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'DU_LIEU_KHONG_HOP_LE', requestId: 'req-123' });
    expect(logger.warn).toHaveBeenCalledTimes(1);
  });

  test('ẩn chi tiết lỗi không xác định và trả HTTP 500', () => {
    const req = { requestId: 'req-456', method: 'GET', path: '/tickets' };
    const res = { headersSent: false, status: jest.fn().mockReturnThis(), json: jest.fn() };
    errorHandler(new Error('SQL password=secret'), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'LOI_HE_THONG', requestId: 'req-456' });
    expect(JSON.stringify(res.json.mock.calls)).not.toContain('secret');
    expect(logger.error).toHaveBeenCalledTimes(1);
  });
});
