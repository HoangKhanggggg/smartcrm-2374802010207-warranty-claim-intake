
const { toTicketView } = require('../src/utils/ticketMapper');

describe('toTicketView', () => {
  test('Luồng đúng: chuyển đổi hàng ticket sang camelCase', () => {
    const row = {
      ticket_id: '3',
      ticket_code: 'BH-003',
      device_id: '1',
      category_id: '2',
      description: 'Màn hình bị sọc',
      priority: 'Cao',
      status: 'Mới',
      commitment_deadline: '2026-10-20T09:40:00.000Z',
      created_at: '2026-10-19T16:40:00.000Z'
    };

    const result = toTicketView(row);

    expect(result.ticketId).toBe(3);
    expect(result.ticketCode).toBe('BH-003');
    expect(result.deviceId).toBe(1);
    expect(result.categoryId).toBe(2);
    expect(result.status).toBe('Mới');
    expect(result.createdAt).toBe('2026-10-19T16:40:00.000Z');
    expect(result.ticket_id).toBeUndefined();
  });

  test('Giá trị biên: category và hạn cam kết có thể null', () => {
    const row = {
      ticket_id: '4',
      ticket_code: 'BH-004',
      device_id: '1',
      category_id: null,
      description: 'Kiểm tra thiết bị',
      priority: 'Thấp',
      status: 'Mới',
      commitment_deadline: null,
      created_at: '2026-10-20T08:00:00.000Z'
    };

    const result = toTicketView(row);

    expect(result.categoryId).toBeNull();
    expect(result.commitmentDeadline).toBeNull();
  });

  test('Dữ liệu sai: từ chối đầu vào null', () => {
    expect(() => toTicketView(null)).toThrow(
      'Dữ liệu ticket không hợp lệ'
    );
  });
  test('Dữ liệu sai: từ chối ngày giờ không hợp lệ', () => {
    const row = {
      ticket_id: '5',
      ticket_code: 'BH-005',
      device_id: '1',
      category_id: null,
      description: 'Kiểm tra thiết bị',
      priority: 'Cao',
      status: 'Mới',
      commitment_deadline: 'invalid-date',
      created_at: '2026-10-20T08:00:00.000Z'
    };

    expect(() => toTicketView(row)).toThrow(
      'Ngày giờ ticket không hợp lệ'
    );
  });
});
