# Báo cáo Tổng hợp — Chuẩn bị viết URD v1.1
## Quản lý Nội dung Gói bán (ECOM)

**Người tổng hợp**: Document Reviewer Agent  
**Ngày tổng hợp**: 2026-05-04  
**Nguồn**: ECOM_URD_Quanlynoidunggoiban_v1.0.docx + note_v1.1.docx  
**Mục tiêu**: Chuẩn bị nội dung đầu vào để viết URD v1.1

---

## 1. Tóm tắt URD v1.0

### 1.1. Phạm vi hệ thống (Scope)
- Hệ thống: ECOM – Product Hub
- Module: Quản lý Nội dung Gói bán
- Chức năng bao gồm 3 màn hình chính: Danh sách, Tạo mới, Chỉnh sửa nội dung Gói bán
- Truy cập qua menu: Product Hub → Gói bán

### 1.2. Actors / Stakeholders
| Actor | Vai trò |
|-------|---------|
| Người quản trị sản phẩm (Admin / Quản trị viên) | Actor duy nhất được định nghĩa; thực hiện toàn bộ thao tác xem, tạo mới, chỉnh sửa nội dung Gói bán |

> Lưu ý: v1.0 chỉ định nghĩa 1 actor. Chưa có actor "Người xem" hay role phân quyền chi tiết hơn.

### 1.3. Danh sách tính năng chính

#### Màn hình 1: Danh sách nội dung Gói bán
- Xem danh sách các gói bán hiện có trong hệ thống
- Tìm kiếm gói bán theo tên (không phân biệt hoa/thường)
- Phân trang: mặc định 20 bản ghi/trang, sắp xếp theo thời gian cập nhật giảm dần
- Các cột hiển thị: STT, Gói bán, Kênh bán, Thời gian cập nhật, Người cập nhật, Thời gian tạo, Người tạo, Icon thao tác ("...")
- Điều hướng sang màn hình Tạo mới và Chỉnh sửa

#### Màn hình 2: Tạo mới nội dung Gói bán
- **AC1 – Quy tắc chọn Gói bán và Kênh bán**:
  - Single dropdown cho cả Gói bán và Kênh bán
  - Kênh bán load động theo Gói bán đã chọn
  - Chỉ load Gói bán có trạng thái hoạt động và đã có giá bán
  - Kênh bán hỗ trợ: FPT.vn / tongdaiwifi.vn / Hifpt
- **AC1 – Khởi tạo dữ liệu content sau khi chọn Gói bán**:
  - Tên hiển thị: tự động điền từ Display name của SKU (SKU đơn / SKU đi kèm / SKU con trong nhóm SKU) hoặc Name (Phí đi kèm / Nhóm SKU)
  - Phương thức hiển thị: mặc định = "Hiển thị toàn bộ"
  - Mô tả, Mô tả ngắn, Banner, Ảnh: để trống
- **AC2 – Các trường dữ liệu chi tiết**:

| STT | Field | Kiểu | Bắt buộc | Ghi chú |
|-----|-------|------|----------|---------|
| 1 | Gói bán | Single Dropdown | Có | Chỉ load gói bán đang hoạt động và đã có giá bán |
| 2 | Kênh bán | Single Dropdown | Có | Load động theo Gói bán đã chọn |
| 3 | Tên hiển thị | Input text (max 255 ký tự) | Có | Tự động điền khi chọn Gói bán; người dùng có thể chỉnh sửa |
| 4 | Phương thức hiển thị | Single Dropdown | Có | Giá trị: Hiển thị toàn bộ / Ẩn toàn bộ / Chỉ hiển thị ở Summary; SKU con kế thừa từ nhóm SKU |
| 5 | Mô tả gói bán | Long text (max 2.000 ký tự) | Không | Bất kỳ nội dung |
| 6 | Mô tả ngắn gói bán | Long text (max 2.000 ký tự) | Không | Bất kỳ nội dung |
| 7 | Banner gói bán | Image upload | Không | JPG/PNG, tối đa 1MB/ảnh, tối đa 10 ảnh |
| 8 | Ảnh gói bán | Image upload | Không | JPG/PNG, tối đa 1MB/ảnh, tối đa 10 ảnh |

