const db = require('../db');

const findDevice = async (id) => {
  const result = await db.query(
    'SELECT * FROM device WHERE device_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const findCategory = async (id) => {
  const result = await db.query(
    'SELECT * FROM issue_category WHERE category_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await db.query(
    'SELECT * FROM ticket WHERE ticket_id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const BASE_SELECT = `
  SELECT t.*, c.full_name AS customer_name, c.phone AS customer_phone,
         d.serial_imei, ic.category_name
  FROM ticket t
  JOIN device d ON d.device_id = t.device_id
  JOIN customer c ON c.customer_id = d.customer_id
  LEFT JOIN issue_category ic ON ic.category_id = t.category_id`;

const list = async ({ status, categoryId, priority, limit = 20, offset = 0 }) => {
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

const findDetailById = async (id) => {
  const result = await db.query(`${BASE_SELECT} WHERE t.ticket_id = $1`, [id]);
  return result.rows[0] || null;
};

const findCustomerByPhone = async (phone) => {
  const result = await db.query('SELECT * FROM customer WHERE phone = $1', [phone]);
  return result.rows[0] || null;
};

const createCustomer = async ({ fullName, phone }) => {
  const result = await db.query(
    'INSERT INTO customer (full_name, phone) VALUES ($1, $2) RETURNING *',
    [fullName, phone]
  );
  return result.rows[0];
};

const findDeviceBySerial = async (serial) => {
  const result = await db.query(
    `SELECT d.*, c.full_name AS customer_name, c.phone AS customer_phone
     FROM device d JOIN customer c ON c.customer_id = d.customer_id
     WHERE d.serial_imei = $1`,
    [serial]
  );
  return result.rows[0] || null;
};

const findCustomerById = async (id) => {
  const result = await db.query('SELECT * FROM customer WHERE customer_id = $1', [id]);
  return result.rows[0] || null;
};

const createDevice = async ({ customerId, serialImei, warrantyEndDate }) => {
  const result = await db.query(
    `INSERT INTO device (customer_id, serial_imei, warranty_end_date)
     VALUES ($1, $2, $3) RETURNING *`,
    [customerId, serialImei, warrantyEndDate || null]
  );
  return result.rows[0];
};

const listCategories = async () => {
  const result = await db.query('SELECT * FROM issue_category ORDER BY category_id');
  return result.rows;
};

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
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

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
    await client.query('ROLLBACK');
    throw error;
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