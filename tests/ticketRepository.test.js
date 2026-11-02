
jest.mock('../src/db');

const db = require('../src/db');
const repo = require('../src/repositories/ticketRepository');

describe('ticketRepository – xử lý lỗi PostgreSQL', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('trùng số điện thoại trả SO_DIEN_THOAI_DA_TON_TAI', async () => {
    const error = {
      code: '23505',
      table: 'customer',
      constraint: 'customer_phone_key'
    };

    db.query.mockRejectedValue(error);

    await expect(
      repo.createCustomer({
        fullName: 'Nguyễn Văn An',
        phone: '0912345678'
      })
    ).rejects.toMatchObject({
      code: 'SO_DIEN_THOAI_DA_TON_TAI',
      status: 409
    });
  });

  test('trùng Serial/IMEI trả SERIAL_DA_TON_TAI', async () => {
    const error = {
      code: '23505',
      table: 'device',
      constraint: 'device_serial_imei_key'
    };

    db.query.mockRejectedValue(error);

    await expect(
      repo.createDevice({
        customerId: 1,
        serialImei: 'SN-001',
        warrantyEndDate: null
      })
    ).rejects.toMatchObject({
      code: 'SERIAL_DA_TON_TAI',
      status: 409
    });
  });

  test('trùng mã phiếu rollback transaction và trả MA_PHIEU_DA_TON_TAI', async () => {
    const databaseError = {
      code: '23505',
      table: 'ticket',
      constraint: 'ticket_ticket_code_key'
    };

    const client = {
      query: jest.fn()
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(databaseError) // INSERT ticket
        .mockResolvedValueOnce({}) // ROLLBACK
    };

    client.release = jest.fn();

    db.getClient.mockResolvedValue(client);

    await expect(
      repo.create({
        ticketCode: 'BH-TEST001',
        deviceId: 1,
        categoryId: 1,
        description: 'Lỗi màn hình',
        priority: 'Trung bình',
        status: 'Mới',
        commitmentDeadline: '2026-11-05T10:00:00.000Z'
      })
    ).rejects.toMatchObject({
      code: 'MA_PHIEU_DA_TON_TAI',
      status: 409
    });

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalledTimes(1);
  });

  test('lỗi ROLLBACK không che mất lỗi PostgreSQL ban đầu', async () => {
    const databaseError = {
      code: '23505',
      table: 'ticket',
      constraint: 'ticket_ticket_code_key'
    };

    const rollbackError = new Error('Rollback failed');

    const client = {
      query: jest.fn()
        .mockResolvedValueOnce({}) // BEGIN
        .mockRejectedValueOnce(databaseError) // INSERT ticket
        .mockRejectedValueOnce(rollbackError) // ROLLBACK
    };

    client.release = jest.fn();

    db.getClient.mockResolvedValue(client);

    await expect(
      repo.create({
        ticketCode: 'BH-TEST002',
        deviceId: 1,
        categoryId: null,
        description: 'Lỗi pin',
        priority: 'Trung bình',
        status: 'Mới',
        commitmentDeadline: '2026-11-05T10:00:00.000Z'
      })
    ).rejects.toMatchObject({
      code: 'MA_PHIEU_DA_TON_TAI',
      status: 409
    });

    expect(client.release).toHaveBeenCalledTimes(1);
  });
});
