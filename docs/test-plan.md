# TEST PLAN – SMART CRM L02

## 1. Phạm vi kiểm thử

### 1.1. Nội dung kiểm thử

Kiểm thử tập trung vào module L02 – Tiếp nhận và phân loại yêu cầu bảo hành thuộc hệ thống Smart CRM – Mekong Mobile. Mục tiêu là xác minh các chức năng đã hiện thực hoạt động đúng theo yêu cầu nghiệp vụ và thiết kế của hệ thống.

Các nội dung kiểm thử bao gồm:

- Chuẩn hóa và kiểm tra số điện thoại khách hàng theo định dạng 10 chữ số bắt đầu bằng 0.
- Tra cứu khách hàng và kiểm tra dữ liệu thiết bị.
- Xác định tình trạng bảo hành dựa trên trường `warranty_end_date`, bao gồm Còn bảo hành, Hết bảo hành và Chưa xác minh bảo hành.
- Kiểm tra dữ liệu đầu vào khi tạo phiếu bảo hành.
- Kiểm tra mức ưu tiên mặc định là Trung bình và trạng thái ban đầu là Mới khi tạo phiếu.
- Tính hạn cam kết SLA theo mức ưu tiên: Cao 24 giờ, Trung bình 72 giờ và Thấp 120 giờ; kiểm tra quy tắc điều chỉnh khi hạn rơi vào Chủ nhật.
- Xác định trạng thái phiếu sắp đến hạn và quá hạn theo thời điểm kiểm tra.
- Ánh xạ dữ liệu phiếu từ PostgreSQL sang cấu trúc dữ liệu của ứng dụng, bao gồm các trường có thể nhận giá trị `null`.
- Kiểm tra xử lý dữ liệu không hợp lệ và lỗi HTTP trong các API đã hiện thực.
- Kiểm tra khả năng chạy lại migration và seed mà không phát sinh lỗi hoặc tạo bản ghi trùng.

### 1.2. Nội dung không kiểm thử

Các nội dung sau không thuộc phạm vi kiểm thử của phiên bản prototype L02 hiện tại:

- Phân công và quản lý kỹ thuật viên.
- Quy trình sửa chữa thiết bị.
- Quản lý linh kiện.
- Thanh toán.
- Phân quyền chi tiết theo vai trò Nhân viên tiếp nhận và Quản lý trung tâm do chức năng này chưa được hiện thực đầy đủ.
- Kiểm thử tải và hiệu năng trên quy mô lớn.
- Kiểm thử chấp nhận với người dùng thực tế.
- Kiểm thử triển khai trên môi trường máy chủ production.

Các nội dung trên được loại trừ vì nằm ngoài phạm vi nghiệp vụ L02 hoặc chưa có đủ điều kiện thực hiện trong phiên bản prototype. Việc loại trừ không có nghĩa các yêu cầu này đã được kiểm thử và xác nhận đạt.

## 2. Loại kiểm thử và số lượng

### 2.1. Phân bố theo tầng kiểm thử

Kiểm thử sử dụng Jest và Supertest, được phân bố theo phạm vi kiểm tra của 12 test case trong Test Report như sau:

| Tầng kiểm thử | Nội dung | Số lượng test case |
|---|---|---:|
| Unit/Component test | Kiểm tra service, hàm nghiệp vụ, mapper và repository; sử dụng mock khi cần thiết để cô lập thành phần | 10 |
| System/API test | Kiểm tra hành vi API Route bằng Supertest với Service được giả lập | 1 |
| Kiểm thử tích hợp cơ sở dữ liệu | Kiểm tra migration và seed trên PostgreSQL với database kiểm thử | 1 |
| **Tổng cộng** | | **12** |

Lưu ý: Việc phân bố trên được xác định theo phạm vi thực tế của các test case. Các kiểm thử sử dụng mock không được xem là bằng chứng kiểm thử tích hợp đầy đủ với PostgreSQL thật.

### 2.2. Kỹ thuật thiết kế test case

Các kỹ thuật được sử dụng trong quá trình thiết kế trường hợp kiểm thử:

- **Phân vùng tương đương (Equivalence Partitioning):** Chia dữ liệu đầu vào thành các nhóm hợp lệ và không hợp lệ. Ví dụ: số điện thoại đúng định dạng và số điện thoại chứa ký tự chữ.
- **Phân tích giá trị biên (Boundary Value Analysis):** Kiểm tra các giá trị tại ranh giới và hai phía của ranh giới, ví dụ thời điểm sắp đến hạn 8 giờ, số chữ số điện thoại và thời điểm hết hạn bảo hành.
- **Kiểm thử luồng đúng:** Xác nhận nghiệp vụ hoạt động với dữ liệu hợp lệ và kết quả trả về đúng với quy tắc đã định nghĩa.
- **Kiểm thử dữ liệu sai:** Xác nhận hệ thống từ chối dữ liệu không hợp lệ, trả mã lỗi phù hợp và không thực hiện thao tác lưu ngoài dự kiến.
- **Kiểm thử bảo mật và chất lượng dữ liệu:** Kiểm tra xử lý lỗi API và các ràng buộc dữ liệu như số điện thoại, Serial/IMEI và mã phiếu duy nhất trong phạm vi đã hiện thực.
- **Kiểm thử tính tái lập:** Chạy lại migration và seed trên database kiểm thử để xác nhận không phát sinh lỗi SQL hoặc bản ghi trùng.

### 2.3. Phân nhóm test case

Test Report bao gồm năm nhóm kiểm thử theo yêu cầu:

1. **Luồng đúng:** TC-01, TC-04, TC-06, TC-07.
2. **Giá trị biên:** TC-05, TC-08, TC-09.
3. **Dữ liệu sai:** TC-02, TC-03, TC-05, TC-11.
4. **Bảo mật / chất lượng dữ liệu:** TC-03, TC-10, TC-11.
5. **Tính tái lập:** TC-12.

Một test case có thể thuộc nhiều nhóm nếu nội dung kiểm tra đáp ứng nhiều mục tiêu kiểm thử khác nhau.

## 3. Tiêu chí đánh giá thành công

Việc kiểm thử được đánh giá dựa trên các tiêu chí sau:

- Có từ 10 đến 12 test case được thực thi và ghi nhận kết quả thực tế.
- Mỗi test case có đầy đủ tám trường thông tin: Mã, Tiền điều kiện, Các bước, Dữ liệu thử, Kết quả mong đợi, Mức ưu tiên, Kết quả thực tế và PASS/FAIL.
- Các test case bao phủ đủ năm nhóm kiểm thử theo yêu cầu.
- Các quy tắc nghiệp vụ đã được hiện thực có trường hợp kiểm thử tương ứng.
- Kết quả thực tế phải được đối chiếu với kết quả mong đợi; chỉ đánh dấu PASS khi hai kết quả phù hợp.
- Bộ kiểm thử tự động có thể chạy bằng một lệnh `npm test -- --runInBand`.
- Kết quả PASS/FAIL được ghi trung thực và có ảnh chụp minh chứng phù hợp với từng trường hợp kiểm thử.
- Migration và seed có thể chạy lại trên database kiểm thử mà không phát sinh lỗi hoặc làm tăng số lượng bản ghi ngoài dự kiến.
- Các lỗi phát hiện trong quá trình kiểm thử được ghi nhận trong Bug Log với đầy đủ thông tin: triệu chứng, cách tái lập, nguyên nhân gốc, cách khắc phục, kết quả xác nhận và liên kết commit.
- Sau khi sửa lỗi, phải thực hiện lại trường hợp kiểm thử liên quan và chạy lại toàn bộ bộ kiểm thử tự động để kiểm tra ảnh hưởng.

## 4. Môi trường và dữ liệu kiểm thử

| Thành phần | Công cụ / phiên bản |
|---|---|
| Hệ điều hành | Windows |
| Runtime | Node.js 24.12.0 |
| Trình quản lý gói | npm 11.6.2 |
| Backend | Express.js |
| Cơ sở dữ liệu | PostgreSQL 18 |
| Kiểm thử tự động | Jest 30.5.2 |
| Kiểm thử API | Supertest 7.3.1 |
| Công cụ kiểm tra cơ sở dữ liệu | pgAdmin 4 |
| Công cụ gọi API thủ công | Postman |
| Môi trường phát triển | Visual Studio Code |

