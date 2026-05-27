# Test Data Catalog — Chức năng Voucher API (EVC Checkout)

> Tạo từ: api doc v1.xlsx (DOC-VOUCHER-03/04/05/06)  
> Ngày tạo: 2026-05-27

---

## PHẦN 1 — HEADERS (áp dụng cho cả 3 API)

| Field | Data Type | DOC Source | Required | Ràng buộc BA (từ Excel) | Valid | Invalid | Boundary |
|-------|-----------|-----------|----------|------------------------|-------|---------|----------|
| `X-Checkout-Token` | string | DOC-VOUCHER-06 | **BẮT BUỘC** | Thiếu → báo lỗi user, không hiển thị voucher; Sai → "không lấy được voucher"; Hết hạn → báo lỗi | Token hợp lệ còn hiệu lực | Không truyền; Chuỗi rỗng; Chuỗi random; Token expired | Token sắp hết hạn (< 1 phút) |
| `Authorization` | string | DOC-VOUCHER-06 | **BẮT BUỘC** | Format: `Bearer <token>`; Thiếu → báo lỗi; Sai → "không lấy được voucher"; Hết hạn → báo lỗi | `Bearer <valid_jwt>` | Không truyền; `Bearer`; `Bearer invalid_token`; Bearer token expired; Token không có chữ ký | Bearer token sắp hết hạn |
| `Client-Id` | string | DOC-VOUCHER-06 | Không bắt buộc | Không có rule cụ thể | Bất kỳ string hợp lệ hoặc không truyền | — | — |
| `Accept-Language` | string | DOC-VOUCHER-03/04/05 | Không rõ | ⚠️ Có trong cURL nhưng không có rule nào (CLA-APISPEC-001) | `vi`, `en` | — | — |
| `Content-Type` | string | DOC-VOUCHER-04/05 | Bắt buộc (API_02, API_03) | `application/json` | `application/json` | Không truyền; `text/plain`; `application/xml` | — |

---

## PHẦN 2 — API_01: POST /public/v1/voucher/list

### 2.1 Request

> **Không có request body** — toàn bộ context lấy từ X-Checkout-Token

| Field | Data Type | DOC Source | Required | Ràng buộc | Valid | Invalid | Boundary |
|-------|-----------|-----------|----------|-----------|-------|---------|----------|
| *(No body)* | — | DOC-VOUCHER-03 | — | API lấy context từ checkout token | — | Body có thêm field lạ → server ignore? (CLA-APISPEC-004) | — |

### 2.2 Response — mỗi item trong `data[]`

| Field | Data Type | DOC Source | Required | Ràng buộc BA | Mô tả BA | Valid | Invalid / Null-check |
|-------|-----------|-----------|----------|-------------|---------|-------|---------------------|
| `voucherCode` | string | DOC-VOUCHER-03 | **Y** ⚠️ | Client cần lưu lại để dùng khi apply | Mã EVC | Non-null, non-empty string | null / "" → TC fail |
| `description` | string | DOC-VOUCHER-03 | N | Có thể null | Mô tả nội dung khuyến mãi | String hoặc null | null → OK |
| `note` | string | DOC-VOUCHER-03 | N | Có thể rỗng; **Mapping: Note** (field "Note" từ QLCS) | Ghi chú | String, "", hoặc null | — |
| `expiredDate` | string | DOC-VOUCHER-03 | N | **Format: dd/MM/yyyy** | Ngày hết hạn voucher | "31/12/2026" | "2026-12-31"; "31-12-2026"; null → hiển thị "không có hạn" |
| `voucherType` | integer | DOC-VOUCHER-03 | **Y** ⚠️ | Chỉ nhận `1` hoặc `2`; Client phải lưu lại — bắt buộc khi apply | Loại EVC | 1 hoặc 2 | null; 0; 3; -1; string "General" |
| `applyTypeId` | integer | DOC-VOUCHER-03 | N | Hình thức áp dụng EVC | — | Integer | null → OK |
| `promotionTypeId` | integer | DOC-VOUCHER-03 | N | Loại khuyến mãi | — | Integer | null → OK |
| `policyGroupId` | integer | DOC-VOUCHER-03 | N | Nhóm chính sách | — | Integer | null → OK |

---

## PHẦN 3 — API_02: POST /public/v1/voucher/content

### 3.1 Request Body

| Field | Data Type | DOC Source | Required | Ràng buộc | Valid | Invalid | Boundary |
|-------|-----------|-----------|----------|-----------|-------|---------|----------|
| `voucher_code` | string | DOC-VOUCHER-04 | **Y** | Non-null, non-empty; Ví dụ: "CA21060100KTHIETBIKHOFG039" | `"CA21060100KTHIETBIKHOFG039"` | Không có field; `""`; `null`; Chuỗi không tồn tại trong QLCS | Chuỗi 100+ ký tự; ký tự đặc biệt; XSS payload; SQL injection |

### 3.2 Response — top-level fields

| Field | Data Type | DOC Source | Required | Ràng buộc BA | Mô tả BA | Valid | Null-check |
|-------|-----------|-----------|----------|-------------|---------|-------|-----------|
| `promotion_id` | string | DOC-VOUCHER-04 | N | — | Mã promotion | String hoặc null | null → OK |
| `promotion_title` | string | DOC-VOUCHER-04 | N | — | Tiêu đề chương trình khuyến mãi | String hoặc null | null → OK |
| `voucher_code` | string | DOC-VOUCHER-04 | **Y** | Non-null; phải khớp input | Mã EVC | String non-null | null → TC fail |
| `referrer_code` | string | DOC-VOUCHER-04 | N | — | Mã giới thiệu | String hoặc null | null → OK |
| `discount_type` | string | DOC-VOUCHER-04 | N | Ví dụ: **"Amount"** | Loại giảm giá | "Amount" | null → OK |
| `discount_value` | number | DOC-VOUCHER-04 | N | Số tiền giảm **đã bao gồm VAT** (VNĐ); ≥ 0 | Tổng giá trị giảm đã VAT | 100000 | null; -1; "100000" (string) |
| `discount_ex_vat_value` | number | DOC-VOUCHER-04 | N | Số tiền giảm **chưa bao gồm VAT** (VNĐ); ≥ 0 | Tổng giá trị giảm chưa VAT | 90909 | null; -1 |
| `discount_rate` | number | DOC-VOUCHER-04 | N | Tỷ lệ % | Tỷ lệ giảm giá | 10.5 | null; -1; 101 |
| `apply_type` | string | DOC-VOUCHER-04 | N | Ví dụ: **"immediate"** | Hình thức áp dụng | "immediate" | null → OK |
| `apply_from` | string | DOC-VOUCHER-04 | N | Datetime string | Thời điểm bắt đầu áp dụng | "2026-01-01T00:00:00" | null → OK |
| `apply_to` | string | DOC-VOUCHER-04 | N | Datetime string | Thời điểm kết thúc áp dụng | "2026-12-31T23:59:59" | null → OK |
| `original_discount_value` | number | DOC-VOUCHER-04 | N | Giá trị gốc **đã VAT**; ≥ 0 | Tổng giá trị giảm gốc đã VAT | 120000 | null → OK |
| `original_discount_ex_vat` | number | DOC-VOUCHER-04 | N | Giá trị gốc **chưa VAT**; ≥ 0 | Tổng giá trị giảm gốc chưa VAT | 109090 | null → OK |
| `voucher_type` | integer | DOC-VOUCHER-04 | **Y** | Loại EVC **cấp 1**; non-null | Loại EVC cấp 1 | 1; 2 | null → TC fail |
| `voucher_type_l2` | integer | DOC-VOUCHER-04 | N | Loại EVC cấp 2 | Loại EVC cấp 2 | Integer | null → OK |
| `type_id` | integer | DOC-VOUCHER-04 | N | ID loại voucher | ID loại voucher | Integer | null → OK |
| `applies` | array | DOC-VOUCHER-04 | N | Array of sub-objects; có thể rỗng [] | Danh sách dịch vụ áp chiết khấu | [...] | null; [] → cả 2 cần handle |

### 3.3 Response — `applies[]` sub-fields

| Field | Data Type | DOC Source | Required | Ràng buộc BA | Mô tả BA | Valid | Null-check |
|-------|-----------|-----------|----------|-------------|---------|-------|-----------|
| `service_id` | integer | DOC-VOUCHER-04 | N | ID dịch vụ được áp chiết khấu | — | Integer | null → OK |
| `sub_service_type_id` | integer | DOC-VOUCHER-04 | N | ID loại sub-service | — | Integer | null → OK |
| `sub_service_id` | integer | DOC-VOUCHER-04 | N | ID sub-service cụ thể | — | Integer | null → OK |
| `service_code` | integer | DOC-VOUCHER-04 | N | Mã dịch vụ | — | Integer | null → OK |
| `discount_ex_vat` | number | DOC-VOUCHER-04 | N | Tiền giảm **chưa VAT** theo dịch vụ; ≥ 0 | — | 45454 | null → OK; -1 → TC fail |
| `discount` | number | DOC-VOUCHER-04 | N | Tiền giảm **đã VAT** theo dịch vụ; ≥ 0 | — | 50000 | null → OK; -1 → TC fail |
| `dismonth` | integer | DOC-VOUCHER-04 | N | **0 = áp 1 lần**; > 0 = số tháng áp dụng | Số tháng giảm | 0; 1; 3; 6; 12 | null → OK; -1 |
| `is_deduct_order` | integer | DOC-VOUCHER-04 | N | **1 = khấu trừ thẳng vào tổng đơn**; 0 = không | — | 0; 1 | null → OK; 2 (out of range) |
| `original_discount_value` | number | DOC-VOUCHER-04 | N | Giá trị giảm gốc **đã VAT** theo dịch vụ | — | 55000 | null → OK |
| `original_discount_ex_vat` | number | DOC-VOUCHER-04 | N | Giá trị giảm gốc **chưa VAT** theo dịch vụ | — | 50000 | null → OK |

