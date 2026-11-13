# WARRANTY APP – SMART CRM

## Hệ thống tiếp nhận và quản lý yêu cầu bảo hành – Mekong Mobile

**Đồ án:** Chuyên đề tốt nghiệp 1
**Ngành:** Công nghệ thông tin
**Chuyên ngành:** Software Engineering (SE)
**Trường:** Đại học Văn Lang
**Repository:** [smartcrm-2374802010207-warranty-claim-intake](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake)

---

# MỤC LỤC

1. Giới thiệu dự án
2. Phạm vi thực hiện
3. Công nghệ và kiến trúc
4. Yêu cầu môi trường
5. Tải source code
6. Cài đặt và cấu hình PostgreSQL
7. Cấu hình biến môi trường
8. Cài đặt và khởi động Backend
9. Cài đặt và khởi động Frontend
10. Kiểm tra hệ thống sau khi khởi động
11. Hướng dẫn sử dụng theo vai trò
12. Tài khoản đăng nhập và dữ liệu mẫu
13. Cấu trúc repository
14. Thiết kế cơ sở dữ liệu
15. REST API
16. Xác thực và phân quyền
17. Kiểm thử Backend
18. Build và kiểm tra Frontend
19. Xử lý lỗi thường gặp
20. Trạng thái thực hiện
21. Tài liệu thiết kế và minh chứng
22. Ghi chú bảo mật

---

# 1. GIỚI THIỆU DỰ ÁN

Smart CRM – Mekong Mobile là hệ thống hỗ trợ tiếp nhận và quản lý yêu cầu bảo hành thiết bị.

Dự án tập trung xây dựng module L02 – **Tiếp nhận và phân loại yêu cầu bảo hành**, hỗ trợ nhân viên tiếp nhận ghi nhận thông tin khách hàng, thiết bị, tình trạng bảo hành và tạo phiếu bảo hành theo quy tắc nghiệp vụ.

## 1.1. Mục tiêu

- Chuẩn hóa quy trình tiếp nhận yêu cầu bảo hành.
- Hỗ trợ tra cứu và tạo thông tin khách hàng.
- Ghi nhận thiết bị thông qua Serial/IMEI.
- Kiểm tra tình trạng bảo hành.
- Phân loại nhóm sự cố và mức ưu tiên.
- Tự động tính thời hạn cam kết theo SLA.
- Hỗ trợ quản lý theo dõi, tìm kiếm và lọc danh sách phiếu.

## 1.2. Luồng nghiệp vụ tổng thể

```text
Tra cứu khách hàng
        |
        v
Tạo khách hàng nếu chưa tồn tại
        |
        v
Tra cứu / ghi nhận thiết bị
        |
        v
Kiểm tra tình trạng bảo hành
        |
        v
Nhập mô tả lỗi
        |
        v
Chọn nhóm sự cố
        |
        v
Chọn mức ưu tiên
        |
        v
Tính hạn cam kết SLA
        |
        v
Tạo phiếu bảo hành
        |
        v
Quản lý xem và lọc danh sách phiếu
```

---

# 2. PHẠM VI THỰC HIỆN

## 2.1. Trong phạm vi

- Tra cứu khách hàng.
- Tạo khách hàng mới.
- Tra cứu và ghi nhận thiết bị.
- Kiểm tra thời hạn bảo hành.
- Tiếp nhận và tạo phiếu bảo hành.
- Phân loại nhóm sự cố.
- Chọn mức ưu tiên.
- Tính hạn cam kết theo SLA.
- Xem danh sách phiếu.
- Lọc theo trạng thái, nhóm sự cố và mức ưu tiên.
- Phân trang danh sách phiếu.
- Ghi nhận lịch sử thay đổi trạng thái phiếu.
- Xác thực và phân quyền theo vai trò.
- Che số điện thoại theo quy tắc phân quyền.

## 2.2. Ngoài phạm vi

- Phân công và quản lý kỹ thuật viên.
- Quản lý quá trình sửa chữa.
- Quản lý linh kiện.
- Thanh toán.
- Quản lý bản ghi phê duyệt của quản lý.
- Phân quyền theo trung tâm.

Các chức năng ngoài phạm vi trên không được xem là chức năng đã triển khai của module L02.

---

# 3. CÔNG NGHỆ VÀ KIẾN TRÚC

## 3.1. Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Backend Runtime | Node.js |
| Backend Framework | Express.js |
| Frontend | React |
| Frontend Tool | Vite |
| Database | PostgreSQL 18 |
| Database Driver | node-postgres (`pg`) |
| API | REST API |
| Kiểm thử Backend | Jest, Supertest |
| Kiểm tra mã nguồn Frontend | Oxlint |
| Quản lý mã nguồn | Git, GitHub |
| IDE | Visual Studio Code |
| Quản lý Database | pgAdmin 4 |
| Kiểm tra API | Postman |

## 3.2. Kiến trúc Backend

Backend được tổ chức theo kiến trúc phân lớp:

```text
Routes
   |
   v
Controllers / Route Handlers
   |
   v
Services
   |
   v
Repositories
   |
   v
PostgreSQL
```

Vai trò của các lớp:

- **Routes:** Khai báo endpoint và tiếp nhận HTTP request.
- **Controllers / Route Handlers:** Điều phối request và response.
- **Services:** Xử lý nghiệp vụ và kiểm tra dữ liệu.
- **Repositories:** Thực hiện truy vấn cơ sở dữ liệu.
- **PostgreSQL:** Lưu trữ dữ liệu hệ thống.

Các truy vấn sử dụng parameterized query nhằm hạn chế nguy cơ SQL Injection.

## 3.3. Kiến trúc tổng thể

```text
React + Vite
     |
     | HTTP / REST API
     v
Node.js + Express
     |
     | Routes
     v
Services
     |
     | Repositories
     v
PostgreSQL 18
```

Frontend và Backend chạy độc lập trên hai cổng khác nhau trong môi trường phát triển.

---

# 4. YÊU CẦU MÔI TRƯỜNG

Trước khi cài đặt dự án, cần chuẩn bị các công cụ sau:

| Công cụ | Phiên bản đề nghị |
|---|---|
| Node.js | 20 trở lên |
| npm | Đi kèm Node.js |
| PostgreSQL | 18 |
| Git | Phiên bản phù hợp hệ điều hành |
| Visual Studio Code | Phiên bản hiện hành |
| pgAdmin 4 | Phiên bản tương thích PostgreSQL |

Các phiên bản đã được ghi nhận trong môi trường phát triển của dự án:

- Node.js: 24.12.0
- npm: 11.6.2
- PostgreSQL: 18.6
- Git: 2.56.0.windows.2

Đây là thông tin môi trường đã sử dụng, không phải yêu cầu bắt buộc duy nhất.

## 4.1. Kiểm tra công cụ

Mở Windows CMD hoặc Terminal trong Visual Studio Code:

```cmd
node -v
npm -v
git --version
```

Kiểm tra PostgreSQL CLI:

```cmd
psql --version
```

Nếu CMD không nhận lệnh `psql`, có thể sử dụng pgAdmin 4 để quản lý PostgreSQL.

---

# 5. TẢI SOURCE CODE

## 5.1. Clone repository

Mở Windows CMD tại thư mục muốn lưu dự án:

```cmd
git clone https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake.git
```

Di chuyển vào thư mục dự án:

```cmd
cd smartcrm-2374802010207-warranty-claim-intake
```

Mở dự án bằng Visual Studio Code:

```cmd
code .
```

Nếu lệnh `code .` không hoạt động, mở Visual Studio Code, chọn **File → Open Folder**, sau đó chọn thư mục dự án.

## 5.2. Kiểm tra cấu trúc thư mục

Sau khi clone, thư mục gốc có các thành phần chính:

```text
smartcrm-2374802010207-warranty-claim-intake/
│
├── docs/
├── src/
│   ├── db/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── frontend/
│
├── tests/
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

Không cần tải riêng Backend hoặc Frontend vì cả hai đã nằm trong repository.

---

# 6. CÀI ĐẶT VÀ CẤU HÌNH POSTGRESQL

## 6.1. Khởi động PostgreSQL

Mở pgAdmin 4 và kết nối đến PostgreSQL 18 bằng tài khoản đã tạo trong quá trình cài đặt.

Thông tin kết nối thường dùng trong môi trường phát triển:

```text
Host: localhost
Port: 5432
Username: postgres
Password: Mật khẩu PostgreSQL trên máy
```

## 6.2. Tạo database

Trong pgAdmin:

1. Mở PostgreSQL 18.
2. Nhấn chuột phải vào Databases.
3. Chọn Create → Database.
4. Nhập tên database:

```text
smart_crm
```

5. Nhấn Save.

Hoặc mở Query Tool kết nối đến database `postgres` và chạy:

```sql
CREATE DATABASE smart_crm;
```

Nếu database đã tồn tại thì không cần tạo lại.

**Lưu ý:** `CREATE DATABASE` là câu lệnh SQL. Thực hiện trong pgAdmin Query Tool hoặc PostgreSQL CLI, không nhập trực tiếp như một lệnh Windows CMD.

## 6.3. Khởi tạo cấu trúc dữ liệu

Sau khi cấu hình kết nối đúng, Backend thực hiện các migration được tích hợp trong dự án khi khởi động.

Các file migration:

```text
src/db/migrations/
├── 001_create_tables.sql
└── 002_seed.sql
```

Không cần tự tạo thủ công năm bảng nếu quá trình migration đã chạy thành công.

---

# 7. CẤU HÌNH BIẾN MÔI TRƯỜNG

## 7.1. Tạo file `.env`

Tại thư mục gốc dự án, mở CMD và chạy:

```cmd
copy .env.example .env
```

Nếu file `.env` đã tồn tại thì không cần tạo lại hoặc ghi đè.

## 7.2. Tạo AUTH_SECRET

Backend yêu cầu `AUTH_SECRET` có độ dài tối thiểu 32 ký tự.

Mở CMD tại thư mục gốc dự án và chạy:

```cmd
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Sao chép chuỗi ngẫu nhiên được tạo ra để cấu hình trong file `.env`.

