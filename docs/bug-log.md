# Bug Log – Smart CRM L02

## BUG-01 – Backend không khởi động do lỗi mật khẩu PostgreSQL

1. **Triệu chứng:** Backend không khởi động và báo:
   `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`.

2. **Cách tái lập:** Chạy `npm start` khi biến `DB_PASSWORD` chưa được nạp đúng từ file `.env`.

3. **Khoanh vùng:** Kiểm tra cấu hình môi trường và quá trình khởi tạo PostgreSQL connection pool.

4. **Nguyên nhân gốc:** Biến môi trường chứa mật khẩu PostgreSQL không được truyền vào kết nối dưới dạng chuỗi hợp lệ.

5. **Cách sửa:** Kiểm tra lại `.env`, tên biến `DB_PASSWORD` và cấu hình `dotenv` trước khi tạo kết nối PostgreSQL.

6. **Xác nhận:** Chạy lại `npm start`, migration chạy thành công và backend khởi động tại port 3001.

7. **Commit:** Commit cấu hình môi trường và dependency của dự án.


## BUG-02 – Port backend bị xung đột

1. **Triệu chứng:** Backend không thể chạy khi port mặc định bị tiến trình khác sử dụng.

2. **Cách tái lập:** Khởi động ứng dụng trong môi trường đang có tiến trình chiếm port 3000.

3. **Khoanh vùng:** Kiểm tra cấu hình port trong `src/app.js` và trạng thái các port đang sử dụng.

4. **Nguyên nhân gốc:** Port 3000 bị tiến trình khác chiếm.

5. **Cách sửa:** Chuẩn hóa backend chạy trên port 3001 thông qua biến `PORT`.

6. **Xác nhận:** Backend chạy thành công tại:
   `http://localhost:3001`.

7. **Commit:** Commit thay đổi cấu hình port backend.


## BUG-03 – Frontend không thể gọi backend khi API URL không đúng

1. **Triệu chứng:** Giao diện frontend không lấy được dữ liệu từ backend.

2. **Cách tái lập:** Chạy frontend nhưng cấu hình API URL không trỏ tới backend đang chạy.

3. **Khoanh vùng:** Kiểm tra `src/frontend/src/api/client.js` và request trong trình duyệt.

4. **Nguyên nhân gốc:** Frontend cần sử dụng đúng URL backend.

5. **Cách sửa:** Chuẩn hóa:
   `VITE_API_URL`
   và giá trị mặc định:
   `http://localhost:3001`.

6. **Xác nhận:** Frontend gọi được các API `/auth/login`, `/customers`, `/devices`, `/categories` và `/tickets`.

7. **Commit:** Commit hoàn thiện cấu hình môi trường và dependency.


## BUG-04 – Lỗi xử lý phiên đăng nhập hết hạn

1. **Triệu chứng:** API trả HTTP 401 khi token không còn hợp lệ.

2. **Cách tái lập:** Gửi request với token không hợp lệ hoặc token đã hết hạn.

3. **Khoanh vùng:** Kiểm tra `src/frontend/src/api/client.js`.

4. **Nguyên nhân gốc:** Frontend cần xử lý thống nhất response 401 từ backend.

5. **Cách sửa:** Xóa token khỏi `localStorage` và phát sự kiện `smartcrm:unauthorized`.

6. **Xác nhận:** Khi backend trả 401, frontend xóa phiên đăng nhập và yêu cầu đăng nhập lại.

7. **Commit:** Commit xử lý authentication và unauthorized response.