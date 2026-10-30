# Warranty App – Smart CRM

Hệ thống tiếp nhận và quản lý yêu cầu bảo hành cho Mekong Mobile.

**Đồ án:** Chuyên đề tốt nghiệp 1
- **Tên đề tài:** Hệ thống tiếp nhận và quản lý yêu cầu bảo hành.
- **Dự án:** Smart CRM – Mekong Mobile.
- **Track:** Software Engineering (SE).
- **Repository:** `smartcrm-2374802010207-warranty-claim-intake`.
- **Chức năng chính:** Tra cứu khách hàng và thiết bị, tiếp nhận và phân loại phiếu bảo hành, xem và lọc danh sách phiếu.

---

## 1. Giới thiệu dự án

Smart CRM – Mekong Mobile là hệ thống hỗ trợ nhân viên tiếp nhận và quản lý yêu cầu bảo hành thiết bị.

Hệ thống tập trung vào quy trình:

1. Tra cứu khách hàng.
2. Tra cứu thiết bị.
3. Kiểm tra tình trạng bảo hành.
4. Tiếp nhận yêu cầu bảo hành.
5. Phân loại nhóm sự cố.
6. Xác định mức độ ưu tiên.
7. Tính thời hạn cam kết xử lý theo SLA.
8. Quản lý, tìm kiếm và lọc danh sách phiếu bảo hành.

### Phạm vi thực hiện

**Trong phạm vi:**

- Tra cứu và tạo khách hàng.
- Ghi nhận và tra cứu thiết bị.
- Kiểm tra thời hạn bảo hành.
- Tạo phiếu bảo hành.
- Phân loại sự cố.
- Chọn mức ưu tiên.
- Tính hạn cam kết.
- Xem, lọc và phân trang danh sách phiếu.

**Ngoài phạm vi:**
- Phân công kỹ thuật viên.
- Quản lý quá trình sửa chữa.
- Quản lý linh kiện.
- Thanh toán.

---

## 2. Công nghệ sử dụng

| Thành phần                 | Công nghệ          |
| -------------------------- | ------------------ |
| Backend                    | Node.js            |
| Backend Framework          | Express.js         |
| Frontend                   | React              |
| Frontend Tool              | Vite               |
| Database                   | PostgreSQL 18      |
| API                        | REST API           |
| Kiểm thử Backend           | Jest               |
| Kiểm tra mã nguồn Frontend | Oxlint             |
| Quản lý mã nguồn           | Git, GitHub        |
| IDE                        | Visual Studio Code |

### Kiến trúc Backend

Backend được tổ chức theo mô hình:

```text
Routes → Services → Repositories → Database
```

- **Routes:** Tiếp nhận HTTP request và định tuyến API.
- **Services:** Xử lý nghiệp vụ.
- **Repositories:** Thực hiện truy vấn dữ liệu.
- **Database:** Lưu trữ dữ liệu PostgreSQL.

---

## 3. Yêu cầu môi trường

Cài đặt các công cụ sau:

| Công cụ            | Phiên bản yêu cầu                  |
| ------------------ | ---------------------------------- |
| Node.js            | 20 trở lên                         |
| npm                | 10 trở lên                         |
| PostgreSQL         | 18                                 |
| Git                | Phiên bản phù hợp với hệ điều hành |
| Visual Studio Code | Phiên bản hiện hành                |

### Runtime đã được ghi nhận trong quá trình phát triển

- Node.js: 24.12.0
- npm: 11.6.2
- PostgreSQL: 18.6
- Git: 2.56.0.windows.2

Các phiên bản trên là môi trường đã được ghi nhận trong quá trình phát triển, không phải yêu cầu bắt buộc duy nhất.

---

## 4. Cài đặt và chạy dự án bằng Visual Studio Code

Các lệnh trong hướng dẫn này được thực hiện tại Terminal của Visual Studio Code. Có thể sử dụng Windows CMD hoặc PowerShell.

### 4.1. Clone repository