Không chia sẻ khóa bí mật này và không đưa lên GitHub.

## 7.3. Cấu hình file `.env`

Mở file `.env` bằng Visual Studio Code:

```cmd
code .env
```

Cấu hình theo mẫu:

```env
PORT=3001

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=smart_crm

STAFF_USER=your_staff_username
STAFF_PASSWORD=replace_with_staff_password

MANAGER_USER=your_manager_username
MANAGER_PASSWORD=replace_with_manager_password

AUTH_SECRET=replace_with_random_secret_at_least_32_characters

LOG_LEVEL=INFO
```

Thay các giá trị minh họa bằng thông tin thực tế của máy đang cài đặt.

| Biến | Ý nghĩa |
|---|---|
| PORT | Cổng chạy Backend |
| DB_HOST | Địa chỉ máy chủ PostgreSQL |
| DB_PORT | Cổng PostgreSQL |
| DB_USER | Tài khoản PostgreSQL |
| DB_PASSWORD | Mật khẩu PostgreSQL |
| DB_NAME | Tên database |
| STAFF_USER | Tên đăng nhập nhân viên tiếp nhận |
| STAFF_PASSWORD | Mật khẩu nhân viên tiếp nhận |
| MANAGER_USER | Tên đăng nhập quản lý trung tâm |
| MANAGER_PASSWORD | Mật khẩu quản lý trung tâm |
| AUTH_SECRET | Khóa bí mật ký và xác minh token |
| LOG_LEVEL | Mức ghi log |

**Lưu ý quan trọng:**

1. `DB_PASSWORD` là mật khẩu tài khoản PostgreSQL, không phải mật khẩu đăng nhập ứng dụng.
2. `STAFF_USER` và `STAFF_PASSWORD` là tài khoản ứng dụng của nhân viên tiếp nhận.
3. `MANAGER_USER` và `MANAGER_PASSWORD` là tài khoản ứng dụng của quản lý trung tâm.
4. `AUTH_SECRET` phải có tối thiểu 32 ký tự.
5. Không sử dụng nguyên các giá trị minh họa khi chạy thật.
6. Không đưa file `.env` lên GitHub.

---

# 8. CÀI ĐẶT VÀ KHỞI ĐỘNG BACKEND

## 8.1. Cài đặt thư viện Backend

Tại thư mục gốc dự án, chạy:

```cmd
npm install
```

Lệnh này cài đặt các thư viện được khai báo trong `package.json`.

## 8.2. Khởi động Backend

Chạy:

```cmd
npm start
```

Backend sử dụng file khởi động:

```text
src/app.js
```

Khi khởi động, hệ thống đọc cấu hình môi trường, kết nối PostgreSQL và thực hiện quá trình khởi tạo cơ sở dữ liệu theo cơ chế migration đã triển khai.

Backend mặc định chạy tại:

```text
http://localhost:3001
```

Giữ Terminal thứ nhất hoạt động trong suốt quá trình sử dụng hệ thống.

---

# 9. CÀI ĐẶT VÀ KHỞI ĐỘNG FRONTEND

## 9.1. Cài đặt thư viện Frontend

Mở Terminal thứ hai tại thư mục gốc dự án và chạy:

```cmd
npm install --prefix src/frontend
```

## 9.2. Khởi động Frontend

Chạy:

```cmd
npm run dev --prefix src/frontend
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

Mở trình duyệt và truy cập địa chỉ trên để sử dụng hệ thống.

## 9.3. Tổng kết chạy hệ thống

Cần mở đồng thời hai Terminal:

| Terminal | Lệnh | Chức năng |
|---|---|---|
| Terminal 1 | `npm start` | Khởi động Backend |
| Terminal 2 | `npm run dev --prefix src/frontend` | Khởi động Frontend |

Backend cần hoạt động trước khi sử dụng các chức năng gọi API.

## 9.4. Dừng hệ thống

Tại từng Terminal đang chạy ứng dụng, nhấn:

```text
Ctrl + C
```

Thực hiện riêng cho Backend và Frontend.

---

# 10. KIỂM TRA HỆ THỐNG SAU KHI KHỞI ĐỘNG

## 10.1. Kiểm tra Backend

Mở Terminal mới và chạy:

```cmd
curl http://localhost:3001/health
```

Kết quả mong đợi có trạng thái:

```json
{
  "status": "ok"
}
```

Response thực tế có thể chứa thêm thông tin như `requestId`.

Nếu API trả về trạng thái hoạt động thành công, Backend đã có thể tiếp nhận request.

## 10.2. Kiểm tra Frontend

Mở trình duyệt:

```text
http://localhost:5173
```

Giao diện Smart CRM – Mekong Mobile sẽ được hiển thị.

## 10.3. Kiểm tra luồng nghiệp vụ

Thực hiện kiểm tra theo trình tự:

1. Đăng nhập bằng tài khoản nhân viên tiếp nhận.
2. Tra cứu khách hàng bằng số điện thoại.
3. Tra cứu thiết bị bằng Serial/IMEI.
4. Kiểm tra tình trạng bảo hành.
5. Nhập mô tả lỗi.
6. Chọn nhóm sự cố.
7. Chọn mức ưu tiên.
8. Kiểm tra hạn cam kết SLA.
9. Tạo phiếu bảo hành.
10. Đăng xuất tài khoản nhân viên.
11. Đăng nhập bằng tài khoản quản lý trung tâm.
12. Mở Danh sách phiếu và kiểm tra phiếu vừa tạo.

---

# 11. HƯỚNG DẪN SỬ DỤNG THEO VAI TRÒ

Giao diện được hiển thị theo vai trò đăng nhập.

| Vai trò | Chức năng được hiển thị |
|---|---|
| Nhân viên tiếp nhận | Tra cứu, Tiếp nhận |
| Quản lý trung tâm | Danh sách phiếu |

Theo QT-12, số điện thoại hiển thị đầy đủ với nhân viên tiếp nhận và được che với quản lý trung tâm.

## 11.1. Màn hình tra cứu

Chức năng:

- Tra cứu khách hàng theo số điện thoại.
- Tra cứu thiết bị theo Serial/IMEI.
- Kiểm tra tình trạng bảo hành.
- Chuyển sang màn hình tiếp nhận phiếu.

## 11.2. Màn hình tiếp nhận và phân loại yêu cầu

Chức năng:

- Hiển thị thông tin khách hàng.
- Hiển thị thông tin thiết bị.
- Hiển thị tình trạng bảo hành.
- Nhập mô tả lỗi.
- Chọn nhóm sự cố.
- Chọn mức ưu tiên.
- Tính hạn cam kết.
- Tạo phiếu bảo hành.

### Nhóm sự cố

- Màn hình
- Pin
- Sạc
- Phần mềm
- Nước vào
- Khác

### Mức ưu tiên

- Cao
- Trung bình
- Thấp

Mức ưu tiên mặc định: **Trung bình**.

### Thời gian SLA

| Mức ưu tiên | Thời gian SLA |
|---|---:|
| Cao | 24 giờ |
| Trung bình | 72 giờ |
| Thấp | 120 giờ |

Hạn cam kết được hệ thống tự động tính theo mức ưu tiên. Người dùng không được tự sửa hạn cam kết.

Nếu hạn cam kết rơi vào Chủ nhật, hệ thống dời sang cùng giờ Thứ Hai.

## 11.3. Màn hình danh sách phiếu

Màn hình dành cho vai trò quản lý trung tâm.

Chức năng:

- Xem danh sách phiếu bảo hành.
- Xem thông tin khách hàng và thiết bị.
- Xem trạng thái phiếu.
- Xem nhóm sự cố và mức ưu tiên.
- Xem hạn cam kết.
- Lọc theo trạng thái.
- Lọc theo nhóm sự cố.
- Lọc theo mức ưu tiên.
- Phân trang danh sách.

Số lượng mặc định: **20 phiếu/trang**.

Khi không có kết quả phù hợp, giao diện hiển thị:

```text
Không có phiếu phù hợp
```

---

# 12. TÀI KHOẢN ĐĂNG NHẬP VÀ DỮ LIỆU MẪU

## 12.1. Tài khoản đăng nhập

Tài khoản ứng dụng được thiết lập trong file `.env`:

```env
STAFF_USER=your_staff_username
STAFF_PASSWORD=replace_with_staff_password

