# Requirement Traceability Matrix — Quản lý Đặc tính

## Tài liệu nguồn

| DOC ID | File | Loại | Phiên bản | Ngày phân tích |
|--------|------|------|-----------|----------------|
| DOC-04 | [Sprint V1.2] URD - Specification Management (1).docx | URD (primary) | Sprint V1.2 | 2026-05-25 |
| DOC-03 | ISC_chucnang_dactinh_v1.0.xlsx | TC baseline (reference) | v1.0 | 2026-05-25 |

> ✅ DOC-04 là URD chính thức Sprint V1.2 — đây là nguồn phân tích chính.
> 📌 DOC-03 dùng làm reference để xác định delta thay đổi so với v1.0.
> ⚠️ Module NHÓM ĐẶC TÍNH không có trong DOC-04 — cần URD riêng để phân tích đầy đủ module đó.

---

## Sprint V1.2 — Tóm tắt thay đổi so với v1.0

| Function | Trạng thái | Nội dung thay đổi |
|----------|-----------|-------------------|
| Xem danh sách đặc tính | Giữ nguyên | — |
| Tạo mới đặc tính | **Update** | Thêm field "Icon đặc tính" (Image, optional, max 1) |
| Xem chi tiết đặc tính | **Update** | Thêm hiển thị "Icon đặc tính" (read-only) |
| Chỉnh sửa đặc tính | **Update** | Thêm field "Icon đặc tính" editable (max 1) |
| Business Rule | Xác nhận | Kiểu dữ liệu "Text" được xác nhận chính thức (v1.0 chỉ có Dropdown + Multi-select) |
| Business Rule | Xác nhận | Giá trị đặc tính: max 255 ký tự/giá trị (trước không rõ limit) |

---

## Ma trận truy vết — Module ĐẶC TÍNH

### 1. Xem danh sách đặc tính

| Req ID | Mô tả | DOC Source | Nguồn (Table) | Loại | Scenarios | Mức rủi ro |
|--------|-------|------------|---------------|------|-----------|------------|
| REQ-DACTINH-001 | Giao diện danh sách hiển thị đúng cột: STT, Tên đặc tính, Giá trị đặc tính (tag — max 2 đầu + "+X more"), TG cập nhật, Người cập nhật, TG tạo, Người tạo, Thao tác (👁 ✏️) | DOC-04 | Table 5, 6 | UI / Functional | SC-DACTINH-001, SC-DACTINH-002, SC-DACTINH-003 | Medium |
| REQ-DACTINH-002 | Sort mặc định: theo Thời gian cập nhật, mới nhất lên đầu | DOC-04 | Table 6 | Functional | SC-DACTINH-004 | Low |
| REQ-DACTINH-003 | Phân trang: 10 bản ghi/trang (mặc định), có thể thay đổi số bản ghi/trang | DOC-04 | Table 8 | Functional | SC-DACTINH-005 | Low |
| REQ-DACTINH-004 | Tìm kiếm theo Tên đặc tính: trim whitespace, case-insensitive; không nhập → hiển thị tất cả | DOC-04 | Table 8 | Functional | SC-DACTINH-006, SC-DACTINH-007, SC-DACTINH-008 | Medium |
| REQ-DACTINH-005 | Lọc theo Nhóm đặc tính: multi-select dropdown, logic OR; tìm kiếm trong dropdown lọc; không có kết quả → thông báo | DOC-04 | Table 8 | Functional | SC-DACTINH-009, SC-DACTINH-010 | Medium |

### 2. Tạo mới đặc tính

