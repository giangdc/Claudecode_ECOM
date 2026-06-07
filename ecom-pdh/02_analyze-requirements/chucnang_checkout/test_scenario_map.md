# Test Scenario Map — Module CHECKOUT (đa dịch vụ)

## Tổng quan: 155 scenarios — active 147 (P1:70 P2:62 P3:15); 5 deferred (Chung cư); 3 blocked (voucher)
> Cập nhật 2026-06-06: phân tích DOC-CK-05 (`Mô tả luồng checkout tongdaiwifi 0606.xlsx`) → thêm **SC-AP-019** (label giao hàng 3-7 ngày cố định trong AP). Cập nhật SC-CKCOMMON-008 text "họ tên" (bỏ "và"); SC-CKCOMMON-044 bổ sung case convert thất bại. CLA-AP-002 Partially Resolved.
> Cập nhật 2026-06-03: phân tích bản revise `Chucnangcheckout_0306.xlsx` → thêm 2 sub-module **CAMERA** (20 SC) + **AP** (18 SC). Field validation của Camera/AP **refer CKCOMMON** (không nhân bản). UltraFast/CKCOMMON/Internet không đổi (Rule common chỉ đổi format STT).
> Cập nhật 2026-06-01: BA resolve 8/9 clarification → SC-CKCOMMON-037→040 (Chung cư) **Deferred**; thêm **SC-CKCOMMON-076** (pre-fill địa chỉ).
> Phạm vi hiện tại: **UltraFast (DANGKYUF)** + **Màn checkout chung (CKCOMMON)** + **Internet (INTERNET)** + **Camera (CAMERA)** + **Access Point (AP)**.
> Smart Home / Smart Tivi: **chưa phân tích** — chờ đủ tài liệu (xem MEMORY.md §6).

| Sub-module | Mô tả | Scenarios | DOC Source |
|---|---|---|---|
| DANGKYUF | Checkout UltraFast — online only, chỉ SĐT, 1 bước | 24 (1 blocked) | DOC-CK-01 (sheet Đăng ký UltraFast + Rule common) |
| CKCOMMON | Màn checkout chung cho dịch vụ có Địa chỉ lắp đặt | 76 (71 active, 4 Chung cư deferred, +SC-076) | DOC-CK-01 (Rule common) + DOC-CK-02 (Thông tin chung) |
| INTERNET | Đăng ký Internet — 3 bước, trả trước/trả sau, giá động | 16 | DOC-CK-01 (sheet Đăng ký internet) |
| CAMERA | Đăng ký Camera — có chu kỳ + COD + Địa chỉ lắp đặt, màn 2 bước | 20 (18 active, 1 blocked voucher, 1 Chung cư deferred) | DOC-CK-04 (sheet Đăng ký camera) + DOC-CK-03 (mockup camera.png) |
| AP | Đăng ký Access Point — chỉ số lượng (không chu kỳ) + COD + Địa chỉ lắp đặt, màn 2 bước | 18 (17 active, 1 blocked voucher) | DOC-CK-04 (sheet Đăng ký AP) |

> **Quan hệ:** CKCOMMON là tập hành vi màn checkout dùng chung cho các dịch vụ có Địa chỉ lắp đặt (Internet, Camera, AP, Smart Home...). INTERNET = CKCOMMON + đặc thù 3 bước/trả trước-sau. **CAMERA/AP = CKCOMMON + chọn gói (Camera có chu kỳ, AP chỉ số lượng) + COD + màn 2 bước** — field validation tái dùng CKCOMMON, chỉ test phần đặc thù dịch vụ. UltraFast là biến thể rút gọn (không địa chỉ, không COD) nên giữ bộ SC riêng DANGKYUF.

---
---

# SUB-MODULE: DANGKYUF — Đăng ký UltraFast (Màn hình Checkout)
> Giữ nguyên từ bản phân tích 2026-05-28 (TC + automation đã chạy). Không đổi ID.

### Feature 1: Điều hướng sang Checkout (B1)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-001 | B1 — Điều hướng sang checkout | REQ-DANGKYUF-001 | DOC-CK-01 (Đăng ký UltraFast), Row 27-29 | User đang ở màn hình Chi tiết gói UltraFast, trang hiển thị các chu kỳ bán khả dụng | User chọn một chu kỳ bất kỳ rồi click button "Mua ngay" | Hệ thống điều hướng sang màn hình Thanh toán (bước màu xanh dương); URL/state phản ánh đúng gói và chu kỳ đã chọn | P1 | Functional |
| SC-DANGKYUF-002 | B1 — Checkout load đúng chu kỳ + số tiền | REQ-DANGKYUF-001 | DOC-CK-01 (Đăng ký UltraFast), Row 29 | User đã chọn chu kỳ X với giá Y và click "Mua ngay" | Màn hình Checkout load xong | Màn hình Thanh toán hiển thị đúng chu kỳ X và số tiền Y đã chọn từ B1 | P1 | Functional |

### Feature 2: Block Sản phẩm dịch vụ đã chọn

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-003 | Hiển thị đúng thông tin sản phẩm | REQ-DANGKYUF-002 | DOC-CK-01 (Đăng ký UltraFast), Row 32 | User đã chọn gói UltraFast với chu kỳ và số lượng cụ thể từ màn hình Chi tiết | Màn hình Checkout load xong | Block "Sản phẩm dịch vụ đã chọn" hiển thị đúng: tên gói, chu kỳ, số lượng, số tiền | P1 | Functional |

### Feature 3: Block Thông tin cá nhân — Số điện thoại

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-004 | SĐT hợp lệ — nhập thành công | REQ-DANGKYUF-003 | DOC-CK-01 (Rule common), Row 3 | User đang ở màn hình Checkout, trường Số điện thoại đang trống | User nhập SĐT hợp lệ: 10 số, bắt đầu bằng 0 (VD: 0901234567) | Textbox chấp nhận, không hiển thị lỗi, border bình thường; icon X xuất hiện cuối textbox | P1 | Functional |
| SC-DANGKYUF-005 | SĐT bỏ trống — required validation | REQ-DANGKYUF-003 | DOC-CK-01 (Rule common), Row 3 | User đang ở màn hình Checkout, trường Số điện thoại để trống | User click button "Thanh toán" mà không nhập SĐT | Hệ thống KHÔNG thực hiện thanh toán; hiển thị lỗi "Vui lòng nhập số điện thoại."; border đỏ quanh trường SĐT | P1 | Negative |
| SC-DANGKYUF-006 | SĐT < 10 số — sai định dạng | REQ-DANGKYUF-003 | DOC-CK-01 (Rule common), Row 3 | User đang ở màn hình Checkout | User nhập SĐT ít hơn 10 số (VD: 090123456 — 9 số) | Hiển thị lỗi "Số điện thoại chưa đúng, mời nhập lại"; border đỏ quanh textbox | P2 | Negative |
| SC-DANGKYUF-007 | SĐT không bắt đầu bằng 0 — sai định dạng | REQ-DANGKYUF-003 | DOC-CK-01 (Rule common), Row 3 | User đang ở màn hình Checkout | User nhập SĐT 10 số nhưng không bắt đầu bằng 0 (VD: 1901234567) | Hiển thị lỗi "Số điện thoại chưa đúng, mời nhập lại"; border đỏ quanh textbox | P2 | Negative |
| SC-DANGKYUF-008 | SĐT boundary — không cho nhập quá 10 số | REQ-DANGKYUF-003 | DOC-CK-01 (Rule common), Row 3 | User đang ở màn hình Checkout | User cố nhập SĐT vượt quá 10 ký tự (VD: 09012345678 — 11 số) | Hệ thống chỉ nhận đúng 10 ký tự đầu, không cho nhập thêm ký tự thứ 11 | P2 | Boundary |
| SC-DANGKYUF-009 | Icon X xóa data SĐT | REQ-DANGKYUF-003 | DOC-CK-01 (Rule common), Row 3 | User đã nhập bất kỳ ký tự nào vào textbox Số điện thoại | User nhìn thấy icon X xuất hiện ở cuối textbox rồi click vào icon X | Toàn bộ nội dung trong textbox SĐT bị xóa; icon X biến mất | P2 | UI |

### Feature 4: Block Phương thức thanh toán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-010 | Load đúng danh sách PTTT theo cấu hình QLCS | REQ-DANGKYUF-004 | DOC-CK-01 (Đăng ký UltraFast), Row 35 | Gói UltraFast được cấu hình N phương thức thanh toán Online trên tool QLCS | User vào màn hình Checkout | Block PTTT hiển thị đúng N phương thức đã cấu hình (VD: ATM, Momo, VietQR, Zalopay, Thẻ tín dụng) | P1 | Functional |
| SC-DANGKYUF-011 | Không có COD trong danh sách PTTT | REQ-DANGKYUF-004 | DOC-CK-01 (Đăng ký UltraFast), Row 35 | Gói UltraFast đang ở màn hình Checkout | User xem danh sách PTTT | Option "Thanh toán khi triển khai" (COD) KHÔNG xuất hiện trong danh sách PTTT | P1 | Functional |
| SC-DANGKYUF-012 | QLCS khai báo chỉ 2 PTTT → hiển thị đúng 2 | REQ-DANGKYUF-004 | DOC-CK-01 (Đăng ký UltraFast), Row 35 | Gói UltraFast được cấu hình chỉ 2 PTTT Online (VD: ATM và Momo) trên QLCS | User vào màn hình Checkout | Block PTTT chỉ hiển thị đúng 2 phương thức đã khai báo, không hiển thị thêm | P2 | Business Rule |

