# Warranty App – Smart CRM

## 1. Thông tin đề tài

- **Tên đề tài:** Hệ thống tiếp nhận và quản lý yêu cầu bảo hành.
- **Dự án:** Smart CRM – Mekong Mobile.
- **Track:** Software Engineering (SE).
- **Repository:** `smartcrm-2374802010207-warranty-claim-intake`.
- **Chức năng chính:** Tiếp nhận, tra cứu, cập nhật và quản lý phiếu bảo hành.

## 2. Yêu cầu môi trường

- Node.js và npm.
- PostgreSQL.
- pgAdmin để quản lý cơ sở dữ liệu.
- Visual Studio Code để chỉnh sửa mã nguồn.
- Git để quản lý phiên bản.

### Công nghệ sử dụng

- **Backend:** Node.js, Express.js.
- **Database:** PostgreSQL.
- **Kết nối database:** Thư viện `pg`.
- **API:** REST API.
- **Quản lý mã nguồn:** Git và GitHub.
- **Thiết kế sơ đồ:** diagrams.net (draw.io).

### Cấu hình môi trường

Tạo và cấu hình file `.env` theo mẫu `.env.example`, bao gồm các biến môi trường phù hợp với mã nguồn:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=smart_crm
```


### Cài đặt và chạy ứng dụng

Mở terminal tại thư mục gốc của repository và thực hiện:

```powershell
npm install
node src/app.js
```

Sau khi ứng dụng khởi động thành công, API mặc định được truy cập tại:

`http://127.0.0.1:3000`

Nếu dự án đã cấu hình script `start` trong `package.json`, có thể sử dụng `npm start`.

## 3. Cấu trúc repository

```text
smartcrm-2374802010207-warranty-claim-intake/
├── db/
│   └── schema.sql
├── docs/
│   ├── srs.md
│   ├── usecase.drawio / usecase.png
│   ├── architecture.drawio / architecture.png
│   ├── erd.drawio / erd.png
│   ├── wireframe01.png, wireframe02.png, wireframe03.png
│   ├── thay-doi-thiet-ke.md
│   ├── ai-declaration.md
│   ├── kq-*.png, api-get-tickets.png   (ảnh kết quả kiểm thử)
│   └── export/
├── src/
│   ├── app.js
│   ├── db/
│   │   └── index.js
│   ├── repositories/
│   │   └── ticketRepository.js
│   ├── services/
│   │   └── ticketService.js
│   ├── routes/
│   │   └── tickets.js
│   └── utils/
│       ├── AppError.js
│       └── sla.js
├── tests/
├── BT1_2374802010207_BuiHoangKhang.pdf
├── .env.example
├── .gitignore
├── package.json
└── README.md
```


## 4. Cơ sở dữ liệu

Database sử dụng PostgreSQL với tên `smart_crm`.

Hệ thống gồm 5 bảng chính:

| Bảng | Chức năng |
|---|---|
| `customer` | Lưu thông tin khách hàng. |
| `device` | Lưu thông tin thiết bị của khách hàng. |
| `issue_category` | Quản lý danh mục loại lỗi bảo hành. |
| `ticket` | Lưu thông tin phiếu bảo hành. |
| `ticket_status_log` | Ghi nhận lịch sử thay đổi trạng thái phiếu. |

Các bảng được liên kết bằng khóa chính và khóa ngoại nhằm bảo đảm tính nhất quán của dữ liệu.

## 5. Chức năng hệ thống

### 5.1. Tiếp nhận phiếu bảo hành

- Tiếp nhận thông tin thiết bị và mô tả lỗi.
- Xác định loại lỗi và mức độ ưu tiên.
- Sinh mã phiếu bảo hành.
- Tính hạn cam kết xử lý theo mức ưu tiên.
- Gán trạng thái ban đầu là `Mới`.
- Ghi nhận lịch sử trạng thái khi tạo phiếu.

### 5.2. Tra cứu phiếu bảo hành

- Lấy danh sách phiếu bảo hành.
- Tra cứu phiếu theo ID.
- Lọc danh sách theo trạng thái, loại lỗi và mức độ ưu tiên.
- Hỗ trợ phân trang danh sách phiếu.

### 5.3. Cập nhật và đóng phiếu

- Cập nhật thông tin phân loại và mức độ ưu tiên.
- Cập nhật trạng thái xử lý.
- Ghi nhận lịch sử khi trạng thái thay đổi.
- Đóng phiếu bảo hành thông qua API tương ứng.

