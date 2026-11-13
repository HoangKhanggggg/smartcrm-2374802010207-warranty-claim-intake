# TEST REPORT – SMART CRM L02

**Ngày thực hiện:** 06/11/2026 và 13/11/2026
**Môi trường:** Windows, Node.js 24.12.0, npm 11.6.2, Express.js, Jest 30.5.2, Supertest 7.3.1, PostgreSQL 18
**Lệnh kiểm thử tự động:** `npm test -- --runInBand`

## 1. Tổng hợp kết quả

| Chỉ tiêu | Lần kiểm thử 06/11/2026 | Lần kiểm thử 13/11/2026 |
|---|---:|---:|
| Tổng số Test Suites | 10 | 13 |
| Test Suites thành công | 10 | 13 |
| Tổng số test | 46 | 72 |
| Test thành công | 46 | 72 |
| Test thất bại | 0 | 0 |
| Thời gian thực thi | 1.289 giây | 1.278 giây |

Kết quả ngày 06/11/2026 được giữ lại làm mốc kiểm thử ban đầu. Ngày 13/11/2026, bộ kiểm thử hồi quy được thực thi lại bằng lệnh `npm test -- --runInBand`, ghi nhận 13/13 Test Suites và 72/72 test thành công, không có test thất bại.

Kết quả trên là kết quả kiểm thử tự động, không đồng nghĩa với việc toàn bộ chức năng đã được kiểm thử tích hợp trên PostgreSQL thật.

## 2. Danh sách test case