| Req ID | Mô tả | DOC Source | Nguồn (Table) | Loại | Scenarios | Mức rủi ro |
|--------|-------|------------|---------------|------|-----------|------------|
| REQ-DACTINH-006 | Popup Tạo mới — cấu trúc form: Nhóm đặc tính (multi-select, optional); Icon (optional) [V1.2]; Tên (required); Kiểu dữ liệu (required); Giá trị (required) | DOC-04 | Table 9, 11 | Functional | SC-DACTINH-013, SC-DACTINH-026 | High |
| REQ-DACTINH-007 | **[NEW Sprint V1.2]** Icon đặc tính: kiểu Image (JPG/PNG, max 1MB), optional, tối đa 1 icon per đặc tính; upload lần 2 sẽ thay thế icon cũ (không có nút xóa riêng) | DOC-04 | Table 11 | Functional / Business Rule | SC-DACTINH-014, SC-DACTINH-015, SC-DACTINH-016, SC-DACTINH-038, SC-DACTINH-039, SC-DACTINH-040 | Medium |
| REQ-DACTINH-008 | Validation Tên đặc tính: required, max 255 ký tự, unique (so sánh sau khi trim + ignore case) | DOC-04 | Table 11 | Business Rule | SC-DACTINH-017, SC-DACTINH-018, SC-DACTINH-019 | High |
| REQ-DACTINH-009 | Kiểu dữ liệu: required, 3 giá trị — Dropdown / Text / Multi-select Dropdown; **[V1.2]** khi chọn Text: field Giá trị vẫn hiển thị nhưng không có nút "Thêm giá trị" | DOC-04 | Table 11 | Functional / Business Rule | SC-DACTINH-020, SC-DACTINH-021, SC-DACTINH-041 | High |
| REQ-DACTINH-010 | Giá trị đặc tính: max 50 giá trị; max 255 ký tự/giá trị; dòng đầu tiên không xóa được (không có icon X) | DOC-04 | Table 11 | Business Rule | SC-DACTINH-022, SC-DACTINH-023, SC-DACTINH-024, SC-DACTINH-025 | High |

### 3. Xem chi tiết đặc tính

| Req ID | Mô tả | DOC Source | Nguồn (Table) | Loại | Scenarios | Mức rủi ro |
|--------|-------|------------|---------------|------|-----------|------------|
| REQ-DACTINH-011 | Popup chi tiết read-only: Nhóm đặc tính (tags), Tên, Kiểu dữ liệu, Giá trị đặc tính | DOC-04 | Table 12, 15 | Functional | SC-DACTINH-027, SC-DACTINH-030 | Low |
| REQ-DACTINH-012 | **[NEW Sprint V1.2]** Icon đặc tính hiển thị read-only trong popup chi tiết (nếu có) | DOC-04 | Table 15 | Functional | SC-DACTINH-028, SC-DACTINH-029 | Low |

### 4. Chỉnh sửa đặc tính

| Req ID | Mô tả | DOC Source | Nguồn (Table) | Loại | Scenarios | Mức rủi ro |
|--------|-------|------------|---------------|------|-----------|------------|
| REQ-DACTINH-013 | Popup chỉnh sửa: Nhóm (editable), Tên (editable), Giá trị (editable); Kiểu dữ liệu là required field | DOC-04 | Table 16, 18 | Functional | SC-DACTINH-031, SC-DACTINH-036, SC-DACTINH-037 | High |
| REQ-DACTINH-014 | **[NEW Sprint V1.2]** Icon đặc tính editable: upload mới hoặc xóa icon cũ; max 1 icon | DOC-04 | Table 18 | Functional / Business Rule | SC-DACTINH-032, SC-DACTINH-033 | Medium |
| REQ-DACTINH-015 | Validation chỉnh sửa: Tên unique (trim+case), max 255 ký tự; Giá trị max 50 / max 255 ký tự/value; dòng đầu Giá trị không xóa | DOC-04 | Table 18 | Business Rule | SC-DACTINH-034, SC-DACTINH-035 | High |

---

## Business Rules (từ DOC-04)

