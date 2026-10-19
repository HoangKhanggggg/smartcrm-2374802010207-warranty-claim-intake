const { db } = require('../db');

const findDevice = id => db.prepare('SELECT * FROM device WHERE device_id=?').get(id);
const findCategory = id => db.prepare('SELECT * FROM issue_category WHERE category_id=?').get(id);
const findById = id => db.prepare('SELECT * FROM ticket WHERE ticket_id=?').get(id);

function list({ status, categoryId, priority, limit, offset }) {
  const where = [], args = [];
  if (status) { where.push('status=?'); args.push(status); }
  if (categoryId) { where.push('category_id=?'); args.push(categoryId); }
  if (priority) { where.push('priority=?'); args.push(priority); }
  const w = where.length ? 'WHERE ' + where.join(' AND ') : '';
  return db.prepare(`SELECT * FROM ticket ${w} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
           .all(...args, limit, offset);
}

// Chèn ticket + dòng log đầu tiên trong MỘT transaction (US03-AC3)
const create = db.transaction(t => {
  const tmp = 'TMP-' + Date.now() + Math.random();
  const r = db.prepare(`INSERT INTO ticket(ticket_code,device_id,category_id,description,
      priority,status,commitment_deadline,created_at) VALUES (?,?,?,?,?,?,?,?)`)
    .run(tmp, t.deviceId, t.categoryId ?? null, t.description, t.priority, 'Mới',
         t.deadline, t.createdAt);
  const id = r.lastInsertRowid;
  const day = t.createdAt.slice(0, 10).replace(/-/g, '');
  const code = `BH-${day}-${String(id).padStart(5, '0')}`;
  db.prepare('UPDATE ticket SET ticket_code=? WHERE ticket_id=?').run(code, id);
  db.prepare('INSERT INTO ticket_status_log(ticket_id,status,changed_at) VALUES (?,?,?)')
    .run(id, 'Mới', t.createdAt);
  return id;
});

const update = db.transaction((id, f) => {
  db.prepare(`UPDATE ticket SET category_id=?, priority=?, commitment_deadline=?, status=? 
              WHERE ticket_id=?`).run(f.categoryId, f.priority, f.deadline, f.status, id);
  if (f.statusChanged)
    db.prepare('INSERT INTO ticket_status_log(ticket_id,status,changed_at) VALUES (?,?,?)')
      .run(id, f.status, new Date().toISOString());
});

module.exports = { findDevice, findCategory, findById, list, create, update };