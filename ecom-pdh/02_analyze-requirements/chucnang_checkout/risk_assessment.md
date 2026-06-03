# Risk Assessment — Module CHECKOUT (đa dịch vụ)

## Hướng dẫn: Risk Score = Business Impact (1-5) × Complexity (1-5)

| Mức rủi ro | Score |
|---|---|
| High | ≥ 15 |
| Medium | 8–14 |
| Low | ≤ 7 |

> Phạm vi: UltraFast (DANGKYUF) + Màn checkout chung (CKCOMMON) + Internet (INTERNET) + Camera (CAMERA) + Access Point (AP).
> Cập nhật 2026-06-03: thêm CAMERA + AP (DOC-CK-04). Field validation tái dùng CKCOMMON nên rủi ro tập trung ở Địa chỉ lắp đặt + Luồng thanh toán (COD/Online 3rd party).

---

## Ma trận rủi ro

### DANGKYUF — UltraFast

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|---|---|---|---|---|
| B1 — Điều hướng sang Checkout (REQ-DANGKYUF-001) | 3 | 1 | **3** | Smoke test; verify redirect + data passing |
| Block Sản phẩm dịch vụ (REQ-DANGKYUF-002) | 3 | 1 | **3** | Verify display match lựa chọn B1 |
| Block TTCN — SĐT validation (REQ-DANGKYUF-003) | 3 | 2 | **6** | Positive + negative + boundary |
| Block PTTT — Online only, load QLCS (REQ-DANGKYUF-004) | 5 | 3 | **15** | Rủi ro cao: lọc COD + cấu hình dynamic; test nhiều config QLCS |
| Block TTKH — auto load (REQ-DANGKYUF-005) | 2 | 2 | **4** | Verify data load chính xác |
| Block TTTT + Cần thanh toán (REQ-DANGKYUF-006) | 4 | 2 | **8** | Verify tổng tiền; voucher blocked |
| Button Thanh toán — validate + policy (REQ-DANGKYUF-007) | 4 | 3 | **12** | 3 nhánh: required, policy, happy path |
| Luồng thanh toán Online — 3rd party (REQ-DANGKYUF-008) | 5 | 4 | **20** | Rủi ro cao: tích hợp 3rd party, state sau cancel |
| Navigation (REQ-DANGKYUF-009) | 2 | 1 | **2** | Kiểm tra nhanh cuối sprint |

### CKCOMMON — Màn checkout chung

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|---|---|---|---|---|
| Header & điều hướng (REQ-CKCOMMON-001) | 2 | 1 | **2** | Smoke nhanh |
| Tiến trình các bước (REQ-CKCOMMON-002) | 2 | 1 | **2** | Smoke nhanh |
| Block Sản phẩm dịch vụ (REQ-CKCOMMON-003) | 3 | 1 | **3** | Verify load đúng |
| Họ tên — validation (REQ-CKCOMMON-004) | 3 | 2 | **6** | Required + format + boundary + trim |
| Số điện thoại — validation (REQ-CKCOMMON-005) | 3 | 2 | **6** | Required + format + boundary (⚠️ đồng bộ text lỗi) |
| Email — validation (REQ-CKCOMMON-006) | 2 | 2 | **4** | Chỉ Hyperfast/UF; optional + format |
| Địa chỉ — Tỉnh/Thành phố (REQ-CKCOMMON-007) | 4 | 3 | **12** | Dropdown ĐCHC mới, search, cascade load |
| Địa chỉ — Phường/Xã + kiểm tra chính sách giá (REQ-CKCOMMON-008) | 5 | 4 | **20** | Rủi ro cao: gọi API chính sách, cập nhật giá, địa chỉ không CS → popup + đẩy KHTN |
| Địa chỉ — Tên đường (REQ-CKCOMMON-009) | 3 | 2 | **6** | Search contains + chọn |
| Địa chỉ — Nhà riêng / Số nhà (REQ-CKCOMMON-010) | 3 | 2 | **6** | Required + boundary (⚠️ CLA giới hạn 50/100) |
| ~~Địa chỉ — Chung cư (REQ-CKCOMMON-011)~~ | — | — | 🚫 Deferred | CLA-CKCOMMON-006: ver hiện tại chưa phát triển Chung cư — không gen TC |
| Địa chỉ — Ghi chú (REQ-CKCOMMON-012) | 2 | 1 | **2** | Optional + boundary |
| Popup Địa chỉ hành chính cũ (REQ-CKCOMMON-013) | 4 | 4 | **16** | Rủi ro cao: convert 3→2 cấp, cascade 4 cấp, validate enable Xác nhận |
| Block Thông tin khách hàng (REQ-CKCOMMON-014) | 2 | 2 | **4** | Format Nhà riêng/Chung cư, read-only |
| Block Phương thức thanh toán (REQ-CKCOMMON-015) | 5 | 3 | **15** | Rủi ro cao: dynamic theo QLCS, ≤4/>4, thứ tự CTKM, chỉ chọn 1 |
| Block TTTT + Mã ưu đãi (REQ-CKCOMMON-016) | 4 | 3 | **12** | Tính giá + áp mã KM hợp lệ/không hợp lệ |
| Luồng thanh toán (REQ-CKCOMMON-017) | 5 | 5 | **25** | Rủi ro cao nhất: COD/Online, double-click, session 20p, countdown 3rd party, back, hủy, CS hết hiệu lực |
| Màn hình Hoàn tất đơn hàng (REQ-CKCOMMON-018) | 4 | 3 | **12** | Verify trạng thái + đối soát đơn hàng/HĐ (webadmin/inside) |

