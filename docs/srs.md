# TRƯỜNG ĐẠI HỌC VĂN LANG
# KHOA CÔNG NGHỆ THÔNG TIN

## BÁO CÁO CHUYÊN ĐỀ TỐT NGHIỆP 1

**Ngành:** Công nghệ thông tin  
**Chuyên ngành:** SE – Kỹ thuật phần mềm

### Đề tài

# SRS — L02: TIẾP NHẬN VÀ PHÂN LOẠI BẢO HÀNH

**Sinh viên thực hiện:** Bùi Hoàng Khang  
**MSSV:** 2374802010207  
**GitHub Repository:** https://github.com/HoangKhanggggg/smartcrm-2374802010207-warranty-claim-intake  
**Giảng viên hướng dẫn:** ThS. Nguyễn Minh Tân

**TP. Hồ Chí Minh – năm 2026**

---

# MỤC LỤC

**Mục 1. BẢN SRS RÚT GỌN**

1.1. Giới thiệu, phạm vi và bảng thuật ngữ  
1.2. Các bên liên quan và vai trò người dùng  
1.3. Yêu cầu chức năng và User Story  
1.4. Yêu cầu chức năng – FR  
1.5. Yêu cầu phi chức năng – NFR  
1.6. Ràng buộc và quy tắc nghiệp vụ  
1.7. Bảng truy vết yêu cầu  

**Mục 2. USE CASE**

2.1. Use Case Diagram  
2.2. Đặc tả chi tiết Use Case quan trọng nhất  

**Mục 3. THIẾT KẾ KIẾN TRÚC**

3.1. Sơ đồ kiến trúc  
3.2. Ba câu lập luận NFR  

**Mục 4. MÔ HÌNH DỮ LIỆU – ERD VÀ SQL DDL**

4.1. Xác định bảng dữ liệu  
4.2. Quan hệ giữa các bảng  
4.3. SQL DDL  

**Mục 5. WIREFRAME**

Màn hình 1 – Tra cứu khách hàng và thiết bị  
Màn hình 2 – Tiếp nhận và phân loại yêu cầu  
Màn hình 3 – Danh sách phiếu bảo hành  

**PHỤ LỤC. BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI**

---

# MỤC 1. BẢN SRS RÚT GỌN

## 1.1. Giới thiệu, phạm vi và bảng thuật ngữ

### 1.1.1. Giới thiệu

Luồng L02 – Tiếp nhận và phân loại yêu cầu bảo hành thuộc hệ thống Smart CRM của Mekong Mobile. Luồng này hỗ trợ nhân viên tiếp nhận tra cứu khách hàng, ghi nhận thiết bị, tiếp nhận mô tả lỗi và tạo phiếu bảo hành điện tử.

Hệ thống quản lý phiếu theo mã duy nhất, hỗ trợ phân loại nhóm sự cố, lựa chọn mức ưu tiên, tính hạn cam kết và theo dõi danh sách phiếu. Mục tiêu là giảm tình trạng trùng hồ sơ khách hàng, hạn chế nhập liệu thủ công và giúp quản lý theo dõi các phiếu sắp đến hạn hoặc đã quá hạn.

### 1.1.2. Phạm vi hệ thống

**Trong phạm vi (IN SCOPE):**

- Tra cứu khách hàng bằng số điện thoại.
- Tạo hồ sơ khách hàng mới khi chưa tồn tại.
- Ghi nhận và tra cứu thiết bị bằng serial/IMEI.
- Hiển thị tình trạng bảo hành theo ngày hết hạn bảo hành.
- Tiếp nhận mô tả lỗi và tạo phiếu bảo hành có mã duy nhất.
- Phân loại nhóm sự cố.
- Lựa chọn mức ưu tiên Cao, Trung bình hoặc Thấp.
- Tính hạn cam kết theo mức ưu tiên và quy tắc SLA.
- Xem và lọc danh sách phiếu bảo hành.
- Nhận diện phiếu sắp đến hạn hoặc đã quá hạn.
- Ghi nhận trạng thái ban đầu và lịch sử thay đổi trạng thái phiếu.

**Ngoài phạm vi (OUT OF SCOPE):**

- Phân công kỹ thuật viên và quản lý danh sách kỹ thuật viên.
- Quản lý quá trình sửa chữa thực tế.
- Quản lý kho linh kiện và đặt linh kiện.
- Thanh toán và hoàn tất nghiệp vụ sửa chữa thực tế.
- Lưu hồ sơ phê duyệt chi tiết của quản lý đối với trường hợp chưa xác minh bảo hành.
- Phân quyền theo từng trung tâm hoặc đơn vị cụ thể.
- Báo cáo thống kê nâng cao ngoài chức năng xem và lọc phiếu.

Các chức năng ngoài phạm vi có thể được xem xét trong những phiên bản tiếp theo của Smart CRM.

