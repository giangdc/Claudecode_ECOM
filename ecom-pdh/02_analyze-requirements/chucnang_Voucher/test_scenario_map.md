# Test Scenario Map — Chức năng Voucher (EVC Checkout)

> Tổng quan: **45 scenarios** — P1: 29 | P2: 16 | P3: 0

---

## MODULE: VOUCHER-LIST (API_01: POST /public/v1/voucher/list)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-LIST-001 | Lấy danh sách EVC thành công | REQ-LIST-001 | DOC-VOUCHER-02 US-02 AC-01 | Checkout hợp lệ; Authorization + X-Checkout-Token hợp lệ; QLCS có ít nhất 1 EVC khớp context | Gọi POST /public/v1/voucher/list | HTTP 200 — result=1 — data[] có ít nhất 1 item — Không trả lẫn EVC kênh khác | P1 | Integration |
| SC-LIST-002 | Kết quả list phản ánh đúng context checkout | REQ-LIST-001 | DOC-VOUCHER-02 US-02 AC-01 | Checkout có context đầy đủ (gói + PTTT + địa chỉ) | Gọi API sau khi thiết lập đủ context | data[] chứa đúng EVC hợp lệ với context đó | P1 | Functional |
| SC-LIST-003 | Cập nhật danh sách khi context thay đổi | REQ-LIST-002 | DOC-VOUCHER-02 US-02 AC-02 | Checkout có context cũ; đã gọi list 1 lần | User đổi gói/PTTT → gọi lại API | data[] phản ánh context mới; khác lần gọi trước nếu PTTT/Gói ảnh hưởng | P1 | Functional |
| SC-LIST-004 | Không có EVC hợp lệ → result=0, data=[], HTTP 200 | REQ-LIST-003 | DOC-VOUCHER-02 US-02 AC-03 | Checkout hợp lệ; QLCS không có EVC nào khớp context | Gọi POST /public/v1/voucher/list | HTTP 200 — result=0 — data[]=[] hoặc null — Không có 4xx/5xx — Không báo lỗi user | P1 | Negative |
| SC-LIST-005 | Validate required output fields: voucherCode và voucherType | REQ-LIST-004 | DOC-VOUCHER-02 US-02 AC-04; DOC-VOUCHER-03 | QLCS có EVC hợp lệ | Gọi API và kiểm tra schema response | Mỗi item: voucherCode non-null (string); voucherType là 1 hoặc 2 (integer) — Không có field bắt buộc nào null | P1 | Functional |
| SC-LIST-006 | Validate optional output fields: description, note, expiredDate, applyTypeId, promotionTypeId, policyGroupId | REQ-LIST-005 | DOC-VOUCHER-03 Excel API_01 output spec | QLCS trả EVC có đầy đủ thông tin | Gọi API và kiểm tra schema từng field | Các field optional không bị null bắt buộc; expiredDate format dd/MM/yyyy nếu có; applyTypeId/promotionTypeId/policyGroupId là integer nếu có | P2 | Functional |
| SC-LIST-007 | Không trả lẫn EVC của kênh bán hàng khác | REQ-LIST-006 | DOC-VOUCHER-02 US-02 AC-01 | QLCS có EVC của nhiều kênh; đang dùng kênh fpt.vn | Gọi API từ kênh fpt.vn | Tất cả item trong data[] thuộc đúng channelCode hiện tại | P2 | Functional |

---

## MODULE: VOUCHER-DETAIL (API_02: POST /public/v1/voucher/content)

