# Nhật ký thay đổi thiết kế

## Sau phản hồi Bài tập 1

**Buổi:** 8  
**Ngày:** 19/10/2026  
**Sinh viên:** Bùi Hoàng Khang  
**MSSV:** 2374802010207  
**Đề tài:** Smart CRM – Mekong Mobile  
**Module:** L02 – Tiếp nhận và phân loại yêu cầu bảo hành

---

## TD-01 — Bổ sung chú thích cho ERD

- **Phản hồi của GV:** ERD chưa có chú thích ký hiệu PK, FK và quan hệ 1–N.
- **Quyết định:** SỬA.
- **Lý do:** Sơ đồ cần thể hiện rõ ý nghĩa của các ký hiệu để người đọc có thể hiểu khóa chính, khóa ngoại và quan hệ giữa các bảng.
- **Ảnh hưởng:** Bổ sung chú thích PK, FK và 1–N vào ERD; cập nhật `erd.drawio` và bản ERD trong SRS.

---

## TD-02 — Bổ sung chú thích và phạm vi cho kiến trúc

- **Phản hồi của GV:** Sơ đồ kiến trúc chưa có chú thích ký hiệu, thiếu dòng NGOÀI PHẠM VI và đang có `AssignService`, `TechnicianRepository` dù phân công kỹ thuật viên không thuộc L02.
- **Quyết định:** SỬA.
- **Lý do:** Kiến trúc phải phản ánh đúng phạm vi L02. Chức năng phân công kỹ thuật viên không thuộc module hiện tại nên không được xuất hiện trong kiến trúc của L02.
- **Ảnh hưởng:** Xóa `AssignService` và `TechnicianRepository`; bổ sung khu vực `NGOÀI PHẠM VI L02`; bổ sung chú thích các lớp Presentation, Service, Repository và Database; cập nhật `architecture.drawio` và SRS.

---

## TD-03 — Đồng bộ ERD với DDL

- **Phản hồi của GV:** ERD và DDL không thống nhất. ERD có `customer.email`, `customer.segment`, `ticket.customer_id` nhưng DDL không có.
- **Quyết định:** SỬA.
- **Lý do:** DDL được chọn làm nguồn chuẩn cho mô hình dữ liệu. Các trường không tồn tại trong DDL không được xuất hiện trong ERD.
- **Ảnh hưởng:** Xóa `email`, `segment` khỏi entity `customer`; xóa `customer_id` khỏi entity `ticket`; cập nhật ERD, DDL và nội dung SRS để thống nhất. Quan hệ khách hàng – phiếu được thể hiện gián tiếp qua `ticket → device → customer`.

---

## TD-04 — Thống nhất giá trị priority và status

- **Phản hồi của GV:** DDL sử dụng `High/Medium/Low`, `New` trong khi tài liệu nghiệp vụ sử dụng tiếng Việt `Cao/Trung bình/Thấp`, `Mới`.
- **Quyết định:** SỬA.
- **Lý do:** Giá trị trong cơ sở dữ liệu phải thống nhất với User Story, Acceptance Criteria, quy tắc nghiệp vụ và giao diện.
- **Ảnh hưởng:** Thống nhất `priority` thành `Cao`, `Trung bình`, `Thấp`; thống nhất `status` thành `Mới`, `Đã phân công`, `Đang xử lý`, `Chờ linh kiện`, `Hoàn tất`, `Đã đóng`; cập nhật DDL, ERD, SRS và Wireframe.

---

## TD-05 — Đồng bộ Wireframe với DDL

- **Phản hồi của GV:** Wireframe có email, địa chỉ, ngày mua và nơi mua nhưng các trường này không có trong DDL.
- **Quyết định:** SỬA.
- **Lý do:** Giao diện không được yêu cầu hoặc hiển thị dữ liệu không thuộc mô hình dữ liệu hiện tại của L02.
- **Ảnh hưởng:** Loại bỏ email, địa chỉ, ngày mua và nơi mua khỏi Wireframe; chỉ giữ các trường được hỗ trợ bởi DDL như họ tên, số điện thoại, serial/IMEI, hạn bảo hành, mô tả lỗi, nhóm sự cố, mức ưu tiên, trạng thái và hạn cam kết.

