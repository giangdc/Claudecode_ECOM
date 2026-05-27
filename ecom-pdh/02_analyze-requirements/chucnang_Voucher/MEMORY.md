# MEMORY — Analyze Requirements Output: Chức năng Voucher (EVC Checkout)

> Cập nhật lần cuối: 2026-05-27 — Phân tích DOC-VOUCHER-08 (FCP__Ver1.1_Auto Voucher_Checkout.docx): extract 5 ảnh (2 UI screenshots thực tế + 2 sequence diagrams + logo) → thêm MODULE VOUCHER-AUTO-UI (6 scenarios SC-AUTO-UI-001..006) + 6 REQ-AUTO-UI + 3 CLA-AUTO mới; phát hiện source="auto" trong Apply call từ sequence diagram

---

## 1. Project Overview

- **Dự án:** ecom-pdh | **Môi trường:** STG | **URL:** http://ecp-stag.fpt.net/
- **Module:** CO – Checkout | **Phụ thuộc:** QLCS API (GetListEvoucher, GetEvoucherInfor, GetVoucherContent, Recheck)
- **Stakeholder:** Chị Linh (Growth), Team Vận hành, PM LongNH

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|--------|------|------|----------------|--------|-------------------|
| DOC-VOUCHER-01 | FCP_Ver1.1_Auto_Voucher_Checkout.md | URD / Feature Spec v1.1 | 2026-05-26 | ✅ Đã phân tích | VOUCHER-AUTO |
| DOC-VOUCHER-02 | FCP_Ver1.1_Tich_hop_Evoucher_Checkout.md | URD / Use Case v1.0 | 2026-05-26 | ✅ Đã phân tích | VOUCHER-LIST, VOUCHER-DETAIL, VOUCHER-APPLY, VOUCHER-CANCEL, VOUCHER-RECHECK |
| DOC-VOUCHER-03 | api doc v1.xlsx — Sheet "Danh sách Voucher" | API Spec | 2026-05-26 | ✅ Đã phân tích | VOUCHER-LIST |
| DOC-VOUCHER-04 | api doc v1.xlsx — Sheet "Nội dung Voucher" | API Spec | 2026-05-26 | ✅ Đã phân tích | VOUCHER-DETAIL |
| DOC-VOUCHER-05 | api doc v1.xlsx — Sheet "Áp dụng Voucher" | API Spec | 2026-05-26 | ✅ Đã phân tích | VOUCHER-APPLY |
| DOC-VOUCHER-06 | api doc v1.xlsx — Sheet "Rule chung cho header" | API Spec | 2026-05-26 | ✅ Đã phân tích | VOUCHER-API |
| DOC-VOUCHER-07 | FCP_ Ver1.1_Tích hợp Evoucher Checkout.docx | URD / Use Case (bản gốc .docx, nguồn của DOC-VOUCHER-02) | 2026-05-27 | ✅ Đã phân tích | VOUCHER-LIST, VOUCHER-DETAIL, VOUCHER-APPLY, VOUCHER-CANCEL, VOUCHER-RECHECK |
| DOC-VOUCHER-08 | FCP__Ver1.1_Auto Voucher_Checkout.docx | URD / Feature Spec Auto-apply (bản gốc .docx — 5 ảnh: 2 UI screenshots + 2 sequence diagrams + logo) | 2026-05-27 | ✅ Đã phân tích | VOUCHER-AUTO, VOUCHER-AUTO-UI |

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|--------|-----------|----------|----------------|----|----|----|------------|
| VOUCHER-LIST | DOC-VOUCHER-02, DOC-VOUCHER-03 | 6 | 7 | 4 | 3 | 0 | Medium |
| VOUCHER-DETAIL | DOC-VOUCHER-02, DOC-VOUCHER-04 | 6 | 5 | 4 | 1 | 0 | Medium |
| VOUCHER-APPLY | DOC-VOUCHER-02, DOC-VOUCHER-05 | 6 | 6 | 5 | 1 | 0 | High |
| VOUCHER-CANCEL | DOC-VOUCHER-02 | 4 | 4 | 2 | 2 | 0 | Medium |
| VOUCHER-RECHECK | DOC-VOUCHER-02 | 3 | 3 | 3 | 0 | 0 | High |
| VOUCHER-AUTO | DOC-VOUCHER-01, DOC-VOUCHER-08 | 17 | 17 | 12 | 5 | 0 | High |
| VOUCHER-AUTO-UI | DOC-VOUCHER-08 (image4, image5, image2) | 6 | 6 | 5 | 1 | 0 | High |
| VOUCHER-UI | DOC-VOUCHER-07 (sequence + URD US02-US06) | 9 | 12 | 8 | 4 | 0 | High |
| VOUCHER-API | DOC-VOUCHER-06 | 3 | 7 | 6 | 1 | 0 | Medium |
| **TỔNG** | | **60** | **63** | **42** | **21** | **0** | |

