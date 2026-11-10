
// Kiểm thử API tiếp nhận phiếu bảo hành bằng Supertest.

// Giả lập xác thực người dùng với vai trò Nhân viên tiếp nhận.
jest.mock('../src/middleware/requireAuth', () => {
  return (req, res, next) => {
    req.user = {
      username: 'test-user',
      role: 'NHAN_VIEN_TIEP_NHAN'
    };

    next();
  };
});

// Giả lập Service để không truy cập PostgreSQL thật.
jest.mock('../src/services/ticketService', () => ({
  createTicket: jest.fn(),
  listTickets: jest.fn(),
  getTicket: jest.fn(),
  updateTicket: jest.fn(),
  closeTicket: jest.fn()
}));

const request = require('supertest');
const AppError = require('../src/utils/AppError');
const ticketService = require('../src/services/ticketService');
const app = require('../src/app');

describe('POST /tickets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('không có body: chuyển object rỗng đến Service và trả 400', async () => {
    ticketService.createTicket.mockRejectedValue(
      new AppError('DU_LIEU_KHONG_HOP_LE', 400)
    );

    const response = await request(app)
      .post('/tickets')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('DU_LIEU_KHONG_HOP_LE');

    // Xác nhận route truyền object rỗng đến Service.
    expect(ticketService.createTicket).toHaveBeenCalledWith({});
    expect(ticketService.createTicket).toHaveBeenCalledTimes(1);
  });
});
