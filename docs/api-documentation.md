# Smart CRM – API Documentation

**Project:** Smart CRM – Mekong Mobile
**Module:** L02 – Warranty Claim Intake and Classification
**Backend:** Node.js, Express.js
**Database:** PostgreSQL 18
**Base URL:** `http://localhost:3001`
**API Version:** 1.0

---

## 1. Overview

This document describes the REST API endpoints implemented in the Smart CRM – Mekong Mobile system, specifically the L02 Warranty Claim Intake and Classification module.

The API supports the following operations:

- User authentication and role-based access control.
- Customer lookup and registration.
- Device lookup and registration.
- Issue category retrieval.
- Warranty ticket creation.
- Ticket listing and detail retrieval.

### 1.1 Base URL

```text
http://localhost:3001
```

### 1.2 Common Response Format

Successful responses generally use the following JSON structure:

```json
{
  "data": {}
}
```

Error responses use the following structure:

```json
{
  "error": "ERROR_CODE",
  "requestId": "request-id"
}
```

The `requestId` identifies the request associated with the error.

### 1.3 Authentication

Protected endpoints require an access token in the HTTP Authorization header.

```http
Authorization: Bearer <access_token>
```

The application uses a custom HMAC-SHA256 signed token. It is not a JWT implementation.

- Token expiration: 8 hours.
- Token signature: HMAC-SHA256.
- The server determines the user's role during login.
- The client cannot assign or change its own role.

### 1.4 User Roles

| Role | Description |
|---|---|
| `NHAN_VIEN_TIEP_NHAN` | Reception staff |
| `QUAN_LY_TRUNG_TAM` | Service center manager |

### 1.5 HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request completed successfully |
| 201 | Resource created successfully |
| 400 | Invalid input data |
| 401 | Authentication required or invalid credentials |
| 403 | Access denied |
| 404 | Resource or API not found |
| 409 | Resource conflict |
| 500 | Internal server error |
| 503 | Authentication configuration unavailable |

---

## 2. API Endpoint Reference

### 2.1 Health Check

**Endpoint:** `GET /health`

**Description:** Checks whether the backend HTTP server is running.

**Authentication:** Not required.

**Request Parameters:** None.

**Request Body:** None.

**Success Response – 200 OK**

```json
{
  "status": "ok",
  "requestId": "example-request-id"
}
```

**Error Responses:** No specific application error is defined for this endpoint.

---

### 2.2 User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticates a user and generates an access token.

**Authentication:** Not required.

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `username` | String | Yes | Configured username |
| `password` | String | Yes | Configured password |

**Example Request:**

```json
{
  "username": "staff",
  "password": "your_staff_password"
}
```

**Success Response – 200 OK**

```json
{
  "data": {
    "token": "<access_token>",
    "username": "staff",
    "role": "NHAN_VIEN_TIEP_NHAN"
  }
}
```

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 401 | `SAI_TAI_KHOAN_HOAC_MAT_KHAU` | Invalid username or password |
| 503 | `CHUA_CAU_HINH_DANG_NHAP` | Authentication configuration is unavailable |

---

### 2.3 Find Customer

**Endpoint:** `GET /customers`

**Description:** Searches for an existing customer using a normalized phone number.

**Authentication:** Required.

**Allowed Role:** `NHAN_VIEN_TIEP_NHAN`

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `phone` | String | Yes | Customer phone number |

Phone numbers are normalized to 10 digits beginning with `0`. The system supports Vietnamese international prefix formats such as `+84` and `84`, as well as spaces, dots and hyphens.

**Example Request:**

```http
GET /customers?phone=0912345678
Authorization: Bearer <access_token>
```

**Success Response – 200 OK**

```json
{
  "data": {
    "customerId": 1,
    "fullName": "Nguyen Van A",
    "phone": "0912345678"
  }
}
```

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 400 | `SO_DIEN_THOAI_KHONG_HOP_LE` | Invalid phone number |
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |
| 404 | `KHONG_TIM_THAY_KHACH_HANG` | Customer not found |

---

### 2.4 Create Customer

**Endpoint:** `POST /customers`

**Description:** Registers a new customer. If the normalized phone number already exists, the existing customer record is returned instead of creating a duplicate.

