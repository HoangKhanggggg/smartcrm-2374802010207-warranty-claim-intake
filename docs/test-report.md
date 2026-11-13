# TEST REPORT – SMART CRM L02

**Dự án:** Smart CRM – Mekong Mobile
**Module:** L02 – Tiếp nhận và phân loại bảo hành
**Ngày thực hiện:** 06/11/2026 và 13/11/2026
**Môi trường:** Windows, Node.js 24.12.0, npm 11.6.2, Express.js, Jest 30.5.2, Supertest 7.3.1, PostgreSQL 18
**Lệnh kiểm thử tự động:** `npm test -- --runInBand`

---

## 1. Tổng quan kết quả kiểm thử

### 1.1. Kết quả kiểm thử tự động

| Chỉ tiêu | Lần kiểm thử 06/11/2026 | Lần kiểm thử 13/11/2026 (trước CORS) | Lần kiểm thử 13/11/2026 (sau CORS) |
|---|---:|---:|---:|
| Tổng số Test Suites | 10 | 13 | 14 |
| Test Suites thành công | 10 | 13 | 14 |
| Tổng số test | 46 | 72 | 76 |
| Test thành công | 46 | 72 | 76 |
| Test thất bại | 0 | 0 | 0 |
| Thời gian thực thi | 1.289 giây | 1.278 giây | 1.469 giây |

Kết quả ngày 06/11/2026 được giữ lại làm mốc kiểm thử ban đầu.

Ngày 13/11/2026, bộ kiểm thử hồi quy được thực thi trước và sau khi bổ sung cấu hình CORS. Lần chạy trước CORS ghi nhận 13/13 Test Suites và 72/72 test thành công. Lần chạy sau CORS ghi nhận 14/14 Test Suites và 76/76 test thành công, không có test thất bại.

Bốn test mới được bổ sung nhằm kiểm tra các Origin được phép truy cập Backend và Origin không nằm trong danh sách cho phép.

### 1.2. Nhận xét

Kết quả kiểm thử cho thấy các bộ kiểm thử tự động đều hoàn thành thành công tại những lần thực thi đã ghi nhận.

Việc bổ sung cấu hình CORS cho phép Frontend tại `http://localhost:5175` kết nối Backend, đồng thời giữ lại các Origin đã được cấu hình trước đó.

Bộ kiểm thử sau cập nhật đạt 76/76 test thành công, không ghi nhận test thất bại.

---

## 2. Danh sách test case