MANAGER_USER=your_manager_username
MANAGER_PASSWORD=replace_with_manager_password
```

Người cài đặt sử dụng chính các giá trị đã cấu hình để đăng nhập.

- Tài khoản nhân viên: sử dụng `STAFF_USER` và `STAFF_PASSWORD`.
- Tài khoản quản lý: sử dụng `MANAGER_USER` và `MANAGER_PASSWORD`.

Đây là tài khoản ứng dụng, không phải tài khoản PostgreSQL và không được tạo từ dữ liệu seed.

Không công khai mật khẩu thật trong README.

## 12.2. Dữ liệu mẫu

Dữ liệu mẫu được khai báo trong file:

```text
src/db/migrations/002_seed.sql
```

Có thể mở file này để kiểm tra các khách hàng, thiết bị và nhóm sự cố được khởi tạo.

Thông tin trong README cần được cập nhật nếu dữ liệu seed thay đổi.

## 12.3. Lưu ý khi chạy lại migration

Không tự ý xóa database đang sử dụng nếu chưa sao lưu dữ liệu cần thiết.

Khi thay đổi cấu trúc cơ sở dữ liệu trong tương lai, nên tạo migration mới thay vì chỉnh sửa migration đã được sử dụng ở các môi trường khác.

---

# 13. CẤU TRÚC REPOSITORY

Cấu trúc chính của dự án:

```text
smartcrm-2374802010207-warranty-claim-intake/
│
├── docs/
│   ├── srs.md
│   ├── e2e-luong-chinh.md
│   ├── thay-doi-thiet-ke.md
│   └── ai-disclosure.md
│
├── src/
│   ├── app.js
│   │
│   ├── db/
│   │   ├── index.js
│   │   └── migrations/
│   │       ├── 001_create_tables.sql
│   │       └── 002_seed.sql
│   │
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   │
│   └── frontend/
│       ├── public/
│       ├── package.json
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
├── package-lock.json
└── README.md
```

Đây là cấu trúc khái quát, các thư mục có thể chứa thêm file triển khai chi tiết.

---

# 14. THIẾT KẾ CƠ SỞ DỮ LIỆU

Tên database:

```text
smart_crm
```

Hệ thống sử dụng năm bảng chính:

| Bảng | Chức năng |
|---|---|
| `customer` | Lưu thông tin khách hàng |
| `device` | Lưu thông tin thiết bị |
| `issue_category` | Lưu danh mục nhóm sự cố |
| `ticket` | Lưu thông tin phiếu bảo hành |
| `ticket_status_log` | Lưu lịch sử thay đổi trạng thái |

## 14.1. Quan hệ dữ liệu

```text
customer
   |
   | 1 - N
   v
device
   |
   | 1 - N
   v
ticket
   |
   | 1 - N
   v
ticket_status_log
```

Ticket liên kết khách hàng gián tiếp thông qua:

```text
device.customer_id
```

Không tạo thêm `ticket.customer_id` vì không có thuộc tính này trong DDL chuẩn của dự án.

## 14.2. Migration

Các file migration:

```text
src/db/migrations/001_create_tables.sql
src/db/migrations/002_seed.sql
```

- `001_create_tables.sql`: Khởi tạo cấu trúc bảng và các ràng buộc dữ liệu.
- `002_seed.sql`: Khởi tạo danh mục sự cố và dữ liệu mẫu.

Backend thực hiện migration theo cơ chế đã triển khai khi khởi động.

---

# 15. REST API

Các API được sử dụng để giao tiếp giữa Frontend và Backend.

## 15.1. Xác thực

Hai endpoint không yêu cầu token:

```http
GET /health
POST /auth/login
```

Các API nghiệp vụ yêu cầu token xác thực.

Header:

```http
Authorization: Bearer <token>
```

Nếu token thiếu hoặc không hợp lệ, Backend trả về HTTP 401 Unauthorized.

## 15.2. Danh sách API chính

| Phương thức | Endpoint | Vai trò được phép | Chức năng |
|---|---|---|---|
| GET | `/health` | Không cần đăng nhập | Kiểm tra Backend |
| POST | `/auth/login` | Không cần đăng nhập | Đăng nhập |
| GET | `/customers?phone=` | Nhân viên tiếp nhận | Tra cứu khách hàng |
| POST | `/customers` | Nhân viên tiếp nhận | Tạo khách hàng |
| GET | `/devices?serial=` | Nhân viên tiếp nhận | Tra cứu thiết bị |
| POST | `/devices` | Nhân viên tiếp nhận | Tạo thiết bị |
| GET | `/categories` | Nhân viên tiếp nhận, Quản lý trung tâm | Lấy nhóm sự cố |
| GET | `/tickets` | Quản lý trung tâm | Lấy danh sách phiếu |
| POST | `/tickets` | Nhân viên tiếp nhận | Tạo phiếu |
| GET | `/tickets/:id` | Quản lý trung tâm | Xem chi tiết phiếu |

`PATCH /tickets/:id` và `DELETE /tickets/:id` hiện không được cấp quyền cho các vai trò ứng dụng. Do đó, không xem đây là chức năng cập nhật hoặc đóng phiếu khả dụng trên giao diện.

Hệ thống không xóa vật lý phiếu.

## 15.3. Kiểm tra API bằng cURL

Kiểm tra Health Check:

```cmd
curl http://localhost:3001/health
```

Đăng nhập nhân viên:

```cmd
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"username\":\"your_staff_username\",\"password\":\"your_staff_password\"}"
```

Đăng nhập quản lý:

```cmd
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"username\":\"your_manager_username\",\"password\":\"your_manager_password\"}"
```

Sau khi đăng nhập thành công, sử dụng token trả về để gọi các API yêu cầu xác thực.

Có thể sử dụng Postman để kiểm tra các endpoint khác.

---

# 16. XÁC THỰC VÀ PHÂN QUYỀN

## 16.1. Authentication – Xác thực

Hệ thống đã triển khai xác thực người dùng bằng token được ký và xác minh bằng HMAC-SHA256.

Đây là cơ chế token tùy chỉnh của dự án, **không phải JWT**.

Luồng đăng nhập:

```text
Người dùng nhập tài khoản
        |
        v
POST /auth/login
        |
        v
