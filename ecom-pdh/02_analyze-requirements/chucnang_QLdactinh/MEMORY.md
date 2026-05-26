# MEMORY — Analyze Requirements Output
> Cập nhật lần cuối: 2026-05-25 — BA confirmed 6 CLA; unblock SC-021/030/032/033/035; thêm SC-038..041

---

## 1. Project Overview

- **Dự án:** ecom-pdh (ECOM Product Hub)
- **Môi trường:** STG — http://ecp-stag.fpt.net/
- **Module:** Quản lý Đặc tính (Specification Management)
- **Sprint phân tích:** V1.2
- **TC hiện có:** `03_test-cases/functional/AI_ISC_ecom-pdh_v1.1_TC_v2.0.xlsx` (module Gói bán)

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|--------|------|------|----------------|--------|-------------------|
| DOC-01 | TongHop_NoidungGoiban_v1.1_prep.md | BRD / Tổng hợp | 2026-05-25 | ✅ Đã phân tích | Gói bán |
| DOC-02 | [Sprint V1.2] URD Product Offering Content | URD | 2026-05-25 | ✅ Đã phân tích | Gói bán |
| DOC-03 | ISC_chucnang_dactinh_v1.0.xlsx | TC baseline (reference) | 2026-05-25 | ✅ Reference only | Đặc tính |
| DOC-04 | [Sprint V1.2] URD - Specification Management (1).docx | URD (primary) | 2026-05-25 | ✅ Đã phân tích | Đặc tính (Quản lý Đặc tính) |

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|--------|------------|---------|----------------|----|----|-----|------------|
| DACTINH — Xem danh sách | DOC-04 | 5 | 12 | 2 | 10 | 0 | Medium |
| DACTINH — Tạo mới | DOC-04 | 5 | 18 | 6 | 12 | 0 | High |
| DACTINH — Chi tiết | DOC-04 | 2 | 4 | 1 | 3 | 0 | Low |
| DACTINH — Chỉnh sửa | DOC-04 | 3 | 7 | 5 | 2 | 0 | High |
| **TỔNG** | | **15** | **41** | **15** | **26** | **0** | **High** |

> ⚠️ Module NHÓM ĐẶC TÍNH không có trong DOC-04 — chưa phân tích.

---

## 4. Scenario Index

| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
|-------------|----------|--------|------------|----------|-----------|-----------|
| SC-DACTINH-001 | Load danh sách | DACTINH-DANHSACH | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-002 | Hiển thị đúng cột | DACTINH-DANHSACH | DOC-04 | P2 | UI | ⏳ Chưa tạo |
| SC-DACTINH-003 | "+X more" Giá trị [V1.2] | DACTINH-DANHSACH | DOC-04 | P2 | Business Rule | ⏳ Chưa tạo |
| SC-DACTINH-004 | Sort mặc định TG cập nhật | DACTINH-DANHSACH | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-005 | Phân trang 10/trang | DACTINH-DANHSACH | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-006 | Tìm kiếm — có kết quả | DACTINH-DANHSACH | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-007 | Tìm kiếm — không kết quả | DACTINH-DANHSACH | DOC-04 | P2 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-008 | Tìm kiếm — trim whitespace | DACTINH-DANHSACH | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-009 | Lọc nhóm OR logic | DACTINH-DANHSACH | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-010 | Lọc nhóm — không kết quả | DACTINH-DANHSACH | DOC-04 | P2 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-011 | Click icon 👁 | DACTINH-DANHSACH | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-012 | Click icon ✏️ | DACTINH-DANHSACH | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-013 | Tạo mới thành công | DACTINH-TAOMOI | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-014 | Icon upload thành công [V1.2] | DACTINH-TAOMOI | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-015 | Icon optional [V1.2] | DACTINH-TAOMOI | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-016 | Icon max 1 [V1.2] | DACTINH-TAOMOI | DOC-04 | P2 | Business Rule | ⏳ Chưa tạo |
| SC-DACTINH-017 | Tên bỏ trống | DACTINH-TAOMOI | DOC-04 | P1 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-018 | Tên > 255 ký tự | DACTINH-TAOMOI | DOC-04 | P2 | Boundary | ⏳ Chưa tạo |
| SC-DACTINH-019 | Tên trùng ignore case | DACTINH-TAOMOI | DOC-04 | P1 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-020 | Kiểu dữ liệu bỏ trống | DACTINH-TAOMOI | DOC-04 | P1 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-021 | KDL Text — lưu thành công [V1.2] | DACTINH-TAOMOI | BA confirm | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-022 | Giá trị đúng 50 values | DACTINH-TAOMOI | DOC-04 | P2 | Boundary | ⏳ Chưa tạo |
| SC-DACTINH-023 | Giá trị > 50 values | DACTINH-TAOMOI | DOC-04 | P2 | Boundary | ⏳ Chưa tạo |
| SC-DACTINH-024 | Giá trị max 255 ký tự | DACTINH-TAOMOI | DOC-04 | P2 | Boundary | ⏳ Chưa tạo |
| SC-DACTINH-025 | Dòng đầu không xóa | DACTINH-TAOMOI | DOC-04 | P2 | Business Rule | ⏳ Chưa tạo |
| SC-DACTINH-026 | Nhóm optional | DACTINH-TAOMOI | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-027 | Chi tiết — hiển thị đúng | DACTINH-CHITIET | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-028 | Icon read-only trong chi tiết [V1.2] | DACTINH-CHITIET | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-029 | Chi tiết không có icon [V1.2] | DACTINH-CHITIET | DOC-04 | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-030 | Chi tiết KDL Text — không có predefined values [V1.2] | DACTINH-CHITIET | BA confirm | P2 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-031 | Chỉnh sửa thành công | DACTINH-CHINHSUA | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-032 | Icon upload mới [V1.2] | DACTINH-CHINHSUA | BA confirm | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-033 | Icon — không có nút xóa [V1.2] | DACTINH-CHINHSUA | BA confirm | P2 | Business Rule | ⏳ Chưa tạo |
| SC-DACTINH-034 | Tên trùng khi sửa | DACTINH-CHINHSUA | DOC-04 | P1 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-035 | Đổi Kiểu dữ liệu khi sửa | DACTINH-CHINHSUA | BA confirm | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-036 | Thêm Giá trị khi sửa | DACTINH-CHINHSUA | DOC-04 | P1 | Functional | ⏳ Chưa tạo |
| SC-DACTINH-037 | Xóa Giá trị khi sửa | DACTINH-CHINHSUA | DOC-04 | P2 | Business Rule | ⏳ Chưa tạo |
| SC-DACTINH-038 | Icon format không hợp lệ [V1.2] | DACTINH-TAOMOI | BA confirm | P2 | Negative | ⏳ Chưa tạo |
| SC-DACTINH-039 | Icon > 1MB [V1.2] | DACTINH-TAOMOI | BA confirm | P2 | Boundary | ⏳ Chưa tạo |
| SC-DACTINH-040 | Icon đúng 1MB [V1.2] | DACTINH-TAOMOI | BA confirm | P2 | Boundary | ⏳ Chưa tạo |
| SC-DACTINH-041 | KDL Text — không có nút Thêm giá trị [V1.2] | DACTINH-TAOMOI | BA confirm | P1 | Functional | ⏳ Chưa tạo |

