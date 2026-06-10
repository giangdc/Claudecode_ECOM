# Risk Assessment — chucnang_Voucher (API + UI)
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
| **[UI] Chọn voucher + áp dụng vào checkout** | 5 | 3 | **15** | HIGH | Flow chính KH tương tác — sai modal/summary → KH không áp dụng được voucher, mất discount |
| **[UI] Lọc voucher theo điều kiện + PTTT mismatch** | 4 | 4 | **16** | HIGH | Logic filter + xử lý mismatch PTTT phức tạp, chưa có BA spec rõ ràng (CLA-FIGMA-001, CLA-FIGMA-004) — rủi ro cao cho regression |
| **[UI] Modal Empty State + trạng thái không có voucher** | 3 | 2 | **6** | MEDIUM | Ảnh hưởng UX khi KH không có voucher — sai message/display → nhầm lẫn |
| **[UI] Màn hình Chi tiết Ưu đãi / Điều khoản** | 3 | 2 | **6** | MEDIUM | Hiển thị thông tin pháp lý (điều khoản, HSD) — sai có thể gây khiếu nại |
| **[UI] Voucher card disabled state** | 2 | 2 | **4** | LOW | Ảnh hưởng UX — chưa có thiết kế Figma (CLA-FIGMA-002) |
| **[UI] Mobile sticky bottom bar** | 2 | 1 | **2** | LOW | Chỉ ảnh hưởng hiển thị mobile, không ảnh hưởng nghiệp vụ |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **POST /voucher/apply** (Score=20): Endpoint phức tạp nhất — business rule "discount=0 sau apply, tính sau calculate", logic xử lý array nhiều voucher, duplicate detection, recheck failed. Nếu sai → đơn hàng bị tính giá sai.
2. **Authentication X-Checkout-Token** (Score=15): Xác thực phiên làm việc checkout — nếu bypass được hoặc token validate sai → security breach.
3. **[UI] Lọc voucher + PTTT mismatch** (Score=16): Logic nghiệp vụ phức tạp chưa có spec đầy đủ — 2 open clarifications (CLA-FIGMA-001, CLA-FIGMA-004). Rủi ro: viết TC sai → miss bug production.
4. **[UI] Chọn voucher + áp dụng** (Score=15): Flow KH chính — lỗi modal display hoặc summary update → KH không apply được voucher.

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|---|---|---|
| voucher/list | Checkout session tồn tại + đã chọn PTTT | Không hiển thị được danh sách voucher cho user |
| voucher/content | voucher_code hợp lệ (thường lấy từ kết quả list) | Không hiển thị được điều kiện/HSD voucher |
| voucher/apply | Checkout session + đã chọn PTTT + voucher/check (optional) | Voucher không được áp dụng vào đơn hàng |
| voucher/check | voucher_code (user nhập hoặc từ list) | User nhập sai voucher sẽ không có cảnh báo sớm |
| Tính giá (calculate API) | voucher/apply phải gọi trước | discount_value = 0 cho đến khi calculate được gọi |
| [UI] Modal danh sách voucher | voucher/list API | Modal empty state nếu API lỗi; danh sách không đúng nếu filter API sai |
| [UI] Summary sau áp dụng | voucher/apply + calculate API | Giá hiển thị sai nếu API response sai |
| [UI] PTTT filter voucher | Rule từ BA (CLA-FIGMA-001, CLA-FIGMA-004) | Block viết TC cho SC-UI-010, SC-UI-011 |

---

## Clarification Risk

Có 9 clarifications tổng cộng (API: 5, UI: 4) — xem `requirement_traceability.md`. Rủi ro ảnh hưởng TC:
- **CLARY-001** (HTTP 400 vs 401 mapping) — đã Resolved
- **CLARY-002** (null vs [] trong apply) — Pending BA — SC-VOUCHER-API-015
- **CLA-FIGMA-001** (quy tắc filter voucher trong modal) — **Open, High impact** — SC-VOUCHER-UI-010 partial block
- **CLA-FIGMA-003** (Radio vs Checkbox — 1 hay nhiều voucher) — **Open, High impact** — SC-VOUCHER-UI-002,005
- **CLA-FIGMA-004** (PTTT mismatch xử lý thế nào) — **Open, High impact** — SC-VOUCHER-UI-011 blocked

---

## Thứ tự test đề xuất

```
1. Smoke P1 — API:
   - SC-VOUCHER-API-001 (list - happy path)
   - SC-VOUCHER-API-003 (list - thiếu token)
   - SC-VOUCHER-API-007 (content - happy path)
   - SC-VOUCHER-API-013 (apply - 1 voucher)
   - SC-VOUCHER-API-016 (apply - discount=0 rule)
   - SC-VOUCHER-API-023 (check - is_valid=true)
   - SC-VOUCHER-API-030 (response structure)

2. Smoke P1 — UI:
   - SC-VOUCHER-UI-001 (checkout default state)
   - SC-VOUCHER-UI-002 (modal structure)
   - SC-VOUCHER-UI-004 (modal empty state)
   - SC-VOUCHER-UI-005 (select voucher - tick xanh)
   - SC-VOUCHER-UI-006 (apply - summary update)
   - SC-VOUCHER-UI-007 (chi tiết điều khoản)
   - SC-VOUCHER-UI-008 (apply từ màn chi tiết)

3. Risk cao nhất (API — apply business rules):
   - SC-VOUCHER-API-014 (apply nhiều voucher)
   - SC-VOUCHER-API-015 (gỡ bỏ tất cả)
   - SC-VOUCHER-API-017 (duplicate voucher code)
   - SC-VOUCHER-API-018 (recheck failed)

4. Authentication cross-cutting:
   - SC-VOUCHER-API-004, 005, 006, 012, 020, 029

5. UI P2 (sau khi resolve CLA-FIGMA-001,003,004):
   - SC-VOUCHER-UI-009 (mobile)
   - SC-VOUCHER-UI-010 (filter logic — cần CLA-FIGMA-001)
   - SC-VOUCHER-UI-011 (PTTT mismatch — cần CLA-FIGMA-004)
   - SC-VOUCHER-UI-012 (disabled card — cần CLA-FIGMA-002)
   - SC-VOUCHER-UI-013, 014 (close modal, hủy voucher)

6. P3 và edge cases:
   - SC-VOUCHER-API-032, 033 (i18n, system error)
```