Backend kiểm tra tài khoản
        |
        v
Backend tạo token
        |
        v
Frontend lưu token
        |
        v
Gửi Bearer token khi gọi API
```

## 16.2. Authorization – Phân quyền

Hệ thống kiểm tra quyền truy cập tại Backend theo vai trò:

| Chức năng | Nhân viên tiếp nhận | Quản lý trung tâm |
|---|---|---|
| Tra cứu khách hàng | Có | Không |
| Tạo khách hàng | Có | Không |
| Tra cứu thiết bị | Có | Không |
| Ghi nhận thiết bị | Có | Không |
| Tạo phiếu | Có | Không |
| Xem danh sách phiếu | Không | Có |
| Xem chi tiết phiếu | Không | Có |
| Xem nhóm sự cố | Có | Có |

Frontend chỉ hiển thị chức năng phù hợp với vai trò. Backend vẫn là nơi kiểm tra quyền truy cập thực tế.

## 16.3. Xử lý token hết hạn

Khi API trả về HTTP 401, Frontend thực hiện:

```text
API trả về 401
        |
        v
Xóa token và thông tin phiên
        |
        v
Thông báo phiên đăng nhập hết hạn
        |
        v
Yêu cầu đăng nhập lại
```

## 16.4. Quy tắc hiển thị số điện thoại – QT-12

- Nhân viên tiếp nhận: được xem số điện thoại đầy đủ.
- Quản lý trung tâm: số điện thoại được che.

Quy tắc hiển thị được kiểm soát ở Backend, không chỉ dựa vào giao diện Frontend.

---

# 17. KIỂM THỬ BACKEND

Backend sử dụng Jest và Supertest để kiểm thử.

## 17.1. Cài đặt dependencies

Tại thư mục gốc dự án:

```cmd
npm install
```

## 17.2. Chạy kiểm thử

Chạy lệnh:

```cmd
node node_modules\jest\bin\jest.js --runInBand
```

Lệnh trên được sử dụng trong môi trường Windows của dự án.

## 17.3. Các nhóm kiểm thử

Các nhóm kiểm thử bao gồm:

- Chuẩn hóa số điện thoại.
- Tính SLA.
- Tính hạn cam kết.
- Kiểm tra bảo hành.
- Xử lý phiếu sắp hạn và quá hạn.
- Xác thực token.
- Phân quyền theo vai trò.
- Kiểm tra hiển thị số điện thoại theo QT-12.
- Ticket mapper.
- Service nghiệp vụ.
- Repository và middleware.

Các kiểm thử API sử dụng Supertest để gửi request đến ứng dụng Express. Những trường hợp không cần truy cập database thật có thể sử dụng mock phù hợp.

## 17.4. Kết quả kiểm thử đã ghi nhận

Kết quả trong môi trường phát triển:

```text
Test Suites: 13 passed, 13 total
Tests:       72 passed, 72 total
Snapshots:   0 total
```

Đây là kết quả đã ghi nhận tại thời điểm kiểm thử. Khi cài đặt trên máy khác hoặc có thay đổi mã nguồn, cần chạy lại lệnh Jest để xác nhận.

---

# 18. BUILD VÀ KIỂM TRA FRONTEND

Frontend sử dụng Vite và Oxlint.

Các lệnh dưới đây được chạy tại thư mục gốc dự án.

## 18.1. Build production

```cmd
npm run build --prefix src/frontend
```

Lệnh này kiểm tra khả năng đóng gói Frontend cho môi trường production.

## 18.2. Kiểm tra mã nguồn

```cmd
npm run lint --prefix src/frontend
```

## 18.3. Preview bản build

```cmd
npm run preview --prefix src/frontend
```

Các script được khai báo trong:

```text
src/frontend/package.json
```

---

# 19. XỬ LÝ LỖI THƯỜNG GẶP

## 19.1. Không kết nối được PostgreSQL

Biểu hiện:

```text
ECONNREFUSED
```

Nguyên nhân có thể:

- PostgreSQL chưa khởi động.
- Sai `DB_HOST`.
- Sai `DB_PORT`.
- PostgreSQL không lắng nghe tại cổng cấu hình.

Cách xử lý:

1. Kiểm tra PostgreSQL 18 đang hoạt động.
2. Kiểm tra Host và Port trong `.env`.
3. Kiểm tra kết nối bằng pgAdmin.
4. Khởi động lại Backend.

## 19.2. Sai mật khẩu PostgreSQL

Biểu hiện:

```text
password authentication failed
```

Cách xử lý:

- Kiểm tra `DB_USER`.
- Kiểm tra `DB_PASSWORD`.
- Đảm bảo mật khẩu đúng với tài khoản PostgreSQL.
- Khởi động lại Backend sau khi sửa `.env`.

## 19.3. Lỗi AUTH_SECRET

Backend có thể không khởi động nếu thiếu hoặc cấu hình `AUTH_SECRET` không hợp lệ.

Tạo secret mới:

```cmd
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Cập nhật vào `.env` và bảo đảm secret có ít nhất 32 ký tự.