Mở Visual Studio Code.

Chọn **Terminal → New Terminal**.

Chạy:

```bash
git clone https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake.git
```

Di chuyển vào thư mục dự án:

```bash
cd smartcrm-2374802010207-warranty-claim-intake
```

Mở dự án trong VS Code:

```bash
code .
```

Nếu lệnh `code .` không hoạt động, chọn **File → Open Folder** và mở thư mục dự án vừa clone.

### 4.2. Tạo cơ sở dữ liệu PostgreSQL

Mở pgAdmin.

Tạo database mới với tên:

```text
smart_crm
```

Hoặc sử dụng PostgreSQL CLI:

```bash
psql -U postgres -c "CREATE DATABASE smart_crm;"
```

Nếu database đã tồn tại thì không cần tạo lại.

### 4.3. Tạo file cấu hình `.env`

Tại Terminal, bảo đảm đang đứng ở thư mục gốc dự án.

Chạy lệnh:

```bash
node -e "const fs=require('fs'); if(!fs.existsSync('.env')) fs.copyFileSync('.env.example','.env');"
```

Lệnh trên tạo file `.env` từ `.env.example` nếu file `.env` chưa tồn tại.

Mở file `.env` và cấu hình:

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

Thay các giá trị sau bằng thông tin thực tế:

- `DB_PASSWORD`: Mật khẩu PostgreSQL.
- `APP_USER`: Tài khoản đăng nhập ứng dụng.
- `APP_PASSWORD`: Mật khẩu đăng nhập ứng dụng.
- `AUTH_SECRET`: Khóa bí mật dùng để ký token.

Không đưa file `.env` chứa thông tin nhạy cảm lên GitHub.

### 4.4. Cài đặt thư viện Backend

Tại Terminal thứ nhất, ở thư mục gốc dự án:

```bash
npm install
```

### 4.5. Khởi động Backend

Chạy:

```bash
npm start
```

Backend sử dụng cổng:

```text
http://localhost:3001
```

Kiểm tra trạng thái máy chủ:

```text
http://localhost:3001/health
```

Khi khởi động, Backend tự động kết nối PostgreSQL và thực hiện các migration trong thư mục:

```text
src/db/migrations/
```

Giữ Terminal thứ nhất hoạt động trong khi sử dụng ứng dụng.

### 4.6. Cài đặt thư viện Frontend

Mở Terminal thứ hai trong Visual Studio Code.

Tại thư mục gốc dự án, chạy:

```bash
npm install --prefix src/frontend
```

### 4.7. Khởi động Frontend

Chạy:

```bash
npm run dev --prefix src/frontend
```

Frontend mặc định chạy tại:

```text
http://localhost:5173
```

Mở địa chỉ trên trình duyệt để sử dụng hệ thống.

### 4.8. Tổng kết chạy hệ thống

Cần mở đồng thời hai Terminal:

| Terminal   | Lệnh                                | Chức năng          |
| ---------- | ----------------------------------- | ------------------ |
| Terminal 1 | `npm start`                         | Khởi động Backend  |
| Terminal 2 | `npm run dev --prefix src/frontend` | Khởi động Frontend |

Backend phải hoạt động trước khi thực hiện các chức năng cần gọi API.

### 4.9. Dừng hệ thống

Tại Terminal đang chạy ứng dụng, nhấn:

```text
Ctrl + C
```

Thực hiện riêng cho Backend và Frontend.

---

## 5. Các chức năng chính

Hệ thống hiện có ba màn hình nghiệp vụ chính.

### 5.1. Màn hình tra cứu

Chức năng:

- Tra cứu khách hàng theo số điện thoại.
- Tra cứu thiết bị theo Serial/IMEI.
- Kiểm tra tình trạng bảo hành.
- Chuyển sang màn hình tiếp nhận phiếu.

Luồng nghiệp vụ:

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

Dữ liệu mẫu được khởi tạo từ migration seed.