| Mã TC | Điều kiện kiểm thử | Các bước thực hiện | Dữ liệu kiểm thử | Kết quả mong đợi | Mức độ ưu tiên | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|---|
| TC-01 | Service và repository được giả lập theo cấu hình của test; dữ liệu thiết bị đầu vào hợp lệ. | Chạy `npx jest tests/services.test.js --runInBand -t "tạo phiếu trạng thái Mới"` và quan sát kết quả Jest. | Dữ liệu tạo phiếu hợp lệ, không truyền mức ưu tiên để kiểm tra giá trị mặc định. | Service tạo phiếu thành công; mức ưu tiên mặc định là `Trung bình`, trạng thái ban đầu là `Mới`. | Cao | Test `luồng đúng: tạo phiếu trạng thái Mới, ưu tiên mặc định Trung bình` PASS, thời gian 5 ms. Có 1 test passed, 11 skipped. | PASS |
| TC-02 | Service và repository được giả lập theo cấu hình của test; dữ liệu tạo phiếu thiếu mô tả lỗi. | Chạy `npx jest tests/services.test.js --runInBand -t "thiếu mô tả lỗi"` và quan sát kết quả Jest. | Thiếu trường mô tả lỗi (`description`). | Service từ chối dữ liệu thiếu mô tả lỗi theo kết quả kiểm thử Jest. | Cao | Test `dữ liệu sai: thiếu mô tả lỗi thì không lưu (US03-AC2)` PASS, thời gian 3 ms. Có 1 test passed, 11 skipped. | PASS |
| TC-03 | Service và repository được giả lập theo cấu hình test. | Chạy test với bộ lọc `deviceId không phải số nguyên dương`; tiếp tục chạy test với bộ lọc `categoryId không phải số nguyên dương`. | `deviceId` và `categoryId` không phải số nguyên dương. | Service từ chối cả hai trường hợp ID không hợp lệ. | Cao | Hai lần chạy riêng đều PASS. Test `deviceId không phải số nguyên dương thì bị từ chối` đạt trong 4 ms; test `categoryId không phải số nguyên dương thì bị từ chối` đạt trong 4 ms. | PASS |
| TC-04 | Có hàm chuẩn hóa số điện thoại `normalizePhone`. | Chạy `npx jest tests/phone.test.js --runInBand -t "chuẩn hoá"` và quan sát kết quả. | Số điện thoại có mã quốc gia `+84`, dấu cách và dấu chấm. | Chuẩn hóa thành 10 chữ số bắt đầu bằng `0`. | Cao | Test `chuẩn hoá +84, dấu cách và dấu chấm về 10 chữ số bắt đầu bằng 0` PASS, thời gian 3 ms. Có 1 test passed, 3 skipped. | PASS |
| TC-05 | Có hàm chuẩn hóa số điện thoại `normalizePhone`. | Chạy `npx jest tests/phone.test.js --runInBand -t "từ chối\|giá trị biên"` và quan sát kết quả. | Chuỗi chứa chữ cái; số điện thoại có 9 hoặc 11 chữ số. | Từ chối số điện thoại chứa ký tự không hợp lệ hoặc không đúng độ dài. | Cao | Hai test `từ chối chuỗi chứa chữ cái hoặc không đủ 10 chữ số` và `giá trị biên: 9 hoặc 11 chữ số đều không hợp lệ` đều PASS. Có 2 test passed, 2 skipped. | PASS |
| TC-06 | Có hàm kiểm tra bảo hành `checkWarranty`. | Chạy `npx jest tests/warranty.test.js --runInBand` và quan sát kết quả. | Ngày hiện tại trước, đúng ngày và sau ngày hết hạn; ngày hết hạn rỗng. | Trả về đúng trạng thái Còn bảo hành, Hết bảo hành hoặc Chưa xác minh bảo hành. | Cao | Cả 4 test kiểm tra bảo hành đều PASS: còn bảo hành, hết bảo hành, chưa xác minh và đúng ngày hết hạn vẫn còn bảo hành. Thời gian 0.443 giây. | PASS |
| TC-07 | Có hàm tính hạn cam kết `computeDeadline`. | Chạy `npx jest tests/sla.test.js --runInBand` và quan sát kết quả. | Mức ưu tiên Trung bình; thời điểm hạn rơi vào Chủ nhật, Thứ Bảy và ranh giới Chủ nhật theo giờ Việt Nam. | Ưu tiên Trung bình cộng 72 giờ; hạn rơi vào Chủ nhật được chuyển sang cùng giờ Thứ Hai; hạn rơi vào Thứ Bảy được giữ nguyên. | Cao | Cả 5 test SLA đều PASS, bao gồm quy tắc 72 giờ, điều chỉnh Chủ nhật, giữ nguyên Thứ Bảy, từ chối ưu tiên không hợp lệ và xử lý ranh giới giờ Việt Nam khi máy chủ dùng UTC. Thời gian 0.5 giây. | PASS |
| TC-08 | Có hàm xác định trạng thái hạn `getDueState`. | Chạy `npx jest tests/due.test.js --runInBand` và quan sát kết quả. | Phiếu quá hạn; còn đúng 8 giờ; còn 8,1 giờ; phiếu Hoàn tất, Đã đóng hoặc không có hạn cam kết. | Xác định đúng trạng thái quá hạn và sắp đến hạn; đúng 8 giờ được đánh dấu sắp đến hạn, 8,1 giờ chưa được đánh dấu; phiếu Hoàn tất/Đã đóng hoặc không có hạn không bị đánh dấu. | Cao | Cả 5 test xác định trạng thái hạn đều PASS. Thời gian 0.431 giây. | PASS |
| TC-09 | Có hàm ánh xạ dữ liệu phiếu `toTicketView`. | Chạy `npx jest tests/ticketMapper.test.js --runInBand -t "null"` và quan sát kết quả. | `category` và `commitment_deadline` nhận giá trị `null`; kiểm tra thêm đầu vào toàn bộ là `null`. | Mapper chấp nhận các trường nullable và từ chối đầu vào toàn bộ không hợp lệ. | Trung bình | Lệnh chạy 2 test và cả 2 đều PASS: mapper chấp nhận category và hạn cam kết null (3 ms); từ chối đầu vào null (23 ms). Có 2 test passed, 2 skipped. | PASS |
| TC-10 | Repository được kiểm thử với các phụ thuộc PostgreSQL giả lập. | Chạy `npx jest tests/ticketRepository.test.js --runInBand` và quan sát kết quả. | Trùng số điện thoại, trùng Serial/IMEI, trùng mã phiếu và lỗi ROLLBACK. | Trả mã lỗi nghiệp vụ phù hợp; trường hợp trùng mã phiếu phải rollback transaction; lỗi ROLLBACK không che mất lỗi PostgreSQL ban đầu. | Cao | Cả 4 test xử lý lỗi Repository đều PASS. Đây là kiểm thử với PostgreSQL được giả lập, không phải kiểm thử transaction trực tiếp trên PostgreSQL thật. | PASS |
| TC-11 | Có ứng dụng Express và middleware xử lý lỗi; Service được giả lập theo cấu hình test. | Chạy `npx jest tests/tickets.routes.test.js --runInBand` và quan sát kết quả. | Gửi request `POST /tickets` không có body. | API trả HTTP 400 và mã lỗi `DU_LIEU_KHONG_HOP_LE`; không phát sinh lỗi HTTP 500; Service nhận object rỗng theo thiết kế test. | Cao | Supertest xác nhận HTTP 400, mã lỗi `DU_LIEU_KHONG_HOP_LE` và Service nhận object rỗng. Test PASS. | PASS |
| TC-12 | Có database kiểm thử `smart_crm_test` và dữ liệu ban đầu. | 1. Ghi nhận số lượng bản ghi trước khi chạy. 2. Chạy `npm start` lần thứ nhất. 3. Đối chiếu số lượng năm bảng. 4. Chạy `npm start` lần thứ hai. 5. Đối chiếu lại số lượng năm bảng. | Migration `001_create_tables.sql`, seed `002_seed.sql`. | Hai lần chạy thành công, không phát sinh lỗi SQL hoặc bản ghi trùng; số lượng bản ghi không tăng ngoài dự kiến. | Cao | Hai lần khởi động đều ghi nhận migration `001_create_tables.sql` và seed `002_seed.sql` chạy thành công. Số lượng bản ghi trước và sau hai lần chạy giữ nguyên: customer 4, device 5, issue_category 6, ticket 3, ticket_status_log 3. | PASS |
| TC-13 | Ứng dụng Express đã cấu hình CORS và sử dụng Supertest. | 1. Chạy `npm test -- --runInBand tests/cors.test.js`. 2. Gửi request GET `/health` với từng Origin được cấu hình. 3. Gửi request với Origin không hợp lệ. | Ba Origin: `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:5175`; một Origin không hợp lệ: `http://example.com`. | Ba Origin hợp lệ được cấp `Access-Control-Allow-Origin` tương ứng; Origin không hợp lệ không được cấp header này. | Cao | Jest ghi nhận 4/4 test PASS, gồm 3 trường hợp Origin được phép và 1 trường hợp Origin không hợp lệ. Thời gian 1.207 giây. | PASS |