| Mã | Tiền điều kiện | Các bước | Dữ liệu thử | Kết quả mong đợi | Mức ưu tiên | Kết quả thực tế | PASS / FAIL |
|---|---|---|---|---|---|---|---|
| TC-01 | Service và repository được giả lập theo cấu hình của test; dữ liệu thiết bị đầu vào hợp lệ. | 1. Chạy `npx jest tests/services.test.js --runInBand -t "tạo phiếu trạng thái Mới"`.<br>2. Quan sát kết quả Jest. | Dữ liệu tạo phiếu hợp lệ, không truyền mức ưu tiên để kiểm tra giá trị mặc định. | Service tạo phiếu thành công; mức ưu tiên mặc định là `Trung bình`, trạng thái ban đầu là `Mới`. | Cao | Jest hiển thị test `luồng đúng: tạo phiếu trạng thái Mới, ưu tiên mặc định Trung bình` PASS, thời gian 5 ms. Có 1 test passed, 11 skipped. | PASS |
| TC-02 | Service và repository được giả lập theo cấu hình của test; dữ liệu tạo phiếu thiếu mô tả lỗi. | 1. Chạy `npx jest tests/services.test.js --runInBand -t "thiếu mô tả lỗi"`.<br>2. Quan sát kết quả Jest. | Thiếu trường mô tả lỗi (`description`). | Service từ chối dữ liệu thiếu mô tả lỗi theo kết quả kiểm thử Jest. | Cao | Jest hiển thị test `dữ liệu sai: thiếu mô tả lỗi thì không lưu (US03-AC2)` PASS, thời gian 3 ms. Có 1 test passed, 11 skipped. | PASS |
| TC-03 | Service và repository được giả lập theo cấu hình của test. | 1. Chạy test với bộ lọc `deviceId không phải số nguyên dương`.<br>2. Chạy test với bộ lọc `categoryId không phải số nguyên dương`.<br>3. Quan sát kết quả Jest. | `deviceId` và `categoryId` không phải số nguyên dương. | Service từ chối cả hai trường hợp ID không hợp lệ. | Cao | Hai lần chạy riêng đều PASS. Test `deviceId không phải số nguyên dương thì bị từ chối` đạt trong 4 ms; test `categoryId không phải số nguyên dương thì bị từ chối` đạt trong 4 ms. Mỗi lần có 1 test passed, 11 skipped. | PASS |
| TC-04 | Có hàm chuẩn hóa số điện thoại `normalizePhone`. | Chạy `npx jest tests/phone.test.js --runInBand -t "chuẩn hoá"` và quan sát kết quả. | Số điện thoại có mã quốc gia `+84`, dấu cách và dấu chấm. | Chuẩn hóa thành 10 chữ số bắt đầu bằng `0`. | Cao | Test `chuẩn hoá +84, dấu cách và dấu chấm về 10 chữ số bắt đầu bằng 0` PASS, thời gian 3 ms. Có 1 test passed, 3 skipped. | PASS |
| TC-05 | Có hàm chuẩn hóa số điện thoại `normalizePhone`. | Chạy `npx jest tests/phone.test.js --runInBand -t "từ chối\|giá trị biên"` và quan sát kết quả. | Chuỗi chứa chữ cái; số điện thoại có 9 hoặc 11 chữ số. | Từ chối số điện thoại chứa ký tự không hợp lệ hoặc không đúng độ dài. | Cao | Hai test `từ chối chuỗi chứa chữ cái hoặc không đủ 10 chữ số` và `giá trị biên: 9 hoặc 11 chữ số đều không hợp lệ` đều PASS. Có 2 test passed, 2 skipped. | PASS |
| TC-06 | Có hàm kiểm tra bảo hành `checkWarranty`. | Chạy `npx jest tests/warranty.test.js --runInBand` và quan sát kết quả. | Ngày hiện tại trước, đúng ngày và sau ngày hết hạn; ngày hết hạn rỗng. | Trả về đúng trạng thái Còn bảo hành, Hết bảo hành hoặc Chưa xác minh bảo hành. | Cao | Cả 4 test kiểm tra bảo hành đều PASS: còn bảo hành, hết bảo hành, chưa xác minh và đúng ngày hết hạn vẫn còn bảo hành. Có 4 test passed, thời gian 0.443 giây. | PASS |
| TC-07 | Có hàm tính hạn cam kết `computeDeadline`. | Chạy `npx jest tests/sla.test.js --runInBand` và quan sát kết quả. | Mức ưu tiên Trung bình; thời điểm hạn rơi vào Chủ nhật, Thứ Bảy và ranh giới Chủ nhật theo giờ Việt Nam. | Ưu tiên Trung bình cộng 72 giờ; hạn rơi vào Chủ nhật được chuyển sang cùng giờ Thứ Hai; hạn rơi vào Thứ Bảy được giữ nguyên. | Cao | Cả 5 test SLA đều PASS, bao gồm quy tắc 72 giờ, điều chỉnh Chủ nhật, giữ nguyên Thứ Bảy, từ chối ưu tiên không hợp lệ và xử lý ranh giới giờ Việt Nam khi máy chủ dùng UTC. Thời gian 0.5 giây. | PASS |
| TC-08 | Có hàm xác định trạng thái hạn `getDueState`. | Chạy `npx jest tests/due.test.js --runInBand` và quan sát kết quả. | Phiếu quá hạn; còn đúng 8 giờ; còn 8,1 giờ; phiếu Hoàn tất, Đã đóng hoặc không có hạn cam kết. | Xác định đúng trạng thái quá hạn và sắp đến hạn; đúng 8 giờ được đánh dấu sắp đến hạn, 8,1 giờ chưa được đánh dấu; phiếu Hoàn tất/Đã đóng hoặc không có hạn không bị đánh dấu. | Cao | Cả 5 test xác định trạng thái hạn đều PASS. Thời gian 0.431 giây. | PASS |
| TC-09 | Có hàm ánh xạ dữ liệu phiếu `toTicketView`. | Chạy `npx jest tests/ticketMapper.test.js --runInBand -t "null"` và quan sát kết quả. | `category` và `commitment_deadline` nhận giá trị `null`; kiểm tra thêm đầu vào toàn bộ là `null`. | Mapper chấp nhận các trường nullable và từ chối đầu vào toàn bộ không hợp lệ. | Trung bình | Lệnh chạy 2 test và cả 2 đều PASS: mapper chấp nhận category và hạn cam kết null (3 ms); từ chối đầu vào null (23 ms). Có 2 test passed, 2 skipped. | PASS |
| TC-10 | Repository được kiểm thử với các phụ thuộc PostgreSQL giả lập. | Chạy `npx jest tests/ticketRepository.test.js --runInBand` và quan sát kết quả. | Trùng số điện thoại, trùng Serial/IMEI, trùng mã phiếu và lỗi ROLLBACK. | Trả mã lỗi nghiệp vụ phù hợp; trường hợp trùng mã phiếu phải rollback transaction; lỗi ROLLBACK không che mất lỗi PostgreSQL ban đầu. | Cao | Cả 4 test xử lý lỗi Repository đều PASS. Thời gian 0.504 giây. Đây là kiểm thử với PostgreSQL được giả lập, không phải kiểm thử transaction trực tiếp trên PostgreSQL thật. | PASS |
| TC-11 | Có ứng dụng Express và middleware xử lý lỗi; Service được giả lập theo cấu hình test. | Chạy `npx jest tests/tickets.routes.test.js --runInBand` và quan sát kết quả. | Gửi request `POST /tickets` không có body. | API trả HTTP 400 và mã lỗi `DU_LIEU_KHONG_HOP_LE`; không phát sinh lỗi HTTP 500; Service nhận object rỗng theo thiết kế test. | Cao | Supertest xác nhận HTTP 400, mã lỗi `DU_LIEU_KHONG_HOP_LE` và Service nhận object rỗng. Test PASS, thời gian test 37 ms. Thời gian toàn bộ suite 2.596 giây. | PASS |
| TC-12 | Có database kiểm thử `smart_crm_test` và dữ liệu ban đầu. | 1. Ghi nhận số lượng bản ghi trước khi chạy.<br>2. Chạy `npm start` lần thứ nhất.<br>3. Đối chiếu số lượng năm bảng.<br>4. Chạy `npm start` lần thứ hai.<br>5. Đối chiếu lại số lượng năm bảng. | Migration `001_create_tables.sql`, seed `002_seed.sql`. | Hai lần chạy thành công, không phát sinh lỗi SQL hoặc bản ghi trùng; số lượng bản ghi không tăng ngoài dự kiến. | Cao | Hai lần khởi động đều ghi nhận migration `001_create_tables.sql` và seed `002_seed.sql` chạy thành công. Số lượng bản ghi trước và sau hai lần chạy giữ nguyên: customer 4, device 5, issue_category 6, ticket 3, ticket_status_log 3. | PASS |