### Feature 5: Block Thông tin khách hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-013 | Block TTKH hiển thị đúng theo data có sẵn | REQ-DANGKYUF-005 | DOC-CK-01 (Đăng ký UltraFast), Row 36 | User vào màn hình Checkout với tài khoản đã có một số thông tin (VD: đã nhập SĐT trước đó) | Màn hình Checkout load xong | Block "Thông tin khách hàng" hiển thị đúng các field đã có data; field chưa có data hiển thị rỗng; block không ẩn | P2 | Functional |

### Feature 6: Block Thông tin thanh toán + Cần thanh toán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-014 | Cần thanh toán = tổng tiền sản phẩm (không voucher) | REQ-DANGKYUF-006 | DOC-CK-01 (Đăng ký UltraFast), Row 37-38 | User vào checkout với gói X giá Y, không áp dụng voucher | Màn hình Checkout load xong | "Cần thanh toán" hiển thị đúng tổng tiền Y = giá gói, không có khoản trừ | P1 | Functional |
| ~~SC-DANGKYUF-015~~ | ~~Cần thanh toán đã trừ voucher~~ | REQ-DANGKYUF-006 | DOC-CK-01 (Đăng ký UltraFast), Row 38 | — | — | — | P2 | Functional |
> **🚫 BLOCKED** — CLARY-DANGKYUF-005 Resolved 2026-05-28: Tính năng voucher tại bước thanh toán chưa implement. TC tạo trong sprint sau khi feature hoàn thiện.

### Feature 7: Button Thanh toán — Validate và Execute

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-016 | Còn trường bắt buộc chưa nhập → block thanh toán | REQ-DANGKYUF-007 | DOC-CK-01 (Đăng ký UltraFast), Row 39 | User ở màn hình Checkout, trường Số điện thoại (hoặc trường bắt buộc khác) chưa nhập | User click button "Thanh toán" | Hệ thống KHÔNG thực hiện thanh toán; highlight các trường bắt buộc chưa nhập (border đỏ + thông báo lỗi) | P1 | Negative |
| SC-DANGKYUF-017 | Chính sách không còn active trên QLCS → báo lỗi | REQ-DANGKYUF-007 | DOC-CK-01 (Đăng ký UltraFast), Row 39 | User điền đầy đủ thông tin hợp lệ; chính sách gói trên QLCS đã bị deactivate trước khi user click TT | User click button "Thanh toán" | Hệ thống hiển thị thông báo lỗi (chính sách không còn active); KHÔNG thực hiện thanh toán | P1 | Negative |
| SC-DANGKYUF-018 | Tất cả hợp lệ + chính sách active → thực hiện thanh toán | REQ-DANGKYUF-007 | DOC-CK-01 (Đăng ký UltraFast), Row 39 | User điền đầy đủ SĐT hợp lệ, đã chọn PTTT Online, chính sách còn active | User click button "Thanh toán" | Validate thành công; redirect sang màn hình thanh toán của 3rd party tương ứng với PTTT đã chọn | P1 | Functional |

### Feature 8: Luồng thanh toán Online (3rd party)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-019 | Thanh toán online thành công → hoàn tất (đã TT) | REQ-DANGKYUF-008 | DOC-CK-01 (Đăng ký UltraFast), Row 40 | User đã được redirect sang trang 3rd party (VD: cổng ATM/Momo) | User thực hiện thanh toán thành công trên 3rd party | Nhận tín hiệu thành công; điều hướng về màn hình hoàn tất đơn hàng trạng thái "Đã thanh toán" (bước hoàn tất màu xanh lá) | P1 | Functional |
| SC-DANGKYUF-020 | Hủy TT tại 3rd party → quay về màn hình Checkout | REQ-DANGKYUF-008 | DOC-CK-01 (Đăng ký UltraFast), Row 40 | User đang ở trang thanh toán 3rd party | User hủy thanh toán (click "Hủy"/"Cancel" hoặc back từ trang 3rd party) | Hệ thống điều hướng về màn hình Checkout; đơn hàng chưa được tạo | P1 | Functional |
| SC-DANGKYUF-021 | Sau khi back về checkout — chỉ PTTT đổi được | REQ-DANGKYUF-008 | DOC-CK-01 (Đăng ký UltraFast), Row 40 | User đã bị redirect về màn hình Checkout sau khi hủy/back từ 3rd party | User nhìn vào form và cố sửa các trường khác (VD: SĐT) | Chỉ trường PTTT có thể thay đổi; các trường còn lại bị disabled; User có thể chọn PTTT khác và click TT lại | P2 | Functional |

### Feature 9: Navigation

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-022 | Click Logo FPT → về FPT.vn | REQ-DANGKYUF-009 | DOC-CK-01 (Đăng ký UltraFast), Row 31 | User đang ở màn hình Checkout UltraFast | User click vào Logo FPT ở header | Hệ thống điều hướng về trang chủ FPT.vn | P3 | UI |
| SC-DANGKYUF-023 | Click Quay lại → về màn hình Chi tiết | REQ-DANGKYUF-009 | DOC-CK-01 (Đăng ký UltraFast), Row 41 | User đang ở màn hình Checkout UltraFast | User click button "Quay lại" | Hệ thống điều hướng về màn hình Chi tiết gói UltraFast | P2 | UI |
| SC-DANGKYUF-024 | Click text điều khoản → navigate tới privacy-policy | REQ-DANGKYUF-009 | DOC-CK-01 (Đăng ký UltraFast), Row 40 | User đang ở màn hình Checkout, thấy text điều khoản | User click vào text điều khoản | Hệ thống điều hướng tới https://fpt.vn/shop/privacy-policy | P3 | UI |

---
---

# SUB-MODULE: CKCOMMON — Màn hình Checkout chung (dịch vụ có Địa chỉ lắp đặt)
> Áp dụng cho các dịch vụ có Block Địa chỉ lắp đặt (Internet, Camera, Smart Home...). Nguồn: DOC-CK-01 (Rule common) + DOC-CK-02 (sheet Thông tin chung, TC tham chiếu BA).

### Feature C1: Header & Điều hướng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-001 | Click Logo FPT → Home | REQ-CKCOMMON-001 | DOC-CK-02 (Thông tin chung), R12 | User đang ở màn hình nhập thông tin/thanh toán | User click Logo FPT Telecom | Truy cập link trực tiếp → điều hướng Home fpt.vn; truy cập từ tongdaiwifi → về https://staging.tongdaiwifi.vn/ | P3 | UI |
| SC-CKCOMMON-002 | Click back (từ direct link) → Home fpt.vn | REQ-CKCOMMON-001 | DOC-CK-02, R13 | User mở trực tiếp link đăng ký dịch vụ | User click icon back trên màn hình | Điều hướng vào Home fpt.vn | P3 | UI |
| SC-CKCOMMON-003 | Click back (từ tongdaiwifi.vn) → Home tongdaiwifi | REQ-CKCOMMON-001 | DOC-CK-02, R14 | User vào từ tongdaiwifi.vn → click Đăng ký ngay | User click icon back | Điều hướng về https://staging.tongdaiwifi.vn/ | P3 | UI |

### Feature C2: Tiến trình các bước

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-004 | Màu sắc mặc định các bước + click no-op khi ở B1 | REQ-CKCOMMON-002 | DOC-CK-02, R16-17 | User đang ở màn hình nhập thông tin (B1) | User quan sát tiến trình + click icon bước 1/2/3 | B1 màu xanh dương, B2/B3 màu xám; click các bước không có action, vẫn ở màn hiện tại | P3 | UI |
| SC-CKCOMMON-005 | Click bước 1 khi đang ở bước 2 → quay về B1 | REQ-CKCOMMON-002 | DOC-CK-02, R18 | Tiến trình 3 bước, user đang ở B2 | User click icon bước 1 | Cho phép quay về B1 | P2 | Functional |

### Feature C3: Block Sản phẩm dịch vụ đã chọn

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-006 | Load đúng Số lượng / Tên gói / Chu kỳ / Giá / Icon | REQ-CKCOMMON-003 | DOC-CK-02, R20-24 | User đã chọn gói dịch vụ ở màn Chi tiết rồi vào Checkout | User quan sát block Sản phẩm dịch vụ đã chọn | Hiển thị đúng số lượng, tên gói, chu kỳ (3/6/12 tháng), giá (sau ưu đãi nếu có), icon theo config Product Hub | P1 | Functional |

### Feature C4: Họ tên

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-007 | Họ tên hợp lệ (kể cả khoảng trắng đầu/cuối → trim) → pass | REQ-CKCOMMON-004 | DOC-CK-01 (Rule common) R2; DOC-CK-02 R32 | Đang ở Checkout dịch vụ có trường Họ tên | User nhập Họ tên hợp lệ (chỉ chữ + khoảng trắng), có thể có khoảng trắng đầu/cuối | Chấp nhận, không lỗi; khi submit hệ thống trim khoảng trắng đầu/cuối | P1 | Functional |
| SC-CKCOMMON-008 | Họ tên trống / chỉ khoảng trắng → required | REQ-CKCOMMON-004 | DOC-CK-01 (Rule common) R2; DOC-CK-02 R30-31; DOC-CK-05 | Đang ở Checkout, trường Họ tên trống | User để trống hoặc nhập khoảng trắng rồi click ra ngoài | Border đỏ + thông báo "Vui lòng nhập họ tên." | P1 | Negative |
| SC-CKCOMMON-009 | Họ tên có số / ký tự đặc biệt → invalid | REQ-CKCOMMON-004 | DOC-CK-01 (Rule common) R2; DOC-CK-02 R33 | Đang ở Checkout | User nhập/paste Họ tên có số hoặc ký tự đặc biệt | Hiển thị "Họ tên không hợp lệ." (chỉ cho phép chữ + khoảng trắng) | P2 | Negative |
| SC-CKCOMMON-010 | Họ tên > 100 ký tự → chỉ nhận 100 | REQ-CKCOMMON-004 | DOC-CK-01 (Rule common) R2; DOC-CK-02 R34 | Đang ở Checkout | User nhập/paste Họ tên > 100 ký tự | Chỉ cho nhập và hiển thị tối đa 100 ký tự | P2 | Boundary |
| SC-CKCOMMON-011 | Icon X hiển thị & xóa data Họ tên | REQ-CKCOMMON-004 | DOC-CK-02 R28-29 | User đã nhập ký tự bất kỳ vào Họ tên | User quan sát icon X rồi click X | Icon X hiện khi có data; click X xóa toàn bộ và ẩn icon | P3 | UI |

### Feature C5: Số điện thoại

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-012 | SĐT hợp lệ → pass | REQ-CKCOMMON-005 | DOC-CK-01 (Rule common) R3 | Đang ở Checkout, SĐT trống | User nhập SĐT 10 số bắt đầu bằng 0 | Chấp nhận, không lỗi; icon X hiện | P1 | Functional |
| SC-CKCOMMON-013 | SĐT trống → required | REQ-CKCOMMON-005 | DOC-CK-01 (Rule common) R3; DOC-CK-02 R38 | Đang ở Checkout, SĐT trống | User click ra ngoài/submit mà không nhập | Border đỏ + "Vui lòng nhập số điện thoại." | P1 | Negative |
| SC-CKCOMMON-014 | SĐT chứa ký tự không phải số → invalid | REQ-CKCOMMON-005 | DOC-CK-01 (Rule common) R3; DOC-CK-02 R39 | Đang ở Checkout | User nhập/paste SĐT có ký tự không phải số | Hiển thị "Số điện thoại không hợp lệ" (text chuẩn màn chung — CLA-CKCOMMON-004 Resolved) | P2 | Negative |
| SC-CKCOMMON-015 | SĐT 10 số nhưng đầu khác 0 → invalid | REQ-CKCOMMON-005 | DOC-CK-01 (Rule common) R3; DOC-CK-02 R40 | Đang ở Checkout | User nhập 10 số bắt đầu khác 0 | Hiển thị "Số điện thoại không hợp lệ" | P2 | Negative |
| SC-CKCOMMON-016 | SĐT > 10 số → tự cắt còn 10 | REQ-CKCOMMON-005 | DOC-CK-01 (Rule common) R3; DOC-CK-02 R41 | Đang ở Checkout | User nhập/paste > 10 chữ số | Chỉ hiển thị 10 số, tự cắt từ số thứ 11 | P2 | Boundary |
| SC-CKCOMMON-017 | Icon X hiển thị & xóa SĐT | REQ-CKCOMMON-005 | DOC-CK-02 R36-37 | User đã nhập ký tự vào SĐT | User click icon X | Xóa toàn bộ SĐT và ẩn icon X | P3 | UI |

### Feature C6: Email (chỉ Hyperfast / UltraFast)
> CLA-CKCOMMON-005 Resolved: **Internet KHÔNG có trường Email** → các SC dưới chỉ áp dụng dịch vụ Hyperfast/UltraFast.

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-018 | Email placeholder + để trống được phép | REQ-CKCOMMON-006 | DOC-CK-02 R43,R46 | Dịch vụ Hyperfast/UltraFast, trường Email | User quan sát placeholder + để trống Email rồi click ra ngoài | Placeholder "Nhập email"; cho phép để trống không báo lỗi (không bắt buộc) | P2 | Functional |
| SC-CKCOMMON-019 | Email sai định dạng → invalid | REQ-CKCOMMON-006 | DOC-CK-02 R47 | Trường Email | User nhập "email_sai_format" | Hiển thị "Email không hợp lệ" | P2 | Negative |
| SC-CKCOMMON-020 | Email không có domain (test@) → invalid | REQ-CKCOMMON-006 | DOC-CK-02 R48 | Trường Email | User nhập "test@" | Hiển thị "Email không hợp lệ" | P2 | Negative |
| SC-CKCOMMON-021 | Email realtime sang block Thông tin lắp đặt + icon X | REQ-CKCOMMON-006 | DOC-CK-02 R44,45,49 | Trường Email | User nhập "Acb@gmail.com" | Email hiển thị realtime sang block Thông tin lắp đặt bên phải; icon X hiện và click X xóa | P2 | Functional |

### Feature C7: Địa chỉ lắp đặt — Tỉnh/Thành phố

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-022 | Mặc định rỗng + placeholder | REQ-CKCOMMON-007 | DOC-CK-01 (Rule common) R4; DOC-CK-02 R52-53 | Block Địa chỉ lắp đặt hiển thị, chưa chọn | User quan sát trường Tỉnh/Thành phố | Mặc định rỗng; placeholder "Chọn tỉnh/thành phố" | P3 | UI |
| SC-CKCOMMON-023 | Không chọn → required | REQ-CKCOMMON-007 | DOC-CK-01 (Rule common) R4; DOC-CK-02 R54 | Block Địa chỉ lắp đặt | User click vào trường rồi click ra ngoài không chọn | Border đỏ + "Vui lòng chọn tỉnh/thành phố." | P2 | Negative |
| SC-CKCOMMON-024 | Load đúng danh sách ĐCHC mới, ưu tiên HCM/HN/ĐN | REQ-CKCOMMON-007 | DOC-CK-01 (Rule common) R4; DOC-CK-02 R55 | Block Địa chỉ lắp đặt | User click dropdown Tỉnh/Thành phố | Hiển thị đủ tỉnh thành toàn quốc theo ĐCHC mới; HCM, HN, Đà Nẵng load đầu danh sách | P2 | Functional |
| SC-CKCOMMON-025 | Tìm kiếm Tỉnh/Thành phố (contains) | REQ-CKCOMMON-007 | DOC-CK-02 R56 | Dropdown Tỉnh/Thành phố | User nhập từ khóa tìm kiếm | Hiển thị danh sách khớp dữ liệu nhập (quy tắc contains) | P2 | Functional |
| SC-CKCOMMON-026 | Chọn Tỉnh → load thêm trường địa chỉ | REQ-CKCOMMON-007 | DOC-CK-01 (Rule common) R4; DOC-CK-02 R57-58 | Dropdown Tỉnh/Thành phố | User chọn 1 tỉnh/thành phố | Chỉ chọn được 1; load thêm Phường/Xã, Tên đường, Radio Nhà riêng/Chung cư, Số nhà, Ghi chú | P2 | Functional |
| SC-CKCOMMON-027 | Đổi Tỉnh → reload Phường/Xã, reset Tên đường + trigger kiểm tra chính sách | REQ-CKCOMMON-007 | DOC-CK-02 R59 | Đã chọn 1 tỉnh | User chọn tỉnh/thành phố khác | Load lại Phường/Xã tương ứng, reset Tên đường, trigger kiểm tra chính sách giá | P2 | Functional |
| SC-CKCOMMON-076 | Pre-fill "Địa chỉ trước sáp nhập" → điền toàn bộ địa chỉ | REQ-CKCOMMON-007 | DOC-CK-02 (Camera) R21; CLA-CKCOMMON-003 | Account đã có địa chỉ lưu sẵn từ đơn trước; dịch vụ có link "Địa chỉ trước sáp nhập" | User click link "Địa chỉ trước sáp nhập" | Hệ thống tự điền **toàn bộ** địa chỉ đã lưu (Tỉnh/TP, Phường/Xã, Tên đường, Số nhà...); áp dụng cho mọi dịch vụ có link này | P2 | Functional |

### Feature C8: Địa chỉ lắp đặt — Phường/Xã (+ kiểm tra chính sách giá)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-028 | Placeholder + không chọn → required | REQ-CKCOMMON-008 | DOC-CK-01 (Rule common) R5; DOC-CK-02 R61-62 | Block Địa chỉ lắp đặt | User quan sát placeholder + không chọn rồi click ra ngoài | Placeholder "Chọn phường/xã"; border đỏ + "Vui lòng chọn phường/xã." | P2 | Negative |
| SC-CKCOMMON-029 | Tìm kiếm + chọn 1 Phường/Xã | REQ-CKCOMMON-008 | DOC-CK-02 R63-64 | Đã chọn Tỉnh | User tìm theo tên + chọn 1 Phường/Xã | Hiển thị danh sách khớp; chỉ chọn được 1, hiển thị đúng giá trị | P2 | Functional |
| SC-CKCOMMON-030 | Đổi Phường/Xã → reset Tên đường + gọi API chính sách kiểm tra giá | REQ-CKCOMMON-008 | DOC-CK-01 (Rule common) R5; DOC-CK-02 R65 | Đã chọn Tỉnh + Phường/Xã | User đổi Phường/Xã | Reset Tên đường; gọi API chính sách: giá không đổi → giữ Tạm tính; giá đổi → cập nhật Tạm tính | P1 | Functional |
| SC-CKCOMMON-031 | Địa chỉ không có chính sách → popup + đẩy KHTN + chặn qua bước TT | REQ-CKCOMMON-008 | DOC-CK-01 (Rule common) R5; DOC-CK-02 R93-95 | Block Địa chỉ lắp đặt | User chọn Tỉnh/Phường-Xã không có chính sách | Hiển thị popup "Chưa hỗ trợ chính sách!"; click Đóng → disable btn Tiếp tục; đẩy KHTN (web-admin ghi nhận theo SĐT) | P1 | Negative |

### Feature C9: Địa chỉ lắp đặt — Tên đường

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-032 | Placeholder + không chọn → required | REQ-CKCOMMON-009 | DOC-CK-01 (Rule common) R6; DOC-CK-02 R67-68 | Block Địa chỉ lắp đặt | User quan sát placeholder + không chọn rồi click ra ngoài | Placeholder "Chọn tên đường"; border đỏ + "Vui lòng chọn tên đường." | P2 | Negative |
| SC-CKCOMMON-033 | Tìm kiếm (không trim, contains) + chọn 1 | REQ-CKCOMMON-009 | DOC-CK-02 R69-70 | Đã chọn Phường/Xã | User tìm theo tên + chọn 1 Tên đường | Tìm theo contains, không trim khoảng cách trước khi tìm; chỉ chọn được 1 | P2 | Functional |

### Feature C10: Địa chỉ lắp đặt — Nhà riêng / Số nhà

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-034 | Chọn radio Nhà riêng → hiển thị Số nhà* | REQ-CKCOMMON-010 | DOC-CK-02 R72-73 | Block Địa chỉ lắp đặt | User chọn radio "Nhà riêng" | Hiển thị trường Số nhà* (placeholder "Nhập số nhà") | P2 | Functional |
| SC-CKCOMMON-035 | Số nhà trống → required | REQ-CKCOMMON-010 | DOC-CK-01 (Rule common) R7; DOC-CK-02 R74 | Đã chọn Nhà riêng | User để trống Số nhà rồi click ra ngoài | Thông báo "Vui lòng nhập địa chỉ/số nhà." | P2 | Negative |
| SC-CKCOMMON-036 | Số nhà > 50 ký tự → chỉ nhận 50 | REQ-CKCOMMON-010 | DOC-CK-01 (Rule common) R7; DOC-CK-02 R75 | Đã chọn Nhà riêng | User nhập/paste Số nhà > 50 ký tự | Chỉ cho nhập và hiển thị tối đa **50 ký tự** (CLA-CKCOMMON-001 Resolved) | P2 | Boundary |

### Feature C11: Địa chỉ lắp đặt — Chung cư 🚫 DEFERRED
> **CLA-CKCOMMON-006 Resolved 2026-06-01:** BA xác nhận **bỏ qua Chung cư** — ver hiện tại chưa phát triển. Các SC dưới giữ ID để truy vết, **không gen TC** cho đến khi feature có.

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| ~~SC-CKCOMMON-037~~ | ~~Radio Chung cư → hiển thị + load Tên chung cư~~ | ~~REQ-CKCOMMON-011~~ | DOC-CK-02 R77-79 | — | — | 🚫 Deferred (Chung cư chưa phát triển) | — | — |
| ~~SC-CKCOMMON-038~~ | ~~Tòa nhà optional + > 10 cắt~~ | ~~REQ-CKCOMMON-011~~ | DOC-CK-02 R80-82 | — | — | 🚫 Deferred | — | — |
| ~~SC-CKCOMMON-039~~ | ~~Số tầng required + > 10 cắt~~ | ~~REQ-CKCOMMON-011~~ | DOC-CK-02 R83-85 | — | — | 🚫 Deferred | — | — |
| ~~SC-CKCOMMON-040~~ | ~~Số phòng required + > 10 cắt~~ | ~~REQ-CKCOMMON-011~~ | DOC-CK-02 R86-88 | — | — | 🚫 Deferred | — | — |

### Feature C12: Địa chỉ lắp đặt — Ghi chú

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-041 | Ghi chú không bắt buộc + placeholder + > 100 cắt | REQ-CKCOMMON-012 | DOC-CK-01 (Rule common) R8; DOC-CK-02 R90-92 | Block Địa chỉ lắp đặt | User quan sát placeholder / để trống / nhập > 100 ký tự | Placeholder "Gọi cho tôi trước 30 phút nhé!"; để trống không lỗi; nhập > 100 → chỉ nhận 100 ký tự | P3 | Boundary |

### Feature C13: Popup Địa chỉ hành chính cũ (3 cấp → 2 cấp)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-042 | UI popup Địa chỉ hành chính cũ | REQ-CKCOMMON-013 | DOC-CK-01 (Rule common) R14; DOC-CK-02 R97 | Block Địa chỉ lắp đặt | User click link "Địa chỉ trước sáp nhập" | Popup hiển thị: Title "Địa chỉ hành chính cũ", label hướng dẫn, 4 dropdown (Tỉnh/TP, Quận/Huyện, Phường/Xã, Tên đường), icon X, btn Xác nhận | P2 | UI |
| SC-CKCOMMON-043 | Load phân cấp + tìm kiếm (contains, không trim) | REQ-CKCOMMON-013 | DOC-CK-02 R98-114 | Popup đang mở | User chọn Tỉnh → Quận/Huyện → Phường/Xã → Tên đường, tìm kiếm từng cấp | 63 tỉnh ĐCHC 3 cấp; mỗi cấp load theo cấp trên; tìm kiếm contains, không trim | P2 | Functional |
| SC-CKCOMMON-044 | Btn Xác nhận disable khi chưa đủ 4 cấp **hoặc convert thất bại** | REQ-CKCOMMON-013 | DOC-CK-02 R99,104,108,111; **DOC-CK-05** | Popup đang mở | (a) User để trống bất kỳ cấp nào; (b) User chọn đủ 4 cấp nhưng hệ thống convert địa chỉ thất bại (3 cấp → 2 cấp không thành công) | Btn Xác nhận vẫn disable ở cả 2 trường hợp | P2 | Negative |
| SC-CKCOMMON-045 | Chọn đủ → hiển thị Địa chỉ hành chính mới + enable Xác nhận | REQ-CKCOMMON-013 | DOC-CK-01 (Rule common) R14; DOC-CK-02 R115 | Popup đang mở | User chọn đủ Tỉnh + Quận/Huyện + Phường/Xã + Tên đường | Hiển thị field "Địa chỉ hành chính mới" (convert 3 cấp → 2 cấp); enable btn Xác nhận (disable nếu convert thất bại) | P1 | Functional |
| SC-CKCOMMON-046 | Click icon X → không cập nhật, về form | REQ-CKCOMMON-013 | DOC-CK-02 R116 | Popup có dữ liệu đã chọn | User click icon X | Không cập nhật địa chỉ mới; đóng popup, về form đăng ký | P2 | Functional |
| SC-CKCOMMON-047 | Click Xác nhận → đẩy địa chỉ 2 cấp vào form | REQ-CKCOMMON-013 | DOC-CK-01 (Rule common) R14; DOC-CK-02 R117-118 | Popup đã chọn đủ, btn Xác nhận enable | User click Xác nhận | Đẩy Tỉnh/TP, Phường/Xã, Tên đường (2 cấp) vào dropdown form; đóng popup | P1 | Functional |

### Feature C14: Block Thông tin khách hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-048 | Collapse / Expand block TTKH | REQ-CKCOMMON-014 | DOC-CK-02 R120-121 | Màn Checkout | User click icon Collapse rồi Expand | Thu gọn/mở rộng các trường; icon đổi collapse↔expand | P3 | UI |
| SC-CKCOMMON-049 | Format hiển thị địa chỉ (Nhà riêng) | REQ-CKCOMMON-014 | DOC-CK-02 R122 | Đã nhập đủ địa chỉ Nhà riêng | User xem địa chỉ trong block TTKH | Nhà riêng: Số nhà, Tên đường, Phường xã, Tỉnh thành (format Chung cư R123 — Deferred theo CLA-CKCOMMON-006) | P2 | Functional |
| SC-CKCOMMON-050 | Không cho chỉnh sửa thông tin trong block TTKH | REQ-CKCOMMON-014 | DOC-CK-02 R124 | Màn Checkout | User cố chỉnh sửa Họ tên/SĐT/Email/Địa chỉ trong block TTKH | Không thể chỉnh sửa (read-only) | P2 | Functional |

### Feature C15: Block Phương thức thanh toán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-051 | UI block PTTT đầy đủ | REQ-CKCOMMON-015 | DOC-CK-02 R126 | Dịch vụ có ≥ 1 PTTT trong chính sách | User quan sát block PTTT | Hiển thị: radio chọn, icon PTTT, tên PTTT, miêu tả, số lượng ưu đãi, btn Xem thêm/Rút gọn (tùy số PTTT) | P1 | UI |
| SC-CKCOMMON-052 | ≤ 4 PTTT → hiện hết, không có Xem thêm | REQ-CKCOMMON-015 | DOC-CK-02 R127 | Chính sách có < 4 PTTT | User quan sát block PTTT | Hiển thị tất cả PTTT, không có btn Xem thêm | P1 | Functional |
| SC-CKCOMMON-053 | > 4 PTTT → hiện 4 đầu + Xem thêm/Thu gọn | REQ-CKCOMMON-015 | DOC-CK-02 R128,133-134 | Chính sách có > 4 PTTT | User click Xem thêm rồi Thu gọn | Mặc định hiện 4 PTTT đầu + Xem thêm; click Xem thêm → hiện hết; Thu gọn → còn 4 | P1 | Functional |
| SC-CKCOMMON-054 | Thứ tự ưu tiên PTTT có CTKM lên trên | REQ-CKCOMMON-015 | DOC-CK-02 R129 | Có PTTT kèm CTKM | User quan sát thứ tự PTTT | PTTT có CTKM ưu tiên hiển thị lên trên | P2 | Business Rule |
| SC-CKCOMMON-055 | Default PTTT đầu + chỉ chọn 1 + không bỏ chọn | REQ-CKCOMMON-015 | DOC-CK-02 R131-132,135 | Block PTTT | User cố chọn nhiều / bỏ chọn default | Option đầu được chọn mặc định, không thể bỏ chọn; chỉ chọn được 1; số ưu đãi collapse/expand mặc định hiện khi chọn PTTT | P1 | Functional |

### Feature C16: Block Thông tin thanh toán + Mã ưu đãi

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-056 | Collapse/Expand + hyperlink điều khoản | REQ-CKCOMMON-016 | DOC-CK-02 R137-139 | Màn Checkout | User collapse/expand + click hyperlink điều khoản | Thu gọn/mở rộng block; click điều khoản → màn điều khoản FPT Telecom | P3 | UI |
| SC-CKCOMMON-057 | Hiển thị tên gói + giá theo chính sách (mặc định 1 tháng) | REQ-CKCOMMON-016 | DOC-CK-02 R140-142 | Có chính sách (chung cư/nhà phố) | User xem block Thông tin thanh toán | Tên gói đúng; giá đúng theo CS chung cư / nhà phố; mặc định giá gói 1 tháng | P2 | Functional |
| SC-CKCOMMON-058 | Ô mã KM + link Chọn ưu đãi (badge) + Áp dụng disable/enable | REQ-CKCOMMON-016 | DOC-CK-02 R143-144 | Block Thông tin thanh toán | User quan sát ô mã rỗng rồi nhập 1 ký tự | Ô input placeholder "Nhập mã khuyến mãi" + link "Chọn ưu đãi" (badge số) + btn Áp dụng (disable khi rỗng, enable khi có ký tự) | P2 | Functional |
| SC-CKCOMMON-059 | Click Chọn ưu đãi → mở danh sách ưu đãi khả dụng | REQ-CKCOMMON-016 | DOC-CK-02 R145 | Có ưu đãi đang hoạt động | User click link "Chọn ưu đãi" | Hiển thị danh sách ưu đãi khả dụng; badge đúng số lượng | P2 | Functional |
| SC-CKCOMMON-060 | Mã KM hợp lệ → giảm giá, cập nhật Cần thanh toán | REQ-CKCOMMON-016 | DOC-CK-02 R146 | Có mã KM hợp lệ | User nhập mã hợp lệ + Áp dụng | Hiển thị giá trị giảm; Cần thanh toán = giá gốc − giảm (cập nhật đúng) | P1 | Functional |
| SC-CKCOMMON-061 | Mã KM không hợp lệ/hết hạn → lỗi, giá không đổi | REQ-CKCOMMON-016 | DOC-CK-02 R147 | Mã không tồn tại/hết hạn | User nhập mã + Áp dụng | Thông báo lỗi (mã không hợp lệ/hết hạn); Cần thanh toán không đổi | P1 | Negative |

### Feature C17: Luồng thanh toán (validate + execute)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-062 | Chưa nhập đủ bắt buộc → block thanh toán | REQ-CKCOMMON-017 | DOC-CK-02 R149 | Còn trường bắt buộc chưa nhập | User click "Thanh toán" | Show lỗi ở các trường bắt buộc, không thực hiện thanh toán | P1 | Negative |
| SC-CKCOMMON-063 | Đủ + PTTT = COD → màn hoàn tất "Chưa thanh toán" | REQ-CKCOMMON-017 | DOC-CK-02 R150 | Đã nhập đủ, chọn COD | User click "Thanh toán" | Điều hướng màn hoàn tất đơn hàng trạng thái "Chưa thanh toán" | P1 | Functional |
| SC-CKCOMMON-064 | Đủ + PTTT = Online → 3rd party đúng số tiền | REQ-CKCOMMON-017 | DOC-CK-02 R151 | Đã nhập đủ, chọn Online | User click "Thanh toán" | Điều hướng màn thanh toán 3rd party tương ứng, đúng số tiền cần thanh toán | P1 | Functional |
| SC-CKCOMMON-065 | Double-click Thanh toán → chỉ tạo 1 đơn hàng | REQ-CKCOMMON-017 | DOC-CK-02 R152 | Đã nhập đủ, chọn Online | User double-click btn Thanh toán | Hệ thống chỉ tạo 1 đơn hàng đúng thông tin, không bị double | P1 | Negative |
| SC-CKCOMMON-066 | Quá session checkout (20p) → lỗi + đẩy KHTN | REQ-CKCOMMON-017 | DOC-CK-02 R153 | Đã nhập đủ, chờ > 20 phút | User click "Thanh toán" | Hiển thị thông báo lỗi hợp lý; đẩy thông tin KH tiềm năng | P1 | Negative |
| SC-CKCOMMON-067 | Hết countdown 3rd party (~15p) → màn không thành công | REQ-CKCOMMON-017 | DOC-CK-02 R154 | Đã sang 3rd party | User chờ hết thời gian thanh toán của kênh (~15p) | Quay về tongdaiwifi, hiển thị màn hình không thành công | P2 | Negative |
| SC-CKCOMMON-068 | Back từ 3rd party → disable info, chỉ sửa PTTT + ưu đãi | REQ-CKCOMMON-017 | DOC-CK-02 R155 | Đã sang 3rd party | User click back trình duyệt | Về màn dịch vụ; disable thông tin, chỉ cho cập nhật PTTT + mã ưu đãi | P2 | Functional |
| SC-CKCOMMON-069 | Hủy/thất bại tại 3rd party → màn fail + đẩy KHTN | REQ-CKCOMMON-017 | DOC-CK-02 R156 | Đã sang 3rd party | User hủy hoặc thanh toán thất bại (sai thẻ nhiều lần) | Quay về tongdaiwifi, màn không thành công; đẩy KHTN | P1 | Negative |
| SC-CKCOMMON-070 | Chính sách hết hiệu lực khi click TT → lỗi, không lên đơn | REQ-CKCOMMON-017 | DOC-CK-02 (Smart Home) R24 | Gói có ≥ 1 chính sách hết hiệu lực trên QLCS | User nhập đủ + chọn PTTT + click Thanh toán | Hệ thống báo lỗi, không lên đơn hàng | P1 | Negative |

### Feature C18: Màn hình Hoàn tất đơn hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CKCOMMON-071 | Hiển thị Mã đơn hàng + hyperlink Theo dõi ĐH | REQ-CKCOMMON-018 | DOC-CK-02 R159 | Màn hoàn tất đơn hàng thành công | User xem khu vực Mã đơn hàng | Hiển thị "Mã đơn hàng: <mã>" + hyperlink "Theo dõi ĐH" | P1 | Functional |
| SC-CKCOMMON-072 | Click hyperlink Theo dõi đơn hàng | REQ-CKCOMMON-018 | DOC-CK-02 R160 | Màn hoàn tất | User click hyperlink Theo dõi đơn hàng | Điều hướng đến màn hình theo dõi đơn hàng | P2 | Functional |
| SC-CKCOMMON-073 | Block TTKH/TTTT hiển thị đúng + collapse/expand | REQ-CKCOMMON-018 | DOC-CK-02 R162-168 | Màn hoàn tất | User xem + collapse/expand block TTKH và TTTT | Hiển thị đúng thông tin đã nhập ở các bước; thu gọn/mở rộng hoạt động, icon đổi v↔^ | P2 | Functional |
| SC-CKCOMMON-074 | Trạng thái COD ("Chưa thanh toán") vs Online ("Thanh toán thành công") | REQ-CKCOMMON-018 | DOC-CK-02 (Smart Home) R27-28 | Hoàn tất qua COD / Online | User xem label trạng thái | COD → "Chưa thanh toán"; Online thành công → "Thanh toán thành công"; các bước header màu xanh lá | P1 | Functional |
| SC-CKCOMMON-075 | Đơn hàng + Hợp đồng ghi nhận đúng (webadmin/inside) | REQ-CKCOMMON-018 | DOC-CK-02 (Smart Home) R29-30 | Đã thanh toán thành công | QA kiểm tra webadmin + inside | Đơn hàng ghi nhận đúng thông tin đã nhập; Hợp đồng ghi nhận đúng thông tin đơn hàng | P1 | Integration |

---
---

# SUB-MODULE: INTERNET — Đăng ký Internet (Checkout 3 bước)
> Đặc thù ngoài CKCOMMON. Nguồn: DOC-CK-01 (sheet Đăng ký internet). Các hành vi field/PTTT/luồng TT dùng chung tham chiếu CKCOMMON.

### Feature I1: Điều hướng & tiến trình 3 bước

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-INTERNET-001 | Click "Đăng ký ngay" → checkout 3 bước | REQ-INTERNET-001 | DOC-CK-01 (Đăng ký internet) R18 | User ở màn Chi tiết gói Internet | User click btn "Đăng ký ngay" | Điều hướng luồng checkout 3 bước: B1 Thông tin đăng ký → B2 Thanh toán → B3 Hoàn tất đơn hàng | P1 | Functional |
| SC-INTERNET-002 | btn Đăng ký ngay có thể cần scroll mới hiện | REQ-INTERNET-001 | DOC-CK-01 (Đăng ký internet) R18 | Màn Chi tiết gói Internet | User quan sát/scroll trang | Tùy màn hình, btn "Đăng ký ngay" có thể cần scroll xuống mới hiển thị | P3 | UI |

### Feature I2: B1 — Thông tin đăng ký

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-INTERNET-003 | B1 hiển thị đủ block | REQ-INTERNET-002 | DOC-CK-01 (Đăng ký internet) R21-31 | User vào B1 | User quan sát màn B1 | Hiển thị: Logo FPT, Block Thông tin cá nhân (Họ tên + SĐT), Block Địa chỉ lắp đặt (link địa chỉ cũ, Tỉnh/TP, Phường/Xã, Tên đường, Số nhà, Ghi chú), Block Thông tin lắp đặt, Block Thông tin thanh toán (giá 1 tháng), text điều khoản, btn Tiếp tục | P1 | Functional |
| SC-INTERNET-004 | btn Tiếp tục — thiếu bắt buộc → không qua B2 | REQ-INTERNET-002 | DOC-CK-01 (Đăng ký internet) R33 | B1 còn trường bắt buộc trống | User click "Tiếp tục" | Không điều hướng qua B2; show lỗi các trường bắt buộc | P1 | Negative |
| SC-INTERNET-005 | btn Tiếp tục — hợp lệ → qua B2 | REQ-INTERNET-002 | DOC-CK-01 (Đăng ký internet) R33 | B1 nhập đủ hợp lệ | User click "Tiếp tục" | Điều hướng sang B2 Thanh toán | P1 | Functional |
| SC-INTERNET-006 | Block Thông tin lắp đặt load theo TTCN + địa chỉ | REQ-INTERNET-002 | DOC-CK-01 (Đăng ký internet) R30 | Đã nhập TTCN + địa chỉ ở B1 | User xem Block Thông tin lắp đặt | Hiển thị Họ tên, SĐT, địa chỉ load đúng theo Block Thông tin cá nhân + Địa chỉ lắp đặt | P2 | Functional |
| SC-INTERNET-007 | Giá tiền B1 thay đổi theo địa chỉ đã chọn | REQ-INTERNET-002 | DOC-CK-01 (Đăng ký internet) R31 | B1 đã chọn địa chỉ | User đổi địa chỉ lắp đặt | Block Thông tin thanh toán cập nhật giá 1 tháng theo data QLCS của địa chỉ mới | P2 | Functional |

### Feature I3: B2 — Thanh toán (trả trước / trả sau, giá động)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-INTERNET-008 | Trả sau → chỉ tính Phí lắp đặt khi thanh toán | REQ-INTERNET-003 | DOC-CK-01 (Đăng ký internet) R35; CLA-INTERNET-001 | Gói Internet được **tool QLCS** trả về loại "trả sau" (không do user chọn; trả sau thường chu kỳ 1 tháng), đang ở B2 | User xem Block Thông tin sản phẩm (trả sau) | Chỉ tính tiền Phí lắp đặt lúc thanh toán; load gói + chu kỳ + giá theo QLCS | P1 | Functional |
| SC-INTERNET-009 | Trả trước → tính Phí dịch vụ + lắp đặt | REQ-INTERNET-003 | DOC-CK-01 (Đăng ký internet) R36; CLA-INTERNET-001 | Gói Internet được **tool QLCS** trả về loại "trả trước", đang ở B2 | User xem Block Thông tin sản phẩm (trả trước) | Tính tiền Phí dịch vụ + Phí lắp đặt; load gói + chu kỳ + giá theo QLCS | P1 | Functional |
| SC-INTERNET-010 | Block Thông tin thanh toán — giá động theo địa chỉ (QLCS) | REQ-INTERNET-003 | DOC-CK-01 (Đăng ký internet) R38 | Đang ở B2 | User xem Block Thông tin thanh toán | Load đúng sản phẩm + số tiền tương ứng; giá động theo địa chỉ từ QLCS (mỗi địa chỉ có thể giá khác) | P1 | Functional |
| SC-INTERNET-011 | btn Quay lại → về B1, giữ data đã nhập | REQ-INTERNET-003 | DOC-CK-01 (Đăng ký internet) R39 | Đang ở B2 | User click "Quay lại" | Về B1, dữ liệu đã nhập ở B1 vẫn được giữ | P2 | Functional |
| SC-INTERNET-012 | Block PTTT có đầy đủ Online + COD | REQ-INTERNET-003 | DOC-CK-01 (Đăng ký internet) R40 | Đang ở B2 | User xem Block Phương thức thanh toán | Hiển thị đầy đủ PTTT Online + COD theo chính sách QLCS (khác UltraFast: UF không có COD) | P1 | Functional |
| SC-INTERNET-013 | btn Thanh toán — validate + CS active → luồng TT | REQ-INTERNET-003 | DOC-CK-01 (Đăng ký internet) R41 | B2 nhập đủ, chính sách active | User click "Thanh toán" | Validate trường bắt buộc + chính sách còn active → thực hiện luồng thanh toán theo PTTT đã chọn | P1 | Functional |

### Feature I4: B3 — Hoàn tất đơn hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-INTERNET-014 | PTTT = COD → "Chưa thanh toán" | REQ-INTERNET-004 | DOC-CK-01 (Đăng ký internet) R43 | Thanh toán COD | User hoàn tất đặt hàng COD | Màn hoàn tất: "Hoàn tất đơn hàng / Chưa thanh toán" + nội dung "Đơn hàng đã đăng ký thành công. Kỹ thuật viên FPT sẽ liên hệ triển khai dịch vụ trong 8h-12h..." | P1 | Functional |
| SC-INTERNET-015 | PTTT = Online + thành công → "Đã thanh toán" | REQ-INTERNET-004 | DOC-CK-01 (Đăng ký internet) R45 | Thanh toán Online thành công | User hoàn tất thanh toán Online | Bước Hoàn tất header màu xanh lá; trạng thái "Đã thanh toán" + nội dung thông báo thành công | P1 | Functional |
| SC-INTERNET-016 | PTTT = Online + thất bại → về màn TT, chỉ sửa PTTT + ưu đãi | REQ-INTERNET-004 | DOC-CK-01 (Đăng ký internet) R44 | Thanh toán Online thất bại | Thanh toán không thành công | Quay về màn TT giữ nguyên thông tin đã chọn; chỉ cho thay đổi PTTT + nhập mã ưu đãi, các trường còn lại disable | P1 | Negative |


---
---

# SUB-MODULE: CAMERA — Đăng ký Camera (Màn hình Checkout 2 bước)
> Nguồn: DOC-CK-04 sheet "Đăng ký camera" (B1→B3) + DOC-CK-03 mockup `camera.png`.
> **Quy ước:** các trường Họ tên / SĐT / Tỉnh-Phường-Đường-Số nhà / Ghi chú / Popup địa chỉ cũ / PTTT đều "refer sheet common" → **tái dùng rule & TC của CKCOMMON**, dưới đây chỉ ghi SC đặc thù dịch vụ Camera + 1 SC happy/negative để chốt tích hợp.

### Feature CAM1: B1 — Chọn gói & điều hướng sang Checkout

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-001 | B1 chọn chu kỳ + số lượng → checkout | REQ-CAMERA-001 | DOC-CK-04 (camera) R29-30 | User ở màn Chi tiết gói Camera | Chọn chu kỳ bất kỳ + số lượng, click "Mua ngay" | Điều hướng sang màn Thanh toán; load đúng tên gói, chu kỳ, số lượng, số tiền như đã chọn ở Chi tiết | P1 | Functional |
| SC-CAMERA-002 | Đổi số lượng → tiền cập nhật đúng | REQ-CAMERA-001 | DOC-CK-04 (camera) R30; mockup camera.png | Ở Chi tiết chọn số lượng > 1 | Sang checkout | Số tiền trên checkout = đơn giá × số lượng theo chu kỳ đã chọn (itemized: Camera + Gói Cloud) | P2 | Functional |

### Feature CAM2: B2 — Block Sản phẩm dịch vụ đã chọn + tiến trình

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-003 | Block Sản phẩm + header 2 bước | REQ-CAMERA-002 | DOC-CK-04 (camera) R31-32; mockup | Đang ở B2 Thanh toán | User quan sát màn | Header 2 bước: "Thanh toán" (xanh dương) → "Hoàn tất đơn hàng" (xám); Block "Sản phẩm dịch vụ đã chọn" load đúng tên gói (vd Camera SE S2), dòng Cloud, chu kỳ, số lượng, số tiền | P1 | Functional |

### Feature CAM3: B2 — Block Thông tin cá nhân (Họ tên + SĐT)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-004 | Họ tên + SĐT hợp lệ | REQ-CAMERA-003 | DOC-CK-04 (camera) R33-35; Rule common R2,R3; mockup | Đang ở B2 | Nhập Họ tên + SĐT hợp lệ | Chấp nhận data; **validation chi tiết refer CKCOMMON C4/C5** (Họ tên ≤100, chỉ chữ; SĐT 10 số bắt đầu 0) | P1 | Functional |
| SC-CAMERA-005 | Họ tên/SĐT trống hoặc sai định dạng | REQ-CAMERA-003 | Rule common R2,R3; refer SC-CKCOMMON-007→017 | Đang ở B2 | Để trống / nhập sai định dạng rồi blur | Border đỏ + message theo Rule common ("Vui lòng nhập họ tên." / "Số điện thoại không hợp lệ"...) — **dùng lại bộ TC CKCOMMON** | P2 | Negative |

### Feature CAM4: B2 — Block Địa chỉ lắp đặt

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-006 | Block Địa chỉ lắp đặt hiển thị đầy đủ | REQ-CAMERA-004 | DOC-CK-04 (camera) R36-41; mockup | Đang ở B2 | User quan sát Block Địa chỉ lắp đặt | Hiển thị: link "Địa chỉ trước sáp nhập", note "Thời gian giao hàng dự kiến từ 3 đến 7 ngày", Tỉnh/Thành phố*, Phường/Xã*, Tên đường*, radio Nhà riêng/Chung cư, Số nhà*, Ghi chú (placeholder "Gọi cho tôi trước 30 phút nhé!") | P1 | Functional |
| SC-CAMERA-007 | Link "Địa chỉ trước sáp nhập" → popup | REQ-CAMERA-004 | DOC-CK-04 (camera) R36; refer SC-CKCOMMON-042→047 | Đang ở B2 | Click link "Địa chỉ trước sáp nhập" | Mở popup "Địa chỉ hành chính cũ" (3 cấp → 2 cấp) — **hành vi refer CKCOMMON C13** | P2 | Functional |
| SC-CAMERA-008 | Phường/Xã → kiểm tra chính sách giá | REQ-CAMERA-004 | DOC-CK-04 (camera); refer SC-CKCOMMON-028→031 | Đang ở B2 | Chọn Phường/Xã không có chính sách | Hiển thị popup "Chưa hỗ trợ chính sách!" + đẩy KHTN — **refer CKCOMMON C8** (nội dung popup chờ CLA-CKCOMMON-007) | P2 | Negative |

### Feature CAM5: B2 — Block Phương thức thanh toán (COD + Online)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-009 | PTTT load COD + Online theo QLCS | REQ-CAMERA-005 | DOC-CK-04 (camera) R42; Rule common R13; mockup | Đang ở B2, gói cấu hình COD + online trên QLCS | User xem Block Phương thức thanh toán | Hiển thị COD "Thanh toán tại nhà" (có CTKM "Giảm trực tiếp 50% giá trị đơn hàng tối đa 200.000 VND") + các PTTT online (VietQR, MoMo, Thẻ quốc tế...) theo QLCS; mỗi PTTT có badge ưu đãi; chỉ chọn 1; "Xem thêm" nếu >4 — **refer CKCOMMON C15** | P2 | Functional |

### Feature CAM6: B2 — Block Thông tin khách hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-010 | Block TTKH auto-load + Thời gian lắp đặt | REQ-CAMERA-006 | DOC-CK-04 (camera) R43; mockup | Đã nhập TTCN + địa chỉ | User xem Block Thông tin khách hàng (cột phải) | Load đúng Họ tên, Số điện thoại, Địa chỉ đã nhập + dòng "Thời gian lắp đặt" (vd "Thứ 2, 02/01/2024 10:00-11:10"). ⚠️ Cơ chế set "Thời gian lắp đặt" chờ CLA-CAMERA-001 | P2 | Functional |

### Feature CAM7: B2 — Block Thông tin thanh toán + Mã ưu đãi + Cần thanh toán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-011 | Thông tin thanh toán itemized + Cần thanh toán | REQ-CAMERA-007 | DOC-CK-04 (camera) R44-45; mockup | Đang ở B2 | User xem Block Thông tin thanh toán | Itemized đúng (vd "Camera SE S2 - 1 cái: 600.000đ", "Gói Cloud 3D - 6 tháng: 240.000đ"); "Cần thanh toán" = tổng tiền (840.000đ) | P1 | Functional |
| SC-CAMERA-019 | Áp dụng mã ưu đãi / Chọn ưu đãi | REQ-CAMERA-007 | DOC-CK-04 (camera) R45; mockup ("Nhập mã khuyến mãi" + "Chọn ưu đãi") | Đang ở B2 | Nhập mã ưu đãi / chọn ưu đãi → "Áp dụng" | (Kỳ vọng) trừ tiền vào "Cần thanh toán". 🚫 **Blocked** — voucher chưa implement (CLA-CAMAP-001, như SC-DANGKYUF-015) | P2 | Functional |

### Feature CAM8: B2 — Button Thanh toán (validate + policy)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-012 | Thiếu trường bắt buộc → chặn Thanh toán | REQ-CAMERA-008 | DOC-CK-04 (camera) R46 | B2 còn trường bắt buộc trống | Click "Thanh toán" | Không thực hiện thanh toán; hiển thị lỗi/border đỏ các trường bắt buộc | P2 | Negative |
| SC-CAMERA-013 | Chính sách không còn active → báo lỗi | REQ-CAMERA-008 | DOC-CK-04 (camera) R46 | Gói/chính sách không còn active trên QLCS | Click "Thanh toán" | Báo lỗi chính sách không còn hiệu lực; không thực hiện thanh toán | P1 | Negative |
| SC-CAMERA-014 | Tất cả hợp lệ → thực hiện luồng TT | REQ-CAMERA-008 | DOC-CK-04 (camera) R46 | B2 nhập đủ hợp lệ, chính sách active | Click "Thanh toán" | Thực hiện luồng thanh toán theo PTTT đã chọn (COD → B3 luôn; Online → cổng 3rd party) | P1 | Functional |

### Feature CAM9: B2 — Navigation (Điều khoản, Quay lại)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-015 | Link điều khoản + nút Quay lại | REQ-CAMERA-009 | DOC-CK-04 (camera) R47-48; mockup | Đang ở B2 | Click link "điều khoản" / nút "Quay lại" | Link điều khoản → màn điều khoản dịch vụ đang chọn; "Quay lại" → về màn Chi tiết gói | P3 | UI |

### Feature CAM10: B3 — Hoàn tất đơn hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-016 | PTTT = COD → "Chưa thanh toán" | REQ-CAMERA-010 | DOC-CK-04 (camera) R50 | Chọn PTTT = COD, click Thanh toán | Hoàn tất đặt hàng COD | Màn Hoàn tất: trạng thái "Chưa thanh toán" + nội dung "Đơn hàng đã đăng ký thành công. Kỹ thuật viên FPT sẽ liên hệ triển khai dịch vụ trong 8h-12h. Mọi thắc mắc... 1900 6600..." | P1 | Functional |
| SC-CAMERA-017 | PTTT = Online + thành công → "Đã thanh toán" | REQ-CAMERA-010 | DOC-CK-04 (camera) R52 | Chọn PTTT Online, thanh toán thành công | Hoàn tất thanh toán Online | Bước "Hoàn tất đơn hàng" header màu xanh lá; trạng thái "Đã thanh toán" + nội dung thông báo thành công | P1 | Functional |
| SC-CAMERA-018 | PTTT = Online + thất bại → giữ data, chỉ sửa PTTT + ưu đãi | REQ-CAMERA-010 | DOC-CK-04 (camera) R51 | Chọn PTTT Online, thanh toán thất bại | Thanh toán không thành công | Quay về màn Thanh toán giữ nguyên thông tin đã chọn; **chỉ cho thay đổi PTTT + nhập mã ưu đãi**, các trường còn lại disable | P1 | Negative |

### Feature CAM4b: B2 — Địa chỉ lắp đặt — Chung cư 🚫 DEFERRED

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-CAMERA-020 | Chọn radio Chung cư → nhập field chung cư | REQ-CAMERA-004 | mockup camera.png (radio Nhà riêng/Chung cư); refer CLA-CKCOMMON-006 | Đang ở B2 | Chọn radio "Chung cư" | (Kỳ vọng) hiển thị field Tên chung cư/Tòa/Tầng/Phòng. 🚫 **Deferred** — Chung cư chưa phát triển ver hiện tại (CLA-CKCOMMON-006), áp dụng chung mọi DV | P2 | — |

---
---

# SUB-MODULE: AP — Đăng ký Access Point (Màn hình Checkout 2 bước)
> Nguồn: DOC-CK-04 sheet "Đăng ký AP" (B1→B3). Luồng **giống hệt Camera** trừ: **B1 chỉ chọn số lượng, KHÔNG có chu kỳ**. Không có mockup riêng (tham chiếu mockup Camera cho layout). Field validation đều "refer sheet common" → **tái dùng CKCOMMON**.

### Feature AP1: B1 — Chọn số lượng & điều hướng sang Checkout

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-001 | B1 chọn số lượng → checkout | REQ-AP-001 | DOC-CK-04 (AP) R29-30 | User ở màn Chi tiết gói AP | Chọn số lượng, click "Mua ngay" | Điều hướng sang màn Thanh toán; load đúng tên gói + số lượng + số tiền. ⚠️ AP **không có chu kỳ** (CLA-AP-001) | P1 | Functional |
| SC-AP-002 | Block Sản phẩm + header 2 bước (không chu kỳ) | REQ-AP-001 | DOC-CK-04 (AP) R31-32 | Đang ở B2 | User quan sát màn | Header 2 bước "Thanh toán"→"Hoàn tất đơn hàng"; Block "Sản phẩm dịch vụ đã chọn" load đúng tên gói, số lượng, số tiền (KHÔNG hiển thị chu kỳ) | P1 | Functional |

### Feature AP2: B2 — Block Thông tin cá nhân (Họ tên + SĐT)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-003 | Họ tên + SĐT hợp lệ | REQ-AP-002 | DOC-CK-04 (AP) R33-35; Rule common R2,R3 | Đang ở B2 | Nhập Họ tên + SĐT hợp lệ | Chấp nhận data; **validation chi tiết refer CKCOMMON C4/C5** | P1 | Functional |
| SC-AP-004 | Họ tên/SĐT trống hoặc sai định dạng | REQ-AP-002 | Rule common R2,R3; refer SC-CKCOMMON-007→017 | Đang ở B2 | Để trống / nhập sai định dạng | Border đỏ + message theo Rule common — **dùng lại bộ TC CKCOMMON** | P2 | Negative |

### Feature AP3: B2 — Block Địa chỉ lắp đặt

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-005 | Block Địa chỉ lắp đặt hiển thị đầy đủ | REQ-AP-003 | DOC-CK-04 (AP) R36-41 | Đang ở B2 | User quan sát Block Địa chỉ lắp đặt | Hiển thị: link "Địa chỉ trước sáp nhập", Tỉnh/Thành phố*, Phường/Xã*, Tên đường*, radio Nhà riêng/Chung cư, Số nhà*, Ghi chú. ⚠️ note giao hàng/Thời gian lắp đặt chờ CLA-AP-002 | P1 | Functional |
| SC-AP-006 | Link "Địa chỉ trước sáp nhập" → popup | REQ-AP-003 | DOC-CK-04 (AP) R36; refer SC-CKCOMMON-042→047 | Đang ở B2 | Click link "Địa chỉ trước sáp nhập" | Mở popup "Địa chỉ hành chính cũ" — **hành vi refer CKCOMMON C13** | P2 | Functional |
| SC-AP-007 | Phường/Xã → kiểm tra chính sách giá | REQ-AP-003 | DOC-CK-04 (AP); refer SC-CKCOMMON-028→031 | Đang ở B2 | Chọn Phường/Xã không có chính sách | Popup "Chưa hỗ trợ chính sách!" + đẩy KHTN — **refer CKCOMMON C8** | P2 | Negative |

### Feature AP4: B2 — Block Phương thức thanh toán (COD + Online)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-008 | PTTT load COD + Online theo QLCS | REQ-AP-004 | DOC-CK-04 (AP) R42; Rule common R13 | Đang ở B2, gói cấu hình COD + online | User xem Block Phương thức thanh toán | Hiển thị COD ("Thanh toán tại nhà") + PTTT online theo QLCS; chỉ chọn 1; "Xem thêm" nếu >4 — **refer CKCOMMON C15** | P2 | Functional |

### Feature AP5: B2 — Block Thông tin khách hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-009 | Block TTKH auto-load | REQ-AP-005 | DOC-CK-04 (AP) R43 | Đã nhập TTCN + địa chỉ | User xem Block Thông tin khách hàng | Load đúng Họ tên, Số điện thoại, Địa chỉ đã nhập tại Thông tin cá nhân + Địa chỉ lắp đặt | P2 | Functional |

### Feature AP6: B2 — Block Thông tin thanh toán + Cần thanh toán + Mã ưu đãi

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-010 | Thông tin thanh toán + Cần thanh toán | REQ-AP-006 | DOC-CK-04 (AP) R44-45 | Đang ở B2 | User xem Block Thông tin thanh toán | Load đúng thông tin tại "Sản phẩm dịch vụ đã chọn"; "Cần thanh toán" = tổng tiền | P1 | Functional |
| SC-AP-018 | Áp dụng mã ưu đãi | REQ-AP-006 | DOC-CK-04 (AP) R51 | Đang ở B2 | Nhập/áp dụng mã ưu đãi | (Kỳ vọng) trừ tiền. 🚫 **Blocked** — voucher chưa implement (CLA-CAMAP-001) | P2 | Functional |

### Feature AP7: B2 — Button Thanh toán (validate + policy)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-011 | Thiếu trường bắt buộc → chặn Thanh toán | REQ-AP-007 | DOC-CK-04 (AP) R46 | B2 còn trường bắt buộc trống | Click "Thanh toán" | Không thực hiện thanh toán; hiển thị lỗi các trường bắt buộc | P2 | Negative |
| SC-AP-012 | Chính sách không còn active → báo lỗi | REQ-AP-007 | DOC-CK-04 (AP) R46 | Gói/chính sách không còn active QLCS | Click "Thanh toán" | Báo lỗi chính sách không còn hiệu lực; không thực hiện thanh toán | P1 | Negative |
| SC-AP-013 | Tất cả hợp lệ → thực hiện luồng TT | REQ-AP-007 | DOC-CK-04 (AP) R46 | B2 nhập đủ hợp lệ, chính sách active | Click "Thanh toán" | Thực hiện luồng thanh toán theo PTTT đã chọn | P1 | Functional |

### Feature AP8: B2 — Navigation (Điều khoản, Quay lại)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-014 | Link điều khoản + nút Quay lại | REQ-AP-008 | DOC-CK-04 (AP) R47-48; DOC-CK-05 | Đang ở B2 | Click link "điều khoản" / nút "Quay lại" | Link điều khoản → màn điều khoản dịch vụ; "Quay lại" → về màn Chi tiết gói | P3 | UI |
| SC-AP-019 | Label "Thời gian giao hàng dự kiến từ 3 đến 7 ngày" hiển thị cố định | REQ-AP-003 | **DOC-CK-05** (Đăng ký AP — Block Địa chỉ lắp đặt) | Đang ở màn Thanh toán AP (B2), Block Địa chỉ lắp đặt đang hiển thị | User quan sát Block Địa chỉ lắp đặt | Label **cố định** "Thời gian giao hàng dự kiến từ 3 đến 7 ngày." hiển thị trong Block Địa chỉ lắp đặt; text không thay đổi theo điều kiện nào | P2 | Functional |

### Feature AP9: B3 — Hoàn tất đơn hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-AP-015 | PTTT = COD → "Chưa thanh toán" | REQ-AP-009 | DOC-CK-04 (AP) R50 | Chọn PTTT = COD | Hoàn tất đặt hàng COD | Màn Hoàn tất: "Chưa thanh toán" + nội dung "Đơn hàng đã đăng ký thành công. Kỹ thuật viên FPT sẽ liên hệ triển khai dịch vụ trong 8h-12h..." | P1 | Functional |
| SC-AP-016 | PTTT = Online + thành công → "Đã thanh toán" | REQ-AP-009 | DOC-CK-04 (AP) R52 | Chọn PTTT Online, thành công | Hoàn tất thanh toán Online | Header bước Hoàn tất xanh lá; trạng thái "Đã thanh toán" + thông báo thành công | P1 | Functional |
| SC-AP-017 | PTTT = Online + thất bại → giữ data, chỉ sửa PTTT + ưu đãi | REQ-AP-009 | DOC-CK-04 (AP) R51 | Chọn PTTT Online, thất bại | Thanh toán không thành công | Quay về màn Thanh toán giữ nguyên thông tin; chỉ cho thay đổi PTTT + nhập mã ưu đãi, các trường còn lại disable | P1 | Negative |