### INTERNET — Đăng ký Internet

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|---|---|---|---|---|
| Điều hướng & tiến trình 3 bước (REQ-INTERNET-001) | 3 | 2 | **6** | Smoke 3 bước |
| B1 — Thông tin đăng ký (REQ-INTERNET-002) | 4 | 3 | **12** | Validate Tiếp tục, load Thông tin lắp đặt, giá theo địa chỉ |
| B2 — Thanh toán (trả trước/sau, giá động) (REQ-INTERNET-003) | 5 | 4 | **20** | Rủi ro cao: phân biệt trả trước/sau (⚠️ CLA), giá động theo địa chỉ, PTTT có COD |
| B3 — Hoàn tất (REQ-INTERNET-004) | 4 | 2 | **8** | COD / Online thành công / thất bại (giữ data) |

### CAMERA — Đăng ký Camera

> Field validation tái dùng CKCOMMON → rủi ro field-level đã cover ở CKCOMMON. Dưới đây là rủi ro đặc thù dịch vụ Camera.

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|---|---|---|---|---|
| B1 — Chọn chu kỳ + số lượng → Checkout (REQ-CAMERA-001) | 3 | 2 | **6** | Verify redirect + load đúng chu kỳ/SL/tiền |
| Block Sản phẩm + header 2 bước (REQ-CAMERA-002) | 3 | 1 | **3** | Verify display |
| Block Thông tin cá nhân (REQ-CAMERA-003) | 3 | 2 | **6** | Refer CKCOMMON C4/C5 |
| Block Địa chỉ lắp đặt + popup + chính sách giá (REQ-CAMERA-004) | 5 | 4 | **20** | Rủi ro cao: refer CKCOMMON C8/C13; radio Nhà riêng/Chung cư (Chung cư deferred); note giao hàng |
| Block PTTT COD + Online theo QLCS (REQ-CAMERA-005) | 4 | 3 | **12** | Dynamic QLCS, COD "Thanh toán tại nhà" + CTKM, refer CKCOMMON C15 |
| Block TTKH + "Thời gian lắp đặt" (REQ-CAMERA-006) | 3 | 2 | **6** | Verify auto-load; nguồn "Thời gian lắp đặt" chờ CLA-CAMERA-001 |
| Block TTTT + Mã ưu đãi (REQ-CAMERA-007) | 4 | 3 | **12** | Itemized + Cần thanh toán; voucher blocked |
| Button Thanh toán — validate + policy (REQ-CAMERA-008) | 4 | 3 | **12** | required + policy active + happy path |
| B3 — Hoàn tất (COD/Online success/fail, 3rd party) (REQ-CAMERA-010) | 5 | 4 | **20** | Rủi ro cao: tích hợp 3rd party, giữ data khi fail |
| Navigation (REQ-CAMERA-009) | 2 | 1 | **2** | Smoke nhanh |

### AP — Đăng ký Access Point

> Giống Camera, trừ B1 chỉ số lượng (không chu kỳ) → complexity B1 thấp hơn.

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|---|---|---|---|---|
| B1 — Chọn số lượng → Checkout (REQ-AP-001) | 3 | 1 | **3** | Verify redirect + load SL/tiền (không chu kỳ) |
| Block Thông tin cá nhân (REQ-AP-002) | 3 | 2 | **6** | Refer CKCOMMON C4/C5 |
| Block Địa chỉ lắp đặt + popup + chính sách giá (REQ-AP-003) | 5 | 4 | **20** | Rủi ro cao: refer CKCOMMON C8/C13 |
| Block PTTT COD + Online theo QLCS (REQ-AP-004) | 4 | 3 | **12** | Dynamic QLCS, refer CKCOMMON C15 |
| Block TTKH (REQ-AP-005) | 2 | 2 | **4** | Verify auto-load |
| Block TTTT + Cần thanh toán + Mã ưu đãi (REQ-AP-006) | 4 | 3 | **12** | Tổng tiền; voucher blocked |
| Button Thanh toán — validate + policy (REQ-AP-007) | 4 | 3 | **12** | required + policy active + happy path |
| B3 — Hoàn tất (COD/Online success/fail, 3rd party) (REQ-AP-009) | 5 | 4 | **20** | Rủi ro cao: tích hợp 3rd party, giữ data khi fail |
| Navigation (REQ-AP-008) | 2 | 1 | **2** | Smoke nhanh |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **CKCOMMON — Luồng thanh toán (Score 25)** — REQ-CKCOMMON-017
   - Phức tạp nhất: phân nhánh COD/Online, double-click chống double đơn, session checkout 20p, countdown 3rd party ~15p, back từ 3rd party (disable info), hủy/thất bại → đẩy KHTN, chính sách hết hiệu lực.
   - Phụ thuộc tích hợp nhiều cổng 3rd party (ATM/Visa test web; Momo/VietQR/Zalopay cần app mobile).

2. **CKCOMMON — Phường/Xã + kiểm tra chính sách giá (Score 20)** — REQ-CKCOMMON-008
   - Gọi API chính sách khi đổi Phường/Xã → cập nhật giá Tạm tính.
   - Địa chỉ không có chính sách → popup "Chưa hỗ trợ chính sách!" + đẩy KHTN + chặn bước thanh toán.

3. **INTERNET — B2 Thanh toán trả trước/trả sau, giá động (Score 20)** — REQ-INTERNET-003
   - Giá động theo địa chỉ (mỗi địa chỉ giá khác); phân biệt trả trước (phí dịch vụ + lắp đặt) vs trả sau (chỉ phí lắp đặt).

4. **DANGKYUF — Luồng thanh toán Online 3rd party (Score 20)** — REQ-DANGKYUF-008 (xem ghi chú UltraFast).

5. **CKCOMMON — Popup Địa chỉ hành chính cũ (Score 16)** — REQ-CKCOMMON-013
   - Convert địa chỉ 3 cấp → 2 cấp; cascade 4 dropdown; validate enable btn Xác nhận.

6. **CKCOMMON — Block Phương thức thanh toán (Score 15)** — REQ-CKCOMMON-015
   - Dynamic theo QLCS; logic ≤4/>4 PTTT + Xem thêm; thứ tự ưu tiên CTKM; chỉ chọn 1.

7. **DANGKYUF — Block PTTT Online only (Score 15)** — REQ-DANGKYUF-004 (UltraFast tuyệt đối không COD).

8. **CAMERA — Block Địa chỉ lắp đặt + chính sách giá (Score 20)** & **B3 Luồng thanh toán COD/Online 3rd party (Score 20)** — REQ-CAMERA-004, REQ-CAMERA-010 (tái dùng cơ chế CKCOMMON C8/C13/C17).

9. **AP — Block Địa chỉ lắp đặt + chính sách giá (Score 20)** & **B3 Luồng thanh toán COD/Online 3rd party (Score 20)** — REQ-AP-003, REQ-AP-009.

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|---|---|---|
| Luồng thanh toán (CKCOMMON-017 / DANGKYUF-008 / INTERNET-003) | Validate trường bắt buộc + chọn PTTT | Không test được success/cancel flow |
| Phường/Xã kiểm tra chính sách (CKCOMMON-008) | API chính sách + data địa chỉ có/không CS trên QLCS | Không test được cập nhật giá + popup không CS |
| Block PTTT (CKCOMMON-015 / DANGKYUF-004) | Cấu hình QLCS còn active, ≥2 bộ config | Không test được dynamic + thứ tự CTKM |
| INTERNET B2 giá động (INTERNET-003) | Data QLCS theo từng địa chỉ; phân loại trả trước/sau ⚠️CLA-INTERNET-001 | Không xác định được nhánh giá đúng |
| Popup Địa chỉ hành chính cũ (CKCOMMON-013) | Data ĐCHC 3 cấp + bảng convert 3→2 cấp | Không test được đẩy địa chỉ mới vào form |
| Màn Hoàn tất — đối soát (CKCOMMON-018) | Quyền truy cập webadmin + inside | Không verify được đơn hàng/HĐ |
| CAMERA / AP toàn bộ field + popup + PTTT | TC CKCOMMON (C4-C18) đã pass | Nếu CKCOMMON đổi → Camera/AP ảnh hưởng theo (chỉ test phần đặc thù) |
| CAMERA/AP — Mã ưu đãi (CAMERA-007 / AP-006) | Module voucher implement | SC-CAMERA-019, SC-AP-018 Blocked đến khi voucher xong |
| CAMERA — "Thời gian lắp đặt" (CAMERA-006) | Nguồn data lịch lắp đặt (CLA-CAMERA-001) | Không verify được giá trị field |

---

## Thứ tự test đề xuất

```
1. Smoke P1 — Điều hướng + load checkout (CKCOMMON-006, INTERNET-001/003/005; DANGKYUF-001/002/003)
2. High risk — Luồng thanh toán (CKCOMMON-062→070; DANGKYUF-018→021; INTERNET-013→016)
3. High risk — Phường/Xã + kiểm tra chính sách giá (CKCOMMON-030, 031)
4. High risk — INTERNET trả trước/trả sau + giá động (INTERNET-008→012)
5. High risk — Popup Địa chỉ hành chính cũ (CKCOMMON-042→047)
6. High risk — Block PTTT dynamic (CKCOMMON-051→055; DANGKYUF-010,011,012)
7. Core validation — Họ tên / SĐT / Email / Địa chỉ required + format (CKCOMMON-007→041)
8. Mã ưu đãi (CKCOMMON-058→061)
9. Màn Hoàn tất + đối soát (CKCOMMON-071→075; INTERNET-014,015)
10. P3 UI — Header, tiến trình, collapse/expand, navigation
```

---

## Ghi chú đặc thù

- **PTTT Momo/VietQR/Zalopay:** cần app mobile để test; ATM/Visa test trực tiếp web (theo ghi chú Rule common).
- **UltraFast vs Internet — khác biệt cốt lõi:** UF online-only (không COD), chỉ SĐT (+Email), 1 bước; Internet đầy đủ COD+Online, có địa chỉ lắp đặt, 3 bước, trả trước/trả sau.
- **CAMERA / AP — khác biệt:** đều có COD + Online, có Địa chỉ lắp đặt, màn **2 bước** (Thanh toán → Hoàn tất). Camera có **chu kỳ** (vd Cloud 6 tháng) + note giao hàng 3-7 ngày + "Thời gian lắp đặt"; AP **chỉ số lượng**, không chu kỳ. Field-level validation tái dùng CKCOMMON → khi viết TC chỉ cần phần đặc thù (chọn gói + COD/Online + hoàn tất), tham chiếu CKCOMMON cho phần còn lại (giống chiến lược `gen-testcase-checkout-service`).
- **Camera/AP Chung cư:** mockup Camera có radio Nhà riêng/Chung cư nhưng Chung cư **deferred** (CLA-CKCOMMON-006) — áp dụng chung mọi DV.
- **Clarifications (2026-06-01):** 8/9 đã resolve — Số nhà max **50**; SĐT lỗi định dạng = **"Số điện thoại không hợp lệ"**; Internet **không** có Email; **Chung cư deferred**; trả trước/sau **do QLCS quy định**; session 20p + countdown ~15p **áp dụng mọi DV**; pre-fill địa chỉ **điền toàn bộ** (+ SC-CKCOMMON-076). Còn **Pending: CLA-CKCOMMON-007** (nội dung popup "Chưa hỗ trợ chính sách!" — BA bổ sung sau) → SC-CKCOMMON-031 chờ nội dung text.
- **DEFECT-DANGKYUF-001** (COD hiển thị trong UltraFast trên staging) vẫn Open — chờ Dev fix.
