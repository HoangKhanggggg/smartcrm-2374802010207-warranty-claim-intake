const { createToken, verifyToken } = require('../src/utils/auth');

describe('token đăng nhập', () => {
  test('token hợp lệ trả về tên đăng nhập', () => {
    expect(verifyToken(createToken('nhanvien'))).toEqual({ username: 'nhanvien' });
  });

  test('token hết hạn bị từ chối', () => {
    const token = createToken('nhanvien', 60, 1000);
    expect(verifyToken(token, 1000 + 61 * 1000)).toBeNull();
  });

  test('token bị sửa nội dung hoặc là chuỗi rác bị từ chối', () => {
    const [payload, sig] = createToken('nhanvien').split('.');
    const forged = Buffer.from(JSON.stringify({ u: 'admin', exp: 9e15 })).toString('base64url');
    expect(verifyToken(`${forged}.${sig}`)).toBeNull();
    expect(verifyToken(`${payload}.sai`)).toBeNull();
    expect(verifyToken('rac')).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });
});