---

## 6. Clarifications — Đã resolve

| # | Req ID | Vấn đề | Answer | Status | Ngày resolve | Ảnh hưởng TC |
|---|--------|--------|--------|--------|--------------|--------------|
| CLA-DACTINH-001 | REQ-DACTINH-007 | Icon: format? size? | JPG/PNG, max 1MB, max 1 ảnh | ✅ Resolved | 2026-05-25 | SC-014, 038, 039, 040 |
| CLA-DACTINH-002 | REQ-DACTINH-014 | Nút xóa icon riêng? | Chỉ upload đè — không có nút xóa | ✅ Resolved | 2026-05-25 | SC-033 updated |
| CLA-DACTINH-003 | REQ-DACTINH-009 | KDL Text: field Giá trị? | [V1.2] Vẫn hiển thị, không có nút Thêm giá trị | ✅ Resolved | 2026-05-25 | SC-021, 030, 041 unblock |
| CLA-DACTINH-004 | REQ-DACTINH-013 | Đổi Kiểu dữ liệu khi sửa? | Cho đổi; SKU không bị ảnh hưởng | ✅ Resolved | 2026-05-25 | SC-035 unblock |
| CLA-DACTINH-005 | REQ-DACTINH-010 | Validate ký tự Giá trị? | Không validate, cho nhập thoải mái | ✅ Resolved | 2026-05-25 | SC-024 simplified |
| CLA-DACTINH-006 | REQ-DACTINH-001 | Có nút Xóa không? | Không có chức năng Xóa | ✅ Resolved | 2026-05-25 | Không cần TC xóa |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|--------|-------------------|---------|------------|------------|---------|
| DOC-03 | 2026-05-25 | ~135 | ISC_chucnang_dactinh_v1.0.xlsx | v1.0 (existing) | TC baseline cho Đặc tính — chưa có TC cho V1.2 changes |
| DOC-04 | 2026-05-25 | ~147 | AI_ISC_ecom-pdh_v1.1_TC_dactinh_v1.1.xlsx | v1.1 | ✅ Generated: Reuse ~127 + Update 5 + New 12 TCs; 17 rows YELLOW; 8 section headers OK |

> ✅ TC V1.2 đã tạo. File: `03_test-cases/functional/AI_ISC_ecom-pdh_v1.1_TC_dactinh_v1.1.xlsx`
> Các V1.2 thay đổi: Icon đặc tính (JPG/PNG ≤1MB, max 1, upload đè); KDL Text (không có nút Thêm giá trị); đổi KDL trong Chỉnh sửa được phép.
