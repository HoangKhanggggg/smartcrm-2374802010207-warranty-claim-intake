# Warranty App – Smart CRM

## 1. Thông tin đề tài

- **Tên đề tài:** Hệ thống tiếp nhận và quản lý yêu cầu bảo hành.
- **Dự án:** Smart CRM – Mekong Mobile.
- **Track:** Software Engineering (SE).
- **Repository:** `smartcrm-2374802010207-warranty-claim-intake`.
- **Chức năng chính:** Tra cứu khách hàng và thiết bị, tiếp nhận và phân loại phiếu bảo hành, xem và lọc danh sách phiếu.

---

## 2. Yêu cầu môi trường

- Node.js 20 trở lên.
- npm 10 trở lên.
- PostgreSQL 18.
- Git.

### Runtime thực tế đã kiểm thử
- Node.js: 24.12.0
- npm: 11.6.2
- PostgreSQL: 18.6
- Git: 2.56.0.windows.2

### Công nghệ sử dụng

- **Backend:** Node.js + Express.js.
- **Database:** PostgreSQL.
- **Frontend:** React + Vite.
- **Test:** Jest.
- **API:** REST API.
- **Kiến trúc backend:** Routes → Services → Repositories.

---

## 3. Cấu hình môi trường

Từ thư mục gốc của repository, tạo file `.env` từ `.env.example`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Sau đó mở `.env` và điền thông tin cấu hình PostgreSQL và tài khoản ứng dụng.

Ví dụ:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=smart_crm

APP_USER=nhanvien
APP_PASSWORD=your_app_password

AUTH_SECRET=change-this-secret
```

> Không commit file `.env` lên GitHub. Repository chỉ lưu `.env.example`.

---

## 4. Các bước dựng hệ thống

Chạy các lệnh từ thư mục gốc của repository.

### Bước 1 – Tải mã nguồn

```powershell
git clone https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake.git
cd smartcrm-2374802010207-warranty-claim-intake
```

### Bước 2 – Tạo file cấu hình

```powershell
Copy-Item .env.example .env
```

Sau đó chỉnh các thông tin PostgreSQL trong `.env`.

### Bước 3 – Tạo database

Có thể tạo database bằng PostgreSQL/pgAdmin:

```text
smart_crm
```

Hoặc sử dụng:

```powershell
psql -U postgres -c "CREATE DATABASE smart_crm;"
```

### Bước 4 – Cài thư viện backend

```powershell
npm install
```

### Bước 5 – Chạy backend

```powershell
npm start
```

Backend sử dụng cổng:

```text
http://localhost:3001
```

Khi khởi động, hệ thống tự chạy migration và chuẩn bị dữ liệu mẫu.

### Bước 6 – Cài thư viện frontend

Mở terminal mới:

```powershell
npm install --prefix src/frontend
```

### Bước 7 – Chạy frontend

```powershell
npm run dev --prefix src/frontend
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

### Bước 8 – Chạy unit test

Từ thư mục gốc:

```powershell
npm test
```

Kết quả kiểm thử hiện tại:

```text
Test Suites: 7 passed, 7 total
Tests:       32 passed, 32 total
```

---

## 5. Chạy thử luồng chính trên giao diện

Hệ thống hiện có **3 màn hình chính**.

### Màn hình 1 – Tra cứu

Chức năng:

- Tra cứu khách hàng theo số điện thoại.
- Tra cứu thiết bị theo Serial/IMEI.
- Kiểm tra tình trạng bảo hành.
- Chuyển sang màn hình tiếp nhận phiếu.

Ví dụ dữ liệu mẫu:

| Khách hàng | Số điện thoại | Serial / IMEI | Bảo hành |
|---|---|---|---|
| Nguyễn Văn An | 0912345678 | `SN-A001-2026` | Còn bảo hành |
| Trần Thị Bình | 0987654321 | `356938035643809` | Hết bảo hành |
| Lê Hoàng Cường | 0901234567 | `SN-C003-2026` | Chưa xác minh |

Luồng thử:

```text
Nhập số điện thoại
        ↓
Tra cứu khách hàng
        ↓
Nhập Serial / IMEI
        ↓
Tra cứu thiết bị
        ↓
Kiểm tra tình trạng bảo hành
        ↓
Tiếp tục tạo phiếu
```

---

### Màn hình 2 – Tiếp nhận và phân loại yêu cầu

Chức năng:

- Hiển thị khách hàng đã tra cứu.
- Hiển thị thiết bị.
- Hiển thị tình trạng bảo hành.
- Nhập mô tả lỗi.
- Chọn nhóm sự cố.
- Chọn mức ưu tiên.
- Hệ thống tự tính hạn cam kết.
- Tạo phiếu bảo hành.

Các nhóm sự cố:

```text
Màn hình
Pin
Sạc
Phần mềm
Nước vào
Khác
```

Mức ưu tiên:

```text
Cao
Trung bình
Thấp
```

