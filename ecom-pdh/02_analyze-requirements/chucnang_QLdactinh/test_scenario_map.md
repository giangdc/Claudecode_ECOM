# Test Scenario Map — Quản lý Đặc tính

> Tổng quan: **41 scenarios** — P1: 15 | P2: 26 | P3: 0
> Sprint V1.2 changes: **[V1.2]** tag = scenario mới hoặc bị ảnh hưởng bởi thay đổi Sprint V1.2
> Cập nhật 2026-05-25: BA confirmed 6 CLA — unblock SC-021, 030, 035; update SC-014, 033; thêm SC-038..041

---

## Module DACTINH — Xem danh sách đặc tính

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-DACTINH-001 | Load danh sách | REQ-DACTINH-001 | DOC-04 Table 5 | Đã đăng nhập, có quyền xem Đặc tính; hệ thống có dữ liệu đặc tính | Truy cập màn hình Đặc tính (Tab Đặc tính) | Danh sách hiển thị đúng, có dữ liệu; header đủ cột: STT, Tên đặc tính, Giá trị đặc tính, Thời gian cập nhật, Người cập nhật, Thời gian tạo, Người tạo, Thao tác | P1 | Functional |
| SC-DACTINH-002 | Hiển thị cột | REQ-DACTINH-001 | DOC-04 Table 5, 6 | Danh sách đang hiển thị với ít nhất 1 đặc tính | Quan sát từng dòng dữ liệu | Cột Giá trị hiển thị dạng tag/chip; cột Thao tác có icon 👁 và ✏️; cột STT tăng dần | P2 | UI |
| SC-DACTINH-003 | "+X more" Giá trị **[V1.2]** | REQ-DACTINH-001 | DOC-04 Table 6 | Có đặc tính với ≥ 3 giá trị trong danh sách | Quan sát cột Giá trị đặc tính của đặc tính đó | Hiển thị tối đa 2 giá trị đầu (dạng tag); phần còn lại hiển thị dạng "+X more" (X = số giá trị ẩn) | P2 | Business Rule |
| SC-DACTINH-004 | Sort mặc định | REQ-DACTINH-002 | DOC-04 Table 6 | Danh sách đặc tính có nhiều bản ghi với TG cập nhật khác nhau | Quan sát thứ tự hiển thị mặc định (không filter/search) | Bản ghi có TG cập nhật mới nhất hiển thị ở đầu danh sách | P2 | Functional |
| SC-DACTINH-005 | Phân trang 10/trang | REQ-DACTINH-003 | DOC-04 Table 8 | Hệ thống có > 10 đặc tính | Quan sát danh sách khi vừa load | Mặc định hiển thị 10 bản ghi/trang; có điều hướng phân trang; có thể thay đổi số bản ghi/trang | P2 | Functional |
| SC-DACTINH-006 | Tìm kiếm — có kết quả | REQ-DACTINH-004 | DOC-04 Table 8 | Danh sách có đặc tính tên "Màu sắc" | Nhập "màu sắc" (chữ thường) vào ô tìm kiếm và thực hiện tìm | Kết quả trả về đặc tính "Màu sắc" (case-insensitive); danh sách lọc theo từ khóa | P1 | Functional |
| SC-DACTINH-007 | Tìm kiếm — không có kết quả | REQ-DACTINH-004 | DOC-04 Table 8 | Đang ở màn hình danh sách | Nhập từ khóa không khớp bất kỳ đặc tính nào | Hiển thị thông báo không có kết quả; không có dòng dữ liệu | P2 | Negative |
| SC-DACTINH-008 | Tìm kiếm — trim whitespace | REQ-DACTINH-004 | DOC-04 Table 8 | Đang ở màn hình danh sách | Nhập "  Màu sắc  " (có khoảng trắng thừa đầu/cuối) | Kết quả tìm kiếm tương đương nhập "Màu sắc" — trim whitespace | P2 | Functional |
| SC-DACTINH-009 | Lọc nhóm — OR logic | REQ-DACTINH-005 | DOC-04 Table 8 | Có đặc tính thuộc Nhóm A và đặc tính thuộc Nhóm B | Chọn cả Nhóm A và Nhóm B trong dropdown Lọc theo Nhóm đặc tính | Danh sách hiển thị tất cả đặc tính thuộc Nhóm A HOẶC Nhóm B (logic OR) | P2 | Functional |
| SC-DACTINH-010 | Lọc nhóm — không có kết quả | REQ-DACTINH-005 | DOC-04 Table 8 | Chọn một nhóm không có đặc tính nào | Áp dụng filter | Hiển thị thông báo không có kết quả | P2 | Negative |
| SC-DACTINH-011 | Click icon 👁 | REQ-DACTINH-001 | DOC-04 Table 5 | Danh sách đặc tính đang hiển thị | Click icon 👁 của một đặc tính | Popup Xem chi tiết mở với thông tin đúng của đặc tính đó; popup ở chế độ read-only | P1 | Functional |
| SC-DACTINH-012 | Click icon ✏️ | REQ-DACTINH-001 | DOC-04 Table 5 | Danh sách đặc tính đang hiển thị | Click icon ✏️ của một đặc tính | Popup Chỉnh sửa mở với dữ liệu hiện tại của đặc tính; các field có thể chỉnh sửa | P1 | Functional |

