jest.mock('../src/repositories/ticketRepository', () => ({
    findCustomerByPhone: jest.fn(),
    createCustomer: jest.fn()
  }));

  const repo = require('../src/repositories/ticketRepository');
  const lookupService = require('../src/services/lookupService');
  const { toTicketView } = require('../src/utils/ticketMapper');

  describe('QT-12 - Phân biệt hiển thị số điện thoại', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Nhân viên tiếp nhận tra cứu khách hàng được xem số đầy đủ', async () => {
      repo.findCustomerByPhone.mockResolvedValue({
        customer_id: 1,
        full_name: 'Nguyễn Văn An',
        phone: '0912345678'
      });

      const result = await lookupService.findCustomer('0912345678');

      expect(result).toEqual({
        customerId: 1,
        fullName: 'Nguyễn Văn An',
        phone: '0912345678'
      });
    });

    test('Nhân viên tiếp nhận tạo khách hàng được xem số đầy đủ', async () => {
      repo.findCustomerByPhone.mockResolvedValue(null);
      repo.createCustomer.mockResolvedValue({
        customer_id: 2,
        full_name: 'Trần Văn Bình',
        phone: '0987654321'
      });

      const result = await lookupService.createCustomer({
        fullName: 'Trần Văn Bình',
        phone: '0987654321'
      });

      expect(result.created).toBe(true);
      expect(result.customer.phone).toBe('0987654321');
    });

    test('Quản lý trung tâm xem phiếu chỉ nhận số điện thoại đã che', () => {
      const row = {
        ticket_id: '1',
        ticket_code: 'BH-001',
        device_id: '1',
        category_id: null,
        description: 'Lỗi màn hình',
        priority: 'Trung bình',
        status: 'Mới',
        commitment_deadline: '2026-11-12T09:00:00.000Z',
        created_at: '2026-11-10T09:00:00.000Z',
        customer_name: 'Nguyễn Văn An',
        customer_phone: '0912345678'
      };

      const result = toTicketView(row);

      expect(result.customerPhoneMasked).toBe('0912***678');
      expect(result.phone).toBeUndefined();
      expect(result.customer_phone).toBeUndefined();
    });
  });
