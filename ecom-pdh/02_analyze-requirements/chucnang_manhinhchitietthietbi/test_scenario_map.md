# Test Scenario Map — Chi tiết Thiết bị

## Tổng quan: 13 scenarios MỚI — P1:7 P2:5 P3:1
> Ngoài 13 scenarios mới bên dưới, tất cả scenarios từ `ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx`
> đều áp dụng cho module này (rule không đổi). Gen TC sẽ reuse/adapt từ file SA đó.
>
> **Lưu ý:** Thiết bị non-camera KHÔNG có block Chu kỳ gói. Camera giữ Chu kỳ giống SA.

---

## Module: CSTHIETBI — Thông số kỹ thuật (POPUP MỚI — không có trong SA)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-CSTHIETBI-001 | Mở popup qua "Xem tất cả thông số" | REQ-CSTHIETBI-010 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị, PDH đã cấu hình thông số kỹ thuật, nhìn thấy button "Xem tất cả thông số" trong section Thông số kỹ thuật (nằm dưới block Hình Ảnh & Video) | Click button "Xem tất cả thông số" | Popup Thông số kỹ thuật mở ra, nội dung load đúng từ PDH, nền màn hình dim/mờ | P1 | Functional |
| SC-CSTHIETBI-002 | Mở popup qua entry point "Thông số kỹ thuật" | REQ-CSTHIETBI-010 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị, PDH đã cấu hình thông số kỹ thuật, nhìn thấy entry point/link "Thông số kỹ thuật" trên màn hình (vị trí khác với button "Xem tất cả thông số") | Click "Thông số kỹ thuật" | Cùng popup Thông số kỹ thuật mở ra — giống kết quả SC-001 | P1 | Functional |
| SC-CSTHIETBI-003 | Popup hiển thị hình ảnh kỹ thuật khi PDH có cấu hình ảnh | REQ-CSTHIETBI-012 | DOC-CSTHIETBI-01 | PDH đã cấu hình 1–5 hình ảnh kỹ thuật cho thiết bị, popup đang mở | Quan sát phần hình ảnh trong popup | Hình ảnh kỹ thuật hiển thị đúng theo dữ liệu PDH, số lượng ảnh khớp với cấu hình | P2 | Functional |
| SC-CSTHIETBI-004 | Popup khi không có hình ảnh kỹ thuật (optional) | REQ-CSTHIETBI-012 | DOC-CSTHIETBI-01 | PDH không cấu hình hình ảnh kỹ thuật cho thiết bị này, PDH có cấu hình thông số kỹ thuật (text), popup đang mở | Quan sát phần hình ảnh trong popup | Section hình ảnh không hiển thị, phần thông số text vẫn hiển thị bình thường — không crash | P2 | Negative |
| SC-CSTHIETBI-005 | Boundary max 5 ảnh kỹ thuật — đúng giới hạn | REQ-CSTHIETBI-012 | DOC-CSTHIETBI-01 | PDH cấu hình đúng 5 hình ảnh kỹ thuật, popup đang mở | Đếm số ảnh hiển thị trong popup | Hiển thị đúng 5 ảnh, không hơn không kém | P2 | Boundary |
| SC-CSTHIETBI-006 | Boundary max 5 ảnh — PDH cấu hình vượt giới hạn | REQ-CSTHIETBI-012 | DOC-CSTHIETBI-01 | PDH cấu hình 6+ hình ảnh kỹ thuật, popup đang mở | Đếm số ảnh hiển thị trong popup | Hệ thống chỉ hiển thị tối đa 5 ảnh, ảnh từ thứ 6 không hiển thị | P2 | Boundary |
| SC-CSTHIETBI-007 | Popup hiển thị thông số kỹ thuật đúng 2 cột (nội dung + thông số) | REQ-CSTHIETBI-013 | DOC-CSTHIETBI-01 | PDH đã cấu hình thông số kỹ thuật chi tiết, popup đang mở | Quan sát phần thông số trong popup | Dữ liệu hiển thị dạng 2 cột: cột "nội dung" và cột "thông số", đúng dữ liệu PDH, không vỡ layout | P1 | Functional |
| SC-CSTHIETBI-008 | Block Thông số kỹ thuật ẩn khi PDH không cấu hình | REQ-CSTHIETBI-014 | DOC-CSTHIETBI-01 | PDH không cấu hình thông số kỹ thuật cho thiết bị này | Mở trang chi tiết thiết bị, quan sát layout | Block Thông số kỹ thuật và cả 2 button ("Xem tất cả thông số", "Thông số kỹ thuật") không hiển thị. Không có vùng trống bất thường trong layout | P2 | Negative |
| SC-CSTHIETBI-009 | Đóng popup bằng cách tap vùng ngoài | REQ-CSTHIETBI-015 | DOC-CSTHIETBI-01 | Popup Thông số kỹ thuật đang mở | Tap/click vào vùng dim bên ngoài popup | Popup đóng lại, màn hình chi tiết thiết bị trở về bình thường, không mất data trang | P1 | Functional |
| SC-CSTHIETBI-010 | Đóng popup bằng button X | REQ-CSTHIETBI-015 | DOC-CSTHIETBI-01 | Popup Thông số kỹ thuật đang mở, button X hiển thị trong popup | Click button X trên popup | Popup đóng lại, màn hình chi tiết thiết bị trở về bình thường | P1 | Functional |

---

## Module: CSTHIETBI — Số lượng (KHÁC SA — thiết bị non-camera)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-CSTHIETBI-011 | Selector Số lượng hiển thị mặc định = 1 (thay vì Chu kỳ gói) | REQ-CSTHIETBI-016 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị non-camera (VD: TV, router...) | Mở trang, quan sát khu vực thông tin mua hàng | Block "Số lượng" hiển thị với giá trị mặc định = 1; KHÔNG có block Chu kỳ gói; button Mua Ngay vẫn hiển thị | P1 | Functional |
| SC-CSTHIETBI-012 | Tăng số lượng bằng button (+) | REQ-CSTHIETBI-017 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị non-camera, Số lượng hiện tại = 1 | Click button (+) | Số lượng tăng thêm 1 (hiển thị = 2), giá không thay đổi theo số lượng (cần confirm với BA) | P1 | Functional |
| SC-CSTHIETBI-013 | Giảm số lượng về giới hạn tối thiểu = 1 | REQ-CSTHIETBI-017 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị non-camera, Số lượng hiện tại = 2 | Click button (-) | Số lượng giảm về 1; khi đang ở 1, button (-) bị disabled hoặc không thể giảm thêm | P1 | Boundary |

---

## Module: CSTHIETBI — Chu kỳ & Cloud lưu trữ (CAMERA ONLY — thiếu trong TC v1.0)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|------------|-------|------|------|----------|-----------|
| SC-CSTHIETBI-014 | Chu kỳ hiển thị tất cả option cho camera | REQ-CSTHIETBI-018 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị Camera | Mở trang, quan sát block Chu kỳ | Tất cả option chu kỳ của camera hiển thị đúng (VD: 1 tháng, 3 tháng…). Option đầu tiên được highlight mặc định | P1 | Functional |
| SC-CSTHIETBI-015 | Chọn chu kỳ khác → option highlight, giá cập nhật | REQ-CSTHIETBI-018 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết camera, có >= 2 option chu kỳ | Click chọn option chu kỳ khác (không phải mặc định) | Option vừa chọn được highlight. Giá bán cập nhật đúng theo chu kỳ đã chọn | P1 | Functional |
| SC-CSTHIETBI-016 | Mua Ngay truyền đúng chu kỳ đã chọn cho camera | REQ-CSTHIETBI-018 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết camera, đã chọn chu kỳ 3 tháng (hoặc không phải mặc định) | Click Button Mua Ngay | Màn hình đặt hàng load với chu kỳ đã chọn (3 tháng) được pre-select. Người dùng không phải chọn lại | P1 | Functional |
| SC-CSTHIETBI-017 | Chu kỳ camera không hiển thị ở thiết bị non-camera | REQ-CSTHIETBI-018 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị non-camera (TV, router…) | Quan sát khu vực thông tin mua hàng | Block Chu kỳ KHÔNG hiển thị. Chỉ hiển thị block Số lượng | P1 | Negative |
| SC-CSTHIETBI-018 | Cloud lưu trữ hiển thị tất cả option cho camera | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết camera, PDH cấu hình Cloud lưu trữ | Mở trang, quan sát block Cloud lưu trữ | Tất cả option Cloud lưu trữ hiển thị (VD: Không / 7 ngày / 30 ngày). Option mặc định được highlight | P1 | Functional |
| SC-CSTHIETBI-019 | Chọn option Cloud lưu trữ khác → highlight + giá thay đổi | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết camera, có >= 2 option Cloud lưu trữ | Click chọn option Cloud lưu trữ khác | Option vừa chọn được highlight. Giá bán phản ánh option Cloud lưu trữ đã chọn | P1 | Functional |
| SC-CSTHIETBI-020 | Cloud lưu trữ không hiển thị ở thiết bị non-camera | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết thiết bị non-camera | Quan sát khu vực thông tin mua hàng | Block Cloud lưu trữ KHÔNG hiển thị trên thiết bị non-camera | P1 | Negative |
| SC-CSTHIETBI-021 | Block Cloud lưu trữ ẩn/hiện khi PDH không cấu hình | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | PDH không cấu hình Cloud lưu trữ cho camera | Mở trang chi tiết camera | *(Phụ thuộc CLA-CSTHIETBI-008)* Block Cloud lưu trữ ẩn hoặc hiển thị option mặc định "Không" | P2 | Negative |
| SC-CSTHIETBI-022 | Giá bán tổng hợp đúng khi chọn Chu kỳ + Cloud lưu trữ | REQ-CSTHIETBI-020 | DOC-CSTHIETBI-01 | Đang ở trang chi tiết camera, đã chọn 1 option Chu kỳ và 1 option Cloud lưu trữ | Quan sát giá bán hiển thị | Giá bán hiển thị đúng tổng theo combination đã chọn (Chu kỳ X + Cloud Y). Không hiển thị sai giá | P1 | Functional |

---

## Ghi chú cho gen-testcase-webapp

> **Reuse SA TC:** Copy/adapt toàn bộ TCs từ `ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx`.
> Lưu ý khi adapt: bỏ qua các TCs về "Chu kỳ gói" đối với thiết bị non-camera.
>
> **New TCs:** Gen từ SC-CSTHIETBI-001 đến SC-CSTHIETBI-013 (13 scenarios).
>
> **Blocked:** SC-CSTHIETBI-012 giá có thay đổi theo số lượng không → cần confirm CLA-CSTHIETBI-005.