Thời gian SLA:

```text
Cao        → 24 giờ
Trung bình → 72 giờ
Thấp       → 120 giờ
```

---

### Màn hình 3 – Danh sách phiếu

Chức năng:

- Hiển thị danh sách phiếu bảo hành.
- Hiển thị mã phiếu.
- Hiển thị khách hàng.
- Hiển thị thiết bị.
- Hiển thị trạng thái.
- Hiển thị nhóm sự cố.
- Hiển thị mức ưu tiên.
- Hiển thị hạn cam kết.
- Hiển thị ngày tiếp nhận.
- Lọc theo trạng thái.
- Lọc theo nhóm sự cố.
- Lọc theo mức ưu tiên.
- Phân trang.

Danh sách sử dụng API backend thật, không phải dữ liệu giao diện tĩnh.

---

## 6. Cấu trúc repository

```text
.
├── db/
│   └── schema.sql
│
├── docs/
│   ├── SRS
│   ├── sơ đồ Use Case
│   ├── sơ đồ Architecture
│   ├── ERD
│   ├── Wireframe
│   ├── ảnh minh chứng
│   ├── e2e-luong-chinh.md
│   └── thay-doi-thiet-ke.md
│
├── src/
│   ├── app.js
│   │
│   ├── db/
│   │   └── migrations/
│   │
│   ├── middleware/
│   │   └── requireAuth.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── lookup.js
│   │   └── tickets.js
│   │
│   ├── services/
│   │   ├── lookupService.js
│   │   └── ticketService.js
│   │
│   ├── repositories/
│   │
│   ├── utils/
│   │   ├── auth
│   │   ├── phone
│   │   ├── sla
│   │   ├── warranty
│   │   ├── due
│   │   └── ticketMapper
│   │
│   └── frontend/
│       ├── public/
│       └── src/
│           ├── api/
│           ├── components/
│           ├── hooks/
│           └── pages/
│
├── tests/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 7. Cơ sở dữ liệu

Database:

```text
smart_crm
```

Gồm 5 bảng chính:

```text
customer
device
issue_category
ticket
ticket_status_log
```

Quan hệ chính:

```text
customer
   │
   └──< device
          │
          └──< ticket
                  │
                  └──< ticket_status_log
```

Ticket liên kết khách hàng gián tiếp thông qua:

```text
device.customer_id
```

Không tạo thêm `ticket.customer_id` để tránh dư thừa dữ liệu.

Khi chạy:

```powershell
npm start
```

backend tự chạy migration.

Các migration được thiết kế để có thể chạy lại mà không tạo trùng dữ liệu.

---

## 8. API

Ngoại trừ:

```text
GET /health
POST /auth/login
```

các API còn lại yêu cầu:

```http
Authorization: Bearer <token>
```

Nếu thiếu hoặc token không hợp lệ, backend trả:

```text
401 Unauthorized
```

### Các API chính

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| POST | `/auth/login` | Đăng nhập |
| GET | `/customers?phone=` | Tra cứu khách hàng |
| POST | `/customers` | Tạo khách hàng |
| GET | `/devices?serial=` | Tra cứu thiết bị |
| POST | `/devices` | Tạo thiết bị |
| GET | `/categories` | Lấy danh mục nhóm sự cố |
| GET | `/tickets` | Danh sách phiếu |
| POST | `/tickets` | Tạo phiếu |
| GET | `/tickets/:id` | Xem chi tiết phiếu |
| PATCH | `/tickets/:id` | Cập nhật phiếu |
| DELETE | `/tickets/:id` | Đóng phiếu |

Dữ liệu API được chuẩn hóa theo dạng:

```json
{
  "data": {}
}
```

Các thuộc tính trả về cho frontend sử dụng camelCase.

---

## 9. Xác thực người dùng

Hệ thống hiện đã triển khai **Authentication – xác thực người dùng**.

Luồng:

```text
Đăng nhập
   ↓
POST /auth/login
   ↓
Backend kiểm tra tài khoản
   ↓
Trả token
   ↓
Frontend lưu token
   ↓
Gửi Bearer token khi gọi API
```

Frontend có xử lý trường hợp token hết hạn hoặc không hợp lệ:

```text
API trả 401
   ↓
Xóa token
   ↓
Thông báo phiên đăng nhập hết hạn
   ↓