---

## PHẦN 4 — API_03: POST /public/v1/voucher/apply

### 4.1 Request Body

| Field | Level | Data Type | DOC Source | Required | Ràng buộc | Valid | Invalid | Boundary |
|-------|-------|-----------|-----------|----------|-----------|-------|---------|----------|
| `vouchers` | root | array | DOC-VOUCHER-05 | **Y** | Non-null; mỗi item có voucher_code + voucher_type | `[{...}]` | Không có field; `null` | `[]` rỗng → UC-05 cancel |
| `voucher_code` | item | string | DOC-VOUCHER-05 | **Y** per item | Non-null, non-empty; Ví dụ: "CA21060100KTHIETBIKHOFG039" | Valid code | `""`; `null`; code không tồn tại | Code 100+ ký tự |
| `voucher_type` | item | string | DOC-VOUCHER-05 | **Y** per item | ⚠️ **Giá trị mẫu: "General"** (string, khác với `voucherType` integer trong API_01 response) — CLA-APISPEC-002 | `"General"` | `""`; `null`; integer `1` | — |

> ⚠️ **Quan trọng**: `voucher_type` trong request body là **string** ("General"), nhưng `voucherType` trong API_01 response là **integer** (1 hoặc 2). Cần confirm với BA/Dev đây là 2 field khác nhau hay mapping thế nào. → CLA-APISPEC-002

### 4.2 Response — top-level fields

> **Giống hoàn toàn API_02** — xem Phần 3.2

### 4.3 Response — `applies[]` sub-fields

> **Giống hoàn toàn API_02** — xem Phần 3.3

---

## PHẦN 5 — Test Accounts cần chuẩn bị

| Vai trò | Mục đích | Scenarios |
|---------|---------|-----------|
| User có 3–5 EVC active, DiscountVAT khác nhau | Test auto-apply chọn voucher tốt nhất | SC-AUTO-001, SC-AUTO-004 |
| User có EVC đã hết hạn | Test expiredDate filtering | SC-LIST-001 (negative) |
| User không có EVC nào | Test result=0, data=[] | SC-LIST-004 |
| User có EVC của kênh khác | Test không lẫn kênh | SC-LIST-007 |
| User có EVC valid + EVC invalid theo context | Test apply mixed | SC-AUTO-009, SC-AUTO-010 |

## PHẦN 6 — Test Token cần chuẩn bị

| Loại token | Mục đích | Scenarios |
|-----------|---------|-----------|
| Authorization Bearer valid | Happy path | Tất cả happy path |
| Authorization Bearer expired | Test auth failed | SC-API-006 |
| Authorization Bearer invalid (random string) | Test auth failed | SC-API-005 |
| X-Checkout-Token valid | Happy path | Tất cả happy path |
| X-Checkout-Token expired | Test auth failed | SC-API-003 |
| X-Checkout-Token invalid | Test auth failed | SC-API-002 |
| X-Checkout-Token của checkout khác user | Test cross-user | SC-AUTO-014 |

---

## Clarifications phát sinh từ Excel (mới — bổ sung vào MEMORY.md)

| # | ID | Câu hỏi | Status |
|---|-----|--------|--------|
| 1 | CLA-APISPEC-001 | `Accept-Language` có trong cURL của cả 3 API nhưng không có rule nào trong sheet "Rule chung cho header". Header này có ảnh hưởng gì đến response không? | Open |
| 2 | CLA-APISPEC-002 | `voucher_type` trong request body API_03 có giá trị mẫu là `"General"` (string). Nhưng `voucherType` trong response API_01 là integer 1 hoặc 2. Đây có phải là 2 field khác nhau? "General" map sang integer nào? | Open |
| 3 | CLA-APISPEC-003 | API_02 (`/content`) và API_03 (`/apply`) có output structure giống hệt nhau (26 fields + applies[]). Đây là thiết kế có chủ đích hay BA muốn differentiate thêm gì? | Open |
| 4 | CLA-APISPEC-004 | Error response structure không được define trong Excel. Khi fail, format response trả ra là gì? (HTTP code, body structure, field names) | Open |
| 5 | CLA-APISPEC-005 | API_01 không có request body. Context được lấy hoàn toàn từ `X-Checkout-Token`? Hay có checkout context khác được đọc từ server-side state? | Open |
