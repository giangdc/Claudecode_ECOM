# Risk Assessment — Quản lý Đặc tính (Sprint V1.2)

> Risk Score = Business Impact (1–5) × Complexity (1–5)
> High ≥ 15 | Medium 8–14 | Low ≤ 7

---

## Ma trận rủi ro

| Module/Feature | Business Impact | Complexity | Risk Score | Mức | Đề xuất |
|----------------|----------------|------------|------------|-----|---------|
| Validation Tên unique (trim + ignore case) | 5 | 3 | **15** | High | Priority smoke test; cần test giá trị biên (trim, case variants) |
| Chỉnh sửa: validation + save flow | 4 | 4 | **16** | High | Test full round-trip: load data cũ → sửa → validate → lưu → kiểm tra refresh |
| **[V1.2]** Icon đặc tính — upload/edit | 3 | 4 | **12** | Medium | Test format file, max size (blocked CLA-001); test upload/replace/remove flow |
| **[V1.2]** Kiểu dữ liệu = Text | 4 | 3 | **12** | Medium | Confirmed V1.2 nhưng behavior với Giá trị chưa rõ (CLA-003); blocked scenario |
| Giá trị đặc tính: boundary 50 / 255 chars | 4 | 3 | **12** | Medium | Test tại đúng biên (50 values, 255 chars) và vượt biên |
| Tạo mới: form validation tổng thể | 4 | 3 | **12** | Medium | Kiểm tra required fields, error messages, behavior khi submit thiếu field |
| Kiểu dữ liệu thay đổi khi chỉnh sửa | 4 | 3 | **12** | Medium | Blocked (CLA-004) — nếu cho đổi: cần test impact tại SKU |
| Tìm kiếm + Lọc kết hợp | 3 | 3 | **9** | Medium | Test kết hợp search + filter cùng lúc; logic OR filter |
| **[V1.2]** "+X more" display rule | 2 | 2 | **4** | Low | UI verification; test với đúng 2, 3 và nhiều giá trị |
| Phân trang + Sort | 2 | 2 | **4** | Low | Standard pagination check; verify sort order |
| Xem chi tiết read-only | 2 | 2 | **4** | Low | Verify fields đúng, read-only enforced |
| Nhóm đặc tính optional | 2 | 1 | **2** | Low | Happy path: không chọn nhóm vẫn tạo được |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **Chỉnh sửa: validation + save flow** (Score 16) — Dữ liệu cũ phải load đúng, validation phải nhất quán với Tạo mới, refresh sau lưu phải chính xác. Lỗi ở đây ảnh hưởng trực tiếp data integrity.

2. **Validation Tên unique** (Score 15) — Rule trim + ignore case dễ sai nếu backend không normalize đúng. Cần test edge case: chỉ khác whitespace, chỉ khác hoa/thường, kết hợp cả 2.

---

## Vùng rủi ro medium — cần attention đặc biệt (Sprint V1.2)

- **Icon đặc tính** — Feature mới hoàn toàn trong V1.2. Nhiều unknowns (format/size). Nếu upload fail không có fallback UX tốt → user confusion.
- **Kiểu dữ liệu Text** — Confirm V1.2 nhưng behavior không tường minh. 2 clarifications còn open (CLA-003, CLA-004).

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|-----------|---------------|---------------------|
| Lọc theo Nhóm đặc tính | Module Nhóm đặc tính hoạt động đúng | Filter không có data để chọn |
| Tạo mới — field Nhóm | Dữ liệu Nhóm đặc tính đã tồn tại | Dropdown Nhóm trống → không test multi-select |
| Icon đặc tính — Chỉnh sửa | Upload service / file storage | Upload fail → không test được Icon flow V1.2 |
| SC-DACTINH-035 (Kiểu dữ liệu khi sửa) | BA confirm CLA-DACTINH-004 | BLOCKED — không thể execute TC cho đến khi có answer |

---

## Thứ tự test đề xuất

```
1. Smoke P1 (không phụ thuộc clarification):
   SC-001 → 006 → 011 → 012 → 013 → 017 → 019 → 020 → 027 → 031 → 034 → 036

2. Sprint V1.2 — Icon feature:
   SC-014 → 015 → 016 → 028 → 029 → 032 → 033 (sau khi CLA-001/002 resolved)

3. Regression — Boundary & Validation:
   SC-018 → 022 → 023 → 024 → 025

4. Functional P2 — Danh sách:
   SC-002 → 003 → 004 → 005 → 007 → 008 → 009 → 010

5. BLOCKED — chờ BA confirm:
   SC-021 (CLA-003), SC-030 (CLA-003), SC-035 (CLA-004), SC-033 (CLA-002)
```

---

## Clarifications blocking test execution

| CLA ID | Scenario bị block | Mức độ ưu tiên giải đáp |
|--------|--------------------|------------------------|
| CLA-DACTINH-001 | SC-014, SC-016, SC-032 | High — cần biết format trước khi prep test data |
| CLA-DACTINH-002 | SC-033 | Medium — flow xóa icon V1.2 |
| CLA-DACTINH-003 | SC-021, SC-030 | High — Kiểu dữ liệu Text là feature mới |
| CLA-DACTINH-004 | SC-035 | High — ảnh hưởng data integrity tại SKU |
| CLA-DACTINH-005 | SC-024 (partly) | Low — boundary test Giá trị |
| CLA-DACTINH-006 | (TC thao tác) | Low — nếu có Delete thì cần thêm TC |
