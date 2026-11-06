# TEST REPORT – SMART CRM L02

**Ngày thực hiện:** 06/11/2026  
**Môi trường:** Windows, Node.js, Express, Jest, Supertest, PostgreSQL 18  
**Lệnh kiểm thử tự động:** `npm test -- --runInBand --verbose`

## 1. Tổng hợp kết quả

| Chỉ tiêu | Kết quả |
|---|---:|
| Tổng số Test Suites | 10 |
| Test Suites thành công | 10 |
| Tổng số test | 46 |
| Test thành công | 46 |
| Test thất bại | 0 |
| Thời gian thực thi | 9,091 giây |

Kết quả trên được lấy từ lần chạy Jest ngày 06/11/2026. Đây là kết quả kiểm thử tự động, không đồng nghĩa với việc toàn bộ chức năng đã được kiểm thử tích hợp trên PostgreSQL thật.

## 2. Danh sách test case

| Mã | Tiền điều kiện | Các bước | Dữ liệu thử | Kết quả mong đợi | Mức ưu tiên | Kết quả thực tế | PASS / FAIL |
|---|---|---|---|---|---|---|---|
| TC-01 | Service tạo phiếu hoạt động | Gọi `createTicket` với dữ liệu hợp lệ | Thiết bị hợp lệ, mô tả lỗi hợp lệ, không truyền priority | Tạo phiếu có trạng thái Mới và ưu tiên Trung bình mặc định | Cao | Test tạo phiếu với trạng thái Mới và ưu tiên Trung bình mặc định thành công | PASS |
| TC-02 | Service tạo phiếu hoạt động | Gọi `createTicket` thiếu mô tả lỗi | Thiếu description | Từ chối dữ liệu và không lưu phiếu | Cao | Test xác nhận thiếu mô tả lỗi thì không lưu thành công | PASS |
| TC-03 | Service tạo phiếu hoạt động | Gọi `createTicket` với mã thiết bị hoặc nhóm sự cố không hợp lệ | `deviceId` hoặc `categoryId` không phải số nguyên dương | Từ chối dữ liệu không hợp lệ, không gọi thao tác lưu | Cao | Hai test kiểm tra `deviceId` và `categoryId` đều thành công | PASS |
| TC-04 | Có hàm chuẩn hóa số điện thoại | Gọi `normalizePhone` | `+84`, dấu cách, dấu chấm và số điện thoại hợp lệ | Chuẩn hóa thành 10 chữ số bắt đầu bằng 0 | Cao | Test chuẩn hóa số điện thoại thành công | PASS |
| TC-05 | Có hàm chuẩn hóa số điện thoại | Gọi `normalizePhone` với dữ liệu sai | Chuỗi chứa chữ cái; số có 9 hoặc 11 chữ số | Từ chối số điện thoại không hợp lệ | Cao | Các test dữ liệu sai và giá trị biên đều thành công | PASS |
| TC-06 | Có hàm kiểm tra bảo hành | Gọi `checkWarranty` với các mốc ngày khác nhau | Ngày hiện tại trước, đúng ngày và sau ngày hết hạn; ngày hết hạn rỗng | Trả về đúng trạng thái Còn bảo hành, Hết bảo hành hoặc Chưa xác minh bảo hành | Cao | Bốn test kiểm tra các trường hợp bảo hành đều thành công | PASS |
| TC-07 | Có hàm tính SLA | Gọi `computeDeadline` | Ưu tiên Trung bình; hạn rơi vào Chủ nhật | Cộng 72 giờ với ưu tiên Trung bình; nếu hạn rơi Chủ nhật thì chuyển sang cùng giờ Thứ Hai | Cao | Các test SLA, gồm trường hợp máy chủ dùng UTC, đều thành công | PASS |
| TC-08 | Có hàm xác định trạng thái hạn | Gọi `getDueState` với thời điểm hiện tại khác nhau | Còn đúng 8 giờ và còn 8,1 giờ | Đúng 8 giờ được đánh dấu sắp đến hạn; 8,1 giờ chưa được đánh dấu | Cao | Test giá trị biên 8 giờ thành công | PASS |
| TC-09 | Có dữ liệu ticket mẫu | Gọi `toTicketView` | Category và commitment deadline có giá trị null | Ánh xạ dữ liệu đúng, chấp nhận các trường nullable | Trung bình | Test giá trị biên category và hạn cam kết null thành công | PASS |
| TC-10 | Repository có các trường hợp lỗi giả lập | Gọi thao tác tạo phiếu với dữ liệu trùng | Trùng số điện thoại, Serial/IMEI hoặc mã phiếu | Trả mã lỗi nghiệp vụ phù hợp; trường hợp trùng mã phiếu phải rollback transaction | Cao | Bốn test xử lý lỗi PostgreSQL giả lập đều thành công | PASS |
| TC-11 | Có ứng dụng Express và middleware xác thực | Gọi API `POST /tickets` không có body | Request không có JSON body | Trả HTTP 400 và mã lỗi `DU_LIEU_KHONG_HOP_LE`, không phát sinh lỗi 500 | Cao | Supertest xác nhận HTTP 400, mã lỗi đúng và Service nhận object rỗng | PASS |
| TC-12 | Có database `smart_crm_test` và dữ liệu ban đầu | Chạy `npm start` hai lần; sau mỗi lần truy vấn COUNT trên 5 bảng | Migration `001_create_tables.sql`, seed `002_seed.sql` | Hai lần chạy thành công, không lỗi SQL, số lượng bản ghi không tăng | Cao | Cả hai lần migration và seed chạy thành công. Số lượng giữ nguyên: customer 4, device 5, issue_category 6, ticket 3, ticket_status_log 3 | PASS |

