# Requirement Traceability Matrix — chucnang_Voucher (API + UI)

## Tài liệu nguồn

| DOC ID | File | Loại | Phiên bản | Ngày phân tích |
|---|---|---|---|---|
| DOC-VOUCHER-API-01 | ECP_API_voucher_v1.xlsx | API Spec | v1 | 2026-05-28 |
| DOC-VOUCHER-UI-01 | figma_ui_analysis.docx | Figma UI Analysis | 2026-06-09 | 2026-06-10 |

---

## Ma trận truy vết

| Req ID | Mô tả | DOC Source | Nguồn (sheet + section) | Loại | Scenarios | Mức rủi ro |
|---|---|---|---|---|---|---|
| REQ-VOUCHER-API-001 | Lấy danh sách voucher khả dụng cho phiên checkout — POST /public/v1/voucher/list | DOC-VOUCHER-API-01 | Sheet 16_voucher_list | Functional / Integration | SC-VOUCHER-API-001 → 006 | High |
| REQ-VOUCHER-API-002 | Lấy nội dung chi tiết hiển thị voucher (content1..content6) — POST /public/v1/voucher/content | DOC-VOUCHER-API-01 | Sheet 17_voucher_content | Functional | SC-VOUCHER-API-007,009 → 012 | Medium |
| REQ-VOUCHER-API-003 | Áp dụng / gỡ bỏ danh sách voucher vào phiên checkout — POST /public/v1/voucher/apply | DOC-VOUCHER-API-01 | Sheet 18_voucher_apply | Functional / Business Rule | SC-VOUCHER-API-013 → 022 | High |
| REQ-VOUCHER-API-004 | Kiểm tra tính hợp lệ của voucher code — POST /public/v1/voucher/check | DOC-VOUCHER-API-01 | Sheet 19_voucher_check | Functional | SC-VOUCHER-API-023 → 029 | Medium |
| REQ-VOUCHER-API-005 | Authentication chung: X-Checkout-Token bắt buộc cho cả 4 APIs | DOC-VOUCHER-API-01 | Sheets 16-19, HEADERS section | Non-functional / Security | SC-VOUCHER-API-003,009,012,020,025,029 | High |
| REQ-VOUCHER-API-006 | Response structure chuẩn: {success, error, meta, data} cho mọi response | DOC-VOUCHER-API-01 | Sheets 16-19, RESPONSE sections | Non-functional / Contract | SC-VOUCHER-API-030,031 | Medium |
| REQ-VOUCHER-UI-001 | Section "Chọn ưu đãi" hiển thị trong Checkout — link/button trigger mở modal | DOC-VOUCHER-UI-01 | Cart F1 §1.2, Checkout F2 §2.6 | UI | SC-VOUCHER-UI-001 | Medium |
| REQ-VOUCHER-UI-002 | Modal "Chọn ưu đãi" — cấu trúc đầy đủ: title, close, 2 tabs, voucher list, button Xác nhận | DOC-VOUCHER-UI-01 | Modal §4.1, Cases C2/F2-F3 | UI / Functional | SC-VOUCHER-UI-002, 003, 013 | High |
| REQ-VOUCHER-UI-003 | Modal "Chọn ưu đãi" — Empty State khi không có voucher khả dụng | DOC-VOUCHER-UI-01 | Modal §5, Case C3/F4, Note N2 | UI / Functional | SC-VOUCHER-UI-004 | Medium |
| REQ-VOUCHER-UI-004 | Chọn voucher thành công — icon tick xanh, summary cập nhật, hủy chọn | DOC-VOUCHER-UI-01 | Case C4/F5, §4.2 item 6 | Functional / UI | SC-VOUCHER-UI-005, 006, 014 | High |
| REQ-VOUCHER-UI-005 | Màn hình Chi tiết Ưu đãi / Điều khoản — mở từ link "Điều kiện", button "Sử dụng ưu đãi" | DOC-VOUCHER-UI-01 | §6, §6.1, Case C5/C6/F6 | UI / Functional | SC-VOUCHER-UI-007, 008 | Medium |
| REQ-VOUCHER-UI-006 | Hệ thống lọc voucher theo điều kiện đơn hàng (PTTT, dịch vụ) — chỉ hiển thị voucher match | DOC-VOUCHER-UI-01 | Note N1/N3, Case C7, MISSING M01 | Business Rule | SC-VOUCHER-UI-010 | High |
| REQ-VOUCHER-UI-007 | Voucher card trạng thái disabled / đã dùng / hết hạn — UI dimmed, không cho chọn | DOC-VOUCHER-UI-01 | Case C8, MISSING M02 | UI | SC-VOUCHER-UI-012 | Medium |
| REQ-VOUCHER-UI-008 | Xử lý PTTT không match với điều kiện voucher — thông báo hệ thống | DOC-VOUCHER-UI-01 | Note N2/N4, MISSING M04 | Business Rule / Functional | SC-VOUCHER-UI-011 | High |
| REQ-VOUCHER-UI-009 | Mobile — voucher áp dụng hiển thị trong sticky bottom bar | DOC-VOUCHER-UI-01 | §3.6, Case C9/F2/F3/F5 | UI | SC-VOUCHER-UI-009 | Low |

