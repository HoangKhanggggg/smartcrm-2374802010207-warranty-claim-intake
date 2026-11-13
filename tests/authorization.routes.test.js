// Kiểm thử tích hợp xác thực và phân quyền QT-11, QT-12.
// Dùng middleware và token thật; giả lập Service để không cần PostgreSQL.

process.env.AUTH_SECRET =
  'test_only_secret_for_authorization_routes_2026_123456';

jest.mock('../src/services/ticketService', () => ({
  createTicket: jest.fn(),
  listTickets: jest.fn(),
  getTicket: jest.fn(),
  updateTicket: jest.fn(),
  closeTicket: jest.fn()
}));

jest.mock('../src/services/lookupService', () => ({
  findCustomer: jest.fn(),
  createCustomer: jest.fn(),
  findDevice: jest.fn(),
  createDevice: jest.fn(),
  listCategories: jest.fn()
}));

const request = require('supertest');
const app = require('../src/app');
const { createToken } = require('../src/utils/auth');
const ticketService = require('../src/services/ticketService');
const lookupService = require('../src/services/lookupService');

const STAFF = 'NHAN_VIEN_TIEP_NHAN';
const MANAGER = 'QUAN_LY_TRUNG_TAM';

const staffToken = createToken('test-staff', STAFF);
const managerToken = createToken('test-manager', MANAGER);

const ticketRow = {
  ticket_id: '1',
  ticket_code: 'BH-TEST-001',
  device_id: '1',
  category_id: '2',
  description: 'Màn hình bị sọc',
  priority: 'Trung bình',
  status: 'Mới',
  commitment_deadline: '2099-11-12T09:00:00.000Z',
  created_at: '2026-11-10T09:00:00.000Z',
  customer_name: 'Nguyễn Văn An',
  customer_phone: '0912345678',
  serial_imei: 'IMEI-TEST-001',
  category_name: 'Màn hình'
};

describe('Kiểm thử tích hợp xác thực và phân quyền QT-11, QT-12', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Xác thực người dùng', () => {
    test('Không có token: từ chối truy cập với HTTP 401', async () => {
      const response = await request(app).get('/tickets');

      expect(response.status).toBe(401);
      expect(ticketService.listTickets).not.toHaveBeenCalled();
    });

    test('Token không hợp lệ: từ chối truy cập với HTTP 401', async () => {
      const response = await request(app)
        .get('/tickets')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('API phiếu bảo hành', () => {

  describe('API danh mục nhóm sự cố', () => {
    test('Nhân viên tiếp nhận được đọc danh mục nhóm sự cố', async () => {
      lookupService.listCategories.mockResolvedValue([
        { categoryId: 1, categoryName: 'Màn hình' },
        { categoryId: 2, categoryName: 'Pin' }
      ]);

      const response = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(lookupService.listCategories).toHaveBeenCalledTimes(1);
    });

    test('Quản lý trung tâm được đọc danh mục nhóm sự cố', async () => {
      lookupService.listCategories.mockResolvedValue([
        { categoryId: 1, categoryName: 'Màn hình' },
        { categoryId: 2, categoryName: 'Pin' }
      ]);

      const response = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(lookupService.listCategories).toHaveBeenCalledTimes(1);
    });
  });

  describe('API tra cứu thiết bị', () => {
    test('Quản lý trung tâm không được tra cứu thiết bị', async () => {
      const response = await request(app)
        .get('/devices')
        .query({ serial: 'IMEI-TEST-001' })
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(403);
      expect(lookupService.findDevice).not.toHaveBeenCalled();
    });

    test('Quản lý trung tâm không được ghi nhận thiết bị', async () => {
      const response = await request(app)
        .post('/devices')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          customerId: 1,
          serialImei: 'IMEI-TEST-002',
          warrantyEndDate: '2027-12-31'
        });

      expect(response.status).toBe(403);
      expect(lookupService.createDevice).not.toHaveBeenCalled();
    });
  });

    test('Nhân viên tiếp nhận được phép tạo phiếu', async () => {
      ticketService.createTicket.mockResolvedValue(ticketRow);

      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          deviceId: 1,
          categoryId: 2,
          description: 'Màn hình bị sọc',
          priority: 'Trung bình'
        });

      expect(response.status).toBe(201);
      expect(ticketService.createTicket).toHaveBeenCalledTimes(1);
    });

    test('Quản lý trung tâm không được phép tạo phiếu', async () => {
      const response = await request(app)
        .post('/tickets')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          deviceId: 1,
          description: 'Màn hình bị sọc'
        });

      expect(response.status).toBe(403);
      expect(ticketService.createTicket).not.toHaveBeenCalled();
    });

    test('Nhân viên không được phép xem danh sách phiếu', async () => {
      const response = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(403);
      expect(ticketService.listTickets).not.toHaveBeenCalled();
    });

    test('Quản lý được xem danh sách phiếu và số điện thoại đã che', async () => {
      ticketService.listTickets.mockResolvedValue([ticketRow]);

      const response = await request(app)
        .get('/tickets')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].customerPhoneMasked)
        .toBe('0912***678');

      // Không được trả số điện thoại đầy đủ.
      expect(JSON.stringify(response.body))
        .not.toContain('0912345678');
    });

    test('Nhân viên không được phép xem chi tiết phiếu', async () => {
      const response = await request(app)
        .get('/tickets/1')
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(403);
      expect(ticketService.getTicket).not.toHaveBeenCalled();
    });

    test('Quản lý được xem chi tiết phiếu và số điện thoại đã che', async () => {
      ticketService.getTicket.mockResolvedValue(ticketRow);

      const response = await request(app)
        .get('/tickets/1')
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.customerPhoneMasked)
        .toBe('0912***678');

      expect(JSON.stringify(response.body))
        .not.toContain('0912345678');
    });
  });

  describe('API tra cứu khách hàng', () => {
    test('Nhân viên được tra cứu và nhận số điện thoại đầy đủ', async () => {
      lookupService.findCustomer.mockResolvedValue({
        customerId: 1,
        fullName: 'Nguyễn Văn An',
        phone: '0912345678'
      });

      const response = await request(app)
        .get('/customers')
        .query({ phone: '0912345678' })
        .set('Authorization', `Bearer ${staffToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.phone).toBe('0912345678');
      expect(lookupService.findCustomer).toHaveBeenCalledTimes(1);
    });

    test('Quản lý không được tra cứu khách hàng', async () => {
      const response = await request(app)
        .get('/customers')
        .query({ phone: '0912345678' })
        .set('Authorization', `Bearer ${managerToken}`);

      expect(response.status).toBe(403);
      expect(lookupService.findCustomer).not.toHaveBeenCalled();
    });

    test('Nhân viên tạo khách hàng và nhận số điện thoại đầy đủ', async () => {
      lookupService.createCustomer.mockResolvedValue({
        customer: {
          customerId: 2,
          fullName: 'Trần Văn Bình',
          phone: '0987654321'
        },
        created: true
      });

      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          fullName: 'Trần Văn Bình',
          phone: '0987654321'
        });

      expect(response.status).toBe(201);
      expect(response.body.data.phone).toBe('0987654321');
    });

    test('Quản lý không được tạo khách hàng', async () => {
      const response = await request(app)
        .post('/customers')
        .set('Authorization', `Bearer ${managerToken}`)
        .send({
          fullName: 'Trần Văn Bình',
          phone: '0987654321'
        });

      expect(response.status).toBe(403);
      expect(lookupService.createCustomer).not.toHaveBeenCalled();
    });
  });
});