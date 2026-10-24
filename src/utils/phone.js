// QT-02: chuẩn hoá số điện thoại về 10 chữ số bắt đầu bằng 0.
// Xử lý +84, 84, dấu cách, dấu chấm, dấu gạch. Trả null nếu không hợp lệ.
function normalizePhone(raw) {
  let s = String(raw ?? '').replace(/[\s.\-]/g, '');
  if (/[^\d+]/.test(s)) return null; // chứa chữ cái hoặc ký tự lạ

  if (s.startsWith('+84')) s = '0' + s.slice(3);
  else if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2);

  return /^0\d{9}$/.test(s) ? s : null;
}

// QT-12: hiển thị dạng che, ví dụ 0912345678 -> 0912***678
function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone ?? null;
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

module.exports = { normalizePhone, maskPhone };
