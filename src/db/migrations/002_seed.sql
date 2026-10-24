-- Dữ liệu mẫu dùng để chạy luồng chính. Chạy lại nhiều lần không nhân đôi dòng.
INSERT INTO issue_category (category_name) VALUES
  ('Màn hình'), ('Pin'), ('Sạc'), ('Phần mềm'), ('Nước vào'), ('Khác')
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO customer (full_name, phone) VALUES
  ('Nguyễn Văn An',   '0912345678'),
  ('Trần Thị Bình',   '0987654321'),
  ('Lê Hoàng Cường',  '0901234567')
ON CONFLICT (phone) DO NOTHING;

INSERT INTO device (customer_id, serial_imei, warranty_end_date)
SELECT c.customer_id, v.serial_imei, v.warranty_end_date::date
FROM (VALUES
  ('0912345678', 'SN-A001-2026',   '2027-06-30'),  -- còn bảo hành
  ('0987654321', '356938035643809', '2026-03-01'), -- hết bảo hành
  ('0901234567', 'SN-C003-2026',   NULL)           -- chưa xác minh
) AS v(phone, serial_imei, warranty_end_date)
JOIN customer c ON c.phone = v.phone
ON CONFLICT (serial_imei) DO NOTHING;
