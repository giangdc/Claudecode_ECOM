# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace overview

This is a **QA Manual Testing workspace** for FPT Telecom's ecom platform (ISC/ECP). It contains:
- AI-driven skills (custom slash commands) for the full QA pipeline
- Templates and rules for generating standardized test case Excel files
- Project `ecom-pdh/` — the active QA project (v1.1, Sprint 2)
- `ecom-pdh/05_automation/` — Playwright TypeScript E2E framework (lives inside the project, was moved from a root-level `automation-framework/` in 2026-06)

The full skill reference is in `.claude/CLAUDE.md`. This root file covers architecture, conventions, and tooling.

---

## Environment & tooling gotchas (đọc trước khi thao tác)

- **Ổ đĩa là FAT32** (`E:`), không phải NTFS → không có ACL (`takeown`/`icacls` vô tác dụng), và **entry thư mục dễ hỏng/mồ côi**. Triệu chứng: một thư mục hiện trong PowerShell nhưng `cmd dir` không thấy, mọi thao tác mở/xóa/rename báo "Access denied" hoặc "does not exist", và `git reset/pull` chết với `cannot create directory ... Permission denied`. **Cách sửa:** `chkdsk E: /f` từ Command Prompt **Administrator** (đóng app đang giữ ổ E: trước, kể cả IDE). Đã xảy ra với `03_test-cases/_results` (2026-06-08).
- **Chạy npm/npx qua PowerShell, KHÔNG qua Bash tool.** Bash tool ở đây không có `node` trong PATH (lỗi `'"node"' is not recognized`). Dùng `PowerShell` với `Set-Location <abs path>` rồi `npx playwright test ...`. Bash chỉ dùng cho `git` và `python`.
- **Python openpyxl + Tiếng Việt:** đặt `PYTHONIOENCODING=utf-8` khi chạy script in ra console (cp1252 sẽ crash trên ký tự có dấu).

---

## Skill pipeline (the core workflow)

```
BA drops URD/spec → ecom-pdh/00_input/
        ↓
/analyze-requirement   → ecom-pdh/02_analyze-requirements/<module>/
                         MEMORY.md, test_scenario_map.md, requirement_traceability.md,
                         risk_assessment.md, test_data_catalog.md
        ↓                          ↓
/gen-testcase-webapp                 /gen-testcase-api (hoặc gen-testcase-api-v3)
→ 03_test-cases/functional/<module>/   → 03_test-cases/api/<module>/
  (1 thư mục / module, mirror 1:1 với 02_analyze-requirements/<module>/)
        ↓
/gen-testcase-checkout-service   (for new Checkout service sheets only)
        ↓
/update-testcase   (when URD version bumps)
        ↓
── Automation lane (Web UI only) ──────────────────────────────────
[one-time] /generate_automation_framework
→ ecom-pdh/05_automation/   (inside the ecom-pdh project)

/generate_automation_from_testcases
  Input : 03_test-cases/*.xlsx  (chỉ các TC có cột Auto? = Y)
  Input : URL ứng dụng (phải accessible — không sau VPN)
→ ecom-pdh/05_automation/src/pages/*.ts   (Page Object classes)
→ ecom-pdh/05_automation/src/tests/*.spec.ts  (Test scripts)

/sync-tc-results                        (sau khi chạy test)
  Input : 06_report/report.json         (Playwright JSON — tự ghi theo playwright.config.ts)
  Input : 03_test-cases/functional/<module>/*.xlsx
→ 06_report/*_results_{date}.xlsx       (Pass/Fail điền vào cột Actual Result)
```

**Key rule — manual pipeline:** always run `analyze-requirement` before `gen-testcase-*` for a new module. Skills read from `02_analyze-requirements/<module>/MEMORY.md` as their primary input. Skipping analyze → Option B (direct URD read) = lower quality output.

