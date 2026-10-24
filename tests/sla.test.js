const { computeDeadline } = require('../src/utils/sla');

describe('computeDeadline — QT-04', () => {
  test('mức Trung bình cộng 72 giờ', () => {
    const from = new Date('2026-10-19T03:00:00Z'); // Thứ Hai 19/10/2026 10:00 giờ VN
    const d = computeDeadline('Trung bình', from);
    expect(d.getTime() - from.getTime()).toBe(72 * 3600 * 1000);
  });

  // TEST BIÊN theo US06-AC2: 10:00 Thứ Bảy + 24 giờ rơi Chủ nhật -> 10:00 Thứ Hai (giờ VN)
  test('hạn rơi vào Chủ nhật thì chuyển sang cùng giờ Thứ Hai', () => {
    const saturday = new Date('2026-10-24T03:00:00Z'); // Thứ Bảy 24/10/2026 10:00 giờ VN
    const d = computeDeadline('Cao', saturday);
    expect(d.toISOString()).toBe('2026-10-26T03:00:00.000Z'); // Thứ Hai 26/10/2026 10:00 giờ VN
  });

  test('hạn rơi vào Thứ Bảy được giữ nguyên (chỉ Chủ nhật được dời)', () => {
    const friday = new Date('2026-10-23T03:00:00Z'); // Thứ Sáu 10:00 VN
    expect(computeDeadline('Cao', friday).toISOString()).toBe('2026-10-24T03:00:00.000Z');
  });

  test('từ chối mức ưu tiên không tồn tại', () => {
    expect(() => computeDeadline('Khẩn cấp')).toThrow('PRIORITY_INVALID');
  });
});