---

## TD-06 — Bổ sung thuật ngữ nghiệp vụ và WON'T

- **Phản hồi của GV:** Bảng thuật ngữ chỉ có từ viết tắt, thiếu thuật ngữ nghiệp vụ; tài liệu chưa nêu rõ các chức năng WON'T.
- **Quyết định:** SỬA.
- **Lý do:** Thuật ngữ nghiệp vụ giúp thống nhất cách hiểu trong nhóm và với giảng viên. Phạm vi WON'T giúp xác định rõ những chức năng không thuộc L02.
- **Ảnh hưởng:** Bổ sung các thuật ngữ như Ticket/Phiếu, Hạn cam kết, Nhóm sự cố, Mức ưu tiên, Trạng thái, Xóa mềm; bổ sung mục WON'T gồm phân công kỹ thuật viên, quản lý kỹ thuật viên, sửa chữa thực tế, quản lý linh kiện và thanh toán.

---

## TD-07 — Hoàn thiện bảng truy vết

- **Phản hồi của GV:** Bảng truy vết mục 1.6 phải nối FR ↔ US ↔ UC ↔ MoSCoW.
- **Quyết định:** SỬA.
- **Lý do:** Bảng truy vết cần thể hiện mối liên hệ từ yêu cầu chức năng đến User Story, Use Case và mức ưu tiên để kiểm tra tính nhất quán của thiết kế.
- **Ảnh hưởng:** Cập nhật bảng truy vết theo cấu trúc FR → US → UC → MoSCoW; bảo đảm tất cả FR01–FR11 đều có liên kết và không còn tham chiếu đến US08.

---

## TD-08 — Chuẩn hóa luồng ngoại lệ UC03

- **Phản hồi của GV:** Luồng ngoại lệ UC03 cần đánh theo từng bước như 5a, 6a.
- **Quyết định:** SỬA.
- **Lý do:** Cách đánh số theo bước giúp xác định chính xác ngoại lệ phát sinh ở đâu trong luồng chính.
- **Ảnh hưởng:** Cập nhật luồng ngoại lệ UC03 thành:
  - 5a – Thiếu dữ liệu bắt buộc.
  - 6a – Không tính được hạn cam kết.
  - 7a – Lỗi lưu dữ liệu.
  Cập nhật Use Case Diagram/Use Case Specification trong SRS.

---

## TD-09 — Hoàn thiện phụ lục khai báo sử dụng AI

- **Phản hồi của GV:** Phụ lục AI thiếu dòng cam kết, họ tên, MSSV và ngày.
- **Quyết định:** SỬA.
- **Lý do:** Phụ lục cần thể hiện rõ trách nhiệm của người thực hiện đối với nội dung được hỗ trợ bởi công cụ AI.
- **Ảnh hưởng:** Bổ sung dòng cam kết; họ tên Bùi Hoàng Khang; MSSV 2374802010207; ngày 19/10/2026 và phần chữ ký.

---

## TD-10 — Bổ sung các file cần thiết trong repository

- **Phản hồi của GV:** Repository chưa có file `.drawio` gốc, `.gitignore` và `.env.example`.
- **Quyết định:** SỬA.
- **Lý do:** File nguồn sơ đồ cần được lưu để có thể tiếp tục chỉnh sửa ở các buổi sau. `.gitignore` giúp tránh commit các file không cần thiết và `.env.example` giúp mô tả các biến môi trường cần thiết mà không đưa thông tin bí mật vào repository.
- **Ảnh hưởng:** Bổ sung các file `.drawio` gốc cho Use Case, Architecture và ERD; bổ sung `.gitignore` và `.env.example` vào repository.

---

## TD-11 — Thống nhất quy tắc hạn cam kết

- **Phản hồi của GV:** Quy tắc QT-04 cần làm rõ trường hợp Thứ Bảy, Chủ nhật và ví dụ US06.
- **Quyết định:** SỬA.
- **Lý do:** Quy tắc tính hạn cam kết phải thống nhất giữa User Story, Acceptance Criteria và quy tắc nghiệp vụ.
- **Ảnh hưởng:** Giữ quy tắc SLA:
  - Cao: 24 giờ.
  - Trung bình: 72 giờ.
  - Thấp: 120 giờ.
  
  Khi hạn rơi vào Chủ nhật thì chuyển sang cùng giờ ngày Thứ Hai. Ví dụ: phiếu tiếp nhận lúc 10:00 Thứ Bảy, mức Cao, có hạn 24 giờ thì hạn cam kết là 10:00 Thứ Hai.

