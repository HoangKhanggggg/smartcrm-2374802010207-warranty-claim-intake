# TRƯỜNG ĐẠI HỌC VĂN LANG
# KHOA CÔNG NGHỆ THÔNG TIN

## BÁO CÁO CHUYÊN ĐỀ TỐT NGHIỆP 1

**Ngành:** Công nghệ thông tin  
**Chuyên ngành:** SE – Kỹ thuật phần mềm

# SRS — L02: TIẾP NHẬN VÀ PHÂN LOẠI YÊU CẦU BẢO HÀNH

**Sinh viên thực hiện:** Bùi Hoàng Khang  
**MSSV:** 2374802010207  
**GitHub Repository:** https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake  
**Giảng viên hướng dẫn:** ThS. Nguyễn Minh Tân

**TP. Hồ Chí Minh – năm 2026**

---

# MỤC LỤC

**Mục 1. BẢN SRS RÚT GỌN**

1.1. Giới thiệu, phạm vi và thuật ngữ  
1.2. Các bên liên quan và vai trò người dùng  
1.3. User Story và tiêu chí chấp nhận  
1.4. Yêu cầu chức năng – FR  
1.5. Yêu cầu phi chức năng – NFR  
1.6. Ràng buộc và quy tắc nghiệp vụ  
1.7. Bảng truy vết yêu cầu  

**Mục 2. USE CASE**

2.1. Danh sách Use Case  
2.2. Mô tả Use Case Diagram  
2.3. Đặc tả Use Case quan trọng nhất  

**Mục 3. THIẾT KẾ KIẾN TRÚC**

3.1. Kiến trúc hệ thống  
3.2. Luồng xử lý tạo phiếu  
3.3. Ba lập luận thiết kế theo NFR  

**Mục 4. MÔ HÌNH DỮ LIỆU – ERD VÀ SQL DDL**

4.1. Xác định bảng dữ liệu  
4.2. Quan hệ giữa các bảng  
4.3. SQL DDL tham chiếu cho PostgreSQL 18  
4.4. Nguyên tắc đồng bộ dữ liệu  

**Mục 5. WIREFRAME**

5.1. Màn hình tra cứu khách hàng và thiết bị  
5.2. Màn hình tiếp nhận và phân loại yêu cầu  
5.3. Màn hình danh sách phiếu bảo hành  

**PHỤ LỤC. BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI**

---

# MỤC 1. BẢN SRS RÚT GỌN

## 1.1. Giới thiệu, phạm vi và thuật ngữ

### 1.1.1. Giới thiệu

L02 – Tiếp nhận và phân loại yêu cầu bảo hành là một luồng nghiệp vụ thuộc hệ thống Smart CRM của Mekong Mobile. Luồng này tập trung vào việc ghi nhận thông tin thiết bị, mô tả lỗi, tạo phiếu bảo hành, lựa chọn mức ưu tiên và quản lý thông tin phiếu.

Hệ thống sử dụng mã phiếu duy nhất để nhận diện từng yêu cầu. Mỗi phiếu liên kết với một thiết bị và có thể liên kết với một nhóm sự cố. Khi tạo phiếu, hệ thống xác định trạng thái ban đầu, thời điểm tiếp nhận và hạn cam kết theo mức ưu tiên.

Phiên bản đang triển khai sử dụng Node.js, Express và PostgreSQL 18. Backend cung cấp API để tạo, xem danh sách, xem chi tiết và cập nhật phiếu bảo hành. Các chức năng mở rộng như xác thực người dùng, phân quyền, giao diện hoàn chỉnh, cảnh báo hạn và kiểm soát xóa dữ liệu cần được kiểm thử riêng trước khi xác nhận đã hoàn thành.

### 1.1.2. Mục tiêu

- Chuẩn hóa việc tiếp nhận yêu cầu bảo hành.
- Lưu thông tin phiếu bảo hành trong cơ sở dữ liệu có cấu trúc.
- Bảo đảm mã phiếu duy nhất và dữ liệu liên kết hợp lệ.
- Hỗ trợ phân loại sự cố và lựa chọn mức ưu tiên.
- Tự động tính hạn cam kết theo quy tắc SLA đã thống nhất.
- Hỗ trợ truy vấn, cập nhật và theo dõi trạng thái phiếu.
- Tạo cơ sở để mở rộng chức năng cảnh báo quá hạn và phân quyền trong các giai đoạn tiếp theo.

### 1.1.3. Phạm vi hệ thống

**Trong phạm vi nghiệp vụ:**

- Quản lý hồ sơ khách hàng.
- Ghi nhận và tra cứu thiết bị bằng serial/IMEI.
- Lưu ngày hết hạn bảo hành của thiết bị.
- Tiếp nhận mô tả lỗi và tạo phiếu bảo hành.
- Sinh mã phiếu duy nhất.
- Lựa chọn nhóm sự cố.
- Lựa chọn mức ưu tiên Cao, Trung bình hoặc Thấp.
- Tính hạn cam kết theo mức ưu tiên và quy tắc SLA.
- Xem danh sách, xem chi tiết và cập nhật phiếu.
- Ghi nhận trạng thái và lịch sử thay đổi trạng thái.
- Xác định phiếu sắp đến hạn hoặc quá hạn.

**Trong phạm vi triển khai hiện tại:**

- Backend Node.js và Express.
- Kết nối PostgreSQL 18 qua thư viện `pg`.
- Các bảng `customer`, `device`, `issue_category`, `ticket`, `ticket_status_log`.
- API Ticket gồm tạo phiếu, lấy danh sách, lấy chi tiết, cập nhật và endpoint DELETE.
- Logic tính hạn cam kết theo mức ưu tiên.
- Kiểm thử thực tế thành công với các thao tác GET, POST và PATCH trên phiếu bảo hành.

**Ngoài phạm vi phiên bản hiện tại:**

- Phân công kỹ thuật viên và quản lý năng lực kỹ thuật viên.
- Quản lý quá trình sửa chữa thực tế.
- Quản lý kho và đặt linh kiện.
- Thanh toán và hoàn tất giao dịch sửa chữa.
- Tích hợp hệ thống quản lý cửa hàng hoặc cổng thanh toán bên ngoài.
- Báo cáo thống kê nâng cao.
- Xác thực và phân quyền hoàn chỉnh nếu chưa được triển khai và kiểm thử.
- Tác vụ lập lịch tự động gửi cảnh báo nếu chưa được triển khai.

Các chức năng nằm ngoài phạm vi triển khai hiện tại có thể được thực hiện trong các giai đoạn tiếp theo.