> ⚠️ Chờ resolve CLA-VOUCHER-001 trước khi finalize TC cho module này

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-DETAIL-001 | Validate required output: promotion/discount fields | REQ-DETAIL-001, REQ-DETAIL-002, REQ-DETAIL-003 | DOC-VOUCHER-04 Excel API_02 output spec | Checkout hợp lệ; voucher_code hợp lệ; QLCS trả data đủ | Gọi POST /public/v1/voucher/content với voucher_code hợp lệ | HTTP 200 — Response chứa đủ: promotion_id, promotion_title, voucher_code (non-null), discount_type, discount_value (number ≥0), discount_ex_vat_value, discount_rate, apply_type, apply_from, apply_to, original_discount_value, original_discount_ex_vat, voucher_type (required, int), voucher_type_l2, type_id | P1 | Functional |
| SC-DETAIL-002 | Validate applies[] sub-fields đủ và đúng kiểu | REQ-DETAIL-004 | DOC-VOUCHER-04 Excel API_02; DOC-VOUCHER-02 US-04 §4 | QLCS trả applies[] có ít nhất 1 item | Gọi API và kiểm tra schema applies[] | Mỗi item applies[] có: service_id, sub_service_type_id, sub_service_id, service_code, discount_ex_vat (number), discount (number), dismonth (int, 0=áp 1 lần), is_deduct_order (int, 1=khấu trừ trực tiếp), original_discount_value, original_discount_ex_vat | P1 | Functional |
| SC-DETAIL-003 | CO không tự gọi QLCS — on-demand only | REQ-DETAIL-005 | DOC-VOUCHER-02 US-03 AC-01 | Monitor QLCS request log | KHÔNG gọi API này; theo dõi log CO | Không có outbound request đến QLCS GetVoucherContent/GetEvoucherInfor trước khi API được trigger | P2 | Functional |
| SC-DETAIL-004 | voucher_code không tồn tại hoặc QLCS lỗi → success=false, message tiếng Việt | REQ-DETAIL-006 | DOC-VOUCHER-02 US-03 Post-condition | voucher_code không tồn tại trong QLCS | Gọi API với voucher_code không hợp lệ | HTTP 200, success=false hoặc HTTP 404 — errorMessage tiếng Việt — Không lộ cấu trúc QLCS | P1 | Negative |
| SC-DETAIL-005 | Thiếu voucher_code → 400 | REQ-DETAIL-001 | DOC-VOUCHER-04 | Body không có voucher_code | Gọi API với body rỗng | HTTP 400 — error message: field bắt buộc — Không gọi QLCS | P1 | Negative |

---

## MODULE: VOUCHER-APPLY (API_03: POST /public/v1/voucher/apply — UC-04)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-APPLY-001 | Apply EVC hợp lệ lần đầu — luồng chính | REQ-APPLY-001 | DOC-VOUCHER-02 US-04 AC-01; DOC-VOUCHER-05 | Checkout chưa có voucher; QLCS result=1 | Gọi POST /public/v1/voucher/apply với 1 voucher hợp lệ | HTTP 200 — success=true — appliedVoucher.voucherCode khớp input — discountLines[].discountAmount > 0 — newOrderTotal = giá gốc - tổng discount | P1 | Functional |
| SC-APPLY-002 | Validate required output fields: promotion + discount level | REQ-APPLY-002 | DOC-VOUCHER-05 Excel API_03 output spec | QLCS result=1; CO calculate thành công | Gọi apply và kiểm tra response schema | Response có đủ: promotion_id, promotion_title, voucher_code (non-null), referrer_code, discount_type, discount_value (number), discount_ex_vat_value, discount_rate, apply_type, apply_from, apply_to, original_discount_value, original_discount_ex_vat, voucher_type (required, int), voucher_type_l2, type_id | P1 | Functional |
| SC-APPLY-003 | Validate applies[] trong response apply | REQ-APPLY-003 | DOC-VOUCHER-05 Excel API_03 output spec | QLCS trả applies[] đủ data | Kiểm tra schema applies[] trong response | applies[] có ít nhất 1 item; mỗi item có: service_id, sub_service_type_id, sub_service_id, service_code, discount_ex_vat, discount, dismonth (0=áp 1 lần), is_deduct_order (1=khấu trừ thẳng), original_discount_value, original_discount_ex_vat | P1 | Functional |
| SC-APPLY-004 | QLCS result≠1 → success=false, checkout unchanged | REQ-APPLY-004 | DOC-VOUCHER-02 US-04 AC-02 | QLCS trả result≠1 cho voucher | Gọi apply với voucher không hợp lệ | HTTP 200 — success=false — errorMessage tiếng Việt, không lộ cấu trúc QLCS — Model checkout không thay đổi | P1 | Negative |
| SC-APPLY-005 | Có voucher A hợp lệ, apply thêm B fail → A vẫn giữ | REQ-APPLY-005 | DOC-VOUCHER-02 US-04 AC-03 | Checkout đang có voucher A applied; voucher B fail QLCS | Apply [A, B] | success=false (cho B) — appliedVoucher vẫn là A — newOrderTotal vẫn = giá sau giảm A — A không bị xóa | P1 | Negative |
| SC-APPLY-006 | Apply thêm voucher B khi đã có A — CO gửi toàn bộ [A+B] sang QLCS | REQ-APPLY-006 | DOC-VOUCHER-02 US-04.b workflow | Checkout có voucher A; QLCS result=1 cho cả A+B | Apply voucher B mới | HTTP 200 — success=true — Cả A và B trong response — QLCS được gọi với [A+B] | P2 | Integration |