## 3. Phân loại kiểm thử

| Nhóm kiểm thử | Test case |
|---|---|
| Luồng đúng | TC-01, TC-04, TC-06, TC-07 |
| Giá trị biên | TC-05, TC-08, TC-09 |
| Dữ liệu sai | TC-02, TC-03, TC-05, TC-11 |
| Bảo mật / chất lượng dữ liệu | TC-03, TC-10, TC-11 |
| Tính tái lập | TC-12 |

Ngoài các test case chi tiết trên, bộ kiểm thử hồi quy ngày 13/11/2026 còn ghi nhận các suite liên quan đến xác thực, middleware và kiểm tra vai trò như `auth.test.js`, `middleware.test.js` và `authorizeRoles.test.js`. Các suite này được thể hiện trong ảnh kết quả kiểm thử hồi quy. Bảng test case trên chỉ mô tả chi tiết những trường hợp đã được ghi nhận từ TC-01 đến TC-12.

Một test case có thể thuộc nhiều nhóm nếu nội dung kiểm tra đáp ứng nhiều mục tiêu kiểm thử khác nhau.

## 4. Nhận xét kết quả

- Lần kiểm thử ngày 06/11/2026 ghi nhận 10/10 Test Suites thành công và 46/46 test thành công.
- Lần kiểm thử hồi quy ngày 13/11/2026 ghi nhận 13/13 Test Suites thành công và 72/72 test thành công, không có test thất bại.
- Bộ kiểm thử bao phủ các nghiệp vụ quan trọng đã hiện thực như tạo phiếu, chuẩn hóa số điện thoại, kiểm tra bảo hành, tính SLA, xác định trạng thái hạn, ánh xạ dữ liệu và xử lý lỗi.
- Bộ kiểm thử hồi quy còn bao gồm các suite liên quan đến xác thực, middleware và kiểm tra vai trò. Kết quả các suite này được thể hiện trong ảnh kiểm thử hồi quy.
- Kiểm thử Repository và API sử dụng mock ở một số thành phần, do đó chưa thể thay thế kiểm thử tích hợp đầy đủ với PostgreSQL thật.
- TC-12 đã được thực hiện trên database `smart_crm_test`. Migration và seed được chạy hai lần liên tiếp, không phát sinh lỗi và số lượng bản ghi của năm bảng không thay đổi.
- Kết quả TC-01 đến TC-12 và ảnh minh chứng tương ứng được ghi nhận ngày 06/11/2026. Kết quả 13 Test Suites và 72 test là lần chạy hồi quy tự động ngày 13/11/2026.

## 5. Minh chứng

Ảnh minh chứng được lưu trong thư mục `docs/screenshots/` của repository.

| Test case | Tên ảnh minh chứng |
|---|---|
| TC-01 | `TC-01.png` |
| TC-02 | `TC-02.png` |
| TC-03 | `TC-03-deviceId.png`, `TC-03-categoryId.png` |
| TC-04 | `TC-04.png` |
| TC-05 | `TC-05.png` |
| TC-06 | `TC-06.png` |
| TC-07 | `TC-07.png` |
| TC-08 | `TC-08.png` |
| TC-09 | `TC-09.png` |
| TC-10 | `TC-10.png` |
| TC-11 | `TC-11.png` |
| TC-12 | `TC-12_truoc_migration.png`, `TC-12_migration_log.png`, `TC-12_sau_lan_1.png`, `TC-12_sau_lan_2.png` |
| Kiểm thử hồi quy ngày 13/11/2026 | `REGRESSION_2026-11-13.png` |

Các ảnh thể hiện kết quả chạy Jest, log migration/seed và số lượng bản ghi trên database kiểm thử trước và sau hai lần thực thi.