### 1.1.4. Công nghệ sử dụng

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| Backend | Node.js | Môi trường thực thi JavaScript phía máy chủ |
| API | Express | Khai báo và xử lý các endpoint HTTP |
| Truy cập dữ liệu | Thư viện `pg` | Kết nối và truy vấn PostgreSQL |
| Cơ sở dữ liệu | PostgreSQL 18 | Lưu trữ dữ liệu nghiệp vụ |
| Quản trị cơ sở dữ liệu | pgAdmin | Truy vấn và kiểm tra dữ liệu |
| Quản lý mã nguồn | Git, GitHub | Theo dõi phiên bản và lưu trữ mã nguồn |
| Kiểm thử API | PowerShell, HTTP requests | Kiểm tra phản hồi và dữ liệu trả về |

Lưu ý: `src/backend` có bộ khung Spring Boot riêng. Tài liệu này lấy backend Node.js tại `src/app.js` làm backend chính của phiên bản đã kiểm thử. Không sử dụng kiến trúc Spring Boot làm kiến trúc triển khai chính nếu chưa chuyển đổi và xác nhận lại dự án.

### 1.1.5. Bảng thuật ngữ

| Thuật ngữ | Ý nghĩa |
|---|---|
| CRM | Hệ thống quản lý quan hệ khách hàng |
| L02 | Luồng tiếp nhận và phân loại yêu cầu bảo hành |
| SRS | Tài liệu đặc tả yêu cầu phần mềm |
| US | User Story – câu chuyện người dùng |
| FR | Functional Requirement – yêu cầu chức năng |
| NFR | Non-functional Requirement – yêu cầu phi chức năng |
| UC | Use Case – trường hợp sử dụng |
| MoSCoW | Phương pháp phân loại mức độ ưu tiên yêu cầu |
| Ticket/Phiếu | Hồ sơ điện tử đại diện cho một yêu cầu bảo hành |
| SLA | Quy tắc xác định hạn cam kết xử lý |
| Nhóm sự cố | Danh mục phân loại lỗi thiết bị |
| Mức ưu tiên | Cao, Trung bình hoặc Thấp |
| Trạng thái | Giai đoạn xử lý hiện tại của phiếu |
| PK/FK | Khóa chính/khóa ngoại |
| ERD | Sơ đồ thực thể liên kết dữ liệu |
| DDL | Câu lệnh định nghĩa cấu trúc cơ sở dữ liệu |
| API | Giao diện lập trình ứng dụng |
| CRUD | Tạo, đọc, cập nhật và xóa dữ liệu |
| Soft delete | Xóa mềm, đánh dấu không còn sử dụng thay vì xóa vật lý |

## 1.2. Các bên liên quan và vai trò người dùng

| Actor | Vai trò |
|---|---|
| Nhân viên tiếp nhận | Tra cứu thông tin khách hàng và thiết bị, nhập mô tả lỗi, tạo phiếu và lựa chọn mức ưu tiên. |
| Quản lý trung tâm | Xem và lọc danh sách phiếu, theo dõi trạng thái và các phiếu cần chú ý. |
| Tác vụ lập lịch | Kiểm tra hạn cam kết theo chu kỳ và kích hoạt cảnh báo nếu chức năng này được triển khai. |

Tác vụ lập lịch là tác nhân kỹ thuật, không phải người dùng đăng nhập.

Ở phiên bản hiện tại, các vai trò trên được xác định ở mức nghiệp vụ. Không được xem việc xác định Actor trong SRS là bằng chứng rằng chức năng đăng nhập và phân quyền đã được triển khai.

## 1.3. User Story và tiêu chí chấp nhận

### 1.3.1. Danh sách User Story

| Mã | User Story | Actor | MoSCoW |
|---|---|---|---|
| US01 | Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng bằng số điện thoại và tạo hồ sơ mới nếu chưa tồn tại, để hạn chế dữ liệu khách hàng trùng lặp. | Nhân viên tiếp nhận | MUST |
| US02 | Là nhân viên tiếp nhận, tôi muốn tra cứu thiết bị bằng serial/IMEI và xem thông tin bảo hành, để xác định thiết bị trước khi tạo phiếu. | Nhân viên tiếp nhận | MUST |
| US03 | Là nhân viên tiếp nhận, tôi muốn nhập mô tả lỗi và tạo phiếu bảo hành có mã duy nhất, để lưu lại yêu cầu của khách hàng. | Nhân viên tiếp nhận | MUST |
| US04 | Là nhân viên tiếp nhận, tôi muốn chọn nhóm sự cố từ danh mục có sẵn, để thống nhất cách phân loại yêu cầu. | Nhân viên tiếp nhận | SHOULD |
| US05 | Là nhân viên tiếp nhận, tôi muốn chọn mức ưu tiên Cao, Trung bình hoặc Thấp, để xác định hạn cam kết phù hợp. | Nhân viên tiếp nhận | MUST |
| US06 | Là nhân viên tiếp nhận, tôi muốn hệ thống tự tính và hiển thị hạn cam kết theo mức ưu tiên, để tránh tính toán thủ công. | Nhân viên tiếp nhận | MUST |
| US07 | Là quản lý trung tâm, tôi muốn xem và lọc danh sách phiếu theo trạng thái, nhóm sự cố và mức ưu tiên, để theo dõi tình hình tiếp nhận và các phiếu cần chú ý. | Quản lý trung tâm | MUST |

**Giải thích mức ưu tiên:** US05 và US06 được nâng thành MUST vì mã nguồn hiện tại đã có xử lý mức ưu tiên và tính hạn cam kết. Việc hoàn thiện đầy đủ quy tắc loại trừ Chủ nhật vẫn cần được kiểm thử riêng.

### 1.3.2. Tiêu chí chấp nhận – US01

**AC1 – Tra cứu khách hàng đã tồn tại**

- Given số điện thoại khách hàng đã tồn tại.
- When nhân viên nhập số điện thoại hợp lệ và tìm kiếm.
- Then hệ thống trả về hồ sơ hiện có và không tạo bản ghi khách hàng trùng.

**AC2 – Tạo khách hàng mới**

- Given số điện thoại hợp lệ chưa tồn tại.
- When nhân viên nhập họ tên và lưu hồ sơ.
- Then hệ thống tạo khách hàng mới và có thể sử dụng hồ sơ này khi lập phiếu.

**AC3 – Số điện thoại không hợp lệ**

- Given số điện thoại không đáp ứng quy tắc định dạng đã cấu hình.
- When nhân viên tìm kiếm.
- Then hệ thống thông báo dữ liệu không hợp lệ và không tạo hồ sơ mới.

### 1.3.3. Tiêu chí chấp nhận – US02