---

## TD-12 — Giữ đúng 7 User Story

- **Phản hồi của GV:** Bảng truy vết trước đó có tham chiếu US08 trong khi tài liệu yêu cầu chỉ có US01–US07.
- **Quyết định:** SỬA.
- **Lý do:** Module L02 hiện được đặc tả bằng đúng 7 User Story. Tham chiếu US08 làm sai lệch cấu trúc yêu cầu.
- **Ảnh hưởng:** Giữ đúng US01–US07; xóa toàn bộ tham chiếu US08 khỏi bảng truy vết và các phần liên quan.

---

# Kết luận sau khi xử lý phản hồi

Sau khi rà soát phản hồi BT1, các quyết định trên được sử dụng làm cơ sở cập nhật:

- `docs/srs.md`
- `docs/usecase.drawio`
- `docs/architecture.drawio`
- `docs/erd.drawio`
- Wireframe
- `db/schema.sql`
- `.gitignore`
- `.env.example`

Mục tiêu là bảo đảm SRS, sơ đồ, cơ sở dữ liệu và mã nguồn được thống nhất trước khi hiện thực module cốt lõi trong Sprint 1.


---

# Sau Sprint 2 (Buổi 10 – Workshop module mở rộng và giao diện)

**Ngày:** 24/10/2026

## TD-13 — Cắt phân quyền theo vai trò (QT-11)

- **Quyết định:** HOÃN.
- **Lý do:** Thời gian buổi 10 ưu tiên cho luồng chính, test và README.
- **Ảnh hưởng:** Chỉ có một tài khoản mẫu (cấu hình trong `.env`). API vẫn yêu cầu đăng nhập (trả 401) nhưng chưa phân biệt nhân viên tiếp nhận và quản lý. NFR03 mới đáp ứng một phần.

## TD-14 — Che số điện thoại cho mọi người dùng (QT-12)

- **Quyết định:** ĐƠN GIẢN HOÁ.
- **Lý do:** Chưa có vai trò nên chưa phân biệt được người được xem đầy đủ.
- **Ảnh hưởng:** API luôn trả `phoneMasked` (dạng `0912***678`), không trả số đầy đủ.

## TD-15 — Hạn cam kết ở màn hình 2 hiển thị sau khi tạo phiếu

- **Quyết định:** ĐƠN GIẢN HOÁ.
- **Lý do:** Tránh nhân đôi logic SLA ở frontend (nguy cơ lệch quy tắc QT-04).
- **Ảnh hưởng:** Ô hạn cam kết ở màn hình 2 chỉ đọc, hiển thị "Hệ thống tự tính khi tạo phiếu"; giá trị thật hiện ngay sau khi tạo. US06-AC1 đáp ứng một phần.

## TD-16 — Bổ sung `POST /devices` và `POST /auth/login`

- **Quyết định:** BỔ SUNG.
- **Lý do:** Khách mới chưa có thiết bị sẽ làm đứt luồng chính nếu không đăng ký được thiết bị (US02); đăng nhập cần cho yêu cầu 401 của buổi 10.
- **Ảnh hưởng:** Thêm 2 endpoint; màn hình 1 có khối "Đăng ký thiết bị" khi serial chưa tồn tại.

## TD-17 — Phân trang tối giản

- **Quyết định:** ĐƠN GIẢN HOÁ.
- **Ảnh hưởng:** Danh sách chỉ có nút Trước/Sau (20 phiếu/trang), chưa hiển thị tổng số trang/bản ghi.

## TD-18 — Hoãn các màn hình ngoài 3 wireframe

- **Quyết định:** HOÃN.
- **Ảnh hưởng:** Chưa có màn hình chi tiết phiếu và cập nhật trạng thái trên giao diện (API `PATCH`, `DELETE` đã sẵn sàng); chưa có CRUD khách hàng/thiết bị ngoài luồng tiếp nhận.
