# Risk Assessment — chucnang_Voucher (API)
## Hướng dẫn: Risk Score = Business Impact (1-5) × Complexity (1-5)

---

## Ma trận rủi ro

| Module/Feature | Business Impact | Complexity | Risk Score | Mức độ | Đề xuất |
|---|---|---|---|---|---|
| POST /voucher/apply | 5 | 4 | **20** | HIGH | Test đầu tiên và kỹ nhất — ảnh hưởng trực tiếp đến giá trị đơn hàng checkout. Phủ đủ: apply 1/nhiều/null voucher, duplicate check, discount_value=0 rule |
| Authentication (X-Checkout-Token) | 5 | 3 | **15** | HIGH | Bảo mật phiên checkout — test token missing/invalid/expired cho cả 4 APIs |
| POST /voucher/list | 4 | 2 | **8** | MEDIUM | Hiển thị danh sách voucher đúng/đủ cho user chọn. Edge case: list rỗng, checkout chưa chọn PTTT |
| POST /voucher/check | 3 | 2 | **6** | MEDIUM | Validate trước khi apply — sai ảnh hưởng UX nhưng apply sẽ fail an toàn. Test is_valid=true/false |
| Response Structure Contract | 3 | 2 | **6** | MEDIUM | Bất kỳ thay đổi cấu trúc nào sẽ break client UI. Test assertion meta fields |
| POST /voucher/content | 2 | 2 | **4** | LOW | Chỉ ảnh hưởng hiển thị UI (content1..content6). Edge case data=null phải handle gracefully |
| Accept-Language / i18n | 1 | 1 | **1** | LOW | Chỉ ảnh hưởng ngôn ngữ hiển thị error message |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **POST /voucher/apply** (Score=20): Endpoint phức tạp nhất — business rule "discount=0 sau apply, tính sau calculate", logic xử lý array nhiều voucher, duplicate detection, recheck failed. Nếu sai → đơn hàng bị tính giá sai.
2. **Authentication X-Checkout-Token** (Score=15): Xác thực phiên làm việc checkout — nếu bypass được hoặc token validate sai → security breach.

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|---|---|---|
| voucher/list | Checkout session tồn tại + đã chọn PTTT | Không hiển thị được danh sách voucher cho user |
| voucher/content | voucher_code hợp lệ (thường lấy từ kết quả list) | Không hiển thị được điều kiện/HSD voucher |
| voucher/apply | Checkout session + đã chọn PTTT + voucher/check (optional) | Voucher không được áp dụng vào đơn hàng |
| voucher/check | voucher_code (user nhập hoặc từ list) | User nhập sai voucher sẽ không có cảnh báo sớm |
| Tính giá (calculate API) | voucher/apply phải gọi trước | discount_value = 0 cho đến khi calculate được gọi |

---

## Clarification Risk

Có 5 clarifications chưa resolve (xem `requirement_traceability.md`). Rủi ro ảnh hưởng TC:
- **CLARY-001** (HTTP 400 vs 401 mapping) — ảnh hưởng tất cả negative TCs có assertion HTTP status code
- **CLARY-002** (null vs [] trong apply) — ảnh hưởng SC-VOUCHER-API-015

---

## Thứ tự test đề xuất

```
1. Smoke P1:
   - SC-VOUCHER-API-001 (list - happy path)
   - SC-VOUCHER-API-003 (list - thiếu token)
   - SC-VOUCHER-API-007 (content - happy path)
   - SC-VOUCHER-API-013 (apply - 1 voucher)
   - SC-VOUCHER-API-016 (apply - discount=0 rule)
   - SC-VOUCHER-API-023 (check - is_valid=true)
   - SC-VOUCHER-API-030 (response structure)

2. Risk cao nhất (apply business rules):
   - SC-VOUCHER-API-014 (apply nhiều voucher)
   - SC-VOUCHER-API-015 (gỡ bỏ tất cả)
   - SC-VOUCHER-API-017 (duplicate voucher code)
   - SC-VOUCHER-API-018 (recheck failed)

3. Authentication cross-cutting:
   - SC-VOUCHER-API-004, 005, 006 (list auth errors)
   - SC-VOUCHER-API-012 (content auth)
   - SC-VOUCHER-API-020 (apply auth)
   - SC-VOUCHER-API-029 (check auth)

4. Validation & Boundary:
   - SC-VOUCHER-API-009, 010 (content required/empty)
   - SC-VOUCHER-API-022 (apply thiếu voucher_code)
   - SC-VOUCHER-API-025, 026 (check required/empty)

5. P3 và edge cases:
   - SC-VOUCHER-API-032, 033 (i18n, system error)
```