**AC1 – Thiết bị có dữ liệu bảo hành**

- Given thiết bị có serial/IMEI hợp lệ và có ngày hết hạn bảo hành.
- When nhân viên tra cứu thiết bị.
- Then hệ thống xác định tình trạng bảo hành dựa trên ngày hiện tại và `warranty_end_date`.

**AC2 – Chưa xác minh bảo hành**

- Given thiết bị chưa có `warranty_end_date`.
- When nhân viên tra cứu thiết bị.
- Then hệ thống hiển thị “Chưa xác minh bảo hành”; không tự kết luận thiết bị còn bảo hành.

**AC3 – Serial/IMEI trùng**

- Given serial/IMEI đã tồn tại.
- When nhân viên tạo thiết bị trùng.
- Then hệ thống từ chối tạo dữ liệu trùng.

### 1.3.4. Tiêu chí chấp nhận – US03

**AC1 – Tạo phiếu thành công**

- Given `deviceId` hợp lệ và mô tả lỗi không rỗng.
- When nhân viên gửi yêu cầu tạo phiếu.
- Then hệ thống sinh mã phiếu, đặt trạng thái “Mới”, xác định mức ưu tiên, tính hạn cam kết và lưu dữ liệu.

**AC2 – Thiếu dữ liệu bắt buộc**

- Given yêu cầu không có thiết bị hoặc mô tả lỗi rỗng.
- When nhân viên tạo phiếu.
- Then hệ thống từ chối yêu cầu và trả về thông báo lỗi phù hợp.

**AC3 – Lưu thất bại**

- Given dữ liệu đầu vào hợp lệ.
- When cơ sở dữ liệu không thể lưu phiếu.
- Then hệ thống không trả về kết quả tạo phiếu thành công và phải xử lý giao dịch để tránh dữ liệu không nhất quán.

**AC4 – Mã phiếu trùng**

- Given mã phiếu đã tồn tại.
- When hệ thống thử lưu phiếu mới.
- Then cơ sở dữ liệu phải ngăn việc tạo mã trùng và ứng dụng phải xử lý lỗi phù hợp.

### 1.3.5. Tiêu chí chấp nhận – US04

**AC1 – Chọn nhóm sự cố**

- Given nhân viên đang lập phiếu.
- When nhân viên mở danh mục nhóm sự cố.
- Then hệ thống cung cấp các nhóm đã được cấu hình, ví dụ Màn hình, Pin, Sạc, Phần mềm, Nước vào và Khác.

**AC2 – Chưa phân loại**

- Given nhân viên chưa chọn nhóm sự cố.
- When phiếu được tạo.
- Then hệ thống cho phép `category_id` nhận giá trị NULL theo quy tắc nghiệp vụ.

### 1.3.6. Tiêu chí chấp nhận – US05

**AC1 – Mức ưu tiên hợp lệ**

- Given nhân viên tạo hoặc cập nhật phiếu.
- When nhân viên chọn mức ưu tiên.
- Then chỉ chấp nhận Cao, Trung bình hoặc Thấp.

**AC2 – Mức ưu tiên mặc định**

- Given nhân viên tạo phiếu mà không chỉ định mức ưu tiên.
- When hệ thống xử lý yêu cầu.
- Then mức ưu tiên mặc định là Trung bình.

### 1.3.7. Tiêu chí chấp nhận – US06

**AC1 – Tính hạn cam kết**

- Given phiếu có mức ưu tiên hợp lệ.
- When hệ thống tính hạn cam kết.
- Then áp dụng thời lượng SLA tương ứng: Cao 24 giờ, Trung bình 72 giờ, Thấp 120 giờ.

**AC2 – Thay đổi mức ưu tiên**

- Given phiếu đã tồn tại và có mức ưu tiên.
- When mức ưu tiên thay đổi.
- Then hệ thống tính lại hạn cam kết theo quy tắc được thống nhất.

**AC3 – Loại trừ Chủ nhật**

- Given hạn SLA đi qua Chủ nhật.
- When hệ thống tính hạn theo QT-04.
- Then toàn bộ khoảng thời gian Chủ nhật phải được loại trừ khỏi thời lượng SLA.

**AC4 – Kiểm thử ranh giới**

- Given phiếu được tiếp nhận lúc 10:00 Thứ Bảy với SLA 24 giờ.
- When áp dụng quy tắc loại trừ toàn bộ Chủ nhật.
- Then hạn cam kết là 10:00 Thứ Hai.

Tiêu chí AC3 và AC4 là yêu cầu nghiệm thu. Mã nguồn hiện tại cần được điều chỉnh và kiểm thử bổ sung trước khi xác nhận đáp ứng hoàn toàn.

### 1.3.8. Tiêu chí chấp nhận – US07

**AC1 – Hiển thị danh sách**

- Given người dùng truy vấn danh sách phiếu.
- When API xử lý yêu cầu.
- Then hệ thống trả về dữ liệu phiếu hiện có.

**AC2 – Lọc danh sách**

- Given người dùng chọn các điều kiện lọc.
- When gửi yêu cầu truy vấn.
- Then hệ thống chỉ trả về các phiếu phù hợp với các điều kiện đã áp dụng.

**AC3 – Không có kết quả**

- Given không có phiếu thỏa mãn điều kiện.
- When hệ thống trả kết quả.
- Then trả về danh sách rỗng hoặc thông báo không có dữ liệu phù hợp.

**AC4 – Giới hạn và phân trang**

- Given số lượng phiếu vượt quá giới hạn hiển thị.
- When người dùng truy vấn danh sách.
- Then hệ thống phải hỗ trợ giới hạn kết quả và phân trang theo cấu hình triển khai.

Giới hạn 20 phiếu mỗi trang chỉ được xem là yêu cầu nghiệm thu khi chức năng phân trang đã được bổ sung và kiểm thử.

## 1.4. Yêu cầu chức năng – FR