---

## Module DACTINH — Tạo mới đặc tính

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-DACTINH-013 | Tạo mới thành công | REQ-DACTINH-006 | DOC-04 Table 9, 11 | Đã đăng nhập, có quyền tạo mới; popup Tạo mới đang mở | Nhập đủ Tên, chọn Kiểu dữ liệu, nhập ít nhất 1 Giá trị; click Lưu | Đặc tính được tạo thành công; popup đóng; danh sách refresh; đặc tính mới hiển thị đầu danh sách | P1 | Functional |
| SC-DACTINH-014 | **[V1.2]** Upload icon thành công | REQ-DACTINH-007 | DOC-04 Table 11 + BA confirm | Popup Tạo mới đang mở | Upload 1 file ảnh JPG hoặc PNG, kích thước ≤ 1MB vào field Icon đặc tính | Icon hiển thị preview trong form; không có lỗi; khi Lưu icon được gắn với đặc tính | P1 | Functional |
| SC-DACTINH-015 | **[V1.2]** Icon optional — không upload | REQ-DACTINH-007 | DOC-04 Table 11 | Popup Tạo mới đang mở | Không upload icon; nhập đủ các field bắt buộc; click Lưu | Tạo mới thành công — icon là optional, không upload vẫn được Lưu | P2 | Functional |
| SC-DACTINH-016 | **[V1.2]** Icon max 1 — upload lần 2 | REQ-DACTINH-007 | DOC-04 Table 11 | Popup Tạo mới; đã upload 1 icon | Upload thêm 1 file ảnh thứ 2 | Icon thứ 2 thay thế icon cũ (chỉ 1 icon được lưu); không lỗi | P2 | Business Rule |
| SC-DACTINH-017 | Tên bỏ trống | REQ-DACTINH-008 | DOC-04 Table 11 | Popup Tạo mới đang mở | Để trống field Tên; click Lưu | Hiển thị lỗi "Tên là bắt buộc" (hoặc tương đương); form không submit | P1 | Negative |
| SC-DACTINH-018 | Tên > 255 ký tự | REQ-DACTINH-008 | DOC-04 Table 11 | Popup Tạo mới đang mở | Nhập Tên có 256 ký tự; click Lưu | Hiển thị lỗi max length 255 ký tự; form không submit | P2 | Boundary |
| SC-DACTINH-019 | Tên trùng — ignore case | REQ-DACTINH-008 | DOC-04 Table 11 | Đã tồn tại đặc tính tên "Màu sắc" | Nhập Tên "màu sắc" (chữ thường) hoặc "  Màu Sắc  " (thừa whitespace); click Lưu | Hiển thị lỗi tên đã tồn tại; form không submit | P1 | Negative |
| SC-DACTINH-020 | Kiểu dữ liệu bỏ trống | REQ-DACTINH-009 | DOC-04 Table 11 | Popup Tạo mới đang mở | Không chọn Kiểu dữ liệu; điền đủ Tên và Giá trị; click Lưu | Hiển thị lỗi "Kiểu dữ liệu là bắt buộc"; form không submit | P1 | Negative |
| SC-DACTINH-021 | **[V1.2]** Tạo mới KDL Text — lưu thành công | REQ-DACTINH-009 | DOC-04 Table 11 + BA confirm | Popup Tạo mới đang mở; đã chọn Kiểu dữ liệu = "Text"; field Giá trị không có nút Thêm | Điền Tên hợp lệ; click Lưu | Đặc tính được tạo thành công với Kiểu dữ liệu = Text; popup đóng; danh sách refresh | P1 | Functional |
| SC-DACTINH-022 | Giá trị đúng 50 values | REQ-DACTINH-010 | DOC-04 Table 11 | Popup Tạo mới đang mở | Nhập đúng 50 giá trị vào Giá trị đặc tính | Cho phép nhập và Lưu thành công — 50 là giới hạn tối đa được phép | P2 | Boundary |
| SC-DACTINH-023 | Giá trị > 50 values | REQ-DACTINH-010 | DOC-04 Table 11 | Popup Tạo mới đang mở; đã có 50 giá trị | Click Thêm giá trị để nhập giá trị thứ 51 | Hệ thống không cho thêm giá trị thứ 51 (nút bị disable hoặc hiển thị lỗi max 50) | P2 | Boundary |
| SC-DACTINH-024 | Giá trị max 255 ký tự/value | REQ-DACTINH-010 | DOC-04 Table 11 | Popup Tạo mới đang mở | Nhập 1 giá trị có đúng 255 ký tự → Lưu; sau đó thử nhập giá trị có 256 ký tự | 255 ký tự: Lưu thành công. 256 ký tự: hiển thị lỗi hoặc không cho nhập quá giới hạn | P2 | Boundary |
| SC-DACTINH-025 | Giá trị — dòng đầu không xóa | REQ-DACTINH-010 | DOC-04 Table 11 | Popup Tạo mới đang mở; đã có ít nhất 2 giá trị | Quan sát icon X trên từng dòng giá trị | Dòng đầu tiên không có icon X (không xóa được); dòng thứ 2 trở đi có icon X | P2 | Business Rule |
| SC-DACTINH-026 | Nhóm đặc tính optional | REQ-DACTINH-006 | DOC-04 Table 11 | Popup Tạo mới đang mở | Không chọn Nhóm đặc tính; điền Tên, Kiểu dữ liệu, Giá trị; click Lưu | Tạo mới thành công — Nhóm đặc tính là optional | P2 | Functional |
| SC-DACTINH-038 | **[V1.2]** Upload icon — format không hợp lệ | REQ-DACTINH-007 | BA confirm 2026-05-25 | Popup Tạo mới đang mở | Upload file không phải JPG hoặc PNG (ví dụ: .gif, .svg, .pdf) vào field Icon | Hệ thống từ chối upload; hiển thị lỗi yêu cầu định dạng JPG/PNG; file không được gắn | P2 | Negative |
| SC-DACTINH-039 | **[V1.2]** Upload icon — vượt 1MB | REQ-DACTINH-007 | BA confirm 2026-05-25 | Popup Tạo mới đang mở | Upload file JPG/PNG có kích thước > 1MB | Hệ thống từ chối upload; hiển thị lỗi vượt kích thước tối đa 1MB | P2 | Boundary |
| SC-DACTINH-040 | **[V1.2]** Upload icon — đúng 1MB | REQ-DACTINH-007 | BA confirm 2026-05-25 | Popup Tạo mới đang mở | Upload file JPG/PNG có kích thước đúng bằng 1MB | Upload thành công; icon được preview và lưu bình thường | P2 | Boundary |
| SC-DACTINH-041 | **[V1.2]** Tạo mới KDL Text — không có nút Thêm giá trị | REQ-DACTINH-009 | BA confirm 2026-05-25 | Popup Tạo mới đang mở | Chọn Kiểu dữ liệu = "Text"; quan sát field Giá trị đặc tính | Field Giá trị vẫn hiển thị nhưng KHÔNG có nút "Thêm giá trị"; không thể thêm predefined value | P1 | Functional |

