# Hướng dẫn viết code cho nhóm

## Tải repo

Cài hết cái đống extension t để vào VSCode mà code

## Folder `/src`

Vào folder `src/routes`, thấy các folder và các file tương ứng.

Khi nào giao việc thì vào file này đọc, xong vào folder tương ứng mà code

Nhớ chạy `npm run dev`, xong mở `localhost:1420` trên browser ra mà nhìn giao diện

### Luồng tài khoản

- Khôi phục mật khẩu: Tùng
  - Vào folder `src/routes/(auth)/_layout/password.tsx` viết giao diện vào đây
  - Sửa cái `ForgotPasswordPage` thêm nếm các mục vào
- Xem sửa thông tin tài khoản sau khi đăng nhập: Việt
  - Vào folder `src/dashboard` ra, có các file
    - `_layout.tsx`: là cái phần giao diện chung cho tất cả bên trong cái giao diện ứng dụng
    - `_layout/account/index.tsx`: là cái trang tài khoản, chỗ này cho hiển thị info ng dùng
    - `_layout/account/edit.tsx`: trang chỉnh thông tin tk, cho ng dùng nhập thông tin mới xong có 1 nút submit