**Authentication:** Required.

**Allowed Role:** `NHAN_VIEN_TIEP_NHAN`

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `fullName` | String | Yes | Customer's full name |
| `phone` | String | Yes | Customer's phone number |

**Example Request:**

```json
{
  "fullName": "Nguyen Van A",
  "phone": "0912345678"
}
```

**Success Response – 201 Created**

```json
{
  "data": {
    "customerId": 1,
    "fullName": "Nguyen Van A",
    "phone": "0912345678"
  },
  "created": true
}
```

When the customer already exists, the API returns `200 OK` and `created: false`.

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 400 | `DU_LIEU_KHONG_HOP_LE` | Invalid or missing customer data |
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |

---

### 2.5 Find Device

**Endpoint:** `GET /devices`

**Description:** Searches for a device using its serial number or IMEI and returns its warranty information.

**Authentication:** Required.

**Allowed Role:** `NHAN_VIEN_TIEP_NHAN`

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `serial` | String | Yes | Device serial number or IMEI |

**Example Request:**

```http
GET /devices?serial=IMEI123456789
Authorization: Bearer <access_token>
```

**Success Response – 200 OK**

```json
{
  "data": {
    "deviceId": 1,
    "customerId": 1,
    "serialImei": "IMEI123456789",
    "warrantyEndDate": "2027-12-31",
    "warrantyStatus": "Còn bảo hành",
    "customerName": "Nguyen Van A"
  }
}
```

`warrantyEndDate` can be `null` when the warranty end date has not been recorded. The warranty status is calculated by the backend.

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 400 | `DU_LIEU_KHONG_HOP_LE` | Missing or invalid serial number |
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |
| 404 | `KHONG_TIM_THAY_THIET_BI` | Device not found |

---

### 2.6 Create Device

**Endpoint:** `POST /devices`

**Description:** Registers a device for an existing customer.

**Authentication:** Required.

**Allowed Role:** `NHAN_VIEN_TIEP_NHAN`

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `customerId` | Integer | Yes | Existing customer ID |
| `serialImei` | String | Yes | Unique device serial number or IMEI |
| `warrantyEndDate` | String or null | No | Warranty end date |

**Example Request:**

```json
{
  "customerId": 1,
  "serialImei": "IMEI123456789",
  "warrantyEndDate": "2027-12-31"
}
```

**Success Response – 201 Created**

```json
{
  "data": {
    "deviceId": 1,
    "customerId": 1,
    "serialImei": "IMEI123456789",
    "warrantyEndDate": "2027-12-31",
    "warrantyStatus": "Còn bảo hành",
    "customerName": "Nguyen Van A"
  }
}
```

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 400 | `DU_LIEU_KHONG_HOP_LE` | Invalid device data |
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |
| 404 | `KHONG_TIM_THAY_KHACH_HANG` | Customer does not exist |
| 409 | `SERIAL_DA_TON_TAI` | Device serial number already exists |

---

### 2.7 Get Issue Categories

**Endpoint:** `GET /categories`

**Description:** Retrieves the available issue categories.

**Authentication:** Required.

**Allowed Roles:**
- `NHAN_VIEN_TIEP_NHAN`
- `QUAN_LY_TRUNG_TAM`

**Request Parameters:** None.

**Request Body:** None.

**Success Response – 200 OK**

```json
{
  "data": [
    {
      "categoryId": 1,
      "categoryName": "Màn hình"
    },
    {
      "categoryId": 2,
      "categoryName": "Pin"
    },
    {
      "categoryId": 3,
      "categoryName": "Sạc"
    }
  ]
}
```

The system supports the following issue categories: Màn hình, Pin, Sạc, Phần mềm, Nước vào and Khác.

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |

---

### 2.8 Create Warranty Ticket

**Endpoint:** `POST /tickets`

**Description:** Creates a new warranty ticket for an existing device.

**Authentication:** Required.

**Allowed Role:** `NHAN_VIEN_TIEP_NHAN`

**Request Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `deviceId` | Integer | Yes | Existing device ID |
| `categoryId` | Integer or null | No | Issue category ID |
| `description` | String | Yes | Customer's reported issue |
| `priority` | String | No | Cao, Trung bình or Thấp; defaults to Trung bình |

