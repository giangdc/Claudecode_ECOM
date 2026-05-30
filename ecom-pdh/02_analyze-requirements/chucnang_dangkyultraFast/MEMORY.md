# MEMORY — Analyze Requirements Output
> Cập nhật lần cuối: 2026-05-30 — Update: BA đổi text lỗi SĐT sai định dạng "Số điện thoại không hợp lệ." → "Số điện thoại chưa đúng, mời nhập lại" (ảnh hưởng SC-006, SC-007)

---

## 1. Project Overview

- Dự án: ecom-pdh (FPT Telecom ISC/ECP) | Môi trường: Staging | URL: http://ecp-stag.fpt.net/
- Module này: Đăng ký dịch vụ UltraFast — Luồng Checkout (Bước Thanh toán)
- Điểm khác biệt với checkout thông thường: **KHÔNG có COD**, chỉ có PTTT Online; Block TTCN chỉ có SĐT; Block TTKH auto-load

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|---|---|---|---|---|---|
| DOC-UF-01 | dang ky dich ultraFast.xlsx (sheet: Đăng ký UltraFast) | Functional Spec | 2026-05-28 | Analyzed | DANGKYUF — Checkout flow |
| DOC-UF-02 | dang ky dich ultraFast.xlsx (sheet: Rule common) | Validation Rules | 2026-05-28 | Analyzed | DANGKYUF — Field validation + PTTT flow |

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|---|---|---|---|---|---|---|---|
| DANGKYUF — B1 Điều hướng sang Checkout | DOC-UF-01 | 1 (REQ-001) | 2 | 2 | 0 | 0 | Low |
| DANGKYUF — Block Sản phẩm dịch vụ | DOC-UF-01 | 1 (REQ-002) | 1 | 1 | 0 | 0 | Low |
| DANGKYUF — Block TTCN (SĐT) | DOC-UF-01, DOC-UF-02 | 1 (REQ-003) | 6 | 2 | 4 | 0 | Low |
| DANGKYUF — Block PTTT (Online only) | DOC-UF-01, DOC-UF-02 | 1 (REQ-004) | 3 | 2 | 1 | 0 | **High** |
| DANGKYUF — Block Thông tin khách hàng | DOC-UF-01 | 1 (REQ-005) | 1 | 0 | 1 | 0 | Low |
| DANGKYUF — Block Thông tin thanh toán | DOC-UF-01 | 1 (REQ-006) | 2 | 1 | 1 | 0 | Medium |
| DANGKYUF — Button Thanh toán | DOC-UF-01 | 1 (REQ-007) | 3 | 3 | 0 | 0 | Medium |
| DANGKYUF — Luồng thanh toán Online | DOC-UF-01, DOC-UF-02 | 1 (REQ-008) | 3 | 2 | 1 | 0 | **High** |
| DANGKYUF — Navigation | DOC-UF-01 | 1 (REQ-009) | 3 | 0 | 1 | 2 | Low |
| **TOTAL** | | **9** | **24** | **13** | **9** | **2** | |

---

## 4. Scenario Index

| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
|---|---|---|---|---|---|---|
| SC-DANGKYUF-001 | B1 — navigate sang checkout | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-002 | Checkout load đúng chu kỳ + tiền | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-003 | Block sản phẩm hiển thị đúng | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-004 | SĐT hợp lệ — nhập thành công | DANGKYUF | DOC-UF-02 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-005 | SĐT trống → required error | DANGKYUF | DOC-UF-02 | P1 | Negative | ✅ Đã tạo |
| SC-DANGKYUF-006 | SĐT < 10 số → sai định dạng | DANGKYUF | DOC-UF-02 | P2 | Negative | ✅ Đã tạo (text lỗi updated 2026-05-30 → TC_DANGKYUF.7) |
| SC-DANGKYUF-007 | SĐT không bắt đầu 0 → lỗi | DANGKYUF | DOC-UF-02 | P2 | Negative | ✅ Đã tạo (text lỗi updated 2026-05-30 → TC_DANGKYUF.8) |
| SC-DANGKYUF-008 | SĐT > 10 số → không nhập thêm | DANGKYUF | DOC-UF-02 | P2 | Boundary | ✅ Đã tạo |
| SC-DANGKYUF-009 | Icon X xóa data SĐT | DANGKYUF | DOC-UF-02 | P2 | UI | ✅ Đã tạo |
| SC-DANGKYUF-010 | PTTT load đúng theo QLCS | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-011 | Không có COD trong PTTT | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-012 | QLCS N PTTT → hiển thị N | DANGKYUF | DOC-UF-01 | P2 | Business Rule | ✅ Đã tạo |
| SC-DANGKYUF-013 | Block TTKH auto-load | DANGKYUF | DOC-UF-01 | P2 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-014 | Cần thanh toán = tổng tiền | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| ~~SC-DANGKYUF-015~~ | ~~Cần thanh toán đã trừ voucher~~ | DANGKYUF | DOC-UF-01 | P2 | Functional | 🚫 Blocked (voucher chưa implement) |
| SC-DANGKYUF-016 | Trường bắt buộc chưa nhập → block TT | DANGKYUF | DOC-UF-01 | P1 | Negative | ✅ Đã tạo |
| SC-DANGKYUF-017 | Chính sách không active → lỗi | DANGKYUF | DOC-UF-01 | P1 | Negative | ✅ Đã tạo |
| SC-DANGKYUF-018 | Tất cả hợp lệ → thực hiện TT | DANGKYUF | DOC-UF-01 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-019 | TT online thành công → hoàn tất | DANGKYUF | DOC-UF-02 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-020 | Hủy tại 3rd party → về checkout | DANGKYUF | DOC-UF-02 | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-021 | Back từ 3rd party → chỉ PTTT edit được | DANGKYUF | DOC-UF-02 | P2 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-022 | Logo FPT → FPT.vn | DANGKYUF | DOC-UF-01 | P3 | UI | ✅ Đã tạo |
| SC-DANGKYUF-023 | Quay lại → màn hình Chi tiết | DANGKYUF | DOC-UF-01 | P2 | UI | ✅ Đã tạo |
| SC-DANGKYUF-024 | Text điều khoản → privacy-policy | DANGKYUF | DOC-UF-01 | P3 | UI | ✅ Đã tạo |

> TC Status: ✅ Đã tạo / ✅ Đã tạo / 🔄 Cần update / 🚫 Blocked
> Chi tiết Given/When/Then → xem `test_scenario_map.md`

---

## 5. Test Data Summary

*(Không tạo test_data_catalog.md — user tự nhập khi execute)*

Key data cần chuẩn bị khi execute:
- **Số điện thoại hợp lệ:** 10 số, bắt đầu 0 (VD: 0901234567, 0912345678)
- **Số điện thoại không hợp lệ:** < 10 số, không bắt đầu 0, chuỗi chữ, ký tự đặc biệt
- **Gói UltraFast trên Staging:** Gói còn active, có ít nhất 2 chu kỳ; gói đã deactivate (dùng cho SC-017)
- **Cấu hình QLCS:** Bộ đủ PTTT (≥3), bộ giới hạn 2 PTTT (dùng cho SC-012)
- **Account test:** Có thông tin cá nhân + lắp đặt đầy đủ (dùng cho SC-013)
- **PTTT có thể test trực tiếp web:** Thẻ ATM, Thẻ Visa/Credit card
- **PTTT cần app mobile:** Momo, VietQR, Zalopay (cần device hoặc browser mobile)
- **Voucher** (nếu CLARY-005 resolved): Voucher hợp lệ áp dụng cho UltraFast (dùng cho SC-015)

---

## 6. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |
|---|---|---|---|---|---|---|
| CLARY-DANGKYUF-001 | REQ-DANGKYUF-003, REQ-DANGKYUF-005 | DOC-UF-01 Row 33-36, DOC-UF-02 Row 2-8 | Block TTCN UltraFast chỉ có SĐT. Các trường Họ tên, địa chỉ trong Rule common có áp dụng cho UltraFast không? | Rule common mô tả cho nhiều dịch vụ khác; UltraFast không có trường địa chỉ/họ tên | **Resolved** 2026-05-28 | Không thêm SC địa chỉ; SC-004..009 giữ nguyên |
| CLARY-DANGKYUF-002 | REQ-DANGKYUF-003 | DOC-UF-01 Row 34 | Checkbox "Tôi muốn nhận hóa đơn" — ẩn hay disabled? | Hiển thị trên UI nhưng blocked, không test | **Resolved** 2026-05-28 | Không tạo SC; ghi chú skip khi execute |
| CLARY-DANGKYUF-003 | REQ-DANGKYUF-005 | DOC-UF-01 Row 36 | Block TTKH load từ đâu? Thiếu data → hiển thị gì? | Mặc định rỗng; hiện đúng field nào đã có data (VD: SĐT đã nhập → hiện SĐT) | **Resolved** 2026-05-28 | SC-013 đã cập nhật Given/Then |
| CLARY-DANGKYUF-004 | REQ-DANGKYUF-004 | DOC-UF-01 Row 35 | QLCS chỉ cấu hình COD → UltraFast xử lý thế nào? | QLCS không cho phép cấu hình COD cho UltraFast → không xảy ra | **Resolved** 2026-05-28 | SC-010, SC-011 giữ nguyên |
| CLARY-DANGKYUF-005 | REQ-DANGKYUF-006 | DOC-UF-01 Row 38 | Voucher áp dụng từ bước nào? | Áp dụng tại bước thanh toán nhưng chưa implement | **Resolved** 2026-05-28 | SC-015 → 🚫 Blocked |
| DEFECT-DANGKYUF-001 | REQ-DANGKYUF-004 | SC-DANGKYUF-011 | Staging hiển thị "Thanh toán khi triển khai" (COD) trong Block PTTT của UltraFast | BA xác nhận 2026-05-30: **UltraFast KHÔNG có COD** → đây là bug staging (cấu hình/UI), cần Dev fix | **Defect — Open** 2026-05-30 | TC_DANGKYUF.12 FAIL (đúng) — giữ test, chờ Dev fix rồi re-run |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|---|---|---|---|---|---|
| DOC-UF-01, DOC-UF-02 | 2026-05-28 | 28 | AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx (sheet: DangKy_UltraFast) | v1.0 | High:13 Medium:13 Low:2 \| Blocked:3 (voucher, auth, mobile) \| Auto Y:20 N:8 |
| DOC-UF-02 | 2026-05-30 | 2 updated | AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx (sheet: DangKy_UltraFast) | v1.0 (in-place) | BA đổi text lỗi SĐT sai định dạng → "Số điện thoại chưa đúng, mời nhập lại". ✅ TC_DANGKYUF.7 (G17), TC_DANGKYUF.8 (G18) cập nhật Expected Result + change note col L; ✅ assertion automation đã đồng bộ (spec.ts + page.ts) |
| Run automation 2026-05-30 | 2026-05-30 | 28 TC: 17 Pass / 3 Fail / 8 Block | AI_ISC_ecom-pdh_v1.1_TC_v1.0_results_20260530.xlsx | — | sync-tc-results Round 1. ❌ TC.7, TC.8: UI staging chưa deploy text mới (chờ Dev). ❌ TC.12: DEFECT-DANGKYUF-001 (COD trái SC-011, BA xác nhận). ⏸️ Block 8 = 5 TC manual Auto?=N (.1/.18/.20/.21/.22 — chưa test tay) + 3 TC [BLOCKED] (.26 voucher/.27 auth/.28 mobile). Rule: case không chạy trong run = Block + lý do ở Ghi Chú |
