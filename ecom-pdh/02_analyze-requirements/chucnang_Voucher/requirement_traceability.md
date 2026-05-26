# Requirement Traceability Matrix — Chức năng Voucher (EVC Checkout)

> Phân tích lần đầu: 2026-05-26

---

## Tài liệu nguồn

| DOC ID | File | Loại | Phiên bản | Ngày phân tích |
|--------|------|------|-----------|----------------|
| DOC-VOUCHER-01 | FCP_Ver1.1_Auto_Voucher_Checkout.md | URD / Feature Spec | 1.1 | 2026-05-26 |
| DOC-VOUCHER-02 | FCP_Ver1.1_Tich_hop_Evoucher_Checkout.md | URD / Use Case | 1.0 | 2026-05-26 |
| DOC-VOUCHER-03 | api doc v1.xlsx — Sheet "Danh sách Voucher" | API Spec | 1.0 | 2026-05-26 |
| DOC-VOUCHER-04 | api doc v1.xlsx — Sheet "Nội dung Voucher" | API Spec | 1.0 | 2026-05-26 |
| DOC-VOUCHER-05 | api doc v1.xlsx — Sheet "Áp dụng Voucher" | API Spec | 1.0 | 2026-05-26 |
| DOC-VOUCHER-06 | api doc v1.xlsx — Sheet "Rule chung cho header" | API Spec | 1.0 | 2026-05-26 |

---

## Ma trận truy vết

### MODULE: VOUCHER-LIST (API_01: POST /public/v1/voucher/list)

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-LIST-001 | CO gọi QLCS GetListEvoucher, trả đúng danh sách EVC hợp lệ theo context (gói + PTTT + địa chỉ) | DOC-VOUCHER-02 | US-02, AC-01 | Integration | SC-LIST-001, SC-LIST-002 | High |
| REQ-LIST-002 | CO gọi lại QLCS và trả data[] mới khi context checkout thay đổi | DOC-VOUCHER-02 | US-02, AC-02 | Functional | SC-LIST-003 | Medium |
| REQ-LIST-003 | CO trả result=0, data[]=[] (hoặc null), HTTP 200 khi không có EVC hợp lệ | DOC-VOUCHER-02 | US-02, AC-03 | Negative | SC-LIST-004 | High |
| REQ-LIST-004 | Mỗi item data[] phải có đủ fields bắt buộc: voucherCode (Y,string), voucherType (Y,int,1 hoặc 2) | DOC-VOUCHER-02 | US-02, AC-04 | Functional | SC-LIST-005 | High |
| REQ-LIST-005 | Mỗi item data[] có đủ optional fields: description, note, expiredDate(dd/MM/yyyy), applyTypeId, promotionTypeId, policyGroupId | DOC-VOUCHER-02, DOC-VOUCHER-03 | US-02 §4 / Excel output spec | Functional | SC-LIST-006 | Medium |
| REQ-LIST-006 | Không trả lẫn voucher của kênh bán hàng khác | DOC-VOUCHER-02 | US-02, AC-01 | Functional | SC-LIST-007 | Medium |

### MODULE: VOUCHER-DETAIL (API_02: POST /public/v1/voucher/content)

> ⚠️ **CLA-VOUCHER-001**: Xem phần Clarifications — có sự khác biệt giữa URD US-03 và Excel API spec.

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-DETAIL-001 | API_02 trả về thông tin chi tiết EVC: promotion_id, voucher_code, discount_type, discount_value, discount_ex_vat_value, discount_rate, apply_type, apply_from, apply_to | DOC-VOUCHER-04 | Excel API_02 output spec | Functional | SC-DETAIL-001 | High |
| REQ-DETAIL-002 | API_02 trả đủ discount gốc: original_discount_value, original_discount_ex_vat | DOC-VOUCHER-04 | Excel API_02 output spec | Functional | SC-DETAIL-001 | Medium |
| REQ-DETAIL-003 | API_02 trả voucher_type (Y,int,cấp 1), voucher_type_l2 (int,cấp 2), type_id | DOC-VOUCHER-04 | Excel API_02 output spec | Functional | SC-DETAIL-001 | High |
| REQ-DETAIL-004 | API_02 trả applies[] với đủ sub-fields: service_id, sub_service_type_id, sub_service_id, service_code, discount_ex_vat, discount, dismonth, is_deduct_order, original_discount_value, original_discount_ex_vat | DOC-VOUCHER-04, DOC-VOUCHER-02 | Excel API_02 / US-04 §4 | Functional | SC-DETAIL-002 | High |
| REQ-DETAIL-005 | CO chỉ gọi QLCS khi nhận request — không tự gọi trước | DOC-VOUCHER-02 | US-03, AC-01 | Functional | SC-DETAIL-003 | Low |
| REQ-DETAIL-006 | Nếu EVC không tồn tại hoặc QLCS trả lỗi: success=false, errorMessage tiếng Việt, không lộ cấu trúc nội bộ | DOC-VOUCHER-02 | US-03, Post-condition | Negative | SC-DETAIL-004 | Medium |

