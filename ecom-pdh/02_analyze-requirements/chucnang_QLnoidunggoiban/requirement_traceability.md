# Requirement Traceability Matrix
> Dự án: ecom-pdh | Sprint: V1.2 | Phân tích: 2026-05-25

## Tài liệu nguồn

| DOC ID | File | Loại | Ghi chú |
|--------|------|------|---------|
| DOC-01 | TongHop_NoidungGoiban_v1.1_prep.md | Baseline v1.0 + Q&A đã resolved | AS-IS + confirmed answers |
| DOC-02 | [Sprint V1.2] - URD - Product Offering Content (1).docx | URD Sprint V1.2 | TO-BE spec chính thức |

---

## Ma trận truy vết

### Module: DANHSACH — Màn hình Danh sách *(không thay đổi trong Sprint V1.2)*

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|----------------|------|-----------|------------|
| REQ-DANHSACH-001 | Xem danh sách nội dung gói bán; 20 bản ghi/trang; sắp xếp Thời gian cập nhật giảm dần; hiển thị đủ 7 cột + icon Chỉnh sửa | DOC-01 §1.3; DOC-02 §1 | Functional | SC-DANHSACH-001, SC-DANHSACH-004, SC-DANHSACH-005 | Low |
| REQ-DANHSACH-002 | Tìm kiếm theo tên gói bán, không phân biệt hoa thường; kết quả empty state khi không tìm thấy | DOC-01 §1.3; DOC-02 §1 BR | Functional | SC-DANHSACH-002, SC-DANHSACH-003 | Low |
| REQ-DANHSACH-003 | Điều hướng: nút "+ Tạo mới" → Màn hình Tạo mới; icon Chỉnh sửa → Màn hình Chỉnh sửa | DOC-02 §1 Mô tả trường STT 4, 12 | Functional | SC-DANHSACH-005 | Low |

---

