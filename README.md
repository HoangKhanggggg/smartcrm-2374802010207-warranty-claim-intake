# WARRANTY APP – SMART CRM

**Hệ thống tiếp nhận và quản lý yêu cầu bảo hành – Mekong Mobile**

Đồ án: Chuyên đề tốt nghiệp 1
Ngành: Công nghệ thông tin
Chuyên ngành: Software Engineering (SE)
Trường: Đại học Văn Lang

Repository: [smartcrm-2374802010207-warranty-claim-intake](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake)

---

# MỤC LỤC

1. Giới thiệu dự án
2. Phạm vi thực hiện
3. Công nghệ sử dụng
4. Yêu cầu môi trường
5. Tải source code
6. Cài đặt và cấu hình PostgreSQL
7. Cấu hình Backend
8. Cài đặt và khởi động Backend
9. Cài đặt và khởi động Frontend
10. Kiểm tra hệ thống sau khi khởi động
11. Hướng dẫn sử dụng chức năng
12. Tài khoản đăng nhập và dữ liệu mẫu
13. Cấu trúc repository
14. Thiết kế cơ sở dữ liệu
15. REST API
16. Xác thực người dùng
17. Kiểm thử Backend
18. Build và kiểm tra Frontend
19. Xử lý lỗi thường gặp
20. Trạng thái thực hiện
21. Tài liệu thiết kế và minh chứng
22. Ghi chú bảo mật

---

# 1. GIỚI THIỆU DỰ ÁN

Smart CRM – Mekong Mobile là hệ thống hỗ trợ tiếp nhận và quản lý yêu cầu bảo hành thiết bị.

Dự án tập trung xây dựng luồng nghiệp vụ L02 – Tiếp nhận và phân loại yêu cầu bảo hành.

Các chức năng chính:

- Tra cứu khách hàng.
- Tạo khách hàng mới.
- Tra cứu thiết bị bằng Serial/IMEI.
- Ghi nhận thiết bị.
- Kiểm tra tình trạng bảo hành.
- Tiếp nhận yêu cầu bảo hành.
- Phân loại nhóm sự cố.
- Xác định mức độ ưu tiên.
- Tính thời hạn cam kết theo SLA.
- Quản lý, tìm kiếm, lọc và phân trang danh sách phiếu.

## 1.1. Mục tiêu

Xây dựng một hệ thống Web có khả năng hỗ trợ nhân viên tiếp nhận thực hiện quy trình bảo hành một cách thống nhất, đồng thời lưu trữ thông tin khách hàng, thiết bị và phiếu bảo hành trong cơ sở dữ liệu PostgreSQL.

## 1.2. Luồng nghiệp vụ tổng thể

```text
Tra cứu khách hàng
        |
        v
Tra cứu thiết bị
        |
        v
Kiểm tra tình trạng bảo hành
        |
        v
Tiếp nhận yêu cầu
        |
        v
Nhập mô tả lỗi
        |
        v
Phân loại nhóm sự cố
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
Hiển thị danh sách phiếu
        |
        v
Tìm kiếm, lọc và phân trang
```

---

# 2. PHẠM VI THỰC HIỆN

## 2.1. Trong phạm vi

- Tra cứu và tạo khách hàng.
- Ghi nhận và tra cứu thiết bị.
- Kiểm tra thời hạn bảo hành.
- Tiếp nhận và tạo phiếu bảo hành.
- Phân loại nhóm sự cố.
- Chọn mức ưu tiên.
- Tính hạn cam kết theo SLA.
- Xem danh sách phiếu.
- Lọc theo trạng thái, nhóm sự cố và mức ưu tiên.
- Phân trang danh sách phiếu.
- Ghi nhận lịch sử thay đổi trạng thái phiếu.

## 2.2. Ngoài phạm vi

- Phân công và quản lý kỹ thuật viên.
- Quản lý quá trình sửa chữa.
- Quản lý linh kiện.
- Thanh toán.
- Quản lý bản ghi phê duyệt của quản lý.
- Phân quyền theo trung tâm.

---

# 3. CÔNG NGHỆ SỬ DỤNG