| Mã | Yêu cầu chức năng | US liên quan | Trạng thái triển khai |
|---|---|---|---|
| FR01 | Tra cứu khách hàng bằng số điện thoại và trả về hồ sơ phù hợp. | US01 | Cần xác minh API Customer |
| FR02 | Tạo khách hàng mới khi số điện thoại chưa tồn tại. | US01 | Cần xác minh API Customer |
| FR03 | Ghi nhận và tra cứu thiết bị bằng serial/IMEI. | US02 | Cần xác minh API Device |
| FR04 | Xác định tình trạng bảo hành từ `warranty_end_date`. | US02 | Cần hoàn thiện và kiểm thử |
| FR05 | Tiếp nhận mô tả lỗi và lưu vào phiếu. | US03 | Đã kiểm thử qua POST |
| FR06 | Tạo mã phiếu duy nhất và đặt trạng thái ban đầu là “Mới”. | US03 | Đã kiểm thử qua POST |
| FR07 | Cung cấp danh mục nhóm sự cố và cho phép chọn nhóm. | US04 | Có cấu trúc dữ liệu; API cần xác minh |
| FR08 | Chỉ chấp nhận ba mức ưu tiên Cao, Trung bình, Thấp. | US05 | Đã kiểm thử một số trường hợp |
| FR09 | Tính hạn cam kết theo mức ưu tiên và quy tắc SLA. | US06 | Đã kiểm thử tính hạn cơ bản; quy tắc Chủ nhật cần hoàn thiện |
| FR10 | Xem danh sách, xem chi tiết và lọc phiếu bảo hành. | US07 | GET danh sách và chi tiết đã kiểm thử; lọc cần xác minh |
| FR11 | Nhận diện phiếu sắp đến hạn hoặc quá hạn theo QT-13. | US07 | Cần triển khai hoặc xác minh |
| FR12 | Ghi nhận trạng thái ban đầu và lịch sử thay đổi trạng thái. | US03, US07 | Trạng thái đã kiểm thử; lịch sử cần xác minh trong database |

Trạng thái triển khai trong bảng phản ánh các kết quả kiểm thử hiện có, không thay thế cho việc kiểm thử toàn bộ tiêu chí chấp nhận.

## 1.5. Yêu cầu phi chức năng – NFR

| Mã | Nhóm | Yêu cầu | Cách kiểm tra |
|---|---|---|---|
| NFR01 | Hiệu năng | 95% thao tác tra cứu khách hàng/thiết bị phản hồi không quá 2 giây khi có 50 người dùng đồng thời. | Kiểm thử tải, ghi nhận phân vị 95 của thời gian phản hồi. |
| NFR02 | Toàn vẹn dữ liệu | 100% phiếu tạo thành công có mã duy nhất, thiết bị hợp lệ, mô tả lỗi không rỗng và trạng thái hợp lệ. | Kiểm thử dữ liệu đầu vào, khóa và ràng buộc cơ sở dữ liệu. |
| NFR03 | Bảo mật | API cần bảo vệ dữ liệu phải xác thực và kiểm tra quyền theo vai trò trước khi xử lý yêu cầu. | Kiểm thử người dùng hợp lệ, không xác thực và không đủ quyền. |
| NFR04 | Khả năng sử dụng | Người dùng thử nghiệm hoàn thành quy trình tạo phiếu trong tối đa 3 phút sau hướng dẫn ngắn. | Kiểm thử theo kịch bản với người dùng thử nghiệm. |

Các NFR trên là mục tiêu nghiệm thu. Chưa có kết quả kiểm thử tải, usability hoặc bảo mật thì không được kết luận rằng hệ thống đã đạt các ngưỡng tương ứng.

## 1.6. Ràng buộc và quy tắc nghiệp vụ

| Mã | Quy tắc nghiệp vụ | Áp dụng |
|---|---|---|
| QT-01 | Số điện thoại khách hàng phải duy nhất sau khi chuẩn hóa. | FR01, FR02 |
| QT-02 | Chuẩn hóa số điện thoại theo quy tắc thống nhất, xử lý đầu số Việt Nam và ký tự phân cách trước khi kiểm tra. | FR01, FR02 |
| QT-03 | Mỗi thiết bị có serial/IMEI duy nhất và liên kết với một khách hàng. | FR03 |
| QT-04 | SLA cơ bản: Cao 24 giờ, Trung bình 72 giờ, Thấp 120 giờ. Toàn bộ thời gian Chủ nhật được loại trừ khi tính SLA. | FR09 |
| QT-05 | Nếu có `warranty_end_date`, xác định tình trạng bảo hành theo ngày hiện tại và ngày hết hạn. Nếu giá trị rỗng, hiển thị “Chưa xác minh bảo hành”. | FR04 |
| QT-06 | Vòng đời trạng thái gồm Mới → Đã phân công → Đang xử lý → Chờ linh kiện → Hoàn tất → Đã đóng. Mỗi lần thay đổi trạng thái phải ghi một bản ghi lịch sử gồm phiếu, trạng thái và thời điểm thay đổi. | FR06, FR12 |
| QT-07 | Phiếu liên kết với khách hàng thông qua thiết bị: `ticket.device_id` → `device.device_id` → `customer.customer_id`. Không thêm `ticket.customer_id` vì sẽ tạo dữ liệu dư thừa. | FR03, FR05, FR06 |
| QT-08 | Mức ưu tiên chỉ nhận Cao, Trung bình hoặc Thấp. Mặc định là Trung bình. | FR08, FR09 |
| QT-09 | `category_id` có thể NULL khi phiếu chưa được phân loại. | FR07 |
| QT-10 | Không xóa vật lý phiếu trong quy trình nghiệp vụ. Nếu cần loại bỏ phiếu khỏi danh sách hoạt động, sử dụng cơ chế xóa mềm hoặc trạng thái nghiệp vụ phù hợp. | FR10, FR12 |
| QT-11 | Quyền truy cập được kiểm tra ở máy chủ. Nhân viên tiếp nhận và quản lý có quyền khác nhau theo nhiệm vụ. | NFR03 |
| QT-12 | Số điện thoại được che một phần khi hiển thị cho vai trò không được cấp quyền xem đầy đủ. | NFR03 |
| QT-13 | Phiếu sắp đến hạn là phiếu còn không quá 8 giờ đến hạn. Phiếu quá hạn là phiếu đã vượt hạn cam kết. Hai nhóm đều loại trừ phiếu Hoàn tất và Đã đóng. Ngưỡng 8 giờ có thể cấu hình. | FR11 |

**Lưu ý về QT-04:** Hàm SLA hiện tại trong `src/utils/sla.js` chỉ cộng số giờ và chuyển hạn sang ngày Thứ Hai nếu hạn rơi vào Chủ nhật. Cách xử lý này chưa tương đương với việc loại trừ toàn bộ thời gian Chủ nhật. Cần cập nhật hàm SLA và viết kiểm thử cho các trường hợp đi qua Chủ nhật.

**Lưu ý về QT-06:** Việc API trả về trạng thái mới không tự chứng minh rằng lịch sử đã được ghi. Cần kiểm tra `ticket_status_log` sau khi tạo phiếu và cập nhật trạng thái.