**Key rule — folder mirror (02 ↔ 03):** `03_test-cases/` phản chiếu 1:1 cấu trúc module của `02_analyze-requirements/`, nhưng tách theo loại test:
- `03_test-cases/functional/<chucnang_module>/` — TC Web/Mobile, mỗi module 1 thư mục đúng tên với `02_analyze-requirements/<chucnang_module>/`.
- `03_test-cases/api/<chucnang_module>/` — TC API (chỉ module nào có API).
- Mỗi module = 1 file TC riêng (không gộp nhiều module vào 1 file); 1 module nhiều nhóm chức năng → nhiều sheet trong cùng file.

**Key rule — automation lane:**
1. `generate_automation_framework` chỉ chạy **một lần** khi chưa có `ecom-pdh/05_automation/`.
2. `generate_automation_from_testcases` chỉ đọc TC có `Auto? = Y` trong cột H của Excel.
3. App URL phải accessible trực tiếp (không qua VPN). Nếu không → agent block tại Bước 2 (MCP DOM Recon).

---

## Automation framework commands

Tất cả lệnh chạy từ thư mục `ecom-pdh/05_automation/`:

```powershell
# Setup (lần đầu)
npm install
npx playwright install chromium
cp .env.example .env          # điền BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD

# Chạy test
npm test                      # headless, tất cả
npm run test:headed            # có browser, dùng khi debug
npm run test:ui                # Playwright UI mode
npm run test:debug             # step-by-step debug

# Chạy 1 file hoặc 1 test cụ thể
npx playwright test src/tests/ultrafast/ultrafast-checkout.spec.ts
npx playwright test -g "TC_DANGKYUF.5"

# Chạy test — report tự ghi vào 06_report/
npx playwright test            # JSON + HTML + Allure đều xuất vào 06_report/

# Kiểm tra TypeScript
npm run lint

# Xem report
npm run test:report            # Playwright HTML report (06_report/playwright-report/)
npm run allure:generate && npm run allure:open  # Allure (06_report/allure-report/)
```

**Env vars** (`ecom-pdh/05_automation/.env`): `BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `VIEWER_EMAIL`, `VIEWER_PASSWORD`.

---

## Automation framework architecture

**Tổ chức domain-driven:** `pages/` và `tests/` chia 1 folder / module (mirror 1:1 với `03_test-cases/functional/<module>/`), cộng lớp `common/` cho thành phần dùng chung. `fixtures/` + `utils/` là hạ tầng dùng chung. **Cấm import chéo giữa 2 module** — chỉ import từ `common/` hoặc trong cùng folder module.

```
ecom-pdh/05_automation/
├── src/
│   ├── pages/              # Page Object classes — extends BasePage
│   │   ├── common/         # Page DÙNG CHUNG mọi feature
│   │   │   ├── base.page.ts    # Abstract base: clickElement, fillInput, navigate
│   │   │   ├── login.page.ts
│   │   │   └── dashboard.page.ts
│   │   ├── ultrafast/      # Page RIÊNG feature (mirror module 03)
│   │   │   ├── product-detail.page.ts   # cycle selector, Mua ngay
│   │   │   └── checkout-ultrafast.page.ts  # Phone, PTTT, submit
│   │   └── internet/       # Internet checkout (register, payment, product)
│   ├── fixtures/           # Hạ tầng dùng chung (KHÔNG chia theo module)
│   │   ├── base.fixture.ts    # Page fixtures (loginPage, dashboardPage)
│   │   └── auth.fixture.ts    # Auth helper
│   ├── utils/              # Hạ tầng dùng chung (KHÔNG chia theo module)
│   │   ├── env.config.ts      # Reads .env → exports config object
│   │   ├── test-data.ts       # TestDataGenerator — dynamic email/phone
│   │   └── helpers.ts
│   └── tests/              # 1 folder / module (mirror 03_test-cases)
│       ├── common/         # smoke/login dùng chung
│       │   ├── login.spec.ts
│       │   └── dashboard.spec.ts
│       ├── ultrafast/
│       │   └── ultrafast-checkout.spec.ts  (19/20 TCs stable)
│       └── internet/
│           └── internet-checkout.spec.ts
└── test-data/
    └── common/users.json
