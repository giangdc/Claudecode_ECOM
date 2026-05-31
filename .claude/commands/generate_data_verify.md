---
description: Sinh Playwright script verify dữ liệu live web khớp với data file Excel. Mỗi dịch vụ/gói = 1 dòng trong Excel — thêm gói mới chỉ cần thêm dòng, không cần chạy lại skill.
skills:
  - qa_automation_engineer
  - ui_debug_agent
  - smart_locator_agent
---

# Workflow: Sinh Data Verification Script từ Excel Data File

> Dùng khi nhiều dịch vụ/gói có **cùng layout UI** nhưng **khác data** (giá, tên, địa điểm, thiết bị...).
> Script sẽ đọc Excel tại runtime → navigate từng URL → assert data hiển thị đúng với data file.
> **Thêm gói mới: chỉ thêm 1 dòng vào Excel — không cần chạy lại skill.**

## ⚠️ Nguyên tắc thực thi

- **Tất cả output bằng Tiếng Việt**
- **TUYỆT ĐỐI KHÔNG ĐOÁN locator** — phải inspect DOM thực tế bằng MCP browser tool
- **Data KHÔNG hardcode trong test script** — test đọc từ file Excel tại runtime
- **Fail message phải rõ ràng:** `Expected price '200.000đ' but found '250.000đ' on /dich-vu-so/goi-ultra-fast`
- ⚠️ **Rule E3:** Test FAIL → tự đọc log → phân tích → sửa → chạy lại. CẤM hỏi user trong quá trình fix. Chỉ hỏi khi: app không accessible, business rule mâu thuẫn, hết 5 vòng auto-heal
- Framework mặc định: **Playwright TypeScript**. Nếu project đang dùng framework khác → hỏi user trước

## Workflow này khác gì `generate_automation_from_testcases`?

| | `generate_data_verify` (skill này) | `generate_automation_from_testcases` |
|---|---|---|
| **Mục đích** | Verify data live web == data file | Convert TC manual → automation script |
| **Data** | Đọc từ Excel file tại runtime | Hardcode từ TC |
| **Thêm case mới** | Thêm dòng Excel — **không cần chạy lại skill** | Phải chạy lại skill |
| **POM** | Không bắt buộc — script nhỏ, focused | Bắt buộc POM đầy đủ |
| **Test name** | `[VERIFY] {path} — {field}: {expected}` | `TC_XXX.N — {title}` |

## Input cần thu thập

| Input | Cách lấy | Bắt buộc |
|---|---|---|
| **File data Excel** (.xlsx) | User cung cấp path | ✅ |
| **Base URL** | User cung cấp | ✅ |
| **Cột chứa URL path** | User chỉ định hoặc detect tự động | ✅ |
| **Fields cần verify** | User chỉ định hoặc verify tất cả cột | Tùy chọn |
| **Credentials** nếu cần login | User cung cấp | Tùy chọn |

> Nếu user chưa cung cấp đủ → hỏi gộp 1 lần trước khi bắt đầu.

---

## Cấu trúc Excel data file (chuẩn)

Row 1 = **header** (tên field). Từ row 2 trở đi = mỗi dịch vụ 1 dòng.

| path | service_name | price | location | device | ... |
|---|---|---|---|---|---|
| dich-vu-so/goi-ultra-fast | Gói Ultra Fast | 200.000đ/tháng | Bình Tân, HCM | ONT ABC | ... |
| dich-vu-so/goi-fast-home | Gói Fast Home | 150.000đ/tháng | Quận 1, HCM | ONT XYZ | ... |

> **Quy ước bắt buộc:**
> - Cột `path`: đường dẫn URL (không có base URL, không có dấu `/` đầu)
> - Tên header = tên field dùng trong assertion message
> - Nếu field không cần verify → để trống cell (skill sẽ skip)

---

## Các bước thực hiện

### Bước 1: Đọc & Phân tích Data File

1. **Đọc Excel** bằng openpyxl hoặc `xlsx` (tùy môi trường):
   - Extract row 1 → danh sách field names (headers)
   - Extract rows 2+ → array of service objects
   - Detect cột `path` (bắt buộc) — nếu không có header tên `path` → hỏi user cột nào là URL path

2. **Thống kê và confirm với user:**
   ```
   📊 Đã đọc data file:
   - Tổng dịch vụ: [N] dòng
   - Fields phát hiện: path, service_name, price, location, device, ...
   - Base URL: https://staging.tongdaiwifi.vn
   - URL đầu tiên sẽ recon: https://staging.tongdaiwifi.vn/{path[0]}

   Fields cần verify (bỏ qua nếu muốn verify tất cả): [danh sách]
   Bạn xác nhận để tiếp tục không?
   ```

