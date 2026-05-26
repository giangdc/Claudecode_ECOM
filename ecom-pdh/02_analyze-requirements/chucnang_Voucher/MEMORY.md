# MEMORY — Analyze Requirements Output: Chức năng Voucher (EVC Checkout)

> Cập nhật lần cuối: 2026-05-26 — Phân tích lần đầu (Mode 1: INIT)

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

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|--------|-----------|----------|----------------|----|----|----|------------|
| VOUCHER-LIST | DOC-VOUCHER-02, DOC-VOUCHER-03 | 6 | 7 | 4 | 3 | 0 | Medium |
| VOUCHER-DETAIL | DOC-VOUCHER-02, DOC-VOUCHER-04 | 6 | 5 | 4 | 1 | 0 | Medium (blocked CLA-001) |
| VOUCHER-APPLY | DOC-VOUCHER-02, DOC-VOUCHER-05 | 6 | 6 | 5 | 1 | 0 | High |
| VOUCHER-CANCEL | DOC-VOUCHER-02 | 4 | 4 | 2 | 2 | 0 | Medium |
| VOUCHER-RECHECK | DOC-VOUCHER-02 | 3 | 3 | 3 | 0 | 0 | High |
| VOUCHER-AUTO | DOC-VOUCHER-01 | 17 | 17 | 12 | 5 | 0 | High |
| VOUCHER-API | DOC-VOUCHER-06 | 3 | 7 | 6 | 1 | 0 | Medium |
| **TỔNG** | | **45** | **49** | **36** | **13** | **0** | |

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
| SC-LIST-006 | Validate optional fields đầy đủ | VOUCHER-LIST | DOC-VOUCHER-03 | P2 | Functional | ⚠️ Partial — cần bổ sung applyTypeId/promotionTypeId/policyGroupId |
| SC-LIST-007 | Không lẫn EVC kênh khác | VOUCHER-LIST | DOC-VOUCHER-02 | P2 | Functional | ✅ Đã tạo |
| SC-DETAIL-001 | Validate promotion/discount fields | VOUCHER-DETAIL | DOC-VOUCHER-04 | P1 | Functional | 🔄 Cần update — TC cũ dùng sai output spec (contents[] thay vì discount/applies[]) |
| SC-DETAIL-002 | Validate applies[] sub-fields | VOUCHER-DETAIL | DOC-VOUCHER-04 | P1 | Functional | 🔄 Cần update |
| SC-DETAIL-003 | On-demand only | VOUCHER-DETAIL | DOC-VOUCHER-02 | P2 | Functional | ✅ Đã tạo |
| SC-DETAIL-004 | voucher_code invalid → error | VOUCHER-DETAIL | DOC-VOUCHER-02 | P1 | Negative | ✅ Đã tạo |
| SC-DETAIL-005 | Thiếu voucher_code → 400 | VOUCHER-DETAIL | DOC-VOUCHER-04 | P1 | Negative | ✅ Đã tạo |
| SC-APPLY-001 | Apply lần đầu — happy path | VOUCHER-APPLY | DOC-VOUCHER-02 | P1 | Functional | ✅ Đã tạo |
| SC-APPLY-002 | Validate promotion/discount output fields | VOUCHER-APPLY | DOC-VOUCHER-05 | P1 | Functional | ✅ Đã tạo |
| SC-APPLY-003 | Validate applies[] output | VOUCHER-APPLY | DOC-VOUCHER-05 | P1 | Functional | ✅ Đã tạo |
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

---

## 5. API Output Requirements — ⭐ BẮT BUỘC CÓ TRONG TESTCASE

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

### API_02 — POST /public/v1/voucher/content — Top-level output fields

| Field | Required | Type | Constraint | Source |
|-------|----------|------|-----------|--------|
| `promotion_id` | N | string | Mã promotion | DOC-VOUCHER-04 |
| `promotion_title` | N | string | Tiêu đề CTKM | DOC-VOUCHER-04 |
| `voucher_code` | **Y** | string | non-null; Mã EVC | DOC-VOUCHER-04 |
| `referrer_code` | N | string | Mã giới thiệu | DOC-VOUCHER-04 |
| `discount_type` | N | string | Loại giảm giá (vd: Amount) | DOC-VOUCHER-04 |
| `discount_value` | N | number | Tổng giảm **đã VAT** (VNĐ) | DOC-VOUCHER-04 |
| `discount_ex_vat_value` | N | number | Tổng giảm **chưa VAT** (VNĐ) | DOC-VOUCHER-04 |
| `discount_rate` | N | number | Tỷ lệ giảm (%) | DOC-VOUCHER-04 |
| `apply_type` | N | string | Hình thức áp dụng (vd: immediate) | DOC-VOUCHER-04 |
| `apply_from` | N | string | Thời điểm bắt đầu áp dụng | DOC-VOUCHER-04 |
| `apply_to` | N | string | Thời điểm kết thúc áp dụng | DOC-VOUCHER-04 |
| `original_discount_value` | N | number | Giá trị giảm gốc **đã VAT** | DOC-VOUCHER-04 |
| `original_discount_ex_vat` | N | number | Giá trị giảm gốc **chưa VAT** | DOC-VOUCHER-04 |
| `voucher_type` | **Y** | integer | Loại EVC **cấp 1** | DOC-VOUCHER-04 |
| `voucher_type_l2` | N | integer | Loại EVC cấp 2 | DOC-VOUCHER-04 |
| `type_id` | N | integer | ID loại voucher | DOC-VOUCHER-04 |
| `applies[]` | N | array | Danh sách dịch vụ được áp chiết khấu — xem sub-fields bên dưới | DOC-VOUCHER-04 / DOC-VOUCHER-02 US-04 §4 |

