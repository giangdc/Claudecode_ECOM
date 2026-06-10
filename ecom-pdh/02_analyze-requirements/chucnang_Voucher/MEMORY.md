# MEMORY — Analyze Requirements Output
> Cập nhật lần cuối: 2026-06-10 — Append DOC-VOUCHER-UI-01 (figma_ui_analysis.docx): +9 UI requirements, +14 UI scenarios, +4 clarifications (CLA-FIGMA-001→004)

---

## 1. Project Overview

- Dự án: ecom-pdh (FPT Telecom ISC/ECP) | Môi trường: Staging | URL: http://ecp-api-stag.fpt.net/ordering
- Module này: Voucher API — 4 endpoints xử lý toàn bộ luồng voucher trong checkout
- Auth pattern: `X-Checkout-Token` header (required cho cả 4 APIs)
- **HTTP Status rule (confirmed):** CHECKOUT_TOKEN_INVALID → **401**; CHECKOUT_TOKEN_REQUIRED / CHECKOUT_NOT_FOUND / CHECKOUT_PAYMENT_REQUIRED → **400**; VOUCHER_INVALID / VOUCHER_CODE_* / VOUCHER_RECHECK_FAILED → **400**; BUSINESS_INTERNAL_ERROR → **500**
- Response structure chuẩn: `{success, error{code,message,details,retryable}, meta{pagination,request_id,trace_id,timestamp}, data}`

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|---|---|---|---|---|---|
| DOC-VOUCHER-API-01 | ECP_API_voucher_v1.xlsx | API Spec | 2026-05-28 | Analyzed | VOUCHER_API (4 endpoints) |
| DOC-VOUCHER-UI-01 | figma_ui_analysis.docx | Figma UI Analysis | 2026-06-10 | Analyzed | VOUCHER_UI (6 frames, 10 cases, 4 Figma notes) |

---

## 3. Module Summary

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|---|---|---|---|---|---|---|---|
| VOUCHER_API — voucher/list | DOC-VOUCHER-API-01 | 1 (REQ-001) | 6 | 2 | 4 | 0 | High |
| VOUCHER_API — voucher/content | DOC-VOUCHER-API-01 | 1 (REQ-002) | 5 | 1 | 4 | 0 | Medium |
| VOUCHER_API — voucher/apply | DOC-VOUCHER-API-01 | 1 (REQ-003) | 10 | 4 | 6 | 0 | High |
| VOUCHER_API — voucher/check | DOC-VOUCHER-API-01 | 1 (REQ-004) | 7 | 3 | 4 | 0 | Medium |
| VOUCHER_API — Cross-cutting Auth | DOC-VOUCHER-API-01 | 1 (REQ-005) | — | — | — | — | High |
| VOUCHER_API — Response Contract | DOC-VOUCHER-API-01 | 1 (REQ-006) | 4 | 1 | 1 | 2 | Medium |
| **TOTAL API** | | **6** | **32** | **13** | **16** | **3** | |
| VOUCHER_UI — Modal Chọn ưu đãi (list + empty) | DOC-VOUCHER-UI-01 | 3 (REQ-UI-002,003,006) | 6 | 3 | 3 | 0 | High |
| VOUCHER_UI — Chọn + Áp dụng voucher | DOC-VOUCHER-UI-01 | 2 (REQ-UI-001,004) | 4 | 3 | 1 | 0 | High |
| VOUCHER_UI — Chi tiết Điều khoản | DOC-VOUCHER-UI-01 | 1 (REQ-UI-005) | 2 | 2 | 0 | 0 | Medium |
| VOUCHER_UI — PTTT mismatch + disabled state | DOC-VOUCHER-UI-01 | 2 (REQ-UI-007,008) | 2 | 0 | 2 | 0 | High |
| VOUCHER_UI — Mobile sticky bar | DOC-VOUCHER-UI-01 | 1 (REQ-UI-009) | 1 | 0 | 1 | 0 | Low |
| **TOTAL UI** | | **9** | **14** (⚠️ 3 partial block) | **8** | **6** | **0** | |

---

## 4. Scenario Index

| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
|---|---|---|---|---|---|---|
| SC-VOUCHER-API-001 | list — có voucher khả dụng | voucher/list | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-002 | list — danh sách rỗng | voucher/list | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-003 | list — thiếu checkout token → 400 | voucher/list | DOC-VOUCHER-API-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-004 | list — token không hợp lệ → **401** | voucher/list | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-005 | list — checkout không tồn tại → 400 | voucher/list | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-006 | list — chưa chọn PTTT → 400 | voucher/list | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-007 | content — thành công có content | voucher/content | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| ~~SC-VOUCHER-API-008~~ | ~~content — data=null~~ | voucher/content | DOC-VOUCHER-API-01 | — | — | 🚫 Removed (CLARY-004: case không tồn tại) |
| SC-VOUCHER-API-009 | content — thiếu voucher_code → 400 | voucher/content | DOC-VOUCHER-API-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-010 | content — voucher_code rỗng (boundary) | voucher/content | DOC-VOUCHER-API-01 | P2 | Boundary | ⏳ Chưa tạo |
| SC-VOUCHER-API-011 | content — voucher không hợp lệ → 400 | voucher/content | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-012 | content — token không hợp lệ → **401** | voucher/content | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-013 | apply — 1 voucher General thành công | voucher/apply | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-014 | apply — nhiều voucher cùng lúc | voucher/apply | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-015 | apply — gỡ bỏ tất cả (empty array) ⚠️CLARY-002 | voucher/apply | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-016 | apply — discount_value=0 rule | voucher/apply | DOC-VOUCHER-API-01 | P1 | Business Rule | ⏳ Chưa tạo |
| SC-VOUCHER-API-017 | apply — mã voucher trùng lặp → 400 | voucher/apply | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-018 | apply — recheck failed → 400 | voucher/apply | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-019 | apply — voucher không hợp lệ → 400 | voucher/apply | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-020 | apply — thiếu checkout token → 400 | voucher/apply | DOC-VOUCHER-API-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-021 | apply — chưa chọn PTTT → 400 | voucher/apply | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-022 | apply — thiếu voucher_code trong item → 400 | voucher/apply | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-023 | check — is_valid=true | voucher/check | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-024 | check — VOUCHER_INVALID → 400 | voucher/check | DOC-VOUCHER-API-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-025 | check — thiếu voucher_code → 400 | voucher/check | DOC-VOUCHER-API-01 | P1 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-026 | check — voucher_code rỗng (boundary) | voucher/check | DOC-VOUCHER-API-01 | P2 | Boundary | ⏳ Chưa tạo |
| SC-VOUCHER-API-027 | check — type=General mismatch → VOUCHER_INVALID 400 | voucher/check | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-028 | check — type=Individual mismatch → VOUCHER_INVALID 400 | voucher/check | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-029 | check — token không hợp lệ → **401** | voucher/check | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-030 | response structure — success case | Cross-API | DOC-VOUCHER-API-01 | P1 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-031 | response structure — error case | Cross-API | DOC-VOUCHER-API-01 | P2 | Negative | ⏳ Chưa tạo |
| SC-VOUCHER-API-032 | Accept-Language vi vs en | Cross-API | DOC-VOUCHER-API-01 | P3 | Functional | ⏳ Chưa tạo |
| SC-VOUCHER-API-033 | BUSINESS_INTERNAL_ERROR → 500 | Cross-API | DOC-VOUCHER-API-01 | P3 | Error Handling | ⏳ Chưa tạo |
| SC-VOUCHER-UI-001 | Section Chọn ưu đãi — default state | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | UI | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-002 | Modal Chọn ưu đãi — cấu trúc đầy đủ | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | UI/Functional | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-003 | Voucher card — hiển thị đúng thông tin | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | UI | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-004 | Modal — Empty State (không có voucher) | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | UI/Functional | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-005 | Chọn voucher — icon tick xanh | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | Functional | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-006 | Áp dụng voucher — summary cập nhật | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | Functional | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-007 | Xem Chi tiết Ưu đãi / Điều khoản | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | UI | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-008 | Áp dụng từ màn hình Chi tiết | VOUCHER_UI | DOC-VOUCHER-UI-01 | P1 | Functional | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-009 | Mobile — sticky bottom bar | VOUCHER_UI | DOC-VOUCHER-UI-01 | P2 | UI | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-010 | Lọc voucher theo điều kiện đơn hàng | VOUCHER_UI | DOC-VOUCHER-UI-01 | P2 | Functional | 🚫 Partial block (CLA-FIGMA-001) |
| SC-VOUCHER-UI-011 | PTTT mismatch — thông báo hệ thống | VOUCHER_UI | DOC-VOUCHER-UI-01 | P2 | Functional | 🚫 Blocked (CLA-FIGMA-004) |
| SC-VOUCHER-UI-012 | Voucher card disabled/đã dùng/hết hạn | VOUCHER_UI | DOC-VOUCHER-UI-01 | P2 | UI | 🚫 Partial block (CLA-FIGMA-002) |
| SC-VOUCHER-UI-013 | Đóng modal — giữ nguyên trạng thái | VOUCHER_UI | DOC-VOUCHER-UI-01 | P2 | Functional | ✅ Đã tạo (TC_VOU) |
| SC-VOUCHER-UI-014 | Hủy chọn voucher đã áp dụng | VOUCHER_UI | DOC-VOUCHER-UI-01 | P2 | Functional | ✅ Đã tạo (TC_VOU) |