Yêu cầu đăng nhập lại
```

---

## 10. Trạng thái giao diện

Frontend sử dụng component `DataState` để xử lý các trạng thái:

```text
Loading
Empty
Error
```

Khi xảy ra lỗi có thể thực hiện thao tác thử lại.

Frontend cũng tách phần gọi API thành:

```text
src/frontend/src/api/
```

Các trang giao diện không gọi `fetch()` trực tiếp.

---

## 11. Kiểm thử

Chạy:

```powershell
npm test -- --runInBand
```

Kết quả hiện tại:

```text
Test Suites: 7 passed, 7 total
Tests:       32 passed, 32 total
```

Các nhóm kiểm thử gồm:

- Chuẩn hóa số điện thoại.
- Tính SLA.
- Tính hạn cam kết.
- Kiểm tra bảo hành.
- Xử lý phiếu sắp/quá hạn.
- Xác thực token.
- Ticket mapper.
- Service nghiệp vụ.

Các test nghiệp vụ không yêu cầu kết nối database thật.

---

## 12. Kiểm tra Frontend

### Build production

```powershell
cd src/frontend
npm run build
```

Kết quả hiện tại:

```text
✓ built successfully
```

### Lint

```powershell
npm run lint
```

Kết quả hiện tại:

```text
Found 0 warnings and 0 errors.
```

---

## 13. Tài liệu thiết kế và minh chứng

Các tài liệu được lưu trong thư mục:

```text
docs/
```

Bao gồm:

```text
docs/srs.md
docs/usecase.*
docs/architecture.*
docs/erd.*
docs/wireframe0*.png
docs/thay-doi-thiet-ke.md
docs/e2e-luong-chinh.md
docs/e2e-*.png
docs/ai-declaration.md
```

Trong đó:

- `srs.md`: đặc tả yêu cầu.
- `usecase.*`: Use Case.
- `architecture.*`: kiến trúc hệ thống.
- `erd.*`: mô hình dữ liệu.
- `wireframe*.png`: thiết kế giao diện.
- `e2e-luong-chinh.md`: biên bản chạy luồng chính.
- `e2e-*.png`: ảnh minh chứng.
- `thay-doi-thiet-ke.md`: nhật ký thay đổi thiết kế.
- `ai-declaration.md`: khai báo sử dụng công cụ AI.

---

## 14. Trạng thái thực hiện

### Đã hoàn thành

- [x] Backend Express.
- [x] Kiến trúc backend Routes → Services → Repositories.
- [x] PostgreSQL.
- [x] Migration và dữ liệu mẫu.
- [x] Tra cứu khách hàng.
- [x] Tra cứu thiết bị.
- [x] Kiểm tra bảo hành.
- [x] Tạo phiếu bảo hành.
- [x] Phân loại sự cố.
- [x] Tính SLA.
- [x] Tính hạn cam kết.
- [x] Danh sách phiếu.
- [x] Lọc danh sách phiếu.
- [x] Phân trang.
- [x] Frontend React + Vite.
- [x] 3 màn hình chính.
- [x] Gọi API thật từ frontend.
- [x] Đăng nhập và xác thực bằng token.
- [x] Xử lý token hết hạn / HTTP 401.
- [x] Loading / Empty / Error state.
- [x] Luồng End-to-End.
- [x] Unit test.
- [x] 32/32 test pass.
- [x] Frontend build thành công.
- [x] Frontend lint 0 warning / 0 error.
- [x] Ảnh minh chứng luồng chính.
- [x] README và tài liệu thiết kế.

### Chưa hoàn thành

- [ ] **Phân quyền theo vai trò (QT-11).**

QT-11 yêu cầu kiểm tra quyền **tại server**:

```text
Nhân viên tiếp nhận
→ được tra cứu
→ được tạo phiếu

Quản lý
→ được xem danh sách
→ được lọc danh sách
→ được xem phiếu sắp hạn / quá hạn
```

Hiện tại hệ thống đã có **Authentication (xác thực)** nhưng chưa hoàn thiện **Authorization (phân quyền theo role)**.

Do đó QT-11 được ghi nhận là **chưa hoàn thành / tạm hoãn**, không đánh dấu `[x]` cho đến khi backend có kiểm tra role thực tế.

---

## 15. Trạng thái Sprint 2 / Buổi 10

Các chức năng chính của Sprint 2 đã được hiện thực hóa:

```text
Tra cứu khách hàng
        ↓
Tra cứu thiết bị
        ↓
Kiểm tra bảo hành
        ↓
Tiếp nhận và phân loại yêu cầu
        ↓
Tạo phiếu bảo hành
        ↓
Danh sách phiếu
        ↓
Lọc và phân trang
```

Kết quả kiểm tra hiện tại:

```text
Frontend build  : PASS
Frontend lint   : 0 warning / 0 error
Unit tests      : 32/32 PASS
E2E             : Đã chạy và có ảnh minh chứng
```

Phần còn lại cần hoàn thiện là:

```text
QT-11 – Phân quyền theo vai trò
```

---

## 16. Git và Repository

Repository:

```text
smartcrm-2374802010207-warranty-claim-intake
```

Các thay đổi được quản lý bằng Git và sử dụng Conventional Commits.

Ví dụ:

```text
feat: ...
fix: ...
docs: ...
chore: ...
test: ...
```

Trước khi push cần kiểm tra:

```powershell
git status
git --no-pager diff --check
npm test -- --runInBand
```

Đảm bảo:

```text
working tree clean
```

và commit đã được push lên `origin/main`.