### Module: TAOMOI — Màn hình Tạo mới *(Sprint V1.2 — nhiều thay đổi)*

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|----------------|------|-----------|------------|
| REQ-TAOMOI-001 | Kênh bán: multi-select; chỉ hiển thị kênh trong giá bán của gói; kênh đã được tạo nội dung không hiển thị trong dropdown | DOC-02 §2.3 STT 1; §2 BR | Functional / BR | SC-TAOMOI-001, SC-TAOMOI-002 | High |
| REQ-TAOMOI-002 | Gói bán: single-select; chỉ load gói đang hoạt động và đã có giá bán | DOC-02 §2.3 STT 2 | Functional / BR | SC-TAOMOI-003 | Medium |
| REQ-TAOMOI-003 | Tên hiển thị trên kênh (cấp Gói bán): bắt buộc, max 255 ký tự; auto-fill = Display name (SKU đơn/SKU đi kèm/SKU con) hoặc Name (Phí đi kèm/Nhóm SKU) | DOC-01 QA-005; DOC-02 §2.3 STT 3 | Functional | SC-TAOMOI-004, SC-TAOMOI-005 | High |
| REQ-TAOMOI-004 | Icon gói bán: optional; JPG/PNG/SVG; max 1MB | DOC-02 §2.3 Icon gói bán | Functional | SC-TAOMOI-006, SC-TAOMOI-007 | Medium |
| REQ-TAOMOI-005 | Danh sách sản phẩm - Tên hiển thị trên kênh per SKU: bắt buộc; max 255; auto-fill theo loại line item | DOC-02 §2.3 STT 5 | Functional | SC-TAOMOI-004, SC-TAOMOI-005 | High |
| REQ-TAOMOI-006 | Phương thức hiển thị per SKU: 3 giá trị (Hiển thị toàn bộ / Ẩn toàn bộ / Chỉ hiển thị ở Summary); SKU con kế thừa từ Nhóm SKU (disabled); tối thiểu 1 sản phẩm cha = "Hiển thị toàn bộ" | DOC-02 §2.3 STT 6 | Functional / BR | SC-TAOMOI-010, SC-TAOMOI-011 | High |
| REQ-TAOMOI-007 | Sản phẩm nhận trong gói: checkbox per line-item; mặc định checked; checked = hiển thị trên kênh; unchecked = kênh không hiển thị bất kỳ thông tin nào của sản phẩm đó | DOC-01 QA-006; DOC-02 §2.3 STT 7 | Functional | SC-TAOMOI-008, SC-TAOMOI-009 | High |
| REQ-TAOMOI-008 | Hình ảnh SKU nhận trong gói: 1 ảnh/SKU; auto-load từ cấu hình SKU nếu có; nếu chưa có → hiển thị nút "+"; JPG/PNG; max 1MB; không bắt buộc | DOC-01 QA-007, QA-008; DOC-02 §2.3 STT 8 | Functional | SC-TAOMOI-012, SC-TAOMOI-013, SC-TAOMOI-014, SC-TAOMOI-015, SC-TAOMOI-016 | High |
| REQ-TAOMOI-009 | Đặc tính gói bán: Nhóm/Icon/Tên/Giá trị đặc tính hiển thị read-only từ hệ thống; Đặc tính nổi bật checkbox (user toggle); Tag line input max 255 ký tự | DOC-02 §2.3 Đặc tính gói bán | Functional | SC-TAOMOI-017, SC-TAOMOI-018 | Medium |
| REQ-TAOMOI-010 | Block Đặc quyền: section Collapse/Expand; Tiêu đề block optional max 255; Danh sách tối đa 10 row; mỗi row: Icon(opt), Tiêu đề đặc quyền(Y, max 255), Nội dung đặc quyền(Y, max 255), Xóa(icon X); nút Thêm(+) | DOC-01 QA-009; DOC-02 §2.3 Nhóm đặc quyền STT 1-9 | Functional | SC-TAOMOI-019, SC-TAOMOI-020, SC-TAOMOI-021, SC-TAOMOI-022, SC-TAOMOI-023 | Medium |
| REQ-TAOMOI-011 | Hình ảnh đặc quyền: optional; JPG/PNG; tối đa 1 ảnh | DOC-02 §2.3 STT 10 | Functional | SC-TAOMOI-024 | Low |
| REQ-TAOMOI-012 | Mô tả card gói: optional; TextEditor; max 2000 ký tự; tự động trim khoảng trắng 2 đầu | DOC-02 §2.3 Mô tả card gói | Functional | SC-TAOMOI-025 | Low |
| REQ-TAOMOI-013 | Mô tả ngắn: optional; TextEditor; max 2000 ký tự; trim | DOC-02 §2.3 STT 1 (nhóm hình ảnh) | Functional | SC-TAOMOI-025 | Low |
| REQ-TAOMOI-014 | Mô tả dài: optional; TextEditor; max 12000 ký tự; trim | DOC-02 §2.3 STT 2 (nhóm hình ảnh) | Functional | SC-TAOMOI-025 | Low |
| REQ-TAOMOI-015 | Hình ảnh banner đầu trang: optional; max 10 ảnh; JPG/PNG; max 1MB/ảnh | DOC-01 QA-010; DOC-02 §2.3 STT 3 | Functional | SC-TAOMOI-026, SC-TAOMOI-027 | Medium |
| REQ-TAOMOI-016 | Hình ảnh gói bán: optional; max 10 ảnh; JPG/PNG; max 1MB/ảnh (giữ nguyên v1.0) | DOC-01 §1.3; DOC-02 §2.3 STT 4 | Functional | (regression từ v1.0) | Low |
| REQ-TAOMOI-017 | Link video gói bán: optional; validate URL hợp lệ (http/https); thông báo lỗi: "Link video không hợp lệ. Vui lòng nhập đúng định dạng URL." | DOC-02 §2.3 Link video | Functional | SC-TAOMOI-028, SC-TAOMOI-029 | Medium |
| REQ-TAOMOI-018 | Hình ảnh banner giữa trang: optional; Section/Group expand; Table gồm: STT(auto), Ảnh(preview, Y), Hoạt động(toggle, default OFF), Thêm(+); max 10 banner; JPG/PNG | DOC-01 QA-010; DOC-02 §2.3 STT 5-10 | Functional | SC-TAOMOI-030, SC-TAOMOI-031, SC-TAOMOI-032 | Medium |
| REQ-TAOMOI-019 | Nút Lưu: lưu nội dung; tạo số records = số kênh bán đã chọn; thông báo thành công; về Danh sách | DOC-02 §2 BR; §2.3 STT 13 | Functional / BR | SC-TAOMOI-033, SC-TAOMOI-034 | High |
| REQ-TAOMOI-020 | Nút Hủy: hiển thị popup "Xác nhận Hủy"; xác nhận → hủy tạo mới, về Danh sách không lưu | DOC-02 §2.3 STT 12 | Functional | SC-TAOMOI-035, SC-TAOMOI-036 | Medium |