**Lưu ý về QT-10:** Backend có khai báo endpoint DELETE. Cần kiểm tra nội dung `src/routes/tickets.js` và xử lý được gọi bên trong để xác nhận endpoint này có xóa vật lý hay không. Không tuyên bố đã tuân thủ QT-10 nếu chưa xác minh.

## 1.7. Bảng truy vết yêu cầu

| FR | US | UC | MoSCoW |
|---|---|---|---|
| FR01 | US01 | UC01 | MUST |
| FR02 | US01 | UC02 | MUST |
| FR03 | US02 | UC03 | MUST |
| FR04 | US02 | UC03 | MUST |
| FR05 | US03 | UC03 | MUST |
| FR06 | US03 | UC03 | MUST |
| FR07 | US04 | UC04 | SHOULD |
| FR08 | US05 | UC05 | MUST |
| FR09 | US06 | UC05, UC06 | MUST |
| FR10 | US07 | UC07 | MUST |
| FR11 | US07 | UC08 | MUST |
| FR12 | US03, US07 | UC03, UC07 | MUST |

### Đối chiếu vấn đề nghiệp vụ

- **V1 – Hồ sơ khách hàng bị trùng:** giải quyết bằng US01, FR01, FR02 và ràng buộc duy nhất số điện thoại.
- **V2 – Khó theo dõi trạng thái và hạn xử lý:** giải quyết bằng US03, US06, US07 và FR09, FR11, FR12.
- **V8 – Mô tả lỗi tự do gây khó thống kê:** cải thiện bằng US04 và FR07 thông qua danh mục nhóm sự cố.

---

# MỤC 2. USE CASE

## 2.1. Danh sách Use Case

| Mã UC | Tên Use Case | Actor chính |
|---|---|---|
| UC01 | Tra cứu khách hàng | Nhân viên tiếp nhận |
| UC02 | Tạo hồ sơ khách hàng | Nhân viên tiếp nhận |
| UC03 | Ghi nhận thiết bị và tạo phiếu bảo hành | Nhân viên tiếp nhận |
| UC04 | Chọn nhóm sự cố | Nhân viên tiếp nhận |
| UC05 | Chọn mức ưu tiên | Nhân viên tiếp nhận |
| UC06 | Tính hạn cam kết | Nhân viên tiếp nhận |
| UC07 | Xem và lọc danh sách phiếu | Quản lý trung tâm |
| UC08 | Nhận diện phiếu sắp đến hạn hoặc quá hạn | Quản lý trung tâm, tác vụ lập lịch |

## 2.2. Mô tả Use Case Diagram

Ranh giới hệ thống là **Smart CRM – L02: Tiếp nhận và phân loại yêu cầu bảo hành**.

Các tác nhân được đặt bên ngoài ranh giới hệ thống; các Use Case được đặt bên trong. Các đường kết nối biểu diễn quan hệ giữa tác nhân và chức năng.

- Nhân viên tiếp nhận tham gia UC01, UC02, UC03, UC04, UC05 và UC06.
- Quản lý trung tâm tham gia UC07 và UC08.
- Tác vụ lập lịch tham gia UC08 khi chức năng kiểm tra hạn tự động được triển khai.

UC03 có thể sử dụng UC04, UC05 và UC06 như các bước nghiệp vụ hỗ trợ. Nếu dùng quan hệ `include` trong sơ đồ, phải thể hiện đúng việc bước được gọi là bắt buộc; không dùng `extend` chỉ để trang trí sơ đồ.

## 2.3. Đặc tả Use Case quan trọng nhất

| Thuộc tính | Nội dung |
|---|---|
| Mã Use Case | UC03 |
| Tên | Ghi nhận thiết bị và tạo phiếu bảo hành |
| Actor chính | Nhân viên tiếp nhận |
| Tiền điều kiện | Thiết bị đã được xác định và có ID hợp lệ; mô tả lỗi được nhập. |
| Hậu điều kiện thành công | Phiếu được lưu với mã duy nhất, liên kết thiết bị, mức ưu tiên, trạng thái ban đầu và hạn cam kết. |
| Hậu điều kiện thất bại | Không trả về kết quả tạo phiếu thành công; hệ thống thông báo lỗi và xử lý giao dịch phù hợp. |

### Luồng chính

1. Nhân viên mở chức năng tạo phiếu bảo hành.
2. Hệ thống tiếp nhận ID thiết bị đã xác định.
3. Nhân viên nhập mô tả lỗi.
4. Nhân viên chọn nhóm sự cố nếu có.
5. Nhân viên chọn mức ưu tiên hoặc sử dụng mặc định Trung bình.
6. Hệ thống kiểm tra dữ liệu đầu vào.
7. Hệ thống kiểm tra thiết bị có tồn tại trong cơ sở dữ liệu.
8. Hệ thống kiểm tra nhóm sự cố nếu được cung cấp.
9. Hệ thống sinh mã phiếu duy nhất.
10. Hệ thống tính hạn cam kết.
11. Hệ thống lưu phiếu với trạng thái ban đầu “Mới”.
12. Hệ thống ghi nhận lịch sử trạng thái ban đầu theo QT-06.
13. Hệ thống trả về thông tin phiếu vừa tạo.

### Luồng ngoại lệ

**E1 – Thiếu mô tả lỗi hoặc thiết bị:** Hệ thống từ chối yêu cầu và trả về thông báo dữ liệu không hợp lệ.

**E2 – Thiết bị không tồn tại:** Hệ thống trả về lỗi phù hợp và không tạo phiếu.

**E3 – Nhóm sự cố không hợp lệ:** Hệ thống từ chối yêu cầu nếu `category_id` không tồn tại.

**E4 – Mức ưu tiên không hợp lệ:** Hệ thống từ chối giá trị nằm ngoài Cao, Trung bình và Thấp.

**E5 – Không tính được hạn cam kết:** Hệ thống không trả về thành công và thông báo lỗi cấu hình SLA.

**E6 – Lỗi lưu dữ liệu:** Hệ thống xử lý giao dịch để không để lại phiếu được tạo dở dang. Việc ghi phiếu và lịch sử trạng thái cần được thực hiện trong cùng giao dịch nếu cả hai thao tác cùng thuộc một nghiệp vụ.

---

# MỤC 3. THIẾT KẾ KIẾN TRÚC

## 3.1. Kiến trúc hệ thống

Kiến trúc thực tế của backend chính được tổ chức theo các lớp sau:

| Thành phần | Trách nhiệm | Vị trí tham chiếu |
|---|---|---|
| API/HTTP | Nhận yêu cầu HTTP và trả kết quả JSON. | `src/app.js` |
| Routes | Khai báo endpoint và kết nối yêu cầu với xử lý nghiệp vụ. | `src/routes/tickets.js` |
| Services | Kiểm tra dữ liệu, áp dụng quy tắc nghiệp vụ và tính hạn cam kết. | `src/services/ticketService.js` |
| Repositories | Thực hiện truy vấn, thêm và cập nhật dữ liệu. | `src/repositories/ticketRepository.js` |
| Database connection | Quản lý kết nối PostgreSQL thông qua connection pool. | `src/db/index.js` |
| SLA utility | Tính hạn cam kết theo mức ưu tiên. | `src/utils/sla.js` |
| PostgreSQL | Lưu dữ liệu khách hàng, thiết bị, nhóm sự cố, phiếu và lịch sử trạng thái. | Database `smart_crm` |

Luồng xử lý:

**Client → Express Routes → Service → Repository → PostgreSQL**

Khi trả kết quả, dữ liệu đi ngược từ PostgreSQL qua Repository và Service đến API response.

### Sơ đồ kiến trúc tham chiếu

```text
+---------------------------+
| Client / PowerShell       |
| HTTP Request              |
+-------------+-------------+
              |
              v
+---------------------------+
| Node.js + Express         |
| src/app.js                |
+-------------+-------------+
              |
              v
+---------------------------+
| Routes                    |
| src/routes/tickets.js     |
+-------------+-------------+
              |
              v
+---------------------------+
| TicketService             |
| Validate + SLA            |
+-------------+-------------+
              |
              v
+---------------------------+
| TicketRepository          |
| PostgreSQL Queries        |
+-------------+-------------+
              |
              v
+---------------------------+
| PostgreSQL 18             |
| Database: smart_crm       |
| 5 tables                  |
+---------------------------+
```

### Vai trò của các lớp

- **Routes:** nhận HTTP request, xác định endpoint và chuyển yêu cầu đến lớp xử lý.
- **Service:** kiểm tra trường bắt buộc, kiểm tra mức ưu tiên, kiểm tra thiết bị và nhóm sự cố, tính hạn cam kết.
- **Repository:** thực hiện SQL để lấy danh sách, tạo, cập nhật và truy vấn chi tiết phiếu.
- **Database:** duy trì dữ liệu và các quan hệ bằng khóa chính, khóa ngoại và ràng buộc phù hợp.

Các tên `CustomerController`, `DeviceController` hoặc `TicketController` theo mô hình Spring Boot không được đưa vào sơ đồ triển khai chính vì backend đang được kiểm thử là Node.js/Express.

## 3.2. Luồng xử lý tạo phiếu

1. Client gửi yêu cầu `POST /tickets`.
2. Express chuyển yêu cầu đến route tương ứng.
3. Service kiểm tra `deviceId`, `description`, `priority` và `categoryId` nếu được cung cấp.
4. Service xác nhận thiết bị và nhóm sự cố tồn tại.
5. Service sinh `ticket_code`.
6. Service tính `commitment_deadline`.
7. Repository ghi phiếu vào bảng `ticket`.
8. Hệ thống ghi trạng thái ban đầu vào `ticket_status_log` theo thiết kế nghiệp vụ.
9. API trả kết quả chứa dữ liệu phiếu vừa tạo.

Các bước 7 và 8 cần được bảo đảm tính nguyên tử nếu cả hai được thực hiện trong cùng nghiệp vụ. Kết quả kiểm thử POST thành công xác nhận phiếu đã được tạo; cần kiểm tra bảng lịch sử riêng để xác nhận bước 8 hoạt động đúng.

## 3.3. Ba lập luận thiết kế theo NFR

**Lập luận 1 – Hiệu năng**

NFR01 yêu cầu 95% thao tác tra cứu phản hồi không quá 2 giây khi có 50 người dùng đồng thời. Vì vậy, các trường tra cứu thường xuyên như `customer.phone`, `device.serial_imei` và `ticket.ticket_code` cần ràng buộc duy nhất hoặc chỉ mục phù hợp. Chỉ mục trên `ticket(status, commitment_deadline)` có thể hỗ trợ truy vấn danh sách và lọc hạn cam kết. Đánh đổi là chỉ mục làm tăng dung lượng lưu trữ và chi phí cập nhật dữ liệu. Việc đạt ngưỡng 2 giây cần được xác nhận bằng kiểm thử tải.

**Lập luận 2 – Tính toàn vẹn dữ liệu**

NFR02 yêu cầu mọi phiếu tạo thành công có mã duy nhất, thiết bị hợp lệ và dữ liệu bắt buộc đầy đủ. Vì vậy, hệ thống kết hợp kiểm tra ở Service với ràng buộc cơ sở dữ liệu như PK, FK, UNIQUE, NOT NULL và CHECK. Đánh đổi là dữ liệu không hợp lệ sẽ bị từ chối; API cần trả thông báo lỗi rõ ràng để người dùng có thể sửa dữ liệu.

**Lập luận 3 – Bảo mật**

NFR03 yêu cầu API kiểm tra quyền truy cập theo vai trò trước khi xử lý yêu cầu. Vì vậy, xác thực và phân quyền cần được triển khai ở phía máy chủ, không chỉ ẩn nút trên giao diện. Đánh đổi là cần bổ sung cơ chế xác thực, cấu hình quyền và kiểm thử bảo mật. Chỉ được xác nhận NFR03 đạt khi các biện pháp này đã được triển khai và kiểm thử.

---

# MỤC 4. MÔ HÌNH DỮ LIỆU – ERD VÀ SQL DDL

## 4.1. Xác định bảng dữ liệu

Database `smart_crm` đang có năm bảng chính.

| Bảng | Mục đích | Các cột chính |
|---|---|---|
| `customer` | Lưu thông tin khách hàng. | `customer_id`, `full_name`, `phone` |
| `device` | Lưu thiết bị và thông tin bảo hành. | `device_id`, `customer_id`, `serial_imei`, `warranty_end_date` |
| `issue_category` | Lưu danh mục nhóm sự cố. | `category_id`, `category_name` |
| `ticket` | Lưu phiếu bảo hành. | `ticket_id`, `ticket_code`, `device_id`, `category_id`, `description`, `priority`, `status`, `commitment_deadline`, `created_at` |
| `ticket_status_log` | Lưu lịch sử trạng thái phiếu. | `log_id`, `ticket_id`, `status`, `changed_at` |

### 4.1.1. Đặc điểm dữ liệu