## 19.4. Database không tồn tại

Biểu hiện:

```text
database does not exist
```

Cách xử lý:

- Mở pgAdmin.
- Kiểm tra database đã tạo chưa.
- Kiểm tra `DB_NAME` trong `.env`.
- Đảm bảo tên database khớp với database đã tạo.

## 19.5. Cổng 3001 đã được sử dụng

Biểu hiện:

```text
EADDRINUSE
```

Cách xử lý:

- Đóng tiến trình Backend cũ nếu còn hoạt động.
- Hoặc đổi `PORT` trong `.env` và điều chỉnh cấu hình URL Backend tương ứng ở Frontend.

## 19.6. Frontend không kết nối được Backend

Kiểm tra:

1. Backend đã chạy chưa.
2. Backend có hoạt động tại `http://localhost:3001` không.
3. Health Check API có trả về trạng thái hoạt động không.
4. Cấu hình URL Backend trong Frontend có đúng không.

Kiểm tra bằng:

```cmd
curl http://localhost:3001/health
```

## 19.7. Lỗi đăng nhập

Kiểm tra:

- `STAFF_USER` và `STAFF_PASSWORD` nếu đăng nhập nhân viên.
- `MANAGER_USER` và `MANAGER_PASSWORD` nếu đăng nhập quản lý.
- Backend đã được khởi động lại sau khi thay đổi `.env` chưa.
- `AUTH_SECRET` đã được cấu hình đúng chưa.

Tài khoản ứng dụng sử dụng thông tin cấu hình trong `.env`, không sử dụng mật khẩu PostgreSQL.

Backend tự xác định vai trò theo tài khoản đã cấu hình. Frontend không tự quyết định vai trò.

## 19.8. Không tìm thấy lệnh node hoặc npm

Cài đặt Node.js phiên bản phù hợp, sau đó đóng và mở lại CMD:

```cmd
node -v
npm -v
```

Nếu vẫn không nhận lệnh, kiểm tra biến môi trường PATH của Windows.

## 19.9. Lỗi thiếu thư viện

Tại thư mục gốc dự án:

```cmd
npm install
```

Cài đặt lại thư viện Frontend:

```cmd
npm install --prefix src/frontend
```

Không xóa hoặc chỉnh sửa `package-lock.json` tùy tiện khi chỉ cần cài đặt dependencies.

---

# 20. TRẠNG THÁI THỰC HIỆN

## 20.1. Các chức năng đã triển khai

- [x] Backend Express.
- [x] Kiến trúc Routes → Services → Repositories.
- [x] Kết nối PostgreSQL.
- [x] Migration và dữ liệu mẫu.
- [x] Tra cứu khách hàng.
- [x] Tạo khách hàng.
- [x] Tra cứu thiết bị.
- [x] Ghi nhận thiết bị.
- [x] Kiểm tra bảo hành.
- [x] Tạo phiếu bảo hành.
- [x] Phân loại sự cố.
- [x] Tính SLA.
- [x] Tính hạn cam kết.
- [x] Danh sách phiếu.
- [x] Lọc danh sách phiếu.
- [x] Phân trang.
- [x] Frontend React + Vite.
- [x] Gọi API từ Frontend.
- [x] Đăng nhập và xác thực bằng token.
- [x] Xử lý token hết hạn / HTTP 401.
- [x] Loading / Empty / Error state.
- [x] Phân quyền theo vai trò QT-11.
- [x] Che số điện thoại theo vai trò QT-12.
- [x] Kiểm thử Backend bằng Jest.
- [x] Tài liệu README và tài liệu thiết kế.

## 20.2. Chức năng chưa hoàn thành

Các chức năng thuộc phạm vi L02 đã được triển khai theo kế hoạch tại thời điểm cập nhật tài liệu.

Những chức năng ngoài phạm vi đã xác định không được xem là hạng mục còn thiếu của module L02.

---

# 21. TÀI LIỆU THIẾT KẾ VÀ MINH CHỨNG

Các tài liệu thiết kế và minh chứng được lưu trong thư mục:

```text
docs/
```

Các nhóm tài liệu cần có:

| Tài liệu | Nội dung |
|---|---|
| SRS | Đặc tả yêu cầu phần mềm |
| Use Case | Mô hình các trường hợp sử dụng |
| Architecture | Thiết kế kiến trúc hệ thống |
| ERD | Mô hình dữ liệu |
| Wireframe | Thiết kế giao diện |
| E2E | Mô tả kiểm thử luồng chính |
| Thay đổi thiết kế | Nhật ký thay đổi thiết kế |
| AI Disclosure | Khai báo sử dụng công cụ AI |
| Screenshots | Ảnh minh chứng quá trình thực hiện và kiểm thử |

Tên file cụ thể cần đối chiếu với các file thực tế trong repository.

---

# 22. GHI CHÚ BẢO MẬT

Các file và thư mục không nên đưa lên GitHub:

```text
node_modules/
.env
```