### 1.1.3. Bảng thuật ngữ

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
| Hạn cam kết | Thời điểm hệ thống tính toán dựa trên thời điểm tiếp nhận và mức ưu tiên |
| Mức ưu tiên | Cao, Trung bình hoặc Thấp |
| Nhóm sự cố | Danh mục dùng để phân loại sự cố thiết bị |
| Trạng thái | Bước trong vòng đời xử lý phiếu |
| PK/FK | Khóa chính/khóa ngoại |
| ERD | Sơ đồ thực thể liên kết dữ liệu |
| DDL | Các câu lệnh định nghĩa cấu trúc cơ sở dữ liệu |
| Xóa mềm | Đánh dấu dữ liệu không còn sử dụng thay vì xóa vật lý |

## 1.2. Các bên liên quan và vai trò người dùng

| Actor | Vai trò |
|---|---|
| Nhân viên tiếp nhận | Tra cứu khách hàng, ghi nhận thiết bị, tạo phiếu, nhập mô tả lỗi, chọn nhóm sự cố và mức ưu tiên. |
| Quản lý trung tâm | Xem và lọc danh sách phiếu, theo dõi phiếu sắp đến hạn hoặc quá hạn, xem tình trạng xác minh bảo hành. |
| Bộ đếm thời gian | Kích hoạt việc kiểm tra định kỳ để xác định phiếu sắp đến hạn hoặc đã quá hạn. |

Lưu ý: Bộ đếm thời gian là tác nhân hệ thống bên ngoài hoặc tác vụ lập lịch, tùy theo kiến trúc triển khai. Đây không phải người dùng đăng nhập như nhân viên hoặc quản lý.

## 1.3. Yêu cầu chức năng và User Story

| Mã | User Story | Actor | MoSCoW |
|---|---|---|---|
| US01 | Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng bằng số điện thoại và tạo hồ sơ mới nếu chưa có, để hạn chế hồ sơ khách hàng trùng lặp. | Nhân viên tiếp nhận | MUST |
| US02 | Là nhân viên tiếp nhận, tôi muốn ghi nhận thiết bị bằng serial/IMEI và kiểm tra tình trạng bảo hành, để xác định thiết bị trước khi tạo phiếu. | Nhân viên tiếp nhận | MUST |
| US03 | Là nhân viên tiếp nhận, tôi muốn nhập mô tả lỗi và tạo phiếu bảo hành có mã duy nhất, để lưu lại yêu cầu của khách hàng. | Nhân viên tiếp nhận | MUST |
| US04 | Là nhân viên tiếp nhận, tôi muốn chọn nhóm sự cố từ danh mục có sẵn, để thống nhất cách phân loại yêu cầu. | Nhân viên tiếp nhận | SHOULD |
| US05 | Là nhân viên tiếp nhận, tôi muốn chọn mức ưu tiên Cao, Trung bình hoặc Thấp, để xác định thời hạn cam kết phù hợp. | Nhân viên tiếp nhận | SHOULD |
| US06 | Là nhân viên tiếp nhận, tôi muốn hệ thống tự tính và hiển thị hạn cam kết theo mức ưu tiên, để tránh tính toán thủ công. | Nhân viên tiếp nhận | SHOULD |
| US07 | Là quản lý trung tâm, tôi muốn xem và lọc danh sách phiếu theo trạng thái, nhóm sự cố và mức ưu tiên, để theo dõi tình hình tiếp nhận và các phiếu cần chú ý. | Quản lý trung tâm | MUST |

### 1.3.1. Tiêu chí chấp nhận (Given – When – Then)

**US01 – AC1: Tra cứu khách hàng đã tồn tại**

- Given số điện thoại của khách hàng đã tồn tại trong hệ thống.
- When nhân viên nhập số điện thoại hợp lệ và thực hiện tìm kiếm.
- Then hệ thống chuẩn hóa số điện thoại, hiển thị hồ sơ hiện có và không tạo bản ghi khách hàng mới.

**US01 – AC2: Tạo khách hàng mới**

- Given số điện thoại hợp lệ chưa tồn tại.
- When nhân viên nhập họ tên và lưu hồ sơ.
- Then hệ thống tạo hồ sơ khách hàng mới và cho phép sử dụng hồ sơ đó khi lập phiếu.

**US01 – AC3: Số điện thoại không hợp lệ**

- Given số điện thoại chứa chữ cái hoặc không đáp ứng định dạng hợp lệ sau chuẩn hóa.
- When nhân viên thực hiện tìm kiếm.
- Then hệ thống thông báo số điện thoại không hợp lệ và không tạo hồ sơ khách hàng.

**US02 – AC1: Thiết bị có dữ liệu bảo hành**

- Given thiết bị có serial/IMEI hợp lệ và có ngày hết hạn bảo hành.
- When nhân viên tra cứu thiết bị.
- Then hệ thống xác định thiết bị còn bảo hành hoặc hết bảo hành dựa trên `warranty_end_date`.

