
/**
 * Hợp đồng dữ liệu:
 * - Đầu vào: một dòng ticket do PostgreSQL trả về.
 * - Đầu ra: đối tượng camelCase dành cho API.
 * - Không trả trực tiếp cấu trúc hàng của database ra bên ngoài.
 * - categoryId, commitmentDeadline có thể là null.
 */
function toTicketView(row) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      throw new TypeError('Dữ liệu ticket không hợp lệ');
    }
  
    const toIsoString = (value) => {
      if (value == null) return null;
  
      const date = new Date(value);
  
      if (Number.isNaN(date.getTime())) {
        throw new TypeError('Ngày giờ ticket không hợp lệ');
      }
  
      return date.toISOString();
    };
  
    return {
      ticketId: Number(row.ticket_id),
      ticketCode: row.ticket_code,
      deviceId: Number(row.device_id),
      categoryId:
        row.category_id == null ? null : Number(row.category_id),
      description: row.description,
      priority: row.priority,
      status: row.status,
      commitmentDeadline: toIsoString(row.commitment_deadline),
      createdAt: toIsoString(row.created_at),
    };
  }
  
  module.exports = { toTicketView };
  