---
name: gen-testcase-checkout-service
description: "Tạo TC nghiệp vụ cho 1 dịch vụ Checkout mới. CHỈ viết phần đặc thù của dịch vụ — KHÔNG viết lại TCs đã có ở sheet Thông tin chung."
---

# ROLE & NGUYÊN TẮC

**Role**: Senior QA/Test Analyst — chuyên phân tích nghiệp vụ checkout đa dịch vụ.

- **Ngôn ngữ output**: Tiếng Việt
- **Không clone common TCs**: bất kỳ TC nào đã có ở `Thông tin chung` → KHÔNG viết lại
- **Không suy đoán** khi thiếu thông tin — ghi `[MISSING]` hoặc hỏi gộp 1 lần
- **Không tự bịa** business rule, expected result, field list
- **Self-check bắt buộc** trước khi output — sai tự sửa

---

# BỐI CẢNH DỰ ÁN

Checkout ecom-pdh có **1 luồng chung** và **nhiều dịch vụ riêng**:

```
TC_checkout.xlsx
  ├── Sheet "Thông tin chung"   ← TCs dùng chung cho tất cả dịch vụ (TC_01.*)
  ├── Sheet "Checkout Smart Home"  ← TCs riêng Smart Home (TC_05.*)
  ├── Sheet "Checkout [Dịch vụ X]" ← TCs riêng Dịch vụ X (TC_0N.*)
  └── ...
```

Sheet `Thông tin chung` (TC_01) đã cover:
- Header + tiến trình các bước
- Block Thông tin Cá nhân: Họ Tên, SĐT, Email (kèm scope dịch vụ)
- Block Địa chỉ lắp đặt: Tỉnh/TP, Phường/Xã, Tên đường, Nhà riêng, Chung cư, Ghi chú, Popup địa chỉ hành chính cũ
- Block Thông tin Khách hàng, Block Phương thức Thanh toán, Block Thông tin Thanh toán
- Luồng thanh toán (submit → OTP → thành công / thất bại)
- Màn hình Hoàn tất đơn hàng: Mã đơn hàng, Thông tin KH, Thông tin Thanh toán

**Skill này CHỈ viết TCs KHÔNG có trong danh sách trên.**

---

# INPUT

**Bắt buộc:**
- Tên dịch vụ mới (VD: "AP Internet", "Smart Tivi", "FiberX")
- Function ID cho sheet mới (VD: TC_06) — hỏi user nếu chưa có
- Spec / URD / màn hình của dịch vụ mới (BA cung cấp)

**Tùy chọn (nếu có):**
- File TC hiện tại `TC_checkout.xlsx` để đọc common sheet
- MEMORY.md của module checkout

---

# EXECUTION WORKFLOW

## STEP 0 — Đọc file TC hiện tại

Nếu được cung cấp `TC_checkout.xlsx`:
- Đọc sheet `Thông tin chung` → lập danh sách **"TCs đã cover"** theo block/field
- Đọc các sheet service đã có (VD: `Checkout Smart Home`) → tham khảo pattern viết

Thông báo:
```
📋 Đã đọc TC_checkout.xlsx:
- Sheet chung: [N] TCs — Cover: [list blocks đã có]
- Sheet dịch vụ tham khảo: [tên sheet, N TCs]
→ Dịch vụ mới: [tên dịch vụ] | Function ID: [TC_0N]
→ Bắt đầu phân tích điểm khác biệt...
```

---

## STEP 1 — Phân tích điểm KHÁC BIỆT của dịch vụ mới

So sánh dịch vụ mới với common sheet theo từng block:

| Block | Common đã cover? | Dịch vụ này có gì KHÁC? |
|-------|-----------------|------------------------|
| Điều hướng vào màn hình checkout | Không (thường khác nhau) | Entry point, URL, step đầu tiên |
| Block Sản phẩm đã chọn | Không | Tên dịch vụ, gói, giá, thông số hiển thị |
| Block Thông tin Cá nhân | Có (fields cơ bản) | Field bổ sung/bỏ đặc thù dịch vụ |
| Block Địa chỉ lắp đặt | Có (fields cơ bản) | Yêu cầu kỹ thuật lắp đặt riêng |
| Block Thông tin Khách hàng | Có | Thông tin thêm riêng dịch vụ |
| Luồng thanh toán | Có (flow chung) | Bước đặc thù, confirmation riêng |
| Màn hình Hoàn tất | Có (fields chung) | Thông tin hiển thị riêng dịch vụ |

**Chỉ giữ lại hàng có điểm KHÁC — đây là phạm vi viết TC.**

---

## STEP 2 — Thiết kế Scenario

Với mỗi điểm khác biệt → liệt kê scenario TRƯỚC khi viết TC:

**Nhóm bắt buộc kiểm tra cho mọi dịch vụ mới:**

| Nhóm | Scenario điển hình |
|------|--------------------|
| **Điều hướng** | Vào màn hình checkout từ đúng luồng của dịch vụ; điều hướng sai (direct URL, sai step) |
| **Block Sản phẩm** | Hiển thị đúng tên/gói/giá; thông số kỹ thuật riêng nếu có |
| **Fields đặc thù** | Field chỉ có ở dịch vụ này — required/optional, validation, default |
| **Business rule riêng** | Rule chỉ áp dụng dịch vụ này (VD: Smart Home cần địa chỉ công trình) |
| **Confirmation/Completion** | Dữ liệu hiển thị trên màn hình hoàn tất có đúng spec dịch vụ |

---

## STEP 3 — Viết Test Cases chi tiết

### Atomic Rule
- 1 TC = 1 mục tiêu kiểm tra
- 1 step = 1 hành động
- 1 expected result chính, rõ verify được

### Priority
| Mức | Khi nào |
|-----|---------|
| High | Luồng chính thanh toán thành công; hiển thị đúng sản phẩm/giá; field required |
| Medium | Hiển thị block phụ; validation field; edge case |
| Low | UI cosmetic; UX minor |

### BLOCKED TC
Khi expected result chưa xác định được:
```
[BLOCKED – cần confirm: <câu hỏi cụ thể với BA/PO>]
```
Đưa vào sheet với Priority = Medium.

### KHÔNG viết lại
- Validation SĐT, Email (format, required, max length) → đã có ở TC_01
- Địa chỉ hành chính (Tỉnh/TP, Phường/Xã) dropdown → đã có ở TC_01
- Phương thức thanh toán list + selection → đã có ở TC_01
- OTP flow → đã có ở TC_01
- Logo FPT click → đã có ở TC_01

---

## STEP 4 — Self-check & Coverage Review

**Coverage — tự check:**
- [ ] Luồng chính (happy path) của dịch vụ đã có chưa?
- [ ] Block Sản phẩm đặc thù đã có chưa?
- [ ] Field riêng của dịch vụ (có/không có so với common) đã check chưa?
- [ ] Business rule đặc thù đã cover chưa?
- [ ] Màn hình Hoàn tất — dữ liệu riêng dịch vụ đã check chưa?

**Không duplicate:**
- [ ] Không có TC nào trùng logic với TC_01.*
- [ ] Không clone validation đã có trong common

**Quality tự chấm (≥ 8/10 mới output):**
- Clarity (title rõ, không mơ hồ)
- Atomicity (1 TC = 1 mục tiêu)
- Coverage (đủ điểm khác biệt)
- Executability (QC đọc là thực hiện được ngay)

---

# OUTPUT

## Format Excel — theo chuẩn TC_checkout.xlsx

### Header block (rows 3–8):
```
Row 3: B3="Mã chức năng (Function ID)" | D3=[TC_0N]
Row 4: B4="Tên chức năng (Function Name)" | D4="Checkout [Tên dịch vụ]"
Row 5: (trống)
Row 6: (trống)
Row 7-8: Column headers (2 dòng merged)
```

### Columns (A–K):
| Col | Label | Ghi chú |
|-----|-------|---------|
| A | QC/AI | Điền tên QC hoặc "AI" |
| B | Testcase ID | Formula: `=IF(F_row="","",$D$3&"."&COUNTA($F$9:F_row)&"")` |
| C | Mức Độ Ưu Tiên | High / Medium / Low |
| D | Nội Dung Test | Bold. Bắt đầu bằng "Kiểm tra..." |
| E | Điều Kiện / Dữ Liệu Test | Role, màn hình hiện tại, data cần có |
| F | Các Bước Thực Hiện | Đánh số 1. 2. 3. — **cột gốc cho TC ID counter** |
| G | Kết Quả Mong Đợi | Expected result rõ ràng |
| H | Kết Quả Thực Hiện | (để trống — QC điền khi test) |
| I | Người Thực Hiện | (để trống) |
| J | ID Bugs | (để trống) |
| K | Ghi Chú | (để trống, hoặc ghi [BLOCKED]) |

### Section separator rows (3 cấp):

| Cấp | Màu fill | Phạm vi | Ví dụ |
|-----|----------|---------|-------|
| Level 1 — Screen | `A4C2F4` (light blue) | A:G merged | "Màn hình Thông tin thanh toán" |
| Level 2 — Block | `A9D08E` (light green) | A:G merged (hoặc B:G) | "Block Sản phẩm dịch vụ đã chọn" |
| Level 3 — Sub-block | `A4C2F4` (light blue) | C:G merged | "Thông tin gói cước" |

### Column header colors:
- Row 7–8: fill `4472C4` (dark blue), font white, bold

### TC data rows:
- Fill: white hoặc xen kẽ `EBF5FB` (tùy chọn)
- Title (col D): **bold**
- Steps (col F): plain text, đánh số

---

## File output

**Output path (BẮT BUỘC):** Ghi vào thư mục module dịch vụ Checkout trong `03_test-cases/functional/`:
```
03_test-cases/functional/<chucnang_checkout_module>/TC_checkout.xlsx
```
Tên thư mục `<chucnang_checkout_module>` mirror đúng tên module trong `02_analyze-requirements/`. Chưa có thì tạo mới.

**Tên file:** giữ nguyên `TC_checkout.xlsx` (trong thư mục module) — thêm sheet mới vào file hiện tại.

> Nếu không thể mở file Excel → tạo file mới trong cùng thư mục module:
> `AI_ISC_ecom-pdh_v1.1_TC_[ServiceName]_v1.0.xlsx`

**Sheet name:** `Checkout [Tên dịch vụ]` — VD: `Checkout AP Internet`

---

## Python generation script

Khi tạo Excel bằng openpyxl, dùng helper sau:

```python
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Màu chuẩn
C_HDR    = "4472C4"   # dark blue — column header
C_LVL1   = "A4C2F4"   # light blue — screen separator
C_LVL2   = "A9D08E"   # light green — block separator
C_LVL3   = "A4C2F4"   # light blue (sub) — sub-block separator
C_WHITE  = "FFFFFF"

def hdr_fill(hex_color):
    return PatternFill("solid", fgColor=hex_color)

def sep_row(ws, row_num, label, level, start_col=1, end_col=7):
    """Write a section separator row."""
    fills = {1: C_LVL1, 2: C_LVL2, 3: C_LVL3}
    cell = ws.cell(row=row_num, column=start_col, value=label)
    cell.fill = hdr_fill(fills[level])
    cell.font = Font(bold=True)
    cell.alignment = Alignment(horizontal="left", vertical="center")
    if end_col > start_col:
        ws.merge_cells(
            start_row=row_num, start_column=start_col,
            end_row=row_num, end_column=end_col
        )

def tc_row(ws, row_num, priority, title, precond, steps, expected, qa="AI"):
    """Write one TC data row."""
    ws.cell(row=row_num, column=1, value=qa)
    # Col B = formula (TC ID) — set after writing all rows or hardcode if needed
    ws.cell(row=row_num, column=3, value=priority)
    title_cell = ws.cell(row=row_num, column=4, value=title)
    title_cell.font = Font(bold=True)
    ws.cell(row=row_num, column=5, value=precond)
    ws.cell(row=row_num, column=6, value=steps)
    ws.cell(row=row_num, column=7, value=expected)
```

---

# HANDOFF

```
✅ TC Checkout [Tên dịch vụ] đã tạo xong.
- Sheet: Checkout [Tên dịch vụ] | Function ID: TC_0N
- Tổng TC: [N] | High:[n] Medium:[n] Low:[n]
- BLOCKED: [N] TC cần BA confirm
- Không viết lại: [N] TCs đã có ở Thông tin chung

Open items:
- [Danh sách BLOCKED + câu hỏi cụ thể]

→ Khi dịch vụ tiếp theo → dùng lại gen-testcase-checkout-service
→ Khi có URD version mới → dùng update-testcase
```

---

# IMPORTANT RULES

1. **Đọc common sheet trước** — không bao giờ bỏ qua bước này
2. **Tham khảo sheet Smart Home** như reference pattern — đặc biệt về cách phân cấp block
3. Function ID phải unique trong workbook — hỏi user nếu chưa biết
4. **Field scope** trong `Thông tin chung` có ghi rõ "(NET, ComBo Net)" hay "(Tất cả dịch vụ)" → dùng thông tin này để quyết định có cần viết TC riêng không
5. Mỗi sheet mới = 1 Function ID riêng, không chia sẻ với sheet khác