| Thành phần | Công nghệ |
|---|---|
| Backend | Node.js |
| Backend Framework | Express.js |
| Frontend | React |
| Frontend Tool | Vite |
| Database | PostgreSQL 18 |
| API | REST API |
| Kiểm thử Backend | Jest |
| Kiểm tra mã nguồn Frontend | Oxlint |
| Quản lý mã nguồn | Git, GitHub |
| IDE | Visual Studio Code |
| Quản lý Database | pgAdmin 4 |

## 3.1. Kiến trúc Backend

Backend được tổ chức theo kiến trúc phân lớp:

```text
Routes
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

Giải thích:

- **Routes:** Tiếp nhận HTTP request và định tuyến API.
- **Services:** Xử lý nghiệp vụ và kiểm tra dữ liệu.
- **Repositories:** Thực hiện truy vấn dữ liệu.
- **PostgreSQL:** Lưu trữ dữ liệu hệ thống.

Các truy vấn dữ liệu sử dụng parameterized query nhằm hạn chế nguy cơ SQL Injection.

---

# 4. YÊU CẦU MÔI TRƯỜNG

Trước khi cài đặt, cần chuẩn bị các công cụ sau:

| Công cụ | Phiên bản |
|---|---|
| Node.js | 20 trở lên |
| npm | 10 trở lên |
| PostgreSQL | 18 |
| Git | Phiên bản phù hợp với hệ điều hành |
| Visual Studio Code | Phiên bản hiện hành |
| pgAdmin 4 | Phiên bản tương thích PostgreSQL 18 |

Phiên bản môi trường đã được ghi nhận trong quá trình phát triển:

- Node.js: 24.12.0
- npm: 11.6.2
- PostgreSQL: 18.6
- Git: 2.56.0.windows.2

Các phiên bản trên là môi trường đã được ghi nhận, không phải yêu cầu bắt buộc duy nhất.

## 4.1. Kiểm tra công cụ đã cài đặt

Mở Windows CMD hoặc Terminal trong Visual Studio Code:

```cmd
node -v
npm -v
git --version
```

Kiểm tra PostgreSQL:

```cmd
psql --version
```

Nếu CMD không nhận lệnh `psql`, có thể sử dụng pgAdmin 4 để quản lý cơ sở dữ liệu.

---

# 5. TẢI SOURCE CODE

## 5.1. Clone repository

Mở Windows CMD hoặc Terminal trong Visual Studio Code.

Di chuyển đến thư mục muốn lưu dự án, sau đó chạy:

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

Nếu lệnh `code .` không hoạt động, mở Visual Studio Code, chọn:

**File → Open Folder**

Sau đó chọn thư mục dự án vừa tải về.

## 5.2. Kiểm tra cấu trúc thư mục

Sau khi clone, thư mục gốc cần có các thành phần chính:

```text
smartcrm-2374802010207-warranty-claim-intake/
│
├── docs/
├── src/
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

Mở pgAdmin 4.

Kết nối đến PostgreSQL 18 bằng tài khoản PostgreSQL đã được tạo trong quá trình cài đặt.

Thông tin kết nối mặc định thường sử dụng:

```text
Host: localhost
Port: 5432
Username: postgres
```

Mật khẩu sử dụng mật khẩu PostgreSQL được thiết lập trên máy tính.

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

Hoặc tạo database bằng SQL:

Mở Query Tool kết nối đến database `postgres`, chạy:

```sql
CREATE DATABASE smart_crm;
```

Nếu database `smart_crm` đã tồn tại thì không cần tạo lại.

**Lưu ý:** Không chạy câu lệnh `CREATE DATABASE` trong Windows CMD. Đây là câu lệnh SQL, cần thực hiện trong pgAdmin Query Tool hoặc thông qua PostgreSQL CLI.

## 6.3. Cấu trúc database

Sau khi Backend khởi động thành công, hệ thống tự động thực thi các migration để tạo bảng và dữ liệu mẫu.

Không cần tự tạo thủ công năm bảng.

---

# 7. CẤU HÌNH BACKEND

## 7.1. Tạo file `.env`

Tại thư mục gốc dự án, mở Terminal và chạy:

```cmd
copy .env.example .env
```

Nếu file `.env` đã tồn tại thì không cần tạo lại hoặc ghi đè.

## 7.2. Tạo AUTH_SECRET

