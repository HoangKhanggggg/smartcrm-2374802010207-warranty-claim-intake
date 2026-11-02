
const db = require('../db');
const AppError = require('../utils/AppError');

// Chuyển lỗi UNIQUE của PostgreSQL thành lỗi nghiệp vụ an toàn.
// Không đưa nội dung SQL hoặc giá trị dữ liệu bị trùng ra frontend.
function translateDatabaseError(error) {
  if (error?.code === '23505') {
    const constraint = error.constraint || '';

    if (
      error.table === 'customer' &&
      constraint === 'customer_phone_key'
    ) {
      return new AppError('SO_DIEN_THOAI_DA_TON_TAI', 409);
    }

    if (
      error.table === 'device' &&
      constraint.startsWith('device_serial_imei_')
    ) {
      return new AppError('SERIAL_DA_TON_TAI', 409);
    }

    if (
      error.table === 'ticket' &&
      constraint.startsWith('ticket_ticket_code_')
    ) {
      return new AppError('MA_PHIEU_DA_TON_TAI', 409);
    }

    return new AppError('DU_LIEU_DA_TON_TAI', 409);
  }

  return error;
}

// Tìm thiết bị theo ID
const findDevice = async (id) => {
  const result = await db.query(
    'SELECT * FROM device WHERE device_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Tìm nhóm sự cố theo ID
const findCategory = async (id) => {
  const result = await db.query(
    'SELECT * FROM issue_category WHERE category_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Tìm phiếu theo ID
const findById = async (id) => {
  const result = await db.query(
    'SELECT * FROM ticket WHERE ticket_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Truy vấn cơ sở lấy thông tin phiếu và khách hàng
const BASE_SELECT = `
  SELECT t.*, c.full_name AS customer_name, c.phone AS customer_phone,
         d.serial_imei, ic.category_name
  FROM ticket t
  JOIN device d ON d.device_id = t.device_id
  JOIN customer c ON c.customer_id = d.customer_id
  LEFT JOIN issue_category ic ON ic.category_id = t.category_id`;

// Lấy danh sách phiếu, hỗ trợ lọc và phân trang
const list = async ({
  status,
  categoryId,
  priority,
  limit = 20,
  offset = 0
}) => {
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`t.status = $${values.length}`);
  }

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`t.category_id = $${values.length}`);
  }

  if (priority) {
    values.push(priority);
    conditions.push(`t.priority = $${values.length}`);
  }

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const where = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const result = await db.query(
    `${BASE_SELECT}
     ${where}
     ORDER BY t.ticket_id DESC
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    values
  );

  return result.rows;
};

// Lấy chi tiết phiếu theo ID
const findDetailById = async (id) => {
  const result = await db.query(
    `${BASE_SELECT} WHERE t.ticket_id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

// Tìm khách hàng theo số điện thoại
const findCustomerByPhone = async (phone) => {
  const result = await db.query(
    'SELECT * FROM customer WHERE phone = $1',
    [phone]
  );
  return result.rows[0] || null;
};

// Tạo khách hàng
const createCustomer = async ({ fullName, phone }) => {
  try {
    const result = await db.query(
      'INSERT INTO customer (full_name, phone) VALUES ($1, $2) RETURNING *',
      [fullName, phone]
    );
    return result.rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
};

// Tìm thiết bị theo serial/IMEI
const findDeviceBySerial = async (serial) => {
  const result = await db.query(
    `SELECT d.*, c.full_name AS customer_name, c.phone AS customer_phone
     FROM device d
     JOIN customer c ON c.customer_id = d.customer_id
     WHERE d.serial_imei = $1`,
    [serial]
  );
  return result.rows[0] || null;
};

// Tìm khách hàng theo ID
const findCustomerById = async (id) => {
  const result = await db.query(
    'SELECT * FROM customer WHERE customer_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

// Tạo thiết bị
const createDevice = async ({
  customerId,
  serialImei,
  warrantyEndDate
}) => {
  try {
    const result = await db.query(
      `INSERT INTO device (customer_id, serial_imei, warranty_end_date)
       VALUES ($1, $2, $3) RETURNING *`,
      [customerId, serialImei, warrantyEndDate || null]
    );
    return result.rows[0];
  } catch (error) {
    throw translateDatabaseError(error);
  }
};

// Lấy danh sách nhóm sự cố
const listCategories = async () => {
  const result = await db.query(
    'SELECT * FROM issue_category ORDER BY category_id'
  );
  return result.rows;
};

// Tạo phiếu và ghi lịch sử trạng thái ban đầu trong cùng transaction
const create = async (ticketData) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO ticket
       (ticket_code, device_id, category_id, description,
        priority, status, commitment_deadline)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        ticketData.ticketCode,
        ticketData.deviceId,
        ticketData.categoryId || null,
        ticketData.description,
        ticketData.priority,
        ticketData.status,
        ticketData.commitmentDeadline
      ]
    );

    const ticket = result.rows[0];

    await client.query(
      `INSERT INTO ticket_status_log (ticket_id, status)
       VALUES ($1, $2)`,
      [ticket.ticket_id, ticket.status]
    );

    await client.query('COMMIT');

    return ticket;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Không để lỗi rollback che mất lỗi gốc.
    }

    throw translateDatabaseError(error);
  } finally {
    client.release();
  }
};

// Cập nhật phiếu và ghi lịch sử nếu trạng thái thay đổi
const update = async (id, data) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const result = await client.query(
      `UPDATE ticket
       SET category_id = $1,
           priority = $2,
           commitment_deadline = $3,
           status = $4
       WHERE ticket_id = $5
       RETURNING *`,
      [
        data.categoryId || null,
        data.priority,
        data.deadline,
        data.status,
        id
      ]
    );

    const ticket = result.rows[0];

    if (!ticket) {
      await client.query('ROLLBACK');
      return null;
    }

    if (data.statusChanged) {
      await client.query(
        `INSERT INTO ticket_status_log (ticket_id, status)
         VALUES ($1, $2)`,
        [ticket.ticket_id, ticket.status]
      );
    }

    await client.query('COMMIT');

    return ticket;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Không để lỗi rollback che mất lỗi gốc.
    }

    throw translateDatabaseError(error);
  } finally {
    client.release();
  }
};

module.exports = {
  findDevice,
  findCategory,
  findById,
  findDetailById,
  findCustomerByPhone,
  findCustomerById,
  createCustomer,
  findDeviceBySerial,
  createDevice,
  listCategories,
  list,
  create,
  update
};
