# BUG LOG – SMART CRM L02

## 1. BUG-01 – Tính sai hạn cam kết SLA khi thời điểm kết thúc rơi vào Chủ nhật

**Mức độ:** MAJOR

**1. Triệu chứng:**

Hạn cam kết của phiếu có thể được tính sai khi thời điểm kết thúc SLA rơi vào Chủ nhật. Kết quả phụ thuộc vào múi giờ của máy chủ, không bảo đảm quy tắc nghiệp vụ theo giờ Việt Nam (UTC+7).

**2. Cách tái lập:**

Tạo một thời điểm bắt đầu SLA sao cho thời điểm kết thúc sau khi cộng thời gian SLA rơi vào Chủ nhật theo giờ Việt Nam.

Ví dụ: Với mức ưu tiên Cao (SLA 24 giờ), thời điểm bắt đầu là 00:00 Thứ Bảy theo giờ Việt Nam. Sau khi cộng 24 giờ, hạn cam kết ban đầu là 00:00 Chủ nhật. Theo quy tắc nghiệp vụ, hạn cam kết phải được chuyển sang 00:00 Thứ Hai.

**3. Khoanh vùng:**

Kiểm tra hàm `computeDeadline()` trong `src/utils/sla.js` và các phép tính ngày liên quan; đối chiếu với các kiểm thử trong `tests/sla.test.js`.

**4. Nguyên nhân gốc:**

Phiên bản cũ sử dụng `getDay()` và `setDate()` theo múi giờ cục bộ của máy chủ để xác định Chủ nhật. Vì vậy, kết quả có thể không nhất quán với múi giờ Việt Nam (UTC+7).

**5. Cách sửa:**

Chuyển sang xác định ngày theo UTC+7 bằng cách cộng độ lệch múi giờ trước khi kiểm tra ngày trong tuần. Nếu hạn cam kết rơi vào Chủ nhật, cộng thêm 24 giờ để chuyển sang Thứ Hai cùng giờ.

**6. Xác nhận:**

Bổ sung kiểm thử hồi quy trong `tests/sla.test.js` để kiểm tra trường hợp thời gian kết thúc SLA rơi vào Chủ nhật theo giờ Việt Nam khi máy chủ sử dụng múi giờ UTC.

Kiểm thử sử dụng thời điểm đầu vào được xác định theo UTC và so sánh kết quả bằng `toISOString()`, bảo đảm hạn cam kết được chuyển sang Thứ Hai cùng giờ Việt Nam mà không phụ thuộc múi giờ máy chủ.

Các kiểm thử SLA PASS trong lần chạy ngày 06/11/2026. Bộ kiểm thử hồi quy ngày 13/11/2026 tiếp tục ghi nhận toàn bộ 13 Test Suites và 72 test thành công.

**7. Commit sửa lỗi:**

[a0bbaca – Sửa SLA theo giờ Việt Nam và xử lý dữ liệu sai](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/a0bbacac40f783a624633f3358ca26aa3e213249)

---

## 2. BUG-02 – Chưa kiểm tra đầy đủ mã thiết bị và mã nhóm sự cố khi tạo phiếu

**Mức độ:** MINOR

**1. Triệu chứng:**

Dữ liệu `deviceId` hoặc `categoryId` không đúng định dạng số nguyên dương chưa được kiểm tra đầy đủ trước khi thực hiện các thao tác nghiệp vụ tạo phiếu.

**2. Cách tái lập:**

Gửi yêu cầu tạo phiếu với `deviceId` hoặc `categoryId` không phải số nguyên dương, ví dụ `"abc"`, `-1` hoặc `1.5`.

**3. Khoanh vùng:**

Kiểm tra hàm `createTicket()` trong `src/services/ticketService.js` và các kiểm thử nghiệp vụ trong `tests/services.test.js`.

**4. Nguyên nhân gốc:**

Hàm tạo phiếu trước đây chưa kiểm tra đầy đủ kiểu dữ liệu và giá trị hợp lệ của `deviceId` và `categoryId` trước khi thực hiện các thao tác nghiệp vụ.

**5. Cách sửa:**

Bổ sung kiểm tra `deviceId` và `categoryId` phải là số nguyên dương. Nếu dữ liệu không hợp lệ, Service trả lỗi `DU_LIEU_KHONG_HOP_LE` và không tiếp tục truy vấn hoặc tạo phiếu.

**6. Xác nhận:**

Bổ sung hai kiểm thử hồi quy trong `tests/services.test.js` cho trường hợp `deviceId = "abc"` và `categoryId = "abc"`.

Kết quả kiểm thử xác nhận cả hai trường hợp đều bị từ chối với mã lỗi `DU_LIEU_KHONG_HOP_LE`. Đồng thời, Repository không được gọi các hàm `findDevice()` và `create()`, bảo đảm dữ liệu không hợp lệ bị chặn trước khi truy vấn thiết bị hoặc lưu phiếu.

Cả hai kiểm thử PASS trong lần chạy ngày 06/11/2026. Bộ kiểm thử hồi quy ngày 13/11/2026 tiếp tục ghi nhận toàn bộ 13 Test Suites và 72 test thành công.

**7. Commit sửa lỗi:**

[3642d0e – Sửa lỗi tạo phiếu và bổ sung kiểm thử nghiệp vụ](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/3642d0ea40d3758d1831c51e5b3968d27c664c71)

---

## 3. BUG-03 – Request tạo phiếu không có body có thể gây lỗi hệ thống

**Mức độ:** MINOR

**1. Triệu chứng:**

