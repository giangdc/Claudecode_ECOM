# MEMORY — Analyze Requirements Output: Chi tiết Thiết bị
> Cập nhật lần cuối: 2026-05-25 — Thêm 9 scenarios mới (SC-014→022) cho camera blocks: Chu kỳ + Cloud lưu trữ; 3 CLAs mới (006-008)

---

## 1. Project Overview
- Dự án: ecom-pdh | Môi trường: STG | URL: http://ecp-stag.fpt.net/
- Module: Màn hình Chi tiết Thiết bị (chucnang_manhinhchitietthietbi)
- **Đặc điểm quan trọng:**
  1. Module tương tự Chi tiết Dịch vụ SA → reuse toàn bộ `ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx`
  2. Có 2 điểm KHÁC biệt so với SA: **(a) Popup Thông số kỹ thuật** và **(b) Selector Số lượng (non-camera)**
  3. Khi adapt SA TC: bỏ qua TCs về Chu kỳ gói đối với thiết bị non-camera

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|--------|------|------|----------------|--------|-------------------|
| DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx | QC Spec (diff-only) + 2 UI wireframes | 2026-05-25 | Analyzed | CSTHIETBI |
| DOC-CSTHIETBI-02 | ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx | TC Reference (SA base) | 2026-05-25 | Reference | CSTHIETBI (reuse) |

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|--------|------------|----------|----------------|----|----|-----|------------|
| CSTHIETBI (Reuse SA) | DOC-CSTHIETBI-01 | 9 | Reuse từ DOC-CSTHIETBI-02 | — | — | — | Medium |
| CSTHIETBI (Thông số KT — MỚI) | DOC-CSTHIETBI-01 | 6 | 10 | 4 | 5 | 1* | Medium |
| CSTHIETBI (Số lượng — KHÁC SA) | DOC-CSTHIETBI-01 | 2 | 3 | 3 | 0 | 0 | Medium |
| CSTHIETBI (Chu kỳ + Cloud — Camera only) | DOC-CSTHIETBI-01 | 3 | 9 | 7 | 1 | 0** | **High** |
| **Tổng** | | **20** | **22 mới + SA reuse** | **14** | **6** | **1** | **High** |

> *SC-008 đã unblock sau khi BA confirm CLA-003
> **SC-021 BLOCKED — chờ CLA-CSTHIETBI-008

---

## 4. Scenario Index

| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
|-------------|----------|--------|------------|----------|-----------|-----------|
| SC-CSTHIETBI-001 | Mở popup qua "Xem tất cả thông số" | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-002 | Mở popup qua entry point "Thông số kỹ thuật" | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-003 | Popup hiển thị hình ảnh kỹ thuật khi có ảnh | CSTHIETBI | DOC-CSTHIETBI-01 | P2 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-004 | Popup khi không có hình ảnh (optional) | CSTHIETBI | DOC-CSTHIETBI-01 | P2 | Negative | ✅ Đã tạo |
| SC-CSTHIETBI-005 | Boundary max 5 ảnh — đúng giới hạn | CSTHIETBI | DOC-CSTHIETBI-01 | P2 | Boundary | ✅ Đã tạo |
| SC-CSTHIETBI-006 | Boundary max 5 ảnh — vượt giới hạn | CSTHIETBI | DOC-CSTHIETBI-01 | P2 | Boundary | ✅ Đã tạo |
| SC-CSTHIETBI-007 | Thông số 2 cột hiển thị đúng | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-008 | Block Thông số KT ẩn khi PDH không cấu hình | CSTHIETBI | DOC-CSTHIETBI-01 | P2 | Negative | ✅ Đã tạo |
| SC-CSTHIETBI-009 | Đóng popup bằng tap ngoài | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-010 | Đóng popup bằng button X | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-011 | Số lượng mặc định = 1, không có Chu kỳ (non-camera) | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-012 | Tăng số lượng bằng button (+) | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ✅ Đã tạo |
| SC-CSTHIETBI-013 | Giảm số lượng về min = 1, button (-) disabled | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Boundary | ✅ Đã tạo |
| SC-CSTHIETBI-014 | Chu kỳ hiển thị tất cả options cho camera | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-CSTHIETBI-015 | Chọn chu kỳ khác → highlight + giá cập nhật | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-CSTHIETBI-016 | Mua Ngay truyền đúng chu kỳ đã chọn cho camera | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-CSTHIETBI-017 | Chu kỳ không hiển thị ở thiết bị non-camera | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-CSTHIETBI-018 | Cloud lưu trữ hiển thị tất cả options cho camera | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-CSTHIETBI-019 | Chọn Cloud lưu trữ khác → highlight + giá thay đổi | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-CSTHIETBI-020 | Cloud lưu trữ không hiển thị ở non-camera | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-CSTHIETBI-021 | Cloud lưu trữ ẩn/hiện khi PDH không cấu hình | CSTHIETBI | DOC-CSTHIETBI-01 | P2 | Negative | 🚫 Blocked (CLA-008) |
| SC-CSTHIETBI-022 | Giá tổng hợp đúng khi chọn Chu kỳ + Cloud lưu trữ | CSTHIETBI | DOC-CSTHIETBI-01 | P1 | Functional | ⏳ Chưa tạo |
> Chi tiết Given/When/Then → xem test_scenario_map.md

