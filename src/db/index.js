const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database(process.env.DB_FILE || 'smartcrm.sqlite');
db.pragma('foreign_keys = ON'); // SQLite mặc định TẮT khóa ngoại

function migrate() {
  const dir = path.join(__dirname, 'migrations');
  fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
    .forEach(f => db.exec(fs.readFileSync(path.join(dir, f), 'utf8')));
}

module.exports = { db, migrate };