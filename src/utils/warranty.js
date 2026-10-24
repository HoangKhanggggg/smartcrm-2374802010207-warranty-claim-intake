// QT-05: xác định tình trạng bảo hành từ warranty_end_date.
// conBaoHanh: true | false | null (null = chưa xác minh được).
function checkWarranty(warrantyEndDate, today = new Date()) {
  if (!warrantyEndDate) {
    return { conBaoHanh: null, lyDo: 'CHUA_XAC_MINH_BAO_HANH' };
  }

  const end = new Date(warrantyEndDate);
  if (Number.isNaN(end.getTime())) {
    return { conBaoHanh: null, lyDo: 'CHUA_XAC_MINH_BAO_HANH' };
  }

  // So sánh theo ngày: đúng ngày hết hạn vẫn còn bảo hành
  const toDay = (d) => d.toISOString().slice(0, 10);
  return { conBaoHanh: toDay(end) >= toDay(today), lyDo: null };
}

// Chuyển kết quả sang mã trạng thái gửi cho giao diện
function toWarrantyStatus(result) {
  if (result.conBaoHanh === null) return 'CHUA_XAC_MINH';
  return result.conBaoHanh ? 'CON_BAO_HANH' : 'HET_BAO_HANH';
}

module.exports = { checkWarranty, toWarrantyStatus };
