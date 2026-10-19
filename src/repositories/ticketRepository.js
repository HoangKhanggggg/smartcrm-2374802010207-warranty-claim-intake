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

const list = async ({ status, categoryId, priority, limit = 20, offset = 0 }) => {
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  if (categoryId) {
    values.push(categoryId);
    conditions.push(`category_id = $${values.length}`);
  }

  if (priority) {
    values.push(priority);
    conditions.push(`priority = $${values.length}`);
  }

  values.push(limit);
  const limitParam = `$${values.length}`;

  values.push(offset);
  const offsetParam = `$${values.length}`;

  const where = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const result = await db.query(
    `SELECT * FROM ticket
     ${where}
     ORDER BY ticket_id DESC
     LIMIT ${limitParam} OFFSET ${offsetParam}`,
    values
  );

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
  list,
  create,
  update
};