# MEMORY — Analyze Requirements Output (Module CHECKOUT)
> Cập nhật lần cuối: 2026-06-01 (lần 2) — BA resolve 8/9 clarification: Số nhà max 50; text lỗi SĐT = "Số điện thoại không hợp lệ"; Internet không có Email; **Chung cư Deferred**; trả trước/sau do QLCS; session/countdown áp dụng mọi DV; pre-fill địa chỉ điền toàn bộ (+SC-CKCOMMON-076). Còn Pending: CLA-CKCOMMON-007 (nội dung popup).
> 2026-06-01 (lần 1) — Re-baseline: module checkout đa dịch vụ. Tài liệu UltraFast cũ đã merge vào `Chucnangcheckout.xlsx`. Thêm sub-module CKCOMMON + INTERNET. Giữ nguyên SC-DANGKYUF (TC + automation đã chạy).

---

## 1. Project Overview

- Dự án: ecom-pdh (FPT Telecom ISC/ECP) | Môi trường: Staging | URL: http://ecp-stag.fpt.net/
- Môi trường liên quan checkout: staging.tongdaiwifi.vn, fpt.vn/checkout, web-admin (saleplatform-stag.fpt.net/web-admin), inside (đối soát HĐ)
- Module này: **CHECKOUT** — luồng checkout dùng chung cho nhiều dịch vụ.
- Phạm vi đã phân tích: **UltraFast (DANGKYUF)** + **Màn checkout chung (CKCOMMON)** + **Internet (INTERNET)**.
- **Chưa phân tích (chờ tài liệu):** Camera, Smart Home, Smart Tivi, AP.
- Khác biệt cốt lõi: UltraFast online-only (không COD), chỉ SĐT (+Email), 1 bước; Internet đầy đủ COD+Online, có địa chỉ lắp đặt, 3 bước, trả trước/trả sau.

---

## 2. Document Registry

| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |
|---|---|---|---|---|---|
| DOC-CK-01 | Chucnangcheckout.xlsx (sheets: Rule common, Đăng ký UltraFast, Đăng ký camera, Đăng ký internet) | Functional Spec | 2026-06-01 | Analyzed (UltraFast, Internet, Rule common); Camera chưa phân tích | DANGKYUF, CKCOMMON, INTERNET |
| DOC-CK-02 | TC_checkout.xlsx (sheets: Thông tin chung, Checkout Smart Home, Checkout Camera) | TC tham chiếu (BA/QC) | 2026-06-01 | Analyzed (Thông tin chung → CKCOMMON); Smart Home/Camera tham khảo | CKCOMMON |
| DOC-CK-03 | camera.png | Mockup UI (màn Checkout Camera) | 2026-06-01 | Tham khảo (Camera chưa phân tích) | (Camera) |
| ~~DOC-UF-01/02~~ | ~~dang ky dich ultraFast.xlsx~~ | Functional Spec | 2026-05-28 | **Merged → DOC-CK-01** (file gốc đã xóa) | DANGKYUF |

---

## 3. Module Summary

> Số liệu dưới là **scenario định nghĩa** (gồm cả deferred/blocked). P1/P2/P3 theo định nghĩa.

| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |
|---|---|---|---|---|---|---|---|
| DANGKYUF — UltraFast | DOC-CK-01 | 9 | 24 (1 blocked) | 13 | 9 | 2 | High |
| CKCOMMON — Màn checkout chung | DOC-CK-01, DOC-CK-02 | 18 (1 deferred) | 76 (4 deferred, +SC-076) | 25 | 41 | 10 | High |
| INTERNET — Đăng ký Internet | DOC-CK-01 | 4 | 16 | 12 | 3 | 1 | High |
| **TOTAL** | | **31** | **116** | **50** | **53** | **13** | |

> **Active = 111** (P1:50, P2:48, P3:13). Trừ đi: **4 deferred** (SC-CKCOMMON-037→040 Chung cư — CLA-CKCOMMON-006, đều P2) + **1 blocked** (SC-DANGKYUF-015 voucher, P2). REQ-CKCOMMON-011 (Chung cư) deferred.

---

## 4. Scenario Index

### DANGKYUF — UltraFast (24, chi tiết per-scenario)

| Scenario ID | Tên ngắn | Priority | Test Type | TC Status |
|---|---|---|---|---|
| SC-DANGKYUF-001 | B1 navigate sang checkout | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-002 | Checkout load đúng chu kỳ + tiền | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-003 | Block sản phẩm hiển thị đúng | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-004 | SĐT hợp lệ — nhập thành công | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-005 | SĐT trống → required | P1 | Negative | ✅ Đã tạo |
| SC-DANGKYUF-006 | SĐT < 10 số → sai định dạng | P2 | Negative | ✅ Đã tạo (text updated → TC_DANGKYUF.7) |
| SC-DANGKYUF-007 | SĐT không bắt đầu 0 → lỗi | P2 | Negative | ✅ Đã tạo (text updated → TC_DANGKYUF.8) |
| SC-DANGKYUF-008 | SĐT > 10 số → không nhập thêm | P2 | Boundary | ✅ Đã tạo |
| SC-DANGKYUF-009 | Icon X xóa data SĐT | P2 | UI | ✅ Đã tạo |
| SC-DANGKYUF-010 | PTTT load đúng theo QLCS | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-011 | Không có COD trong PTTT | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-012 | QLCS N PTTT → hiển thị N | P2 | Business Rule | ✅ Đã tạo |
| SC-DANGKYUF-013 | Block TTKH auto-load | P2 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-014 | Cần thanh toán = tổng tiền | P1 | Functional | ✅ Đã tạo |
| ~~SC-DANGKYUF-015~~ | ~~Cần thanh toán đã trừ voucher~~ | P2 | Functional | 🚫 Blocked (voucher chưa implement) |
| SC-DANGKYUF-016 | Trường bắt buộc chưa nhập → block TT | P1 | Negative | ✅ Đã tạo |
| SC-DANGKYUF-017 | Chính sách không active → lỗi | P1 | Negative | ✅ Đã tạo |
| SC-DANGKYUF-018 | Tất cả hợp lệ → thực hiện TT | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-019 | TT online thành công → hoàn tất | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-020 | Hủy tại 3rd party → về checkout | P1 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-021 | Back từ 3rd party → chỉ PTTT edit | P2 | Functional | ✅ Đã tạo |
| SC-DANGKYUF-022 | Logo FPT → FPT.vn | P3 | UI | ✅ Đã tạo |
| SC-DANGKYUF-023 | Quay lại → Chi tiết | P2 | UI | ✅ Đã tạo |
| SC-DANGKYUF-024 | Text điều khoản → privacy-policy | P3 | UI | ✅ Đã tạo |

### CKCOMMON — Màn checkout chung (75, theo nhóm — chi tiết Given/When/Then xem test_scenario_map.md)

| SC Range | Feature | Count | Priority | Test Type | TC Status |
|---|---|---|---|---|---|
| SC-CKCOMMON-001→003 | C1 Header & điều hướng | 3 | P3 | UI | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-004→005 | C2 Tiến trình các bước | 2 | P2,P3 | UI/Functional | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-006 | C3 Block Sản phẩm dịch vụ đã chọn | 1 | P1 | Functional | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-007→011 | C4 Họ tên validation | 5 | P1,P2,P3 | Functional/Negative/Boundary/UI | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-012→017 | C5 Số điện thoại validation | 6 | P1,P2,P3 | Functional/Negative/Boundary/UI | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-018→021 | C6 Email (Hyperfast/UF) | 4 | P2 | Functional/Negative | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-022→027, 076 | C7 Địa chỉ — Tỉnh/Thành phố (+ pre-fill địa chỉ) | 7 | P2,P3 | Functional/Negative/UI | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-028→031 | C8 Phường/Xã + kiểm tra chính sách giá | 4 | P1,P2 | Functional/Negative | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-032→033 | C9 Tên đường | 2 | P2 | Functional/Negative | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-034→036 | C10 Nhà riêng / Số nhà | 3 | P2 | Functional/Negative/Boundary | ✅ Đã tạo (checkout v1.0) |
| ~~SC-CKCOMMON-037→040~~ | C11 Chung cư | 4 | P2 | — | 🚫 Deferred (CLA-CKCOMMON-006 — chưa phát triển) |
| SC-CKCOMMON-041 | C12 Ghi chú | 1 | P3 | Boundary | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-042→047 | C13 Popup Địa chỉ hành chính cũ | 6 | P1,P2 | Functional/UI/Negative | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-048→050 | C14 Block Thông tin khách hàng | 3 | P2,P3 | Functional/UI | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-051→055 | C15 Block Phương thức thanh toán | 5 | P1,P2 | Functional/UI/Business Rule | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-056→061 | C16 Block Thông tin thanh toán + Mã ưu đãi | 6 | P1,P2,P3 | Functional/Negative/UI | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-062→070 | C17 Luồng thanh toán | 9 | P1,P2 | Functional/Negative | ✅ Đã tạo (checkout v1.0) |
| SC-CKCOMMON-071→075 | C18 Màn hình Hoàn tất đơn hàng | 5 | P1,P2 | Functional/Integration | ✅ Đã tạo (checkout v1.0) |

### INTERNET — Đăng ký Internet (16, theo nhóm)

| SC Range | Feature | Count | Priority | Test Type | TC Status |
|---|---|---|---|---|---|
| SC-INTERNET-001→002 | I1 Điều hướng & tiến trình 3 bước | 2 | P1,P3 | Functional/UI | ✅ Đã tạo (checkout v1.0) |
| SC-INTERNET-003→007 | I2 B1 Thông tin đăng ký | 5 | P1,P2 | Functional/Negative | ✅ Đã tạo (checkout v1.0) |
| SC-INTERNET-008→013 | I3 B2 Thanh toán (trả trước/sau, giá động) | 6 | P1 | Functional | ✅ Đã tạo (checkout v1.0) |
| SC-INTERNET-014→016 | I4 B3 Hoàn tất | 3 | P1 | Functional/Negative | ✅ Đã tạo (checkout v1.0) |

> TC Status: ⏳ Chưa tạo / ✅ Đã tạo / 🔄 Cần update / 🚫 Blocked
> Chi tiết Given/When/Then của CKCOMMON + INTERNET → xem `test_scenario_map.md`.

---

## 5. Test Data Summary

*(Không tạo test_data_catalog.md — user tự nhập khi execute, theo yêu cầu 2026-06-01)*

Key data cần chuẩn bị khi execute:
- **SĐT hợp lệ:** 10 số, bắt đầu 0 (VD: 0901234567). **Không hợp lệ:** < 10 số, đầu khác 0, có ký tự không phải số, > 10 số.
- **Họ tên:** hợp lệ (chỉ chữ + khoảng trắng); không hợp lệ (số/ký tự đặc biệt); > 100 ký tự (boundary).
- **Địa chỉ:** Tỉnh/Phường-Xã/Tên đường **có chính sách** (giá đổi/không đổi); địa chỉ **không có chính sách** (test popup + đẩy KHTN); địa chỉ chung cư (có data Tên chung cư).
- **Gói/Chính sách QLCS:** gói còn active; gói có ≥1 chính sách hết hiệu lực (SC-CKCOMMON-070, SC-DANGKYUF-017); bộ ≤4 PTTT và bộ >4 PTTT; PTTT có CTKM.
- **Internet:** gói trả trước + gói trả sau; địa chỉ có giá khác nhau (giá động).
- **Mã ưu đãi:** mã hợp lệ đang hoạt động; mã không hợp lệ/hết hạn.
- **PTTT test web:** ATM, Visa/Credit. **PTTT cần app mobile:** Momo, VietQR, Zalopay.
- **Account:** có quyền web-admin + inside để đối soát đơn hàng/HĐ (SC-CKCOMMON-075).

---

## 6. Clarifications & Blockers

| # | Req ID | DOC Source | Vấn đề | Answer (BA 2026-06-01) | Status | Ảnh hưởng TC |
|---|---|---|---|---|---|---|
| CLA-CKCOMMON-001 | REQ-CKCOMMON-010 | Rule common R7 vs Thông tin chung R75 | Giới hạn Số nhà: 50 hay 100? | **Max 50 ký tự** | ✅ Resolved | SC-CKCOMMON-036 → 50 |
| CLA-CKCOMMON-002 | REQ-CKCOMMON-004 | Đăng ký UltraFast/camera R34-35 | Checkbox "Tôi muốn nhận hóa đơn" áp dụng Internet/Camera? | **Internet/Camera KHÔNG có** | ✅ Resolved | Không tạo SC |
| CLA-CKCOMMON-003 | REQ-CKCOMMON-007 | Camera R21 | "Địa chỉ trước sáp nhập" / pre-fill hoạt động thế nào? | **Điền toàn bộ; mọi DV có link** | ✅ Resolved | + SC-CKCOMMON-076 |
| CLA-CKCOMMON-004 | REQ-CKCOMMON-005 | Thông tin chung R39-40 | Text lỗi SĐT sai định dạng? | **"Số điện thoại không hợp lệ"** | ✅ Resolved | SC-CKCOMMON-014,015 |
| CLA-CKCOMMON-005 | REQ-CKCOMMON-006 | Đăng ký internet (không Email) | Internet có Email không? | **Không** (chỉ UF/Hyperfast) | ✅ Resolved | SC-CKCOMMON-018→021 chỉ UF/Hyperfast |
| CLA-CKCOMMON-006 | REQ-CKCOMMON-011 | Thông tin chung R78 | Tên chung cư có bắt buộc không? | **Bỏ qua Chung cư — chưa phát triển ver này** | ✅ Resolved | SC-CKCOMMON-037→040 🚫 Deferred |
| CLA-CKCOMMON-007 | REQ-CKCOMMON-008 | Thông tin chung R93 | Nội dung popup "Chưa hỗ trợ chính sách!" | BA bổ sung sau | ⏳ **Pending** | SC-CKCOMMON-031 (text TBD) |
| CLA-INTERNET-001 | REQ-INTERNET-003 | Đăng ký internet R35-36 | Trả trước/sau xác định thế nào? | **Theo QLCS quy định; trả sau thường 1 tháng** | ✅ Resolved | SC-INTERNET-008,009 |
| CLA-INTERNET-002 | REQ-CKCOMMON-017 | Thông tin chung R153-154 | Session 20p + countdown ~15p áp dụng Internet? | **Áp dụng tất cả DV** | ✅ Resolved | SC-CKCOMMON-066,067 |
| CLARY-DANGKYUF-001..005 | (UltraFast) | — | 5 clarification UltraFast | — | **Resolved** 2026-05-28 | (xem requirement_traceability.md) |
| DEFECT-DANGKYUF-001 | REQ-DANGKYUF-004 | SC-DANGKYUF-011 | Staging hiển thị COD trong PTTT UltraFast (trái spec) | BA xác nhận: bug staging, chờ Dev fix | **Defect — Open** | TC_DANGKYUF.12 giữ FAIL |

---

## 7. TC Generation Log

| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
|---|---|---|---|---|---|
| DOC-CK-01 (UltraFast) | 2026-05-28 | 28 | functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_dangkyUF_v1.0.xlsx | v1.0 | UltraFast. High:13 Med:13 Low:2 \| Blocked:3 \| Auto Y:20 N:8 |
| DOC-CK-01 (UltraFast) | 2026-05-30 | 2 updated | (như trên) | v1.0 (in-place) | BA đổi text lỗi SĐT → "Số điện thoại chưa đúng, mời nhập lại" (TC.7, TC.8) |
| Run automation | 2026-05-30 | 17 Pass / 3 Fail / 8 Block | _results/..._results_20260530.xlsx | — | sync-tc-results Round 1 (xem ghi chú UltraFast) |
| DOC-CK-01, DOC-CK-02 (CKCOMMON) | 2026-06-01 | 78 | functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx (sheet Checkout_Common) | v1.0 | TC_CKCOMMON. High:26 Med:45 Low:7 \| Auto Y:70 N:8 \| BLOCKED:3 (TC_CKCOMMON.33 nội dung popup CLA-007; .76 PTTT rỗng; .77 API chính sách lỗi) \| Chung cư deferred — không gen |
| DOC-CK-01 (INTERNET) | 2026-06-01 | 18 | functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx (sheet Checkout_Internet) | v1.0 | TC_INTERNET. High:13 Med:4 Low:1 \| Auto Y:13 N:5 |
| Sửa TC theo rule review | 2026-06-02 | 7 sửa (in-place v1.0) | functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx | v1.0 | Đối chiếu Rule common (Chucnangcheckout.xlsx): CK.9 "Vui lòng nhập họ tên." (bỏ "và"); CK.38 "Vui lòng nhập số nhà." (bỏ "địa chỉ/"); CK.15/.16 thêm dấu "."; CK.27 bỏ radio (không có trong Rule common); CK.33 behavior theo rule (đẩy KHTN + về homepage); CK.37 radio→đặc thù thiết bị (Auto N). Auto Y:69 N:9 |
| Run automation (Internet) | 2026-06-02 | 38 Pass / 0 Fail / 58 Block | _results/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0_results_2026-06-02.xlsx | — | sync-tc-results Round 1. Automation 37 test (gói goi-giga) 37/37 PASS → 38 TC ID Pass. Block 58 = Auto?=N manual:13 + [BLOCKED]:3 + Auto=Y chưa tự động (N/A Internet: email/voucher/chung cư; cần data backend):42. Staging latency cần --retries để xanh ổn định |