- **Các nút thao tác**:
  - Lưu: lưu toàn bộ thông tin, hiển thị thông báo thành công
  - Hủy: không lưu dữ liệu, quay về màn hình Danh sách

#### Màn hình 3: Chỉnh sửa nội dung Gói bán
- Giao diện giống Tạo mới, nhưng dữ liệu hiện tại được load sẵn
- Sau khi lưu: cập nhật bản ghi hiện có, ghi nhận Thời gian cập nhật + Người cập nhật
- Validate, giới hạn ký tự, quy tắc upload ảnh giống màn hình Tạo mới

### 1.4. Yêu cầu phi chức năng (NFR)
> v1.0 không có phần NFR riêng biệt. Các ràng buộc kỹ thuật được nhúng trong mô tả use case:

- **Phân trang**: mặc định 20 bản ghi/trang
- **Sắp xếp**: theo thời gian cập nhật giảm dần
- **Validate ảnh**: JPG/PNG, tối đa 1MB/ảnh, tối đa 10 ảnh/field
- **Giới hạn ký tự**: Tên hiển thị max 255, Mô tả/Mô tả ngắn max 2.000
- **Quyền truy cập**: Kiểm tra phân quyền trước khi cho phép thao tác
- **Tìm kiếm**: Case-insensitive

---

## 2. Thay đổi / Bổ sung từ note_v1.1

| # | Thay đổi | Loại | Màn hình ảnh hưởng | Mức độ ảnh hưởng |
|---|----------|------|-------------------|-----------------|
| 1 | Đổi tên label "Tên hiển thị" thành "Tên hiển thị trên kênh"; mở rộng phạm vi áp dụng: không chỉ cho Tên sản phẩm (SKU) mà thêm cả trường Gói bán | Sửa đổi | Màn hình 2, 3 | Cao |
| 2 | Thêm cột "Sản phẩm nhận trong gói" (bên phải cột Phương thức hiển thị), kiểu checkbox, mặc định tick chọn; checked = hiển thị trên kênh, unchecked = kênh không hiển thị | Thêm mới | Màn hình 2, 3 | Cao |
| 3 | Thêm cột "Hình ảnh SKU nhận trong gói" (bên phải cột Sản phẩm nhận trong gói): mặc định load ảnh từ cấu hình SKU, cho phép chỉnh sửa / upload mới; mỗi sản phẩm chỉ chọn 1 ảnh; định dạng và dung lượng giữ nguyên như cũ | Thêm mới | Màn hình 2, 3 | Cao |
| 4 | Bổ sung block "Đặc quyền" (privileges block) | Thêm mới | Chưa rõ màn hình cụ thể | Trung bình |
| 5 | Bổ sung trường "Hình ảnh banner đầu trang" | Thêm mới | Chưa rõ màn hình cụ thể | Trung bình |
| 6 | Bổ sung trường "Hình ảnh banner giữa trang" | Thêm mới | Chưa rõ màn hình cụ thể | Trung bình |

### Chi tiết từng thay đổi

#### Thay đổi #1: Đổi tên "Tên hiển thị" → "Tên hiển thị trên kênh"
- **Loại**: Sửa đổi (label rename + mở rộng scope)
- **Mô tả**: Label cũ "Tên hiển thị" được đổi thành "Tên hiển thị trên kênh". Quan trọng hơn: trước đây trường này chỉ config cho Tên sản phẩm (SKU), nay được mở rộng để cũng config cho tên Gói bán hiển thị trên kênh.
- **Ảnh hưởng**: Cần cập nhật label trong tất cả màn hình (Danh sách, Tạo mới, Chỉnh sửa) và cập nhật logic auto-fill nếu có.

#### Thay đổi #2: Thêm cột "Sản phẩm nhận trong gói"
- **Loại**: Thêm mới
- **Kiểu dữ liệu**: Checkbox (per-row, trong bảng danh sách line items của Gói bán)
- **Vị trí**: Bên phải cột "Phương thức hiển thị"
- **Behavior**: Mặc định = tick chọn (checked); Checked → hiển thị trên kênh; Unchecked → kênh không hiển thị sản phẩm đó
- **Ảnh hưởng**: Thêm trường mới vào data model, thêm cột trong UI table, cập nhật logic render phía kênh bán

