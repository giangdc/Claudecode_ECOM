---
description: Đọc Playwright JSON report → map kết quả Pass/Fail vào đúng dòng TC trong file Excel. Điền cột Actual Result, Executed By, và Round date tự động.
---

# Workflow: Sync Test Results → TC Excel

> Dùng sau khi chạy automation test. Skill đọc Playwright JSON report, tìm TC ID trong tên test,
> rồi điền kết quả vào đúng dòng trong file TC Excel (cột `Actual Result`).

## ⚠️ Nguyên tắc thực thi

- **KHÔNG overwrite Actual Result nếu cell đã có giá trị và report không có TC đó** — chỉ ghi khi có mapping
- **Ghi backup trước khi sửa Excel** — không overwrite trực tiếp file gốc nếu không được phép
- **Log rõ mọi TC được điền và TC bị skip** — user phải biết chính xác gì đã thay đổi
- **Tất cả output bằng Tiếng Việt**

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
| **TC Excel file** | Path tới file `.xlsx` cần điền | ✅ |
| **Round number** | Số thứ tự round cần điền (mặc định: 1) | Tùy chọn |
| **Executed By** | Tên người/script chạy test (mặc định: `Auto`) | Tùy chọn |
| **Overwrite policy** | `backup` (tạo file mới) hoặc `inplace` (sửa trực tiếp) | Tùy chọn |

> Nếu user chưa cung cấp đủ → hỏi gộp 1 lần. Mặc định an toàn: tạo file backup.

---

## Cách sinh Playwright JSON report

User cần chạy test với flag `--reporter=json`:

```bash
# Chạy và xuất JSON report
npx playwright test --reporter=json > test-results/report.json

# Hoặc config trong playwright.config.ts
reporter: [['json', { outputFile: 'test-results/report.json' }]]
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
   - **Actual Result column** = tính từ cột `A`:
     - Template chuẩn (có cột `Auto?`): Actual Result ở **cột I** (Round 1)
     - Template cũ (không có cột `Auto?`): Actual Result ở **cột H** (Round 1)
     - Tự detect bằng cách đọc header row 8: tìm cell có text `Actual Result` hoặc `Kết Quả Thực Hiện`
   - **Executed By column** = cột ngay sau Actual Result
   - **Round header row** = row 7 (cell merge chứa `Round 1`, `Round 2`...)
   - **Round date** = nếu có row phụ dưới Round header → ghi date vào đó; nếu không có → ghi vào Remark

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

1. **Với mỗi test result có TC ID** (từ Bước 1):
   - Lookup TC ID trong `tc_map`
   - Nếu tìm thấy → ghi vào Excel
   - Nếu không tìm thấy → log warning, skip

2. **Điền các cells:**

   | Cell | Giá trị | Ghi chú |
   |---|---|---|
   | `Actual Result` (cột I hoặc detect) | `Pass` / `Fail` / `Block` | Màu cell: Pass=xanh nhạt `#C6EFCE`, Fail=đỏ nhạt `#FFC7CE`, Block=vàng nhạt `#FFEB9C` |
   | `Executed By` (cột J hoặc detect) | `Auto` hoặc tên user cung cấp | |
   | Round header | `Round {N} — {date}` | Chỉ ghi nếu cell trống |

3. **Policy overwrite:**
   - Nếu `Actual Result` cell đã có giá trị → **overwrite** (lần chạy mới nhất thắng)
   - Nếu muốn giữ lịch sử → user chỉ định round number khác nhau mỗi lần

4. **Log từng thao tác:**
   ```
   ✅ TC_LOGIN.1  → Sheet "Login" row 12 → Pass
   ✅ TC_LOGIN.2  → Sheet "Login" row 13 → Fail
   ⚠️  TC_LOGIN.5  → Tìm thấy trong report nhưng KHÔNG có trong Excel → skip
   ℹ️  TC_PAY.3   → Có trong Excel nhưng KHÔNG có trong report → giữ nguyên
   ```

---

### Bước 4: Lưu File Excel

1. **Chính sách backup (mặc định):**
   ```python
   # Tạo file mới thay vì overwrite
   output_path = original_path.replace('.xlsx', f'_results_{date}.xlsx')
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
║ File report  : test-results/report.json              ║
║ File Excel   : ecom-pdh/03_test-cases/TC_v1.0.xlsx   ║
║ Round        : Round 1                               ║
║ Thời gian    : 2024-01-15 10:30                      ║
╠══════════════════════════════════════════════════════╣
║ ĐIỀN THÀNH CÔNG                                      ║
║   ✅ Pass  : [n] TC                                  ║
║   ❌ Fail  : [n] TC                                  ║
║   ⏸️  Block : [n] TC                                  ║
╠══════════════════════════════════════════════════════╣
║ KHÔNG MAP ĐƯỢC                                       ║
║   ⚠️  Trong report nhưng ko có trong Excel: [n]      ║
║      (TC ID không tìm thấy — kiểm tra convention)    ║
║   ℹ️  Trong Excel nhưng ko có trong report: [n]      ║
║      (TC chưa được automate hoặc bị skip)            ║
╠══════════════════════════════════════════════════════╣
║ FILE OUTPUT  : TC_v1.0_results_20240115.xlsx         ║
╚══════════════════════════════════════════════════════╝

TC FAIL — cần xem lại:
  ❌ TC_LOGIN.2  → Sheet "Login" row 13
  ❌ TC_VOUCHER.5 → Sheet "Voucher" row 28
```

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
# Bước 1: Chạy test và xuất JSON report
npx playwright test --reporter=json > test-results/report.json

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
| Overwrite file gốc mà không hỏi | Tạo file backup mặc định |
| Điền kết quả cho TC không có trong report | Chỉ điền khi có match chính xác TC ID |
| Đổi kết quả Fail thành Pass để "cho đẹp" | Ghi đúng kết quả từ report |
| Skip TC fail mà không report | Log đầy đủ danh sách TC fail vào summary |