> Lưu ý: TC API v1.0 đã được gen trước khi phân tích này hoàn tất — xem §7.

---

## 4. Scenario Index

| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
|-------------|---------|--------|-----------|----------|-----------|-----------|
| SC-LIST-001 | Lấy danh sách EVC thành công | VOUCHER-LIST | DOC-VOUCHER-02 | P1 | Integration | ✅ Đã tạo |
| SC-LIST-002 | Kết quả phản ánh đúng context | VOUCHER-LIST | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-LIST-003 | Cập nhật khi context thay đổi | VOUCHER-LIST | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-LIST-004 | Không có EVC → result=0, 200 | VOUCHER-LIST | DOC-VOUCHER-02 | P1 | Negative | ✅ Đã tạo |
| SC-LIST-005 | Validate voucherCode + voucherType | VOUCHER-LIST | DOC-VOUCHER-03 | P1 | Functional | ✅ Đã tạo |
| SC-LIST-006 | Validate optional fields đầy đủ | VOUCHER-LIST | DOC-VOUCHER-03 | P2 | Functional | ✅ Đã cập nhật — API_01.19 bổ sung đủ 8 fields BA yêu cầu (applyTypeId, promotionTypeId, policyGroupId) — 2026-05-26 |
| SC-LIST-007 | Không lẫn EVC kênh khác | VOUCHER-LIST | DOC-VOUCHER-02 | P2 | Functional | ✅ Đã tạo |
| SC-DETAIL-001 | Validate output fields /content | VOUCHER-DETAIL | DOC-VOUCHER-04 | P1 | Functional | ⚠️ Cần update — API_02.25 đang validate discount/applies[] (sai spec); BA update Excel 2026-05-27: API_02 output = Content1-Content6 |
| SC-DETAIL-002 | Validate content sub-fields | VOUCHER-DETAIL | DOC-VOUCHER-04 | P1 | Functional | ⚠️ Cần update — API_02.26 đang validate applies[] sub-fields (sai spec); cần rewrite theo Content1-Content6 |
| SC-DETAIL-003 | On-demand only | VOUCHER-DETAIL | DOC-VOUCHER-02 | P2 | Functional | ✅ Đã tạo |
| SC-DETAIL-004 | voucher_code invalid → error | VOUCHER-DETAIL | DOC-VOUCHER-02 | P1 | Negative | ✅ Đã tạo |
| SC-DETAIL-005 | Thiếu voucher_code → 400 | VOUCHER-DETAIL | DOC-VOUCHER-04 | P1 | Negative | ✅ Đã tạo |
| SC-APPLY-001 | Apply lần đầu — happy path | VOUCHER-APPLY | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-APPLY-002 | Validate promotion/discount output fields | VOUCHER-APPLY | DOC-VOUCHER-05 | P1 | Functional | ✅ Đã cập nhật — API_03.28 bổ sung đủ 17 top-level fields (thiếu: referrer_code, discount_ex_vat_value, discount_rate, apply_type, apply_from, apply_to, original_discount_value, original_discount_ex_vat, voucher_type, voucher_type_l2, type_id) — 2026-05-26 |
| SC-APPLY-003 | Validate applies[] output | VOUCHER-APPLY | DOC-VOUCHER-05 | P1 | Functional | ✅ Đã cập nhật — API_03.28 bổ sung đủ 10 sub-fields applies[] (thiếu: sub_service_type_id, sub_service_id, service_code, discount_ex_vat, original_discount_value, original_discount_ex_vat) — 2026-05-26 |
| SC-APPLY-004 | QLCS fail → success=false, unchanged | VOUCHER-APPLY | DOC-VOUCHER-02 | P1 | Negative | ✅ Đã tạo |
| SC-APPLY-005 | Có A, apply B fail → A vẫn giữ | VOUCHER-APPLY | DOC-VOUCHER-02 | P1 | Negative | ✅ Đã tạo |
| SC-APPLY-006 | Apply thêm → CO gửi [A+B] sang QLCS | VOUCHER-APPLY | DOC-VOUCHER-02 | P2 | Integration | ✅ Đã tạo |
| SC-CANCEL-001 | Hủy → Promotion=[], giá gốc | VOUCHER-CANCEL | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-CANCEL-002 | newOrderTotal = giá gốc exact | VOUCHER-CANCEL | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-CANCEL-003 | CO không gọi QLCS khi cancel | VOUCHER-CANCEL | DOC-VOUCHER-02 | P2 | Functional | ✅ Đã tạo |
| SC-CANCEL-004 | Cancel khi rỗng → graceful | VOUCHER-CANCEL | DOC-VOUCHER-02 | P2 | Negative | 🚫 Blocked — CLA-VOUCHER-006 |
| SC-RECHECK-001 | result=1 → order OK | VOUCHER-RECHECK | DOC-VOUCHER-02 | P1 | Integration | ✅ Đã tạo |
| SC-RECHECK-002 | result=0 → remove, giá gốc | VOUCHER-RECHECK | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-RECHECK-003 | result=-1 → giữ, lỗi hệ thống | VOUCHER-RECHECK | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-001 | Auto-apply DiscountVAT cao nhất | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-002 | GetListEvoucher rỗng → không apply | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Negative | ✅ Đã tạo |
| SC-AUTO-003 | Recheck fail → không apply | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Negative | ✅ Đã tạo |
| SC-AUTO-004 | Chỉ apply 1 voucher tốt nhất | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-005 | Context change, hasManual=false → re-apply | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-006 | Voucher mới sau re-apply khác cũ | VOUCHER-AUTO | DOC-VOUCHER-01 | P2 | Functional | ✅ Đã tạo |
| SC-AUTO-007 | Context mới không có voucher → giá gốc | VOUCHER-AUTO | DOC-VOUCHER-01 | P2 | Negative | ✅ Đã tạo |
| SC-AUTO-008 | hasManual=true → không auto-apply | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-009 | FE apply lại, voucher valid → giữ | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-010 | FE apply lại, voucher invalid → remove + notify | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-011 | Không tự apply thay thế voucher bị remove | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-012 | User bỏ voucher → không re-apply | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-013 | Bỏ manual → auto vẫn giữ | VOUCHER-AUTO | DOC-VOUCHER-01 | P2 | Functional | ✅ Đã tạo |
| SC-AUTO-014 | Bỏ xong đổi context → không auto-apply | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-015 | Chỉ revalidate manual, không apply auto | VOUCHER-AUTO | DOC-VOUCHER-01 | P1 | Functional | ✅ Đã tạo |
| SC-AUTO-016 | Giữ manual còn valid | VOUCHER-AUTO | DOC-VOUCHER-01 | P2 | Functional | ✅ Đã tạo |
| SC-AUTO-017 | Remove manual invalid + notify | VOUCHER-AUTO | DOC-VOUCHER-01 | P2 | Negative | ✅ Đã tạo |
| SC-API-001 | Thiếu X-Checkout-Token | VOUCHER-API | DOC-VOUCHER-06 | P1 | Security | ✅ Đã tạo |
| SC-API-002 | X-Checkout-Token sai | VOUCHER-API | DOC-VOUCHER-06 | P1 | Security | ✅ Đã tạo |
| SC-API-003 | X-Checkout-Token hết hạn | VOUCHER-API | DOC-VOUCHER-06 | P1 | Security | ✅ Đã tạo |
| SC-API-004 | Thiếu Authorization | VOUCHER-API | DOC-VOUCHER-06 | P1 | Security | ✅ Đã tạo |
| SC-API-005 | Authorization Bearer sai | VOUCHER-API | DOC-VOUCHER-06 | P1 | Security | ✅ Đã tạo |
| SC-API-006 | Authorization Bearer hết hạn | VOUCHER-API | DOC-VOUCHER-06 | P1 | Security | ✅ Đã tạo |
| SC-API-007 | Client-Id không bắt buộc | VOUCHER-API | DOC-VOUCHER-06 | P2 | Functional | ✅ Đã tạo |
| SC-AUTO-UI-001 | Auto-apply thành công → UI hiển thị success msg + code + discount | VOUCHER-AUTO-UI | DOC-VOUCHER-08 image4+image5 | P1 | UI | ✅ Đã tạo — TC_VOU.1 |
| SC-AUTO-UI-002 | Không có EVC → không auto-apply, UI im lặng | VOUCHER-AUTO-UI | DOC-VOUCHER-08 + DOC-VOUCHER-01 UC1 | P1 | Negative / UI | ✅ Đã tạo — TC_VOU.2 |
| SC-AUTO-UI-003 | Badge "Chọn ưu đãi" hiển thị đúng count | VOUCHER-AUTO-UI | DOC-VOUCHER-08 image4 | P2 | UI | 🔄 Partial — TC_VOU.3 (BLOCKED CLA-AUTO-003: badge khi N=0) |
| SC-AUTO-UI-004 | Đổi gói/PTTT → UI cập nhật voucher mới hoặc giá gốc | VOUCHER-AUTO-UI | DOC-VOUCHER-08 image3 + DOC-VOUCHER-01 UC2 | P1 | UI / Integration | ✅ Đã tạo — TC_VOU.4 |
| SC-AUTO-UI-005 | Apply call có source="auto" khi CO auto-apply | VOUCHER-AUTO-UI | DOC-VOUCHER-08 image2 | P2 | Functional | 🚫 Blocked — TC_VOU.6 (CLA-AUTO-001: source field spec) |
| SC-AUTO-UI-006 | Voucher bị remove → UI thông báo tiếng Việt + reset giá | VOUCHER-AUTO-UI | DOC-VOUCHER-08 + DOC-VOUCHER-01 UC3+UC5 | P1 | Negative / UI | ✅ Đã tạo — TC_VOU.5 |
| SC-UI-001 | Màn Checkout load → box CTKM count auto-show | VOUCHER-UI | DOC-VOUCHER-07 sequence + URD US02 | P1 | Functional | ✅ Đã tạo — TC_VOU.7 |
| SC-UI-002 | Không có EVC → box CTKM ẩn/disabled | VOUCHER-UI | DOC-VOUCHER-07 + URD US02 | P2 | Functional | ✅ Đã tạo — TC_VOU.8 |
| SC-UI-003 | Bấm mở box CTKM → popup từ cache, không call API | VOUCHER-UI | DOC-VOUCHER-07 + URD US02 | P1 | Functional | ✅ Đã tạo — TC_VOU.9 |
| SC-UI-004 | Chọn EVC → bấm "Đồng ý" → UI cập nhật giá | VOUCHER-UI | DOC-VOUCHER-07 + URD US04 | P1 | Functional | ✅ Đã tạo — TC_VOU.10 |
| SC-UI-005 | Apply fail → UI báo lỗi tiếng Việt, giá không đổi | VOUCHER-UI | DOC-VOUCHER-07 + URD US04 | P1 | Negative | ✅ Đã tạo — TC_VOU.11 |
| SC-UI-006 | Bấm "Điều kiện" → popup chi tiết Content1-6 | VOUCHER-UI | DOC-VOUCHER-07 + URD US03 | P1 | Functional | ✅ Đã tạo — TC_VOU.13 |
| SC-UI-007 | EVC không có content → "Không có thông tin điều kiện" | VOUCHER-UI | DOC-VOUCHER-07 + URD US03 | P2 | Negative | ✅ Đã tạo — TC_VOU.14 |
| SC-UI-008 | Đóng popup → quay lại Checkout, trạng thái giữ nguyên | VOUCHER-UI | DOC-VOUCHER-07 + URD US02 | P2 | Functional | ✅ Đã tạo — TC_VOU.15 |
| SC-UI-009 | Hủy EVC → UI reset giá gốc | VOUCHER-UI | DOC-VOUCHER-07 + URD US05 | P1 | Functional | ✅ Đã tạo — TC_VOU.12 |
| SC-UI-010 | Đổi gói/PTTT khi đã apply → UI tự revalidate | VOUCHER-UI | DOC-VOUCHER-07 + URD US04c | P1 | Integration | ✅ Đã tạo — TC_VOU.16 |
| SC-UI-011 | Bấm "Thanh toán", voucher hết quota → notify + giá gốc | VOUCHER-UI | DOC-VOUCHER-07 + URD US06 | P1 | Integration | ✅ Đã tạo — TC_VOU.17 |
| SC-UI-012 | Bấm "Thanh toán", QLCS lỗi → notify, checkout giữ nguyên | VOUCHER-UI | DOC-VOUCHER-07 + URD US06 | P2 | Negative | ✅ Đã tạo — TC_VOU.18 |