---

## 5. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |
|---|--------|------------|--------|--------|--------|--------------|
| CLA-CSTHIETBI-001 | REQ-CSTHIETBI-010 | DOC-CSTHIETBI-01 | Tên button: 2 tên hay 1? | 2 entry point khác nhau, cùng mở 1 popup | Resolved | SC-001, SC-002 giữ nguyên |
| CLA-CSTHIETBI-002 | REQ-CSTHIETBI-011 | DOC-CSTHIETBI-01 | Vị trí block Thông số KT? | Dưới block Hình Ảnh & Video | Resolved | REQ-011 updated |
| CLA-CSTHIETBI-003 | REQ-CSTHIETBI-012, 013 | DOC-CSTHIETBI-01 | PDH không config → ẩn hay rỗng? | Ẩn đi | Resolved | SC-008 unblocked |
| CLA-CSTHIETBI-004 | REQ-CSTHIETBI-016 | DOC-CSTHIETBI-01 | Thiết bị có Chu kỳ không? | Non-camera: Số lượng; Camera: Chu kỳ giống SA | Resolved | REQ-016, 017 mới |
| CLA-CSTHIETBI-005 | REQ-CSTHIETBI-017 | DOC-CSTHIETBI-01 | Selector Số lượng có max không? Giá thay đổi theo SL? | — | **Open** | SC-012, SC-013 |
| CLA-CSTHIETBI-006 | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | Block Cloud lưu trữ có options cụ thể nào? Option mặc định là gì? | — | **Open** | SC-018, SC-019 |
| CLA-CSTHIETBI-007 | REQ-CSTHIETBI-020 | DOC-CSTHIETBI-01 | Giá camera tính thế nào khi kết hợp Chu kỳ + Cloud? Hiển thị 1 giá tổng hay 2 dòng? | — | **Open** | SC-022 |
| CLA-CSTHIETBI-008 | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | PDH không cấu hình Cloud lưu trữ cho camera → block ẩn hay hiện option mặc định "Không"? | — | **Open** | SC-021 |

---

## 6. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|--------|-------------------|---------|------------|------------|---------|
| DOC-CSTHIETBI-01+02 | 2026-05-25 | 76 (High:23 Medium:47 Low:6) | AI_ISC_ecom-pdh_v1.1_TC_chitietthietbi_v1.0.xlsx | v1.0 | 3 TC BLOCKED (CLA-005, CLA-007, CLA-008); 17 nhóm; Sheet: Chi tiet Thiet bi |

---

## 7. Hướng dẫn gen TC cho module này

**Chiến lược: 2 nguồn kết hợp**

1. **SA Reuse (bulk):** Copy/adapt từ `ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx`
   - Đổi header/module name sang "Chi tiết Thiết bị"
   - **BỎ QUA** TCs về "Chu kỳ gói" và "Chọn chu kỳ" khi test thiết bị non-camera
   - Giữ nguyên tất cả TCs khác (rule không đổi)

2. **New TCs — Thông số kỹ thuật:** SC-CSTHIETBI-001 → SC-CSTHIETBI-010

3. **New TCs — Số lượng:** SC-CSTHIETBI-011 → SC-CSTHIETBI-013

4. **Resolve trước khi gen:** CLA-CSTHIETBI-005 (max số lượng, giá thay đổi theo SL?)