### MODULE: VOUCHER-APPLY (API_03: POST /public/v1/voucher/apply — apply)

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-APPLY-001 | CO cập nhật PromotionInfor + tính lại checkout khi QLCS result=1; trả đủ discount fields và applies[] | DOC-VOUCHER-02, DOC-VOUCHER-05 | US-04, AC-01 / Excel API_03 output spec | Functional | SC-APPLY-001, SC-APPLY-002 | High |
| REQ-APPLY-002 | Response apply trả đủ fields: promotion_id, promotion_title, voucher_code, referrer_code, discount_type, discount_value, discount_ex_vat_value, discount_rate, apply_type, apply_from, apply_to, original_discount_value, original_discount_ex_vat, voucher_type, voucher_type_l2, type_id | DOC-VOUCHER-05 | Excel API_03 output spec | Functional | SC-APPLY-002 | High |
| REQ-APPLY-003 | Response apply trả applies[] đủ sub-fields: service_id, sub_service_type_id, sub_service_id, service_code, discount_ex_vat, discount, dismonth, is_deduct_order, original_discount_value, original_discount_ex_vat | DOC-VOUCHER-05 | Excel API_03 output spec | Functional | SC-APPLY-003 | High |
| REQ-APPLY-004 | CO trả success=false, errorMessage tiếng Việt, không thay đổi checkout khi QLCS result≠1 | DOC-VOUCHER-02 | US-04, AC-02 | Negative | SC-APPLY-004 | High |
| REQ-APPLY-005 | CO giữ nguyên voucher cũ khi apply thêm voucher mới thất bại | DOC-VOUCHER-02 | US-04, AC-03 | Negative | SC-APPLY-005 | High |
| REQ-APPLY-006 | Apply thêm voucher khi đã có voucher: CO gửi toàn bộ [cũ+mới] sang QLCS validate | DOC-VOUCHER-02 | US-04.b workflow | Functional | SC-APPLY-006 | Medium |

### MODULE: VOUCHER-CANCEL (API_03: POST /public/v1/voucher/apply — vouchers=[])

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-CANCEL-001 | CO reset Promotion=[], DiscountAllocation=0, tính lại giá gốc khi cancel | DOC-VOUCHER-02 | US-05, AC-01 | Functional | SC-CANCEL-001 | High |
| REQ-CANCEL-002 | newOrderTotal sau cancel = chính xác giá gốc trước apply (không sai floating point) | DOC-VOUCHER-02 | US-05, AC-02 | Functional | SC-CANCEL-002 | High |
| REQ-CANCEL-003 | CO không gọi QLCS khi cancel (KeepStatus=0, xử lý nội bộ hoàn toàn) | DOC-VOUCHER-02 | US-05, AC-03 | Functional | SC-CANCEL-003 | Medium |
| REQ-CANCEL-004 | CO trả lỗi graceful khi cancel nhưng chưa có EVC nào (không crash, errorCode rõ ràng) | DOC-VOUCHER-02 | US-05, AC-04 | Negative | SC-CANCEL-004 | Medium |