---

### Module: CHINHSUA — Màn hình Chỉnh sửa *(Sprint V1.2 — các field mới + read-only constraint)*

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|----------------|------|-----------|------------|
| REQ-CHINHSUA-001 | Load toàn bộ dữ liệu hiện tại của bản ghi vào form khi mở màn hình Chỉnh sửa | DOC-02 §3.1 | Functional | SC-CHINHSUA-001 | High |
| REQ-CHINHSUA-002 | Kênh bán và Gói bán: hiển thị read-only, không cho phép chỉnh sửa | DOC-02 §3.3 STT 1, 2 | Functional | SC-CHINHSUA-002 | High |
| REQ-CHINHSUA-003 | Tên hiển thị trên kênh (cấp Gói bán): cho phép chỉnh sửa; max 255 ký tự | DOC-02 §3.3 STT 3 | Functional | SC-CHINHSUA-003 | Medium |
| REQ-CHINHSUA-004 | Sản phẩm nhận trong gói: cho phép chỉnh sửa checkbox per line-item | DOC-02 §3.3 STT 7 | Functional | SC-CHINHSUA-004 | High |
| REQ-CHINHSUA-005 | Hình ảnh SKU nhận trong gói: cho phép chỉnh sửa / upload ảnh mới | DOC-02 §3.3 STT 8 | Functional | SC-CHINHSUA-005 | High |
| REQ-CHINHSUA-006 | Block Đặc quyền: cho phép chỉnh sửa toàn bộ danh sách (thêm/sửa/xóa row) | DOC-02 §3.3 Nhóm đặc quyền STT 3 | Functional | SC-CHINHSUA-006 | Medium |
| REQ-CHINHSUA-007 | Hình ảnh banner đầu trang: cho phép chỉnh sửa/thêm mới; cùng rule upload với Tạo mới | DOC-02 §3.3 STT 3 | Functional | SC-CHINHSUA-007 | Medium |
| REQ-CHINHSUA-008 | Hình ảnh banner giữa trang: cho phép chỉnh sửa; toggle Hoạt động | DOC-02 §3.3 STT 5-10 | Functional | SC-CHINHSUA-008 | Medium |
| REQ-CHINHSUA-009 | Nút Lưu: cập nhật bản ghi; ghi nhận Thời gian cập nhật + Người cập nhật; thông báo thành công | DOC-01 QA-003; DOC-02 §3.3 STT 12 | Functional | SC-CHINHSUA-009, SC-CHINHSUA-010 | High |
| REQ-CHINHSUA-010 | Nút Hủy: hiển thị popup "Xác nhận Hủy"; xác nhận → về Danh sách không lưu | DOC-02 §3.3 STT 11 | Functional | SC-CHINHSUA-011 | Medium |

---

## Clarifications Needed