> Chi tiết Given/When/Then → xem `test_scenario_map.md`

---

## 5. Test Data Summary

*(Không tạo test_data_catalog.md — user tự nhập khi execute)*

Key fields cần chuẩn bị khi execute:
- `X-Checkout-Token` hợp lệ: token từ phiên checkout staging đã chọn PTTT
- `X-Checkout-Token` không hợp lệ: chuỗi random / token hết hạn → expect **401**
- `X-Checkout-Token` thiếu hoàn toàn → expect **400** CHECKOUT_TOKEN_REQUIRED
- `voucher_code` General hợp lệ, Individual hợp lệ, đã hết hạn, không tồn tại, empty string
- Checkout session: 1 đã chọn PTTT, 1 chưa chọn PTTT

---

## 6. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |
|---|---|---|---|---|---|---|
| CLARY-001 | REQ-VOUCHER-API-001..004 | Sheets 16-19, RESPONSE 401 | HTTP 400 vs 401 mapping | Missing/NotFound/NoPayment → 400; TokenInvalid → 401; các lỗi khác → 400/500 | **Resolved** 2026-05-28 | AC tables + scenarios đã cập nhật |
| CLARY-002 | REQ-VOUCHER-API-003 | Sheet 18 | `vouchers=null` vs `vouchers=[]` có khác nhau? | Chưa có mô tả — cần hỏi lại BA | **Pending BA** | SC-VOUCHER-API-015 (gắn cờ ⚠️) |
| CLARY-003 | REQ-VOUCHER-API-003 | Sheet 18 | Giới hạn số voucher tối đa trong 1 lần apply? | Chưa có rule tối đa trong spec | **Open** | Boundary TC apply (tạm bỏ qua) |
| CLARY-004 | REQ-VOUCHER-API-002 | Sheet 17 | data=null trong response 200 là gì? | Thực tế không có case này | **Resolved** 2026-05-28 | SC-008 đã xóa khỏi scope |
| CLARY-005 | REQ-VOUCHER-API-004 | Sheet 19 | voucher_type mismatch → is_valid=false hay VOUCHER_INVALID? | VOUCHER_INVALID (400) | **Resolved** 2026-05-28 | SC-027,028 đã cập nhật |
| CLA-FIGMA-001 | REQ-VOUCHER-UI-006 | DOC-VOUCHER-UI-01 MISSING M01 | Quy tắc filter voucher trong modal — điều kiện nào để voucher appear/hidden? | Chưa có | **Open** ⚠️ High | SC-VOUCHER-UI-010 partial block |
| CLA-FIGMA-002 | REQ-VOUCHER-UI-007 | DOC-VOUCHER-UI-01 MISSING M02 | Voucher disabled/used/expired — UI thể hiện ra sao? | Figma chưa thiết kế state này | **Open** | SC-VOUCHER-UI-012 partial block |
| CLA-FIGMA-003 | REQ-VOUCHER-UI-002 | DOC-VOUCHER-UI-01 MISSING M03 | Giới hạn chọn voucher: 1 (Radio) hay nhiều (Checkbox)? | Figma không nhất quán — cần BA confirm | **Open** ⚠️ High | SC-VOUCHER-UI-002,005 expected result chưa xác định |
| CLA-FIGMA-004 | REQ-VOUCHER-UI-008 | DOC-VOUCHER-UI-01 Note N4, MISSING M04 | PTTT mismatch với voucher (VD: Momo vs COD voucher) → hệ thống xử lý thế nào? | Đang open — Dev uConn_Nam hỏi trong Figma Note N4 | **Open** ⚠️ High | SC-VOUCHER-UI-011 blocked |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|---|---|---|---|---|---|
| DOC-VOUCHER-API-01 | 2026-05-28 | 69 | AI_ISC_ecom-pdh_v1.1_TC_API_v1.2.xlsx | v1.2 | 4 sheets: API_16(14), API_17(15), API_18(22), API_19(18). CLARY-002: SC-018 BLOCKED. gen-testcase-api-v3. |
| DOC-VOUCHER-UI-01 | 2026-06-10 | 11 mới (TC_VOU.20→30) + fix TC_VOU.19 | AI_ISC_ecom-pdh_v1.1_TC_voucher_ui_v1.0.xlsx | v1.0 append | Append vào sheet Voucher_UI_Checkout. Nhóm 7: 8 TCs ready (High:5 Medium:3), 3 BLOCKED (CLA-FIGMA-001,002,004). Auto?=Y cho 10 TCs, N cho TC_VOU.23 (visual check). |
