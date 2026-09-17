# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.3.0] - 2026-09-18

### Thêm mới

- **API Đăng ký tài khoản (`POST /auth/register`)**:
  - `RegisterRequestDto` — Nhận dữ liệu đăng ký với validation chặt chẽ (email, password, full name, phone number tùy chọn).
  - `RegisterResponseDto` — Chuẩn hóa dữ liệu trả về cho client, ẩn `passwordHash`.
  - `AuthController` — Endpoint `POST /auth/register` (HTTP 201 Created) với tài liệu OpenAPI/Swagger chi tiết (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
  - `AuthService.register()` — Xử lý logic nghiệp vụ đăng ký tài khoản, tài khoản mới có trạng thái mặc định `INACTIVE` và `isVerified: false`.
  - `AuthMapper` — Mapper chuyển đổi giữa `User` entity và `RegisterResponseDto`.
  - `IsStrongPasswordConstraint` (`src/common/validator/password.validator.ts`) — Custom validator kiểm tra mật khẩu mạnh (tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt).
- **`UsersModule` (`src/modules/users/`)**:
  - Khởi tạo `UsersModule` và `UsersService` độc lập để đóng gói toàn bộ thao tác với bảng `users` và `roles`.
  - Cung cấp các hàm Public API: `findByEmail()`, `findById()`, `create()`.
  - Tự động tìm và gán role mặc định (`user`) vào thuộc tính `roles: Role[]` để TypeORM tự động lưu vào bảng liên kết `users_roles`.
- **Enum `RoleType` (`src/common/enums/role.enum.ts`)**:
  - Định nghĩa 4 role của hệ thống: `superadmin`, `admin`, `host`, `user`.
  - Re-export qua `src/common/index.ts`.
- **Migration `SeedRoles` (`src/migrations/1789495500000-SeedRoles.ts`)**:
  - Migration khởi tạo và nạp an toàn 4 role (`superadmin`, `admin`, `host`, `user`) vào bảng `roles` của Database.

### Tối ưu hóa

- **Tối ưu hóa thời gian xử lý API Register**:
  - Sử dụng `Promise.all` để chạy song song việc kiểm tra trùng email (`usersService.findByEmail`) và mã hóa mật khẩu (`bcrypt.hash`), triệt tiêu thời gian chờ CPU.
  - Thêm cơ chế in-memory caching cho role mặc định (`defaultUserRole`) trong `UsersService` để tránh việc query database bảng `roles` mỗi lần có người đăng ký.

### Thay đổi kiến trúc

- **`AuthModule`** — Chuyển từ việc inject trực tiếp `User` repository sang giao tiếp một chiều thông qua `UsersModule` (`imports: [UsersModule]`), xóa bỏ hoàn toàn sự phụ thuộc chéo vòng tròn (Circular Dependency) giữa Auth và Users.
- **`AppModule`** — Đăng ký `UsersModule` vào cây module gốc của ứng dụng.

## [0.2.0] - 2026-09-16

### Sửa lỗi

- **Entities** — Thêm `type` tường minh vào các `@Column` có union type (`X | null`) để tránh lỗi `DataTypeNotSupportedError` của TypeORM
  - `role.entity.ts` — cột `name`
  - `user.entity.ts` — cột `fullName`, `phone`, `avatarUrl`
  - `venue.entity.ts` — cột `street`
  - `payment.entity.ts` — cột `transactionRef`
- **`app.module.ts`** — Tạm thời comment `autoLoadEntities: true`, sử dụng mảng `entities` đăng ký tất cả 15 entity dù module được tạo hay chưa
- **`main.ts`** — Xóa import `ObserveInstrument` và option `instrument`

### Thêm mới

- **`src/modules/auth/interfaces/jwt-payload.interface.ts`** — Tách `JwtPayload` và `RolePayload` ra file riêng để dùng chung giữa `AuthService`, `JwtStrategy` và các auth code sau này
- **`src/migrations/1789495473654-UpdateEntities.ts`** — Migration được generate và đã chạy thành công cho các thay đổi kiểu cột entity

### Thay đổi

- **`jwt.strategy.ts`** — Đổi `JwtPayload.role: string` → `roles: RolePayload[]` (Sửa lại để phù hợp với thiết kế multi-role của hệ thống)
- **`.env.local.example`** — Bổ sung thêm các biến môi trường còn thiếu

### Gỡ bỏ

- **`@nestjs/observe`** — Xóa package observability không sử dụng
- **`src/common/user-status.enum.ts`** — Xóa file trùng lặp (file chuẩn nằm tại `src/common/enums/user-status.enum.ts`)

## [0.1.0] - 2026-09-13

### Added

#### Enums (`src/common/enums/`)

- `UserStatus` — trạng thái tài khoản người dùng (`active`, `inactive`, `banned`)
- `OtpPurpose` — mục đích OTP (`confirm_account`, `reset_password`)
- `VenueStatus` — trạng thái venue (`pending`, `approved`, `blocked`)
- `SpaceType` — loại không gian (`private_office`, `meeting_room`, `desk`)
- `VerificationStatus` — trạng thái xác minh (`pending`, `approved`, `rejected`)
- `PriceUnit` — đơn vị giá (`hour`, `day`, `month`)
- `BookingStatus` — trạng thái đặt chỗ (`pending_payment`, `confirmed`, `cancelled`, `completed`)
- `PaymentMethod` — phương thức thanh toán (`vnpay`, `momo`, `stripe`)
- `PaymentStatus` — trạng thái thanh toán (`pending`, `success`, `failed`, `refunded`)
- `NotificationType` — loại thông báo (7 loại)

#### Entities (theo module)

- **`users` module**: `User`, `Role`, `UserIdentityVerification`
- **`auth` module**: `RefreshToken`, `OtpVerification`
- **`venues` module**: `Venue`, `Amenity`, `VenueBusinessVerification`
- **`spaces` module**: `Space`, `SpacePrice`
- **`bookings` module**: `Booking`
- **`payments` module**: `Payment`
- **`conversations` module**: `Conversation`, `Message`
- **`notifications` module**: `Notification`

#### Configuration

- Cập nhật `src/common/index.ts` — barrel file re-export tất cả enum
- Hoàn thiện `src/data-source.ts` — DataSource riêng cho TypeORM CLI, dùng `DATABASE_URL_UNPOOLED`
- Thêm `baseUrl: "."` vào `tsconfig.json`
- Thêm scripts vào `package.json`: `migration:generate`, `migration:run`, `migration:revert`, `migration:show`

### Notes

- `latitude`/`longitude` và các trường `numeric` (price, amount) được khai báo là `string` vì TypeORM serialize `decimal`/`numeric` thành string
- Constraint `no_overlap` (EXCLUDE USING gist + btree_gist) cần được thêm thủ công vào migration file
- Import enum dùng relative path (không dùng `@common` alias) vì `module: nodenext` không hỗ trợ custom path resolution ở runtime
