

CREATE TABLE customer (
    customer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE device (
    device_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    device_name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100),
    CONSTRAINT fk_device_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);

CREATE TABLE issue_category (
    issue_category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE ticket (
    ticket_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    device_id BIGINT NOT NULL,
    issue_category_id BIGINT NOT NULL,
    issue_description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id),
    CONSTRAINT fk_ticket_device
        FOREIGN KEY (device_id)
        REFERENCES device(device_id),
    CONSTRAINT fk_ticket_issue_category
        FOREIGN KEY (issue_category_id)
        REFERENCES issue_category(issue_category_id)
);

CREATE TABLE ticket_status_log (
    status_log_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    CONSTRAINT fk_status_log_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES ticket(ticket_id)
);


