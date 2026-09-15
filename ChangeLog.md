# Changelog

All notable changes to this project will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.2.0] - 2026-09-16

### Sửa lỗi

- **Entities** — Thêm `type` tường minh vào các `@Column` có union type (`X | null`) để tránh lỗi `DataTypeNotSupportedError` của TypeORM
  - `role.entity.ts` — cột `name: string | null`
  - `user.entity.ts` — cột `fullName`, `phone`, `avatarUrl`
  - `venue.entity.ts` — cột `street`
  - `payment.entity.ts` — cột `transactionRef`
- **`app.module.ts`** — Thay `autoLoadEntities: true` bằng mảng `entities` tường minh; tất cả 15 entity luôn được đăng ký bất kể module tương ứng đã tạo hay chưa
- **`main.ts`** — Xóa import `ObserveInstrument` và option `instrument` còn sót lại từ package observability đã bị gỡ

### Thêm mới

- **`src/modules/auth/interfaces/jwt-payload.interface.ts`** — Tách `JwtPayload` và `RolePayload` ra file riêng để dùng chung giữa `AuthService`, `JwtStrategy` và các auth code sau này
- **`src/migrations/1789495473654-UpdateEntities.ts`** — Migration được generate và đã chạy thành công cho các thay đổi kiểu cột entity

### Thay đổi

- **`jwt.strategy.ts`** — Đổi `JwtPayload.role: string` → `roles: RolePayload[]` (đúng số nhiều và đúng kiểu plain object cho JWT decoded payload)
- **`.env.local.example`** — Viết lại với đầy đủ biến môi trường và comment tiếng Anh ngắn gọn

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
