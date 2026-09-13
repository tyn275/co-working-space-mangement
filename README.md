# Co-working Space Management System (Backend API)

Hệ thống quản lý và vận hành chuỗi không gian làm việc chung (Co-working Space), hỗ trợ đặt chỗ linh hoạt, kiểm soát trùng lịch thời gian thực, thanh toán đa cổng, và quốc tế hóa (i18n).

---

## Công nghệ sử dụng (Tech Stack)

- **Framework**: [NestJS](https://nestjs.com/) (Node.js & TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Triển khai trên [Neon Serverless Postgres](https://neon.tech/))
- **ORM & Migrations**: [TypeORM](https://typeorm.io/)
- **Xử lý xung đột lịch (Concurrency / Overlap Prevention)**: PostgreSQL `btree_gist` extension với ràng buộc `EXCLUDE USING gist`
- **Đa ngôn ngữ (i18n)**:
  - Server-side messages & templates: `nestjs-i18n`
  - Dynamic content (Tiện ích, mô tả địa điểm): Cột `JSONB` trong PostgreSQL
- **Git Hooks & Chuẩn hóa code**: [Husky](https://typicode.github.io/husky/) + [Commitlint](https://commitlint.js.org/) (Conventional Commits) + Prettier

---

## Kiến trúc & Các Phân hệ (Modules)

```
src/
├── common/
├── i18n/
├── migrations/
└── modules/
    ├── auth/
    ├── bookings/
    ├── conversations/
    ├── notifications/
    ├── payments/
    ├── spaces/
    ├── users/
    └── venues/
```

| Thư mục / Module             | Chức năng chính                                                    |
| ---------------------------- | ------------------------------------------------------------------ |
| `src/common/`                | Enums, DTOs, Decorators, Guards, Filters dùng chung                |
| `src/i18n/`                  | File từ điển đa ngôn ngữ tĩnh (vi, en)                             |
| `src/migrations/`            | Lịch sử TypeORM schema migrations                                  |
| `src/modules/auth/`          | Xác thực JWT, Refresh Token, OTP xác minh tài khoản                |
| `src/modules/users/`         | Quản lý người dùng, Phân quyền RBAC, KYC CMND/CCCD                 |
| `src/modules/venues/`        | Quản lý địa điểm, Duyệt giấy phép kinh doanh, Tiện ích             |
| `src/modules/spaces/`        | Quản lý không gian (Hot desk, Phòng họp, Private office), Bảng giá |
| `src/modules/bookings/`      | Đặt chỗ, Kiểm soát chống trùng lịch (no_overlap constraint)        |
| `src/modules/payments/`      | Tích hợp thanh toán (VNPay, MoMo, Stripe)                          |
| `src/modules/conversations/` | Chat / Tin nhắn giữa khách hàng và quản lý địa điểm                |
| `src/modules/notifications/` | Thông báo đa kênh (Đặt phòng, thanh toán, kích hoạt tài khoản)     |

---

## Cài đặt và Chạy thử (Getting Started)

### 1. Yêu cầu môi trường

- **Node.js**: `>= 20.x`
- **npm**: `>= 10.x`
- **PostgreSQL Database** (Đã kích hoạt extension `btree_gist`)

### 2. Cài đặt Dependencies & Git Hooks

```bash
npm install
```

_(Lệnh này sẽ tự động khởi chạy `husky` để thiết lập commit hook kiểm tra định dạng commit)_

### 3. Cấu hình biến môi trường

Sao chép file `.env.local.example` thành `.env.local` và cập nhật thông số kết nối Database:

```bash
cp .env.local.example .env.local
```

Cấu hình trong `.env.local`:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
```

### 4. Đồng bộ Database (Migrations)

```bash
# Chạy toàn bộ migrations lên database
npm run migration:run

# (Tùy chọn) Kiểm tra trạng thái migrations
npm run migration:show
```

### 5. Khởi chạy ứng dụng

```bash
# Chế độ phát triển (watch mode)
npm run start:dev

# Chế độ kiểm tra build
npm run build

# Chế độ production
npm run start:prod
```

---

## Quốc tế hóa (Internationalization - i18n)

### 1. Static Messages (Email, Thông báo, Lỗi)

- Được quản lý trong thư mục `src/i18n/vi/` và `src/i18n/en/`.
- Nhận diện ngôn ngữ linh hoạt qua:
  - Header: `x-lang: en` hoặc `Accept-Language: en-US,en;q=0.9`
  - Query param: `?lang=en`
  - Fallback mặc định: `en`.

### 2. Dynamic Database Content (JSONB)

- Các trường như tên tiện ích (`amenities.name`), mô tả phòng (`spaces.description`), mô tả địa điểm (`venues.description`) được lưu dưới dạng JSONB:

```json
{
  "vi": "Máy chiếu 4K độ nét cao",
  "en": "High-definition 4K Projector"
}
```

---

## Kiểm soát chống trùng lịch đặt chỗ (Concurrency Protection)

Hệ thống sử dụng cơ chế bảo vệ tầng sâu từ Database:

- Extension `btree_gist` kết hợp với ràng buộc `no_overlap`:

```sql
ALTER TABLE "bookings" ADD CONSTRAINT "no_overlap"
EXCLUDE USING gist (
  space_id WITH =,
  tsrange(start_time, end_time) WITH &&
)
WHERE (status IN ('pending_payment', 'confirmed'));
```

Đảm bảo **100% không xảy ra lỗi race condition** khi 2 người đặt cùng 1 phòng tại cùng 1 khung giờ.

---

## Quy chuẩn đóng góp

Vui lòng tham khảo tài liệu [CONTRIBUTING.md](file:///f:/co-working_space_management/CONTRIBUTING.md) để nắm rõ quy trình commit, quy chuẩn viết code và quy trình migration.

---

## Bản quyền

Dự án được xây dựng phục vụ cho hệ thống Co-working Space Management.