3. **Chờ user xác nhận** (hoặc chỉ định subset fields) trước khi sang Bước 2.

---

### Bước 2: DOM Recon — Tìm Locator cho Từng Field (⏸️ CHECKPOINT)

> Chỉ cần recon **1 URL** (dịch vụ đầu tiên trong data file) — các dịch vụ khác cùng layout.

1. **Mở browser và navigate:**
   ```
   browser_navigate(url="{baseUrl}/{path[0]}")
   browser_resize(width=1920, height=1080)
   browser_wait_for → page load hoàn tất
   browser_snapshot()
   ```

2. **Với mỗi field cần verify**, tìm element chứa giá trị đó:
   - Lấy giá trị mẫu từ data file (row đầu tiên)
   - Tìm element trong snapshot chứa text/value đó
   - Thu thập locator theo priority: `data-testid` → `aria-label` → `getByText` → CSS → XPath
   - **Verify locator unique** — phải match đúng 1 element

3. **Xử lý tình huống:**

   | Tình huống | Cách xử lý |
   |---|---|
   | Field hiển thị trong nhiều nơi | Chọn locator scope hẹp nhất (trong component chính) |
   | Giá trị từ data file không tìm thấy trên trang | Ghi nhận → hỏi user field đó hiển thị như thế nào |
   | Trang yêu cầu login | Dùng credentials user đã cung cấp |
   | Data load từ 3rd party tool (có spinner/skeleton) | Thêm `waitForLoadState('networkidle')` hoặc `waitForSelector` |

4. **Ghi lại Locator Map:**

   | Field | Giá trị mẫu | Primary Locator | Fallback | Verified |
   |---|---|---|---|---|
   | price | 200.000đ/tháng | `getByTestId('service-price')` | `.price-display` | ✅ |
   | location | Bình Tân, HCM | `getByTestId('service-location')` | `.location-text` | ✅ |

5. **Verify trên URL thứ 2** (nếu có) để confirm locators dùng chung được:
   ```
   browser_navigate(url="{baseUrl}/{path[1]}")
   browser_snapshot() → kiểm tra locator vẫn match
   ```

---

### Bước 3: Sinh Code

#### 3.1 — Utility đọc Excel (`src/utils/service-data-reader.ts`)

```typescript
import * as XLSX from 'xlsx';
import * as path from 'path';

export interface ServiceData {
  path: string;
  [field: string]: string;
}

export function readServiceData(filePath: string): ServiceData[] {
  const workbook = XLSX.readFile(path.resolve(filePath));
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<ServiceData>(sheet, { defval: '' });
  return rows.filter(row => row.path && row.path.trim() !== '');
}
```

> Nếu project chưa có `xlsx` dependency → thêm vào `package.json`:
> `"xlsx": "^0.18.5"` (hoặc version mới nhất)

#### 3.2 — Test script (`src/tests/common/service-data-verify.spec.ts`)

> Verify data-driven span nhiều dịch vụ trong 1 file → đặt ở `tests/common/` (cross-service, không thuộc 1 module). Data file → `test-data/common/`.

```typescript
import { test, expect } from '@playwright/test';
import { readServiceData } from '../../utils/service-data-reader';

const BASE_URL = process.env.BASE_URL || 'https://staging.tongdaiwifi.vn';
// Đường dẫn tới file Excel data — relative từ project root
const DATA_FILE = process.env.DATA_FILE || 'test-data/common/service_data.xlsx';

const serviceData = readServiceData(DATA_FILE);

for (const service of serviceData) {
  test(`[VERIFY] ${service.path}`, async ({ page }) => {
    await page.goto(`${BASE_URL}/${service.path}`);
    await page.waitForLoadState('networkidle'); // chờ 3rd party data load

    // Assert từng field — locator từ Bước 2 (đã verify trên DOM thực tế)
    // ⚠️ Các locator bên dưới được sinh từ DOM recon — KHÔNG đoán
    if (service.price) {
      await expect(
        page.getByTestId('service-price'),  // ← locator từ Bước 2
        `[${service.path}] price phải là "${service.price}"`
      ).toHaveText(service.price);
    }

    if (service.location) {
      await expect(
        page.getByTestId('service-location'),  // ← locator từ Bước 2
        `[${service.path}] location phải là "${service.location}"`
      ).toHaveText(service.location);
    }

    // ... sinh thêm block if() cho mỗi field trong data file
  });
}
```