| Khách hàng     | Số điện thoại | Serial / IMEI     | Tình trạng    |
| -------------- | ------------- | ----------------- | ------------- |
| Nguyễn Văn An  | 0912345678    | `SN-A001-2026`    | Còn bảo hành  |
| Trần Thị Bình  | 0987654321    | `356938035643809` | Hết bảo hành  |
| Lê Hoàng Cường | 0901234567    | `SN-C003-2026`    | Chưa xác minh |

### 5.2. Màn hình tiếp nhận và phân loại yêu cầu

Chức năng:

- Hiển thị thông tin khách hàng.
- Hiển thị thông tin thiết bị.
- Hiển thị tình trạng bảo hành.
- Nhập mô tả lỗi.
- Chọn nhóm sự cố.
- Chọn mức ưu tiên.
- Tính hạn cam kết.
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

Các mức ưu tiên:

```text
Cao
Trung bình
Thấp
```

Thời gian SLA:

| Mức ưu tiên | Thời gian SLA |
| ----------- | ------------: |
| Cao         |        24 giờ |
| Trung bình  |        72 giờ |
| Thấp        |       120 giờ |

### 5.3. Màn hình danh sách phiếu

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

Danh sách phiếu sử dụng dữ liệu từ Backend thông qua API.

---

## 6. Cấu trúc repository

Cấu trúc chính của dự án:

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
│   └── ai-declaration.md
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

Lưu ý: Cấu trúc trên thể hiện các thành phần chính. Các file và thư mục con khác có thể được bổ sung trong quá trình phát triển.

---

## 7. Cơ sở dữ liệu

Tên database:

```text
smart_crm
```

Hệ thống có năm bảng chính:

```text
customer
device
issue_category
ticket
ticket_status_log
```

### 7.1. Quan hệ dữ liệu

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

### 7.2. Migration

Các file migration:

```text
src/db/migrations/001_create_tables.sql
src/db/migrations/002_seed.sql
```

- `001_create_tables.sql`: Khởi tạo các bảng và cấu trúc dữ liệu.
- `002_seed.sql`: Khởi tạo danh mục sự cố và dữ liệu mẫu.

Backend tự thực hiện migration khi khởi động bằng lệnh:

```bash
npm start
```

Các migration hiện tại sử dụng những cấu trúc hỗ trợ chạy lại an toàn đối với các đối tượng và dữ liệu đã tồn tại. Khi thay đổi cấu trúc database trong tương lai, nên tạo migration mới thay vì sửa migration đã được sử dụng.

---

## 8. REST API

Các API được sử dụng để giao tiếp giữa Frontend và Backend.

### 8.1. Xác thực

Ngoại trừ hai endpoint:

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

### 8.2. Danh sách API chính

| Phương thức | Endpoint            | Chức năng                   |
| ----------- | ------------------- | --------------------------- |
| GET         | `/health`           | Kiểm tra trạng thái Backend |
| POST        | `/auth/login`       | Đăng nhập                   |
| GET         | `/customers?phone=` | Tra cứu khách hàng          |
| POST        | `/customers`        | Tạo khách hàng              |
| GET         | `/devices?serial=`  | Tra cứu thiết bị            |
| POST        | `/devices`          | Tạo thiết bị                |
| GET         | `/categories`       | Lấy danh mục nhóm sự cố     |
| GET         | `/tickets`          | Lấy danh sách phiếu         |
| POST        | `/tickets`          | Tạo phiếu                   |
| GET         | `/tickets/:id`      | Xem chi tiết phiếu          |
| PATCH       | `/tickets/:id`      | Cập nhật phiếu              |
| DELETE      | `/tickets/:id`      | Đóng phiếu                  |

### 8.3. Định dạng dữ liệu

Dữ liệu API được chuẩn hóa theo cấu trúc phản hồi của Backend.

Ví dụ:

```json
{
  "data": {}
}
```

Các thuộc tính được sử dụng ở Frontend theo quy ước camelCase.

---

## 9. Xác thực người dùng