### 4.2. Nguồn và dữ liệu kiểm thử

Dữ liệu kiểm thử được lấy từ các nguồn sau:

- Dữ liệu khách hàng, thiết bị và nhóm sự cố được nạp từ file `src/db/migrations/002_seed.sql`.
- Database phục vụ kiểm tra migration và seed có tên `smart_crm_test`.
- Dữ liệu phiếu bảo hành và lịch sử trạng thái hiện có trong database kiểm thử được sử dụng để đối chiếu số lượng bản ghi trước và sau khi chạy migration/seed.
- Dữ liệu đầu vào của các kiểm thử đơn vị được khai báo trực tiếp trong từng file test.
- Các phụ thuộc bên ngoài được giả lập bằng mock khi cần thiết để kiểm tra riêng hành vi của service, repository hoặc API Route.

Dữ liệu kiểm thử phải phù hợp với cấu trúc năm bảng chuẩn của module L02: `customer`, `device`, `issue_category`, `ticket` và `ticket_status_log`.

### 4.3. Thiết lập và thực thi kiểm thử

Trước khi thực hiện kiểm thử, tiến hành kiểm tra môi trường và cài đặt các thư viện phụ thuộc tại thư mục gốc dự án.

**Bước 1 – Cài đặt thư viện**

Sử dụng file lock để cài đặt các phiên bản phụ thuộc đã được ghi nhận:

```bash
npm ci
```

**Bước 2 – Chạy toàn bộ kiểm thử tự động**

Thực hiện lệnh:

```bash
npm test -- --runInBand
```

Lệnh trên sử dụng Jest để thực thi các test suite theo thứ tự tuần tự, giúp kết quả kiểm thử dễ theo dõi và hạn chế xung đột tài nguyên giữa các test.

**Bước 3 – Kiểm tra migration và seed**

Kiểm thử migration và seed được thực hiện riêng trên database `smart_crm_test`, không sử dụng database vận hành `smart_crm`.

Ghi nhận số lượng bản ghi của năm bảng trước và sau mỗi lần chạy. Thực hiện chạy lại để xác nhận quá trình migration/seed không phát sinh lỗi và không tạo bản ghi trùng.

**Bước 4 – Đối chiếu kết quả**

So sánh kết quả thực tế với kết quả mong đợi trong Test Report. Ghi nhận mã trạng thái HTTP, thông báo lỗi, dữ liệu trả về hoặc thay đổi số lượng bản ghi tùy theo từng trường hợp kiểm thử.

### 4.4. Dọn dẹp và bảo vệ dữ liệu kiểm thử

- Các kiểm thử sử dụng mock không thực hiện thay đổi dữ liệu trên PostgreSQL thật.
- Kiểm thử migration và seed chỉ được thực hiện trên database `smart_crm_test`.
- Không sử dụng database vận hành `smart_crm` để thử nghiệm thao tác có khả năng thay đổi dữ liệu.
- Trước khi thực hiện kiểm thử có thay đổi dữ liệu, cần xác nhận đúng database và chuẩn bị dữ liệu kiểm thử phù hợp.
- Không xóa dữ liệu hoặc thực hiện thao tác làm thay đổi dữ liệu ngoài phạm vi kiểm thử đã xác định.

### 4.5. Lưu trữ kết quả và minh chứng

Kết quả kiểm thử được ghi nhận trong file `docs/test-report.md`, bao gồm thông tin tiền điều kiện, các bước thực hiện, dữ liệu thử, kết quả mong đợi, kết quả thực tế và trạng thái PASS/FAIL.

Ảnh chụp minh chứng được lưu trong thư mục `docs/screenshots/` của repository. Tên ảnh được đặt theo mã test case hoặc nội dung kiểm thử để thuận tiện tra cứu.

Các lỗi được phát hiện trong quá trình kiểm thử được ghi nhận trong `docs/bug-log.md`. Sau khi khắc phục, kết quả kiểm thử lại và liên kết commit tương ứng được cập nhật để bảo đảm khả năng truy vết.

Mọi kết quả kiểm thử chỉ được xác nhận sau khi thực hiện trên môi trường thực tế; không sử dụng kết quả giả định thay cho bằng chứng kiểm thử.