**Nguyên tắc sinh code:**
- Mỗi field trong data file → 1 block `if (service.field)` → 1 assertion
- Assertion message phải chứa: `[path] field phải là "expected_value"` → dễ debug khi fail
- Chỉ assert field có giá trị (skip nếu cell trống trong data file)
- `waitForLoadState('networkidle')` bắt buộc trước khi assert — dữ liệu load từ 3rd party

#### 3.3 — Cập nhật `package.json` nếu chưa có `xlsx`

Thêm dependency và script chạy:
```json
{
  "scripts": {
    "verify:services": "playwright test src/tests/common/service-data-verify.spec.ts --reporter=html,json"
  },
  "dependencies": {
    "xlsx": "^0.18.5"
  }
}
```

---

### Bước 4: Chạy Thử & Auto-Heal (Rule E3)

1. **Chạy test:**
   ```bash
   DATA_FILE=test-data/common/service_data.xlsx npx playwright test service-data-verify --headed
   ```

2. **Nếu PASS** → chạy lại 1 lần để confirm stability

3. **Nếu FAIL → vòng lặp Auto-Heal (tối đa 5 vòng):**

   | Lỗi | Nguyên nhân | Cách xử lý |
   |---|---|---|
   | Element not found | Locator sai, DOM thay đổi | MCP snapshot lại → cập nhật locator |
   | Text mismatch | Data file sai format (khoảng trắng, đơn vị) | Log actual text → đề xuất format chuẩn cho data file |
   | Timeout | 3rd party data chưa load | Tăng `waitForLoadState` timeout hoặc thêm `waitForSelector` |
   | Test chạy đúng nhưng data sai | Web thực sự hiển thị sai | **Đây là BUG — PASS test là WRONG.** Log rõ expected vs actual, báo user |

   > ⚠️ **Quan trọng:** Nếu web hiển thị sai data (ví dụ: giá 250 thay vì 200) → đây là **kết quả test FAIL đúng**, KHÔNG phải lỗi script. Không sửa assertion để test pass.

4. **Verify stability** — test phải PASS **2 lần liên tiếp:**
   ```bash
   npx playwright test service-data-verify --repeat-each=2 --retries=0
   ```

---

### Bước 5: Cleanup & Delivery

1. **Code cleanup:**
   - [ ] Không có `console.log()` debug tạm
   - [ ] Không có locator được comment ra
   - [ ] `BASE_URL` và `DATA_FILE` đọc từ env (không hardcode)
   - [ ] `waitForLoadState` phù hợp (không để quá dài không cần thiết)

2. **Tạo file mẫu data Excel** nếu user chưa có:
   - Tạo `test-data/common/service_data.xlsx` với header row đúng format
   - Điền sẵn 1-2 dòng mẫu từ data user đã cung cấp

3. **Báo cáo cho user:**
   ```
   ✅ Data Verify Script đã tạo xong.

   Files:
   - src/utils/service-data-reader.ts
   - src/tests/common/service-data-verify.spec.ts
   - test-data/common/service_data.xlsx  (data file mẫu)

   Chạy:
     DATA_FILE=test-data/common/service_data.xlsx npm run verify:services

   Thêm gói mới:
     → Mở test-data/common/service_data.xlsx → thêm 1 dòng → chạy lại lệnh trên
     → KHÔNG cần chạy lại skill này

   Locator Map (để QA tham khảo khi locator bị break):
   [bảng locator từ Bước 2]
   ```

---

## Output

- **`src/utils/service-data-reader.ts`** — utility đọc Excel, typed interface
- **`src/tests/common/service-data-verify.spec.ts`** — parameterized test, đọc data tại runtime
- **`test-data/common/service_data.xlsx`** — file data mẫu (nếu user chưa có)
- **Locator Map** — bảng primary + fallback locator cho từng field (reference khi locator break)
- **Hướng dẫn thêm gói mới** — chỉ cần thêm dòng vào Excel

## NGHIÊM CẤM

| ❌ Không được làm | ✅ Thay thế |
|---|---|
| Hardcode data trong test script | Đọc từ Excel file tại runtime |
| Đoán locator | `browser_snapshot()` → inspect DOM thực tế |
| Sửa assertion để test pass khi web sai data | Log rõ expected vs actual, giữ test FAIL |
| Dùng `waitForTimeout()` / `Thread.sleep()` | `waitForLoadState('networkidle')` hoặc `waitForSelector` |