---

## 3. Phân loại kiểm thử

Ngoài các test case chi tiết trên, bộ kiểm thử hồi quy ngày 13/11/2026 còn ghi nhận các suite liên quan đến xác thực, middleware và kiểm tra vai trò như `auth.test.js`, `middleware.test.js`, `authorizeRoles.test.js` và `authorization.routes.test.js`.

Bảng test case trên mô tả các trường hợp kiểm thử từ TC-01 đến TC-13.

Một test case có thể thuộc nhiều nhóm nếu nội dung kiểm tra đáp ứng nhiều mục tiêu kiểm thử khác nhau.

### 3.1. Kiểm thử chức năng

- Kiểm tra tạo phiếu bảo hành với trạng thái ban đầu `Mới`.
- Kiểm tra mức ưu tiên mặc định `Trung bình`.
- Kiểm tra dữ liệu đầu vào không hợp lệ.
- Kiểm tra chuẩn hóa số điện thoại.
- Kiểm tra trạng thái bảo hành.
- Kiểm tra tính hạn cam kết SLA.
- Kiểm tra trạng thái sắp đến hạn và quá hạn.
- Kiểm tra ánh xạ dữ liệu phiếu.

### 3.2. Kiểm thử API và phân quyền

- Kiểm tra API tiếp nhận phiếu.
- Kiểm tra xử lý lỗi đầu vào.
- Kiểm tra xác thực và phân quyền truy cập.
- Kiểm tra cấu hình CORS cho các Origin được cho phép.
- Kiểm tra Origin không nằm trong danh sách cho phép không được cấp quyền CORS.

