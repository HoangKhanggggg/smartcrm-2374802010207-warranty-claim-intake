# Warranty App – Smart CRM

## 1. Thông tin đề tài

- **Tên đề tài:** Hệ thống tiếp nhận và quản lý yêu cầu bảo hành.
- **Dự án:** Smart CRM – Mekong Mobile.
- **Track:** Software Engineering (SE).
- **Repository:** `smartcrm-2374802010207-warranty-claim-intake`.

## 2. Yêu cầu môi trường
- Node.js 20 LTS, npm 10
- SQLite 3 (qua better-sqlite3, không cần cài riêng)
- Biến môi trường: xem .env.example (PORT, DB_FILE)
- Chạy: npm install && npm start (migration và seed tự chạy khi khởi động)

## 3. Cách mở file thiết kế

Các file `.drawio` có thể mở và chỉnh sửa bằng diagrams.net:

https://app.diagrams.net/

Các file `.png` có thể xem trực tiếp trên GitHub. File PDF có thể mở bằng trình đọc PDF tương thích.

## 4. Luồng thực hiện

1. Xây dựng SRS và xác định yêu cầu.
2. Thiết kế Use Case và luồng nghiệp vụ.
3. Xây dựng sơ đồ kiến trúc.
4. Thiết kế ERD và SQL DDL.
5. Thiết kế wireframe.
6. Xuất ảnh sơ đồ và tổng hợp tài liệu PDF.

## 5. Trạng thái thực hiện

- **README.md:** Đã hoàn thành phần giới thiệu đề tài và cấu trúc repository.
- **SRS (`docs/srs.md`):** Đang rà soát và hoàn thiện yêu cầu phần mềm.
- **Use Case (`docs/usecase.drawio`):** Cần kiểm tra và hoàn thiện sơ đồ.
- **Architecture (`docs/architecture.drawio`):** Cần kiểm tra và hoàn thiện sơ đồ kiến trúc.
- **ERD (`docs/erd.drawio`):** Cần kiểm tra tính nhất quán với cơ sở dữ liệu.
- **SQL DDL (`db/schema.sql`):** Đã tạo file, cần đối chiếu với ERD.
- **Wireframe (`docs/wireframe.drawio`):** Cần kiểm tra và hoàn thiện thiết kế giao diện.
- **Khai báo AI (`docs/ai-declaration.md`):** Đã tạo file khai báo sử dụng AI.
- **Ảnh sơ đồ (`docs/export/`):** Kiểm tra và bổ sung ảnh PNG sau khi hoàn thiện các sơ đồ.
- **PDF BT1:** Kiểm tra và tải lên bản PDF đã nộp trên VLU E-learning.
## 6. Trạng thái hiện tại (buổi 8)
- [x] Migration 5 bảng theo DDL BT1 + seed danh mục
- [x] CRUD /tickets qua routes/services/repositories
- [ ] CRUD customer, device
- [ ] Unit test lớp service (xong trước buổi 10)
- Ghi chú: dùng SQLite thay PostgreSQL để tránh lỗi cài đặt;
  cú pháp DDL đổi cho SQLite, ràng buộc giữ nguyên.

**Trạng thái chung:** Đang hoàn thiện và rà soát tài liệu trước khi nộp bài.