```

**Bảng mapping slug (automation ↔ module 02/03):**

| Module 02/03 (`chucnang_*`) | Slug automation |
|---|---|
| chucnang_checkout (dịch vụ UltraFast) | `ultrafast` |
| chucnang_checkout (dịch vụ Internet) | `internet` |
| chucnang_checkout (dịch vụ AP) | `ap` |
| chucnang_checkout (dịch vụ Smart TV) | `smarttv` |
| chucnang_checkout (dịch vụ Camera) | `camera` (TC có, chưa automation) |
| chucnang_Voucher | `voucher` |
| chucnang_QLnoidunggoiban | `goiban` |
| chucnang_QLdactinh | `dactinh` |
| chucnang_manhinhchitietthietbi | `chitietthietbi` |
| (login / dashboard — cross-cutting) | `common` |

**Page object dùng chung cho checkout thiết bị (AP / Smart TV / Camera):** 3 page object `device-checkout.page.ts`, `device-product-detail.page.ts`, `device-order-complete.page.ts` nằm ở `pages/common/` (class `Device*Page`). Các dịch vụ này có rule GIỐNG NHAU, chỉ khác label SP/giá/slug → spec truyền product params qua env (vd `SMARTTV_PRODUCT_SLUG`, `AP_PRODUCT_SLUG`). Vì page object đã ở `common/`, các module `ap`/`smarttv` chỉ có thư mục `tests/` (không có `pages/` riêng) — đúng quy tắc "logic dùng ≥2 module đẩy lên common/".

**Pattern:** Test files import custom `test` from `fixtures/base.fixture.ts` (không dùng `@playwright/test` trực tiếp). Page Objects khai báo locators là `readonly` fields, methods không chứa assertions.

**MCP server:** `.mcp.json` cấu hình `@playwright/mcp@latest` — dùng để inspect DOM thực tế khi viết/debug locators.

---

## Active project: ecom-pdh

| Path | Purpose |
|---|---|
| `ecom-pdh/00_input/` | Read-only input — URD, BRD, FCP docs từ BA |
| `ecom-pdh/02_analyze-requirements/<module>/` | Output của analyze-requirement |
| `ecom-pdh/03_test-cases/functional/<module>/` | Web/Mobile TC Excel (1 thư mục / module, mirror 02) |
| `ecom-pdh/03_test-cases/api/<module>/` | API TC Excel (1 thư mục / module, mirror 02) |
| `ecom-pdh/04_test-data/` | Test data assets |
| `ecom-pdh/05_automation/` | Playwright TS automation framework (moved here from root-level `automation-framework/`) |
| `ecom-pdh/06_report/` | Toàn bộ output sau khi chạy test: `*_results_*.xlsx`, `report.json`, `playwright-report/`, `allure-results/`, `allure-report/`, `test-artifacts/` |

**Modules đã analyze, TC files hiện có, và kết quả phân tích requirement per-module → xem `ecom-pdh/CLAUDE.md`** (project context). File root này chỉ giữ kiến trúc/tooling/convention dùng chung.

---

## Python utility scripts

Tất cả scripts dùng `openpyxl` (không cần install thêm). Chạy từ root hoặc `ecom-pdh/`:

```powershell
# Gen TC (root)
python gen_tc_checkout.py            # Sinh TC Web Checkout (common + Internet)
python gen_tc_checkout_camera.py     # Sinh TC Web Checkout Camera
python gen_tc_ultrafast.py           # Sinh TC Web UltraFast
python gen_tc_voucher_api_v2.py      # Sinh TC API Voucher từ ECP_API_Documentation_v4
python gen_tc_voucher_api_v12.py     # Sinh TC API Voucher v1.2
python ecom-pdh/build_tc_v2.py       # TC Gói bán
python ecom-pdh/build_tc_dactinh_v11.py  # TC Đặc tính

