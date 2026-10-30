# Biên bản chạy toàn luồng (end-to-end)

- **Ngày chạy:** 24/10/2026
- **Môi trường:** PostgreSQL 18.6, Node.js 24.12.0, npm 11.6.2, backend `http://localhost:3001`, frontend `http://localhost:5173`.
- **Dữ liệu:** dữ liệu mẫu thật nạp bằng `src/db/migrations/002_seed.sql` (3 khách, 3 thiết bị, 6 nhóm sự cố).
- **Luồng chính (UC01 → UC03 → UC07):** đăng nhập → tra khách theo SĐT → tra thiết bị theo serial → nhập mô tả, chọn nhóm và ưu tiên → tạo phiếu → xem danh sách.

| Bước | Đầu vào | Đầu ra quan sát được | Ảnh |
|---|---|---|---|
| 1. Đăng nhập | `nhanvien` / `123456` | Vào được màn hình có 3 tab | – |
| 2. Tra khách | `+84 901.234.567` | Lê Hoàng Cường — `0901***567` (chuẩn hoá về `0901234567`) | `e2e-1-tra-cuu.png` |
| 3. Tra thiết bị | `SN-C003-2026` | "Chưa xác minh bảo hành" (do `warranty_end_date` rỗng, QT-05) | `e2e-1-tra-cuu.png` |
| 4. Tiếp nhận | Mô tả "Màn hình bị sọc ngang sau khi rơi", nhóm Màn hình, ưu tiên Cao | Form hợp lệ | `e2e-2-tiep-nhan.png` |
| 5. Tạo phiếu | Bấm "Tạo phiếu bảo hành" | Mã phiếu `BH-…`, trạng thái Mới, hạn cam kết = +24 giờ (nhảy sang Thứ Hai nếu rơi Chủ nhật) | `e2e-3-tao-thanh-cong.png` |
| 6. Danh sách | Mở tab 3 | Phiếu mới nằm đầu danh sách, đủ cột khách/thiết bị/nhóm/ưu tiên/hạn/ngày | `e2e-4-danh-sach.png` |
| 7. Bộ lọc rỗng | Trạng thái = Hoàn tất | "Không có phiếu phù hợp" | `e2e-5-trang-thai-rong.png` |
| 8. Tắt backend | Tắt server, mở tab 3 | Thông báo "Không kết nối được máy chủ" + nút **Thử lại** | `e2e-6-loi-tat-backend.png` |
| 9. Token sai/hết hạn | Làm hỏng token trong trình duyệt | Nhận 401, token bị xoá, về trang đăng nhập kèm thông báo | – |

Kiểm tra bổ sung: không sử dụng `fetch()` trực tiếp trong các page; frontend gọi API thông qua lớp API client. Chạy lại migration không nhân đôi dữ liệu mẫu.

## Lỗi tích hợp gặp phải và cách xử lý

| Triệu chứng | Loại | Nguyên nhân | Cách sửa |
|---|---|---|---|
| `GET /tickets` trả `LOI_HE_THONG` sau khi thêm `dueState` | Logic | `rows.map(toTicketView)` truyền chỉ số dòng vào tham số `now` | Gọi `rows.map((row) => toTicketView(row))` |
| Phiếu vừa tạo có `customerName`, `categoryName` là `null` | Hợp đồng dữ liệu | `POST /tickets` trả hàng ticket thô, không JOIN | `createTicket` trả lại kết quả của `getTicket` (đã JOIN) |
