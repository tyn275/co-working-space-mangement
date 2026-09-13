# Quy chuẩn phát triển (Development & Contributing Guide)

Tài liệu này ghi lại toàn bộ các quy chuẩn kiến trúc, quy trình làm việc (workflow) và quy tắc viết code của dự án **Co-working Space Management**.

---

## Mục lục

1. [Quy chuẩn Commit Message (Conventional Commits)](#1-quy-chuẩn-commit-message)
2. [Quy trình quản lý Database & Migration](#2-quy-trình-quản-lý-database--migration)
3. [Quy chuẩn cấu trúc Module & Code Style](#3-quy-chuẩn-cấu-trúc-module--code-style)
4. [Quy chuẩn Quốc tế hóa (i18n) & Dữ liệu động](#4-quy-chuẩn-quốc-tế-hóa-i18n)
5. [Quy trình kiểm tra trước khi Push (Checklist)](#5-quy-trình-kiểm-tra-trước-khi-push)

---

## 1. Quy chuẩn Commit Message

Dự án tích hợp **Husky** và **Commitlint** tại hook `commit-msg`. Mọi commit không tuân thủ cấu trúc dưới đây sẽ bị Git chặn lại.

### Cú pháp chuẩn:

```
<type>(<scope tùy chọn>): <mô tả ngắn gọn>
```

### Các `type` được cho phép:

| Type       | Ý nghĩa                                           | Ví dụ                                            |
| ---------- | ------------------------------------------------- | ------------------------------------------------ |
| `feat`     | Thêm chức năng hoặc API mới                       | `feat(auth): add google oauth login`             |
| `fix`      | Sửa lỗi hệ thống                                  | `fix(booking): resolve time overlap calculation` |
| `docs`     | Viết hoặc cập nhật tài liệu                       | `docs: update CONTRIBUTING guide`                |
| `refactor` | Tái cấu trúc mã nguồn (không đổi logic bên ngoài) | `refactor(venues): optimize venue query service` |
| `test`     | Thêm hoặc sửa unit/e2e test                       | `test(auth): add tests for register flow`        |
| `chore`    | Cập nhật cấu hình, dependencies, script           | `chore: upgrade typeorm version`                 |
| `perf`     | Tối ưu hóa hiệu năng                              | `perf: add index for space search`               |

---

## 2. Quy trình quản lý Database & Migration

> **NGUYÊN TẮC QUAN TRỌNG**:
>
> - **KHÔNG** chỉnh sửa schema trực tiếp trên Neon Console.
> - Mọi thay đổi schema bắt buộc phải đi qua TypeORM Entity và Migration.

### Các bước thay đổi Database:

#### Bước 1: Thay đổi Entity trong thư mục `src/modules/*/entities/`

Chỉnh sửa hoặc thêm cột/quan hệ mới.

#### Bước 2: Tự động sinh Migration file

Chạy lệnh generate (thay `TenMigration` bằng tên mô tả ngắn gọn):

```bash
npm run migration:generate -- src/migrations/TenMigration
```

#### Bước 3: Kiểm tra kỹ file Migration vừa sinh ra (LƯU Ý ĐẶC BIỆT)

TypeORM không thể tự hiểu ràng buộc nâng cao `EXCLUDE USING gist` (`no_overlap`), do đó:

- Mở file migration vừa sinh trong `src/migrations/`.
- Nếu thấy có dòng:
  ```typescript
  await queryRunner.query(
    `ALTER TABLE "bookings" DROP CONSTRAINT "no_overlap"`,
  );
  ```
  Xóa bỏ dòng đó để tránh làm mất ràng buộc chống trùng lịch.

#### Bước 4: Chạy Migration lên Neon Database

```bash
npm run migration:run
```

#### Bước 5: Rollback khi cần

Nếu migration có lỗi hoặc muốn hoàn tác:

```bash
npm run migration:revert
```

---

## 3. Quy chuẩn cấu trúc Module & Code Style

### 3.1. Cấu trúc một Module chuẩn trong NestJS

Mỗi module nằm trong thư mục riêng biệt tại `src/modules/<module-name>/`:

```
src/modules/<name>/
├── dto/
├── entities/
├── <name>.controller.ts
├── <name>.service.ts
└── <name>.module.ts
```

- `dto/`: Định nghĩa các DTO (Create, Update, Query) kèm `class-validator`.
- `entities/`: Định nghĩa TypeORM Entities của module.
- `<name>.controller.ts`: Xử lý HTTP Request/Response và status code.
- `<name>.service.ts`: Xử lý logic nghiệp vụ (business logic).
- `<name>.module.ts`: Đăng ký Controller, Service và TypeORM Repository.

### 3.2. Quy chuẩn đặt tên (Naming Conventions)

- **Tên bảng (Database Tables)**: Chữ thường, số nhiều, dùng snake_case (ví dụ: `users`, `space_prices`, `venue_amenities`).
- **Tên cột (Database Columns)**: Dùng snake_case (ví dụ: `owner_id`, `created_at`).
  - Trong Entity TypeScript: Thuộc tính camelCase ánh xạ rõ ràng:
    ```typescript
    @Column({ name: 'owner_id', type: 'bigint' })
    ownerId: number;
    ```
- **Foreign Key**: Luôn có `@JoinColumn({ name: 'ten_cot_id' })` để tránh TypeORM sinh thừa cột kép.

---

## 4. Quy chuẩn Quốc tế hóa (i18n)

### 4.1. Thông điệp tĩnh (Static Text)

- Khi thêm thông điệp thông báo mới, hãy thêm vào cả hai file:
  - `src/i18n/vi/common.json` (hoặc module tương ứng)
  - `src/i18n/en/common.json`

### 4.2. Dữ liệu động (Dynamic Content dạng JSONB)

Các thuộc tính đa ngôn ngữ như `name` (amenity), `description` (spaces, venues) lưu dưới dạng object:

```typescript
{
  vi: string;
  en: string;
}
```

- Khi trả dữ liệu ra ngoài cho client: Có thể trả nguyên object `{ vi, en }` hoặc dùng interceptor để tự động bóc tách theo ngôn ngữ request (`req.i18nLang`).

---

## 5. Quy trình kiểm tra trước khi Push (Checklist)

Trước khi thực hiện `git push`, luôn đảm bảo:

1. **Build không lỗi**:
   ```bash
   npm run build
   ```
2. **Không sót secret**: File `.env.local` không nằm trong danh sách `git status`.
3. **Format code**:
   ```bash
   npm run format
   ```
4. **Commit message** đúng chuẩn Conventional Commits.
