# Test Scenario Map — chucnang_Voucher (API + UI)
## Tổng quan: 46 scenarios — API: 32 (P1:13 P2:16 P3:3) | UI: 14 (P1:8 P2:6 P3:0)
> Cập nhật 2026-05-28: xóa SC-008 (CLARY-004 resolved: case data=null không tồn tại); cập nhật HTTP status mapping (CLARY-001); cập nhật SC-027,028 (CLARY-005)
> Cập nhật 2026-06-10: append 14 UI scenarios từ DOC-VOUCHER-UI-01 (figma_ui_analysis.docx)

Base URL: `http://ecp-api-stag.fpt.net/ordering`
Auth: `X-Checkout-Token` header | **401** chỉ khi CHECKOUT_TOKEN_INVALID; còn lại 400

---

## API 16 — POST /public/v1/voucher/list

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-VOUCHER-API-001 | Lấy danh sách voucher — có voucher khả dụng | REQ-VOUCHER-API-001 | Sheet 16 | Có checkout session hợp lệ với X-Checkout-Token, đã chọn hình thức thanh toán, có ít nhất 1 voucher khả dụng | Gửi POST /public/v1/voucher/list với X-Checkout-Token hợp lệ | Trả về 200, success=true, data là array có ít nhất 1 phần tử; mỗi item có đủ fields: voucher_code, description, to_date, voucher_type | P1 | Functional |
| SC-VOUCHER-API-002 | Lấy danh sách voucher — danh sách rỗng | REQ-VOUCHER-API-001 | Sheet 16 | Có checkout session hợp lệ, đã chọn PTTT, nhưng không có voucher khả dụng | Gửi POST /public/v1/voucher/list với X-Checkout-Token hợp lệ | Trả về 200, success=true, data=[] (mảng rỗng) | P1 | Functional |
| SC-VOUCHER-API-003 | Lấy danh sách voucher — thiếu X-Checkout-Token | REQ-VOUCHER-API-001, REQ-VOUCHER-API-005 | Sheet 16 | Không có X-Checkout-Token trong header | Gửi POST /public/v1/voucher/list không kèm header X-Checkout-Token | Trả về **400**, success=false, error.code="CHECKOUT_TOKEN_REQUIRED", data=null | P1 | Negative |
| SC-VOUCHER-API-004 | Lấy danh sách voucher — checkout token không hợp lệ | REQ-VOUCHER-API-001, REQ-VOUCHER-API-005 | Sheet 16 | X-Checkout-Token có giá trị sai định dạng hoặc đã hết hạn | Gửi POST /public/v1/voucher/list với X-Checkout-Token không hợp lệ | Trả về **401**, success=false, error.code="CHECKOUT_TOKEN_INVALID", data=null | P2 | Negative |
| SC-VOUCHER-API-005 | Lấy danh sách voucher — checkout không tồn tại | REQ-VOUCHER-API-001 | Sheet 16 | X-Checkout-Token có giá trị nhưng checkout session đã hết hạn hoặc không tồn tại | Gửi POST /public/v1/voucher/list với token trỏ đến checkout không tồn tại | Trả về **400**, success=false, error.code="CHECKOUT_NOT_FOUND", data=null | P2 | Negative |
| SC-VOUCHER-API-006 | Lấy danh sách voucher — chưa chọn hình thức thanh toán | REQ-VOUCHER-API-001 | Sheet 16 | Checkout session tồn tại nhưng chưa chọn phương thức thanh toán | Gửi POST /public/v1/voucher/list | Trả về **400**, success=false, error.code="CHECKOUT_PAYMENT_REQUIRED", data=null | P2 | Negative |

---