File `.gitignore` cần bỏ qua ít nhất:

```gitignore
node_modules/

.env
.env.*
!.env.example

dist/
src/frontend/dist/

*.log
npm-debug.log*

.DS_Store
Thumbs.db
```

File `.env.example` chỉ chứa tên biến và giá trị mẫu, không chứa mật khẩu hoặc khóa bí mật thật.

Không đưa lên GitHub:

- Mật khẩu PostgreSQL.
- Mật khẩu ứng dụng thật.
- AUTH_SECRET thật.
- Token đăng nhập.
- Dữ liệu nhạy cảm của người dùng.

Khi triển khai trên môi trường khác, cần cấu hình lại các biến môi trường phù hợp với máy chủ và cơ sở dữ liệu thực tế.

---

# 23. ĐÓNG GÓI VÀ TRIỂN KHAI BẰNG DOCKER

## 23.1. Công nghệ sử dụng

Dự án sử dụng Docker và Docker Compose để đóng gói, khởi chạy các thành phần độc lập:

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js 22 Alpine |
| Frontend | React + Vite, Nginx Alpine |
| Database | PostgreSQL 18 Alpine |
| Điều phối container | Docker Compose |

## 23.2. Cấu trúc tệp Docker

```text
smartcrm-2374802010207-warranty-claim-intake/
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .env
└── src/
    └── frontend/
        ├── Dockerfile
        ├── nginx.conf
        └── .dockerignore
```

## 23.3. Cấu hình môi trường

Tạo file `.env` tại thư mục gốc dự án và cấu hình các biến môi trường cần thiết.

Các thông tin bí mật bao gồm mật khẩu PostgreSQL, mật khẩu tài khoản ứng dụng và AUTH_SECRET phải được thay bằng giá trị riêng của môi trường triển khai.

Không đưa `.env` hoặc thông tin bí mật lên GitHub.

Trong Docker Compose, Backend kết nối PostgreSQL thông qua hostname dịch vụ `db`, không sử dụng `localhost`.

## 23.4. Build các Docker image

Tại thư mục gốc dự án, chạy:

```cmd
docker compose config --quiet
docker compose build
```

Lệnh đầu kiểm tra cấu hình Compose. Lệnh thứ hai xây dựng các Docker image.

## 23.5. Khởi động hệ thống

Chạy:

```cmd
docker compose up -d
```

Docker Compose khởi động ba dịch vụ:

- PostgreSQL: cổng nội bộ 5432.
- Backend: `http://localhost:3001`.
- Frontend: `http://localhost:5173`.

Backend chỉ khởi động sau khi PostgreSQL vượt qua health check.

## 23.6. Kiểm tra trạng thái container

Chạy:

```cmd
docker compose ps
```

Kiểm tra trạng thái:

- `smartcrm-db`: Healthy.
- `smartcrm-backend`: Healthy.
- `smartcrm-frontend`: Up.

Kiểm tra Backend:

```cmd
curl http://localhost:3001/health
```

Truy cập giao diện:

```text
http://localhost:5173
```

## 23.7. Xem log và quản lý container

Xem log Backend:

```cmd
docker compose logs -f backend
```

Xem log Frontend:

```cmd
docker compose logs -f frontend
```

Xem log PostgreSQL:

```cmd
docker compose logs -f db
```

Khởi động lại hệ thống:

```cmd
docker compose restart
```

Dừng hệ thống:

```cmd
docker compose down
```

Lưu ý: Không sử dụng `docker compose down -v` nếu cần giữ lại dữ liệu PostgreSQL trong volume.

## 23.8. Lưu trữ dữ liệu

Docker Compose sử dụng named volume `smartcrm_pgdata` để lưu trữ dữ liệu PostgreSQL.

Dữ liệu trong volume được giữ lại khi container được khởi động lại hoặc dừng bằng `docker compose down`.

## 23.9. Kết quả triển khai đã kiểm tra

Trong môi trường triển khai Docker trên máy phát triển, đã thực hiện:

- Build thành công Docker image Backend.
- Build thành công Docker image Frontend.
- Khởi động PostgreSQL 18, Backend và Frontend.
- Kiểm tra Backend thông qua API `/health`.
- Truy cập giao diện Smart CRM.
- Đăng nhập theo vai trò.
- Tạo phiếu bảo hành và kiểm tra dữ liệu trong PostgreSQL.
- Kiểm tra bản ghi lịch sử trạng thái ban đầu.
- Khởi động lại các container và xác nhận dữ liệu phiếu vẫn tồn tại.

Kết quả kiểm tra cụ thể được lưu bằng ảnh minh chứng trong thư mục tài liệu của dự án.

# THÔNG TIN DỰ ÁN

**Warranty App – Smart CRM**

Hệ thống tiếp nhận và quản lý yêu cầu bảo hành cho Mekong Mobile.

**Đồ án:** Chuyên đề tốt nghiệp 1
**Chuyên ngành:** Software Engineering (SE)
**Repository:** https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake

