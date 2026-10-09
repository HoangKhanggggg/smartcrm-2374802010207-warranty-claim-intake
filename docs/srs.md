## 1.1. Giới thiệu, phạm vi và bảng thuật ngữ

### Giới thiệu

Luồng L02 – Tiếp nhận và phân loại yêu cầu bảo hành thuộc hệ thống Smart CRM của Mekong Mobile, hỗ trợ nhân viên tiếp nhận ghi nhận thông tin khách hàng, thiết bị và yêu cầu bảo hành trên hệ thống. Thay vì quản lý hoàn toàn bằng phiếu giấy, hệ thống lưu trữ thông tin theo mã phiếu duy nhất, hỗ trợ phân loại sự cố, xác định mức ưu tiên và tính hạn cam kết xử lý theo quy tắc đã cấu hình.

### Phạm vi

Quản lý tiếp nhận và phân loại yêu cầu bảo hành: nhân viên tiếp nhận tra cứu khách hàng, ghi nhận thiết bị và kiểm tra bảo hành, ghi mô tả lỗi, phân loại nhóm sự cố và mức ưu tiên để tạo phiếu bảo hành có hạn cam kết tự động; quản lý trung tâm theo dõi danh sách phiếu và phiếu sắp hoặc quá hạn.

### Bảng thuật ngữ

| Thuật ngữ | Ý nghĩa nghiệp vụ |
|---|---|
| CRM | Hệ thống quản lý quan hệ khách hàng |
| L02 | Luồng tiếp nhận và phân loại yêu cầu bảo hành |
| SRS | Tài liệu đặc tả yêu cầu phần mềm |
| US | User Story – câu chuyện người dùng |
| FR | Functional Requirement – yêu cầu chức năng |
| NFR | Non-functional Requirement – yêu cầu phi chức năng |
| UC | Use Case – trường hợp sử dụng |
| MoSCoW | Phương pháp phân loại mức độ ưu tiên yêu cầu |
| ERD | Sơ đồ thực thể liên kết dữ liệu |
| PK | Khóa chính |
| FK | Khóa ngoại |
| DDL | Các câu lệnh định nghĩa cấu trúc cơ sở dữ liệu |

## 1.2. Các bên liên quan và vai trò người dùng

| Actor | Vai trò |
|---|---|
| Nhân viên tiếp nhận | Tra cứu khách, ghi nhận thiết bị, tạo phiếu, phân loại |
| Quản lý trung tâm | Theo dõi danh sách phiếu, phiếu quá hạn, phê duyệt phiếu chưa xác minh bảo hành |
| Bộ đếm thời gian | Kích hoạt kiểm tra định kỳ phiếu sắp hoặc quá hạn cam kết |

## 1.3. Yêu cầu chức năng

### A. Danh sách User Story

| Mã US | User Story | Actor | MoSCoW |
|---|---|---|---|
| US01 | Là nhân viên tiếp nhận, tôi muốn tra cứu khách hàng bằng số điện thoại và tạo hồ sơ mới nếu chưa có, để không phải hỏi lại thông tin đã lưu và tránh tạo hồ sơ trùng. | Nhân viên tiếp nhận | MUST |
| US02 | Là nhân viên tiếp nhận, tôi muốn ghi nhận thiết bị bằng số serial/IMEI và để hệ thống kiểm tra còn hay hết bảo hành, để không nhận nhầm máy hết hạn vào diện miễn phí. | Nhân viên tiếp nhận | MUST |
| US03 | Là nhân viên tiếp nhận, tôi muốn ghi mô tả lỗi khách kể và tạo phiếu bảo hành có mã duy nhất, để mọi yêu cầu có hồ sơ theo dõi thay cho phiếu giấy. | Nhân viên tiếp nhận | MUST |
| US04 | Là nhân viên tiếp nhận, tôi muốn chọn nhóm sự cố từ danh mục cố định, để công ty thống kê được nguyên nhân bảo hành phổ biến nhất. | Nhân viên tiếp nhận | SHOULD |
| US05 | Là nhân viên tiếp nhận, tôi muốn chọn mức ưu tiên Cao/Trung bình/Thấp cho phiếu, để phiếu gấp được xử lý trước. | Nhân viên tiếp nhận | SHOULD |
| US06 | Là nhân viên tiếp nhận, tôi muốn xem hạn cam kết do hệ thống tính ngay khi chọn mức ưu tiên, để hẹn ngày trả máy chính xác với khách thay vì ước lượng theo cảm tính. | Nhân viên tiếp nhận | SHOULD |
| US07 | Là quản lý trung tâm, tôi muốn xem danh sách phiếu bảo hành theo trạng thái, nhóm sự cố và mức ưu tiên, để nắm khối lượng công việc trong ngày mà không phải đếm phiếu giấy. | Quản lý trung tâm | MUST |

### B. Tiêu chí chấp nhận (Given – When – Then)

#### US01 – Tra cứu khách hàng và tạo hồ sơ mới (MUST)

**AC1 – Tìm thấy khách hàng**
- **Given:** Nhân viên đang ở màn hình “Tạo phiếu tiếp nhận” và khách có số `0901234567` đã tồn tại.
- **When:** Nhân viên nhập `0901 234 567` và nhấn “Tìm kiếm” (hoặc Enter).
- **Then:** Hệ thống chuẩn hóa về `0901234567`, hiển thị hồ sơ có sẵn (họ tên, số điện thoại dạng che, địa chỉ, email), điền vào form tiếp nhận và không tạo hồ sơ mới (QT-01, QT-02).

**AC2 – Không tìm thấy, tạo hồ sơ mới**
- **Given:** Số điện thoại hợp lệ chưa có trong hệ thống.
- **When:** Nhân viên nhấn “Tạo khách hàng mới”, nhập họ tên (bắt buộc) và các thông tin không bắt buộc (địa chỉ, email), rồi nhấn “Lưu”.
- **Then:** Hệ thống lưu hồ sơ với số điện thoại đã chuẩn hóa, hiển thị “Tạo khách hàng thành công” và gắn khách vào phiếu đang lập. Nếu bỏ trống họ tên, hệ thống chặn lưu và đánh dấu đỏ trường thiếu.

**AC3 – Số điện thoại không hợp lệ (ngoại lệ)**
- **Given:** Nhân viên nhập vào ô tìm kiếm.
- **When:** Chuỗi nhập chứa chữ cái hoặc sau khi chuẩn hóa không đủ 10 chữ số bắt đầu bằng 0.
- **Then:** Hệ thống báo “Số điện thoại không hợp lệ” ngay tại ô nhập và không thực hiện tìm kiếm hay tạo hồ sơ.

#### US02 – Ghi nhận thiết bị và kiểm tra bảo hành (MUST)

**AC1 – Xác định tình trạng bảo hành**
- **Given:** Khách đã được xác định trên phiếu; thiết bị có số serial/IMEI hợp lệ và ngày mua.
- **When:** Nhân viên nhập tên máy, serial/IMEI, ngày mua, nơi mua và nhấn “Lưu thiết bị”.
- **Then:** Hệ thống tính (ngày tiếp nhận − ngày mua) so với số tháng bảo hành của sản phẩm (QT-05): nếu trong hạn thì hiển thị “Còn bảo hành” (miễn phí); nếu quá hạn thì hiển thị “Hết bảo hành” kèm nhãn “Có tính phí”.

**AC2 – Không có ngày mua (ngoại lệ)**
- **Given:** Khách không nhớ ngày mua, không có hóa đơn và nhân viên không tra được từ cửa hàng.
- **When:** Nhân viên để trống ngày mua và nhấn “Lưu thiết bị”.
- **Then:** Hệ thống cho phép lưu, đánh dấu phiếu “Chưa xác minh bảo hành”, không cho nhân viên tự chọn “Còn bảo hành” và chuyển phiếu vào hàng chờ quản lý phê duyệt (QT-05).

**AC3 – Serial/IMEI thuộc khách khác (ngoại lệ)**
- **Given:** Số serial/IMEI đã gắn với khách hàng khác.
- **When:** Nhân viên nhấn “Lưu thiết bị”.
- **Then:** Hệ thống từ chối lưu, báo “Thiết bị đã thuộc về khách hàng khác” và giữ nguyên dữ liệu đã nhập (QT-03).

#### US03 – Ghi mô tả lỗi và tạo phiếu bảo hành (MUST)

**AC1 – Tạo phiếu thành công**
- **Given:** Khách và thiết bị đã được xác định.
- **When:** Nhân viên nhập mô tả lỗi khách kể, tick phụ kiện kèm theo và tình trạng ngoại quan (nếu có), rồi nhấn “Tạo phiếu”.
- **Then:** Hệ thống lưu phiếu ở trạng thái “Mới”, sinh mã dạng `BH-000123/2026`, đặt mức ưu tiên mặc định Trung bình nếu chưa chọn, tính hạn cam kết theo QT-04, ghi dòng đầu tiên vào lịch sử chuyển trạng thái (QT-06) và hiển thị “Tạo phiếu bảo hành thành công” kèm nút “In phiếu tiếp nhận”.

**AC2 – Thiếu thông tin bắt buộc (ngoại lệ)**
- **Given:** Nhân viên đang lập phiếu.
- **When:** Nhân viên để trống “Mô tả lỗi” hoặc chưa có thiết bị rồi nhấn “Tạo phiếu”.
- **Then:** Hệ thống không lưu, đánh dấu đỏ trường thiếu và hiển thị thông báo tương ứng.

**AC3 – Lỗi khi lưu (ngoại lệ)**
- **Given:** Dữ liệu form hợp lệ.
- **When:** Việc lưu thất bại do lỗi kết nối hoặc cơ sở dữ liệu.
- **Then:** Hệ thống báo “Chưa lưu được phiếu, vui lòng thử lại”, giữ nguyên dữ liệu trên form và không để lại phiếu hoặc lịch sử trạng thái dang dở.

#### US04 – Phân loại nhóm sự cố (SHOULD)

- **AC1:** Given nhân viên đang lập phiếu, When mở trường “Nhóm sự cố”, Then hệ thống hiển thị đúng 6 nhóm đang sử dụng: Màn hình, Pin, Sạc, Phần mềm, Nước vào, Khác.
- **AC2 (ngoại lệ):** Given nhân viên chưa chọn nhóm, When nhấn “Tạo phiếu”, Then hệ thống vẫn lưu phiếu với nhóm “Chưa phân loại” (`category_id` rỗng) và hiển thị nhắc nhở bổ sung nhóm sự cố sau.

#### US05 – Chọn mức ưu tiên (SHOULD)

- **AC1:** Given nhân viên đang lập phiếu, When chọn “Mức ưu tiên”, Then hệ thống chỉ cho chọn Cao, Trung bình hoặc Thấp và hiển thị nhãn màu tương ứng (Cao – đỏ, Trung bình – vàng, Thấp – xám).
- **AC2:** Given nhân viên đã chọn nhóm sự cố, When form hiển thị mức ưu tiên, Then hệ thống chọn sẵn mức mặc định của nhóm đó (`default_priority`); nếu chưa chọn nhóm thì chọn sẵn Trung bình; nhân viên được phép đổi.

#### US06 – Xem hạn cam kết tự động (SHOULD)

- **AC1:** Given nhân viên đang lập phiếu, When chọn hoặc đổi mức ưu tiên, Then hệ thống tính lại và hiển thị ngay hạn cam kết = thời điểm tiếp nhận + 24/72/120 giờ theo mức Cao/Trung bình/Thấp (QT-04); nhân viên không sửa tay được ô này.
- **AC2 (ví dụ quy tắc ngày làm việc):** Given phiếu tiếp nhận lúc 10:00 Thứ Bảy, mức ưu tiên Cao (24 giờ), When hệ thống tính hạn, Then hạn cam kết là 10:00 Thứ Hai vì Chủ nhật không được tính.

#### US07 – Xem danh sách phiếu (SHOULD)

- **AC1:** Given quản lý mở “Quản lý phiếu bảo hành”, When trang tải xong, Then hệ thống hiển thị danh sách phân trang (20 phiếu/trang) với các cột: Mã phiếu, Khách hàng, Thiết bị, Trạng thái, Nhóm sự cố, Mức ưu tiên, Hạn cam kết, Ngày tiếp nhận; chỉ gồm phiếu của trung tâm mình phụ trách (QT-14).
- **AC2:** Given danh sách đang hiển thị, When quản lý chọn bộ lọc trạng thái, nhóm sự cố, mức ưu tiên (kết hợp được), Then chỉ các phiếu thỏa mọi điều kiện được hiển thị.
- **AC3 (ngoại lệ):** Given bộ lọc không khớp phiếu nào, When áp dụng bộ lọc, Then hệ thống hiển thị “Không có phiếu phù hợp” thay vì bảng trống.

### C. Danh sách yêu cầu chức năng (FR)

| Mã FR | Yêu cầu chức năng | US liên quan |
|---|---|---|
| FR01 | Hệ thống cho phép tra cứu khách hàng bằng số điện thoại và hiển thị kết quả phù hợp. | US01 |
| FR02 | Hệ thống cho phép tạo hồ sơ khách hàng mới khi chưa có hồ sơ phù hợp. | US01 |
| FR03 | Hệ thống cho phép ghi nhận hoặc tra cứu thiết bị bằng serial/IMEI. | US02 |
| FR04 | Hệ thống hiển thị tình trạng bảo hành dựa trên dữ liệu bảo hành có sẵn. | US02 |
| FR05 | Hệ thống cho phép nhập và lưu mô tả lỗi của thiết bị. | US03 |
| FR06 | Hệ thống tạo mã phiếu bảo hành duy nhất khi tạo phiếu thành công. | US03 |
| FR07 | Hệ thống cung cấp danh mục nhóm sự cố để nhân viên lựa chọn. | US04 |
| FR08 | Hệ thống cho phép chọn một trong ba mức ưu tiên Cao, Trung bình, Thấp. | US05 |
| FR09 | Hệ thống tính và hiển thị hạn cam kết theo quy tắc đã cấu hình. | US06 |
| FR10 | Hệ thống cho phép quản lý xem và lọc danh sách phiếu theo các tiêu chí được hỗ trợ. | US07 |
| FR11 | Hệ thống cho phép nhận diện phiếu sắp đến hạn hoặc đã quá hạn. | US07 |

## 1.4. Yêu cầu phi chức năng (NFR)

| Mã | Yêu cầu | Tiêu chí đo lường | Cách kiểm tra |
|---|---|---|---|
| NFR01 | Hiệu năng | 95% thao tác tra cứu khách hàng và thiết bị phản hồi trong không quá 2 giây với 50 người dùng đồng thời trong môi trường kiểm thử. | Đo thời gian phản hồi bằng công cụ kiểm thử tải. |
| NFR02 | Tính toàn vẹn dữ liệu | 100% phiếu được tạo thành công có mã phiếu duy nhất; không cho phép lưu phiếu khi thiếu trường bắt buộc. | Kiểm thử trùng mã và dữ liệu thiếu. |
| NFR03 | Bảo mật | 100% API tạo và xem phiếu phải kiểm tra quyền truy cập theo vai trò. | Kiểm thử truy cập bằng tài khoản không đủ quyền. |
| NFR04 | Khả năng sử dụng | Người dùng thử nghiệm hoàn thành quy trình tạo phiếu trong tối đa 3 phút sau hướng dẫn ngắn. | Thực hiện kiểm thử khả năng sử dụng với kịch bản xác định. |

## 1.5. Ràng buộc và quy tắc nghiệp vụ

| Mã | Quy tắc | Áp dụng |
|---|---|---|
| QT-01 | Số điện thoại duy nhất; nhập số đã có thì hiển thị hồ sơ cũ. | FR-02 |
| QT-02 | Chuẩn hóa số điện thoại về 10 chữ số bắt đầu bằng 0 (xử lý +84, 84, dấu cách, dấu chấm). | FR-01 |
| QT-03 | Thiết bị xác định duy nhất bằng serial/IMEI; chỉ thuộc một khách tại một thời điểm. | FR-03 |
| QT-04 | Hạn cam kết sinh tự động: Cao 24 giờ, Trung bình 72 giờ, Thấp 120 giờ; không tính Chủ nhật. | FR-07, FR-10 |
| QT-05 | Còn bảo hành khi (ngày tiếp nhận − ngày mua) ≤ số tháng bảo hành; thiếu ngày mua thì “Chưa xác minh bảo hành” và cần quản lý duyệt. | FR-04, FR-13 |
| QT-06 | Chuyển trạng thái theo đúng vòng đời, không quay lại; mọi lần chuyển đều ghi lịch sử. | FR-06 |
| QT-13 | Không xóa vật lý phiếu, đơn hàng, hồ sơ khách; chỉ xóa mềm. | Toàn bộ |
| QT-14 | Nhân viên chỉ xem dữ liệu trung tâm mình; quản lý xem đơn vị mình phụ trách. | FR-11 |
| QT-15 | Số điện thoại dạng che trừ Quản lý và Ban giám đốc. | FR-01, FR-11 |

## 1.6. Bảng truy vết yêu cầu

| Mã vấn đề hiện tại (case study, Bảng 2.2) | Luồng L02 giải quyết bằng |
|---|---|
| V2 – Phiếu giấy, không biết phiếu ở bước nào, khoảng 15% phiếu quá hạn mà không được cảnh báo. | Phiếu điện tử có trạng thái, hạn cam kết tự sinh, màn hình theo dõi quá hạn (US06, US07, US08). |
| V8 – Mô tả lỗi ghi tự do, không thống kê được nguyên nhân. | Chọn nhóm sự cố từ danh mục cố định (US04). |
| V1 – Hồ sơ khách trùng 18–22%. | Tra cứu theo số điện thoại đã chuẩn hóa, không tạo trùng (US01). |

