const { computeDeadline } = require('../src/utils/sla');

describe('computeDeadline — QT-04', () => {
  test('mức Trung bình cộng 72 giờ', () => {
    const from = new Date(2026, 9, 19, 10, 0); // Thứ Hai 19/10/2026 10:00
    const d = computeDeadline('Trung bình', from);
    expect(d.getTime() - from.getTime()).toBe(72 * 3600 * 1000);
  });

  // TEST BIÊN theo US06-AC2: 10:00 Thứ Bảy + 24 giờ rơi Chủ nhật -> 10:00 Thứ Hai
  test('hạn rơi vào Chủ nhật thì chuyển sang cùng giờ Thứ Hai', () => {
    const saturday = new Date(2026, 9, 24, 10, 0); // Thứ Bảy 24/10/2026 10:00
    const d = computeDeadline('Cao', saturday);
    expect(d.getDay()).toBe(1);
    expect(d.getHours()).toBe(10);
    expect(d.getDate()).toBe(26);
  });

  test('từ chối mức ưu tiên không tồn tại', () => {
    expect(() => computeDeadline('Khẩn cấp')).toThrow('PRIORITY_INVALID');
  });
});