**Example Request:**

```json
{
  "deviceId": 1,
  "categoryId": 2,
  "description": "The device battery drains quickly.",
  "priority": "Cao"
}
```

**Success Response – 201 Created**

```json
{
  "data": {
    "ticketId": 1,
    "ticketCode": "BH-EXAMPLE",
    "deviceId": 1,
    "categoryId": 2,
    "description": "The device battery drains quickly.",
    "priority": "Cao",
    "status": "Mới",
    "commitmentDeadline": "2026-11-14T10:00:00.000Z",
    "createdAt": "2026-11-13T10:00:00.000Z",
    "customerName": "Nguyen Van A",
    "customerPhoneMasked": "0912***678",
    "serialImei": "IMEI123456789",
    "categoryName": "Pin",
    "dueState": null
  }
}
```

**Business Rules:**

- The device must exist.
- The issue category must exist when `categoryId` is provided.
- The default priority is `Trung bình`.
- The initial ticket status is `Mới`.
- The commitment deadline is calculated automatically by the backend.
- The client cannot provide or manually modify the commitment deadline during ticket creation.
- The backend returns a masked customer phone number in the ticket view.

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 400 | `DU_LIEU_KHONG_HOP_LE` | Invalid ticket data |
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |
| 404 | `KHONG_TIM_THAY_THIET_BI` | Device does not exist |
| 500 | `KHONG_THE_TAO_PHIEU` | Ticket creation failed |

---

### 2.9 Get Ticket List

**Endpoint:** `GET /tickets`

**Description:** Retrieves the warranty ticket list with filtering and pagination.

**Authentication:** Required.

**Allowed Role:** `QUAN_LY_TRUNG_TAM`

**Query Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `status` | String | No | Filter by ticket status |
| `categoryId` | Integer | No | Filter by issue category |
| `priority` | String | No | Filter by priority |
| `page` | Integer | No | Page number; defaults to 1 |

**Example Request:**

```http
GET /tickets?status=Mới&priority=Cao&page=1
Authorization: Bearer <access_token>
```

**Success Response – 200 OK**

```json
{
  "data": [
    {
      "ticketId": 1,
      "ticketCode": "BH-EXAMPLE",
      "deviceId": 1,
      "categoryId": 2,
      "description": "The device battery drains quickly.",
      "priority": "Cao",
      "status": "Mới",
      "commitmentDeadline": "2026-11-14T10:00:00.000Z",
      "createdAt": "2026-11-13T10:00:00.000Z",
      "customerName": "Nguyen Van A",
      "customerPhoneMasked": "0912***678",
      "serialImei": "IMEI123456789",
      "categoryName": "Pin",
      "dueState": null
    }
  ]
}
```

The API returns up to 20 tickets per page. An empty result is returned as an empty `data` array.

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 400 | `DU_LIEU_KHONG_HOP_LE` | Invalid category filter |
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |

---

### 2.10 Get Ticket Details

**Endpoint:** `GET /tickets/:id`

**Description:** Retrieves detailed information about a specific warranty ticket.

**Authentication:** Required.

**Allowed Role:** `QUAN_LY_TRUNG_TAM`

**Path Parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | Integer | Yes | Ticket ID |

**Example Request:**

```http
GET /tickets/1
Authorization: Bearer <access_token>
```

**Success Response – 200 OK**

The response contains the ticket object using the same data structure as the ticket list endpoint.

**Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | User does not have permission |
| 404 | `KHONG_TIM_THAY_PHIEU` | Ticket not found |

---

### 2.11 Update Ticket – Not Currently Authorized

**Endpoint:** `PATCH /tickets/:id`

**Description:** The route is implemented for updating ticket information, including priority, status and issue category.

**Authentication:** Required.

**Allowed Role:** None currently configured.

**Request Body:** The service accepts optional fields:

| Field | Type | Description |
|---|---|---|
| `priority` | String | Ticket priority |
| `status` | String | Ticket status |
| `categoryId` | Integer or null | Issue category |