Backend yêu cầu khóa bí mật `AUTH_SECRET` có độ dài tối thiểu 32 ký tự.

Mở CMD tại thư mục dự án và chạy:

```cmd
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Node.js sẽ tạo ra một chuỗi ngẫu nhiên.

Sao chép chuỗi vừa tạo để sử dụng trong file `.env`.

Không chia sẻ chuỗi này và không đưa lên GitHub.

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
DB_PASSWORD=your_postgres_password
DB_NAME=smart_crm

APP_USER=nhanvien
APP_PASSWORD=your_app_password

AUTH_SECRET=paste_generated_secret_here
LOG_LEVEL=INFO
```

Giải thích các biến môi trường:

| Biến | Ý nghĩa |
|---|---|
| PORT | Cổng chạy Backend |
| DB_HOST | Địa chỉ máy chủ PostgreSQL |
| DB_PORT | Cổng kết nối PostgreSQL |
| DB_USER | Tài khoản PostgreSQL |
| DB_PASSWORD | Mật khẩu PostgreSQL |
| DB_NAME | Tên database |
| APP_USER | Tài khoản đăng nhập ứng dụng |
| APP_PASSWORD | Mật khẩu đăng nhập ứng dụng |
| AUTH_SECRET | Khóa bí mật ký và xác minh token |
| LOG_LEVEL | Mức ghi log |

Thay các giá trị minh họa bằng thông tin thực tế:

- `DB_PASSWORD`: Mật khẩu PostgreSQL trên máy đang cài đặt.
- `APP_USER`: Tài khoản đăng nhập ứng dụng do người triển khai thiết lập.
- `APP_PASSWORD`: Mật khẩu đăng nhập ứng dụng do người triển khai thiết lập.
- `AUTH_SECRET`: Chuỗi ngẫu nhiên được tạo ở bước 7.2.

**Lưu ý quan trọng:**

1. `DB_PASSWORD` là mật khẩu tài khoản PostgreSQL, không phải mật khẩu đăng nhập ứng dụng.
2. `APP_USER` và `APP_PASSWORD` là thông tin đăng nhập ứng dụng được cấu hình qua biến môi trường.
3. `AUTH_SECRET` không được để trống và phải có tối thiểu 32 ký tự.
4. Không sử dụng nguyên các giá trị minh họa nếu chưa thay bằng thông tin thực tế.
5. Không đưa file `.env` lên GitHub.

---

# 8. CÀI ĐẶT VÀ KHỞI ĐỘNG BACKEND

## 8.1. Cài đặt thư viện

Tại Terminal thứ nhất, bảo đảm đang ở thư mục gốc dự án:

```cmd
npm install
```

Lệnh này cài đặt các dependencies được khai báo trong `package.json`.

## 8.2. Khởi động Backend

Chạy:

```cmd
npm start
```

Khi khởi động, Backend thực hiện:

1. Đọc cấu hình từ `.env`.
2. Kiểm tra cấu hình cần thiết.
3. Kết nối PostgreSQL.
4. Đọc các file migration.
5. Tạo cấu trúc bảng nếu chưa tồn tại.
6. Khởi tạo dữ liệu mẫu.
7. Khởi động Express Server.

Các file migration:

```text
src/db/migrations/
├── 001_create_tables.sql
└── 002_seed.sql
```

Kết quả khởi động mong đợi:

```text
Đã chạy migration 001_create_tables.sql
Đã chạy migration 002_seed.sql
Khởi tạo cơ sở dữ liệu PostgreSQL thành công.
Server CRM đang chạy
http://localhost:3001
```

Backend chạy tại:

```text
http://localhost:3001
```

Giữ Terminal thứ nhất hoạt động trong suốt quá trình sử dụng hệ thống.

**Lưu ý:** Nếu cổng 3001 đã được chương trình khác sử dụng, cần giải phóng cổng hoặc điều chỉnh biến `PORT` trong `.env` và cấu hình kết nối tương ứng của Frontend.

---

# 9. CÀI ĐẶT VÀ KHỞI ĐỘNG FRONTEND

## 9.1. Cài đặt thư viện Frontend

Mở Terminal thứ hai trong Visual Studio Code.