Hệ thống đã triển khai Authentication – xác thực người dùng bằng token.

### 9.1. Luồng đăng nhập

```text
Người dùng nhập tài khoản
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

Tài khoản và mật khẩu ứng dụng được cấu hình thông qua:

```env
APP_USER=nhanvien
APP_PASSWORD=your_app_password
```

Không sử dụng thông tin mật khẩu thật trong tài liệu công khai.

### 9.2. Xử lý token hết hạn

Frontend xử lý HTTP 401:

```text
API trả về 401
        ↓
Xóa token
        ↓
Phát sự kiện phiên đăng nhập hết hạn
        ↓
Thông báo người dùng
        ↓
Yêu cầu đăng nhập lại
```

---

## 10. Xử lý trạng thái giao diện

Frontend sử dụng component `DataState` để xử lý các trạng thái:

| Trạng thái | Ý nghĩa          |
| ---------- | ---------------- |
| Loading    | Đang tải dữ liệu |
| Empty      | Không có dữ liệu |
| Error      | Xảy ra lỗi       |

Khi xảy ra lỗi, giao diện có thể cung cấp thao tác thử lại.

### Tổ chức gọi API

Các chức năng gọi API được tách riêng tại:

```text
src/frontend/src/api/
```

File `client.js` là nơi tập trung xử lý:

- URL Backend.
- Token đăng nhập.
- Header Authorization.
- Gửi HTTP request.
- Xử lý lỗi API.
- Xử lý HTTP 401.
- Thông báo lỗi tiếng Việt.

Các trang giao diện sử dụng các hàm API thay vì gọi `fetch()` trực tiếp.

---

## 11. Kiểm thử Backend

Backend sử dụng Jest.

### 11.1. Chạy kiểm thử

Tại thư mục gốc dự án:

```bash
npm test -- --runInBand
```

### 11.2. Các nhóm kiểm thử

Các nhóm kiểm thử được ghi nhận trong dự án:

- Chuẩn hóa số điện thoại.
- Tính SLA.
- Tính hạn cam kết.
- Kiểm tra bảo hành.
- Xử lý phiếu sắp hạn và quá hạn.
- Xác thực token.
- Ticket mapper.
- Service nghiệp vụ.

Các test nghiệp vụ đã được thiết kế để kiểm tra logic mà không cần kết nối database thật.

### 11.3. Kết quả kiểm thử được ghi nhận

```text
Test Suites: 7 passed, 7 total
Tests:       32 passed, 32 total
```

Kết quả trên là số liệu được ghi nhận trong quá trình phát triển; cần chạy lại lệnh kiểm thử để xác nhận trên môi trường hiện tại.

---

## 12. Build và kiểm tra Frontend

Frontend sử dụng Vite và Oxlint.

Tất cả các lệnh dưới đây được chạy tại thư mục gốc dự án.

### 12.1. Build production

```bash
npm run build --prefix src/frontend
```

### 12.2. Kiểm tra mã nguồn

```bash
npm run lint --prefix src/frontend
```

### 12.3. Preview bản build

```bash
npm run preview --prefix src/frontend
```

Các script được khai báo trong:

```text
src/frontend/package.json
```

---

## 13. Tài liệu thiết kế và minh chứng

Các tài liệu thiết kế được lưu trong thư mục:

```text
docs/
```

Các tài liệu chính:

| Tài liệu               | Nội dung                    |
| ---------------------- | --------------------------- |
| `srs.md`               | Đặc tả yêu cầu phần mềm     |
| `usecase.*`            | Sơ đồ Use Case              |
| `architecture.*`       | Thiết kế kiến trúc hệ thống |
| `erd.*`                | Mô hình dữ liệu             |
| `wireframe*.png`       | Thiết kế giao diện          |
| `e2e-luong-chinh.md`   | Mô tả kiểm thử luồng chính  |
| `e2e-*.png`            | Ảnh minh chứng              |
| `thay-doi-thiet-ke.md` | Nhật ký thay đổi thiết kế   |
| `ai-declaration.md`    | Khai báo sử dụng công cụ AI |

---

## 14. Trạng thái thực hiện

### 14.1. Các chức năng đã triển khai

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
- [x] Ba màn hình chính.
- [x] Gọi API thật từ Frontend.
- [x] Đăng nhập và xác thực bằng token.
- [x] Xử lý token hết hạn / HTTP 401.
- [x] Loading / Empty / Error state.
- [x] Luồng End-to-End.
- [x] Unit test.
- [x] Tài liệu README và tài liệu thiết kế.

### 14.2. Chức năng chưa hoàn thành

- [ ] **QT-11 – Phân quyền theo vai trò (Authorization).**

QT-11 yêu cầu kiểm tra quyền tại Backend:

```text
Nhân viên tiếp nhận
        ↓
