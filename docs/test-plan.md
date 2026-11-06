# TEST PLAN – SMART CRM L02

## 1. Phạm vi kiểm thử

### 1.1. Nội dung kiểm thử

Kiểm thử tập trung vào module L02 – Tiếp nhận và phân loại yêu cầu bảo hành, bao gồm:

- Chuẩn hóa và kiểm tra số điện thoại khách hàng.
- Tra cứu khách hàng và kiểm tra dữ liệu thiết bị.
- Xác định tình trạng bảo hành từ `warranty_end_date`.
- Kiểm tra dữ liệu đầu vào khi tạo phiếu bảo hành.
- Gán mức ưu tiên mặc định và trạng thái ban đầu cho phiếu.
- Tính hạn cam kết SLA theo mức ưu tiên và quy tắc Chủ nhật.
- Xác định phiếu sắp đến hạn và quá hạn.
- Ánh xạ dữ liệu phiếu từ PostgreSQL sang cấu trúc ứng dụng.
- Xử lý lỗi HTTP và xác thực token.
- Kiểm tra khả năng chạy lại migration và seed mà không tạo bản ghi trùng.

### 1.2. Nội dung không kiểm thử

- Phân công và quản lý kỹ thuật viên.
- Quy trình sửa chữa, quản lý linh kiện và thanh toán.
- Phân quyền chi tiết theo vai trò, do chức năng này chưa được hiện thực đầy đủ trong module hiện tại.
- Kiểm thử tải, hiệu năng quy mô lớn và kiểm thử chấp nhận với người dùng thực tế.
- Kiểm thử triển khai trên máy chủ production.

Các nội dung trên nằm ngoài phạm vi hiện thực hoặc chưa có đủ điều kiện kiểm thử trong phiên bản prototype hiện tại.

## 2. Loại kiểm thử và số lượng

Kiểm thử sử dụng Jest và Supertest, phân bố theo các tầng:

| Tầng kiểm thử | Nội dung | Số lượng dự kiến |
|---|---|---:|
| Unit test | Kiểm tra hàm và quy tắc nghiệp vụ độc lập | 6–8 |
| Integration test | Kiểm tra tương tác giữa các thành phần và dữ liệu | 2–4 |
| System/API test | Kiểm tra endpoint và luồng API quan trọng | 1–3 |

Các kỹ thuật thiết kế test case:

- **Phân vùng tương đương (Equivalence Partitioning):** chia dữ liệu thành nhóm hợp lệ và không hợp lệ, ví dụ số điện thoại đúng định dạng và số điện thoại chứa ký tự chữ.
- **Phân tích giá trị biên (Boundary Value Analysis):** kiểm tra các ranh giới của thời hạn SLA, thời điểm sắp đến hạn và điều kiện dữ liệu đầu vào.
- **Kiểm thử luồng đúng:** xác nhận các nghiệp vụ hoạt động với dữ liệu hợp lệ.
- **Kiểm thử dữ liệu sai:** xác nhận hệ thống từ chối dữ liệu không hợp lệ và trả lỗi phù hợp.
- **Kiểm thử bảo mật và chất lượng dữ liệu:** kiểm tra xác thực token, ràng buộc duy nhất và tính toàn vẹn dữ liệu.
- **Kiểm thử tính tái lập:** chạy lại migration và seed trên database kiểm thử để xác nhận không phát sinh lỗi hoặc bản ghi trùng.

Năm nhóm test case cần có trong Test Report:

1. Luồng đúng.
2. Giá trị biên.
3. Dữ liệu sai.
4. Bảo mật / chất lượng dữ liệu.
5. Tính tái lập.

## 3. Tiêu chí đánh giá thành công

- Có từ 10 đến 12 test case được thực thi và ghi nhận kết quả thực tế.
- Mỗi test case có đầy đủ tám trường thông tin theo mẫu Test Report.
- Test case bao phủ năm nhóm kiểm thử được yêu cầu.
- Các quy tắc nghiệp vụ đã hiện thực có kiểm thử tương ứng.
- Bộ kiểm thử tự động chạy bằng một lệnh `npm test -- --runInBand`.
- Kết quả PASS/FAIL được ghi trung thực, có ảnh chụp minh chứng cho kết quả chạy thật.
- Kiểm thử migration và seed lần thứ hai không gây lỗi hoặc làm tăng số bản ghi ngoài dự kiến.
- Các lỗi được ghi trong Bug Log có mô tả, cách tái lập, nguyên nhân, cách sửa, xác nhận và liên kết commit.

## 4. Môi trường và dữ liệu kiểm thử

### 4.1. Môi trường

| Thành phần | Công cụ / phiên bản |
|---|---|
| Hệ điều hành | Windows |
| Backend | Node.js + Express |
| Cơ sở dữ liệu | PostgreSQL 18 |
| Kiểm thử tự động | Jest 30.5.2 |
| Kiểm thử API | Supertest 7.3.1 |
| Trình quản lý gói | npm |
| Công cụ kiểm tra CSDL | pgAdmin 4 |
| Công cụ gọi API thủ công | Postman |

### 4.2. Dữ liệu kiểm thử

- Dữ liệu khách hàng, thiết bị và nhóm sự cố được nạp từ file `src/db/migrations/002_seed.sql`.
- Database kiểm thử sử dụng tên `smart_crm_test`.
- Dữ liệu phiếu bảo hành và lịch sử trạng thái hiện có được dùng để đối chiếu số lượng bản ghi trước và sau khi chạy lại migration.
- Các kiểm thử đơn vị sử dụng dữ liệu đầu vào được khai báo trực tiếp trong từng file test; các phụ thuộc được giả lập khi cần thiết.

### 4.3. Thiết lập và thực thi

Tại thư mục gốc dự án, cài đặt thư viện theo lockfile bằng:

```bash
npm ci
```

Chạy toàn bộ kiểm thử bằng:

```bash
npm test -- --runInBand
```

Kiểm thử migration và seed được thực hiện riêng trên database `smart_crm_test`, không sử dụng database vận hành `smart_crm`.

### 4.4. Lưu trữ kết quả

Kết quả thực thi, trạng thái PASS/FAIL và ảnh chụp minh chứng được lưu trong repository. Các kết quả chỉ được ghi nhận sau khi thực hiện kiểm thử thực tế.