### MODULE: VOUCHER-RECHECK (UC-06: Recheck khi Complete Checkout)

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-RECHECK-001 | CO gọi QLCS recheck trước khi tạo order; result=1 → tiếp tục tạo order đúng giá | DOC-VOUCHER-02 | US-06, AC-01 | Integration | SC-RECHECK-001 | High |
| REQ-RECHECK-002 | QLCS result=0 → CO dừng order, tự remove voucher, tính lại giá gốc, trả FE lỗi voucher + checkout mới | DOC-VOUCHER-02 | US-06, AC-02 | Functional | SC-RECHECK-002 | High |
| REQ-RECHECK-003 | QLCS result=-1 → CO dừng order, giữ nguyên checkout + voucher, trả FE thông báo lỗi hệ thống | DOC-VOUCHER-02 | US-06, AC-03 | Functional | SC-RECHECK-003 | High |

### MODULE: VOUCHER-AUTO (Auto Apply — UC-01 đến UC-05 từ DOC-VOUCHER-01)

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-AUTO-001 | CO auto-apply voucher có DiscountVAT cao nhất khi hasManualVoucher=false, chưa có voucher | DOC-VOUCHER-01 | UC-01, AC-01 | Functional | SC-AUTO-001 | High |
| REQ-AUTO-002 | Không apply, giá gốc, không báo lỗi khi GetListEvoucher trả rỗng | DOC-VOUCHER-01 | UC-01, AC-02 | Negative | SC-AUTO-002 | High |
| REQ-AUTO-003 | Không apply, giá gốc khi Recheck voucher tốt nhất trả result=0 hoặc -1 | DOC-VOUCHER-01 | UC-01, AC-03 | Negative | SC-AUTO-003 | High |
| REQ-AUTO-004 | Chỉ apply đúng 1 voucher DiscountVAT cao nhất, không stack combo | DOC-VOUCHER-01 | UC-01, AC-04 | Functional | SC-AUTO-004 | High |
| REQ-AUTO-005 | CO tự detect context change, xóa voucher auto cũ, chạy lại auto-apply (hasManualVoucher=false) | DOC-VOUCHER-01 | UC-02, AC-01 | Functional | SC-AUTO-005 | High |
| REQ-AUTO-006 | Voucher mới sau re-apply có thể khác voucher cũ | DOC-VOUCHER-01 | UC-02, AC-02 | Functional | SC-AUTO-006 | Medium |
| REQ-AUTO-007 | Context mới không có voucher phù hợp → giá gốc, không báo lỗi | DOC-VOUCHER-01 | UC-02, AC-03 | Negative | SC-AUTO-007 | Medium |
| REQ-AUTO-008 | CO không tự auto-apply khi hasManualVoucher=true; chờ FE xử lý | DOC-VOUCHER-01 | UC-03, AC-01 | Functional | SC-AUTO-008 | High |
| REQ-AUTO-009 | Giữ voucher còn valid sau FE apply lại [auto+manual] | DOC-VOUCHER-01 | UC-03, AC-02 | Functional | SC-AUTO-009 | High |
| REQ-AUTO-010 | Remove voucher invalid + notify FE với message cụ thể tiếng Việt | DOC-VOUCHER-01 | UC-03, AC-03 | Functional | SC-AUTO-010 | High |
| REQ-AUTO-011 | CO không tự apply voucher mới thay thế voucher bị remove | DOC-VOUCHER-01 | UC-03, AC-04 | Functional | SC-AUTO-011 | High |
| REQ-AUTO-012 | User bỏ voucher → CO remove, không auto-apply lại dù hasManualVoucher=false | DOC-VOUCHER-01 | UC-04, AC-01 | Functional | SC-AUTO-012 | High |
| REQ-AUTO-013 | Bỏ voucher manual → voucher auto vẫn giữ; hasManualVoucher cập nhật theo số voucher manual còn lại | DOC-VOUCHER-01 | UC-04, AC-02 | Functional | SC-AUTO-013 | Medium |
| REQ-AUTO-014 | User bỏ voucher rồi đổi context → CO vẫn không auto-apply | DOC-VOUCHER-01 | UC-04, AC-03 | Functional | SC-AUTO-014 | High |
| REQ-AUTO-015 | Chỉ revalidate voucher manual, không apply voucher auto mới (checkout chỉ có manual) | DOC-VOUCHER-01 | UC-05, AC-01 | Functional | SC-AUTO-015 | High |
| REQ-AUTO-016 | Giữ voucher manual còn valid sau revalidate | DOC-VOUCHER-01 | UC-05, AC-02 | Functional | SC-AUTO-016 | Medium |
| REQ-AUTO-017 | Remove voucher manual invalid + notify FE | DOC-VOUCHER-01 | UC-05, AC-03 | Negative | SC-AUTO-017 | Medium |

