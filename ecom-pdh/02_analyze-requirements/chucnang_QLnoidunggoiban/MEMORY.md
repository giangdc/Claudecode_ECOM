# MEMORY — Analyze Requirements Output
> Cập nhật lần cuối: 2026-05-25 — BA confirmed tất cả 9 clarifications (Mode 2: UPDATE)

---

## 1. Project Overview

- **Dự án:** ecom-pdh | **Sprint:** V1.2 | **Môi trường:** STG | **URL:** http://ecp-stag.fpt.net/
- **Actor:** Người quản trị sản phẩm (Admin/Quản trị viên)
- **Module:** Quản lý Nội dung Gói bán — Product Hub
- **Phạm vi:** 3 màn hình: Danh sách / Tạo mới / Chỉnh sửa nội dung Gói bán
- **Loại kiểm thử:** Functional

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|--------|------|------|---------------|--------|------------------|
| DOC-01 | TongHop_NoidungGoiban_v1.1_prep.md | AS-IS Baseline v1.0 + Q&A resolved | 2026-05-25 | Analyzed | DANHSACH, TAOMOI, CHINHSUA |
| DOC-02 | [Sprint V1.2] - URD - Product Offering Content (1).docx | TO-BE Sprint V1.2 spec chính thức | 2026-05-25 | Analyzed | DANHSACH, TAOMOI, CHINHSUA |

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|--------|-----------|---------|---------------|----|----|----|-----------:|
| DANHSACH | DOC-01, DOC-02 | 3 | 5 | 0 | 0 | 5 | Low |
| TAOMOI | DOC-01, DOC-02 | 20 | 37 | 20 | 17 | 0 | High |
| CHINHSUA | DOC-01, DOC-02 | 10 | 12 | 8 | 4 | 0 | High |
| **TỔNG** | | **33** | **54** | **28** | **21** | **5** | |

---

## 4. Scenario Index

| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
|-------------|---------|--------|-----------|----------|-----------|-----------|
| SC-DANHSACH-001 | Xem danh sách thành công | DANHSACH | DOC-02 | P3 | Functional | ⏳ Chưa tạo |
| SC-DANHSACH-002 | Tìm kiếm có kết quả | DANHSACH | DOC-02 | P3 | Functional | ⏳ Chưa tạo |
| SC-DANHSACH-003 | Tìm kiếm không có kết quả | DANHSACH | DOC-02 | P3 | Negative | ⏳ Chưa tạo |
| SC-DANHSACH-004 | Empty state | DANHSACH | DOC-02 | P3 | Functional | ⏳ Chưa tạo |
| SC-DANHSACH-005 | Điều hướng Tạo mới | DANHSACH | DOC-02 | P3 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-001 | Kênh bán multi-select thành công | TAOMOI | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-002 | Kênh đã sử dụng không hiển thị | TAOMOI | DOC-02 | P1 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-003 | Gói bán filter active + có giá | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-004 | Auto-fill Tên hiển thị — SKU đơn | TAOMOI | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-005 | Auto-fill Tên hiển thị — Nhóm SKU/Phí đi kèm | TAOMOI | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-006 | Upload icon gói bán hợp lệ | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-007 | Upload icon gói bán sai định dạng | TAOMOI | DOC-02 | P2 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-008 | Checkbox Sản phẩm mặc định checked | TAOMOI | DOC-01, DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-009 | Uncheck Sản phẩm → kênh ẩn hoàn toàn | TAOMOI | DOC-01, DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-010 | SKU con kế thừa Phương thức từ Nhóm SKU | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-011 | Validate min 1 sản phẩm cha = Hiển thị toàn bộ | TAOMOI | DOC-02 | P1 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-012 | Auto-load ảnh SKU từ config có sẵn | TAOMOI | DOC-01, DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-013 | SKU chưa có ảnh → nút Thêm | TAOMOI | DOC-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-014 | Upload ảnh SKU hợp lệ (JPG/PNG ≤1MB) | TAOMOI | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-015 | Upload ảnh SKU sai định dạng | TAOMOI | DOC-02 | P1 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-016 | Giới hạn 1 ảnh/SKU | TAOMOI | DOC-01, DOC-02 | P2 | Boundary | ⏳ Chưa tạo |
| SC-TAOMOI-017 | Đặc tính nổi bật toggle | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-018 | Tag line max 255 ký tự | TAOMOI | DOC-02 | P2 | Boundary | ⏳ Chưa tạo |
| SC-TAOMOI-019 | Thêm đặc quyền thành công | TAOMOI | DOC-01, DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-020 | Tối đa 10 đặc quyền | TAOMOI | DOC-02 | P1 | Boundary | ⏳ Chưa tạo |
| SC-TAOMOI-021 | Xóa đặc quyền | TAOMOI | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-022 | Thiếu Tiêu đề đặc quyền → lỗi validate | TAOMOI | DOC-02 | P1 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-023 | Upload icon đặc quyền | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-024 | Upload hình ảnh đặc quyền | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-025 | Mô tả ngắn — boundary ký tự | TAOMOI | DOC-02 | P2 | Boundary | ⏳ Chưa tạo |
| SC-TAOMOI-026 | Upload Banner đầu trang hợp lệ | TAOMOI | DOC-01, DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-027 | Banner đầu trang — tối đa 10 ảnh | TAOMOI | DOC-02 | P2 | Boundary | ⏳ Chưa tạo |
| SC-TAOMOI-028 | Link video — URL hợp lệ | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-029 | Link video — URL sai định dạng | TAOMOI | DOC-02 | P2 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-030 | Banner giữa trang — thêm banner | TAOMOI | DOC-01, DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-031 | Banner giữa trang — toggle Hoạt động | TAOMOI | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-032 | Banner giữa trang — tối đa 10 banner | TAOMOI | DOC-02 | P2 | Boundary | ⏳ Chưa tạo |
| SC-TAOMOI-033 | Lưu thành công — tạo N records theo N kênh | TAOMOI | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-034 | Lưu thiếu trường bắt buộc | TAOMOI | DOC-02 | P1 | Negative | ⏳ Chưa tạo |
| SC-TAOMOI-035 | Hủy — popup đúng nội dung + 2 nút | TAOMOI | DOC-02; CLA-001 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-036 | Hủy popup — Xác nhận → về Danh sách | TAOMOI | DOC-02; CLA-001 | P1 | Functional | ⏳ Chưa tạo |
| SC-TAOMOI-037 | Hủy popup — Quay lại → đóng popup, tiếp tục nhập | TAOMOI | DOC-02; CLA-001 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-001 | Load toàn bộ dữ liệu hiện tại | CHINHSUA | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-002 | Kênh bán + Gói bán read-only | CHINHSUA | DOC-02 | P1 | Negative | ⏳ Chưa tạo |
| SC-CHINHSUA-003 | Chỉnh sửa Tên hiển thị trên kênh | CHINHSUA | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-004 | Chỉnh sửa checkbox Sản phẩm nhận trong gói | CHINHSUA | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-005 | Upload/thay đổi Hình ảnh SKU | CHINHSUA | DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-006 | Chỉnh sửa block Đặc quyền | CHINHSUA | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-007 | Thay đổi Banner đầu trang | CHINHSUA | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-008 | Toggle Hoạt động banner giữa trang | CHINHSUA | DOC-02 | P2 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-009 | Lưu + cập nhật record + ghi log | CHINHSUA | DOC-01, DOC-02 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-010 | Lưu không thay đổi — có log | CHINHSUA | DOC-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-011 | Hủy — Xác nhận → về Danh sách | CHINHSUA | DOC-02; CLA-001 | P1 | Functional | ⏳ Chưa tạo |
| SC-CHINHSUA-012 | Hủy — Quay lại → đóng popup, tiếp tục sửa | CHINHSUA | DOC-02; CLA-001 | P1 | Functional | ⏳ Chưa tạo |

> Chi tiết Given/When/Then → xem `test_scenario_map.md`

---

## 6. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |
|---|--------|-----------|--------|--------|--------|--------------|
| CLA-001 | REQ-TAOMOI-020, REQ-CHINHSUA-010 | DOC-01 QA-004 vs DOC-02 | Mâu thuẫn nút Hủy | Popup: "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất." — "Quay lại" = đóng popup; "Xác nhận" = về Danh sách | ✅ Resolved | SC-035, SC-036, SC-037, SC-CHINHSUA-011, SC-CHINHSUA-012 |
| CLA-002 | REQ-TAOMOI-013 | DOC-02 §2.3 vs §3.3 | Mô tả ngắn max ký tự | Max đúng = **2000 ký tự** (cả Tạo mới và Chỉnh sửa) | ✅ Resolved | SC-TAOMOI-025 |
| CLA-003 | REQ-TAOMOI-014 | DOC-02 §2.3 vs §3.3 | Mô tả dài max ký tự | Max đúng = **12000 ký tự** (cả Tạo mới và Chỉnh sửa) | ✅ Resolved | SC-TAOMOI-025 |
| CLA-004 | REQ-TAOMOI-001, 002 | DOC-02 §2.3 | Thứ tự field và dependency | **Gói bán trước**, Kênh bán load động theo Gói bán (logic v1.0 giữ nguyên; DOCX ghi nhầm thứ tự) | ✅ Resolved | SC-TAOMOI-001, 002 |
| CLA-005 | REQ-TAOMOI-019 | DOC-02 §2 BR | N records sau Lưu hiển thị trong Danh sách | **N dòng riêng biệt** — mỗi kênh 1 dòng trong Danh sách | ✅ Resolved | SC-TAOMOI-033 |
| CLA-006 | REQ-TAOMOI-010 | DOC-02 §2.3 STT 5 | Icon đặc quyền format/size | **JPG/PNG, max 1MB** (tương tự upload trên Quản lý nội dung) | ✅ Resolved | SC-TAOMOI-023 |
| CLA-007 | REQ-TAOMOI-011 | DOC-02 §2.3 STT 10 | Hình ảnh đặc quyền max size | **JPG/PNG, max 1MB** (tương tự upload trên Quản lý nội dung) | ✅ Resolved | SC-TAOMOI-024 |
| CLA-008 | REQ-TAOMOI-009 | DOC-02 §2.3 Đặc tính | Đặc tính gói bán read-only hay editable? | **Toàn bộ section read-only** — load theo data gói bán, không cho chỉnh sửa | ✅ Resolved | SC-TAOMOI-017, SC-TAOMOI-018 |
| CLA-009 | REQ-CHINHSUA-003 | DOC-02 §3.3 STT 5 | Label "Tên hiển thị" vs "Tên hiển thị trên kênh" | Tên đúng: **"Tên hiển thị trên kênh"** — thiếu sót trong DOCX | ✅ Resolved | SC-CHINHSUA-003 |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|--------|------------------|---------|-----------|-----------|---------|
| DOC-01, DOC-02 | 2026-05-25 | 142 | `03_test-cases/functional/AI_ISC_ecom-pdh_v1.1_TC_v2.0.xlsx` | v2.0 | update-testcase từ v1.0 (128 TC) → v2.0 (142 TC): 11 UPDATE + 14 NEW. Change Note ở col L. |