---

## MODULE: VOUCHER-CANCEL (API_03: POST /public/v1/voucher/apply — UC-05)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-CANCEL-001 | Hủy voucher — reset Promotion và tính lại giá gốc | REQ-CANCEL-001 | DOC-VOUCHER-02 US-05 AC-01 | Checkout đang có ít nhất 1 voucher applied | Apply vouchers=[] | HTTP 200 — success=true — Promotion=[] trong checkout — DiscountAllocation=0 — DiscountType/Value/Rate của lineitem =0 — newOrderTotal = giá gốc | P1 | Functional |
| SC-CANCEL-002 | newOrderTotal sau cancel = chính xác giá trước apply (no float error) | REQ-CANCEL-002 | DOC-VOUCHER-02 US-05 AC-02 | Ghi nhận giá gốc GT trước khi apply | Apply voucher → ghi giá GT'; apply vouchers=[] | newOrderTotal = GT (không sai lệch) — CalculationSummary cập nhật đúng | P1 | Functional |
| SC-CANCEL-003 | CO không gọi QLCS khi cancel | REQ-CANCEL-003 | DOC-VOUCHER-02 US-05 AC-03 | Monitor QLCS log; Checkout có voucher | Apply vouchers=[] | CO log KHÔNG có outbound request nào đến QLCS trong quá trình cancel | P2 | Functional |
| SC-CANCEL-004 | Cancel khi chưa có voucher → graceful | REQ-CANCEL-004 | DOC-VOUCHER-02 US-05 AC-04 | Checkout không có voucher nào | Apply vouchers=[] | HTTP 200 hoặc 400 — Không crash — errorCode/message rõ ràng — Không thay đổi checkout [chờ CLA-VOUCHER-006] | P2 | Negative |

---

## MODULE: VOUCHER-RECHECK (UC-06: Complete Checkout)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-RECHECK-001 | Complete checkout, QLCS recheck result=1 → tạo order OK | REQ-RECHECK-001 | DOC-VOUCHER-02 US-06 AC-01 | Checkout có voucher applied; user bấm Thanh toán | Trigger complete checkout | CO gọi QLCS recheck trước khi tạo order — result=1 — Order tạo thành công với đúng giá đã giảm | P1 | Integration |
| SC-RECHECK-002 | recheck result=0 → dừng, remove voucher, giá gốc | REQ-RECHECK-002 | DOC-VOUCHER-02 US-06 AC-02 | QLCS mock recheck trả result=0 (hết quota) | Trigger complete checkout | Order KHÔNG tạo — CO tự remove voucher khỏi Promotion — newOrderTotal = giá gốc — Response FE: lỗi voucher + checkout info mới nhất | P1 | Functional |
| SC-RECHECK-003 | recheck result=-1 → dừng, giữ checkout + voucher | REQ-RECHECK-003 | DOC-VOUCHER-02 US-06 AC-03 | QLCS mock recheck trả result=-1 (lỗi hệ thống) | Trigger complete checkout | Order KHÔNG tạo — Checkout giữ nguyên (voucher vẫn còn) — Response FE: thông báo lỗi hệ thống | P1 | Functional |

---