---

## 5. Test Data Summary

> **File:** `02_analyze-requirements/chucnang_Voucher/test_data_catalog.md` — tạo 2026-05-27

| Module/Area | Fields chính | Có boundary? | Ghi chú |
|-------------|-------------|--------------|---------|
| Headers (cả 3 API) | X-Checkout-Token (Y), Authorization (Y), Client-Id (N), Content-Type | Có (token sắp hết hạn) | ~~Accept-Language đã bỏ~~ (CLA-APISPEC-001 Resolved) |
| API_01 response | voucherCode (Y), voucherType (Y,int 1\|2), expiredDate (dd/MM/yyyy), note, description, applyTypeId, promotionTypeId, policyGroupId | Có | expiredDate format boundary; voucherType integer boundary |
| API_02 request | voucher_code (Y, string) | Có (100+ ký tự, XSS, SQL injection) | Security boundary cases |
| API_02 response | voucher_code (Y) + Content1-Content6 (6 nội dung, tên field thực tế TBD) | TBD | ⚠️ Spec mới từ BA 2026-05-27 — field name cụ thể cần dev confirm |
| API_03 request | vouchers[]\{voucher_code (Y,string), voucher_type (Y,string "General")\} | Có (array rỗng []) | ⚠️ voucher_type string ≠ voucherType integer API_01 — CLA-APISPEC-002 |
| API_03 response | 17 top-level fields (discount_value/ex_vat/rate, apply_from/to, original_*, etc.) + 10 applies[] sub-fields | Có (≥0, dismonth 0=1 lần, is_deduct_order 0\|1) | Khác API_02 (CLA-APISPEC-003 Resolved) |