Các chức năng được triển khai theo từng giai đoạn và cần được kiểm thử trước khi xác nhận hoàn thành.

## 6. API và kiểm thử

Các API phiếu bảo hành được tổ chức dưới đường dẫn `/tickets`.

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| GET | `/tickets` | Lấy danh sách phiếu. |
| POST | `/tickets` | Tạo phiếu bảo hành. |
| GET | `/tickets/:id` | Lấy chi tiết phiếu. |
| PATCH | `/tickets/:id` | Cập nhật phiếu. |
| DELETE | `/tickets/:id` | Đóng phiếu bảo hành theo logic nghiệp vụ hiện tại. |

### Kết quả kiểm thử đã thực hiện

- **GET `/tickets`:** Trả về HTTP `200 OK`.
- **POST `/tickets`:** Trả về HTTP `201 Created`.
- Đã tạo thành công phiếu bảo hành có ID `1`, trạng thái ban đầu `Mới`.

### Kiểm thử bằng PowerShell

Lấy danh sách phiếu:

```powershell
curl.exe -i http://127.0.0.1:3000/tickets
```

Tạo phiếu bảo hành:

```powershell
curl.exe -i -X POST http://127.0.0.1:3000/tickets -H "Content-Type: application/json" -d "@body.json"
```

Nội dung file `body.json` dùng để kiểm thử:

```json
{
  "deviceId": 1,
  "categoryId": 1,
  "description": "Man hinh bi soc",
  "priority": "Cao"
}
```

Yêu cầu tạo phiếu thành công cần có thiết bị với ID `1` và danh mục lỗi với ID `1` trong database.

## 7. Tài liệu thiết kế

Các tài liệu phục vụ phân tích và thiết kế phần mềm gồm:

- `docs/srs.md`: Đặc tả yêu cầu phần mềm.
- `docs/usecase.drawio`: Sơ đồ Use Case.
- `docs/architecture.drawio`: Sơ đồ kiến trúc hệ thống.
- `docs/erd.drawio`: Sơ đồ thực thể – liên kết dữ liệu.
- `docs/wireframe01.png`, `wireframe02.png`, `wireframe03.png`: Wireframe ba màn hình.
- `docs/thay-doi-thiet-ke.md`: Ghi nhận các thay đổi thiết kế theo nhận xét.
- `BT1_2374802010207_BuiHoangKhang.pdf`: Báo cáo BT1 nộp bài.
- `db/schema.sql`: Cấu trúc cơ sở dữ liệu.
- `docs/ai-declaration.md`: Khai báo sử dụng công cụ AI.
- `docs/*.png`: Ảnh xuất từ các sơ đồ và ảnh kết quả kiểm thử; `docs/export/` lưu bản xuất wireframe.

Các file `.drawio` có thể mở và chỉnh sửa bằng diagrams.net:

https://app.diagrams.net/

Cần bảo đảm nội dung tài liệu, sơ đồ, SQL DDL và cấu trúc database thực tế nhất quán với nhau.

## 8. Trạng thái thực hiện

- [x] Hoàn thành phần giới thiệu repository.
- [x] Có 5 bảng database chính.
- [x] API GET `/tickets` trả về HTTP 200.
- [x] API POST `/tickets` trả về HTTP 201.
- [x] Kiểm tra lịch sử trạng thái trong `ticket_status_log`.
- [x] Kiểm thử API chi tiết, cập nhật và đóng phiếu.
- [ ] Hoàn thiện CRUD khách hàng và thiết bị.
- [ ] Viết unit test cho lớp service.
- [x] Rà soát SRS và sơ đồ thiết kế.
- [x] Đối chiếu ERD với SQL DDL và database thực tế.
- [x] Bổ sung ảnh sơ đồ và kết quả kiểm thử vào `docs/`.
- [x] Kiểm tra PDF BT1 đã nộp trên VLU E-learning.

**Trạng thái chung:** Dự án đã kiểm thử thành công API đọc danh sách và tạo phiếu bảo hành. Các chức năng còn lại và tài liệu thiết kế tiếp tục được hoàn thiện trước khi nộp bài.

## 9. Quản lý phiên bản

Sử dụng Git để theo dõi quá trình phát triển và lưu lại các thay đổi của dự án.

Ví dụ:

```powershell
git status
git add README.md
git commit -m "docs: README mục 2 và mục 6"
git push
```