Được tra cứu
        ↓
Được tạo phiếu

Quản lý
        ↓
Được xem danh sách
        ↓
Được lọc danh sách
        ↓
Được xem phiếu sắp hạn / quá hạn
```

Hiện tại hệ thống đã có Authentication (xác thực người dùng), nhưng Authorization (phân quyền theo vai trò) chưa hoàn thiện.

Do đó, QT-11 được ghi nhận là chưa hoàn thành và không đánh dấu hoàn tất cho đến khi Backend thực hiện kiểm tra quyền thực tế.

---

## 15. Luồng nghiệp vụ tổng thể

Luồng nghiệp vụ chính của hệ thống:

```text
Tra cứu khách hàng
        ↓
Tra cứu thiết bị
        ↓
Kiểm tra bảo hành
        ↓
Tiếp nhận yêu cầu
        ↓
Phân loại sự cố
        ↓
Chọn mức ưu tiên
        ↓
Tính thời hạn SLA
        ↓
Tạo phiếu bảo hành
        ↓
Hiển thị danh sách phiếu
        ↓
Lọc và phân trang
```

---

## 16. Git và quản lý repository

Repository:

```text
smartcrm-2374802010207-warranty-claim-intake
```

Các thay đổi được quản lý bằng Git và GitHub.

### 16.1. Kiểm tra trạng thái

```bash
git status
```

### 16.2. Kiểm tra lỗi khoảng trắng và định dạng diff

```bash
git --no-pager diff --check
```

### 16.3. Chạy kiểm thử trước khi commit

```bash
npm test -- --runInBand
```

### 16.4. Quy ước commit

Dự án sử dụng Conventional Commits.

Ví dụ:

```text
feat: bổ sung chức năng tra cứu khách hàng
fix: sửa lỗi kiểm tra thời hạn bảo hành
docs: cập nhật hướng dẫn cài đặt dự án
test: bổ sung kiểm thử tính thời hạn SLA
chore: cập nhật cấu hình môi trường
refactor: tối ưu xử lý nghiệp vụ phiếu bảo hành
```

Trước khi push, cần kiểm tra:

- Các thay đổi đã được kiểm thử.
- Không đưa `.env` hoặc mật khẩu lên GitHub.
- Không đưa `node_modules/` lên repository.
- README và tài liệu thiết kế được cập nhật khi có thay đổi liên quan.
- Commit được tạo và push lên nhánh làm việc phù hợp.

---

## 17. Ghi chú bảo mật và cấu hình

Các file và thư mục không nên đưa lên GitHub:

```text
node_modules/
.env
```

File `.gitignore` cần bỏ qua ít nhất:

```gitignore
node_modules/
.env
*.sqlite
src/frontend/dist/
```

File `.env.example` chỉ chứa tên biến và giá trị mẫu, không chứa mật khẩu hoặc khóa bí mật thật.

Khi triển khai ở môi trường khác, cần cấu hình lại các biến môi trường phù hợp với máy chủ và cơ sở dữ liệu thực tế.

---

**Smart CRM – Mekong Mobile**
**Chuyên đề tốt nghiệp 1 – Software Engineering (SE)**
