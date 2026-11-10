
const authorizeRoles = require('../src/middleware/authorizeRoles');
const AppError = require('../src/utils/AppError');

describe('authorizeRoles middleware', () => {
  const res = {};

  test('cho phép nhân viên có vai trò phù hợp', () => {
    const req = {
      user: {
        username: 'nhanvien',
        role: 'NHAN_VIEN_TIEP_NHAN'
      }
    };

    const next = jest.fn();

    authorizeRoles('NHAN_VIEN_TIEP_NHAN')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('cho phép quản lý có vai trò phù hợp', () => {
    const req = {
      user: {
        username: 'quanly',
        role: 'QUAN_LY_TRUNG_TAM'
      }
    };

    const next = jest.fn();

    authorizeRoles('QUAN_LY_TRUNG_TAM')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('từ chối người dùng không đủ quyền với HTTP 403', () => {
    const req = {
      user: {
        username: 'nhanvien',
        role: 'NHAN_VIEN_TIEP_NHAN'
      }
    };

    const next = jest.fn();

    authorizeRoles('QUAN_LY_TRUNG_TAM')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(next.mock.calls[0][0].code).toBe('KHONG_CO_QUYEN_TRUY_CAP');
    expect(next.mock.calls[0][0].status).toBe(403);
  });

  test('từ chối khi chưa có thông tin người dùng với HTTP 401', () => {
    const req = {};
    const next = jest.fn();

    authorizeRoles('NHAN_VIEN_TIEP_NHAN')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(next.mock.calls[0][0].code).toBe('CHUA_DANG_NHAP');
    expect(next.mock.calls[0][0].status).toBe(401);
  });

  test('từ chối khi người dùng không có vai trò', () => {
    const req = {
      user: {
        username: 'nhanvien'
      }
    };

    const next = jest.fn();

    authorizeRoles('NHAN_VIEN_TIEP_NHAN')(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(AppError);
    expect(next.mock.calls[0][0].status).toBe(401);
  });
});
