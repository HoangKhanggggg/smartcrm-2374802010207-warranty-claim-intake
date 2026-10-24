// Test lớp nghiệp vụ với repository giả — không cần cơ sở dữ liệu thật.
jest.mock('../src/repositories/ticketRepository');
const repo = require('../src/repositories/ticketRepository');
const ticketService = require('../src/services/ticketService');
const lookupService = require('../src/services/lookupService');

beforeEach(() => jest.resetAllMocks());

describe('ticketService.createTicket', () => {
  test('luồng đúng: tạo phiếu trạng thái Mới, ưu tiên mặc định Trung bình', async () => {
    repo.findDevice.mockResolvedValue({ device_id: 1 });
    repo.create.mockResolvedValue({ ticket_id: 7 });
    repo.findDetailById.mockResolvedValue({ ticket_id: 7 });

    await ticketService.createTicket({ deviceId: 1, description: ' Màn hình sọc ' });

    const saved = repo.create.mock.calls[0][0];
    expect(saved.status).toBe('Mới');
    expect(saved.priority).toBe('Trung bình');
    expect(saved.description).toBe('Màn hình sọc');
    expect(saved.ticketCode).toMatch(/^BH-/);
  });

  test('dữ liệu sai: thiếu mô tả lỗi thì không lưu (US03-AC2)', async () => {
    await expect(ticketService.createTicket({ deviceId: 1, description: '   ' }))
      .rejects.toMatchObject({ code: 'DU_LIEU_KHONG_HOP_LE' });
    expect(repo.create).not.toHaveBeenCalled();
  });

  test('thiết bị không tồn tại trả mã KHONG_TIM_THAY_THIET_BI', async () => {
    repo.findDevice.mockResolvedValue(null);
    await expect(ticketService.createTicket({ deviceId: 99, description: 'Lỗi' }))
      .rejects.toMatchObject({ code: 'KHONG_TIM_THAY_THIET_BI', status: 404 });
  });
});

describe('lookupService', () => {
  test('tra khách: chuẩn hoá SĐT trước khi truy vấn', async () => {
    repo.findCustomerByPhone.mockResolvedValue({ customer_id: 1, full_name: 'An', phone: '0912345678' });
    const c = await lookupService.findCustomer('+84 912 345 678');
    expect(repo.findCustomerByPhone).toHaveBeenCalledWith('0912345678');
    expect(c.phoneMasked).toBe('0912***678');
  });

  test('tra khách: SĐT có chữ cái bị từ chối và không truy vấn (US01-AC3)', async () => {
    await expect(lookupService.findCustomer('09abc')).rejects.toMatchObject({ code: 'SO_DIEN_THOAI_KHONG_HOP_LE' });
    expect(repo.findCustomerByPhone).not.toHaveBeenCalled();
  });

  test('tạo khách: SĐT đã có thì trả hồ sơ cũ, không tạo mới (QT-01)', async () => {
    repo.findCustomerByPhone.mockResolvedValue({ customer_id: 1, full_name: 'An', phone: '0912345678' });
    const r = await lookupService.createCustomer({ fullName: 'Khác', phone: '0912345678' });
    expect(r.created).toBe(false);
    expect(repo.createCustomer).not.toHaveBeenCalled();
  });

  test('đăng ký thiết bị: serial đã thuộc thiết bị khác thì từ chối (US02-AC3)', async () => {
    repo.findCustomerById.mockResolvedValue({ customer_id: 1 });
    repo.findDeviceBySerial.mockResolvedValue({ device_id: 5 });
    await expect(lookupService.createDevice({ customerId: 1, serialImei: 'SN-1' }))
      .rejects.toMatchObject({ code: 'SERIAL_DA_TON_TAI', status: 409 });
  });
});