## MODULE: VOUCHER-AUTO (Auto Apply — DOC-VOUCHER-01)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-AUTO-001 | hasManualVoucher=false, chưa có voucher → CO auto-apply DiscountVAT cao nhất | REQ-AUTO-001 | DOC-VOUCHER-01 UC-01 AC-01 | hasManualVoucher=false; Checkout không có voucher; KH có ≥1 EVC hợp lệ | Gọi Calculate Checkout | CO chạy: GetListEvoucher → GetEvoucherInfor (loop) → Sort DiscountVAT → Recheck → Apply — Response: autoApplied=true, giá đã giảm | P1 | Functional |
| SC-AUTO-002 | GetListEvoucher trả rỗng → không apply, giá gốc, không báo lỗi | REQ-AUTO-002 | DOC-VOUCHER-01 UC-01 AC-02 | hasManualVoucher=false; QLCS không có EVC khớp context | Calculate Checkout | CO không apply — autoApplied=false — Giá gốc — Không có error message cho user | P1 | Negative |
| SC-AUTO-003 | Recheck voucher tốt nhất fail (result=0/-1) → không apply | REQ-AUTO-003 | DOC-VOUCHER-01 UC-01 AC-03 | hasManualVoucher=false; QLCS recheck trả result=0 | Calculate Checkout | CO không apply — Giá gốc — Không báo lỗi | P1 | Negative |
| SC-AUTO-004 | Nhiều EVC hợp lệ → CO chỉ apply 1 EVC DiscountVAT cao nhất (no stack) | REQ-AUTO-004 | DOC-VOUCHER-01 UC-01 AC-04 | KH có 3 EVC: V1=100k, V2=150k, V3=80k; tất cả hợp lệ | Calculate Checkout | CO apply V2 (DiscountVAT=150k) — Không apply combo — autoApplied=true với 1 voucher | P1 | Functional |
| SC-AUTO-005 | Context change, hasManualVoucher=false → CO xóa voucher cũ, chạy lại auto-apply | REQ-AUTO-005 | DOC-VOUCHER-01 UC-02 AC-01 | Checkout có voucher auto V1; hasManualVoucher=false | User đổi gói/PTTT | CO detect context change → xóa V1 → GetListEvoucher (context mới) → ... → Apply voucher tốt nhất context mới | P1 | Functional |
| SC-AUTO-006 | Voucher mới sau re-apply có thể khác voucher cũ | REQ-AUTO-006 | DOC-VOUCHER-01 UC-02 AC-02 | Context mới có voucher tốt hơn V1 đang apply | CO hoàn tất re-apply | CO apply voucher mới (không phải V1) — V1 không được giữ nếu không phải tốt nhất | P2 | Functional |
| SC-AUTO-007 | Context mới không có voucher → không apply, giá gốc | REQ-AUTO-007 | DOC-VOUCHER-01 UC-02 AC-03 | Đổi context; QLCS không có EVC khớp context mới | CO hoàn tất re-apply | Không apply voucher — Giá gốc — Không báo lỗi user | P2 | Negative |
| SC-AUTO-008 | hasManualVoucher=true, context change → CO không auto-apply, chờ FE | REQ-AUTO-008 | DOC-VOUCHER-01 UC-03 AC-01 | Checkout có voucher manual; hasManualVoucher=true | User đổi context | CO KHÔNG tự chạy auto-apply — Không xóa voucher — Chờ FE gửi apply=[] rồi apply lại | P1 | Functional |
| SC-AUTO-009 | FE apply lại [auto+manual], voucher còn valid → giữ | REQ-AUTO-009 | DOC-VOUCHER-01 UC-03 AC-02 | FE apply lại [auto+manual]; voucher vẫn hợp lệ với context mới | CO GetEvoucherInfor + Recheck | Voucher được giữ nguyên — Giá tính với voucher đó | P1 | Functional |
| SC-AUTO-010 | FE apply lại, voucher invalid → CO remove + notify FE message tiếng Việt | REQ-AUTO-010 | DOC-VOUCHER-01 UC-03 AC-03 | FE apply lại; 1 voucher không còn hợp lệ với context mới | CO nhận kết quả invalid | CO remove voucher invalid — Calculate lại — Response FE: "Voucher X không còn phù hợp với lựa chọn hiện tại" | P1 | Functional |
| SC-AUTO-011 | CO không tự apply voucher mới thay thế voucher bị remove | REQ-AUTO-011 | DOC-VOUCHER-01 UC-03 AC-04 | Voucher bị remove sau revalidate | CO hoàn tất xử lý | CO không tìm và apply voucher mới — Checkout về giá theo voucher còn lại (hoặc giá gốc) | P1 | Functional |
| SC-AUTO-012 | User chủ động bỏ voucher → không auto-apply lại | REQ-AUTO-012 | DOC-VOUCHER-01 UC-04 AC-01 | Checkout có voucher auto; hasManualVoucher=false | User bỏ voucher (apply vouchers=[]) | CO remove voucher — Dù hasManualVoucher=false, CO KHÔNG auto-apply lại — Giá gốc | P1 | Functional |
| SC-AUTO-013 | Bỏ voucher manual → voucher auto vẫn giữ; hasManualVoucher cập nhật | REQ-AUTO-013 | DOC-VOUCHER-01 UC-04 AC-02 | Checkout có cả voucher auto + manual | User bỏ voucher manual | Chỉ voucher manual bị remove — Voucher auto vẫn giữ — hasManualVoucher cập nhật theo số manual còn lại | P2 | Functional |
| SC-AUTO-014 | User bỏ voucher rồi đổi context → CO vẫn không auto-apply | REQ-AUTO-014 | DOC-VOUCHER-01 UC-04 AC-03 | User vừa bỏ voucher; hasManualVoucher=false | User đổi gói/PTTT | CO KHÔNG auto-apply — Checkout giữ giá gốc | P1 | Functional |
| SC-AUTO-015 | Chỉ revalidate voucher manual, không apply auto mới (checkout chỉ có manual) | REQ-AUTO-015 | DOC-VOUCHER-01 UC-05 AC-01 | Checkout chỉ có voucher manual (auto đã bị bỏ); hasManualVoucher=true | FE apply lại chỉ manual | CO GetEvoucherInfor + Recheck voucher manual — Không apply voucher auto mới | P1 | Functional |
| SC-AUTO-016 | Giữ voucher manual còn valid sau revalidate | REQ-AUTO-016 | DOC-VOUCHER-01 UC-05 AC-02 | Voucher manual vẫn hợp lệ với context mới | CO hoàn tất revalidate | Voucher manual được giữ — Giá tính với voucher đó | P2 | Functional |
| SC-AUTO-017 | Remove voucher manual invalid + notify FE | REQ-AUTO-017 | DOC-VOUCHER-01 UC-05 AC-03 | Voucher manual không còn hợp lệ với context mới | CO nhận kết quả invalid | CO remove voucher manual — Calculate lại giá gốc — FE nhận thông báo phù hợp | P2 | Negative |

