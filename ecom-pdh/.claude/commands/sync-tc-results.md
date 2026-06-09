---
description: Đọc Playwright JSON report → map kết quả vào đúng dòng TC trong file Excel. TC đã chạy điền Pass/Fail + ngày thực hiện; TC skip (manual Auto?=N hoặc [BLOCKED]) điền Block + lý do. Phủ kín mọi TC, không để trống ô Kết Quả.
---

# Workflow: Sync Test Results → TC Excel

> Dùng sau khi chạy automation test. Skill đọc Playwright JSON report, tìm TC ID trong tên test,
> rồi điền kết quả vào đúng dòng trong file TC Excel (cột `Actual Result`).

## ⚠️ Nguyên tắc thực thi

- **Ghi backup trước khi sửa Excel** — mặc định KHÔNG overwrite file gốc; tạo file `*_results_{date}.xlsx`
- **Log rõ mọi TC được điền và lý do** — user phải biết chính xác gì đã thay đổi
- **Tất cả output bằng Tiếng Việt**

### Định nghĩa "skip" (QUAN TRỌNG)

> **"Skip" = bất kỳ TC nào trong Excel KHÔNG nhận được kết quả Pass/Fail từ report của lần chạy này.**
> Bao gồm cả 2 nhóm:
> 1. TC manual `Auto?=N` (cột H) — không nằm trong scope automation
> 2. TC `[BLOCKED]` (tiền tố trong cột Nội Dung Test) — chưa thể thực hiện do thiếu feature/spec
>
> → **Mọi TC skip đều phải đánh `Kết Quả Thực Hiện = Block` + ghi lý do cụ thể vào cột Ghi Chú.**
> KHÔNG để trống ô Kết Quả. Sau khi sync, mọi TC trong Excel phải có 1 trong 3 giá trị: `Pass` / `Fail` / `Block`.

### Quy tắc điền cột Ghi Chú

- **TC đã chạy (Pass/Fail):** note **ngày thực hiện** vào Ghi Chú, VD: `Thực hiện tự động (Auto): 2026-05-30`
- **TC Fail:** thêm lý do fail (xác nhận từ DOM/report) vào Ghi Chú; nếu đã có bug → ghi Bug ID vào cột **ID Bugs**
- **TC Block (skip):** ghi lý do block cụ thể vào Ghi Chú (VD: `Block: TC manual (Auto?=N) - chưa test tay` / `Block: voucher chưa implement`)

## Convention bắt buộc — Tên test phải chứa TC ID

Để skill map được, test name trong automation script **phải chứa TC ID** theo format:

```
TC_VOUCHER.3 — Kiểm tra giá hiển thị đúng
TC_LOGIN.1 — Đăng nhập thành công với tài khoản hợp lệ
```

> Format regex detect: `TC_[A-Z0-9_]+\.\d+` hoặc `API_\d+\.\d+`
>
> Skill `generate_automation_from_testcases` sinh test name đúng convention này.
> Nếu test name KHÔNG có TC ID → test đó bị skip (không map vào Excel).

## Input cần thu thập

| Input | Cách lấy | Bắt buộc |
|---|---|---|
| **Playwright JSON report** | Path tới file `.json` (output của `--reporter=json`) | ✅ |
| **TC Excel file** | Path tới file `.xlsx` cần điền — nằm trong `03_test-cases/functional/<module>/` hoặc `03_test-cases/api/<module>/` | ✅ |
| **Round number** | Số thứ tự round cần điền (mặc định: 1) | Tùy chọn |
| **Executed By** | Tên người/script chạy test (mặc định: `Auto`) | Tùy chọn |
| **Overwrite policy** | `backup` (tạo file mới) hoặc `inplace` (sửa trực tiếp) | Tùy chọn |

> Nếu user chưa cung cấp đủ → hỏi gộp 1 lần. Mặc định an toàn: tạo file backup.

---

## Cách sinh Playwright JSON report

User cần chạy test với flag `--reporter=json`:

```bash
# Chạy và xuất JSON report (tự động ghi vào 06_report/ theo playwright.config.ts)
npx playwright test

# Hoặc config thủ công trong playwright.config.ts
reporter: [['json', { outputFile: '../../06_report/report.json' }]]
```

---

## Các bước thực hiện

### Bước 1: Parse Playwright JSON Report

1. **Đọc file JSON report** (dùng `view_file` hoặc Python):

   Cấu trúc Playwright JSON report:
   ```json
   {
     "suites": [
       {
         "title": "Login Tests",
         "specs": [
           {
             "title": "TC_LOGIN.1 — Đăng nhập thành công",
             "ok": true,
             "tests": [{ "status": "expected", "results": [{ "status": "passed" }] }]
           },
           {
             "title": "TC_LOGIN.2 — Đăng nhập sai mật khẩu",
             "ok": false,
             "tests": [{ "status": "unexpected", "results": [{ "status": "failed" }] }]
           }
         ]
       }
     ],
     "stats": { "startTime": "2024-01-15T10:30:00.000Z" }
   }
   ```

2. **Extract từng test result:**
   - Duyệt đệ quy tất cả `suites` → `specs` (test có thể nested nhiều cấp)
   - Với mỗi spec: extract `title`, `ok` (boolean), `results[0].status`
   - Map status: `passed` → `Pass` | `failed` → `Fail` | `skipped` → `Block` | `timedOut` → `Fail`

3. **Extract TC ID từ test title:**
   - Regex: `/(?:TC_[A-Z0-9_]+\.\d+|API_\d+\.\d+)/`
   - Ví dụ: `"TC_LOGIN.1 — Đăng nhập thành công"` → TC ID = `TC_LOGIN.1`
   - Nếu title không match regex → đánh dấu `UNMATCHED` (sẽ skip khi map vào Excel)

4. **Lấy thời gian chạy** từ `stats.startTime` → dùng điền Round date

5. **Tóm tắt parse:**
   ```
   📋 Report parsed:
   - Tổng tests: [N]
   - Passed: [n] | Failed: [n] | Skipped: [n]
   - Có TC ID: [n] tests → sẽ map vào Excel
   - Không có TC ID: [n] tests → skip (generate_data_verify hoặc test không theo convention)
   - Thời gian chạy: [datetime]
   ```

---

### Bước 2: Parse TC Excel File

1. **Đọc file Excel** bằng Python + `openpyxl` (không dùng pandas để tránh dependency):

2. **Với mỗi sheet**, xác định:
   - **Function ID** từ cell `D3` (VD: `TC_LOGIN`, `TC_VOUCHER`)
   - **TC ID column** = cột `B` (Testcase ID — có thể là formula)
   - **Auto? column** = cột `H` (giá trị `Y`/`N`/blank) — dùng để phân loại skip
   - **Round 1 block** = các cột `I`→`L`, header ở row 8. Layout chuẩn template web/mobile:

     | Cột | Index | Header (row 8) | Ghi gì |
     |---|---|---|---|
     | **I** | 9 | `Kết Quả Thực Hiện` | `Pass`/`Fail`/`Block` (+ màu) |
     | **J** | 10 | `Người Thực Hiện` | `Auto` hoặc tên user |
     | **K** | 11 | `ID Bugs` | Bug ID khi Fail (để trống nếu chưa có) |
     | **L** | 12 | `Ghi Chú` | ngày thực hiện / lý do fail / lý do block |

   > Tự verify bằng cách đọc header row 8 (tìm `Kết Quả Thực Hiện`, `Người Thực Hiện`, `ID Bugs`, `Ghi Chú`). KHÔNG ghi note vào cột `ID Bugs` (K) — note phải vào `Ghi Chú` (L).
   - **Round header row** = row 7 (cell merge `I7:L7` chứa `Round 1`...). Ghi `Round 1 — {date}` vào `I7`.
   - **Round N** (N>1): offset cột = `base + (N-1)*4` → Round 2 ở `M`→`P`, v.v.

3. **Xác định round cần điền:**
   - Đếm số Round block đã có trong header row 7
   - Nếu `round_number` user chỉ định vượt quá số round hiện có → thêm Round block mới (copy format từ Round 1)
   - Tính offset cột theo round: `actual_col = base_actual_col + (round - 1) * 4`

