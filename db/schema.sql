-- Smart CRM – L02: Tiếp nhận và phân loại yêu cầu bảo hành
-- PostgreSQL 18 – DDL chuẩn (nguồn chuẩn cho ERD, Wireframe và code)
-- Chạy: psql -U postgres -d smart_crm -f db/schema.sql

CREATE TABLE customer (
    customer_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name   VARCHAR(150) NOT NULL,
    phone       VARCHAR(20)  NOT NULL UNIQUE
);

CREATE TABLE device (
    device_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id       BIGINT       NOT NULL,
    serial_imei       VARCHAR(100) NOT NULL UNIQUE,
    warranty_end_date DATE,

    CONSTRAINT fk_device_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);

CREATE TABLE issue_category (
    category_id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ticket (
    ticket_id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_code         VARCHAR(50) NOT NULL UNIQUE,
    device_id           BIGINT      NOT NULL,
    category_id         BIGINT,
    description         TEXT        NOT NULL,
    priority            VARCHAR(20) NOT NULL DEFAULT 'Trung bình',
    status              VARCHAR(30) NOT NULL DEFAULT 'Mới',
    commitment_deadline TIMESTAMP,
    created_at          TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_device
        FOREIGN KEY (device_id)
        REFERENCES device(device_id),

    CONSTRAINT fk_ticket_category
        FOREIGN KEY (category_id)
        REFERENCES issue_category(category_id),

    CONSTRAINT chk_ticket_priority
        CHECK (priority IN ('Cao', 'Trung bình', 'Thấp')),

    CONSTRAINT chk_ticket_status
        CHECK (status IN ('Mới', 'Đã phân công', 'Đang xử lý',
                          'Chờ linh kiện', 'Hoàn tất', 'Đã đóng'))
);

CREATE TABLE ticket_status_log (
    log_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id  BIGINT      NOT NULL,
    status     VARCHAR(30) NOT NULL,
    changed_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_log_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES ticket(ticket_id),

    CONSTRAINT chk_status_log_status
        CHECK (status IN ('Mới', 'Đã phân công', 'Đang xử lý',
                          'Chờ linh kiện', 'Hoàn tất', 'Đã đóng'))
);

-- customer.phone và device.serial_imei đã có index từ ràng buộc UNIQUE
CREATE INDEX idx_ticket_status_deadline
    ON ticket(status, commitment_deadline);

-- Dữ liệu danh mục nhóm sự cố (US04 – AC1)
INSERT INTO issue_category (category_name) VALUES
    ('Màn hình'),
    ('Pin'),
    ('Sạc'),
    ('Phần mềm'),
    ('Nước vào'),
    ('Khác');