**Important:** Although the route and service are implemented, the route uses `authorizeRoles()` without specifying an allowed role. Therefore, authenticated users receive `403 Forbidden`. This endpoint is not currently available for normal use.

**Current Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | No role is authorized |

---

### 2.12 Close Ticket – Not Currently Authorized

**Endpoint:** `DELETE /tickets/:id`

**Description:** The route calls the ticket closing service. It does not physically delete the ticket record.

**Authentication:** Required.

**Allowed Role:** None currently configured.

**Important:** The route uses `authorizeRoles()` without specifying an allowed role. Therefore, authenticated users receive `403 Forbidden`. This endpoint is not currently available for normal use.

**Current Error Responses:**

| Status | Error Code | Description |
|---|---|---|
| 401 | `CHUA_DANG_NHAP` | Authentication required |
| 403 | `KHONG_CO_QUYEN_TRUY_CAP` | No role is authorized |

---

## 3. Ticket Business Rules

### 3.1 Priority and SLA

| Priority | SLA |
|---|---|
| Cao | 24 hours |
| Trung bình | 72 hours |
| Thấp | 120 hours |

The backend calculates the commitment deadline automatically based on the selected priority.

If the calculated deadline falls on Sunday, it is moved to Monday at the same time.

### 3.2 Ticket Status

The supported ticket statuses are:

1. Mới
2. Đã phân công
3. Đang xử lý
4. Chờ linh kiện
5. Hoàn tất
6. Đã đóng

New tickets are created with the status `Mới`.

### 3.3 Due State

The ticket view includes the `dueState` field:

| Value | Description |
|---|---|
| `SAP_DEN_HAN` | Approaching the commitment deadline |
| `QUA_HAN` | Past the commitment deadline |
| `null` | Neither condition applies |

The due state is calculated by the backend.

---

## 4. Common Error Handling

All application errors are processed by centralized error-handling middleware.

**Error Response Example:**

```json
{
  "error": "CHUA_DANG_NHAP",
  "requestId": "example-request-id"
}
```

Common error codes include:

| Error Code | HTTP Status | Description |
|---|---|---|
| `CHUA_DANG_NHAP` | 401 | Authentication is required |
| `KHONG_CO_QUYEN_TRUY_CAP` | 403 | Access is denied |
| `KHONG_TIM_THAY_API` | 404 | API endpoint does not exist |
| `DU_LIEU_KHONG_HOP_LE` | 400 | Input data is invalid |
| `LOI_HE_THONG` | 500 | Unexpected server error |
| `SO_DIEN_THOAI_KHONG_HOP_LE` | 400 | Invalid phone number |
| `KHONG_TIM_THAY_KHACH_HANG` | 404 | Customer not found |
| `KHONG_TIM_THAY_THIET_BI` | 404 | Device not found |
| `SERIAL_DA_TON_TAI` | 409 | Device serial number already exists |
| `KHONG_TIM_THAY_PHIEU` | 404 | Ticket not found |

---

## 5. Security and Access Control

The API applies authentication and role-based authorization at the backend route level.

| API Group | Reception Staff | Center Manager |
|---|---|---|
| Login | Public | Public |
| Health check | Public | Public |
| Customer lookup and creation | Allowed | Denied |
| Device lookup and creation | Allowed | Denied |
| Issue category retrieval | Allowed | Allowed |
| Ticket creation | Allowed | Denied |
| Ticket listing | Denied | Allowed |
| Ticket details | Denied | Allowed |
| Ticket update | Not authorized | Not authorized |
| Ticket closing | Not authorized | Not authorized |

The backend verifies the access token before allowing protected requests. Role authorization is enforced on the server and is not based solely on frontend navigation or interface visibility.

---

## 6. Notes and Limitations

- This documentation describes the API implementation currently available in the source code.
- `PATCH /tickets/:id` and `DELETE /tickets/:id` are implemented but have no authorized roles configured.
- The ticket list response currently returns a `data` array without a separate pagination metadata object.
- The API uses a custom HMAC-SHA256 signed token, not JWT.
- Example IDs, names, timestamps and tokens in this document are illustrative examples, not production records.
- The API does not include technician assignment, repair processing, spare-parts management or payment operations because these functions are outside the L02 scope.

**Document End**