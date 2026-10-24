export const WARRANTY_LABEL = {
  CON_BAO_HANH: 'Còn bảo hành',
  HET_BAO_HANH: 'Hết bảo hành',
  CHUA_XAC_MINH: 'Chưa xác minh bảo hành',
};

export const DUE_LABEL = {
  SAP_DEN_HAN: 'Sắp đến hạn',
  QUA_HAN: 'Quá hạn',
};

export const STATUSES = ['Mới', 'Đã phân công', 'Đang xử lý', 'Chờ linh kiện', 'Hoàn tất', 'Đã đóng'];
export const PRIORITIES = ['Cao', 'Trung bình', 'Thấp'];

export const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('vi-VN', { hour12: false }) : '—';