---

## Module DACTINH — Xem chi tiết đặc tính

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-DACTINH-027 | Chi tiết — hiển thị đúng fields | REQ-DACTINH-011 | DOC-04 Table 12, 15 | Đặc tính tồn tại với đầy đủ thông tin; popup Chi tiết đang mở | Quan sát các field trong popup | Hiển thị đủ: Nhóm đặc tính (dạng tags), Tên đặc tính, Kiểu dữ liệu, Giá trị đặc tính; tất cả ở chế độ read-only | P1 | Functional |
| SC-DACTINH-028 | **[V1.2]** Icon hiển thị trong Chi tiết | REQ-DACTINH-012 | DOC-04 Table 15 | Đặc tính có icon được upload | Mở popup Chi tiết của đặc tính đó | Icon đặc tính hiển thị trong popup ở chế độ read-only (không thể upload/sửa) | P2 | Functional |
| SC-DACTINH-029 | **[V1.2]** Chi tiết — đặc tính không có icon | REQ-DACTINH-012 | DOC-04 Table 15 | Đặc tính không có icon | Mở popup Chi tiết | Field Icon không hiển thị ảnh (trống hoặc placeholder) — không lỗi | P2 | Functional |
| SC-DACTINH-030 | **[V1.2]** Chi tiết KDL Text — không có giá trị pre-defined | REQ-DACTINH-011 | DOC-04 Table 15 + BA confirm | Đặc tính có Kiểu dữ liệu = Text (tạo với field Giá trị hiển thị nhưng không thêm được) | Mở popup Chi tiết | Kiểu dữ liệu hiển thị "Text"; field Giá trị hiển thị (read-only); không có predefined values | P2 | Functional |