**US02 – AC2: Chưa xác minh bảo hành**

- Given thiết bị không có dữ liệu `warranty_end_date`.
- When nhân viên tra cứu thiết bị.
- Then hệ thống hiển thị “Chưa xác minh bảo hành”; nhân viên không được tự xác nhận thiết bị còn bảo hành.

**US02 – AC3: Serial/IMEI đã tồn tại**

- Given serial/IMEI đã thuộc một thiết bị trong hệ thống.
- When nhân viên nhập và lưu thiết bị trùng.
- Then hệ thống từ chối tạo thiết bị trùng và thông báo lỗi phù hợp.

**US03 – AC1: Tạo phiếu thành công**

- Given khách hàng và thiết bị đã được xác định.
- When nhân viên nhập mô tả lỗi hợp lệ và tạo phiếu.
- Then hệ thống sinh mã phiếu duy nhất, đặt trạng thái ban đầu là “Mới”, sử dụng mức ưu tiên mặc định là “Trung bình”, tính hạn cam kết và ghi nhận lịch sử trạng thái ban đầu.

**US03 – AC2: Thiếu dữ liệu bắt buộc**

- Given phiếu chưa có thiết bị hoặc chưa có mô tả lỗi.
- When nhân viên yêu cầu tạo phiếu.
- Then hệ thống không lưu phiếu và thông báo trường cần bổ sung.

**US03 – AC3: Lưu dữ liệu thất bại**

- Given dữ liệu đã được nhập hợp lệ.
- When quá trình lưu thất bại.
- Then hệ thống thông báo lỗi, giữ dữ liệu trên biểu mẫu nếu có thể và không để lại phiếu được tạo dở dang.

**US04 – AC1: Chọn nhóm sự cố**

- Given nhân viên đang lập phiếu.
- When nhân viên mở danh mục nhóm sự cố.
- Then hệ thống hiển thị các nhóm đang sử dụng: Màn hình, Pin, Sạc, Phần mềm, Nước vào và Khác.

**US04 – AC2: Chưa chọn nhóm sự cố**

- Given nhân viên chưa chọn nhóm sự cố.
- When nhân viên tạo phiếu.
- Then hệ thống vẫn cho phép lưu phiếu với `category_id` rỗng và cho phép bổ sung phân loại sau.

**US05 – AC1: Giá trị ưu tiên hợp lệ**

- Given nhân viên chọn mức ưu tiên.
- When nhân viên mở danh sách ưu tiên.
- Then hệ thống chỉ cho phép chọn Cao, Trung bình hoặc Thấp.

**US05 – AC2: Giá trị mặc định**

- Given nhân viên tạo phiếu mới.
- When hệ thống khởi tạo biểu mẫu.
- Then mức ưu tiên mặc định là Trung bình; nhân viên có thể đổi sang Cao hoặc Thấp trước khi lưu.

**US06 – AC1: Tính hạn cam kết**

- Given nhân viên chọn hoặc thay đổi mức ưu tiên.
- When hệ thống tính hạn cam kết.
- Then hệ thống tính theo quy tắc 24 giờ, 72 giờ hoặc 120 giờ tương ứng với mức ưu tiên và không cho phép người dùng sửa trực tiếp hạn cam kết.

**US06 – AC2: SLA đi qua Chủ nhật**

- Given phiếu được tiếp nhận lúc 10:00 Thứ Bảy và có mức ưu tiên Cao với SLA 24 giờ.
- When hệ thống tính hạn cam kết theo quy tắc loại trừ toàn bộ thời gian Chủ nhật.
- Then hạn cam kết là 10:00 Thứ Hai.

**US07 – AC1: Hiển thị danh sách phiếu**

- Given quản lý mở chức năng danh sách phiếu.
- When hệ thống tải dữ liệu.
- Then hệ thống hiển thị tối đa 20 phiếu mỗi trang với các thông tin: mã phiếu, khách hàng, thiết bị, trạng thái, nhóm sự cố, mức ưu tiên, hạn cam kết và ngày tiếp nhận.

**US07 – AC2: Lọc danh sách**

- Given quản lý chọn một hoặc nhiều bộ lọc.
- When quản lý thực hiện lọc.
- Then hệ thống chỉ hiển thị các phiếu thỏa mãn đồng thời các điều kiện lọc.

**US07 – AC3: Không có kết quả**

- Given không có phiếu phù hợp với điều kiện lọc.
- When hệ thống trả kết quả.
- Then hệ thống hiển thị thông báo “Không có phiếu phù hợp”.

## 1.4. Yêu cầu chức năng – FR

| Mã | Yêu cầu chức năng | US liên quan |
|---|---|---|
| FR01 | Hệ thống cho phép tra cứu khách hàng bằng số điện thoại và hiển thị hồ sơ phù hợp. | US01 |
| FR02 | Hệ thống cho phép tạo hồ sơ khách hàng mới khi số điện thoại chưa tồn tại. | US01 |
| FR03 | Hệ thống cho phép ghi nhận hoặc tra cứu thiết bị bằng serial/IMEI. | US02 |
| FR04 | Hệ thống hiển thị tình trạng bảo hành dựa trên `warranty_end_date`; nếu thiếu dữ liệu thì hiển thị “Chưa xác minh bảo hành”. | US02 |
| FR05 | Hệ thống cho phép nhập và lưu mô tả lỗi của thiết bị. | US03 |
| FR06 | Hệ thống tạo mã phiếu bảo hành duy nhất khi tạo phiếu thành công và đặt trạng thái ban đầu là “Mới”. | US03 |
| FR07 | Hệ thống cung cấp danh mục nhóm sự cố để nhân viên lựa chọn. | US04 |
| FR08 | Hệ thống cho phép chọn một trong ba mức ưu tiên Cao, Trung bình hoặc Thấp. | US05 |
| FR09 | Hệ thống tự tính và hiển thị hạn cam kết theo mức ưu tiên và quy tắc SLA đã cấu hình. | US06 |
| FR10 | Hệ thống cho phép quản lý xem và lọc danh sách phiếu bảo hành. | US07 |
| FR11 | Hệ thống nhận diện và hiển thị phiếu sắp đến hạn hoặc đã quá hạn theo QT-13. | US07 |
| FR12 | Hệ thống ghi nhận lịch sử trạng thái phiếu, gồm mã phiếu, trạng thái mới và thời điểm thay đổi. Khi tạo phiếu thành công, hệ thống ghi nhận trạng thái ban đầu là “Mới”. | US03, US07 |

## 1.5. Yêu cầu phi chức năng – NFR

| Mã | Nhóm | Yêu cầu | Cách kiểm tra |
|---|---|---|---|
| NFR01 | Hiệu năng | 95% thao tác tra cứu khách hàng/thiết bị phản hồi trong không quá 2 giây với 50 người dùng đồng thời. | Kiểm thử tải và đo thời gian phản hồi. |
| NFR02 | Tính toàn vẹn dữ liệu | 100% phiếu tạo thành công có mã duy nhất; hệ thống không lưu phiếu thiếu các trường bắt buộc. | Kiểm thử ràng buộc dữ liệu, khóa và trường bắt buộc. |
| NFR03 | Bảo mật | 100% API tạo/xem phiếu phải kiểm tra quyền truy cập theo vai trò trước khi xử lý yêu cầu. | Kiểm thử bằng tài khoản có quyền và không có quyền. |
| NFR04 | Khả năng sử dụng | Người dùng thử nghiệm hoàn thành quy trình tạo phiếu trong tối đa 3 phút sau hướng dẫn ngắn. | Kiểm thử usability theo kịch bản. |

## 1.6. Ràng buộc và quy tắc nghiệp vụ

| Mã | Quy tắc nghiệp vụ | Áp dụng |
|---|---|---|
| QT-01 | Số điện thoại khách hàng phải duy nhất. Khi nhập số đã tồn tại, hệ thống hiển thị hồ sơ hiện có thay vì tạo khách hàng trùng. | FR01, FR02 |
| QT-02 | Hệ thống chuẩn hóa số điện thoại về 10 chữ số bắt đầu bằng 0; xử lý định dạng +84, 84, dấu cách và dấu chấm. | FR01, FR02 |
| QT-03 | Mỗi thiết bị được xác định bằng serial/IMEI duy nhất và liên kết với một khách hàng tại một thời điểm. | FR03 |
| QT-04 | Hạn cam kết theo SLA: Cao 24 giờ, Trung bình 72 giờ, Thấp 120 giờ. Toàn bộ khoảng thời gian Chủ nhật được loại trừ khi tính SLA. | FR09 |
| QT-05 | Nếu có `warranty_end_date`, hệ thống xác định tình trạng bảo hành bằng cách so sánh ngày hiện tại với ngày hết hạn bảo hành. Nếu `warranty_end_date` rỗng, hệ thống hiển thị “Chưa xác minh bảo hành”; nhân viên không tự xác nhận “Còn bảo hành”. | FR04 |
| QT-06 | Vòng đời trạng thái phiếu gồm: Mới → Đã phân công → Đang xử lý → Chờ linh kiện → Hoàn tất → Đã đóng. Mỗi lần thay đổi trạng thái phải ghi một bản ghi mới vào `ticket_status_log`, gồm mã phiếu, trạng thái mới và thời điểm thay đổi. | FR06, FR12 |
| QT-07 | Phiếu liên kết với khách hàng thông qua thiết bị: `ticket.device_id` tham chiếu `device.device_id`, còn `device.customer_id` tham chiếu `customer.customer_id`. Không tạo `ticket.customer_id` để tránh dư thừa dữ liệu. | FR03, FR05, FR06 |
| QT-08 | Mức ưu tiên chỉ nhận một trong ba giá trị: Cao, Trung bình hoặc Thấp. | FR08 |
| QT-09 | `category_id` có thể để trống khi phiếu chưa được phân loại; hệ thống cho phép bổ sung nhóm sự cố sau. | FR07 |
| QT-10 | Không xóa vật lý phiếu, thiết bị và hồ sơ khách hàng trong quy trình nghiệp vụ. Cơ chế xóa mềm sẽ được xem xét khi mở rộng. | Toàn bộ |
| QT-11 | Quyền truy cập được kiểm tra tại máy chủ. Nhân viên tiếp nhận được tạo phiếu và tra cứu dữ liệu phục vụ tiếp nhận; quản lý được xem, lọc và theo dõi phiếu sắp/quá hạn. | NFR03, FR10, FR11 |
| QT-12 | Số điện thoại được che một phần khi hiển thị cho vai trò không được cấp quyền xem đầy đủ. | FR01, FR10, NFR03 |
| QT-13 | Phiếu sắp đến hạn là phiếu còn không quá 8 giờ đến hạn cam kết và chưa ở trạng thái Hoàn tất hoặc Đã đóng. Phiếu quá hạn là phiếu đã vượt hạn cam kết và chưa ở trạng thái Hoàn tất hoặc Đã đóng. Ngưỡng 8 giờ là giá trị cấu hình. | FR11 |

Lưu ý triển khai: QT-04 phải được thực hiện thống nhất trong Service và kiểm thử với các trường hợp hạn cam kết đi qua Chủ nhật. Không chỉ chuyển hạn sang Thứ Hai khi ngày hạn rơi vào Chủ nhật; cần loại trừ toàn bộ khoảng thời gian Chủ nhật khi tính SLA.

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
| FR08 | US05 | UC05 | SHOULD |
| FR09 | US06 | UC06 | SHOULD |
| FR10 | US07 | UC07 | MUST |
| FR11 | US07 | UC08 | MUST |
| FR12 | US03, US07 | UC03, UC07 | MUST |

### Đối chiếu vấn đề hiện tại

- **V1 – Hồ sơ khách hàng bị trùng:** giải quyết bằng US01, FR01 và FR02.
- **V2 – Khó theo dõi trạng thái và phiếu quá hạn:** hỗ trợ giải quyết bằng US03, US06, US07 và FR09, FR11, FR12.
- **V8 – Mô tả lỗi tự do gây khó thống kê:** cải thiện bằng US04 và FR07 thông qua danh mục nhóm sự cố.

UC08 được sử dụng cho chức năng nhận diện phiếu sắp đến hạn hoặc quá hạn; UC07 dùng cho chức năng xem và lọc danh sách phiếu.

---

# MỤC 2. USE CASE

## 2.1. Use Case Diagram

Use Case Diagram mô tả mối quan hệ giữa các tác nhân và chức năng của hệ thống Smart CRM – L02.

Các tác nhân gồm:

- Nhân viên tiếp nhận.
- Quản lý trung tâm.
- Bộ đếm thời gian hoặc tác vụ lập lịch.

Các Use Case chính:

| Mã UC | Tên Use Case | Actor |
|---|---|---|
| UC01 | Tra cứu khách hàng | Nhân viên tiếp nhận |
| UC02 | Tạo hồ sơ khách hàng | Nhân viên tiếp nhận |
| UC03 | Ghi nhận thiết bị và tạo phiếu bảo hành | Nhân viên tiếp nhận |
| UC04 | Chọn nhóm sự cố | Nhân viên tiếp nhận |
| UC05 | Chọn mức ưu tiên | Nhân viên tiếp nhận |
| UC06 | Tính hạn cam kết | Nhân viên tiếp nhận |
| UC07 | Xem và lọc danh sách phiếu | Quản lý trung tâm |
| UC08 | Nhận diện phiếu sắp đến hạn hoặc quá hạn | Quản lý trung tâm, bộ đếm thời gian |

Trong sơ đồ, actor được đặt bên ngoài ranh giới hệ thống; các Use Case nằm bên trong ranh giới. Đường kết nối thể hiện tác nhân tham gia chức năng. Quan hệ include hoặc extend chỉ được sử dụng khi có quan hệ nghiệp vụ phù hợp.

## 2.2. Đặc tả chi tiết Use Case quan trọng nhất

| Thuộc tính | Nội dung |
|---|---|
| Tên Use Case | UC03 – Ghi nhận thiết bị và tạo phiếu bảo hành |
| Actor chính | Nhân viên tiếp nhận |
| Tiền điều kiện | Nhân viên đã đăng nhập; khách hàng đã được xác định; thiết bị có serial/IMEI hợp lệ. |
| Hậu điều kiện thành công | Phiếu được lưu với mã duy nhất, liên kết với thiết bị, có nhóm sự cố nếu đã chọn, có mức ưu tiên và hạn cam kết; trạng thái ban đầu được ghi nhận. |
| Hậu điều kiện thất bại | Không tạo phiếu dở dang; hệ thống thông báo lỗi và giữ dữ liệu biểu mẫu nếu có thể. |

### Luồng chính

1. Nhân viên mở chức năng tạo phiếu bảo hành.
2. Hệ thống hiển thị khách hàng và thiết bị đã xác định.
3. Nhân viên nhập mô tả lỗi.
4. Nhân viên chọn nhóm sự cố nếu có.
5. Nhân viên chọn mức ưu tiên hoặc sử dụng giá trị mặc định Trung bình.
6. Hệ thống kiểm tra các trường bắt buộc và dữ liệu liên quan.
7. Hệ thống sinh mã phiếu duy nhất.
8. Hệ thống tính hạn cam kết theo mức ưu tiên và quy tắc SLA.
9. Hệ thống lưu phiếu bảo hành và ghi trạng thái ban đầu vào lịch sử trạng thái.
10. Hệ thống thông báo tạo phiếu thành công.

### Luồng ngoại lệ

**5a. Thiếu mô tả lỗi hoặc thiết bị:** Hệ thống thông báo trường cần bổ sung và không lưu phiếu.

**6a. Dữ liệu thiết bị không hợp lệ:** Hệ thống thông báo lỗi serial/IMEI hoặc dữ liệu liên quan; nhân viên cần kiểm tra lại.

**8a. Không tính được hạn cam kết:** Hệ thống thông báo lỗi cấu hình SLA và không báo tạo phiếu thành công.

**9a. Lỗi kết nối hoặc cơ sở dữ liệu:** Hệ thống thông báo chưa lưu được dữ liệu, giữ thông tin biểu mẫu nếu có thể và không để lại bản ghi phiếu chưa hoàn chỉnh.

---

# MỤC 3. THIẾT KẾ KIẾN TRÚC

## 3.1. Sơ đồ kiến trúc

Hệ thống được tổ chức theo các lớp để tách biệt giao diện, nghiệp vụ và truy cập dữ liệu.

| Thành phần | Trách nhiệm | Ví dụ |
|---|---|---|
| Presentation | Tiếp nhận thao tác của người dùng và hiển thị kết quả. | Màn hình tra cứu, tạo phiếu, danh sách phiếu. |
| Controller/API | Tiếp nhận yêu cầu từ giao diện, kiểm tra dữ liệu đầu vào và gọi Service. | CustomerController, DeviceController, TicketController. |
| Service | Xử lý quy tắc nghiệp vụ, tạo mã phiếu, phân loại và tính hạn cam kết. | CustomerService, DeviceService, TicketService, ClassifyService. |
| Repository | Đọc và ghi dữ liệu cơ sở dữ liệu. | CustomerRepository, DeviceRepository, TicketRepository, CategoryRepository, StatusLogRepository. |
| Database | Lưu trữ dữ liệu bền vững. | customer, device, issue_category, ticket, ticket_status_log. |

Luồng xử lý tổng quát:

Presentation → Controller/API → Service → Repository → Database.

Khi tạo phiếu, Service kiểm tra dữ liệu, tính hạn cam kết và lưu phiếu cùng lịch sử trạng thái ban đầu. Các thao tác liên quan cần được thực hiện trong giao dịch phù hợp để hạn chế dữ liệu không nhất quán.

## 3.2. Ba câu lập luận NFR

**Lập luận 1 – Hiệu năng:** NFR01 yêu cầu 95% thao tác tra cứu khách hàng và thiết bị phản hồi trong không quá 2 giây khi có 50 người dùng đồng thời. Vì vậy, hệ thống sử dụng ràng buộc UNIQUE trên `customer.phone` và `device.serial_imei` để hỗ trợ tra cứu, đồng thời tạo chỉ mục `idx_ticket_status_deadline` trên `ticket(status, commitment_deadline)` để hỗ trợ lọc phiếu và nhận diện phiếu sắp hoặc quá hạn. Đánh đổi là chỉ mục làm tăng dung lượng lưu trữ và chi phí cập nhật dữ liệu.

**Lập luận 2 – Tính toàn vẹn dữ liệu:** NFR02 yêu cầu mọi phiếu tạo thành công phải có mã duy nhất và không thiếu các trường bắt buộc. Vì vậy, cơ sở dữ liệu sử dụng khóa chính, khóa ngoại, UNIQUE, NOT NULL và CHECK tại các cột phù hợp. Đánh đổi là dữ liệu không hợp lệ sẽ bị từ chối, do đó giao diện cần thông báo lỗi rõ ràng để người dùng sửa dữ liệu.

**Lập luận 3 – Bảo mật:** NFR03 yêu cầu API tạo và xem phiếu phải kiểm tra quyền truy cập theo vai trò. Vì vậy, việc xác thực và phân quyền được thực hiện ở phía máy chủ trước khi xử lý yêu cầu. Đánh đổi là hệ thống cần bổ sung cấu hình bảo mật và kiểm thử các trường hợp truy cập không đủ quyền.

---

# MỤC 4. MÔ HÌNH DỮ LIỆU – ERD VÀ SQL DDL

## 4.1. Xác định bảng dữ liệu

| Bảng | Mục đích | Các cột chính |
|---|---|---|
| customer | Lưu thông tin khách hàng. | customer_id, full_name, phone |
| device | Lưu thiết bị và thông tin bảo hành. | device_id, customer_id, serial_imei, warranty_end_date |
| issue_category | Lưu danh mục nhóm sự cố. | category_id, category_name |
| ticket | Lưu phiếu bảo hành. | ticket_id, ticket_code, device_id, category_id, description, priority, status, commitment_deadline, created_at |
| ticket_status_log | Lưu lịch sử trạng thái phiếu. | log_id, ticket_id, status, changed_at |

## 4.2. Quan hệ giữa các bảng

- Một khách hàng có thể sở hữu nhiều thiết bị: `customer` 1–N `device`.
- Một thiết bị có thể có nhiều phiếu bảo hành theo thời gian: `device` 1–N `ticket`.
- Một nhóm sự cố có thể được sử dụng cho nhiều phiếu: `issue_category` 1–N `ticket`. Một phiếu có thể chưa được phân loại nên `category_id` được phép NULL.
- Một phiếu có nhiều bản ghi lịch sử trạng thái: `ticket` 1–N `ticket_status_log`.

**Nguyên tắc đồng bộ ERD–DDL:** ERD chỉ chứa các cột có trong DDL. Không thêm `customer.email`, `customer.segment`, `ticket.customer_id` hoặc các trường chưa được định nghĩa. Khách hàng được liên kết với phiếu thông qua thiết bị.

## 4.3. SQL DDL

DDL dưới đây sử dụng cú pháp MySQL. Đây là cấu trúc cơ sở dữ liệu tham chiếu cho năm bảng của L02.

```sql
CREATE DATABASE IF NOT EXISTS smartcrm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smartcrm;

CREATE TABLE customer (
    customer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE device (
    device_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    serial_imei VARCHAR(100) NOT NULL UNIQUE,
    warranty_end_date DATE,
    CONSTRAINT fk_device_customer
        FOREIGN KEY (customer_id)
        REFERENCES customer(customer_id)
);

CREATE TABLE issue_category (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ticket (
    ticket_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    device_id BIGINT NOT NULL,
    category_id BIGINT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Trung bình',
    status VARCHAR(30) NOT NULL DEFAULT 'Mới',
    commitment_deadline DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

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
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

**Ghi chú triển khai:**

1. `customer.phone` và `device.serial_imei` có chỉ mục từ ràng buộc UNIQUE.
2. `ticket.ticket_code` phải được tạo theo quy tắc mã phiếu của ứng dụng và bảo đảm duy nhất.
3. `commitment_deadline` là thời điểm được Service tính toán; không nên cho người dùng sửa trực tiếp.
4. Khi tạo phiếu thành công, ứng dụng cần ghi thêm bản ghi trạng thái ban đầu “Mới” vào `ticket_status_log`.
5. Các thay đổi trạng thái cần được ghi nhận trong cùng giao dịch phù hợp với thao tác cập nhật phiếu.
6. Quy tắc SLA loại trừ Chủ nhật cần được triển khai ở tầng Service. DDL không tự tính quy tắc này.
7. CHECK được hỗ trợ trong các phiên bản MySQL hiện đại; cần kiểm tra phiên bản MySQL thực tế trước khi triển khai.

---

# MỤC 5. WIREFRAME

## 5.1. Màn hình 1 – Tra cứu khách hàng và thiết bị

**Số điện thoại khách hàng**

- Trường nhập số điện thoại.
- Gợi ý: Nhập số điện thoại để tra cứu.
- Hệ thống chuẩn hóa và kiểm tra định dạng trước khi tìm kiếm.

**Kết quả khách hàng**

- Họ tên khách hàng.
- Số điện thoại, hiển thị đầy đủ hoặc che một phần tùy quyền.

**Serial/IMEI**

- Trường nhập serial/IMEI thiết bị.
- Hiển thị thông tin thiết bị phù hợp sau khi tra cứu.

**Tình trạng bảo hành**

- Còn bảo hành.
- Hết bảo hành.
- Chưa xác minh bảo hành.

**Nút thao tác**

- [Tra cứu khách hàng]
- [Tra cứu thiết bị]
- [Tạo khách hàng mới] nếu chưa tồn tại và người dùng có quyền.

Màn hình chỉ hiển thị các dữ liệu được định nghĩa trong DDL. Không hiển thị email, địa chỉ, ngày mua hoặc nơi mua vì các trường này chưa nằm trong cấu trúc dữ liệu hiện tại.

## 5.2. Màn hình 2 – Tiếp nhận và phân loại yêu cầu

**Khách hàng**

- Chọn khách hàng từ kết quả tra cứu.

**Thiết bị**

- Chọn thiết bị đã xác định bằng serial/IMEI.

**Mô tả lỗi**

- Nhập nội dung khách hàng mô tả.
- Đây là trường bắt buộc.

**Nhóm sự cố**

- Màn hình.
- Pin.
- Sạc.
- Phần mềm.
- Nước vào.
- Khác.

**Mức ưu tiên**

- Cao.
- Trung bình.
- Thấp.

Giá trị mặc định là Trung bình.

**Hạn cam kết**

- Hệ thống tự tính theo mức ưu tiên.
- Trường chỉ đọc, không cho phép sửa trực tiếp.

**Nút thao tác**

- [Tạo phiếu bảo hành]
- [Hủy]

Khi tạo phiếu thành công, hệ thống sinh mã phiếu duy nhất, đặt trạng thái ban đầu là “Mới”, lưu dữ liệu và ghi nhận lịch sử trạng thái ban đầu.

## 5.3. Màn hình 3 – Danh sách phiếu bảo hành

**Bộ lọc trạng thái**

- Tất cả.
- Mới.
- Đã phân công.
- Đang xử lý.
- Chờ linh kiện.
- Hoàn tất.
- Đã đóng.

**Bộ lọc nhóm sự cố**

- Tất cả.
- Màn hình.
- Pin.
- Sạc.
- Phần mềm.
- Nước vào.
- Khác.

**Bộ lọc mức ưu tiên**

- Tất cả.
- Cao.
- Trung bình.
- Thấp.

**Danh sách phiếu**

Mỗi dòng hiển thị:

- Mã phiếu.
- Khách hàng.
- Thiết bị.
- Trạng thái.
- Nhóm sự cố.
- Mức ưu tiên.
- Hạn cam kết.
- Ngày tiếp nhận.

Danh sách hiển thị tối đa 20 phiếu mỗi trang.

**Cảnh báo hạn**

- Đánh dấu phiếu sắp đến hạn.
- Đánh dấu phiếu đã quá hạn.
- Không đánh dấu phiếu ở trạng thái Hoàn tất hoặc Đã đóng.

**Khi không có kết quả**

Hiển thị thông báo: “Không có phiếu phù hợp”.

**Nút thao tác**

- [Lọc danh sách]
- [Xóa bộ lọc]

### Nguyên tắc đồng bộ Wireframe – DDL

- Bảng `customer` chỉ dùng `customer_id`, `full_name`, `phone`.
- Bảng `device` chỉ dùng `device_id`, `customer_id`, `serial_imei`, `warranty_end_date`.
- Bảng `issue_category` chỉ dùng `category_id`, `category_name`.
- Bảng `ticket` chỉ dùng các cột đã khai báo trong DDL.
- Bảng `ticket_status_log` lưu `log_id`, `ticket_id`, `status`, `changed_at`.
- Không hiển thị email, địa chỉ, ngày mua, nơi mua hoặc `ticket.customer_id` vì các trường này không có trong DDL chuẩn.

---

# PHỤ LỤC. BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI

| Công cụ | Mục đích sử dụng | Phần áp dụng | Cách kiểm chứng |
|---|---|---|---|
| Gemini (AI) | Hỗ trợ đề xuất cấu trúc DDL, rà soát câu lệnh SQL và gợi ý cách tổ chức nội dung. | Mục 4 – ERD và SQL DDL. | Đối chiếu thủ công giữa ERD, DDL và SRS; kiểm tra PK, FK, kiểu dữ liệu, ràng buộc và tính nhất quán của các cột. |
| ChatGPT | Hỗ trợ rà soát cách trình bày SRS, tính nhất quán giữa User Story, FR, NFR và quy tắc nghiệp vụ. | Mục 1, Mục 2 và Mục 3. | Đối chiếu nội dung với yêu cầu đề tài, kiểm tra mã yêu cầu, bảng truy vết và xác nhận lại với thiết kế thực tế. |

### Cam kết sử dụng AI

Tôi chịu trách nhiệm kiểm tra, chỉnh sửa và xác nhận tính đúng đắn của nội dung trước khi nộp. Công cụ AI chỉ được sử dụng để hỗ trợ quá trình thực hiện, không thay thế trách nhiệm của người thực hiện. Các nội dung về yêu cầu, thiết kế và cơ sở dữ liệu được đối chiếu với cấu trúc dự án và kết quả kiểm thử thực tế.

**Họ và tên:** Bùi Hoàng Khang  
**MSSV:** 2374802010207  
**Ngày:** 19/10/2026  
**Chữ ký:** ........................................