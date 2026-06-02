# Requirement Traceability Matrix — Module CHECKOUT (đa dịch vụ)

> Phạm vi: UltraFast (DANGKYUF) + Màn checkout chung (CKCOMMON) + Internet (INTERNET).
> Camera / Smart Home / Smart Tivi: chưa phân tích (chờ đủ tài liệu).

## Tài liệu nguồn

| DOC ID | File | Loại | Phiên bản | Ngày phân tích |
|---|---|---|---|---|
| DOC-CK-01 | `00_input/chucnang_checkout/Chucnangcheckout.xlsx` — sheets: Rule common, Đăng ký UltraFast, Đăng ký camera, Đăng ký internet | Functional Spec | v hiện tại (merge từ "dang ky dich ultraFast.xlsx" đã xóa) | 2026-06-01 |
| DOC-CK-02 | `00_input/chucnang_checkout/TC_checkout.xlsx` — sheets: Thông tin chung (TC_01), Checkout Smart Home (TC_05), Checkout Camera (TC_07) | TC tham chiếu (BA/QC) | — | 2026-06-01 |
| DOC-CK-03 | `00_input/chucnang_checkout/camera.png` | Mockup UI (màn Checkout Camera) | — | 2026-06-01 |
| ~~DOC-UF-01/02~~ | ~~dang ky dich ultraFast.xlsx~~ | Functional Spec | — | **Merged → DOC-CK-01** (sheet Đăng ký UltraFast + Rule common); file gốc đã xóa |

---

## Ma trận truy vết

### DANGKYUF — UltraFast (giữ nguyên bản 2026-05-28)

| Req ID | Mô tả | DOC Source | Nguồn | Loại | Scenarios | Mức rủi ro |
|---|---|---|---|---|---|---|
| REQ-DANGKYUF-001 | Điều hướng sang Checkout, load đúng chu kỳ + tiền | DOC-CK-01 | Đăng ký UltraFast R27-29 | Functional | SC-DANGKYUF-001,002 | Low |
| REQ-DANGKYUF-002 | Block Sản phẩm dịch vụ đã chọn | DOC-CK-01 | Đăng ký UltraFast R32 | Functional | SC-DANGKYUF-003 | Low |
| REQ-DANGKYUF-003 | Block TTCN — Số điện thoại (validation) | DOC-CK-01 | Rule common R3 | Business Rule | SC-DANGKYUF-004→009 | Low |
| REQ-DANGKYUF-004 | Block PTTT — Online only, load theo QLCS | DOC-CK-01 | Đăng ký UltraFast R35 | Business Rule | SC-DANGKYUF-010,011,012 | **High** |
| REQ-DANGKYUF-005 | Block Thông tin khách hàng — auto load | DOC-CK-01 | Đăng ký UltraFast R36 | Functional | SC-DANGKYUF-013 | Low |
| REQ-DANGKYUF-006 | Block Thông tin thanh toán + Cần thanh toán | DOC-CK-01 | Đăng ký UltraFast R37-38 | Functional | SC-DANGKYUF-014, ~~015~~ | Medium |
| REQ-DANGKYUF-007 | Button Thanh toán — validate + policy check | DOC-CK-01 | Đăng ký UltraFast R39 | Functional | SC-DANGKYUF-016,017,018 | Medium |
| REQ-DANGKYUF-008 | Luồng thanh toán Online (3rd party) | DOC-CK-01 | Đăng ký UltraFast R40 | Integration | SC-DANGKYUF-019,020,021 | **High** |
| REQ-DANGKYUF-009 | Navigation (Logo / Quay lại / Điều khoản) | DOC-CK-01 | Đăng ký UltraFast R31,40,41 | UI | SC-DANGKYUF-022,023,024 | Low |

### CKCOMMON — Màn checkout chung (dịch vụ có Địa chỉ lắp đặt)

| Req ID | Mô tả | DOC Source | Nguồn | Loại | Scenarios | Mức rủi ro |
|---|---|---|---|---|---|---|
| REQ-CKCOMMON-001 | Header & điều hướng (Logo, back) | DOC-CK-02 | Thông tin chung R12-14 | UI | SC-CKCOMMON-001,002,003 | Low |
| REQ-CKCOMMON-002 | Tiến trình các bước (màu, click bước) | DOC-CK-02 | Thông tin chung R16-18 | UI | SC-CKCOMMON-004,005 | Low |
| REQ-CKCOMMON-003 | Block Sản phẩm dịch vụ đã chọn | DOC-CK-02 | Thông tin chung R20-24 | Functional | SC-CKCOMMON-006 | Low |
| REQ-CKCOMMON-004 | Họ tên — validation | DOC-CK-01, DOC-CK-02 | Rule common R2; Thông tin chung R27-34 | Business Rule | SC-CKCOMMON-007→011 | Medium |
| REQ-CKCOMMON-005 | Số điện thoại — validation | DOC-CK-01, DOC-CK-02 | Rule common R3; Thông tin chung R36-41 | Business Rule | SC-CKCOMMON-012→017 | Medium |
| REQ-CKCOMMON-006 | Email — validation (Hyperfast/UltraFast) | DOC-CK-02 | Thông tin chung R43-49 | Business Rule | SC-CKCOMMON-018→021 | Low |
| REQ-CKCOMMON-007 | Địa chỉ — Tỉnh/Thành phố + pre-fill "Địa chỉ trước sáp nhập" | DOC-CK-01, DOC-CK-02 | Rule common R4; Thông tin chung R52-59; Camera R21 | Functional | SC-CKCOMMON-022→027, 076 | Medium |
| REQ-CKCOMMON-008 | Địa chỉ — Phường/Xã + kiểm tra chính sách giá | DOC-CK-01, DOC-CK-02 | Rule common R5; Thông tin chung R61-65,93-95 | Integration | SC-CKCOMMON-028→031 | **High** |
| REQ-CKCOMMON-009 | Địa chỉ — Tên đường | DOC-CK-01, DOC-CK-02 | Rule common R6; Thông tin chung R67-70 | Functional | SC-CKCOMMON-032,033 | Low |
| REQ-CKCOMMON-010 | Địa chỉ — Nhà riêng / Số nhà | DOC-CK-01, DOC-CK-02 | Rule common R7; Thông tin chung R72-75 | Business Rule | SC-CKCOMMON-034,035,036 | Medium |
| ~~REQ-CKCOMMON-011~~ | ~~Địa chỉ — Chung cư (Tên CC/Tòa nhà/Tầng/Phòng)~~ | DOC-CK-02 | Thông tin chung R77-88 | Business Rule | ~~SC-CKCOMMON-037→040~~ 🚫 Deferred | — |
| REQ-CKCOMMON-012 | Địa chỉ — Ghi chú | DOC-CK-01, DOC-CK-02 | Rule common R8; Thông tin chung R90-92 | Functional | SC-CKCOMMON-041 | Low |
| REQ-CKCOMMON-013 | Popup Địa chỉ hành chính cũ (3 cấp → 2 cấp) | DOC-CK-01, DOC-CK-02 | Rule common R14; Thông tin chung R97-118 | Integration | SC-CKCOMMON-042→047 | **High** |
| REQ-CKCOMMON-014 | Block Thông tin khách hàng (collapse, format, read-only) | DOC-CK-02 | Thông tin chung R120-124 | Functional | SC-CKCOMMON-048,049,050 | Low |
| REQ-CKCOMMON-015 | Block Phương thức thanh toán | DOC-CK-01, DOC-CK-02 | Rule common R13; Thông tin chung R126-135 | Business Rule | SC-CKCOMMON-051→055 | **High** |
| REQ-CKCOMMON-016 | Block Thông tin thanh toán + Mã ưu đãi | DOC-CK-02 | Thông tin chung R137-147 | Functional | SC-CKCOMMON-056→061 | Medium |
| REQ-CKCOMMON-017 | Luồng thanh toán (validate, COD/Online, session, 3rd party) | DOC-CK-01, DOC-CK-02 | Rule common R13; Thông tin chung R149-156; Smart Home R24 | Integration | SC-CKCOMMON-062→070 | **High** |
| REQ-CKCOMMON-018 | Màn hình Hoàn tất đơn hàng | DOC-CK-02 | Thông tin chung R159-168; Smart Home R27-30 | Functional | SC-CKCOMMON-071→075 | Medium |

### INTERNET — Đăng ký Internet (3 bước)

| Req ID | Mô tả | DOC Source | Nguồn | Loại | Scenarios | Mức rủi ro |
|---|---|---|---|---|---|---|
| REQ-INTERNET-001 | Điều hướng & tiến trình 3 bước | DOC-CK-01 | Đăng ký internet R18 | Functional | SC-INTERNET-001,002 | Low |
| REQ-INTERNET-002 | B1 — Thông tin đăng ký + Tiếp tục | DOC-CK-01 | Đăng ký internet R21-33 | Functional | SC-INTERNET-003→007 | Medium |
| REQ-INTERNET-003 | B2 — Thanh toán (trả trước/trả sau, giá động, PTTT, Quay lại) | DOC-CK-01 | Đăng ký internet R35-41 | Integration | SC-INTERNET-008→013 | **High** |
| REQ-INTERNET-004 | B3 — Hoàn tất (COD / Online thành công / thất bại) | DOC-CK-01 | Đăng ký internet R43-45 | Functional | SC-INTERNET-014,015,016 | Medium |

---

## Clarifications Needed

| # | Req ID | DOC Source | Câu hỏi | Answer (BA — 2026-06-01) | Status | Ảnh hưởng TC |
|---|---|---|---|---|---|---|
| CLA-CKCOMMON-001 | REQ-CKCOMMON-010 | Rule common R7 vs Thông tin chung R75 | Giới hạn ký tự **Số nhà**: 50 hay 100? | **Tối đa 50 ký tự** | ✅ Resolved | SC-CKCOMMON-036 → max 50 |
| CLA-CKCOMMON-002 | REQ-CKCOMMON-004 | Đăng ký UltraFast/camera R34-35 | Checkbox "Tôi muốn nhận hóa đơn" áp dụng Internet/Camera? | **Internet/Camera KHÔNG có** checkbox này (UltraFast: skip — CLARY-DANGKYUF-002) | ✅ Resolved | Không tạo SC checkbox cho Internet/Camera |
| CLA-CKCOMMON-003 | REQ-CKCOMMON-007 | Thông tin chung; Camera R21 | "Địa chỉ trước sáp nhập" / pre-fill hoạt động thế nào, áp dụng DV nào? | **Click → điền TOÀN BỘ địa chỉ; áp dụng cho mọi dịch vụ có link "Địa chỉ trước sáp nhập"** | ✅ Resolved | + SC-CKCOMMON-076 (pre-fill) |
| CLA-CKCOMMON-004 | REQ-CKCOMMON-005 | Thông tin chung R39-40 | Text lỗi SĐT sai định dạng dùng text nào? | **"Số điện thoại không hợp lệ"** (đây là text đúng cho màn chung) | ✅ Resolved | SC-CKCOMMON-014,015 dùng "Số điện thoại không hợp lệ" |
| CLA-CKCOMMON-005 | REQ-CKCOMMON-006 | Đăng ký internet (không Email) | Internet có trường Email không? | **Internet KHÔNG có Email** (chỉ Hyperfast/UltraFast) | ✅ Resolved | SC-CKCOMMON-018→021 chỉ UF/Hyperfast |
| CLA-CKCOMMON-006 | REQ-CKCOMMON-011 | Thông tin chung R78 | Tên chung cư có bắt buộc không? | **Bỏ qua Chung cư — ver hiện tại chưa phát triển** | ✅ Resolved | SC-CKCOMMON-037→040 🚫 Deferred |
| CLA-CKCOMMON-007 | REQ-CKCOMMON-008 | Thông tin chung R93 | Nội dung đầy đủ popup "Chưa hỗ trợ chính sách!" | **BA bổ sung sau** | ⏳ Pending | SC-CKCOMMON-031 (nội dung popup TBD) |
| CLA-INTERNET-001 | REQ-INTERNET-003 | Đăng ký internet R35-36 | Phân biệt trả trước/trả sau xác định thế nào? | **Theo tool QLCS quy định (không phải user chọn); trả sau thường 1 tháng** | ✅ Resolved | SC-INTERNET-008,009 |
| CLA-INTERNET-002 | REQ-CKCOMMON-017 | Thông tin chung R153-154 | Session 20p + countdown ~15p áp dụng Internet? | **Áp dụng tất cả dịch vụ** | ✅ Resolved | SC-CKCOMMON-066,067 (mọi DV) |

> Còn Pending: **CLA-CKCOMMON-007** (nội dung popup "Chưa hỗ trợ chính sách!" — BA bổ sung sau).
---

## Clarifications đã resolve (kế thừa UltraFast — bản 2026-05-28/30)

| # | Vấn đề | Answer | Status |
|---|---|---|---|
| CLARY-DANGKYUF-001 | UltraFast chỉ có SĐT, không có địa chỉ/họ tên? | Đúng — Rule common mô tả cho nhiều dịch vụ; UltraFast rút gọn | Resolved 2026-05-28 |
| CLARY-DANGKYUF-002 | Checkbox "Tôi muốn nhận hóa đơn" (UltraFast) | Hiển thị nhưng blocked, không test | Resolved 2026-05-28 |
| CLARY-DANGKYUF-003 | Block TTKH (UltraFast) load từ đâu | Mặc định rỗng; hiện field đã có data | Resolved 2026-05-28 |
| CLARY-DANGKYUF-004 | QLCS cấu hình COD cho UltraFast | QLCS không cho phép COD cho UltraFast | Resolved 2026-05-28 |
| CLARY-DANGKYUF-005 | Voucher (UltraFast) | Chưa implement → SC-DANGKYUF-015 Blocked | Resolved 2026-05-28 |

---

## Defects (kế thừa)

| ID | Req | Vấn đề | Status |
|---|---|---|---|
| DEFECT-DANGKYUF-001 | REQ-DANGKYUF-004 | Staging hiển thị "Thanh toán khi triển khai" (COD) trong PTTT của UltraFast (trái spec) | **Open** — chờ Dev fix; TC_DANGKYUF.12 giữ FAIL |