Tại thư mục gốc dự án, chạy:

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

Mở trình duyệt và truy cập địa chỉ trên.

## 9.3. Tổng kết chạy hệ thống

Cần mở đồng thời hai Terminal:

| Terminal | Lệnh | Chức năng |
|---|---|---|
| Terminal 1 | `npm start` | Khởi động Backend |
| Terminal 2 | `npm run dev --prefix src/frontend` | Khởi động Frontend |

Backend phải hoạt động trước khi sử dụng các chức năng cần gọi API.

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

Kết quả mong đợi:

```json
{
  "status": "ok",
  "requestId": "..."
}
```

Trong đó:

- `status`: Trạng thái hoạt động của Backend.
- `requestId`: Mã định danh của request.

Nếu nhận được phản hồi trên, Backend đã hoạt động và Health Check API có thể truy cập.

## 10.2. Kiểm tra Frontend

Mở trình duyệt:

```text
http://localhost:5173
```

Giao diện Smart CRM – Mekong Mobile sẽ được hiển thị.

## 10.3. Kiểm tra nghiệp vụ

Thực hiện thử quy trình:

1. Đăng nhập bằng tài khoản đã cấu hình trong `.env`.
2. Tra cứu khách hàng bằng số điện thoại mẫu.
3. Tra cứu thiết bị bằng Serial/IMEI.
4. Kiểm tra tình trạng bảo hành.
5. Nhập mô tả lỗi.
6. Chọn nhóm sự cố.
7. Chọn mức ưu tiên.
8. Tạo phiếu bảo hành.
9. Kiểm tra phiếu vừa tạo trong danh sách.

---

# 11. HƯỚNG DẪN SỬ DỤNG CHỨC NĂNG

Hệ thống hiện có ba màn hình nghiệp vụ chính.

## 11.1. Màn hình tra cứu

Chức năng:

- Tra cứu khách hàng theo số điện thoại.
- Tra cứu thiết bị theo Serial/IMEI.
- Kiểm tra tình trạng bảo hành.
- Chuyển sang màn hình tiếp nhận phiếu.

Luồng thực hiện:

```text
Nhập số điện thoại
        |
        v
Tra cứu khách hàng
        |
        v
Nhập Serial / IMEI
        |
        v
Tra cứu thiết bị
        |
        v
Kiểm tra tình trạng bảo hành
        |
        v
Tiếp tục tạo phiếu
```

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

Mặc định: Trung bình.

### Thời gian SLA

| Mức ưu tiên | Thời gian SLA |
|---|---:|
| Cao | 24 giờ |
| Trung bình | 72 giờ |
| Thấp | 120 giờ |

Hạn cam kết được hệ thống tự động tính toán theo mức ưu tiên.

Không cho phép người dùng tự sửa hạn cam kết.

Nếu hạn cam kết rơi vào Chủ nhật, hệ thống dời sang cùng giờ Thứ Hai.

## 11.3. Màn hình danh sách phiếu

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

Số lượng hiển thị mặc định: 20 phiếu/trang.

Khi không có kết quả phù hợp, giao diện hiển thị:

```text
Không có phiếu phù hợp
```

---

# 12. TÀI KHOẢN ĐĂNG NHẬP VÀ DỮ LIỆU MẪU

## 12.1. Tài khoản đăng nhập

Tài khoản ứng dụng được thiết lập trong file `.env`:

```env
APP_USER=nhanvien
APP_PASSWORD=your_app_password
```

Người triển khai sử dụng chính giá trị đã cấu hình để đăng nhập.

Ví dụ:

- Tên đăng nhập: `nhanvien`
- Mật khẩu: Giá trị `APP_PASSWORD` do người triển khai thiết lập.

Đây không phải tài khoản khách hàng và không được tạo từ dữ liệu seed PostgreSQL.

Không công khai mật khẩu thực tế trong README.

## 12.2. Dữ liệu mẫu

Dữ liệu mẫu được khởi tạo từ file:

```text
src/db/migrations/002_seed.sql
```

README hiện ghi nhận các dữ liệu mẫu sau:

| Khách hàng | Số điện thoại | Serial / IMEI | Tình trạng |
|---|---|---|---|
| Nguyễn Văn An | 0912345678 | SN-A001-2026 | Còn bảo hành |
| Trần Thị Bình | 0987654321 | 356938035643809 | Hết bảo hành |
| Lê Hoàng Cường | 0901234567 | SN-C003-2026 | Chưa xác minh |

Nếu dữ liệu thực tế trong file seed thay đổi, cần cập nhật lại bảng này để bảo đảm README thống nhất với chương trình.

## 12.3. Lưu ý khi chạy lại migration

Các migration hiện tại sử dụng các câu lệnh tạo bảng và seed có xử lý dữ liệu đã tồn tại.

Không cần tự chạy lại SQL thủ công sau khi Backend đã khởi động thành công.

Không xóa database đang sử dụng nếu chưa sao lưu dữ liệu cần thiết.

---

# 13. CẤU TRÚC REPOSITORY

Cấu trúc chính:

```text
smartcrm-2374802010207-warranty-claim-intake/
│
├── docs/
│   ├── srs.md
│   ├── usecase.*
│   ├── architecture.*
│   ├── erd.*
│   ├── wireframe*.png
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

Cấu trúc trên thể hiện các thành phần chính. Các file và thư mục con khác có thể được bổ sung trong quá trình phát triển.

---

# 14. THIẾT KẾ CƠ SỞ DỮ LIỆU

Tên database:

```text
smart_crm
```

Hệ thống sử dụng năm bảng chính:

| Bảng | Chức năng |
|---|---|
| customer | Lưu thông tin khách hàng |
| device | Lưu thông tin thiết bị |
| issue_category | Lưu danh mục nhóm sự cố |
| ticket | Lưu thông tin phiếu bảo hành |
| ticket_status_log | Lưu lịch sử thay đổi trạng thái |

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

Không tạo thêm `ticket.customer_id` để tránh dư thừa dữ liệu.

## 14.2. Migration

Các file migration:

```text
src/db/migrations/001_create_tables.sql
src/db/migrations/002_seed.sql
```

- `001_create_tables.sql`: Khởi tạo các bảng và cấu trúc dữ liệu.
- `002_seed.sql`: Khởi tạo danh mục sự cố và dữ liệu mẫu.

Backend tự thực hiện migration khi khởi động bằng lệnh:

```cmd
npm start
```

Khi thay đổi cấu trúc database trong tương lai, nên tạo migration mới thay vì sửa migration đã được sử dụng.

---

# 15. REST API

Các API được sử dụng để giao tiếp giữa Frontend và Backend.

## 15.1. Xác thực

Hai endpoint không yêu cầu token:

```http
GET /health
POST /auth/login
```

Các API còn lại yêu cầu token xác thực.

Header:

```http
Authorization: Bearer <token>
```

Nếu token thiếu hoặc không hợp lệ, Backend trả về:

```text
401 Unauthorized
```

## 15.2. Danh sách API chính

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/health` | Kiểm tra trạng thái Backend |
| POST | `/auth/login` | Đăng nhập |
| GET | `/customers?phone=` | Tra cứu khách hàng |
| POST | `/customers` | Tạo khách hàng |
| GET | `/devices?serial=` | Tra cứu thiết bị |
| POST | `/devices` | Tạo thiết bị |
| GET | `/categories` | Lấy danh mục nhóm sự cố |
| GET | `/tickets` | Lấy danh sách phiếu |
| POST | `/tickets` | Tạo phiếu |
| GET | `/tickets/:id` | Xem chi tiết phiếu |
| PATCH | `/tickets/:id` | Cập nhật phiếu |
| DELETE | `/tickets/:id` | Đóng phiếu |

Lưu ý: Endpoint DELETE thực hiện nghiệp vụ đóng phiếu, không xóa vật lý bản ghi khỏi database.

## 15.3. Kiểm tra API bằng cURL

Kiểm tra Health Check:

```cmd
curl http://localhost:3001/health
```

Đăng nhập:

```cmd
curl -X POST http://localhost:3001/auth/login -H "Content-Type: application/json" -d "{\"username\":\"nhanvien\",\"password\":\"your_app_password\"}"
```

Sau khi đăng nhập thành công, sử dụng token trả về để gọi các API yêu cầu xác thực.

