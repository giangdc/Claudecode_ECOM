# Risk Assessment — Đăng ký dịch vụ UltraFast

## Hướng dẫn: Risk Score = Business Impact (1-5) × Complexity (1-5)

| Mức rủi ro | Score |
|---|---|
| High | ≥ 15 |
| Medium | 8–14 |
| Low | ≤ 7 |

---

## Ma trận rủi ro

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|---|---|---|---|---|
| B1 — Điều hướng sang Checkout (REQ-001) | 3 | 1 | **3** | Smoke test đơn giản; verify redirect + data passing |
| Block Sản phẩm dịch vụ (REQ-002) | 3 | 1 | **3** | Verify display data match với lựa chọn từ B1 |
| Block TTCN — Số điện thoại validation (REQ-003) | 3 | 2 | **6** | Kiểm tra đủ positive + negative + boundary cases |
| Block PTTT — Online only, load theo QLCS (REQ-004) | 5 | 3 | **15** | Rủi ro cao: logic lọc COD + cấu hình dynamic; test nhiều cấu hình QLCS |
| Block Thông tin khách hàng — auto load (REQ-005) | 2 | 2 | **4** | Verify data load chính xác; test case thiếu data ⚠️CLARY-003 |
| Block Thông tin thanh toán + Cần thanh toán (REQ-006) | 4 | 2 | **8** | Verify tính toán tổng tiền; test case có voucher ⚠️CLARY-005 |
| Button Thanh toán — Validate + Policy check (REQ-007) | 4 | 3 | **12** | Kiểm tra cả 3 nhánh: required, policy, happy path |
| Luồng thanh toán Online — 3rd party (REQ-008) | 5 | 4 | **20** | Rủi ro cao: tích hợp 3rd party, nhiều PTTT, state sau cancel |
| Navigation — Logo/Quay lại/Điều khoản (REQ-009) | 2 | 1 | **2** | Kiểm tra nhanh cuối sprint |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **Luồng thanh toán Online — 3rd party (Score 20)** — REQ-DANGKYUF-008
   - Tích hợp nhiều cổng TT (ATM, Momo, VietQR, Zalopay, Thẻ tín dụng)
   - Cần verify trạng thái đơn hàng sau thành công/hủy
   - State UI (disabled fields) sau khi back từ 3rd party
   - Lưu ý: Momo/VietQR/Zalopay cần app mobile để test (theo ghi chú DOC-UF-02)

2. **Block PTTT — Online only, load theo QLCS (Score 15)** — REQ-DANGKYUF-004
   - Business rule: UltraFast tuyệt đối không có COD
   - Danh sách PTTT dynamic theo cấu hình QLCS → cần test nhiều config
   - ⚠️ CLARY-DANGKYUF-004: xử lý khi QLCS chỉ có COD

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|---|---|---|
| Button Thanh toán (REQ-007) | Block TTCN SĐT valid (REQ-003) | Không test được luồng thanh toán |
| Luồng Online — 3rd party (REQ-008) | Button Thanh toán execute (REQ-007) | Không test được success/cancel flow |
| Cần thanh toán — trừ voucher (REQ-006) | Voucher được apply từ bước trước ⚠️CLARY-005 | SC-DANGKYUF-015 blocked nếu không có voucher |
| Block PTTT load đúng (REQ-004) | Cấu hình QLCS còn active | SC-010, SC-012 cần data setup trên QLCS |
| Block Thông tin khách hàng (REQ-005) | Thông tin cá nhân + lắp đặt trong hệ thống | SC-013 cần account test có sẵn data |

---

## Thứ tự test đề xuất

```
1. Smoke P1 — B1 navigate + checkout load (SC-001, SC-002, SC-003)
2. High risk — Block PTTT: verify no COD + load theo QLCS (SC-010, SC-011)
3. High risk — Luồng TT Online: happy path (SC-018 → SC-019)
4. High risk — Luồng cancel/back: SC-020, SC-021
5. Core validation — SĐT: required + format (SC-004, SC-005, SC-006, SC-007)
6. Business rule — QLCS dynamic config (SC-012)
7. Payment total — không voucher (SC-014)
8. Medium risk — Button TT validate: policy check (SC-017)
9. Remaining P2 — SC-008, SC-009, SC-013, SC-015, SC-023
10. P3 — SC-022, SC-024
```

---

## Ghi chú đặc thù UltraFast

- **Thanh toán Momo/VietQR/Zalopay:** Theo ghi chú Rule common, các PTTT này **phải mở app trên mobile** → cần device mobile hoặc test trên browser mobile. Thẻ ATM/Visa có thể test trực tiếp trên web.
- **Chính sách QLCS:** Cần chuẩn bị ít nhất 2 bộ cấu hình: (a) đủ PTTT, (b) PTTT bị deactivate → dùng cho SC-017.
- **CLARY-DANGKYUF-001** (địa chỉ/họ tên): Nếu BA xác nhận có thêm trường → cần bổ sung 4-6 scenarios cho các trường đó trước khi gen TC.