---

## Module DACTINH — Chỉnh sửa đặc tính

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-DACTINH-031 | Chỉnh sửa thành công | REQ-DACTINH-013 | DOC-04 Table 16, 18 | Popup Chỉnh sửa của đặc tính đang mở | Sửa Tên (hợp lệ), thêm/xóa Nhóm, thêm Giá trị; click Lưu | Lưu thành công; popup đóng; danh sách refresh với dữ liệu mới; TG cập nhật + Người cập nhật được cập nhật | P1 | Functional |
| SC-DACTINH-032 | **[V1.2]** Chỉnh sửa icon — upload mới | REQ-DACTINH-014 | DOC-04 Table 18 | Popup Chỉnh sửa đang mở (đặc tính có hoặc không có icon) | Upload file ảnh mới vào field Icon; click Lưu | Icon mới được lưu thành công; icon cũ bị thay thế (nếu có) | P1 | Functional |
| SC-DACTINH-033 | **[V1.2]** Chỉnh sửa — không có nút xóa icon | REQ-DACTINH-014 | BA confirm 2026-05-25 | Popup Chỉnh sửa; đặc tính đang có icon | Quan sát field Icon — tìm nút xóa/remove | Không có nút xóa riêng; chỉ có thể thay thế bằng cách upload file mới đè lên | P2 | Business Rule |
| SC-DACTINH-034 | Validation Tên khi sửa — trùng | REQ-DACTINH-015 | DOC-04 Table 18 | Popup Chỉnh sửa; tồn tại đặc tính khác tên "Chất liệu" | Sửa Tên thành "chất liệu" (ignore case); click Lưu | Hiển thị lỗi tên đã tồn tại; không lưu; form giữ nguyên dữ liệu vừa nhập | P1 | Negative |
| SC-DACTINH-035 | Đổi Kiểu dữ liệu khi chỉnh sửa | REQ-DACTINH-013 | BA confirm 2026-05-25 | Popup Chỉnh sửa; đặc tính có Kiểu dữ liệu = Dropdown; đặc tính đã được gán cho ít nhất 1 SKU | Thay đổi Kiểu dữ liệu sang Multi-select Dropdown; click Lưu | Cho phép đổi Kiểu dữ liệu; Lưu thành công; SKU đã gán không bị ảnh hưởng | P1 | Functional |
| SC-DACTINH-036 | Thêm Giá trị khi sửa | REQ-DACTINH-013 | DOC-04 Table 18 | Popup Chỉnh sửa; đặc tính đang có < 50 giá trị | Click Thêm giá trị; nhập value mới; click Lưu | Giá trị mới được thêm thành công; total values ≤ 50 | P1 | Functional |
| SC-DACTINH-037 | Xóa Giá trị khi sửa | REQ-DACTINH-013 | DOC-04 Table 18 | Popup Chỉnh sửa; đặc tính có ≥ 2 giá trị | Click icon X trên dòng giá trị thứ 2 trở đi; click Lưu | Giá trị bị xóa; dòng đầu tiên không thể xóa (không có icon X) | P2 | Business Rule |

---

## Tóm tắt scenarios theo Priority

| Priority | Số lượng | Scenario IDs |
|----------|----------|-------------|
| P1 | 15 | 001, 006, 011, 012, 013, 014, 017, 019, 020, 021, 027, 031, 032, 034, 035, 041 |
| P2 | 26 | 002, 003, 004, 005, 007, 008, 009, 010, 015, 016, 018, 022, 023, 024, 025, 026, 028, 029, 030, 033, 036, 037, 038, 039, 040 |
| P3 | 0 | — |
| **TỔNG** | **41** | |

## Tóm tắt Sprint V1.2 — Scenarios bị ảnh hưởng

| Sprint V1.2 Change | Scenarios |
|--------------------|-----------|
| Icon đặc tính: upload/format/size (Tạo mới) | SC-DACTINH-014, 015, 016, 038, 039, 040 |
| Icon đặc tính: không có nút xóa (Chỉnh sửa) | SC-DACTINH-032, 033 |
| Icon đặc tính (Chi tiết read-only) | SC-DACTINH-028, 029 |
| Kiểu dữ liệu "Text" — không có nút Thêm giá trị | SC-DACTINH-021, 030, 041 |
| Giá trị "+X more" display | SC-DACTINH-003 |
| Không còn BLOCKED | ✅ Tất cả CLA đã resolve |
