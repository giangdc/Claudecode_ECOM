# TEMPLATE TESTCASE – WEB (ISC Standard)

> **Nguồn gốc:** `7_1-BMPMHDCV_ISC-BM-Testcase-danh-cho-Web.xlsx`  
> **Áp dụng cho:** Kiểm thử Web UI/mobile trên nền tảng ISC / FPT Telecom  
> **Mục đích file này:** Cung cấp cấu trúc chuẩn để skill tự động sinh / cập nhật testcase theo đúng format gốc

---

## 1. Cấu trúc file Excel

### 1.1 Thông tin chức năng (Function Header)

Nằm ở đầu mỗi sheet, gồm 2 dòng metadata:

| Field | Vị trí (Excel) | Ý nghĩa |
|---|---|---|
| **Mã chức năng** (Function ID) | Cell D3 | Mã định danh module, ví dụ `TC_01`, `TC_REG`, `TC_PAY` |
| **Tên chức năng** (Function Name) | Cell D4 | Tên đầy đủ của chức năng đang test |

> Mỗi **sheet** = một **function/module** riêng biệt.

---

### 1.2 Header bảng testcase

Header chiếm **2 dòng** (row 7–8), nền màu xanh dương (`#4472C4`), chữ trắng in đậm.

#### Cấu trúc merge header thực tế

- Các cột `A → H` được merge theo chiều dọc giữa row `7–8`
- Các cột `I → L` được merge ngang tại row `7` để tạo block `Round 1`
- Sub-header của `Round 1` nằm ở row `8`

#### Mapping chi tiết

| Cột | Tên cột (Tiếng Việt) | Tên cột (Tiếng Anh) | Ghi chú |
|---|---|---|---|
| A | QC/AI | QC/AI | Loại TC: `QC`, `AI`, hoặc để trống |
| B | Testcase ID | Testcase ID | Auto-generate bằng công thức |
| C | Mức Độ Ưu Tiên | Priority | `High` / `Medium` / `Low` |
| D | Nội Dung Test | Test Title | Tiêu đề testcase |
| E | Điều Kiện / Dữ Liệu Test | Pre-condition / Test Data | Điều kiện tiên quyết và dữ liệu test |
| F | Các Bước Thực Hiện | Test Steps | Các bước thao tác |
| G | Kết Quả Mong Đợi | Expected Results | Kết quả hệ thống mong đợi |
| **H** | **Có thể Tự Động Hóa** | **Auto?** | `Y` = automatable · `N` = manual-only · _(blank)_ = chưa phân loại |
| I | Kết Quả Thực Hiện | Actual Result | `Pass` / `Fail` / `Block` / `N/A` |
| J | Người Thực Hiện | Executed By | Người chạy testcase |
| K | ID Bugs | ID Bugs | Jira bug ID nếu testcase fail |
| L | Ghi Chú | Remark | Ghi chú thêm |

#### Cấu trúc Round block

```text
I7:L7 = Round 1 (merge cells)

I8 = Actual Result
J8 = Executed By
K8 = ID Bugs
L8 = Remark
```

> Khi thêm round mới:
>
> - Copy block 4 cột của round trước
> - Merge header round mới
> - Đổi tên thành `Round 2`, `Round 3`, ...

---

### 1.3 Nhóm testcase (Group Header)

Các testcase được chia theo nhóm nghiệp vụ.

#### Đặc điểm group header

- Nền màu xanh lá nhạt (`#A9D08E`)
- Merge toàn bộ cột `B → L`
- Không có Testcase ID
- Dùng để phân chia nhóm testcase

#### Convention nhóm phổ biến ISC

1. Authorization (Phân quyền / Unauthenticated)
2. Validation (Required field / format / boundary)
3. Business Flow (Luồng nghiệp vụ chính)

Ví dụ:

```text
Nhóm 1: Authorization
Nhóm 2: Validation
Nhóm 3: Business Flow
```

---

### 1.4 Dòng testcase (TC Row)

Mỗi dòng testcase có format:

```text
| QC/AI | TC ID | Priority | Test Title | Pre-condition | Test Steps | Expected Result | Auto? | Actual Result | Executed By | ID Bugs | Remark |
```

---

## 2. Quy tắc sinh Testcase ID

### 2.1 Công thức Excel thực tế

```excel
=IF(D10="","",$D$3&"."&COUNTA($D$10:D10)&"")
```

### 2.2 Ý nghĩa

- `$D$3` = Function ID của sheet
- TC ID chỉ xuất hiện khi cột `Nội Dung Test` (cột D) có dữ liệu
- Đánh số tăng dần tự động
- Format:

```text
{FunctionID}.{sequence}
```

Ví dụ:

```text
TC_REG.1
TC_REG.2
TC_PAY.3
```

> Không dùng format:
>
> - `TC_REG_001`
> - `TC-REG-01`
> - `REG_001`

---

## 3. Quy tắc nội dung

### 3.1 QC/AI (cột A)

| Giá trị | Ý nghĩa |
|---|---|
| `QC` | Testcase do QC viết |
| `AI` | Testcase do AI sinh |
| _(blank)_ | TC mẫu hoặc chưa phân loại |

---

### 3.2 Priority

| Giá trị | Ý nghĩa |
|---|---|
| `High` | Luồng chính, core business |
| `Medium` | Validation và edge cases |
| `Low` | UI cosmetic hoặc low impact |

---

### 3.3 Test Steps

Quy tắc:

- Mỗi bước = 1 hành động
- Đánh số thứ tự
- Không gộp nhiều hành động vào cùng một bước

Ví dụ:

```text
1. Truy cập màn hình đăng ký
2. Nhập số điện thoại hợp lệ
3. Nhấn nút "Tiếp theo"
```

---

### 3.4 Expected Results

- Mô tả phản hồi của hệ thống
- Không mô tả hành động người dùng
- Nên bắt đầu bằng:
  - "Hệ thống hiển thị..."
  - "Trang chuyển đến..."
  - "Thông báo lỗi xuất hiện..."

Ví dụ:

```text
Hệ thống hiển thị thông báo:
"Số điện thoại không hợp lệ"
```

---

### 3.5 Auto? (cột H)

| Giá trị | Ý nghĩa | Ai điền |
|---|---|---|
| `Y` | TC có thể tự động hóa bằng Playwright/Selenium | AI (gen-testcase-webapp) hoặc QC sửa tay |
| `N` | TC chỉ test thủ công (CAPTCHA, visual check, hardware...) | AI (gen-testcase-webapp) hoặc QC sửa tay |
| _(blank)_ | Chưa phân loại — mặc định khi TC cũ chưa được đánh giá | QC điền sau |

**Nguyên tắc AI điền `Auto?`:**
- `N` khi TC yêu cầu: xác minh màu sắc/hình ảnh thực tế, CAPTCHA, xác nhận qua email/SMS thực, thiết bị phần cứng, kiểm tra in ấn/PDF bằng mắt
- `Y` cho các trường hợp còn lại (functional flow, validation, permission, API response)

---

### 3.6 Actual Result

| Giá trị | Ý nghĩa |
|---|---|
| `Pass` | Đúng expected result |
| `Fail` | Sai expected result |
| `Block` | Không thể test do blocker |
| `N/A` | Không áp dụng |

---

## 4. Mapping khi sinh Excel tự động

Khi skill `gen-testcase-webapp` hoặc `qc-toolkit` sinh file `.xlsx`, cần áp dụng đúng mapping sau:

| Thành phần | Quy tắc |
|---|---|
| Sheet name | Tên chức năng/module |
| Cell D3 | Function ID |
| Cell D4 | Function Name |
| Header row 7–8 | Merge + màu `#4472C4` + font trắng bold |
| Group Header | Merge `B → L` + màu `#A9D08E` |
| TC ID | Công thức auto increment |
| Cột A | `QC` hoặc `AI` |
| Priority | Chỉ dùng `High` / `Medium` / `Low` |
| **Cột H — Auto?** | `Y` / `N` / _(blank)_ — skill `gen-testcase-webapp` điền khi sinh TC; QC có thể sửa thủ công |
| Actual Result | Chỉ dùng `Pass` / `Fail` / `Block` / `N/A` |

---

## 5. Lưu ý về dữ liệu template thực tế

File Excel hiện tại là template khung:

- Chưa chứa testcase mẫu hoàn chỉnh
- Một số dòng dữ liệu chỉ dùng để minh họa format
- Có sẵn công thức TC ID cho nhiều dòng phía dưới
- Không nên overwrite công thức ở cột `Testcase ID`

---

## 6. Ví dụ format TC ID

| Function ID | Sequence | TC ID |
|---|---|---|
| `TC_REG` | 1 | `TC_REG.1` |
| `TC_REG` | 12 | `TC_REG.12` |
| `TC_PAY` | 3 | `TC_PAY.3` |
| `TC_01` | 5 | `TC_01.5` |

---

*Template này được chuẩn hóa từ file Excel thực tế: `7_1-BMPMHDCV_ISC-BM-Testcase-danh-cho-Web.xlsx`*