---

## 5.1 API Output Requirements — ⭐ BẮT BUỘC CÓ TRONG TESTCASE

> Đây là các field mà BA yêu cầu trong output API. Test case phải validate từng field.

### API_01 — POST /public/v1/voucher/list — Output mỗi item trong data[]

| Field | Required | Type | Constraint | Source |
|-------|----------|------|-----------|--------|
| `voucherCode` | **Y** | string | non-null; client phải lưu lại để apply | DOC-VOUCHER-03 / DOC-VOUCHER-02 US-02 §4 |
| `voucherType` | **Y** | integer | chỉ nhận giá trị 1 hoặc 2; client phải lưu lại | DOC-VOUCHER-03 / DOC-VOUCHER-02 US-02 §4 |
| `description` | N | string | Mô tả nội dung CTKM | DOC-VOUCHER-02 US-02 §4 |
| `note` | N | string | Ghi chú, có thể rỗng | DOC-VOUCHER-02 US-02 §4 |
| `expiredDate` | N | string | Format **dd/MM/yyyy** | DOC-VOUCHER-02 US-02 §4 |
| `applyTypeId` | N | integer | Hình thức áp dụng EVC | DOC-VOUCHER-02 US-02 §4 |
| `promotionTypeId` | N | integer | Loại khuyến mãi | DOC-VOUCHER-02 US-02 §4 |
| `policyGroupId` | N | integer | Nhóm chính sách | DOC-VOUCHER-02 US-02 §4 |