---

## MODULE: VOUCHER-API (Auth / Header)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-API-001 | Thiếu X-Checkout-Token → lỗi, không trả voucher | REQ-API-001 | DOC-VOUCHER-06 | Request không có header X-Checkout-Token | Gọi bất kỳ API voucher nào | Lỗi cho người dùng — Không hiển thị / trả voucher [HTTP code chờ CLA-VOUCHER-002] | P1 | Security |
| SC-API-002 | X-Checkout-Token sai → lỗi | REQ-API-001 | DOC-VOUCHER-06 | X-Checkout-Token = invalid value | Gọi API | Lỗi "không lấy được voucher" [HTTP chờ CLA-VOUCHER-002] | P1 | Security |
| SC-API-003 | X-Checkout-Token hết hạn → lỗi | REQ-API-001 | DOC-VOUCHER-06 | X-Checkout-Token expired | Gọi API | Lỗi "hết hạn" [HTTP chờ CLA-VOUCHER-002] | P1 | Security |
| SC-API-004 | Thiếu Authorization → lỗi, không trả voucher | REQ-API-002 | DOC-VOUCHER-06 | Request không có header Authorization | Gọi bất kỳ API voucher nào | Lỗi cho người dùng — Không hiển thị / trả voucher | P1 | Security |
| SC-API-005 | Authorization Bearer token sai → lỗi | REQ-API-002 | DOC-VOUCHER-06 | Authorization: Bearer invalid_token | Gọi API | Lỗi "không lấy được voucher" | P1 | Security |
| SC-API-006 | Authorization Bearer token hết hạn → lỗi | REQ-API-002 | DOC-VOUCHER-06 | Authorization: Bearer expired_jwt | Gọi API | Lỗi "hết hạn" | P1 | Security |
| SC-API-007 | Client-Id không bắt buộc — request không có vẫn thành công | REQ-API-003 | DOC-VOUCHER-06 | Authorization + X-Checkout-Token hợp lệ; không có Client-Id | Gọi API mà không truyền Client-Id | API hoạt động bình thường [chờ CLA-VOUCHER-005 về tác động của Client-Id] | P2 | Functional |