## API 17 — POST /public/v1/voucher/content

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-VOUCHER-API-007 | Lấy nội dung voucher — thành công có đầy đủ content | REQ-VOUCHER-API-002 | Sheet 17 | Checkout session hợp lệ, voucher_code tồn tại và có nội dung đăng ký | Gửi POST /public/v1/voucher/content với voucher_code hợp lệ | Trả về 200, success=true, data.voucher_code khớp input, data.content1..content6 trả về (một số có thể null) | P1 | Functional |
| SC-VOUCHER-API-009 | Lấy nội dung voucher — thiếu voucher_code | REQ-VOUCHER-API-002 | Sheet 17 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/content với body không có trường voucher_code | Trả về **400**, success=false, error.code="VOUCHER_CODE_REQUIRED_400", data=null | P1 | Negative |
| SC-VOUCHER-API-010 | Lấy nội dung voucher — voucher_code rỗng (boundary min=1) | REQ-VOUCHER-API-002 | Sheet 17, REQUEST BODY field min=1 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/content với voucher_code="" (empty string) | Trả về **400**, success=false, error.code="VOUCHER_CODE_REQUIRED_400" hoặc validation error | P2 | Boundary |
| SC-VOUCHER-API-011 | Lấy nội dung voucher — voucher không hợp lệ/hết hạn | REQ-VOUCHER-API-002 | Sheet 17 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/content với voucher_code không hợp lệ hoặc đã hết hạn | Trả về **400**, success=false, error.code="VOUCHER_INVALID", data=null | P2 | Negative |
| SC-VOUCHER-API-012 | Lấy nội dung voucher — checkout token không hợp lệ | REQ-VOUCHER-API-002, REQ-VOUCHER-API-005 | Sheet 17 | voucher_code hợp lệ, X-Checkout-Token sai/hết hạn | Gửi POST /public/v1/voucher/content với X-Checkout-Token không hợp lệ | Trả về **401**, success=false, error.code="CHECKOUT_TOKEN_INVALID" | P2 | Negative |

---

## API 18 — POST /public/v1/voucher/apply

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-VOUCHER-API-013 | Áp dụng 1 voucher General thành công | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ, đã chọn PTTT, voucher General tồn tại và hợp lệ | Gửi POST /public/v1/voucher/apply với vouchers=[{voucher_code:"CA21060100KTHIETBIKHOFG039", voucher_type:"General"}] | Trả về 200, success=true, data là array có 1 phần tử; promotion_id, voucher_code, discount_value=0 | P1 | Functional |
| SC-VOUCHER-API-014 | Áp dụng nhiều voucher cùng lúc (General + Individual) | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ, 2 voucher hợp lệ (1 General, 1 Individual) | Gửi POST /public/v1/voucher/apply với vouchers chứa 2 items khác nhau | Trả về 200, success=true, data là array có 2 phần tử; discount_value=0 cho cả 2 | P1 | Functional |
| SC-VOUCHER-API-015 | Gỡ bỏ tất cả voucher — gửi array rỗng | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session đang có voucher đã áp dụng | Gửi POST /public/v1/voucher/apply với vouchers=[] | Trả về 200, success=true, data=[] (mảng rỗng) ⚠️ Behavior với vouchers=null cần xác nhận BA (CLARY-002) | P1 | Functional |
| SC-VOUCHER-API-016 | Xác nhận discount_value=0 ngay sau apply | REQ-VOUCHER-API-003 | Sheet 18, mô tả nghiệp vụ | Checkout session hợp lệ, áp dụng voucher thành công | Đọc trường discount_value, discount_ex_vat_value trong response 200 | discount_value=0, discount_ex_vat_value=0 (sẽ được tính sau khi gọi calculate API) | P1 | Business Rule |
| SC-VOUCHER-API-017 | Áp dụng voucher — mã trùng lặp trong danh sách | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/apply với vouchers chứa 2 item có voucher_code giống nhau | Trả về **400**, success=false, error.code="VOUCHER_CODE_DUPLICATE_400", data=null | P2 | Negative |
| SC-VOUCHER-API-018 | Áp dụng voucher — rà soát điều kiện thất bại | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ nhưng voucher không đáp ứng điều kiện áp dụng | Gửi POST /public/v1/voucher/apply với voucher không đủ điều kiện | Trả về **400**, success=false, error.code="VOUCHER_RECHECK_FAILED", data=null | P2 | Negative |
| SC-VOUCHER-API-019 | Áp dụng voucher — voucher không hợp lệ/hết hạn | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/apply với voucher_code đã hết hạn | Trả về **400**, success=false, error.code="VOUCHER_INVALID", data=null | P2 | Negative |
| SC-VOUCHER-API-020 | Áp dụng voucher — thiếu checkout token | REQ-VOUCHER-API-003, REQ-VOUCHER-API-005 | Sheet 18 | vouchers hợp lệ nhưng không có X-Checkout-Token | Gửi POST /public/v1/voucher/apply không kèm header X-Checkout-Token | Trả về **400**, success=false, error.code="CHECKOUT_TOKEN_REQUIRED", data=null | P1 | Negative |
| SC-VOUCHER-API-021 | Áp dụng voucher — chưa chọn hình thức thanh toán | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ nhưng chưa chọn phương thức thanh toán | Gửi POST /public/v1/voucher/apply với voucher hợp lệ | Trả về **400**, success=false, error.code="CHECKOUT_PAYMENT_REQUIRED", data=null | P2 | Negative |
| SC-VOUCHER-API-022 | Áp dụng voucher — thiếu voucher_code trong 1 item | REQ-VOUCHER-API-003 | Sheet 18 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/apply với vouchers=[{voucher_type:"General"}] (thiếu voucher_code) | Trả về **400**, success=false, error.code="VOUCHER_CODE_REQUIRED_400" hoặc validation error | P2 | Negative |

