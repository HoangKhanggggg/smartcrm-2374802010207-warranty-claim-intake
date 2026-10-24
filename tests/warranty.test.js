const { checkWarranty, toWarrantyStatus } = require('../src/utils/warranty');

describe('checkWarranty — QT-05', () => {
  const today = new Date('2026-10-24T08:00:00Z');

  test('còn bảo hành khi chưa quá ngày hết hạn', () => {
    expect(checkWarranty('2027-06-30', today).conBaoHanh).toBe(true);
  });

  test('hết bảo hành khi đã quá ngày hết hạn', () => {
    expect(checkWarranty('2026-03-01', today).conBaoHanh).toBe(false);
  });

  // TEST QUAN TRỌNG NHẤT: luồng ngoại lệ đã đặc tả ở BT1
  test('chưa xác minh được khi không có ngày hết hạn bảo hành', () => {
    const r = checkWarranty(null, today);
    expect(r.conBaoHanh).toBeNull();
    expect(r.lyDo).toBe('CHUA_XAC_MINH_BAO_HANH');
    expect(toWarrantyStatus(r)).toBe('CHUA_XAC_MINH');
  });

  test('giá trị biên: đúng ngày hết hạn vẫn còn bảo hành', () => {
    expect(checkWarranty('2026-10-24', today).conBaoHanh).toBe(true);
  });
});
