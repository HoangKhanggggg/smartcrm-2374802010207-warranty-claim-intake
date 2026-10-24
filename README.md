# Warranty App – Smart CRM

## 1. Thông tin đề tài

- **Tên đề tài:** Hệ thống tiếp nhận và quản lý yêu cầu bảo hành.
- **Dự án:** Smart CRM – Mekong Mobile.
- **Track:** Software Engineering (SE).
- **Repository:** `smartcrm-2374802010207-warranty-claim-intake`.
- **Chức năng chính:** Tra cứu khách hàng và thiết bị, tiếp nhận phiếu bảo hành, xem và lọc danh sách phiếu.

## 2. Yêu cầu môi trường

- Node.js 20 trở lên (kèm npm).
- PostgreSQL 14 trở lên, có tài khoản `postgres` / mật khẩu `123456` (hoặc sửa trong `.env`).
- Git.

Công nghệ: Express.js + `pg` (backend), PostgreSQL, React + Vite (frontend), Jest (unit test).

## 3. Các bước dựng hệ thống (mỗi bước một lệnh)

Chạy từ thư mục gốc của repository. Trên Windows PowerShell, thay `cp` bằng `copy`.

| Bước | Lệnh | Kết quả mong đợi |
|---|---|---|
| 1. Tải mã nguồn | `git clone https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake.git && cd smartcrm-2374802010207-warranty-claim-intake` | Có thư mục dự án |
| 2. Tạo file cấu hình | `cp .env.example .env` | Có file `.env` (backend chạy cổng 3001) |
| 3. Tạo cơ sở dữ liệu | `psql -U postgres -c "CREATE DATABASE smart_crm;"` | `CREATE DATABASE` (hoặc tạo bằng pgAdmin) |
| 4. Cài thư viện backend | `npm install` | Không báo lỗi |
| 5. Chạy backend (tự tạo bảng và nạp dữ liệu mẫu) | `npm start` | In `Server CRM đang chạy tại http://localhost:3001` |
| 6. Cài thư viện frontend (terminal mới) | `npm install --prefix src/frontend` | Không báo lỗi |
| 7. Chạy frontend | `npm run dev --prefix src/frontend` | Mở được `http://localhost:5173` |
| 8. Chạy unit test | `npm test` | Dòng `Tests: N passed` |

Đăng nhập bằng tài khoản mẫu: **nhanvien / 123456** (đổi trong `.env`: `APP_USER`, `APP_PASSWORD`).

Nếu đổi cổng backend, đặt `VITE_API_URL=http://localhost:<cổng>` khi chạy frontend.

### Chạy thử luồng chính trên giao diện

Dữ liệu mẫu có sẵn (được nạp tự động ở bước 5):

| Khách hàng | Số điện thoại | Serial / IMEI | Bảo hành |
|---|---|---|---|
| Nguyễn Văn An | 0912345678 | `SN-A001-2026` | Còn bảo hành |
| Trần Thị Bình | 0987654321 | `356938035643809` | Hết bảo hành |
| Lê Hoàng Cường | 0901234567 | `SN-C003-2026` | Chưa xác minh |

1. Đăng nhập → màn **1. Tra cứu**: nhập `+84 901.234.567` → **Tra cứu khách** → nhập `SN-C003-2026` → **Tra cứu thiết bị**.
2. **Tiếp tục tạo phiếu** → màn **2. Tiếp nhận**: nhập mô tả lỗi, chọn nhóm sự cố và mức ưu tiên → **Tạo phiếu bảo hành**.
3. **Xem danh sách phiếu** → màn **3**: phiếu mới nằm đầu danh sách; thử các bộ lọc.

Ảnh minh chứng toàn luồng: `docs/e2e-*.png`; biên bản chạy: `docs/e2e-luong-chinh.md`.

## 4. Cấu trúc repository

