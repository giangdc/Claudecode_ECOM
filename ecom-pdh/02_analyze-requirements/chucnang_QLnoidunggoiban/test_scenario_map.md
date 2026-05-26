# Test Scenario Map
> Dự án: ecom-pdh | Sprint: V1.2 | Phân tích: 2026-05-25 | Cập nhật: 2026-05-25 (BA confirmed CLA-001→009)  
> **Tổng quan: 54 scenarios — P1: 28 | P2: 21 | P3: 5**

---

## Module DANHSACH — Màn hình Danh sách *(không thay đổi Sprint V1.2)*

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-DANHSACH-001 | Xem danh sách | REQ-DANHSACH-001 | DOC-02 §1 | Người dùng đã đăng nhập, có quyền truy cập, hệ thống có dữ liệu nội dung gói bán | Người dùng chọn menu Product Hub → Quản lý nội dung | Danh sách hiển thị 20 bản ghi đầu tiên; sắp xếp Thời gian cập nhật giảm dần; hiển thị đủ cột: STT, Gói bán, Kênh bán, Thời gian cập nhật, Người cập nhật, Thời gian tạo, Người tạo, icon Chỉnh sửa | P3 | Functional |
| SC-DANHSACH-002 | Tìm kiếm có kết quả | REQ-DANHSACH-002 | DOC-02 §1 | Màn hình Danh sách đang hiển thị; hệ thống có gói bán tên "Gói FPT Fiber" | Người dùng nhập "fpt fiber" (chữ thường) → nhấn "Tìm kiếm" | Danh sách trả về kết quả chứa "Gói FPT Fiber" (case-insensitive match thành công) | P3 | Functional |
| SC-DANHSACH-003 | Tìm kiếm không có kết quả | REQ-DANHSACH-002 | DOC-02 §1 | Màn hình Danh sách đang hiển thị | Người dùng nhập từ khóa không tồn tại trong hệ thống → nhấn "Tìm kiếm" | Hệ thống hiển thị thông báo "Không tìm thấy kết quả phù hợp."; danh sách trống | P3 | Negative |
| SC-DANHSACH-004 | Empty state | REQ-DANHSACH-001 | DOC-02 §1 | Hệ thống chưa có nội dung gói bán nào | Người dùng truy cập màn hình Danh sách | Hệ thống hiển thị thông báo "Không có dữ liệu." | P3 | Functional |
| SC-DANHSACH-005 | Điều hướng Tạo mới | REQ-DANHSACH-003 | DOC-02 §1 STT 4 | Đang ở màn hình Danh sách | Người dùng nhấn nút "+ Tạo mới" | Hệ thống điều hướng đến màn hình Tạo mới nội dung gói bán | P3 | Functional |

---

## Module TAOMOI — Màn hình Tạo mới *(Sprint V1.2)*

### Kênh bán & Gói bán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-001 | Kênh bán multi-select thành công | REQ-TAOMOI-001 | DOC-02 §2.3 STT 1 | Người dùng đang ở màn hình Tạo mới; đã chọn Gói bán có giá bán trên FPT.vn và tongdaiwifi.vn; dropdown Kênh bán đã load danh sách theo Gói bán vừa chọn | Người dùng mở dropdown Kênh bán, chọn "FPT.vn" sau đó chọn thêm "tongdaiwifi.vn" | Cả 2 kênh hiển thị trong field Kênh bán; hệ thống chấp nhận multi-select hợp lệ | P1 | Functional |
| SC-TAOMOI-002 | Kênh bán đã sử dụng không hiển thị | REQ-TAOMOI-001 | DOC-02 §2.3 STT 1 BR | Gói bán "Gói A" đã có nội dung được tạo với kênh "FPT.vn" | Người dùng tạo mới nội dung, chọn Gói bán "Gói A"; hệ thống load Kênh bán; người dùng mở dropdown Kênh bán | Kênh "FPT.vn" không xuất hiện trong danh sách (đã sử dụng); chỉ hiển thị các kênh chưa được tạo nội dung cho Gói A | P1 | Negative |
| SC-TAOMOI-003 | Gói bán chỉ load gói active + có giá | REQ-TAOMOI-002 | DOC-02 §2.3 STT 2 | Hệ thống có: "Gói A" (active, có giá), "Gói B" (inactive, có giá), "Gói C" (active, chưa có giá) | Người dùng mở dropdown Gói bán | Dropdown chỉ hiển thị "Gói A"; "Gói B" và "Gói C" không xuất hiện | P2 | Functional |