# Sync kết quả test (root) — đọc Playwright JSON report → điền Pass/Fail vào TC Excel
python sync_tc_checkout.py           # Sync kết quả module checkout
python sync_tc_results.py            # Sync kết quả chung
```

---

## Excel TC format

### Web/Mobile (`template-testcase-web_mobile.md`)
- Sheet = module; `D3` = Function ID (`TC_LOGIN`); `D4` = Function Name
- TC ID formula: `=IF(D10="","",$D$3&"."&COUNTA($D$10:D10))`
- Columns A–G: TC definition; **Column H: `Auto?`** (`Y`/`N`/blank)
- Round blocks: cols I–L per round; group headers in green `#A9D08E`
- **Đọc TC ID bằng openpyxl:** cột B là **formula chưa có cached value** (file chưa mở bằng Excel) → `data_only=True` trả `None`. Phải **tự tính**: TC ID = `D3 & "." & (số dòng có nội dung ở cột D từ D10 đến dòng hiện tại)`. Dòng group-header (merge `B{r}:L{r}`, cột D rỗng) không tăng counter. Round 1 nằm ở cột I–L (I=Kết Quả, J=Người TH, K=ID Bugs, L=Ghi Chú).

### API (`template-testcase-api.md`)
- Sheet = endpoint; `D4` = API code (`API_01`)
- TC ID formula keyed to Expected Response (col F): `=IF(F12="","",$D$4&"."&COUNTA($F$12:F12))`
- Groups: Authentication, Validation (Required/Format/Boundary), Business Flow, Error Handling

---

## Naming conventions

| Artifact | Pattern | Example |
|---|---|---|
| Web/Mobile Excel | `AI_ISC_[project]_[ver]_TC_v[tcver].xlsx` | `AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx` |
| API Excel | `AI_ISC_[project]_[ver]_TC_API_v[tcver].xlsx` | `AI_ISC_ecom-pdh_v1.1_TC_API_v2.0.xlsx` |
| TC ID (web) | `TC_[MODULE].[NNN]` | `TC_DANGKYUF.5` |
| TC ID (api) | `API_[NN].[NNN]` | `API_16.3` |
| Scenario ID | `SC-[MODULE]-[NNN]` | `SC-VOUCHER-001` |
| Requirement ID | `REQ-[MODULE]-[NNN]` | `REQ-VOUCHER-001` |

**Automation test name convention (bắt buộc để sync-tc-results map được):**
```
TC_DANGKYUF.5 — SĐT hợp lệ 10 số
API_18.15 — Áp dụng voucher General thành công
```
Regex detect: `TC_[A-Z0-9_]+\.\d+` hoặc `API_\d+\.\d+`

---

## Language rule

- TC content (title, steps, expected result): **Tiếng Việt**
- Status, priority, field names, technical terms: **English** (`Pass`, `Fail`, `Block`, `High`, `Medium`, `Low`)

---

## Automation rules (khi viết test code)

Chi tiết trong `.claude/rules/`. Key points:
- **Framework:** Page Object Model — page classes không chứa assertions
- **Locators:** `getByRole` → `getByLabel` → `getByTestId` → CSS → XPath (last resort). Không dùng XPath theo vị trí hoặc CSS class hash động.
- **Waits:** Playwright auto-wait + `expect()` assertions. `waitForTimeout()` bị cấm.
- **Test data:** Sinh động qua `TestDataGenerator` — không hardcode email/username unique.
- **Headed mode** khi debug; headless chỉ trong CI hoặc sau khi 100% pass trên headed.
- **Viewport:** 1920×1080 (cấu hình trong `playwright.config.ts`, bắt buộc resize khi dùng MCP).

---

## Kết quả phân tích requirement

**Đã chuyển sang `ecom-pdh/CLAUDE.md`** (project context) — gồm đầy đủ Gói bán, Đặc tính, Chi tiết Thiết bị, Voucher, và Checkout đa dịch vụ (UltraFast/CKCOMMON/Internet/Camera/AP/Smart TV). File root chỉ giữ phần dùng chung mọi project.