| BR ID | Mô tả | Module | DOC Source | Sprint |
|-------|-------|--------|------------|--------|
| BR-DT-001 | Tên đặc tính max 255 ký tự | DACTINH | DOC-04 Table 11 | V1.0 |
| BR-DT-002 | Tên đặc tính unique — so sánh sau khi trim + ignore case | DACTINH | DOC-04 Table 11 | V1.0 |
| BR-DT-003 | Giá trị đặc tính tối đa 50 giá trị | DACTINH | DOC-04 Table 11 | V1.0 |
| BR-DT-004 | **[V1.2 xác nhận]** Giá trị đặc tính tối đa 255 ký tự/giá trị | DACTINH | DOC-04 Table 11 | V1.2 |
| BR-DT-005 | Dòng đầu tiên trong danh sách Giá trị không có icon X — không thể xóa | DACTINH | DOC-04 Table 11 | V1.0 |
| BR-DT-006 | **[V1.2 xác nhận]** Kiểu dữ liệu: 3 loại — Dropdown / Text / Multi-select Dropdown | DACTINH | DOC-04 Table 11 | V1.2 |
| BR-DT-007 | **[NEW V1.2]** Icon đặc tính: optional, max 1 icon per đặc tính; format JPG/PNG, max 1MB; upload đè để thay thế (không có nút xóa riêng) | DACTINH | DOC-04 Table 11, 18 | V1.2 |
| BR-DT-009 | **[V1.2 confirmed]** Khi Kiểu dữ liệu = Text: field Giá trị vẫn hiển thị nhưng không có nút "Thêm giá trị" | DACTINH | DOC-04 Table 11 + BA confirm 2026-05-25 | V1.2 |
| BR-DT-010 | Kiểu dữ liệu CÓ THỂ thay đổi khi chỉnh sửa; SKU đã gán không bị ảnh hưởng | DACTINH | BA confirm 2026-05-25 | V1.0 |
| BR-DT-011 | Không có chức năng Xóa đặc tính trong Sprint này | DACTINH | BA confirm 2026-05-25 | V1.2 |
| BR-DT-012 | Giá trị đặc tính: không validate ký tự đặc biệt; không trim whitespace | DACTINH | BA confirm 2026-05-25 | V1.0 |
| BR-DT-008 | Danh sách: Giá trị hiển thị tối đa 2 giá trị đầu, phần còn lại dạng "+X more" | DACTINH | DOC-04 Table 6 | V1.2 |

---

## Clarifications — Đã resolve (2026-05-25)

| # | Req ID | Câu hỏi | Answer (BA confirm) | Status | Ngày resolve | Ảnh hưởng TC |
|---|--------|---------|---------------------|--------|--------------|--------------|
| CLA-DACTINH-001 | REQ-DACTINH-007 | Icon đặc tính: format file chấp nhận? Kích thước tối đa? | JPG hoặc PNG; tối đa 1MB; tối đa 1 ảnh | ✅ Resolved | 2026-05-25 | SC-014, 016, 038, 039, 040 |
| CLA-DACTINH-002 | REQ-DACTINH-014 | Chỉnh sửa Icon: có nút xóa riêng không? | Chỉ upload đè — không có nút xóa riêng | ✅ Resolved | 2026-05-25 | SC-033 (update) |
| CLA-DACTINH-003 | REQ-DACTINH-009 | Khi Kiểu dữ liệu = Text — field Giá trị có hiển thị không? | **[V1.2 change]** Vẫn hiển thị nhưng không có nút "Thêm giá trị" | ✅ Resolved | 2026-05-25 | SC-021, 030, 041 (unblock) |
| CLA-DACTINH-004 | REQ-DACTINH-013 | Kiểu dữ liệu có thể thay đổi khi chỉnh sửa không? SKU ảnh hưởng? | Cho đổi; SKU đã gán không bị ảnh hưởng (không phải thay đổi V1.2) | ✅ Resolved | 2026-05-25 | SC-035 (unblock) |
| CLA-DACTINH-005 | REQ-DACTINH-010 | Giá trị: validate ký tự đặc biệt? Trim whitespace? | Cho nhập thoải mái — không validate ký tự, không trim (không phải thay đổi V1.2) | ✅ Resolved | 2026-05-25 | SC-024 (simplify) |
| CLA-DACTINH-006 | REQ-DACTINH-001 | Thao tác có nút Xóa không? Rule xóa? | Không có chức năng Xóa trong Sprint này | ✅ Resolved | 2026-05-25 | Không cần TC xóa |
