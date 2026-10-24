// Nơi DUY NHẤT trong frontend gọi fetch(). Các trang chỉ dùng các hàm trong *.api.js.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const TOKEN_KEY = 'smartcrm_token';

export const UNAUTHORIZED_EVENT = 'smartcrm:unauthorized';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Mã lỗi backend -> thông báo tiếng Việt
const MESSAGES = {
  KHONG_KET_NOI_MAY_CHU: 'Không kết nối được máy chủ. Hãy kiểm tra backend đã chạy chưa.',
  CHUA_DANG_NHAP: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  SAI_TAI_KHOAN_HOAC_MAT_KHAU: 'Sai tài khoản hoặc mật khẩu.',
  SO_DIEN_THOAI_KHONG_HOP_LE: 'Số điện thoại không hợp lệ (cần 10 chữ số, bắt đầu bằng 0).',
  KHONG_TIM_THAY_KHACH_HANG: 'Chưa có hồ sơ khách hàng với số điện thoại này.',
  KHONG_TIM_THAY_THIET_BI: 'Không tìm thấy thiết bị với serial/IMEI này.',
  SERIAL_DA_TON_TAI: 'Serial/IMEI này đã thuộc một thiết bị khác.',
  DU_LIEU_KHONG_HOP_LE: 'Dữ liệu chưa hợp lệ. Hãy kiểm tra các trường bắt buộc.',
  LOI_HE_THONG: 'Máy chủ gặp lỗi. Vui lòng thử lại sau.',
};

export class ApiError extends Error {
  constructor(code, status = 0) {
    super(MESSAGES[code] || `Lỗi: ${code}`);
    this.code = code;
    this.status = status;
  }
}

export async function request(path, { method = 'GET', body, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== '' && v != null)
      ).toString()
    : '';

  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}${query}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('KHONG_KET_NOI_MAY_CHU');
  }

  const payload = await response.json().catch(() => ({}));

  if (response.status === 401) {
    // Chỉ xoá token và báo cho App khi đang có phiên (không phải lúc sai mật khẩu)
    if (token) {
      tokenStore.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(payload.error || 'CHUA_DANG_NHAP', 401);
  }

  if (!response.ok) {
    throw new ApiError(payload.error || 'LOI_HE_THONG', response.status);
  }
  return payload;
}
