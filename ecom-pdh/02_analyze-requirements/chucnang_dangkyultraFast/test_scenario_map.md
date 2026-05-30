# Test Scenario Map — Đăng ký dịch vụ UltraFast

## Tổng quan: 24 scenarios — P1:13 P2:9 P3:2

---

## Module: DANGKYUF — Đăng ký UltraFast (Màn hình Checkout)

### Feature 1: Điều hướng sang Checkout (B1)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-001 | B1 — Điều hướng sang checkout | REQ-DANGKYUF-001 | DOC-UF-01, Row 27-29 | User đang ở màn hình Chi tiết gói UltraFast, trang hiển thị các chu kỳ bán khả dụng | User chọn một chu kỳ bất kỳ rồi click button "Mua ngay" | Hệ thống điều hướng sang màn hình Thanh toán (bước màu xanh dương); URL/state phản ánh đúng gói và chu kỳ đã chọn | P1 | Functional |
| SC-DANGKYUF-002 | B1 — Checkout load đúng chu kỳ + số tiền | REQ-DANGKYUF-001 | DOC-UF-01, Row 29 | User đã chọn chu kỳ X với giá Y và click "Mua ngay" | Màn hình Checkout load xong | Màn hình Thanh toán hiển thị đúng chu kỳ X và số tiền Y đã chọn từ B1 | P1 | Functional |

---

### Feature 2: Block Sản phẩm dịch vụ đã chọn

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-003 | Hiển thị đúng thông tin sản phẩm | REQ-DANGKYUF-002 | DOC-UF-01, Row 32 | User đã chọn gói UltraFast với chu kỳ và số lượng cụ thể từ màn hình Chi tiết | Màn hình Checkout load xong | Block "Sản phẩm dịch vụ đã chọn" hiển thị đúng: tên gói, chu kỳ, số lượng, số tiền | P1 | Functional |

---

### Feature 3: Block Thông tin cá nhân — Số điện thoại

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-004 | SĐT hợp lệ — nhập thành công | REQ-DANGKYUF-003 | DOC-UF-02, Row 3 | User đang ở màn hình Checkout, trường Số điện thoại đang trống | User nhập SĐT hợp lệ: 10 số, bắt đầu bằng 0 (VD: 0901234567) | Textbox chấp nhận, không hiển thị lỗi, border bình thường; icon X xuất hiện cuối textbox | P1 | Functional |
| SC-DANGKYUF-005 | SĐT bỏ trống — required validation | REQ-DANGKYUF-003 | DOC-UF-02, Row 3 | User đang ở màn hình Checkout, trường Số điện thoại để trống | User click button "Thanh toán" mà không nhập SĐT | Hệ thống KHÔNG thực hiện thanh toán; hiển thị lỗi "Vui lòng nhập số điện thoại."; border đỏ quanh trường SĐT | P1 | Negative |
| SC-DANGKYUF-006 | SĐT < 10 số — sai định dạng | REQ-DANGKYUF-003 | DOC-UF-02, Row 3 | User đang ở màn hình Checkout | User nhập SĐT ít hơn 10 số (VD: 090123456 — 9 số) | Hiển thị lỗi "Số điện thoại chưa đúng, mời nhập lại"; border đỏ quanh textbox | P2 | Negative |
| SC-DANGKYUF-007 | SĐT không bắt đầu bằng 0 — sai định dạng | REQ-DANGKYUF-003 | DOC-UF-02, Row 3 | User đang ở màn hình Checkout | User nhập SĐT 10 số nhưng không bắt đầu bằng 0 (VD: 1901234567) | Hiển thị lỗi "Số điện thoại chưa đúng, mời nhập lại"; border đỏ quanh textbox | P2 | Negative |
| SC-DANGKYUF-008 | SĐT boundary — không cho nhập quá 10 số | REQ-DANGKYUF-003 | DOC-UF-02, Row 3 | User đang ở màn hình Checkout | User cố nhập SĐT vượt quá 10 ký tự (VD: 09012345678 — 11 số) | Hệ thống chỉ nhận đúng 10 ký tự đầu, không cho nhập thêm ký tự thứ 11 | P2 | Boundary |
| SC-DANGKYUF-009 | Icon X xóa data SĐT | REQ-DANGKYUF-003 | DOC-UF-02, Row 3 | User đã nhập bất kỳ ký tự nào vào textbox Số điện thoại | User nhìn thấy icon X xuất hiện ở cuối textbox rồi click vào icon X | Toàn bộ nội dung trong textbox SĐT bị xóa; icon X biến mất | P2 | UI |

---

### Feature 4: Block Phương thức thanh toán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-010 | Load đúng danh sách PTTT theo cấu hình QLCS | REQ-DANGKYUF-004 | DOC-UF-01, Row 35 | Gói UltraFast được cấu hình N phương thức thanh toán Online trên tool QLCS | User vào màn hình Checkout | Block PTTT hiển thị đúng N phương thức đã cấu hình (VD: ATM, Momo, VietQR, Zalopay, Thẻ tín dụng) | P1 | Functional |
| SC-DANGKYUF-011 | Không có COD trong danh sách PTTT | REQ-DANGKYUF-004 | DOC-UF-01, Row 35 | Gói UltraFast đang ở màn hình Checkout | User xem danh sách PTTT | Option "Thanh toán khi triển khai" (COD) KHÔNG xuất hiện trong danh sách PTTT | P1 | Functional |
| SC-DANGKYUF-012 | QLCS khai báo chỉ 2 PTTT → hiển thị đúng 2 | REQ-DANGKYUF-004 | DOC-UF-01, Row 35 | Gói UltraFast được cấu hình chỉ 2 PTTT Online (VD: ATM và Momo) trên QLCS | User vào màn hình Checkout | Block PTTT chỉ hiển thị đúng 2 phương thức đã khai báo, không hiển thị thêm | P2 | Business Rule |

---

### Feature 5: Block Thông tin khách hàng

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-013 | Block TTKH hiển thị đúng theo data có sẵn | REQ-DANGKYUF-005 | DOC-UF-01, Row 36 | User vào màn hình Checkout với tài khoản đã có một số thông tin (VD: đã nhập SĐT trước đó) | Màn hình Checkout load xong | Block "Thông tin khách hàng" hiển thị đúng các field đã có data (VD: SĐT đã nhập → hiện SĐT); các field chưa có data hiển thị rỗng; block không ẩn | P2 | Functional |

---

### Feature 6: Block Thông tin thanh toán + Cần thanh toán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-014 | Cần thanh toán = tổng tiền sản phẩm (không voucher) | REQ-DANGKYUF-006 | DOC-UF-01, Row 37-38 | User vào checkout với gói X giá Y, không áp dụng voucher | Màn hình Checkout load xong | "Cần thanh toán" hiển thị đúng tổng tiền Y = giá gói, không có khoản trừ | P1 | Functional |
| ~~SC-DANGKYUF-015~~ | ~~Cần thanh toán đã trừ voucher~~ | REQ-DANGKYUF-006 | DOC-UF-01, Row 38 | — | — | — | P2 | Functional |
> **🚫 BLOCKED** — CLARY-DANGKYUF-005 Resolved 2026-05-28: Tính năng voucher tại bước thanh toán chưa implement. TC sẽ được tạo trong sprint sau khi feature hoàn thiện.

---

### Feature 7: Button Thanh toán — Validate và Execute

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-016 | Còn trường bắt buộc chưa nhập → block thanh toán | REQ-DANGKYUF-007 | DOC-UF-01, Row 39 | User ở màn hình Checkout, trường Số điện thoại (hoặc trường bắt buộc khác) chưa nhập | User click button "Thanh toán" | Hệ thống KHÔNG thực hiện thanh toán; highlight các trường bắt buộc chưa nhập (border đỏ + thông báo lỗi tương ứng) | P1 | Negative |
| SC-DANGKYUF-017 | Chính sách không còn active trên QLCS → báo lỗi | REQ-DANGKYUF-007 | DOC-UF-01, Row 39 | User điền đầy đủ thông tin hợp lệ; tuy nhiên chính sách gói trên QLCS đã bị deactivate trước khi user click TT | User click button "Thanh toán" | Hệ thống hiển thị thông báo lỗi (chính sách không còn active); KHÔNG thực hiện thanh toán | P1 | Negative |
| SC-DANGKYUF-018 | Tất cả hợp lệ + chính sách active → thực hiện thanh toán | REQ-DANGKYUF-007 | DOC-UF-01, Row 39 | User điền đầy đủ SĐT hợp lệ, đã chọn PTTT Online, chính sách còn active | User click button "Thanh toán" | Hệ thống thực hiện validate thành công; redirect sang màn hình thanh toán của 3rd party tương ứng với PTTT đã chọn | P1 | Functional |

---

### Feature 8: Luồng thanh toán Online (3rd party)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-019 | Thanh toán online thành công → hoàn tất (đã TT) | REQ-DANGKYUF-008 | DOC-UF-02, Row 14 (Online flow) | User đã được redirect sang trang 3rd party (VD: cổng ATM/Momo) | User thực hiện thanh toán thành công trên 3rd party | Hệ thống nhận tín hiệu thành công; điều hướng về màn hình hoàn tất đơn hàng với trạng thái "Đã thanh toán" (bước hoàn tất màu xanh lá); KHÔNG đẩy khoản thu vào PTC | P1 | Functional |
| SC-DANGKYUF-020 | Hủy TT tại 3rd party → quay về màn hình Checkout | REQ-DANGKYUF-008 | DOC-UF-02, Row 14 (Online flow) | User đang ở trang thanh toán 3rd party | User hủy thanh toán (click "Hủy", "Cancel" hoặc back từ trang 3rd party) | Hệ thống điều hướng về màn hình Checkout; đơn hàng chưa được tạo | P1 | Functional |
| SC-DANGKYUF-021 | Sau khi back về checkout — chỉ PTTT đổi được | REQ-DANGKYUF-008 | DOC-UF-02, Row 14 (Online flow) | User đã bị redirect về màn hình Checkout sau khi hủy/back từ 3rd party | User nhìn vào form và cố sửa các trường khác (VD: SĐT) | Chỉ trường PTTT có thể thay đổi; các trường còn lại (SĐT, thông tin khách hàng, v.v.) bị disabled; User có thể chọn PTTT khác và click TT lại | P2 | Functional |

---

### Feature 9: Navigation

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|---|---|---|---|---|---|---|---|---|
| SC-DANGKYUF-022 | Click Logo FPT → về FPT.vn | REQ-DANGKYUF-009 | DOC-UF-01, Row 31 | User đang ở màn hình Checkout UltraFast | User click vào Logo FPT ở header | Hệ thống điều hướng về trang chủ FPT.vn | P3 | UI |
| SC-DANGKYUF-023 | Click Quay lại → về màn hình Chi tiết | REQ-DANGKYUF-009 | DOC-UF-01, Row 41 | User đang ở màn hình Checkout UltraFast | User click button "Quay lại" | Hệ thống điều hướng về màn hình Chi tiết gói UltraFast | P2 | UI |
| SC-DANGKYUF-024 | Click text điều khoản → navigate tới privacy-policy | REQ-DANGKYUF-009 | DOC-UF-01, Row 40 | User đang ở màn hình Checkout, thấy text "Bằng việc nhấn vào nút Thanh toán bạn đã đồng ý với các điều khoản của FPT Telecom." | User click vào text điều khoản | Hệ thống điều hướng tới https://fpt.vn/shop/privacy-policy | P3 | UI |