### Auto-fill Tên hiển thị trên kênh

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-004 | Auto-fill Tên hiển thị — SKU đơn/SKU đi kèm | REQ-TAOMOI-003, REQ-TAOMOI-005 | DOC-02 §2.3 STT 3, 5 | Người dùng đang ở màn hình Tạo mới; Gói bán có SKU đơn với Display name = "Internet Fiber 100Mbps" | Người dùng chọn Gói bán | Field "Tên hiển thị trên kênh" cấp Gói tự động điền "Internet Fiber 100Mbps"; field "Tên hiển thị trên kênh" của SKU trong bảng Danh sách sản phẩm cũng auto-fill từ Display name của từng SKU | P1 | Functional |
| SC-TAOMOI-005 | Auto-fill Tên hiển thị — Nhóm SKU / Phí đi kèm | REQ-TAOMOI-005 | DOC-02 §2.3 STT 5 | Gói bán có Nhóm SKU với Name = "Thiết bị đi kèm" và Phí đi kèm với Name = "Phí lắp đặt" | Người dùng chọn Gói bán | Tên hiển thị trên kênh của Nhóm SKU tự động điền = "Thiết bị đi kèm"; Phí đi kèm tự động điền = "Phí lắp đặt" (dùng Name, không phải Display name) | P1 | Functional |

### Icon gói bán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-006 | Upload Icon gói bán hợp lệ | REQ-TAOMOI-004 | DOC-02 §2.3 Icon gói bán | Người dùng đang ở màn hình Tạo mới | Người dùng upload file "icon_goi.png" (PNG, 500KB) | Icon hiển thị preview thành công; không hiển thị thông báo lỗi | P2 | Functional |
| SC-TAOMOI-007 | Upload Icon gói bán sai định dạng | REQ-TAOMOI-004 | DOC-02 §2.3 Icon gói bán | Người dùng đang ở màn hình Tạo mới | Người dùng upload file "icon.gif" (GIF, 200KB) | Hệ thống từ chối file; hiển thị thông báo lỗi định dạng không hợp lệ (chỉ chấp nhận JPG/PNG/SVG) | P2 | Negative |

### Sản phẩm nhận trong gói (checkbox)

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-008 | Checkbox mặc định checked | REQ-TAOMOI-007 | DOC-02 §2.3 STT 7 | Người dùng đã chọn Gói bán có 3 sản phẩm trong gói | Màn hình Tạo mới hiển thị bảng Danh sách sản phẩm | Tất cả 3 dòng trong cột "Sản phẩm nhận trong gói" đều ở trạng thái checked (tick mặc định) | P1 | Functional |
| SC-TAOMOI-009 | Uncheck → kênh ẩn toàn bộ thông tin sản phẩm | REQ-TAOMOI-007 | DOC-01 QA-006; DOC-02 §2.3 STT 7 | Đang ở màn hình Tạo mới; SKU "Thiết bị A" có checkbox checked; form đã điền đủ thông tin bắt buộc | Người dùng uncheck checkbox của SKU "Thiết bị A" → nhấn Lưu thành công | Khi kênh bán render nội dung gói: SKU "Thiết bị A" không hiển thị bất kỳ thông tin nào (ẩn hoàn toàn trên kênh) | P1 | Functional |

### Phương thức hiển thị

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-010 | SKU con kế thừa phương thức từ Nhóm SKU | REQ-TAOMOI-006 | DOC-02 §2.3 STT 6 | Gói bán có Nhóm SKU "Nhóm Internet" với 2 SKU con; Phương thức hiển thị của Nhóm = "Ẩn toàn bộ" | Người dùng xem field "Phương thức hiển thị" của các SKU con trong bảng | Dropdown của SKU con bị disabled (không chỉnh sửa được); giá trị kế thừa = "Ẩn toàn bộ" từ Nhóm SKU | P2 | Functional |
| SC-TAOMOI-011 | Validate min 1 sản phẩm cha = "Hiển thị toàn bộ" | REQ-TAOMOI-006 | DOC-02 §2.3 STT 6 BR | Gói bán có 2 sản phẩm cha; tất cả đều đang chọn "Hiển thị toàn bộ" | Người dùng đổi tất cả sản phẩm cha sang "Ẩn toàn bộ" hoặc "Chỉ hiển thị ở Summary" → nhấn Lưu | Hệ thống hiển thị thông báo lỗi: cần ít nhất 1 sản phẩm cha có Phương thức = "Hiển thị toàn bộ"; không lưu | P1 | Negative |

### Hình ảnh SKU nhận trong gói

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-012 | Auto-load ảnh từ SKU config có sẵn | REQ-TAOMOI-008 | DOC-01 QA-007; DOC-02 §2.3 STT 8 | SKU "Modem FPT" trong hệ thống đã có ảnh cấu hình sẵn | Người dùng tạo mới nội dung gói bán có chứa SKU "Modem FPT" | Cột "Hình ảnh SKU nhận trong gói" của dòng "Modem FPT" tự động hiển thị ảnh từ cấu hình SKU | P1 | Functional |
| SC-TAOMOI-013 | SKU chưa có ảnh → hiển thị nút Thêm | REQ-TAOMOI-008 | DOC-01 QA-007 | SKU "Thiết bị B" trong hệ thống chưa có ảnh cấu hình | Người dùng tạo mới nội dung gói bán có chứa SKU "Thiết bị B" | Cột "Hình ảnh SKU nhận trong gói" của dòng "Thiết bị B" hiển thị nút "+" (Thêm) thay vì ảnh | P1 | Functional |
| SC-TAOMOI-014 | Upload ảnh SKU hợp lệ (JPG/PNG ≤1MB) | REQ-TAOMOI-008 | DOC-02 §2.3 STT 8 | Đang ở màn hình Tạo mới; SKU "Thiết bị B" đang hiển thị nút "+" | Người dùng nhấn nút "+" → upload "thietbi_b.jpg" (JPG, 800KB) | Ảnh được upload thành công; hiển thị preview trong ô; field chỉ chứa 1 ảnh | P1 | Functional |
| SC-TAOMOI-015 | Upload ảnh SKU sai định dạng | REQ-TAOMOI-008 | DOC-02 §2.3 STT 8 | Đang ở màn hình Tạo mới; SKU đang hiển thị nút Thêm | Người dùng nhấn "+" → upload "thietbi.bmp" (BMP, 300KB) | Hệ thống từ chối file; hiển thị thông báo lỗi định dạng (chỉ JPG/PNG) | P1 | Negative |
| SC-TAOMOI-016 | Giới hạn 1 ảnh/SKU | REQ-TAOMOI-008 | DOC-01 QA-008; DOC-02 §2.3 STT 8 | Đang ở màn hình Tạo mới; SKU "Thiết bị A" đã có 1 ảnh upload | Người dùng cố upload ảnh thứ 2 cho SKU "Thiết bị A" | Hệ thống không cho upload thêm (nút "+" ẩn) hoặc ảnh mới thay thế ảnh cũ; mỗi SKU chỉ có tối đa 1 ảnh | P2 | Boundary |

### Đặc tính gói bán

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-017 | Đặc tính gói bán hiển thị read-only | REQ-TAOMOI-009 | DOC-02 §2.3; CLA-008 | Gói bán có section Đặc tính gói bán với dữ liệu: Nhóm đặc tính, Icon, Tên đặc tính, Giá trị đặc tính, Đặc tính nổi bật, Tag line | Người dùng cố chỉnh sửa bất kỳ trường nào trong section Đặc tính gói bán | Tất cả trường hiển thị read-only; không thể thay đổi giá trị; dữ liệu load từ cấu hình gói bán (không editable) | P2 | Functional |
| SC-TAOMOI-018 | Đặc tính gói bán load đúng theo Gói bán đã chọn | REQ-TAOMOI-009 | DOC-02 §2.3; CLA-008 | Người dùng đang ở màn hình Tạo mới; đã chọn Gói bán "Gói A" có cấu hình đặc tính riêng | Người dùng xem section Đặc tính gói bán | Section hiển thị đúng danh sách đặc tính của "Gói A" (Nhóm, Icon, Tên, Giá trị); không hiển thị đặc tính của gói khác | P2 | Functional |

### Block Đặc quyền

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-019 | Thêm đặc quyền thành công | REQ-TAOMOI-010 | DOC-01 QA-009; DOC-02 §2.3 Nhóm đặc quyền | Đang ở màn hình Tạo mới; block Đặc quyền chưa có đặc quyền nào | Người dùng nhấn nút "+" (Thêm đặc quyền) → nhập Tiêu đề = "Internet dành cho mọi nhà", Nội dung = "Tốc độ 100Mbps không giới hạn" | Dòng mới được thêm vào bảng Đặc quyền với STT=1; Tiêu đề và Nội dung hiển thị đúng như đã nhập | P1 | Functional |
| SC-TAOMOI-020 | Tối đa 10 đặc quyền | REQ-TAOMOI-010 | DOC-02 §2.3 STT 9 | Đang ở màn hình Tạo mới; bảng Đặc quyền đã có 10 dòng | Người dùng nhấn nút "+" (Thêm đặc quyền) lần thứ 11 | Nút "+" bị ẩn hoặc disabled; không thể thêm đặc quyền thứ 11 | P1 | Boundary |
| SC-TAOMOI-021 | Xóa đặc quyền | REQ-TAOMOI-010 | DOC-02 §2.3 STT 8 | Bảng Đặc quyền có 3 dòng | Người dùng nhấn icon "X" của dòng thứ 2 | Dòng thứ 2 bị xóa; STT tự động cập nhật (dòng cũ #3 → STT=2); tổng còn 2 dòng | P1 | Functional |
| SC-TAOMOI-022 | Thiếu Tiêu đề đặc quyền → lỗi validate | REQ-TAOMOI-010 | DOC-02 §2.3 STT 6 | Đang ở màn hình Tạo mới; người dùng đã thêm 1 row đặc quyền, bỏ trống Tiêu đề đặc quyền, có nhập Nội dung | Người dùng nhấn Lưu | Hệ thống hiển thị lỗi validate: "Tiêu đề đặc quyền là bắt buộc"; không lưu thành công | P1 | Negative |
| SC-TAOMOI-023 | Upload icon đặc quyền hợp lệ (JPG/PNG ≤1MB) | REQ-TAOMOI-010 | DOC-02 §2.3 STT 5; CLA-006 | Đang ở bảng Đặc quyền; dòng đặc quyền đang hiển thị placeholder "+" tại cột Icon | Người dùng nhấn "+" ở cột Icon → upload "icon_dacquyen.jpg" (JPG, 800KB) | Icon được upload thành công (JPG/PNG, max 1MB); hiển thị trong ô Icon của dòng tương ứng | P2 | Functional |

### Hình ảnh đặc quyền

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-024 | Upload hình ảnh đặc quyền hợp lệ (JPG/PNG ≤1MB) | REQ-TAOMOI-011 | DOC-02 §2.3 STT 10; CLA-007 | Đang ở block Đặc quyền; field Hình ảnh đặc quyền chưa có ảnh | Người dùng upload "dacquyen.png" (PNG, 500KB) | Ảnh upload thành công (JPG/PNG, max 1MB); hiển thị preview trong field; chỉ 1 ảnh được chấp nhận | P2 | Functional |

### Nhóm hình ảnh

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-025 | Mô tả ngắn — boundary ký tự | REQ-TAOMOI-013 | DOC-02 §2.3 Nhóm hình ảnh STT 1 | Đang ở nhóm hình ảnh; field Mô tả ngắn (max 2000 — theo Tạo mới) | Người dùng nhập đúng 2000 ký tự → Lưu; sau đó thử nhập 2001 ký tự | 2000 ký tự: Lưu thành công; 2001 ký tự: field không cho nhập thêm hoặc hiển thị lỗi vượt giới hạn | P2 | Boundary |
| SC-TAOMOI-026 | Upload Hình ảnh banner đầu trang hợp lệ | REQ-TAOMOI-015 | DOC-01 QA-010; DOC-02 §2.3 STT 3 | Đang ở section Banner đầu trang; chưa có ảnh nào | Người dùng nhấn icon Thêm → upload "banner_top.jpg" (JPG, 500KB) | Ảnh hiển thị preview thành công; counter cập nhật "1/10" | P2 | Functional |
| SC-TAOMOI-027 | Banner đầu trang — tối đa 10 ảnh | REQ-TAOMOI-015 | DOC-02 §2.3 STT 3 | Section Banner đầu trang đã có 10 ảnh | Người dùng cố upload ảnh thứ 11 | Hệ thống không cho upload thêm; nút Thêm bị disabled hoặc hiển thị "Tối đa 10 ảnh" | P2 | Boundary |
| SC-TAOMOI-028 | Link video — URL hợp lệ | REQ-TAOMOI-017 | DOC-02 §2.3 Link video | Đang ở field Link video gói bán | Người dùng nhập "https://youtube.com/watch?v=example123" | Hệ thống chấp nhận; không hiển thị thông báo lỗi; khi lưu, link được lưu thành công | P2 | Functional |
| SC-TAOMOI-029 | Link video — URL sai định dạng | REQ-TAOMOI-017 | DOC-02 §2.3 Link video | Đang ở field Link video gói bán | Người dùng nhập "youtube.com/watch?v=example" (thiếu http/https) | Hệ thống hiển thị thông báo: "Link video không hợp lệ. Vui lòng nhập đúng định dạng URL." | P2 | Negative |
| SC-TAOMOI-030 | Banner giữa trang — thêm banner mới | REQ-TAOMOI-018 | DOC-02 §2.3 STT 5-10 | Section Banner giữa trang (expanded); danh sách chưa có banner | Người dùng nhấn nút "+" (Thêm banner) → upload "banner_mid.png" (PNG, 800KB) | Banner được thêm vào danh sách với STT=1; Ảnh hiển thị preview; Hoạt động=OFF (mặc định) | P2 | Functional |
| SC-TAOMOI-031 | Banner giữa trang — toggle Hoạt động | REQ-TAOMOI-018 | DOC-02 §2.3 STT 9 | Danh sách Banner giữa trang có 1 banner, Hoạt động=OFF | Người dùng nhấn toggle chuyển sang ON | Toggle chuyển sang trạng thái ON; thay đổi được giữ nguyên khi lưu | P2 | Functional |
| SC-TAOMOI-032 | Banner giữa trang — tối đa 10 banner | REQ-TAOMOI-018 | DOC-02 §2.3 STT 10 | Danh sách Banner giữa trang đã có 10 banner | Người dùng nhấn nút "+" thêm banner thứ 11 | Nút "+" bị disabled hoặc ẩn; không thể upload banner thứ 11 | P2 | Boundary |

### Lưu & Hủy

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-TAOMOI-033 | Lưu thành công — tạo N records theo N kênh | REQ-TAOMOI-019 | DOC-02 §2 BR; CLA-005 | Đang ở màn hình Tạo mới; đã chọn Gói bán "Gói A" + 2 Kênh bán (FPT.vn, Hifpt); điền đủ thông tin bắt buộc | Người dùng nhấn nút Lưu | Hệ thống lưu thành công; tạo 2 records riêng biệt trong DB; hiển thị thông báo thành công; chuyển về Danh sách; trong Danh sách xuất hiện 2 dòng riêng biệt: "Gói A - FPT.vn" và "Gói A - Hifpt" | P1 | Functional |
| SC-TAOMOI-034 | Lưu thiếu trường bắt buộc (Kênh bán / Gói bán) | REQ-TAOMOI-019 | DOC-02 §2.3 STT 1, 2 (Y) | Đang ở màn hình Tạo mới; Kênh bán hoặc Gói bán chưa được chọn | Người dùng nhấn nút Lưu | Hệ thống hiển thị thông báo lỗi validate cho trường bắt buộc còn trống; không lưu | P1 | Negative |
| SC-TAOMOI-035 | Hủy — hiển thị popup Xác nhận Hủy đúng nội dung | REQ-TAOMOI-020 | DOC-02 §2.3 STT 12; CLA-001 | Đang ở màn hình Tạo mới; đã nhập một số thông tin | Người dùng nhấn nút "Hủy" | Popup hiển thị với nội dung: "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất." và 2 button: "Quay lại" và "Xác nhận" | P1 | Functional |
| SC-TAOMOI-036 | Hủy popup — nhấn "Xác nhận" → về Danh sách, không lưu | REQ-TAOMOI-020 | DOC-02 §2.3 STT 12; CLA-001 | Popup "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất." đang hiển thị | Người dùng nhấn button "Xác nhận" | Popup đóng; dữ liệu không được lưu; hệ thống quay về màn hình Danh sách | P1 | Functional |
| SC-TAOMOI-037 | Hủy popup — nhấn "Quay lại" → đóng popup, tiếp tục nhập | REQ-TAOMOI-020 | DOC-02 §2.3 STT 12; CLA-001 | Popup "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất." đang hiển thị | Người dùng nhấn button "Quay lại" | Popup đóng; hệ thống quay về form Tạo mới; tất cả dữ liệu đã nhập vẫn còn nguyên | P1 | Functional |

---

## Module CHINHSUA — Màn hình Chỉnh sửa *(Sprint V1.2)*

| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
|-------------|---------|--------|-----------|-------|------|------|----------|-----------|
| SC-CHINHSUA-001 | Load toàn bộ dữ liệu hiện tại | REQ-CHINHSUA-001 | DOC-02 §3.1 | Màn hình Danh sách có bản ghi "Gói FPT Fiber - FPT.vn" với đầy đủ dữ liệu (đặc quyền, ảnh SKU, banner...) | Người dùng nhấn icon Chỉnh sửa của bản ghi đó | Màn hình Chỉnh sửa hiển thị với toàn bộ dữ liệu đã điền sẵn vào form: Kênh bán, Gói bán, Tên hiển thị, Danh sách sản phẩm, Đặc quyền, Hình ảnh... | P1 | Functional |
| SC-CHINHSUA-002 | Kênh bán + Gói bán read-only, không edit được | REQ-CHINHSUA-002 | DOC-02 §3.3 STT 1, 2 | Đang ở màn hình Chỉnh sửa | Người dùng click vào dropdown Kênh bán để thay đổi; sau đó thử click vào dropdown Gói bán | Cả 2 dropdown không mở; field hiển thị giá trị nhưng không cho phép chỉnh sửa | P1 | Negative |
| SC-CHINHSUA-003 | Chỉnh sửa Tên hiển thị trên kênh | REQ-CHINHSUA-003 | DOC-02 §3.3 STT 3 | Đang ở màn hình Chỉnh sửa; Tên hiển thị trên kênh hiện tại = "Gói Internet Cơ Bản" | Người dùng xóa giá trị cũ, nhập "Gói Internet Tốc Độ Cao" → nhấn Lưu | Tên mới được lưu thành công; Danh sách hiển thị tên mới | P2 | Functional |
| SC-CHINHSUA-004 | Chỉnh sửa checkbox Sản phẩm nhận trong gói | REQ-CHINHSUA-004 | DOC-02 §3.3 STT 7 | Đang ở màn hình Chỉnh sửa; SKU "Modem" có checkbox "Sản phẩm nhận trong gói" = checked | Người dùng uncheck checkbox của SKU "Modem" → nhấn Lưu | Trạng thái unchecked được lưu thành công; kênh bán không hiển thị thông tin SKU "Modem" | P1 | Functional |
| SC-CHINHSUA-005 | Upload/thay đổi Hình ảnh SKU nhận trong gói | REQ-CHINHSUA-005 | DOC-02 §3.3 STT 8 | Đang ở màn hình Chỉnh sửa; SKU "Router" đang hiển thị ảnh hiện tại | Người dùng click vào ảnh / icon upload → chọn upload ảnh mới "router_new.jpg" (JPG, 600KB) | Ảnh mới thay thế ảnh cũ; hiển thị preview thành công; khi lưu, ảnh mới được ghi nhận | P1 | Functional |
| SC-CHINHSUA-006 | Chỉnh sửa block Đặc quyền — thêm mới | REQ-CHINHSUA-006 | DOC-02 §3.3 Nhóm đặc quyền | Đang ở màn hình Chỉnh sửa; block Đặc quyền đang có 2 đặc quyền | Người dùng nhấn "+" → thêm đặc quyền "Hỗ trợ kỹ thuật 24/7" với nội dung hợp lệ | Đặc quyền mới được thêm vào danh sách; tổng 3 đặc quyền; khi lưu, thay đổi được ghi nhận | P2 | Functional |
| SC-CHINHSUA-007 | Thay đổi Hình ảnh banner đầu trang | REQ-CHINHSUA-007 | DOC-02 §3.3 STT 3 | Đang ở màn hình Chỉnh sửa; Banner đầu trang đang có 2 ảnh | Người dùng nhấn Thêm → upload "banner_new.jpg" (JPG, 400KB) | Ảnh mới được thêm vào; tổng 3 ảnh banner đầu trang; khi lưu thành công | P2 | Functional |
| SC-CHINHSUA-008 | Toggle Hoạt động banner giữa trang | REQ-CHINHSUA-008 | DOC-02 §3.3 STT 9 | Đang ở màn hình Chỉnh sửa; Banner giữa trang có 1 banner với Hoạt động=OFF | Người dùng bật toggle Hoạt động sang ON → nhấn Lưu | Trạng thái được lưu thành công; banner đó sẽ hiển thị trên kênh | P2 | Functional |
| SC-CHINHSUA-009 | Lưu thành công — cập nhật record + ghi log | REQ-CHINHSUA-009 | DOC-01 QA-003; DOC-02 §3.3 STT 12 | Đang ở màn hình Chỉnh sửa; đã thay đổi Tên hiển thị trên kênh từ "Tên Cũ" thành "Tên Mới" | Người dùng nhấn Lưu | Hệ thống hiển thị thông báo thành công; bản ghi cập nhật với tên mới; Thời gian cập nhật = thời điểm lưu; Người cập nhật = tên người dùng đang đăng nhập | P1 | Functional |
| SC-CHINHSUA-010 | Lưu không thay đổi — thành công và có log | REQ-CHINHSUA-009 | DOC-01 QA-003 | Đang ở màn hình Chỉnh sửa; người dùng không thay đổi field nào | Người dùng nhấn Lưu | Hệ thống hiển thị thông báo thành công; Thời gian cập nhật và Người cập nhật vẫn được ghi nhận mới; nội dung không thay đổi | P1 | Functional |
| SC-CHINHSUA-011 | Hủy — nhấn "Xác nhận" → về Danh sách, không lưu | REQ-CHINHSUA-010 | DOC-02 §3.3 STT 11; CLA-001 | Đang ở màn hình Chỉnh sửa; đã thay đổi một số field; popup "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất." đang hiển thị | Người dùng nhấn button "Xác nhận" | Popup đóng; thay đổi không được lưu; hệ thống quay về màn hình Danh sách | P1 | Functional |
| SC-CHINHSUA-012 | Hủy — nhấn "Quay lại" → đóng popup, tiếp tục sửa | REQ-CHINHSUA-010 | DOC-02 §3.3 STT 11; CLA-001 | Đang ở màn hình Chỉnh sửa; đã thay đổi một số field; người dùng vừa nhấn "Hủy"; popup đang hiển thị | Người dùng nhấn button "Quay lại" | Popup đóng; hệ thống quay về form Chỉnh sửa; tất cả thay đổi vẫn còn nguyên trong form | P1 | Functional |