---

## Chi tiết Acceptance Criteria

> HTTP Status Code mapping đã xác nhận (CLARY-001 Resolved):
> - `CHECKOUT_TOKEN_REQUIRED` → **400** (thiếu token)
> - `CHECKOUT_NOT_FOUND` → **400** (checkout không tồn tại)
> - `CHECKOUT_PAYMENT_REQUIRED` → **400** (chưa chọn PTTT)
> - `CHECKOUT_TOKEN_INVALID` → **401** (token sai/hết hạn)
> - `VOUCHER_CODE_REQUIRED_400`, `VOUCHER_INVALID`, `VOUCHER_CODE_DUPLICATE_400`, `VOUCHER_RECHECK_FAILED` → **400**
> - `BUSINESS_INTERNAL_ERROR` → **500**

### REQ-VOUCHER-API-001 — voucher/list

| AC ID | Mô tả | Error Code | Status Code |
|---|---|---|---|
| AC1.1 | Token hợp lệ + checkout tồn tại + đã chọn PTTT → 200, data=array (có thể rỗng) | — | 200 |
| AC1.2 | Thiếu X-Checkout-Token → lỗi CHECKOUT_TOKEN_REQUIRED | CHECKOUT_TOKEN_REQUIRED | 400 |
| AC1.3 | Token không hợp lệ/hết hạn → lỗi CHECKOUT_TOKEN_INVALID | CHECKOUT_TOKEN_INVALID | **401** |
| AC1.4 | Checkout không tồn tại → lỗi CHECKOUT_NOT_FOUND | CHECKOUT_NOT_FOUND | 400 |
| AC1.5 | Chưa chọn hình thức thanh toán → lỗi CHECKOUT_PAYMENT_REQUIRED | CHECKOUT_PAYMENT_REQUIRED | 400 |

### REQ-VOUCHER-API-002 — voucher/content

| AC ID | Mô tả | Error Code | Status Code |
|---|---|---|---|
| AC2.1 | voucher_code Required (min length=1) trong request body | — | — |
| AC2.2 | voucher_code hợp lệ → 200, data object có content1..content6 (nullable) | — | 200 |
| ~~AC2.3~~ | ~~Voucher không có nội dung đăng ký → 200, data=null~~ | — | ~~200~~ |
| | **⚠️ CLARY-004 Resolved:** Case data=null trong response 200 thực tế không tồn tại — xóa khỏi scope | — | — |
| AC2.4 | Thiếu voucher_code → VOUCHER_CODE_REQUIRED_400 | VOUCHER_CODE_REQUIRED_400 | 400 |
| AC2.5 | Thiếu X-Checkout-Token → CHECKOUT_TOKEN_REQUIRED | CHECKOUT_TOKEN_REQUIRED | 400 |
| AC2.6 | Token không hợp lệ/hết hạn → CHECKOUT_TOKEN_INVALID | CHECKOUT_TOKEN_INVALID | **401** |
| AC2.7 | Checkout không tồn tại → CHECKOUT_NOT_FOUND | CHECKOUT_NOT_FOUND | 400 |
| AC2.8 | Voucher không hợp lệ/hết hạn → VOUCHER_INVALID | VOUCHER_INVALID | 400 |

### REQ-VOUCHER-API-003 — voucher/apply

| AC ID | Mô tả | Error Code | Status Code |
|---|---|---|---|
| AC3.1 | Áp dụng 1 hoặc nhiều voucher hợp lệ → 200, data=array of promotions | — | 200 |
| AC3.2 | discount_value = 0 trong response apply (sẽ tính sau calculate) | — | 200 |
| AC3.3 | Gỡ bỏ tất cả voucher: gửi vouchers=[] → 200, data=[] (xem CLARY-002 cho case null) | — | 200 |
| AC3.4 | vouchers[].voucher_code Required (min=1) cho mỗi item | — | — |
| AC3.5 | Mã voucher trùng trong danh sách → VOUCHER_CODE_DUPLICATE_400 | VOUCHER_CODE_DUPLICATE_400 | 400 |
| AC3.6 | Rà soát điều kiện áp dụng thất bại → VOUCHER_RECHECK_FAILED | VOUCHER_RECHECK_FAILED | 400 |
| AC3.7 | Voucher không hợp lệ/hết hạn → VOUCHER_INVALID | VOUCHER_INVALID | 400 |
| AC3.8 | Thiếu checkout token → CHECKOUT_TOKEN_REQUIRED | CHECKOUT_TOKEN_REQUIRED | 400 |
| AC3.9 | Token không hợp lệ/hết hạn → CHECKOUT_TOKEN_INVALID | CHECKOUT_TOKEN_INVALID | **401** |
| AC3.10 | Checkout không tồn tại → CHECKOUT_NOT_FOUND | CHECKOUT_NOT_FOUND | 400 |
| AC3.11 | Chưa chọn hình thức thanh toán → CHECKOUT_PAYMENT_REQUIRED | CHECKOUT_PAYMENT_REQUIRED | 400 |

### REQ-VOUCHER-API-004 — voucher/check