#### Thay đổi #3: Thêm cột "Hình ảnh SKU nhận trong gói"
- **Loại**: Thêm mới
- **Vị trí**: Bên phải cột "Sản phẩm nhận trong gói"
- **Behavior**:
  - Mặc định: load hình ảnh từ cấu hình SKU (trong hệ thống)
  - Cho phép chỉnh sửa hoặc upload hình ảnh mới
  - Hình ảnh đại diện cho SKU tương ứng với từng sản phẩm trong gói
  - Click icon "Thêm" để upload hình ảnh mới
  - Mỗi sản phẩm chỉ chọn được 1 ảnh
  - Định dạng và dung lượng: giữ nguyên như quy tắc cũ (JPG/PNG, max 1MB)
- **Ảnh hưởng**: Thêm field image per line-item vào data model; logic load ảnh mặc định từ SKU config; UI upload per row

#### Thay đổi #4: Bổ sung block "Đặc quyền"
- **Loại**: Thêm mới
- **Mô tả**: Bổ sung một block/section mới tên "Đặc quyền" trong form tạo/chỉnh sửa nội dung Gói bán
- **Chi tiết**: Chưa có mô tả cụ thể về các trường bên trong block này

#### Thay đổi #5 & #6: Bổ sung "Hình ảnh banner đầu trang" và "Hình ảnh banner giữa trang"
- **Loại**: Thêm mới
- **Mô tả**: Tách field "Banner gói bán" hiện tại (v1.0) thành 2 field riêng biệt: banner đầu trang và banner giữa trang — hoặc đây là 2 field bổ sung hoàn toàn mới song song với Banner hiện có (chưa rõ)
- **Chi tiết**: Chưa có quy tắc về định dạng, dung lượng, số lượng ảnh riêng biệt cho từng loại banner

---

## 3. Q&A — Câu hỏi cần làm rõ trước khi viết URD v1.1

### Câu hỏi từ URD v1.0 (Open Questions chưa giải quyết)

**[QA-001]** Nội dung cụ thể của thông báo thành công sau khi Tạo mới / Chỉnh sửa là gì?  
— Nguồn: URD v1.0, Màn hình 2 & 3, Alternative Flow; Bảng Open Questions #1  
=> Trả lời: Không quan tâm, chỉ cần nội dung hợp lý là được

**[QA-002]** Khi người dùng thay đổi Gói bán sau khi đã chọn Kênh bán, Kênh bán có bị reset về trống không?  
— Nguồn: URD v1.0, Bảng Open Questions #2  
— Trạng thái: Chưa có câu trả lời
=> Trả lời: Có reset

**[QA-003]** Khi mở màn hình Chỉnh sửa nhưng không thay đổi field nào rồi nhấn Lưu: hệ thống lưu lại hay bỏ qua? Có tạo record audit log không?  
— Nguồn: URD v1.0, Bảng Open Questions #3  
=> Trả lời: thông báo thành công, có ghi nhận log, nội dung không đổi

**[QA-004]** Khi nhấn Hủy sau khi đã chỉnh sửa một số field: hệ thống có hiện confirm dialog trước khi thoát không?  
— Nguồn: URD v1.0, Bảng Open Questions #4  
— Trạng thái: Chưa có câu trả lời
=> Trả lời: Không hiển thị confirm
### Câu hỏi phát sinh từ note_v1.1

**[QA-005]** Thay đổi #1: "Tên hiển thị trên kênh" cho Gói bán — giá trị mặc định khi chọn Gói bán là gì? Có được auto-fill như Tên hiển thị của SKU không, hay phải nhập thủ công?  
— Nguồn: note_v1.1, điểm 1
=> Trả lời: Auto fill như SKu 

**[QA-006]** Thay đổi #2: Cột "Sản phẩm nhận trong gói" — checkbox này áp dụng trên từng line item trong bảng (per-row) hay là một trường duy nhất ở cấp Gói bán? Nếu unchecked, kênh có hiển thị giá sản phẩm đó không?  
— Nguồn: note_v1.1, điểm 2
=> Trả lời: mỗi line item trong bảng có 1 checkbox, uncheck kênh bán sẽ không hiển thị bất kỳ thông tin nào

**[QA-007]** Thay đổi #3: "Hình ảnh SKU nhận trong gói" — nếu SKU chưa có ảnh trong cấu hình SKU, field này hiển thị gì? Placeholder rỗng hay thông báo "Chưa có ảnh"? Người dùng có thể bỏ trống không?  
— Nguồn: note_v1.1, điểm 3
=> Trả lời: nếu sku ko có ảnh thì chỗ này hiển thị là 1 bnt + để người dùng thêm, nếu có thì sẽ hiển thị ảnh, không bắt buộc chọn ảnh 

**[QA-008]** Thay đổi #3: Quy tắc ảnh cho "Hình ảnh SKU nhận trong gói" — note nói "định dạng và dung lượng như cũ", nhưng giới hạn số lượng là 1 ảnh/sản phẩm. Cần xác nhận: 1 ảnh/SKU trong gói, hay 1 ảnh/toàn bộ gói?  
— Nguồn: note_v1.1, điểm 3
Trả lời: 1 ảnh/ 1 SKU

**[QA-009]** Thay đổi #4: Block "Đặc quyền" bao gồm những trường nào? Đây là input text, danh sách checkbox, hay cấu trúc phức tạp hơn? Có liên quan đến logic nghiệp vụ nào hiện có không?  
— Nguồn: note_v1.1, điểm 4
Trả lời: kiểm tra lại file note v1.1 có , UI cũng có . Đặc quyền này để trả data cho kênh bán, có thì hiển thị không thì thôi

**[QA-010]** Thay đổi #5 & #6: "Hình ảnh banner đầu trang" và "Hình ảnh banner giữa trang" — Hai trường này thay thế hay bổ sung cho "Banner gói bán" hiện có trong v1.0? Quy tắc upload (định dạng, dung lượng, số lượng) có giống Banner gói bán hiện tại không?  
— Nguồn: note_v1.1, điểm 5 & 6
Trả lời: Hình ảnh banner đầu trang, cuối trang là bổ sung cho "Banner gói bán" hình ảnh banner đầu trang rule như "Banner gói bán", "Hình ảnh banner giữa trang" -> kiểm tra lại UI giúp tôi

**[QA-011]** Thay đổi #5 & #6: Hai loại banner (đầu trang / giữa trang) có kích thước (dimensions) khác nhau không? Có cần validation kích thước ảnh (width x height) không?  
— Nguồn: note_v1.1, điểm 5 & 6
Trả lời: Không, người dùng tự chịu tránh nhiệm
**[QA-012]** Các thay đổi #2, #3 (thêm cột vào bảng line items) — bảng này hiện tại trong v1.0 có cột nào? URD v1.0 mô tả "Phương thức hiển thị" là single dropdown cấp Gói bán, nhưng note v1.1 gợi ý có bảng per-line-item. Cần xác nhận cấu trúc UI thực tế của bảng line items.  
— Nguồn: URD v1.0 Mục 2.3 (field #4) + note_v1.1 điểm 2 & 3
Hiện tại đang có các cột: Sản phẩm (sku) | Tên hiển thị | Phương thức hiển thị

**[QA-013]** Các thay đổi #2, #3 — khi người dùng ở màn hình Danh sách, các cột mới (Sản phẩm nhận trong gói, Hình ảnh SKU nhận trong gói) có hiển thị không? Hay chỉ trong màn hình Tạo mới / Chỉnh sửa?  
— Nguồn: note_v1.1 điểm 2 & 3; URD v1.0 Màn hình 1
Trả lời: Màn danh sách giữ nguyên không thay đổi
---

## 4. Danh sách điểm sẵn sàng để viết URD v1.1

Các nội dung sau đây đã đủ rõ ràng để đưa thẳng vào URD v1.1:

### 4.1. Giữ nguyên từ v1.0 (không thay đổi)
- [x] Thông tin tài liệu: tên dự án (ECOM), loại tài liệu (URD), actor (Admin/Quản trị viên)
- [x] Màn hình 1 — Danh sách: toàn bộ use case (trigger, pre/post condition, basic/alternative/exception flow, business rules)
- [x] Màn hình 1 — Các cột danh sách: STT, Gói bán, Kênh bán, Thời gian cập nhật, Người cập nhật, Thời gian tạo, Người tạo, Icon "..."
- [x] Màn hình 2 & 3 — Use case header: trigger, pre/post condition, basic/alternative/exception flow
- [x] Màn hình 2 — AC1: Quy tắc chọn Gói bán (single dropdown, chỉ load active + đã có giá)
- [x] Màn hình 2 — AC1: Kênh bán load động theo Gói bán; danh sách kênh: FPT.vn / tongdaiwifi.vn / Hifpt
- [x] Màn hình 2 — AC1: Logic auto-fill Phương thức hiển thị mặc định = "Hiển thị toàn bộ"
- [x] Màn hình 2 — AC1: Logic auto-fill Mô tả, Mô tả ngắn, Banner, Ảnh = trống
- [x] Màn hình 2 — Trường Phương thức hiển thị: 3 giá trị (Hiển thị toàn bộ / Ẩn toàn bộ / Chỉ hiển thị ở Summary); SKU con kế thừa nhóm SKU
- [x] Màn hình 2 — Trường Mô tả gói bán: Long text, max 2.000 ký tự, không bắt buộc
- [x] Màn hình 2 — Trường Mô tả ngắn gói bán: Long text, max 2.000 ký tự, không bắt buộc
- [x] Màn hình 2 — Trường Ảnh gói bán: JPG/PNG, max 1MB/ảnh, tối đa 10 ảnh, không bắt buộc
- [x] Màn hình 2 — Nút Lưu và Hủy với behavior đã mô tả
- [x] Màn hình 3 — So sánh Tạo mới vs Chỉnh sửa (bảng diff đã có sẵn)
- [x] NFR nhúng: phân trang 20 bản ghi, sắp xếp thời gian cập nhật giảm dần, tìm kiếm case-insensitive

### 4.2. Cập nhật/Thêm mới — đã đủ thông tin để viết
- [x] **Đổi tên label**: "Tên hiển thị" → "Tên hiển thị trên kênh" (tất cả màn hình)
- [x] **Trường mới: "Sản phẩm nhận trong gói"**:
  - Kiểu: Checkbox, per-line-item trong bảng
  - Vị trí: Bên phải cột "Phương thức hiển thị"
  - Mặc định: Checked (tick)
  - Logic: Checked = hiển thị trên kênh; Unchecked = ẩn trên kênh
- [x] **Trường mới: "Hình ảnh SKU nhận trong gói"**:
  - Kiểu: Image upload, per-line-item
  - Vị trí: Bên phải cột "Sản phẩm nhận trong gói"
  - Mặc định: Load ảnh từ cấu hình SKU trong hệ thống
  - Cho phép: Chỉnh sửa hoặc upload mới (click icon "Thêm")
  - Giới hạn: 1 ảnh/sản phẩm; JPG/PNG; max 1MB

### 4.3. Cập nhật/Thêm mới — CẦN làm rõ trước khi viết
- [ ] Block "Đặc quyền": cần mô tả chi tiết các trường và logic (xem QA-009)
- [ ] "Hình ảnh banner đầu trang" và "Hình ảnh banner giữa trang": cần xác nhận quan hệ với "Banner gói bán" hiện tại và quy tắc upload (xem QA-010, QA-011)
- [ ] "Tên hiển thị trên kênh" cho Gói bán: cần xác nhận giá trị mặc định auto-fill (xem QA-005)
- [ ] Open Questions từ v1.0 (QA-001 đến QA-004): vẫn chưa được giải đáp trong note v1.1

---

## Phụ lục: Mapping thay đổi → Section URD v1.1 cần cập nhật

| Thay đổi | Section cần cập nhật trong URD v1.1 |
|----------|--------------------------------------|
| #1 Label rename | Màn hình 1 (cột danh sách), Màn hình 2 (Mục 2.3, field #3), Màn hình 3 (Mục 3.3) |
| #2 Sản phẩm nhận trong gói | Màn hình 2 (Mục 2.3, thêm field mới), Màn hình 3 (Mục 3.3) |
| #3 Hình ảnh SKU nhận trong gói | Màn hình 2 (Mục 2.3, thêm field mới), Màn hình 3 (Mục 3.3) |
| #4 Block Đặc quyền | Màn hình 2, Màn hình 3 (thêm section mới) |
| #5 Banner đầu trang | Màn hình 2 (Mục 2.3, cập nhật/thêm field Banner), Màn hình 3 |
| #6 Banner giữa trang | Màn hình 2 (Mục 2.3, cập nhật/thêm field Banner), Màn hình 3 |