- `customer_id`, `device_id`, `category_id`, `ticket_id` và `log_id` là các cột định danh.
- `ticket.category_id` có thể NULL khi chưa phân loại.
- `ticket.status` sử dụng trạng thái tiếng Việt.
- `ticket.priority` sử dụng Cao, Trung bình hoặc Thấp.
- `ticket.commitment_deadline` là hạn cam kết được Service tính.
- `ticket.created_at` lưu thời điểm tạo phiếu.
- `ticket_status_log` ghi nhận trạng thái và thời điểm thay đổi.

Các kiểu dữ liệu thời gian trong database đang chạy là kiểu PostgreSQL `timestamp without time zone`, theo kết quả kiểm tra cấu trúc đã thực hiện.

## 4.2. Quan hệ giữa các bảng

**Quan hệ 1 – Customer và Device**

Một khách hàng có thể sở hữu nhiều thiết bị. Mỗi thiết bị tham chiếu một khách hàng qua `device.customer_id`.

**Quan hệ 2 – Device và Ticket**

Một thiết bị có thể có nhiều phiếu bảo hành theo thời gian. Mỗi phiếu tham chiếu thiết bị qua `ticket.device_id`.

**Quan hệ 3 – Issue Category và Ticket**

Một nhóm sự cố có thể được sử dụng bởi nhiều phiếu. `ticket.category_id` tham chiếu `issue_category.category_id` và được phép NULL khi phiếu chưa được phân loại.

**Quan hệ 4 – Ticket và Ticket Status Log**

Một phiếu có thể có nhiều bản ghi lịch sử trạng thái. `ticket_status_log.ticket_id` tham chiếu `ticket.ticket_id`.

### Sơ đồ ERD dạng văn bản

```text
customer
---------
PK customer_id
   full_name
   phone
       |
       | 1 - N
       v
device
------
PK device_id
FK customer_id
   serial_imei
   warranty_end_date
       |
       | 1 - N
       v
ticket
------
PK ticket_id
   ticket_code
FK device_id
FK category_id (nullable)
   description
   priority
   status
   commitment_deadline
   created_at
       |
       | 1 - N
       v
ticket_status_log
-----------------
PK log_id
FK ticket_id
   status
   changed_at

issue_category
--------------
PK category_id
   category_name
       |
       | 1 - N
       v
ticket.category_id
```

Không thêm `ticket.customer_id`, vì khách hàng được xác định qua thiết bị. Không thêm các cột chưa có trong cấu trúc chuẩn như `customer.email`, `customer.segment` hoặc `ticket.customer_id`.

## 4.3. SQL DDL tham chiếu cho PostgreSQL 18

**Lưu ý quan trọng:** Đây là DDL tham chiếu được chuyển sang cú pháp PostgreSQL và đồng bộ theo cấu trúc dữ liệu của dự án. Không chạy trực tiếp toàn bộ đoạn này trên database đang có dữ liệu. Hãy đối chiếu từng cột, kiểu dữ liệu, giá trị mặc định và constraint với database thực tế trước khi dùng để khởi tạo một môi trường mới.

```sql
-- Database smart_crm được tạo và quản lý riêng trong PostgreSQL.
-- Chọn database smart_crm trước khi chạy DDL.

CREATE TABLE customer (
    customer_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE device (
    device_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    serial_imei VARCHAR(100) NOT NULL UNIQUE,
    warranty_end_date DATE,

    CONSTRAINT fk_device_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);

CREATE TABLE issue_category (
    category_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ticket (
    ticket_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    device_id BIGINT NOT NULL,
    category_id BIGINT,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Trung bình',
    status VARCHAR(30) NOT NULL DEFAULT 'Mới',
    commitment_deadline TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ticket_device
        FOREIGN KEY (device_id)
        REFERENCES device(device_id),

    CONSTRAINT fk_ticket_category
        FOREIGN KEY (category_id)
        REFERENCES issue_category(category_id),

    CONSTRAINT chk_ticket_priority
        CHECK (priority IN ('Cao', 'Trung bình', 'Thấp')),

    CONSTRAINT chk_ticket_status
        CHECK (
            status IN (
                'Mới',
                'Đã phân công',
                'Đang xử lý',
                'Chờ linh kiện',
                'Hoàn tất',
                'Đã đóng'
            )
        )
);

CREATE TABLE ticket_status_log (
    log_id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    changed_at TIMESTAMP WITHOUT TIME ZONE NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_log_ticket
        FOREIGN KEY (ticket_id)
        REFERENCES ticket(ticket_id),

    CONSTRAINT chk_status_log_status
        CHECK (
            status IN (
                'Mới',
                'Đã phân công',
                'Đang xử lý',
                'Chờ linh kiện',
                'Hoàn tất',
                'Đã đóng'
            )
        )
);

CREATE INDEX idx_ticket_status_deadline
    ON ticket(status, commitment_deadline);
```

### 4.3.1. Các điểm cần đối chiếu trước khi áp dụng DDL

1. **Kiểu cột định danh:** kiểm tra cột ID trong database hiện tại có `IDENTITY`, sequence hoặc `DEFAULT nextval(...)` hay không. DDL tham chiếu sử dụng `GENERATED BY DEFAULT AS IDENTITY`; không được thay đổi tùy tiện kiểu sinh ID đang hoạt động.
2. **Kiểu thời gian:** database đang hiển thị `timestamp without time zone`. Backend hiện trả các thời điểm có hậu tố `Z`; cần thống nhất quy ước lưu và chuyển đổi thời gian UTC giữa Node.js và PostgreSQL để tránh sai lệch giờ.
3. **Ràng buộc:** cần xác nhận các constraint UNIQUE và CHECK đã có trong database thực tế. Nếu chưa có, bổ sung sau khi kiểm tra dữ liệu trùng hoặc dữ liệu không hợp lệ.
4. **Lịch sử trạng thái:** phải xác minh repository có ghi vào `ticket_status_log` khi tạo phiếu và cập nhật trạng thái hay không.
5. **Chỉ mục:** `idx_ticket_status_deadline` là chỉ mục đề xuất cho truy vấn lọc trạng thái và hạn cam kết. Kiểm tra xem chỉ mục tương đương đã tồn tại trước khi tạo.
6. **Không xóa bảng:** không dùng `DROP TABLE`, không tạo lại database và không chạy lại toàn bộ DDL trên môi trường hiện có chỉ để đồng bộ tài liệu.

## 4.4. Nguyên tắc đồng bộ dữ liệu