| AC ID | Mô tả | Error Code | Status Code |
|---|---|---|---|
| AC4.1 | voucher_code Required (min=1); voucher_type Optional enum (Unknown/General/Individual) | — | — |
| AC4.2 | Voucher hợp lệ → 200, data.is_valid=true, data.message populated | — | 200 |
| AC4.3 | Voucher không hợp lệ/hết hạn → VOUCHER_INVALID | VOUCHER_INVALID | 400 |
| AC4.4 | Thiếu voucher_code → VOUCHER_CODE_REQUIRED_400 | VOUCHER_CODE_REQUIRED_400 | 400 |
| AC4.5 | Thiếu X-Checkout-Token → CHECKOUT_TOKEN_REQUIRED | CHECKOUT_TOKEN_REQUIRED | 400 |
| AC4.6 | Token không hợp lệ/hết hạn → CHECKOUT_TOKEN_INVALID | CHECKOUT_TOKEN_INVALID | **401** |
| AC4.7 | Checkout không tồn tại → CHECKOUT_NOT_FOUND | CHECKOUT_NOT_FOUND | 400 |
| AC4.8 | voucher_type không khớp với actual type của voucher → VOUCHER_INVALID | VOUCHER_INVALID | **400** |

---

## Clarifications Needed

| # | Req ID | DOC Source | Câu hỏi | Answer | Status | Ngày resolve | Ảnh hưởng TC |
|---|---|---|---|---|---|---|---|
| CLARY-001 | REQ-VOUCHER-API-001..004 | Sheets 16-19, RESPONSE 401 section | HTTP status code mapping chính xác cho từng error code? | CHECKOUT_TOKEN_REQUIRED/CHECKOUT_NOT_FOUND/CHECKOUT_PAYMENT_REQUIRED → 400; CHECKOUT_TOKEN_INVALID → 401; còn lại → 400/500 | **Resolved** | 2026-05-28 | AC tables đã cập nhật |
| CLARY-002 | REQ-VOUCHER-API-003 | Sheet 18_voucher_apply, REQUEST BODY | `vouchers=null` vs `vouchers=[]` — có khác nhau không? | Chưa mô tả trong spec — cần hỏi lại BA | **Pending BA** | — | SC-VOUCHER-API-015 |
| CLARY-003 | REQ-VOUCHER-API-003 | Sheet 18_voucher_apply | Có giới hạn số voucher tối đa trong 1 lần apply không? | Chưa thấy rule tối đa trong spec — note để theo dõi | **Open** | — | Boundary TC cho apply |
| CLARY-004 | REQ-VOUCHER-API-002 | Sheet 17_voucher_content, RESPONSE 200 example "Thành công (Không có nội dung)" | Khi data=null trong response 200 — là nghiệp vụ bình thường hay dữ liệu chưa setup? | Thực tế không có case này — loại khỏi scope | **Resolved** | 2026-05-28 | SC-VOUCHER-API-008 đã xóa khỏi scope |
| CLARY-005 | REQ-VOUCHER-API-004 | Sheet 19_voucher_check | Khi voucher_type không khớp actual type → is_valid=false (200) hay VOUCHER_INVALID (400)? | VOUCHER_INVALID (400) | **Resolved** | 2026-05-28 | SC-VOUCHER-API-027,028 đã cập nhật expected result |
| CLA-FIGMA-001 | REQ-VOUCHER-UI-006 | DOC-VOUCHER-UI-01 §IV MISSING M01 | Quy tắc filter voucher trong modal: điều kiện nào để voucher appear / hidden (PTTT, dịch vụ, KH...)? | Chưa có — cần BA xác nhận | **Open** | — | SC-VOUCHER-UI-010 bị blocked một phần; ảnh hưởng TC positive/negative của modal |
| CLA-FIGMA-002 | REQ-VOUCHER-UI-007 | DOC-VOUCHER-UI-01 §IV MISSING M02 | Voucher state disabled/expired/used — UI thể hiện ra sao? (mờ, text "Đã dùng", strike-through?) | Chưa có — cần Designer/BA xác nhận | **Open** | — | SC-VOUCHER-UI-012 chưa thể viết expected result |
| CLA-FIGMA-003 | REQ-VOUCHER-UI-002 | DOC-VOUCHER-UI-01 §IV MISSING M03 | Giới hạn số voucher KH được chọn: 1 (Radio button) hay nhiều (Checkbox)? | Figma dùng Radio trong 1 số frame, không nhất quán — cần BA confirm | **Open** | — | SC-VOUCHER-UI-002,005: kiểu control chưa xác định; ảnh hưởng TC multi-voucher |
| CLA-FIGMA-004 | REQ-VOUCHER-UI-008 | DOC-VOUCHER-UI-01 §IV MISSING M04, Figma Note N4 | Khi PTTT không match điều kiện voucher (VD: chọn Momo nhưng voucher chỉ áp dụng COD) → hệ thống xử lý thế nào? | Đang open — uConn_Nam (Dev) đã hỏi trong Figma Note N4, chưa có answer | **Open** | — | SC-VOUCHER-UI-011 cần clarify luồng trước khi viết TC |