---

## API 19 — POST /public/v1/voucher/check

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-VOUCHER-API-023 | Kiểm tra voucher — hợp lệ (is_valid=true) | REQ-VOUCHER-API-004 | Sheet 19 | Checkout session hợp lệ, voucher_code tồn tại và còn hiệu lực | Gửi POST /public/v1/voucher/check với voucher_code hợp lệ | Trả về 200, success=true, data.is_valid=true, data.message="Voucher is valid." | P1 | Functional |
| SC-VOUCHER-API-024 | Kiểm tra voucher — không hợp lệ (VOUCHER_INVALID) | REQ-VOUCHER-API-004 | Sheet 19 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/check với voucher_code đã hết hạn hoặc không tồn tại | Trả về **400**, success=false, error.code="VOUCHER_INVALID", data=null | P1 | Negative |
| SC-VOUCHER-API-025 | Kiểm tra voucher — thiếu voucher_code | REQ-VOUCHER-API-004 | Sheet 19 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/check với body rỗng hoặc thiếu voucher_code | Trả về **400**, success=false, error.code="VOUCHER_CODE_REQUIRED_400", data=null | P1 | Negative |
| SC-VOUCHER-API-026 | Kiểm tra voucher — voucher_code rỗng (boundary min=1) | REQ-VOUCHER-API-004 | Sheet 19, REQUEST BODY min=1 | Checkout session hợp lệ | Gửi POST /public/v1/voucher/check với voucher_code="" | Trả về **400**, validation error | P2 | Boundary |
| SC-VOUCHER-API-027 | Kiểm tra voucher — voucher_type=General nhưng voucher là Individual | REQ-VOUCHER-API-004 | Sheet 19 | Checkout session hợp lệ, voucher_code là loại Individual | Gửi POST /public/v1/voucher/check với voucher_type="General" không khớp actual type | Trả về **400**, success=false, error.code="VOUCHER_INVALID" (CLARY-005 Resolved) | P2 | Negative |
| SC-VOUCHER-API-028 | Kiểm tra voucher — voucher_type=Individual nhưng voucher là General | REQ-VOUCHER-API-004 | Sheet 19 | Checkout session hợp lệ, voucher_code là loại General | Gửi POST /public/v1/voucher/check với voucher_type="Individual" không khớp actual type | Trả về **400**, success=false, error.code="VOUCHER_INVALID" (CLARY-005 Resolved) | P2 | Negative |
| SC-VOUCHER-API-029 | Kiểm tra voucher — checkout token không hợp lệ | REQ-VOUCHER-API-004, REQ-VOUCHER-API-005 | Sheet 19 | voucher_code hợp lệ, X-Checkout-Token sai/hết hạn | Gửi POST /public/v1/voucher/check với X-Checkout-Token không hợp lệ | Trả về **401**, success=false, error.code="CHECKOUT_TOKEN_INVALID" | P2 | Negative |

---

## Common / Cross-API

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-VOUCHER-API-030 | Response structure — success case | REQ-VOUCHER-API-006 | Sheets 16-19 | Bất kỳ API nào trả về thành công | Kiểm tra cấu trúc response 200 | success=true, error=null, meta có request_id/trace_id/timestamp, data populated | P1 | Functional |
| SC-VOUCHER-API-031 | Response structure — error case | REQ-VOUCHER-API-006 | Sheets 16-19 | Bất kỳ API nào trả về lỗi | Kiểm tra cấu trúc response lỗi | success=false, error.code và error.message có giá trị, data=null, meta.timestamp populated | P2 | Negative |
| SC-VOUCHER-API-032 | Accept-Language header — ngôn ngữ vi vs en | REQ-VOUCHER-API-006 | Sheets 16-19, HEADERS | Checkout session hợp lệ | Gửi request với Accept-Language: en và vi | error.message và nội dung trả về đúng ngôn ngữ yêu cầu | P3 | Functional |
| SC-VOUCHER-API-033 | Lỗi hệ thống — BUSINESS_INTERNAL_ERROR | REQ-VOUCHER-API-001..004 | Sheets 16-19 | Hệ thống backend gặp lỗi nội bộ | Kích hoạt kịch bản lỗi hệ thống (mock hoặc với data đặc biệt) | Trả về **500**, error.code="BUSINESS_INTERNAL_ERROR" | P3 | Error Handling |