## 3. Phân loại kiểm thử

| Nhóm kiểm thử | Test case |
|---|---|
| Luồng đúng | TC-01, TC-04, TC-06, TC-07 |
| Giá trị biên | TC-05, TC-08, TC-09 |
| Dữ liệu sai | TC-02, TC-03, TC-05, TC-11 |
| Bảo mật / chất lượng dữ liệu | TC-03, TC-10, TC-11 |
| Tính tái lập | TC-12 |

**Lưu ý:** TC-10 là kiểm thử xử lý lỗi repository với các phụ thuộc được giả lập, không phải bằng chứng ghi dữ liệu và rollback trên PostgreSQL thật. TC-11 kiểm tra API Route với Service được mock, không phải kiểm thử toàn bộ luồng API và cơ sở dữ liệu.

## 4. Nhận xét kết quả

- Bộ kiểm thử tự động hiện có 10 Test Suites và 46 test.
- Tất cả 46 test đều PASS trong lần chạy ngày 06/11/2026.
- Các kiểm thử bao phủ những nghiệp vụ quan trọng đã hiện thực như chuẩn hóa số điện thoại, kiểm tra bảo hành, tính SLA, xác định trạng thái hạn, tạo phiếu và xử lý lỗi.
- Các kiểm thử repository và API hiện có sử dụng mock ở một số thành phần, do đó chưa thể thay thế kiểm thử tích hợp với PostgreSQL thật.
- TC-12 đã được thực hiện trên database `smart_crm_test`. Migration và seed được chạy hai lần liên tiếp, không phát sinh lỗi và số lượng bản ghi của năm bảng không thay đổi.

## 5. Minh chứng

- Kết quả chạy Jest bằng lệnh `npm test -- --runInBand --verbose`, hiển thị 10/10 Test Suites và 46/46 tests thành công.
- `TC12_truoc_migration.png`: số lượng bản ghi trước khi chạy migration.
- `TC12_sau_lan_1.png`: số lượng bản ghi sau lần chạy migration thứ nhất.
- `TC12_sau_lan_2.png`: số lượng bản ghi sau lần chạy migration thứ hai.
- `TC12_migration_log.png`: log thực thi hai file migration và khởi động server thành công.

Các ảnh minh chứng được lưu trong thư mục `docs/screenshots/` của repository.