### API_02 — POST /public/v1/voucher/content — Output fields

> ⚠️ **Spec mới (2026-05-27):** BA update Excel — API_02 output **KHÔNG còn** là discount/applies[]. Output thực tế = voucher_code + Content1-Content6.
> TC API_02.25-26 đã viết theo spec cũ → **cần update lại**.
> Tên field JSON thực tế (Content1..Content6) cần confirm với dev.

| Field (BA label) | Required | Type | Constraint | Source |
|-----------------|----------|------|-----------|--------|
| `voucher_code` (Mã voucher) | **Y** | string | non-null | DOC-VOUCHER-04 (updated 2026-05-27) |
| `Content1` | N | string | Nội dung 1 — tên field JSON TBD | DOC-VOUCHER-04 (updated 2026-05-27) |
| `Content2` | N | string | Nội dung 2 — tên field JSON TBD | DOC-VOUCHER-04 (updated 2026-05-27) |
| `Content3` | N | string | Nội dung 3 — tên field JSON TBD | DOC-VOUCHER-04 (updated 2026-05-27) |
| `Content4` | N | string | Nội dung 4 — tên field JSON TBD | DOC-VOUCHER-04 (updated 2026-05-27) |
| `Content5` | N | string | Nội dung 5 — tên field JSON TBD | DOC-VOUCHER-04 (updated 2026-05-27) |
| `Content6` | N | string | Nội dung 6 — tên field JSON TBD | DOC-VOUCHER-04 (updated 2026-05-27) |

