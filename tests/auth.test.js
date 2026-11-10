
process.env.AUTH_SECRET = 'test-only-secret-at-least-32-characters-long';

const { createToken, verifyToken } = require('../src/utils/auth');

describe('token đăng nhập', () => {
  test('token hợp lệ trả về username và vai trò nhân viên', () => {
    expect(verifyToken(createToken('nhanvien'))).toEqual({
      username: 'nhanvien',
      role: 'NHAN_VIEN_TIEP_NHAN'
    });
  });

  test('token quản lý trả về đúng vai trò', () => {
    expect(
      verifyToken(createToken('quanly', 'QUAN_LY_TRUNG_TAM'))
    ).toEqual({
      username: 'quanly',
      role: 'QUAN_LY_TRUNG_TAM'
    });
  });

  test('token hết hạn bị từ chối', () => {
    const token = createToken('nhanvien', 'NHAN_VIEN_TIEP_NHAN', 60, 1000);

    expect(verifyToken(token, 1000 + 61 * 1000)).toBeNull();
  });

  test('token bị sửa nội dung hoặc là chuỗi rác bị từ chối', () => {
    const [payload, sig] = createToken('nhanvien').split('.');

    const forged = Buffer.from(JSON.stringify({
      u: 'admin',
      role: 'QUAN_LY_TRUNG_TAM',
      exp: 9e15
    })).toString('base64url');

    expect(verifyToken(`${forged}.${sig}`)).toBeNull();
    expect(verifyToken(`${payload}.sai`)).toBeNull();
    expect(verifyToken('rac')).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });

  test('token thiếu vai trò hoặc có vai trò không hợp lệ bị từ chối', () => {
    const invalidPayloads = [
      { u: 'nhanvien', exp: 9e15 },
      { u: 'nhanvien', role: 'ADMIN', exp: 9e15 }
    ];

    const crypto = require('crypto');

    for (const data of invalidPayloads) {
      const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
      const signature = crypto
        .createHmac('sha256', process.env.AUTH_SECRET)
        .update(payload)
        .digest('base64url');

      expect(verifyToken(`${payload}.${signature}`)).toBeNull();
    }
  });
});
