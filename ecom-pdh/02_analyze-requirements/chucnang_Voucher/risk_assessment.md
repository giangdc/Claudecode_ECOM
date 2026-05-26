# Risk Assessment — Chức năng Voucher (EVC Checkout)

> Hướng dẫn: Risk Score = Business Impact (1–5) × Complexity (1–5)
> High ≥ 15 | Medium 8–14 | Low ≤ 7

---

## Ma trận rủi ro

| Module / Feature | Business Impact | Complexity | Risk Score | Mức rủi ro | Đề xuất |
|-----------------|-----------------|------------|------------|------------|---------|
| VOUCHER-AUTO — Auto-apply 5 UC (UC-01 đến UC-05) | 5 | 5 | **25** | 🔴 High | Ưu tiên test sớm; cần mock QLCS; test đầy đủ 5 luồng |
| VOUCHER-APPLY — Manual apply UC-04 (a/b/c) | 5 | 4 | **20** | 🔴 High | Verify đủ output fields; test combo voucher; QLCS mock |
| VOUCHER-RECHECK — Complete checkout UC-06 | 5 | 4 | **20** | 🔴 High | 3 result code (1/0/-1) phải test đủ; liên quan tạo order |
| VOUCHER-AUTO — hasManualVoucher flag logic | 5 | 4 | **20** | 🔴 High | Flag quyết định toàn bộ luồng auto vs manual; dễ bug edge case |
| VOUCHER-LIST — API output field validation | 4 | 3 | **12** | 🟡 Medium | Validate schema đầy đủ 8 fields; voucherType must be 1 or 2 |
| VOUCHER-DETAIL — API output field validation | 4 | 3 | **12** | 🟡 Medium | Blocked bởi CLA-VOUCHER-001; validate 17+ fields + applies[] |
| VOUCHER-APPLY — API output field validation | 4 | 3 | **12** | 🟡 Medium | 17 fields + applies[] 10 sub-fields; verify số tiền discount đúng |
| VOUCHER-CANCEL — Reset và tính lại giá | 5 | 2 | **10** | 🟡 Medium | Floating point risk; CO không gọi QLCS |
| VOUCHER-LIST — Context change | 3 | 3 | **9** | 🟡 Medium | QLCS call lại đúng context mới |
| VOUCHER-API — Authentication (3 headers) | 5 | 2 | **10** | 🟡 Medium | 3 auth factors; cross-auth mismatch; replay attack |
| VOUCHER-CANCEL — Edge case (cancel khi rỗng) | 2 | 2 | **4** | 🟢 Low | Graceful handling; CLA-VOUCHER-006 cần resolve |
| VOUCHER-DETAIL — On-demand only | 2 | 1 | **2** | 🟢 Low | Verify log; không ảnh hưởng user |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **VOUCHER-AUTO** (Score 25) — Logic auto-apply 5 UC phức tạp; flag `hasManualVoucher` kiểm soát toàn bộ luồng; dễ bug ở edge case context change
2. **VOUCHER-APPLY manual** (Score 20) — Core feature; nhiều nhánh (04.a, 04.b, 04.c); output phải validate 17 fields + applies[]
3. **VOUCHER-RECHECK** (Score 20) — 3 result code ảnh hưởng đến order creation; result=0 phải remove voucher + recalculate; result=-1 phải giữ nguyên
4. **hasManualVoucher flag** (Score 20) — Flag duy nhất quyết định toàn bộ hành vi CO; sai flag = sai toàn bộ luồng

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|-----------|--------------|---------------------|
| VOUCHER-LIST | QLCS API GetListEvoucher | Không có danh sách → không test được APPLY, DETAIL, AUTO |
| VOUCHER-DETAIL | QLCS API GetEvoucherInfor / GetVoucherContent | Không test được output fields |
| VOUCHER-APPLY | VOUCHER-LIST (cần voucherCode + voucherType) | Apply phải có voucherCode lấy từ list |
| VOUCHER-APPLY | QLCS API GetEvoucherInfor + Recheck | Không mock được → không test được negative cases |
| VOUCHER-RECHECK | VOUCHER-APPLY (phải apply trước) | Không test được nếu apply bị fail |
| VOUCHER-AUTO | VOUCHER-LIST + QLCS GetListEvoucher + GetEvoucherInfor + Recheck | Toàn bộ auto-apply phụ thuộc chuỗi QLCS calls |
| VOUCHER-CANCEL | VOUCHER-APPLY (phải apply trước để cancel) | Cancel test phụ thuộc apply thành công trước |

---

## Thứ tự test đề xuất

```
1. Smoke P1:
   → Auth (SC-API-001 đến SC-API-006) — đảm bảo truy cập được API
   → SC-LIST-001 (lấy danh sách) — đảm bảo có data để test tiếp

2. Risk cao nhất:
   → SC-APPLY-001, SC-APPLY-002, SC-APPLY-003 (output validation đủ fields)
   → SC-RECHECK-001, SC-RECHECK-002, SC-RECHECK-003
   → SC-AUTO-001, SC-AUTO-004 (auto-apply happy path + no stack)
   → SC-AUTO-008, SC-AUTO-012 (hasManualVoucher blocking logic)

3. Full regression:
   → Tất cả SC-AUTO-* (UC-01 đến UC-05)
   → SC-CANCEL-001, SC-CANCEL-002 (giá gốc đúng)
   → SC-DETAIL-001, SC-DETAIL-002 (output fields)
   → SC-LIST-005, SC-LIST-006 (schema validation)

4. Blocked — chờ clarification:
   → SC-DETAIL-001 đến SC-DETAIL-005 (chờ CLA-VOUCHER-001)
   → SC-CANCEL-004 (chờ CLA-VOUCHER-006)
   → Tất cả SC-API-* expected HTTP code (chờ CLA-VOUCHER-002)
```

---

## Test Data yêu cầu

| Loại | Mô tả | Cần chuẩn bị |
|------|-------|-------------|
| Checkout test | Checkout hợp lệ với lineitem | Cần tạo sẵn trên STG |
| EVC active | KH có 3-5 EVC active khác nhau DiscountVAT | Phối hợp QLCS/vận hành tạo |
| EVC expired | EVC đã hết hạn | Cần EVC với expiredDate < today |
| EVC wrong channel | EVC thuộc kênh khác | Confirm với QLCS team |
| Token expired | Bearer token + X-Checkout-Token đã hết hạn | Giữ lại token cũ |
| QLCS mock | Các kịch bản QLCS trả result=0/-1 | Cần môi trường có mock QLCS hoặc phối hợp Dev |