### API_03 — POST /public/v1/voucher/apply — Output

> **Khác API_02** (CLA-APISPEC-003 Resolved 2026-05-27). API_03 trả discount/applies[]; API_02 trả Content1-Content6.
> Source: DOC-VOUCHER-05 / DOC-VOUCHER-02 US-04 §4

---

## 6. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |
|---|--------|-----------|--------|--------|--------|--------------|
| CLA-VOUCHER-001 | REQ-DETAIL-001..004 | DOC-VOUCHER-04 vs DOC-VOUCHER-02 | **[Critical]** Excel API_02 `/voucher/content` output = discount/applies[]; URD US-03 endpoint `GET /{checkoutId}/evouchers/{voucherCode}` output = contents[]. Là 2 endpoint khác nhau hay cùng 1? | BA update Excel 2026-05-27: API_02 `/voucher/content` output = Content1-Content6 (align với URD contents[]). Đây là 1 endpoint — POST với voucher_code in body. ⚠️ Tên field JSON Content1-6 cần dev confirm. | **Resolved (partial)** — Output spec đã align; tên field TBD | TC API_02.25-26 cần rewrite — hiện đang dùng discount/applies[] (sai) |
| CLA-VOUCHER-002 | REQ-API-001, REQ-API-002 | DOC-VOUCHER-06 | HTTP code cụ thể cho: thiếu header / sai giá trị / hết hạn (X-Checkout-Token và Authorization) | API trả HTTP 200 cho tất cả trường hợp (kể cả thất bại), kèm message lỗi trong body | **Resolved (partial)** — HTTP code đã xóa khỏi Expected Response toàn bộ TC; chỉ còn kiểm tra message/body | SC-API-001..006 expected response đã cập nhật |
| CLA-VOUCHER-003 | REQ-AUTO-012, REQ-AUTO-014 | DOC-VOUCHER-01 | Cơ chế track "user chủ động bỏ voucher" vs "context remove" — field nào trong model? | | **Open** | SC-AUTO-012, SC-AUTO-014 |
| CLA-VOUCHER-004 | REQ-AUTO-001, REQ-AUTO-004 | DOC-VOUCHER-01 | Tie-breaker khi nhiều voucher cùng DiscountVAT cao nhất: chọn voucher nào? | | **Open** | SC-AUTO-001, SC-AUTO-004 |
| CLA-VOUCHER-005 | REQ-API-003 | DOC-VOUCHER-06 | Client-Id "không bắt buộc" — có ảnh hưởng kết quả API hay chỉ metadata? | | **Open** | SC-API-007 |
| CLA-VOUCHER-006 | REQ-CANCEL-004 | DOC-VOUCHER-02 | `vouchers=[]` khi chưa có voucher: CO trả HTTP 400 hay HTTP 200 graceful? | | **Open** | SC-CANCEL-004 |
| CLA-APISPEC-001 | REQ-API-001..003 | DOC-VOUCHER-03/04/05/06 | `Accept-Language` có trong cURL của cả 3 API nhưng không có rule nào trong sheet "Rule chung cho header". Header này có ảnh hưởng đến response không (ngôn ngữ message lỗi, v.v.)? | BA đã bỏ Accept-Language khỏi cURL mẫu cả 3 API trong Excel cập nhật 2026-05-27. Header không có trong spec. | **Resolved** — Không test Accept-Language | Không ảnh hưởng TC |
| CLA-APISPEC-002 | REQ-DETAIL-001, REQ-APPLY-001 | DOC-VOUCHER-04/05 vs DOC-VOUCHER-03 | `voucher_type` trong request body API_03 có giá trị mẫu là `"General"` (string). Nhưng `voucherType` trong response API_01 là integer 1 hoặc 2. Đây có phải là 2 field khác nhau? Nếu cùng 1 field — "General" map sang integer nào? | Chưa confirm với dev/BA (2026-05-27). Excel cập nhật vẫn dùng `"voucher_type": "General"` string. | **Open — Pending BA/Dev** | SC-APPLY-001, voucher_type input validation |
| CLA-APISPEC-003 | REQ-DETAIL-001..004, REQ-APPLY-001..003 | DOC-VOUCHER-04, DOC-VOUCHER-05 | API_02 (`/content`) và API_03 (`/apply`) có output structure giống hệt nhau (17 top-level fields + applies[] 10 sub-fields). Đây là thiết kế có chủ đích (2 endpoint riêng, cùng schema) hay BA muốn differentiate thêm? | BA update Excel 2026-05-27: API_02 = Content1-Content6; API_03 = discount/applies[]. Hai endpoint có schema **hoàn toàn khác nhau** — thiết kế chủ đích. | **Resolved** | ⚠️ TC API_02.25-26 sai spec cũ — cần rewrite |
| CLA-APISPEC-004 | REQ-API-001..003 | DOC-VOUCHER-03/04/05/06 | Error response structure không được define trong Excel. Khi API fail (auth sai, voucher_code không tồn tại, QLCS lỗi), format response body là gì? (field names: success, errorCode, errorMessage, message, data — hay schema khác?) | Không có thông tin mới trong Excel cập nhật 2026-05-27. | **Open — Cần hỏi BA/Dev** | SC-API-001..006, SC-DETAIL-004..005, SC-APPLY-004..005 |
| CLA-APISPEC-005 | REQ-LIST-001..004 | DOC-VOUCHER-03 | API_01 không có request body. Context (gói, PTTT, địa chỉ) được lấy hoàn toàn từ `X-Checkout-Token` (decode token)? Hay có checkout context khác được đọc từ server-side state (DB)? Câu hỏi ảnh hưởng đến test isolation. | | **Open** | SC-LIST-001..004 |
| CLA-VOUCHER-007 | REQ-LIST-005 | DOC-VOUCHER-07 vs DOC-VOUCHER-02, 03 | **[Conflict Required]** `expiredDate`: DOC-VOUCHER-07 §US02 §4 Required=**Y**; DOC-VOUCHER-02 và Excel Required=N. BA/Dev cần confirm field này có bắt buộc trong response API_01 không. | | **Open — Cần BA confirm** | SC-LIST-005, SC-LIST-006 |
| CLA-VOUCHER-008 | REQ-APPLY-002, REQ-APPLY-003 | DOC-VOUCHER-07 vs DOC-VOUCHER-05 | **[Conflict Required]** `applies[]` sub-fields: DOC-VOUCHER-07 §US04 đánh `service_id`, `discount_ex_vat`, `discount`, `dismonth` là Required=**Y**; Excel DOC-VOUCHER-05 tất cả là N. Cần confirm sub-field nào là bắt buộc trong response apply. | | **Open — Cần BA confirm** | SC-APPLY-003, SC-DETAIL-002 |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|--------|-------------------|---------|------------|------------|---------|
| DOC-VOUCHER-03, 04, 05, 06 | 2026-05-26 | 109 TC (API_01: 28; API_02: 32; API_03: 49) | `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.0.xlsx` | v1.0 (khởi tạo) | API_02 sheet dùng sai output spec contents[] — đã sửa trong lần cập nhật 2026-05-26 |
| DOC-VOUCHER-03, 04, 05, 06 | 2026-05-26 | 109 TC (không thay đổi số lượng) | `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.0.xlsx` | v1.0 (cập nhật) | **Thay đổi:** (1) Xóa HTTP status code khỏi Expected Response toàn bộ 93 TC — API trả 200 cho cả failed cases; (2) API_01.19: bổ sung applyTypeId/promotionTypeId/policyGroupId; (3) API_02.25-28: rewrite từ contents[] sang đúng BA spec (discount/applies[]) — API_02.25 validate 17 top-level fields, API_02.26 validate 10 sub-fields applies[]; (4) API_03.28: bổ sung đủ 17 top-level fields + 10 sub-fields applies[] |
| DOC-VOUCHER-03, 04, 05, 06 | 2026-05-27 | — (không gen TC mới) | `02_analyze-requirements/chucnang_Voucher/test_data_catalog.md` | — | Phân tích sâu api doc v1.xlsx: tạo mới test_data_catalog.md với valid/invalid/boundary data cho headers + 3 API (request + response fields). Bổ sung CLA-APISPEC-001..005 vào §6. |
| DOC-VOUCHER-04 (updated) | 2026-05-27 | **⚠️ TC CẦN UPDATE** | `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.0.xlsx` | v1.0 → **cần v1.1** | BA update Excel: API_02 `/content` output = Content1-Content6 (không còn discount/applies[]). **API_02.25 và API_02.26 hiện sai spec** — cần rewrite sang validate voucher_code + Content1-6. Chờ BA confirm tên field JSON thực tế trước khi update. |
| DOC-VOUCHER-03, 04, 05, 06 | 2026-05-27 | **100 TC** (API_01: 29; API_02: 30; API_03: 41) | `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.1.xlsx` | **v1.1 (gen-testcase-api-v3)** | Tạo mới theo gen-testcase-api-v3 rules: 14 auth TCs/endpoint (3 nhóm: X-Checkout-Token×6, Authorization×6, Client-Id×2); HTTP 200 all cases; 24 SECURITY-INFERRED TCs (amber); API_02 dùng đúng Content1-Content6 spec; Accept-Language đã bỏ (APISPEC-001 Resolved). Open CLAs ghi chú trong TC: APISPEC-002, APISPEC-004, VOUCHER-005, VOUCHER-006. |
| DOC-VOUCHER-07, 08 | 2026-05-27 | **18 TC** (High:12, Medium:6, BLOCKED:2) | `03_test-cases/AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx` | **v1.0 (gen-testcase-webapp)** | TC UI Màn hình Thanh toán: 6 nhóm (Auto-apply, Danh sách EVC, Chọn/Hủy EVC, Điều kiện, Context change, Recheck). Scope: chỉ UI — không clone API TC. 2 TC BLOCKED: TC_VOU.3 (badge N=0 — CLA-AUTO-003), TC_VOU.6 (source="auto" field — CLA-AUTO-001). |