```text
.
├── db/schema.sql                  # DDL gốc từ BT1
├── docs/                          # SRS, sơ đồ, wireframe, ảnh kết quả, nhật ký thay đổi thiết kế
├── src/
│   ├── app.js                     # Khởi động Express, đăng ký route
│   ├── db/                        # Kết nối PostgreSQL + migrations/ (001 bảng, 002 dữ liệu mẫu)
│   ├── middleware/requireAuth.js  # Kiểm tra token, trả 401
│   ├── routes/                    # tickets.js, lookup.js (khách/thiết bị/nhóm sự cố), auth.js
│   ├── services/                  # Quy tắc nghiệp vụ (ticketService, lookupService)
│   ├── repositories/              # Truy vấn SQL
│   ├── utils/                     # sla (QT-04), phone (QT-02), warranty (QT-05), due (QT-13), auth, mapper
│   └── frontend/                  # React + Vite
│       └── src/{api,components,hooks,pages}
├── tests/                         # Unit test (Jest)
├── .env.example
└── package.json
```

## 5. Cơ sở dữ liệu

Database `smart_crm` gồm 5 bảng: `customer`, `device`, `issue_category`, `ticket`, `ticket_status_log`.
Khi chạy `npm start`, hệ thống chạy lần lượt các file trong `src/db/migrations/`; các lệnh đều idempotent nên chạy lại không nhân đôi dữ liệu.

## 6. API

Mọi API (trừ `/health` và `/auth/login`) cần header `Authorization: Bearer <token>`; thiếu hoặc sai token trả `401`.
Dữ liệu trả về bọc trong `{ "data": ... }`, khoá dạng camelCase (hợp đồng mô tả trong `src/utils/ticketMapper.js`).

| Phương thức | Endpoint | Chức năng |
|---|---|---|
| POST | `/auth/login` | Đăng nhập, trả token |
| GET | `/customers?phone=` | Tra khách theo SĐT (chuẩn hoá về 10 chữ số) |
| POST | `/customers` | Tạo khách mới (SĐT đã có thì trả hồ sơ cũ) |
| GET | `/devices?serial=` | Tra thiết bị kèm `warrantyStatus` |
| POST | `/devices` | Đăng ký thiết bị cho khách |
| GET | `/categories` | Danh mục nhóm sự cố |
| GET | `/tickets` | Danh sách phiếu (20/trang, lọc `status`, `categoryId`, `priority`, `page`) |
| POST | `/tickets` | Tạo phiếu |
| GET | `/tickets/:id` | Chi tiết phiếu |
| PATCH | `/tickets/:id` | Cập nhật phân loại, ưu tiên, trạng thái |
| DELETE | `/tickets/:id` | Đóng phiếu (không xoá vật lý) |

## 7. Kiểm thử

```bash
npm test
```

Các test tập trung vào lớp nghiệp vụ, không cần cơ sở dữ liệu thật: chuẩn hoá SĐT (QT-02), hạn cam kết (QT-04), bảo hành (QT-05), phiếu sắp/quá hạn (QT-13), token đăng nhập, mapper và các service (dùng repository giả).

## 8. Tài liệu thiết kế

- `docs/srs.md`, `docs/usecase.*`, `docs/architecture.*`, `docs/erd.*`, `docs/wireframe0*.png`.
- `docs/thay-doi-thiet-ke.md`: nhật ký điều chỉnh thiết kế (BT1 và Sprint 2, gồm các hạng mục đã cắt).
- `docs/e2e-luong-chinh.md` và `docs/e2e-*.png`: minh chứng chạy toàn luồng.
- `docs/ai-declaration.md`: khai báo sử dụng công cụ AI.

## 9. Trạng thái thực hiện

- [x] Backend 3 lớp: tickets, khách hàng, thiết bị, nhóm sự cố.
- [x] Frontend 3 màn hình gọi API thật, có đăng nhập và xử lý 401.
- [x] Ba trạng thái đang tải / rỗng / lỗi (kèm thử lại) bằng `DataState`.
- [x] Luồng chính chạy end-to-end trên dữ liệu mẫu.
- [x] Unit test cho quy tắc nghiệp vụ.
- [ ] Phân quyền theo vai trò (QT-11) – hoãn, xem `docs/thay-doi-thiet-ke.md`.