- ERD, DDL và repository phải sử dụng thống nhất tên bảng và tên cột.
- Repository hiện truy vấn các cột `ticket_code`, `device_id`, `category_id`, `description`, `priority`, `status`, `commitment_deadline` và `created_at`.
- Bảng `issue_category` sử dụng `category_id`, không dùng `issue_category_id`.
- Bảng `ticket_status_log` sử dụng `log_id`, `ticket_id`, `status` và `changed_at`.
- Không thêm `ticket.customer_id`; liên kết khách hàng thông qua thiết bị.
- Cột `category_id` cho phép NULL.
- Dữ liệu trạng thái và mức ưu tiên phải thống nhất giữa Service, SQL và SRS.
- Quy tắc SLA được xử lý ở Service; không phụ thuộc vào DDL.
- Các thao tác tạo phiếu và ghi trạng thái ban đầu phải được xử lý nhất quán.
- Nếu thay đổi DDL, cần cập nhật lại ERD, tài liệu SRS và các truy vấn Repository có liên quan.

---

# MỤC 5. WIREFRAME

## 5.1. Màn hình 1 – Tra cứu khách hàng và thiết bị

### Khu vực tra cứu khách hàng

- Trường nhập số điện thoại.
- Nút **Tra cứu khách hàng**.
- Khu vực hiển thị họ tên và số điện thoại.
- Nút **Tạo khách hàng mới** khi chưa có hồ sơ và người dùng có quyền.

### Khu vực tra cứu thiết bị

- Trường nhập serial/IMEI.
- Nút **Tra cứu thiết bị**.
- Khu vực hiển thị thiết bị và ngày hết hạn bảo hành.

### Tình trạng bảo hành

- Còn bảo hành.
- Hết bảo hành.
- Chưa xác minh bảo hành.

### Nguyên tắc giao diện

- Hiển thị thông báo khi không tìm thấy dữ liệu.
- Không tạo khách hàng hoặc thiết bị trùng.
- Không tự kết luận còn bảo hành khi thiếu `warranty_end_date`.
- Che một phần số điện thoại theo quyền truy cập.
- Không hiển thị email, địa chỉ hoặc ngày mua nếu các trường đó chưa có trong DDL.

Màn hình này là thiết kế nghiệp vụ. Cần xác minh API Customer và Device trước khi kết luận đã triển khai hoàn chỉnh.

## 5.2. Màn hình 2 – Tiếp nhận và phân loại yêu cầu

### Thông tin đầu vào

**Thiết bị**

- Chọn thiết bị đã xác định.
- Dữ liệu thiết bị phải hợp lệ trước khi tạo phiếu.

**Mô tả lỗi**

- Trường nhập nội dung khách hàng mô tả.
- Bắt buộc nhập.

**Nhóm sự cố**

- Màn hình.
- Pin.
- Sạc.
- Phần mềm.
- Nước vào.
- Khác.

Danh mục thực tế cần được lấy từ bảng `issue_category`, không nên chỉ viết cố định trên giao diện nếu hệ thống yêu cầu quản lý danh mục bằng dữ liệu.

**Mức ưu tiên**

- Cao.
- Trung bình.
- Thấp.

Mức mặc định là Trung bình.

**Hạn cam kết**

- Tự động tính từ thời điểm tiếp nhận và mức ưu tiên.
- Hiển thị dạng chỉ đọc.
- Không cho phép người dùng sửa trực tiếp.

### Nút thao tác

- **Tạo phiếu bảo hành**
- **Hủy**

### Kết quả sau khi tạo

- Hiển thị mã phiếu.
- Hiển thị trạng thái “Mới”.
- Hiển thị mức ưu tiên và hạn cam kết.
- Thông báo tạo phiếu thành công hoặc lỗi.

Các trường và thao tác trên phải được ánh xạ với API `POST /tickets`. Chỉ hiển thị kết quả thành công sau khi backend xác nhận đã lưu phiếu.

## 5.3. Màn hình 3 – Danh sách phiếu bảo hành

### Bộ lọc

**Trạng thái**

- Tất cả.
- Mới.
- Đã phân công.
- Đang xử lý.
- Chờ linh kiện.
- Hoàn tất.
- Đã đóng.

**Nhóm sự cố**

- Tất cả.
- Các nhóm lấy từ danh mục `issue_category`.

**Mức ưu tiên**

- Tất cả.
- Cao.
- Trung bình.
- Thấp.

### Danh sách phiếu

Mỗi dòng hiển thị:

- Mã phiếu.
- Thông tin khách hàng.
- Thông tin thiết bị.
- Trạng thái.
- Nhóm sự cố.
- Mức ưu tiên.
- Hạn cam kết.
- Ngày tiếp nhận.

Thông tin khách hàng được lấy qua quan hệ `ticket → device → customer`. Không yêu cầu `ticket.customer_id`.

### Cảnh báo hạn

- Đánh dấu phiếu sắp đến hạn.
- Đánh dấu phiếu quá hạn.
- Không cảnh báo phiếu Hoàn tất hoặc Đã đóng.

Điều kiện cảnh báo được tính theo QT-13. Chức năng này chỉ được xác nhận hoàn thành khi đã có logic xử lý và kết quả kiểm thử.

### Trạng thái không có dữ liệu

Hiển thị thông báo “Không có phiếu phù hợp”.

### Nút thao tác

- **Lọc danh sách**
- **Xóa bộ lọc**
- **Xem chi tiết**

Danh sách có thể hỗ trợ phân trang, với mục tiêu tối đa 20 phiếu mỗi trang. Cần kiểm tra API hiện tại trước khi mô tả đây là chức năng đã triển khai.

---

# PHỤ LỤC. BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

| Công cụ | Mục đích sử dụng | Phần áp dụng | Cách kiểm chứng |
|---|---|---|---|
| Gemini | Hỗ trợ đề xuất cấu trúc SQL, rà soát câu lệnh và tổ chức dữ liệu. | Mục 4 – ERD và DDL. | Đối chiếu với database thực tế, kiểm tra PK, FK, kiểu dữ liệu và ràng buộc. |
| ChatGPT | Hỗ trợ rà soát SRS, thống nhất User Story, FR, NFR, Use Case và quy tắc nghiệp vụ. | Mục 1, Mục 2, Mục 3 và Mục 5. | Đối chiếu với mã nguồn, API, cấu trúc database và kết quả kiểm thử. |

### Cam kết sử dụng AI

Tôi chịu trách nhiệm kiểm tra, chỉnh sửa và xác nhận tính đúng đắn của nội dung trước khi nộp. Công cụ AI chỉ được sử dụng để hỗ trợ quá trình thực hiện, không thay thế trách nhiệm của người thực hiện. Các yêu cầu và thiết kế được đối chiếu với mã nguồn, cấu trúc cơ sở dữ liệu và kết quả kiểm thử thực tế.

**Họ và tên:** Bùi Hoàng Khang  
**MSSV:** 2374802010207  
**Ngày:** 19/10/2026  