### MODULE: VOUCHER-API (Auth / Header Rules)

| Req ID | Mô tả | DOC Source | Nguồn (section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|-----------|-----------------|------|-----------|------------|
| REQ-API-001 | X-Checkout-Token là bắt buộc; thiếu/sai/hết hạn → lỗi người dùng, không hiển thị voucher | DOC-VOUCHER-06 | Sheet "Rule chung cho header" | Security | SC-API-001, SC-API-002, SC-API-003 | High |
| REQ-API-002 | Authorization là bắt buộc; thiếu/sai/hết hạn → lỗi, không hiển thị voucher | DOC-VOUCHER-06 | Sheet "Rule chung cho header" | Security | SC-API-004, SC-API-005, SC-API-006 | High |
| REQ-API-003 | Client-Id không bắt buộc | DOC-VOUCHER-06 | Sheet "Rule chung cho header" | Functional | SC-API-007 | Low |

---

## Clarifications Needed

| # | Req ID | DOC Source | Câu hỏi | Answer | Status | Ngày resolve | Ảnh hưởng TC |
|---|--------|-----------|---------|--------|--------|--------------|--------------|
| CLA-VOUCHER-001 | REQ-DETAIL-001 đến 004 | DOC-VOUCHER-04 vs DOC-VOUCHER-02 | **[Critical]** Excel API_02 (`POST /public/v1/voucher/content`) trả output promotion_id/discount_value/applies[]. URD US-03 mô tả endpoint `GET /public/v1/checkout/{checkoutId}/evouchers/{voucherCode}` trả contents[] (Content1-6). Đây là **2 endpoint riêng biệt** hay cùng 1 endpoint? Nếu riêng, `GET /{checkoutId}/evouchers/{voucherCode}` có cần test API không? | | Open | | Ảnh hưởng toàn bộ API_02 sheet TC |
| CLA-VOUCHER-002 | REQ-API-001, REQ-API-002 | DOC-VOUCHER-06 | Error code cụ thể cho từng case auth: (a) thiếu header → HTTP bao nhiêu? (b) sai giá trị → HTTP bao nhiêu? (c) hết hạn → HTTP bao nhiêu? | | Open | | Ảnh hưởng expected response auth TC |
| CLA-VOUCHER-003 | REQ-AUTO-012, REQ-AUTO-014 | DOC-VOUCHER-01 | Cơ chế phân biệt "user chủ động bỏ voucher" vs "context change remove voucher auto": hệ thống track qua field nào để biết không nên auto-apply lại? | | Open | | SC-AUTO-012, SC-AUTO-014 |
| CLA-VOUCHER-004 | REQ-AUTO-001, REQ-AUTO-004 | DOC-VOUCHER-01 | Khi nhiều voucher có cùng DiscountVAT cao nhất → chọn voucher nào? (vd: tiebreaker là expiredDate sớm nhất, hay voucherCode, hay random?) | | Open | | SC-AUTO-001, SC-AUTO-004 |
| CLA-VOUCHER-005 | REQ-API-003 | DOC-VOUCHER-06 | Client-Id "không bắt buộc" — nếu truyền vào có ảnh hưởng đến kết quả API không? Hay chỉ là metadata/logging? | | Open | | SC-API-007 |
| CLA-VOUCHER-006 | REQ-CANCEL-004 | DOC-VOUCHER-02 | `POST /public/v1/voucher/apply` với `vouchers=[]` khi chưa có voucher nào: CO trả HTTP 400 (lỗi) hay HTTP 200 (graceful ignore)? | | Open | | SC-CANCEL-004 |
