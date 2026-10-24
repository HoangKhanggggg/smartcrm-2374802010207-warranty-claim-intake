const { getDueState } = require('./due');
const { maskPhone } = require('./phone');

/**
 * HỢP ĐỒNG DỮ LIỆU (backend -> frontend), mọi khoá là camelCase:
 * - Đầu vào: một dòng ticket do PostgreSQL trả về. Có thể kèm cột JOIN:
 *   customer_name, customer_phone, serial_imei, category_name.
 * - Đầu ra:
 *   ticketId, ticketCode, deviceId, categoryId|null, description, priority, status,
 *   commitmentDeadline|null (ISO), createdAt (ISO),
 *   customerName|null, customerPhoneMasked|null, serialImei|null, categoryName|null,
 *   dueState: 'SAP_DEN_HAN' | 'QUA_HAN' | null  (QT-13)
 * - Không trả trực tiếp cấu trúc hàng của database ra bên ngoài.
 */
function toTicketView(row, now = new Date()) {
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

  const view = {
    ticketId: Number(row.ticket_id),
    ticketCode: row.ticket_code,
    deviceId: Number(row.device_id),
    categoryId: row.category_id == null ? null : Number(row.category_id),
    description: row.description,
    priority: row.priority,
    status: row.status,
    commitmentDeadline: toIsoString(row.commitment_deadline),
    createdAt: toIsoString(row.created_at),
    customerName: row.customer_name ?? null,
    customerPhoneMasked: row.customer_phone ? maskPhone(row.customer_phone) : null,
    serialImei: row.serial_imei ?? null,
    categoryName: row.category_name ?? null
  };

  view.dueState = getDueState(view, now);
  return view;
}

module.exports = { toTicketView };