| # | Req ID | DOC Source | Câu hỏi | Answer | Status | Ngày resolve | Ảnh hưởng TC |
|---|--------|-----------|---------|--------|--------|--------------|--------------|
| CLA-001 | REQ-TAOMOI-020, REQ-CHINHSUA-010 | DOC-01 QA-004 vs DOC-02 §2.3 STT 12 | **Mâu thuẫn nút Hủy**: TongHop QA-004 = "Không hiển thị confirm"; V1.2 DOCX = "Hiển thị popup Xác nhận Hủy" | Hiển thị popup: "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất." — Button "Quay lại" = đóng popup, tiếp tục; Button "Xác nhận" = về màn hình Danh sách | **Resolved** 2026-05-25 | SC-TAOMOI-035, SC-TAOMOI-036, SC-TAOMOI-037, SC-CHINHSUA-011, SC-CHINHSUA-012 |
| CLA-002 | REQ-TAOMOI-013 | DOC-02 §2.3 vs §3.3 | **Mô tả ngắn max ký tự không nhất quán**: Tạo mới = 2000, Chỉnh sửa = 500 | Max đúng = 2000 ký tự (áp dụng cả Tạo mới và Chỉnh sửa) | **Resolved** 2026-05-25 | SC-TAOMOI-025 |
| CLA-003 | REQ-TAOMOI-014 | DOC-02 §2.3 vs §3.3 | **Mô tả dài max ký tự không nhất quán**: Tạo mới = 12000, Chỉnh sửa = 2000 | Max đúng = 12000 ký tự (áp dụng cả Tạo mới và Chỉnh sửa) | **Resolved** 2026-05-25 | SC-TAOMOI-025 |
| CLA-004 | REQ-TAOMOI-001, REQ-TAOMOI-002 | DOC-02 §2.3 STT 1, 2 | **Thứ tự field V1.2**: Kênh bán trước Gói bán. Kênh bán load động theo Gói bán? | Gói bán vẫn là field đầu tiên; Kênh bán load động theo Gói bán đã chọn (logic giữ nguyên từ v1.0, DOCX ghi nhầm thứ tự) | **Resolved** 2026-05-25 | SC-TAOMOI-001, SC-TAOMOI-002 |
| CLA-005 | REQ-TAOMOI-019 | DOC-02 §2 BR | **Lưu N kênh → N records**: Danh sách hiển thị N dòng hay gộp 1 dòng? | N dòng riêng biệt trong Danh sách — mỗi kênh 1 dòng | **Resolved** 2026-05-25 | SC-TAOMOI-033 |
| CLA-006 | REQ-TAOMOI-010 | DOC-02 §2.3 STT 5 | **Icon đặc quyền**: format và kích thước tối đa? | Dung lượng và định dạng tương tự chức năng upload trên Quản lý nội dung = JPG/PNG, max 1MB | **Resolved** 2026-05-25 | SC-TAOMOI-023 |
| CLA-007 | REQ-TAOMOI-011 | DOC-02 §2.3 STT 10 | **Hình ảnh đặc quyền**: kích thước tối đa? | Dung lượng và định dạng tương tự chức năng upload trên Quản lý nội dung = JPG/PNG, max 1MB | **Resolved** 2026-05-25 | SC-TAOMOI-024 |
| CLA-008 | REQ-TAOMOI-009 | DOC-02 §2.3 Đặc tính gói bán | **Đặc tính gói bán**: read-only hay editable? Data source? | Toàn bộ section Đặc tính gói bán load theo data gói bán, người dùng không được chỉnh sửa (read-only) | **Resolved** 2026-05-25 | SC-TAOMOI-017, SC-TAOMOI-018 |
| CLA-009 | REQ-CHINHSUA-003 | DOC-02 §3.3 STT 5 | **Label không nhất quán**: field 5 màn hình Chỉnh sửa ghi "Tên hiển thị" thay vì "Tên hiển thị trên kênh" | Tên đúng là "Tên hiển thị trên kênh" — thiếu sót trong DOCX | **Resolved** 2026-05-25 | SC-CHINHSUA-003 |