### 3.3. Kiểm thử dữ liệu

- Kiểm tra xử lý dữ liệu trùng lặp.
- Kiểm tra rollback transaction thông qua Repository được giả lập.
- Kiểm tra khả năng chạy migration và seed nhiều lần trên database kiểm thử.
- Kiểm tra dữ liệu được lưu trong các bảng theo kết quả kiểm thử đã ghi nhận.

---

## 4. Kết luận kiểm thử

- Lần kiểm thử ngày 06/11/2026 ghi nhận 10/10 Test Suites thành công và 46/46 test thành công.
- Lần kiểm thử hồi quy ngày 13/11/2026 trước khi cập nhật CORS ghi nhận 13/13 Test Suites và 72/72 test thành công.
- Sau khi bổ sung cấu hình CORS và kiểm thử tương ứng ngày 13/11/2026, bộ kiểm thử hồi quy đạt 14/14 Test Suites và 76/76 test thành công, không có test thất bại.
- TC-13 kiểm tra ba Origin hợp lệ và một Origin không hợp lệ bằng Jest và Supertest.
- TC-12 đã được thực hiện trên database `smart_crm_test`. Migration và seed được chạy hai lần liên tiếp, không phát sinh lỗi và số lượng bản ghi của năm bảng không thay đổi.
- Kiểm thử Repository tại TC-10 sử dụng PostgreSQL được giả lập, không được xem là kiểm thử transaction trực tiếp trên PostgreSQL thật.
- Kết quả kiểm thử tự động được ghi nhận theo các lần chạy thực tế ngày 06/11/2026 và 13/11/2026.

Kết quả kiểm thử cho thấy các trường hợp đã thực hiện đều đạt kết quả mong đợi. Tuy nhiên, phạm vi kiểm thử cần được xem xét cùng với các kiểm thử giao diện, tích hợp và triển khai thực tế để đánh giá đầy đủ chất lượng module L02.

---

## 5. Danh sách ảnh minh chứng

| STT | Nội dung minh chứng | Tên ảnh |
|---|---|---|
| 1 | Kiểm thử hồi quy ngày 13/11/2026 trước cập nhật CORS | `REGRESSION_2026-11-13.png` |
| 2 | Kiểm thử hồi quy ngày 13/11/2026 sau cập nhật CORS | Bổ sung ảnh thực tế sau khi chạy 76/76 test |
| 3 | Kiểm thử CORS | Bổ sung ảnh thực tế kết quả `cors.test.js` |
| 4 | Clone repository sạch | `TP4_01_CLEAN_CLONE.png` |
| 5 | Docker build | `TP4_02_DOCKER_BUILD.png` |
| 6 | Các container hoạt động | `TP4_03_CONTAINERS_HEALTHY.png` |
| 7 | Đăng nhập nhân viên | `TP4_04_LOGIN_STAFF.png` |
| 8 | Đăng nhập quản lý | `TP4_05_LOGIN_MANAGER.png` |
| 9 | Tạo phiếu bảo hành | `TP4_06_TICKET_CREATED.png` |
| 10 | Tra cứu khách hàng | `TP4_07_LOOKUP_CUSTOMER.png` |
| 11 | Không tìm thấy thiết bị | `TP4_08_DEVICE_NOT_FOUND.png` |
| 12 | Tra cứu thiết bị và bảo hành | `TP4_09_DEVICE_FOUND_WARRANTY.png` |
| 13 | Tạo phiếu thành công | `TP4_10_TICKET_CREATED.png` |
| 14 | Danh sách phiếu | `TP4_11_TICKET_LIST.png` |
| 15 | Xác minh dữ liệu PostgreSQL | `TP4_12_DATA_PERSISTENCE.png` |

**Thư mục lưu ảnh:** `docs/screenshots/`

---

**Ghi chú:** Các kết quả kiểm thử trong tài liệu được tổng hợp từ những lần chạy đã ghi nhận. Ảnh minh chứng cần được lưu từ kết quả chạy thực tế; không sử dụng ảnh giả lập hoặc ảnh chưa thực hiện.