4. **Build map TC_ID → (sheet, row_index):**
   ```python
   tc_map = {}
   for sheet_name in workbook.sheetnames:
       ws = workbook[sheet_name]
       for row_idx in range(10, ws.max_row + 1):   # data bắt đầu từ row 10
           tc_id_cell = ws.cell(row=row_idx, column=2).value  # cột B
           if tc_id_cell and re.match(r'TC_|API_', str(tc_id_cell)):
               tc_map[str(tc_id_cell).strip()] = (sheet_name, row_idx)
   ```

   > Nếu cột B chứa formula (không phải giá trị) → đọc `data_only=True` khi open workbook.

---

### Bước 3: Map & Điền Kết Quả

**Duyệt TỪNG TC trong Excel (không chỉ TC trong report)** — phân 3 nhánh:

1. **TC có trong report** (đã chạy) → điền `Pass`/`Fail`:
   - `I` = Pass/Fail (+ màu) · `J` = `Auto` · `L` = `Thực hiện tự động (Auto): {date}`
   - Nếu Fail: nối thêm lý do fail vào `L`; ghi Bug ID vào `K` nếu đã có

2. **TC KHÔNG có trong report nhưng CÓ `[BLOCKED]` trong Nội Dung Test** → `Block` + lý do từ nội dung TC (voucher chưa implement / auth chưa định nghĩa / ...)

3. **TC KHÔNG có trong report và `Auto?=N`** (manual chưa chạy) → `Block` + lý do `TC manual (Auto?=N) - chưa thực hiện trong run này, cần test tay`

> ⚠️ KHÔNG để trống ô Kết Quả cho bất kỳ TC nào. Mọi TC skip (nhánh 2+3) đều = `Block` + lý do ở `Ghi Chú`.

**Bảng điền cells (Round 1):**

| Cột | Pass | Fail | Block (skip) |
|---|---|---|---|
| **I** Kết Quả | `Pass` (xanh `#C6EFCE`) | `Fail` (đỏ `#FFC7CE`) | `Block` (vàng `#FFEB9C`) |
| **J** Người TH | `Auto` | `Auto` | `Auto` |
| **K** ID Bugs | (trống) | Bug ID nếu có | (trống) |
| **L** Ghi Chú | ngày thực hiện | ngày + lý do fail | lý do block |
| `I7` Round header | `Round {N} — {date}` (chỉ ghi nếu trống) |||

**Policy overwrite:** ô đã có giá trị → overwrite (lần chạy mới nhất thắng). Giữ lịch sử → dùng round number khác.

**Log từng thao tác:**
```
✅ TC_LOGIN.1  → row 12 → Pass  (Thực hiện: 2026-05-30)
❌ TC_LOGIN.2  → row 13 → Fail  (lý do: ...)
⏸️ TC_LOGIN.5  → row 16 → Block (Auto?=N, chưa test tay)
⏸️ TC_LOGIN.8  → row 19 → Block ([BLOCKED] - feature chưa implement)
⚠️  TC_LOGIN.9  → có trong report nhưng KHÔNG có trong Excel → log warning, skip
```

---

### Bước 4: Lưu File Excel

1. **Chính sách backup (mặc định):**
   ```python
   import os
   # File kết quả gom vào 06_report/ (tập trung toàn bộ output sau khi chạy test)
   results_dir = os.path.join(<project_root>, '06_report')
   os.makedirs(results_dir, exist_ok=True)
   base = os.path.basename(original_path).replace('.xlsx', f'_results_{date}.xlsx')
   output_path = os.path.join(results_dir, base)
   workbook.save(output_path)
   ```

   Nếu user chọn `inplace` → overwrite file gốc (cảnh báo user trước).

2. **Verify file đã lưu** — mở lại và kiểm tra 1-2 cell để confirm ghi đúng.

---

### Bước 5: Summary Report

In ra báo cáo cuối để user review:

```
╔══════════════════════════════════════════════════════╗
║         SYNC TC RESULTS — KẾT QUẢ                   ║
╠══════════════════════════════════════════════════════╣
║ File report  : 06_report/report.json                 ║
║ File Excel   : 03_test-cases/functional/<module>/...xlsx ║
║ Round        : Round 1                               ║
║ Thời gian    : 2024-01-15 10:30                      ║
╠══════════════════════════════════════════════════════╣
║ KẾT QUẢ (phủ kín mọi TC trong Excel)                ║
║   ✅ Pass  : [n] TC                                  ║
║   ❌ Fail  : [n] TC                                  ║
║   ⏸️  Block : [n] TC  (skip: manual Auto?=N + BLOCKED)║
╠══════════════════════════════════════════════════════╣
║   Trong đó Block tách:                               ║
║     - Manual Auto?=N (chưa test tay) : [n]           ║
║     - [BLOCKED] (thiếu feature/spec) : [n]           ║
║   ⚠️  Trong report nhưng ko có trong Excel: [n]      ║
║      (TC ID không tìm thấy — kiểm tra convention)    ║
╠══════════════════════════════════════════════════════╣
║ FILE OUTPUT  : 06_report/...TC_..._results_20240115.xlsx║
╚══════════════════════════════════════════════════════╝

TC FAIL — cần xem lại:
  ❌ TC_LOGIN.2  → Sheet "Login" row 13
  ❌ TC_VOUCHER.5 → Sheet "Voucher" row 28
```

> Tổng `Pass + Fail + Block` phải = tổng số TC trong Excel (trừ các dòng group header). Nếu còn ô Kết Quả trống → chưa áp dụng đúng rule skip.

---

## Xử lý tình huống đặc biệt

| Tình huống | Cách xử lý |
|---|---|
| **File Excel không có formula TC ID** (giá trị tĩnh) | Đọc bình thường, không cần `data_only` |
| **File Excel có formula TC ID** (=IF(D10="",...)) | Mở bằng `data_only=True` để lấy cached value |
| **TC ID trong Excel dạng "TC_LOGIN.1"** nhưng report có "tc_login.1"| So sánh case-insensitive |
| **Nhiều sheet, cùng TC ID** (lỗi) | Log warning, hỏi user chọn sheet nào |
| **Round cần điền chưa có** trong Excel | Tự thêm Round block mới (copy format Round 1, merge header) |
| **Excel file đang mở** bởi ứng dụng khác | Báo user đóng file trước khi sync |

---

## Cách chạy

```bash
# Bước 1: Chạy test (JSON report tự xuất vào 06_report/report.json)
npx playwright test

# Bước 2: Sync kết quả vào Excel
# (Gọi skill sync-tc-results và cung cấp 2 paths trên)
```

---

## Output

- **File Excel đã cập nhật** — `*_results_{date}.xlsx` (backup) hoặc overwrite
- **Summary report** — bảng kết quả map, danh sách TC fail, TC không map được
- **Log file** (nếu có nhiều warning) — danh sách chi tiết các TC bị skip và lý do

## NGHIÊM CẤM

| ❌ Không được làm | ✅ Thay thế |
|---|---|
| Overwrite file gốc mà không hỏi | Tạo file backup `*_results_{date}.xlsx` mặc định |
| Bịa `Pass`/`Fail` cho TC không có trong report | TC không có trong report → đánh `Block` + lý do (không bịa Pass/Fail) |
| Để trống ô Kết Quả của TC skip | Mọi TC skip → `Block` + lý do ở Ghi Chú |
| Ghi note vào cột `ID Bugs` (K) | Note phải vào cột `Ghi Chú` (L); K chỉ chứa Bug ID |
| Đổi kết quả Fail thành Pass để "cho đẹp" | Ghi đúng kết quả từ report |
| Skip TC fail mà không report | Log đầy đủ danh sách TC fail vào summary |

> **Khi save gặp `PermissionError` (file đang mở trong Excel):** dừng lại, báo user đóng file rồi chạy lại — KHÔNG tự đổi sang tên file khác trừ khi user đồng ý.
