# Bug Log – Smart CRM L02

## BUG-01 – Tính sai hạn cam kết SLA khi thời điểm kết thúc rơi vào Chủ nhật

**Mức độ:** MAJOR

1. **Triệu chứng:** Hạn cam kết của phiếu có thể được tính sai khi thời điểm kết thúc SLA rơi vào Chủ nhật. Kết quả phụ thuộc vào múi giờ của máy chủ, không bảo đảm quy tắc nghiệp vụ theo giờ Việt Nam.

2. **Cách tái lập:** Tạo một thời điểm bắt đầu SLA sao cho thời điểm kết thúc sau khi cộng thời gian SLA rơi vào Chủ nhật theo giờ Việt Nam. Ví dụ: với mức ưu tiên Cao (SLA 24 giờ), bắt đầu lúc 00:00 Thứ Bảy thì hạn cam kết ban đầu rơi vào 00:00 Chủ nhật. Quan sát hạn cam kết được tính sau khi áp dụng quy tắc chuyển sang Thứ Hai.

3. **Khoanh vùng:** Kiểm tra hàm `computeDeadline()` trong `src/utils/sla.js` và các phép tính ngày liên quan; đối chiếu với các kiểm thử trong `tests/sla.test.js`.

4. **Nguyên nhân gốc:** Phiên bản cũ sử dụng `getDay()` và `setDate()` theo múi giờ cục bộ của máy chủ để xác định Chủ nhật. Vì vậy, kết quả có thể không nhất quán với múi giờ Việt Nam (UTC+7).

5. **Cách sửa:** Chuyển sang xác định ngày theo UTC+7 bằng cách cộng độ lệch múi giờ trước khi kiểm tra ngày trong tuần. Nếu hạn rơi vào Chủ nhật, cộng thêm 24 giờ để chuyển sang Thứ Hai cùng giờ.

6. **Xác nhận:** Trong Buổi 13, bổ sung kiểm thử hồi quy trong `tests/sla.test.js` để kiểm tra trường hợp thời gian kết thúc SLA rơi vào Chủ nhật theo giờ Việt Nam khi máy chủ sử dụng múi giờ UTC. Kết quả mong đợi là hạn cam kết được chuyển sang Thứ Hai cùng giờ. Kiểm thử SLA PASS trong lần chạy ngày 06/11/2026.

7. **Commit sửa lỗi:** [a0bbaca – Sửa SLA theo giờ Việt Nam và xử lý dữ liệu sai](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/a0bbacac40f783a624633f3358ca26aa3e213249)

---

## BUG-02 – Chưa kiểm tra đầy đủ mã thiết bị và mã nhóm sự cố khi tạo phiếu

**Mức độ:** MINOR

1. **Triệu chứng:** Dữ liệu `deviceId` hoặc `categoryId` không đúng định dạng số nguyên dương chưa được kiểm tra đầy đủ trước khi thực hiện các thao tác nghiệp vụ tạo phiếu.

2. **Cách tái lập:** Gửi yêu cầu tạo phiếu với `deviceId` hoặc `categoryId` không phải số nguyên dương, ví dụ `"abc"`, `-1` hoặc `1.5`.

3. **Khoanh vùng:** Kiểm tra hàm `createTicket()` trong `src/services/ticketService.js` và các kiểm thử nghiệp vụ trong `tests/services.test.js`.

4. **Nguyên nhân gốc:** Hàm tạo phiếu trước đây chưa kiểm tra đầy đủ kiểu dữ liệu và giá trị hợp lệ của `deviceId` và `categoryId` trước khi thực hiện các thao tác nghiệp vụ.

5. **Cách sửa:** Bổ sung kiểm tra `deviceId` và `categoryId` phải là số nguyên dương. Nếu dữ liệu không hợp lệ, Service trả lỗi `DU_LIEU_KHONG_HOP_LE` và không tiếp tục truy vấn hoặc tạo phiếu.

6. **Xác nhận:** Trong Buổi 13, bổ sung hai kiểm thử hồi quy cho trường hợp `deviceId = "abc"` và `categoryId = "abc"` trong `tests/services.test.js`. Cả hai trường hợp đều được từ chối và không gọi Repository để truy vấn hoặc lưu phiếu. Toàn bộ bộ kiểm thử tại lần chạy ngày 06/11/2026 đạt 46/46 test PASS.

7. **Commit sửa lỗi:** [3642d0e – Sửa lỗi tạo phiếu và bổ sung kiểm thử nghiệp vụ](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/3642d0ea40d3758d1831c51e5b3968d27c664c71)

---

## BUG-03 – Request tạo phiếu không có body có thể gây lỗi hệ thống

**Mức độ:** MINOR

1. **Triệu chứng:** Khi gửi yêu cầu POST `/tickets` không có phần thân request (request body), phiên bản cũ có thể phát sinh lỗi `TypeError` khi Service nhận giá trị `undefined`, dẫn đến phản hồi HTTP 500 thay vì lỗi dữ liệu đầu vào.

2. **Cách tái lập:** Gửi HTTP POST đến `/tickets` với Content-Type `application/json` nhưng không cung cấp nội dung JSON.

3. **Khoanh vùng:** Kiểm tra endpoint POST `/tickets` được khai báo trong `src/routes/tickets.js` và hàm `createTicket()` trong `src/services/ticketService.js`.

4. **Nguyên nhân gốc:** Route truyền trực tiếp `req.body` vào Service. Khi request không có body, `req.body` có thể là `undefined`; hàm Service sử dụng destructuring tham số nên có thể phát sinh lỗi khi nhận giá trị này.

5. **Cách sửa:** Bổ sung giá trị mặc định `req.body || {}` khi gọi Service tại endpoint POST `/tickets`, giúp Service nhận object rỗng và thực hiện kiểm tra dữ liệu đầu vào theo quy tắc nghiệp vụ.

6. **Xác nhận:** Bổ sung kiểm thử API trong `tests/tickets.routes.test.js` bằng Supertest. Kiểm thử xác nhận route truyền object rỗng đến Service và API trả HTTP 400 với mã `DU_LIEU_KHONG_HOP_LE`. Kiểm thử API PASS trong lần chạy ngày 06/11/2026. Service được giả lập trong kiểm thử này nên đây là kiểm thử ở mức API route, không phải kiểm thử tích hợp PostgreSQL. Toàn bộ bộ kiểm thử đạt 46/46 test PASS.

7. **Commit sửa lỗi:** [a0bbaca – Sửa SLA theo giờ Việt Nam và xử lý dữ liệu sai](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/a0bbacac40f783a624633f3358ca26aa3e213249)

---

## Tổng kết Bug Log

| Mã lỗi | Mức độ | Trạng thái |
|---|---|---|
| BUG-01 | MAJOR | Đã sửa, kiểm thử hồi quy SLA PASS |
| BUG-02 | MINOR | Đã sửa, kiểm thử hồi quy nghiệp vụ PASS |
| BUG-03 | MINOR | Đã sửa, kiểm thử API route PASS |

**Kết quả kiểm thử toàn bộ tại lần chạy ngày 06/11/2026:**

- Số lượng Test Suites: 10
- Tổng số kiểm thử: 46
- Số kiểm thử thất bại: 0
- Kết quả: 46/46 test PASS

**Ghi chú:** Các liên kết commit thể hiện những commit đã thực hiện trong quá trình phát triển. BUG-01 và BUG-03 cùng tham chiếu một commit vì hai thay đổi được ghi nhận trong cùng commit sửa lỗi.