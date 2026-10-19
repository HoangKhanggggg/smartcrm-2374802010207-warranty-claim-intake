CREATE TABLE IF NOT EXISTS customer (
  customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS device (
  device_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
  serial_imei TEXT NOT NULL UNIQUE,
  warranty_end_date TEXT
);
CREATE TABLE IF NOT EXISTS issue_category (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS ticket (
  ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_code TEXT NOT NULL UNIQUE,
  device_id INTEGER NOT NULL REFERENCES device(device_id),
  category_id INTEGER REFERENCES issue_category(category_id),
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'Trung bình'
    CHECK (priority IN ('Cao','Trung bình','Thấp')),
  status TEXT NOT NULL DEFAULT 'Mới'
    CHECK (status IN ('Mới','Đã phân công','Đang xử lý','Chờ linh kiện','Hoàn tất','Đã đóng')),
  commitment_deadline TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ticket_status_log (
  log_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticket_id INTEGER NOT NULL REFERENCES ticket(ticket_id),
  status TEXT NOT NULL
    CHECK (status IN ('Mới','Đã phân công','Đang xử lý','Chờ linh kiện','Hoàn tất','Đã đóng')),
  changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ticket_status_deadline ON ticket(status, commitment_deadline);