Khi gửi yêu cầu `POST /tickets` không có phần thân request (request body), phiên bản cũ có thể phát sinh lỗi `TypeError` khi Service nhận giá trị `undefined`, dẫn đến phản hồi HTTP 500 thay vì lỗi dữ liệu đầu vào.

**2. Cách tái lập:**

Gửi HTTP POST đến `/tickets` với `Content-Type: application/json` nhưng không cung cấp nội dung JSON.

**3. Khoanh vùng:**

Kiểm tra endpoint POST `/tickets` được khai báo trong `src/routes/tickets.js` và hàm `createTicket()` trong `src/services/ticketService.js`.

**4. Nguyên nhân gốc:**

Route trước đây truyền trực tiếp `req.body` vào Service. Khi request không có body, `req.body` có thể là `undefined`; hàm Service sử dụng destructuring tham số nên có thể phát sinh lỗi khi nhận giá trị này.

**5. Cách sửa:**

Bổ sung giá trị mặc định `req.body || {}` khi gọi Service tại endpoint POST `/tickets`, giúp Service nhận object rỗng và thực hiện kiểm tra dữ liệu đầu vào theo quy tắc nghiệp vụ.

**6. Xác nhận:**

Bổ sung kiểm thử API trong `tests/tickets.routes.test.js` bằng Supertest. Kiểm thử xác nhận route truyền object rỗng đến Service và API trả HTTP 400 với mã lỗi `DU_LIEU_KHONG_HOP_LE`.

Kiểm thử API PASS trong lần chạy ngày 06/11/2026. Bộ kiểm thử hồi quy ngày 13/11/2026 tiếp tục ghi nhận toàn bộ 13 Test Suites và 72 test thành công.

Service được giả lập trong kiểm thử này nên đây là kiểm thử ở mức API Route, không phải kiểm thử tích hợp PostgreSQL.

**Lý do phân loại mức độ MINOR:**

Lỗi xảy ra khi request tạo phiếu không cung cấp request body. Người dùng vẫn có thể thực hiện chức năng tạo phiếu bằng cách gửi dữ liệu JSON hợp lệ. Lỗi không làm sai lệch dữ liệu đã lưu trong cơ sở dữ liệu và không gây lộ thông tin. Vì vậy, lỗi được phân loại ở mức MINOR.

**7. Commit sửa lỗi:**

[a2e5bbe – Triển khai xác thực và phân quyền theo vai trò](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/a2e5bbe)

**Commit bổ sung kiểm thử:**

[d353284 – Bổ sung kiểm thử nghiệp vụ và API cho Buổi 13](https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake/commit/d3532841da31db089414da940cfadeec63fc7ad5)

Ghi chú: Commit `a2e5bbe` đồng thời triển khai xác thực và phân quyền theo vai trò. Thay đổi `req.body || {}` tại `src/routes/tickets.js` được xác định qua kết quả `git blame`. Commit `d353284` bổ sung kiểm thử API cho trường hợp request không có body, không phải commit sửa lỗi.

---

## 4. TỔNG KẾT BUG LOG

| Mã lỗi | Mô tả lỗi | Mức độ | Trạng thái |
|---|---|---|---|
| BUG-01 | Tính sai hạn cam kết SLA khi kết thúc vào Chủ nhật | MAJOR | Đã sửa, kiểm thử hồi quy SLA PASS |
| BUG-02 | Chưa kiểm tra đầy đủ mã thiết bị và mã nhóm sự cố | MINOR | Đã sửa, kiểm thử hồi quy nghiệp vụ PASS |
| BUG-03 | Request tạo phiếu không có body có thể gây lỗi hệ thống | MINOR | Đã sửa, kiểm thử API Route PASS |

### 4.1. Kết quả kiểm thử toàn bộ

**Lần kiểm thử ngày 06/11/2026:**

- Số lượng Test Suites: 10.
- Tổng số kiểm thử: 46.
- Số kiểm thử thất bại: 0.
- Số kiểm thử thành công: 46.
- Kết quả: **46/46 test PASS**.

**Lần kiểm thử hồi quy ngày 13/11/2026:**

- Số lượng Test Suites: 13.
- Tổng số kiểm thử: 72.
- Số kiểm thử thất bại: 0.
- Số kiểm thử thành công: 72.
- Kết quả: **72/72 test PASS**.
- Thời gian thực thi: 1.278 giây.

Ảnh minh chứng lần chạy hồi quy ngày 13/11/2026 được lưu tại:

`docs/screenshots/REGRESSION_2026-11-13.png`

### 4.2. Ghi chú

Các liên kết commit thể hiện những thay đổi đã thực hiện trong quá trình phát triển và sửa lỗi.

- BUG-01 tham chiếu commit `a0bbacac40f783a624633f3358ca26aa3e213249`.
- BUG-02 tham chiếu commit `3642d0ea40d3758d1831c51e5b3968d27c664c71`.
- BUG-03 tham chiếu commit `a2e5bbe` là commit chứa thay đổi khắc phục tại route; commit `d353284` là commit bổ sung kiểm thử API.

Các kết quả kiểm thử được ghi nhận dựa trên những lần chạy thực tế. Những kiểm thử sử dụng mock (giả lập thành phần phụ thuộc) được phân biệt với kiểm thử tương tác cơ sở dữ liệu PostgreSQL.

Kết quả 72/72 test PASS là kết quả kiểm thử tự động toàn bộ bộ test hiện có, không đồng nghĩa với việc tất cả các kiểm thử đều được thực hiện trực tiếp trên PostgreSQL thật.