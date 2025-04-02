# Fast Order

Fast Order là một ứng dụng di động được xây dựng bằng React Native và Expo, cho phép người dùng đặt đồ ăn một cách nhanh chóng và tiện lợi. Ứng dụng cung cấp giao diện người dùng trực quan, tích hợp với Supabase để quản lý dữ liệu và xác thực người dùng.

![Fast Order App](image.png)

## Tính năng chính

- **Xác thực người dùng**: Đăng ký, đăng nhập, và quản lý tài khoản
- **Duyệt sản phẩm**: Xem danh sách sản phẩm theo danh mục
- **Tìm kiếm**: Tìm kiếm sản phẩm theo tên
- **Giỏ hàng**: Thêm, xóa, và cập nhật số lượng sản phẩm trong giỏ hàng
- **Đặt hàng**: Hoàn tất đơn hàng với địa chỉ giao hàng và phương thức thanh toán
- **Lịch sử đơn hàng**: Xem danh sách và chi tiết các đơn hàng đã đặt
- **Hồ sơ người dùng**: Quản lý thông tin cá nhân và địa chỉ giao hàng

## Công nghệ sử dụng

- **Frontend**: React Native, Expo, TypeScript
- **Styling**: NativeWind (Tailwind CSS cho React Native)
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **State Management**: React Context API và React Hooks

## Cài đặt và chạy dự án

### Yêu cầu

- Node.js (v14 trở lên)
- npm hoặc yarn
- Expo CLI
- Tài khoản Supabase

### Các bước cài đặt

1. Clone repository:
   ```bash
   git clone https://github.com/HuyHCMUS/fast-order.git
   cd fast_order
   ```

2. Cài đặt các dependencies:
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. Tạo file `.env` và cấu hình các biến môi trường:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Khởi chạy ứng dụng:
   ```bash
   npx expo start
   ```

5. Chạy ứng dụng trên thiết bị di động hoặc máy ảo:
   - Quét mã QR bằng ứng dụng Expo Go trên thiết bị di động
   - Nhấn `a` để chạy trên máy ảo Android
   - Nhấn `i` để chạy trên máy ảo iOS

## Cấu trúc dự án

```
fast_order/
├── assets/              # Hình ảnh, font chữ và tài nguyên khác
├── components/          # Các component có thể tái sử dụng
├── database/            # Schema và dữ liệu mẫu cho Supabase
├── hooks/               # Custom React hooks
├── lib/                 # Thư viện và tiện ích
├── navigation/          # Cấu hình điều hướng
├── screens/             # Các màn hình của ứng dụng
│   ├── auth/            # Màn hình xác thực (đăng nhập, đăng ký)
│   ├── cart/            # Màn hình giỏ hàng và thanh toán
│   ├── home/            # Màn hình chính và chi tiết sản phẩm
│   ├── orders/          # Màn hình đơn hàng và chi tiết đơn hàng
│   └── profile/         # Màn hình hồ sơ người dùng
├── services/            # Các service giao tiếp với API
├── types/               # Định nghĩa TypeScript
├── App.tsx              # Component gốc của ứng dụng
├── app.json             # Cấu hình Expo
├── babel.config.js      # Cấu hình Babel
├── package.json         # Dependencies và scripts
├── tailwind.config.js   # Cấu hình NativeWind
└── tsconfig.json        # Cấu hình TypeScript
```

## Cấu hình Supabase

### Bảng dữ liệu

- **categories**: Danh mục sản phẩm
- **products**: Sản phẩm
- **cart**: Giỏ hàng của người dùng
- **addresses**: Địa chỉ giao hàng
- **orders**: Đơn hàng
- **order_items**: Chi tiết đơn hàng

### Row Level Security (RLS)

Dự án sử dụng Row Level Security của Supabase để bảo vệ dữ liệu. Các policies đã được cấu hình để:

- Cho phép người dùng đọc tất cả sản phẩm và danh mục
- Cho phép người dùng quản lý giỏ hàng của họ
- Cho phép người dùng xem và tạo đơn hàng của họ
- Hạn chế người dùng chỉ truy cập dữ liệu của chính họ

## Kiến trúc ứng dụng

### Quản lý trạng thái

Ứng dụng sử dụng React Context API và React Hooks để quản lý trạng thái. Các service được tách biệt để xử lý logic nghiệp vụ và giao tiếp với Supabase.

### Styling

Ứng dụng sử dụng NativeWind (Tailwind CSS cho React Native) để styling, giúp phát triển giao diện nhanh chóng và nhất quán.

### Xác thực

Xác thực người dùng được xử lý thông qua Supabase Auth, hỗ trợ đăng ký và đăng nhập bằng email/mật khẩu.

## Phát triển

### Thêm tính năng mới

1. Tạo các component cần thiết trong thư mục `components/`
2. Thêm màn hình mới trong thư mục `screens/`
3. Cập nhật điều hướng trong thư mục `navigation/`
4. Thêm service mới trong thư mục `services/` nếu cần

### Quy ước code

- Sử dụng TypeScript cho tất cả các file
- Sử dụng functional components và React Hooks
- Tách biệt logic nghiệp vụ khỏi UI components
- Sử dụng NativeWind cho styling

## Triển khai

### Expo Build

Để build ứng dụng cho iOS và Android:

```bash
eas build --platform ios
eas build --platform android
```

### Cập nhật Supabase

Các script SQL để cấu hình Supabase được lưu trong thư mục `database/`. Sử dụng các script này để cấu hình cơ sở dữ liệu Supabase của bạn.

## Đóng góp

Đóng góp cho dự án luôn được chào đón. Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit các thay đổi (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request