### API_02 — applies[] sub-fields

| Sub-field | Required | Type | Constraint | Source |
|-----------|----------|------|-----------|--------|
| `service_id` | N | integer | ID dịch vụ được áp chiết khấu | DOC-VOUCHER-04 |
| `sub_service_type_id` | N | integer | ID loại sub-service | DOC-VOUCHER-04 |
| `sub_service_id` | N | integer | ID sub-service cụ thể | DOC-VOUCHER-04 |
| `service_code` | N | integer | Mã dịch vụ | DOC-VOUCHER-04 |
| `discount_ex_vat` | N | number | Tiền giảm **chưa VAT** | DOC-VOUCHER-04 |
| `discount` | N | number | Tiền giảm **đã VAT** | DOC-VOUCHER-04 |
| `dismonth` | N | integer | Số tháng giảm; **0 = áp 1 lần** | DOC-VOUCHER-04 |
| `is_deduct_order` | N | integer | **1 = khấu trừ thẳng vào tổng đơn** | DOC-VOUCHER-04 |
| `original_discount_value` | N | number | Giá trị giảm gốc **đã VAT** theo dịch vụ | DOC-VOUCHER-04 |
| `original_discount_ex_vat` | N | number | Giá trị giảm gốc **chưa VAT** theo dịch vụ | DOC-VOUCHER-04 |

### API_03 — POST /public/v1/voucher/apply — Output

> **Giống hoàn toàn API_02** (cùng schema top-level fields + applies[] sub-fields)
> Source: DOC-VOUCHER-05 / DOC-VOUCHER-02 US-04 §4

---

## 6. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |
|---|--------|-----------|--------|--------|--------|--------------|
| CLA-VOUCHER-001 | REQ-DETAIL-001..004 | DOC-VOUCHER-04 vs DOC-VOUCHER-02 | **[Critical]** Excel API_02 `/voucher/content` output = discount/applies[]; URD US-03 endpoint `GET /{checkoutId}/evouchers/{voucherCode}` output = contents[]. Là 2 endpoint khác nhau hay cùng 1? | | **Open** | Toàn bộ API_02 TC — SC-DETAIL-001, SC-DETAIL-002 |
| CLA-VOUCHER-002 | REQ-API-001, REQ-API-002 | DOC-VOUCHER-06 | HTTP code cụ thể cho: thiếu header / sai giá trị / hết hạn (X-Checkout-Token và Authorization) | | **Open** | SC-API-001..006 expected response |
| CLA-VOUCHER-003 | REQ-AUTO-012, REQ-AUTO-014 | DOC-VOUCHER-01 | Cơ chế track "user chủ động bỏ voucher" vs "context remove" — field nào trong model? | | **Open** | SC-AUTO-012, SC-AUTO-014 |
| CLA-VOUCHER-004 | REQ-AUTO-001, REQ-AUTO-004 | DOC-VOUCHER-01 | Tie-breaker khi nhiều voucher cùng DiscountVAT cao nhất: chọn voucher nào? | | **Open** | SC-AUTO-001, SC-AUTO-004 |
| CLA-VOUCHER-005 | REQ-API-003 | DOC-VOUCHER-06 | Client-Id "không bắt buộc" — có ảnh hưởng kết quả API hay chỉ metadata? | | **Open** | SC-API-007 |
| CLA-VOUCHER-006 | REQ-CANCEL-004 | DOC-VOUCHER-02 | `vouchers=[]` khi chưa có voucher: CO trả HTTP 400 hay HTTP 200 graceful? | | **Open** | SC-CANCEL-004 |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|--------|-------------------|---------|------------|------------|---------|
| DOC-VOUCHER-03, 04, 05, 06 | 2026-05-26 | 109 TC (API_01: 28; API_02: 32; API_03: 49) | `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.0.xlsx` | v1.0 | ⚠️ API_02 sheet dùng output spec contents[] (URD US-03) — cần update lại theo Excel API_02 spec (discount/applies[]) sau khi resolve CLA-VOUCHER-001 |