Có thể sử dụng Postman để kiểm tra các endpoint khác.

---

# 16. XÁC THỰC NGƯỜI DÙNG

Hệ thống đã triển khai Authentication – xác thực người dùng bằng token.

## 16.1. Luồng đăng nhập

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
Trả token
        |
        v
Frontend lưu token
        |
        v
Gửi Bearer token khi gọi API
```

Tài khoản và mật khẩu được cấu hình thông qua:

```env
APP_USER=nhanvien
APP_PASSWORD=your_app_password
```

## 16.2. Xử lý token hết hạn

Frontend xử lý HTTP 401 theo luồng:

```text
API trả về 401
        |
        v
Xóa token
        |
        v
Phát sự kiện phiên đăng nhập hết hạn
        |
        v
Thông báo người dùng
        |
        v
Yêu cầu đăng nhập lại
```

## 16.3. Phân biệt Authentication và Authorization

- **Authentication:** Xác thực người dùng đã được triển khai.
- **Authorization:** Phân quyền theo vai trò chưa hoàn thành.

Không đồng nhất hai chức năng này.

---

# 17. KIỂM THỬ BACKEND

Backend sử dụng Jest.

## 17.1. Chạy kiểm thử

Tại thư mục gốc dự án:

```cmd
npm test -- --runInBand
```

## 17.2. Các nhóm kiểm thử

Các nhóm kiểm thử được ghi nhận trong dự án:

- Chuẩn hóa số điện thoại.
- Tính SLA.
- Tính hạn cam kết.
- Kiểm tra bảo hành.
- Xử lý phiếu sắp hạn và quá hạn.
- Xác thực token.
- Ticket mapper.
- Service nghiệp vụ.
- Repository và middleware.

Các test nghiệp vụ được thiết kế để kiểm tra logic mà không yêu cầu kết nối database thật đối với những trường hợp không cần truy cập database.

## 17.3. Kết quả kiểm thử đã ghi nhận

Kết quả tại môi trường phát triển:

```text
Test Suites: 9 passed, 9 total
Tests:       42 passed, 42 total
Snapshots:   0 total
```

Đây là kết quả đã được ghi nhận trong quá trình phát triển. Khi kiểm thử trên môi trường khác, cần chạy lại lệnh Jest để xác nhận.

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

## 19.1. Lỗi không kết nối được PostgreSQL

Biểu hiện:

```text
ECONNREFUSED
```

Nguyên nhân có thể:

- PostgreSQL chưa khởi động.
- Sai DB_HOST.
- Sai DB_PORT.
- PostgreSQL không lắng nghe tại cổng cấu hình.

Cách xử lý:

1. Kiểm tra PostgreSQL 18 đang hoạt động.
2. Kiểm tra Host và Port trong `.env`.
3. Kiểm tra cấu hình kết nối bằng pgAdmin.
4. Khởi động lại Backend.

## 19.2. Lỗi sai mật khẩu PostgreSQL

Biểu hiện:

```text
password authentication failed
```

Nguyên nhân: `DB_PASSWORD` không khớp mật khẩu tài khoản PostgreSQL.

Cách xử lý:

- Mở `.env`.
- Kiểm tra `DB_USER`.
- Kiểm tra `DB_PASSWORD`.
- Lưu file và chạy lại Backend.

## 19.3. Lỗi AUTH_SECRET

Biểu hiện:

```text
AUTH_SECRET
```

Backend không khởi động do thiếu hoặc cấu hình không hợp lệ.

Cách xử lý:

Chạy lại lệnh tạo secret:

```cmd
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Cập nhật giá trị mới vào `.env`.

Đảm bảo secret có ít nhất 32 ký tự.

## 19.4. Lỗi database không tồn tại

Biểu hiện:

```text
database does not exist
```

Cách xử lý:

- Mở pgAdmin.
- Kiểm tra database đã tạo chưa.
- Kiểm tra `DB_NAME` trong `.env`.
- Đảm bảo tên database là `smart_crm` hoặc đúng tên database đã tạo.

## 19.5. Lỗi cổng 3001 đã được sử dụng

Biểu hiện:

```text
EADDRINUSE
```

Nguyên nhân: Một chương trình khác đang sử dụng cổng 3001.

Cách xử lý:

- Đóng tiến trình Backend cũ nếu còn hoạt động.
- Hoặc đổi `PORT` trong `.env` và điều chỉnh cấu hình URL Backend tương ứng ở Frontend.

## 19.6. Frontend không kết nối được Backend

Kiểm tra:

1. Backend đã chạy chưa.
2. Backend có hoạt động tại `http://localhost:3001` không.
3. API Health Check có trả về trạng thái `ok` không.
4. Cấu hình URL Backend trong Frontend có đúng không.

Kiểm tra bằng:

```cmd
curl http://localhost:3001/health
```

## 19.7. Lỗi đăng nhập

Kiểm tra:

- `APP_USER` trong `.env`.
- `APP_PASSWORD` trong `.env`.
- Backend đã được khởi động lại sau khi thay đổi `.env` chưa.

Tài khoản đăng nhập ứng dụng sử dụng thông tin cấu hình trong `.env`, không sử dụng mật khẩu PostgreSQL.

## 19.8. Lỗi không tìm thấy lệnh npm hoặc node

Cài đặt Node.js phiên bản 20 trở lên.

Sau khi cài đặt, đóng và mở lại CMD:

```cmd
node -v
npm -v
```

## 19.9. Lỗi thiếu thư viện

Tại thư mục gốc dự án, chạy:

```cmd
npm install
```

Cài đặt lại thư viện Frontend:

```cmd
npm install --prefix src/frontend
```

Không xóa hoặc chỉnh sửa package-lock.json tùy tiện khi chỉ cần cài đặt dependencies.

---

# 20. TRẠNG THÁI THỰC HIỆN

## 20.1. Các chức năng đã triển khai

- [x] Backend Express.
- [x] Kiến trúc Routes → Services → Repositories.
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
- [x] Ba màn hình nghiệp vụ chính.
- [x] Gọi API từ Frontend.
- [x] Đăng nhập và xác thực bằng token.
- [x] Xử lý token hết hạn / HTTP 401.
- [x] Loading / Empty / Error state.
- [x] Kiểm thử Backend bằng Jest.
- [x] Tài liệu README và tài liệu thiết kế.

## 20.2. Chức năng chưa hoàn thành

- [ ] QT-11 – Phân quyền theo vai trò (Authorization).

QT-11 yêu cầu kiểm tra quyền tại Backend theo vai trò.

Hiện tại hệ thống đã có Authentication (xác thực người dùng), nhưng Authorization (phân quyền theo vai trò) chưa hoàn thiện.

Do đó, QT-11 được ghi nhận là chưa hoàn thành và không đánh dấu hoàn tất cho đến khi Backend thực hiện kiểm tra quyền thực tế.

---

# 21. TÀI LIỆU THIẾT KẾ VÀ MINH CHỨNG

Các tài liệu thiết kế được lưu trong thư mục:

```text
docs/
```

Các tài liệu chính:

| Tài liệu | Nội dung |
|---|---|
| `srs.md` | Đặc tả yêu cầu phần mềm |
| `usecase.*` | Sơ đồ Use Case |
| `architecture.*` | Thiết kế kiến trúc hệ thống |
| `erd.*` | Mô hình dữ liệu |
| `wireframe*.png` | Thiết kế giao diện |
| `e2e-luong-chinh.md` | Mô tả kiểm thử luồng chính |
| `e2e-*.png` | Ảnh minh chứng |
| `thay-doi-thiet-ke.md` | Nhật ký thay đổi thiết kế |
| `ai-disclosure.md` | Khai báo sử dụng công cụ AI |
| `C5_truoc_migration.png` | Minh chứng dữ liệu trước migration |
| `C5_sau_migration.png` | Minh chứng dữ liệu sau migration |

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

Khi triển khai ở môi trường khác, cần cấu hình lại các biến môi trường phù hợp với máy chủ và cơ sở dữ liệu thực tế.

---

# THÔNG TIN DỰ ÁN

**Warranty App – Smart CRM**

Hệ thống tiếp nhận và quản lý yêu cầu bảo hành cho Mekong Mobile.

**Đồ án:** Chuyên đề tốt nghiệp 1
**Chuyên ngành:** Software Engineering (SE)
**Repository:** https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake