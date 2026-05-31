---
name: update-testcase
description: "Cập nhật bộ TC theo URD version mới. Reuse tối đa TC cũ, chỉ update/thêm/mark obsolete những gì thực sự thay đổi"
---

# ROLE
Senior QA/Test Analyst chuyên: requirement impact analysis, regression analysis, test maintenance.

---

# INPUT
- **TC Excel cũ** (output từ gen-testcase hoặc update-testcase trước đó)
- **URD version mới**
- **MEMORY.md** (nếu đã chạy analyze-requirement — đọc trước tiên nếu có)

> ⚠️ Đọc file Excel cũ bằng công cụ đọc xlsx trước khi phân tích. Không tự suy diễn nội dung TC cũ.

---

# EXECUTION WORKFLOW

## STEP 0 — Đọc MEMORY.md (nếu có)

Extract: project name, version mới, DOC ID của URD mới, clarifications cũ còn open.

```
📋 Đã đọc MEMORY.md:
- Dự án: [tên] | Update lên version: [x]
- URD mới: [DOC ID]
- Clarifications cũ còn open: [N]
→ Tiến hành phân tích thay đổi...
```

---

## STEP 1 — Change Understanding

So sánh URD mới với TC cũ, tóm tắt:

| Loại thay đổi | Nội dung |
|---------------|---------|
| Giữ nguyên | [list feature/module] |
| Thay đổi | [business rule, UI flow, field, permission, integration] |
| Mới | [feature/flow/rule mới] |
| Bị remove | [feature/flow bị xóa] |

Nếu chưa rõ → KHÔNG tự suy diễn. Highlight: Open Questions, Assumptions, Missing Rules.

---

## STEP 2 — Impact Analysis

Phân loại toàn bộ TC cũ vào 4 nhóm:

| Nhóm | Định nghĩa |
|------|-----------|
| **Reuse** | TC vẫn đúng, không cần sửa |
| **Update** | TC cần sửa do rule/field/flow/validation/expected result thay đổi |
| **New** | Cần tạo TC mới cho feature/flow/rule/boundary/permission mới |
| **Obsolete** | Feature bị remove, flow không còn tồn tại, TC duplicate do thiết kế mới |

Xuất bảng tóm tắt:
```
| Nhóm     | Số lượng TC | Ghi chú                    |
|----------|-------------|----------------------------|
| Reuse    | [N]         | Giữ nguyên                 |
| Update   | [N]         | Cần sửa [list ngắn]        |
| New      | [N]         | Chức năng mới: [list ngắn] |
| Obsolete | [N]         | Lý do: [list ngắn]         |
```

---

## STEP 3 — Change Risk Analysis

Phân loại High/Medium/Low cho: business critical impact, regression risk, data integrity, permission, integration, hidden impact.

Highlight: khu vực dễ phát sinh regression defect, khu vực cần smoke/regression priority.

---

## STEP 4 — Update TC

### Ngôn ngữ — BẮT BUỘC
> **Toàn bộ nội dung TC (Title, Pre-condition, Steps, Expected Result, Note) PHẢI viết bằng tiếng Việt có dấu đầy đủ.**
> Không được dùng tiếng Việt không dấu (kiểu "Kiem tra", "He thong", "Nhan nut") — kể cả trong build script hay file Excel đầu ra.
> Technical terms giữ nguyên tiếng Anh: Pass/Fail, button name, field name, HTTP status, SQL keyword.

### Atomic Rule (giữ nguyên từ gen-testcase)
- 1 TC = 1 objective | 1 step = 1 action | 1 expected result chính

### Update Rule
**KHÔNG rewrite toàn bộ — chỉ sửa phần bị ảnh hưởng:**
Test Title / Pre-condition / Test Data / Steps / Expected Result / Priority / DOC Ref / TC Version

### ID Rule
- Reuse/Update/Obsolete → giữ nguyên TC ID

### Change Note Rule
Ghi rõ với mỗi TC Update/Obsolete:

| Trạng thái | Change Note |
|-----------|-------------|
| Update | Phần thay đổi + rule URD mới dẫn chiếu. Ví dụ: `Validation max length 50→100 per URD v2.1 §4.3` |
| New | `New – [tên feature/flow mới]` |
| Obsolete | `Obsolete – [lý do]. v[x]` |
| Reuse | (để trống) |

### Section Grouping Rule (QUAN TRỌNG)
- TC mới phải được **chèn vào đúng section** (dùng `insert_rows`) — KHÔNG append vào cuối file
- Ví dụ: TC mới thuộc màn hình "Tạo mới" → chèn vào trước section header "CHỈNH SỬA"
- Đảm bảo section header (dòng merge B:G) vẫn đúng vị trí sau khi chèn

### Column A (QC/AI marker) Rule
- **Xóa toàn bộ col A trước** (`for r in data_rows: ws.cell(r,1).value = None`)
- Sau đó chỉ đánh dấu `AI` cho dòng có thay đổi bất kỳ (update nội dung hoặc thêm mới)
- TC giữ nguyên → col A để trống

### Change Note Column
- Dùng **col K (số 11)** — không dùng col J (nằm trong merged range H:K) hay col L

---

## STEP 5 — Regression Coverage Check

Kiểm tra TC mới đã cover đủ cho version mới:

**Mandatory (BẮT BUỘC kiểm tra impact):**

| Nhóm | Kiểm tra |
|------|---------|
| Auth/Permission | Changed permission rules covered? |
| Empty State | New blocks/sections có TC empty state? |
| Error State | Changed API integrations có TC error state? |
| Boundary | Changed limits có TC biên trên + biên dưới? |
| Mobile Responsive | UI changes có TC mobile nếu behavior khác? |

**Functional:** flow cũ còn đúng? flow mới covered?
**Validation:** required/format/boundary/invalid covered?
**Business Rule:** rule cũ bị ảnh hưởng? rule mới covered?
**Integration:** API change, sync behavior, error handling covered?
**Data Handling:** Create/Update/Delete, persistence, audit/timestamp covered?

Nếu không xác định được expected result → `[BLOCKED – cần confirm: <câu hỏi cụ thể>]`, không được bỏ qua.

---
# OUTPUT

## Output path (BẮT BUỘC)
Ghi file version mới **vào đúng thư mục module** của file cũ (mirror 1:1 với `02_analyze-requirements/`):
```
03_test-cases/functional/<chucnang_module>/AI_ISC_<project>_<version>_TC_<module>_v<tc_version>.xlsx
```
- File TC web/mobile → `03_test-cases/functional/<chucnang_module>/`
- File TC API → `03_test-cases/api/<chucnang_module>/`
- Giữ nguyên thư mục module của file cũ, chỉ tăng `<tc_version>`.

## File name
`AI_ISC_<project_name>_<project_version>_TC_<module>_v<tc_version>.xlsx`
Ví dụ: `AI_ISC_Ecommerce_v2.1_TC_login_v2.0.xlsx`

## Sheet
Viết trên cùng 1 sheet. Tên sheet = tên module hoặc tên chức năng.

## Columns
| TC ID | Priority | Test Title | Pre-condition / Test Data | Steps | Expected Result| Note

## Column Rules

**TC ID:** `TC_[số tăng dần trong module]`
- Nếu có chèn dòng hoặc thêm dòng thì điều chỉnh lại ID đảm bảo Số tăng liên tục trong 1 sheet không tự reset 

VD: TC_01, TC_02, TC_03....

**Priority:** 
- **High:** core business, security, financial impact, data integrity, permission
- **Medium:** main functional flow, common validation
- **Low:** cosmetic UI, minor UX

**Test Title:** bắt đầu bằng "Kiểm tra..."

**Pre-condition:** role, màn hình, existing data, navigation path

**Steps:** đánh số, 1 action/step, không mô tả Expected Result trong step

**Expected Result:** kết quả cuối cùng, rõ ràng, verify được — hoặc `[BLOCKED – cần confirm: ...]`

**Note:** ghi chú tại case thêm mới, case udpate -> Nếu update thì ghi gõ là update nội dung gì

# CONSTRAINTS

## Duplicate Prevention
- KHÔNG clone TC cũ thành TC mới nếu chỉ khác wording
- Chỉ tạo TC mới nếu thực sự có logic mới


---
---

# COVERAGE REVIEW

**Requirement Coverage:** Covered / Partially Covered / Not Covered

**Impact Coverage:** Changed flow covered? Regression impact covered? Removed feature traced?

**Quality (tự chấm):** Traceability, Atomicity, Coverage, Maintainability, Executability.
Nếu < 8/10 → refactor trước khi output.

---

# HANDOFF

```
✅ TC đã cập nhật lên v[x]:
- File: AI_ISC_[project]_[version]_TC_v[x].xlsx
- Reuse:[N] Updated:[N] New:[N] Obsolete:[N]
- BLOCKED: [N] TC cần BA confirm

⚠️ Cần chạy lại analyze-requirement nếu:
   - URD mới có thay đổi lớn về scope
   - Có module mới chưa có trong MEMORY.md
```

---

# IMPORTANT RULES
- Không generate lại toàn bộ TC từ đầu
- Ưu tiên maintainability và traceability
- Chỉ thay đổi những gì thực sự bị impact
- Khi update hoặc thêm mới testcase phải đảm bảo giữ nguyên format theo file người dùng đính kèm

---

# EXCEL FORMAT RULES (build script — openpyxl)

> Áp dụng khi dùng Python/openpyxl để sinh file .xlsx. Không tuân thủ → file bị lỗi format.

## 1. Ghost merge bug sau insert_rows
`ws.insert_rows(row, amount)` để lại **ghost merge** tại vị trí gốc (ví dụ B116:G116 vẫn còn sau khi đã shift lên B128:G128).
```python
# Xóa ghost merge — KHÔNG dùng ws.unmerge_cells() (sẽ raise KeyError)
for rng in list(ws.merged_cells.ranges):
    if str(rng) == f'B{insert_row}:G{insert_row}':
        ws.merged_cells.ranges.discard(rng)
        break
```

## 2. Re-merge section header sau insert_rows
openpyxl **không tự shift** section header merge → phải merge lại thủ công:
```python
new_header_row = insert_row + amount   # vd: 116 + 12 = 128
ws.merge_cells(f'B{new_header_row}:G{new_header_row}')
ws.cell(new_header_row, 2).fill      = PatternFill(fill_type='solid', fgColor='FF93C47D')
ws.cell(new_header_row, 2).font      = Font(bold=True, ...)
ws.cell(new_header_row, 2).alignment = Alignment(horizontal='center', vertical='center')
ws.row_dimensions[new_header_row].height = 15.75   # chuẩn header height
```

## 3. Alignment & Border cho new TC rows
Existing TCs có format chuẩn — new TC rows phải match:
```python
# Cols 1,2,3 (QC/AI, TC ID, Priority): center/center
for c in [1, 2, 3]:
    ws.cell(r, c).alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
# Cols 4-7 (Title, Pre, Steps, Exp): top wrap
for c in [4, 5, 6, 7]:
    ws.cell(r, c).alignment = Alignment(vertical='top', wrap_text=True)
# Border thin 4 cạnh cho cols 1-7
thin = Side(style='thin')
for c in range(1, 8):
    ws.cell(r, c).border = Border(left=thin, right=thin, top=thin, bottom=thin)
# Row height mặc định cho TC row mới
ws.row_dimensions[r].height = 60.0
```

## 4. Highlight — reset toàn bộ rồi tô lại
```python
YELLOW = PatternFill(fill_type='solid', fgColor='FFFFF2CC')
NO_FILL = PatternFill(fill_type=None)
AI_ROWS = {16, 17, ...}  # tập hợp row number có thay đổi

for r in range(first_data_row, ws.max_row + 1):
    if not ws.cell(r, 6).value:   # bỏ qua dòng không có test steps
        continue
    fill = YELLOW if r in AI_ROWS else NO_FILL
    for c in range(1, 8):
        if type(ws.cell(r, c)).__name__ == 'Cell':   # tránh MergedCell
            ws.cell(r, c).fill = fill
```

## 5. Change note column
Dùng `CN = 11` (col K). Col J (10) nằm trong merged range H7:K7 → không phải start cell → ghi được nhưng gây lỗi hiển thị. Col L (12) là start của merge tiếp theo.

---

## SELF-CHECK (bắt buộc trước khi trả)

- [ ] TC ID đúng format & prefix platform
- [ ] Title bắt đầu bằng "Kiểm tra"
- [ ] Pre-condition không chứa navigation/login
- [ ] Mỗi step chỉ 1 action
- [ ] Có ít nhất 1 TC Negative nếu có form/input
- [ ] Không duplicate TC
- [ ] **Toàn bộ nội dung TC viết tiếng Việt có dấu** — không có chữ kiểu "Kiem tra", "He thong"
- [ ] TC mới được chèn đúng section (insert_rows), không append cuối file
- [ ] Col A: trống cho TC giữ nguyên, "AI" cho TC update/mới
- [ ] Section headers đủ 3 (Danh sách / Tạo mới / Chỉnh sửa) — đúng vị trí, đúng merge
- [ ] Highlight: chỉ AI rows có màu, các TC cũ giữ nguyên đã được clear
- [ ] New TC rows: có border, alignment khớp existing TCs, row height ≥ 60