---

## VOUCHER-UI — Giao diện Web/Mobile (DOC-VOUCHER-UI-01)

> Platform: Web Desktop + Mobile (iOS/Android)
> ⚠️ CLA-FIGMA-001,002,003,004 chưa resolve → SC-UI-010,011,012 và một phần SC-UI-002,005 blocked/partial

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-VOUCHER-UI-001 | Section Chọn ưu đãi — default state (chưa áp voucher) | REQ-VOUCHER-UI-001 | DOC-VOUCHER-UI-01 §1.2, §2.6, Case C1/F1 | KH đang ở trang Checkout (Cart hoặc Checkout full), chưa áp dụng voucher nào | Xem section Thông tin thanh toán | Link "Nhập các mã ưu đãi của bạn" (Cart) hoặc button "Chọn ưu đãi" + button "Áp dụng" (Checkout) hiển thị; ô voucher trống | P1 | UI |
| SC-VOUCHER-UI-002 | Modal Chọn ưu đãi — cấu trúc đầy đủ khi có voucher | REQ-VOUCHER-UI-002 | DOC-VOUCHER-UI-01 §4.1, Case C2/F2/F3 | KH click "Chọn ưu đãi" / "Nhập các mã ưu đãi", hệ thống trả về có voucher khả dụng | Modal mở | Title "Chọn ưu đãi", nút X, 2 tab ("Mã giảm giá" / "Ưu đãi"), danh sách voucher card có data, button "Xác nhận" / "Đồng ý" hiển thị đủ | P1 | UI / Functional |
| SC-VOUCHER-UI-003 | Voucher card — hiển thị đúng thông tin | REQ-VOUCHER-UI-002 | DOC-VOUCHER-UI-01 §4.2, Case C2 | Modal "Chọn ưu đãi" đang mở, danh sách có voucher | Xem từng voucher card trong list | Mỗi card hiển thị: icon/thumbnail, tên voucher (bold), mô tả ngắn, ngày hết hạn, control chọn (radio/checkbox ⚠️ CLA-FIGMA-003), link "Điều kiện" | P1 | UI |
| SC-VOUCHER-UI-004 | Modal Chọn ưu đãi — Empty State | REQ-VOUCHER-UI-003 | DOC-VOUCHER-UI-01 §5, Case C3/F4, Note N2 | KH click mở modal, không có voucher nào khả dụng cho KH/đơn hàng hiện tại | Modal mở | Hiển thị: icon empty state illustration + text "Tất tiếc, ngay lúc này chưa có ưu đãi." (không hiển thị list, không hiển thị button Xác nhận) | P1 | UI / Functional |
| SC-VOUCHER-UI-005 | Chọn voucher — icon tick xanh khi selected | REQ-VOUCHER-UI-004 | DOC-VOUCHER-UI-01 §4.2 item 6, Case C4/F5 | Modal đang mở, có danh sách voucher | KH click chọn 1 voucher | Voucher card được chọn hiển thị icon tick xanh (check mark); các voucher khác không có tick (⚠️ CLA-FIGMA-003: nếu multi-select → nhiều tick) | P1 | Functional |
| SC-VOUCHER-UI-006 | Áp dụng voucher — checkout summary cập nhật | REQ-VOUCHER-UI-004 | DOC-VOUCHER-UI-01 Case C4/F5, §2.6 | KH đã chọn voucher trong modal → click "Xác nhận" | Modal đóng | Tên voucher hiển thị trong section "Thông tin thanh toán"; giá trị giảm/tổng cần thanh toán cập nhật đúng theo voucher đã chọn | P1 | Functional |
| SC-VOUCHER-UI-007 | Xem Chi tiết Ưu đãi / Điều khoản | REQ-VOUCHER-UI-005 | DOC-VOUCHER-UI-01 §6, §6.1, Case C5/F6 | Modal "Chọn ưu đãi" đang mở, KH click link "Điều kiện" trên voucher card | Màn hình chi tiết mở | Hiển thị đầy đủ: header banner (icon + tên + mô tả + HSD), hạn sử dụng, mô tả ưu đãi, áp dụng cho dịch vụ, phương thức thanh toán, section điều khoản (expandable với bullet list) | P1 | UI |
| SC-VOUCHER-UI-008 | Áp dụng voucher từ màn hình Chi tiết | REQ-VOUCHER-UI-005 | DOC-VOUCHER-UI-01 §6, Case C6/F6 | KH đang xem màn hình Chi tiết Ưu đãi | KH click button "Sử dụng ưu đãi" | Voucher được áp dụng; quay về trang Checkout; voucher hiển thị trong section Thông tin thanh toán với tên và giá trị giảm đúng | P1 | Functional |
| SC-VOUCHER-UI-009 | Mobile — voucher áp dụng hiển thị trong sticky bottom bar | REQ-VOUCHER-UI-009 | DOC-VOUCHER-UI-01 §3.6, Case C9/F2/F3/F5 | KH dùng mobile (iOS/Android), đã áp dụng voucher thành công | Xem màn checkout mobile | Sticky bottom bar hiển thị: tên voucher (hoặc icon voucher), tổng cần thanh toán sau giảm đã cập nhật, button "Tiếp tục" vẫn khả dụng | P2 | UI |
| SC-VOUCHER-UI-010 | Lọc voucher theo điều kiện đơn hàng — chỉ hiển thị voucher match | REQ-VOUCHER-UI-006 | DOC-VOUCHER-UI-01 Note N1/N3, Case C7, MISSING M01 | KH mở modal, hệ thống có voucher nhưng một số không match điều kiện PTTT/dịch vụ của đơn hàng | Modal hiển thị | Chỉ các voucher match điều kiện đơn hàng hiện tại mới hiển thị trong list; voucher không match không xuất hiện hoặc bị ẩn ⚠️ CLA-FIGMA-001: quy tắc filter chưa rõ | P2 | Functional |
| SC-VOUCHER-UI-011 | PTTT không match voucher — thông báo hệ thống | REQ-VOUCHER-UI-008 | DOC-VOUCHER-UI-01 Note N2/N4, MISSING M04 | KH đã chọn voucher yêu cầu PTTT=COD, sau đó đổi PTTT sang Momo | Hệ thống phát hiện mismatch | Hệ thống hiển thị thông báo (popup/snackbar?) giải thích voucher không áp dụng được, hướng dẫn KH chọn lại ⚠️ CLA-FIGMA-004: luồng xử lý cụ thể chưa rõ (đang open — uConn_Nam) | P2 | Functional |
| SC-VOUCHER-UI-012 | Voucher card trạng thái disabled / đã dùng / hết hạn | REQ-VOUCHER-UI-007 | DOC-VOUCHER-UI-01 Case C8, MISSING M02 | Trong danh sách voucher có voucher đã sử dụng hoặc hết hạn | Modal hiển thị | Voucher không khả dụng: card bị mờ (dimmed) hoặc có indicator trạng thái, không cho phép click chọn ⚠️ CLA-FIGMA-002: UI state cụ thể chưa được thiết kế trong Figma | P2 | UI |
| SC-VOUCHER-UI-013 | Đóng modal Chọn ưu đãi bằng nút X — giữ nguyên trạng thái | REQ-VOUCHER-UI-002 | DOC-VOUCHER-UI-01 §4.1 item 2 | Modal "Chọn ưu đãi" đang mở, KH đang xem list (chưa chọn hoặc đã chọn) | KH click nút X | Modal đóng; trạng thái checkout không thay đổi; voucher đã áp dụng trước đó (nếu có) vẫn giữ nguyên | P2 | Functional |
| SC-VOUCHER-UI-014 | Hủy chọn voucher đã áp dụng | REQ-VOUCHER-UI-004 | DOC-VOUCHER-UI-01 Case C1/C4, §2.6 | KH đã áp dụng voucher trong checkout, mở lại modal | KH bỏ chọn voucher → Xác nhận | Voucher bị gỡ; giá trị giảm trả về 0; section Thông tin thanh toán hiển thị lại trạng thái rỗng (link/button "Chọn ưu đãi") | P2 | Functional |
