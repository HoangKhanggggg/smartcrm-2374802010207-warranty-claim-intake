const { normalizePhone, maskPhone } = require('../src/utils/phone');

describe('normalizePhone — QT-02', () => {
  test('chuẩn hoá +84, dấu cách và dấu chấm về 10 chữ số bắt đầu bằng 0', () => {
    expect(normalizePhone('+84 912.345.678')).toBe('0912345678');
    expect(normalizePhone('84912345678')).toBe('0912345678');
    expect(normalizePhone('0912-345-678')).toBe('0912345678');
  });

  test('từ chối chuỗi chứa chữ cái hoặc không đủ 10 chữ số', () => {
    expect(normalizePhone('09123abc78')).toBeNull();
    expect(normalizePhone('091234')).toBeNull();
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone(null)).toBeNull();
  });

  test('giá trị biên: 9 hoặc 11 chữ số đều không hợp lệ', () => {
    expect(normalizePhone('091234567')).toBeNull();
    expect(normalizePhone('09123456789')).toBeNull();
  });
});

describe('maskPhone — QT-12', () => {
  test('che phần giữa số điện thoại', () => {
    expect(maskPhone('0912345678')).toBe('0912***678');
  });
});
