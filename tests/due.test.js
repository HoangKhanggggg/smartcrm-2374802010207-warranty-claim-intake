const { getDueState } = require('../src/utils/due');

describe('getDueState — QT-13', () => {
  const now = new Date('2026-10-24T08:00:00Z');
  const at = (hours) => new Date(now.getTime() + hours * 3600 * 1000).toISOString();

  test('quá hạn khi hiện tại vượt hạn cam kết', () => {
    expect(getDueState({ status: 'Đang xử lý', commitmentDeadline: at(-1) }, now)).toBe('QUA_HAN');
  });

  test('sắp đến hạn khi còn không quá 8 giờ', () => {
    expect(getDueState({ status: 'Mới', commitmentDeadline: at(5) }, now)).toBe('SAP_DEN_HAN');
  });

  test('giá trị biên: còn đúng 8 giờ là sắp đến hạn, 8,1 giờ thì chưa', () => {
    expect(getDueState({ status: 'Mới', commitmentDeadline: at(8) }, now)).toBe('SAP_DEN_HAN');
    expect(getDueState({ status: 'Mới', commitmentDeadline: at(8.1) }, now)).toBeNull();
  });

  test('phiếu đã Hoàn tất hoặc Đã đóng không bị đánh dấu', () => {
    expect(getDueState({ status: 'Hoàn tất', commitmentDeadline: at(-10) }, now)).toBeNull();
    expect(getDueState({ status: 'Đã đóng', commitmentDeadline: at(-10) }, now)).toBeNull();
  });

  test('phiếu không có hạn cam kết thì không đánh dấu', () => {
    expect(getDueState({ status: 'Mới', commitmentDeadline: null }, now)).toBeNull();
  });
});