### Chi tiết thay đổi v2.0

| Action | TC ID | Nội dung thay đổi | Lý do |
|--------|-------|------------------|-------|
| UPDATE | TC_02.7 | Phân trang 10 → 20 bản ghi/trang | V1.2 spec |
| UPDATE | TC_02.8 | STT trang 2 bắt đầu từ 21 (v1.0: 11) | V1.2 spec |
| UPDATE | TC_02.16 | Tìm kiếm trống → 20 bản ghi/trang | V1.2 spec |
| UPDATE | TC_02.23 | Giao diện form v1.2: thêm Kênh multi-select, Icon gói bán, Mô tả card gói, Đặc tính read-only, Link video | V1.2 new fields |
| UPDATE | TC_02.29 | Kênh bán: single-select → multi-select | V1.2 breaking change |
| UPDATE | TC_02.38 | Expected result: bỏ specific "tongdaiwifi", dùng generic "kênh bán" | Generalize |
| UPDATE | TC_02.76 | Tiêu đề đặc quyền: không bắt buộc → BẮT BUỘC | V1.2 spec; CLA resolved |
| UPDATE | TC_02.94 | Toggle Hoạt động banner giữa default: ON → OFF | V1.2 spec |
| UPDATE | TC_02.103 | Hủy Tạo mới: không popup → có popup "Bạn có chắc muốn hủy?" + 2 nút | CLA-001 |
| UPDATE | TC_02.108 | Chỉnh sửa load data: thêm các fields V1.2 mới | V1.2 new fields |
| UPDATE | TC_02.126 | Hủy Chỉnh sửa: không popup → có popup + 2 nút | CLA-001 |
| NEW | TC_02.129 | Kênh bán đã sử dụng không hiển thị (SC-TAOMOI-002) | V1.2 new |
| NEW | TC_02.130 | Upload Icon gói bán hợp lệ JPG/PNG/SVG ≤1MB | V1.2 new field |
| NEW | TC_02.131 | Upload Icon gói bán sai định dạng | V1.2 new field |
| NEW | TC_02.132 | Upload Icon gói bán vượt 1MB | V1.2 new field |
| NEW | TC_02.133 | Mô tả card gói không bắt buộc | V1.2 new field |
| NEW | TC_02.134 | Đặc tính gói bán read-only (CLA-008) | V1.2 new section |
| NEW | TC_02.135 | Đặc tính gói bán load theo Gói bán đã chọn | V1.2 new section |
| NEW | TC_02.136 | Link video URL hợp lệ | V1.2 new field |
| NEW | TC_02.137 | Link video URL sai định dạng | V1.2 new field |
| NEW | TC_02.138 | Lưu N kênh → N records (CLA-005) | V1.2 multi-select save |
| NEW | TC_02.139 | Hủy popup Tạo mới → Xác nhận → về Danh sách | CLA-001 |
| NEW | TC_02.140 | Hủy popup Tạo mới → Quay lại → đóng popup | CLA-001 |
| NEW | TC_02.141 | Hủy popup Chỉnh sửa → Xác nhận → về Danh sách | CLA-001 |
| NEW | TC_02.142 | Hủy popup Chỉnh sửa → Quay lại → đóng popup | CLA-001 |
