# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace overview

This is a **QA Manual Testing workspace** for FPT Telecom's ecom platform (ISC/ECP). It contains:
- AI-driven skills (custom slash commands) for the full QA pipeline
- Templates and rules for generating standardized test case Excel files
- Project `ecom-pdh/` — the active QA project (v1.1, Sprint 2)
- `automation-framework/` — Playwright TypeScript E2E framework (sibling to `ecom-pdh/`)

The full skill reference is in `.claude/CLAUDE.md`. This root file covers architecture, conventions, and tooling.

---

## Skill pipeline (the core workflow)

```
BA drops URD/spec → ecom-pdh/00_input/
        ↓
/analyze-requirement   → ecom-pdh/02_analyze-requirements/<module>/
                         MEMORY.md, test_scenario_map.md, requirement_traceability.md,
                         risk_assessment.md, test_data_catalog.md
        ↓                          ↓
/gen-testcase-webapp       /gen-testcase-api (hoặc gen-testcase-api-v3)
→ 03_test-cases/*.xlsx     → 03_test-cases/api/*.xlsx
        ↓
/gen-testcase-checkout-service   (for new Checkout service sheets only)
        ↓
/update-testcase   (when URD version bumps)
        ↓
── Automation lane (Web UI only) ──────────────────────────────────
[one-time] /generate_automation_framework
→ automation-framework/   (outside ecom-pdh/, sibling folder)

/generate_automation_from_testcases
  Input : 03_test-cases/*.xlsx  (chỉ các TC có cột Auto? = Y)
  Input : URL ứng dụng (phải accessible — không sau VPN)
→ automation-framework/src/pages/*.ts   (Page Object classes)
→ automation-framework/src/tests/*.spec.ts  (Test scripts)

/sync-tc-results                        (sau khi chạy test)
  Input : test-results/report.json      (Playwright --reporter=json)
  Input : 03_test-cases/*.xlsx
→ 03_test-cases/*_results_{date}.xlsx  (Pass/Fail điền vào cột Actual Result)
```

**Key rule — manual pipeline:** always run `analyze-requirement` before `gen-testcase-*` for a new module. Skills read from `02_analyze-requirements/<module>/MEMORY.md` as their primary input. Skipping analyze → Option B (direct URD read) = lower quality output.

**Key rule — automation lane:**
1. `generate_automation_framework` chỉ chạy **một lần** khi chưa có `automation-framework/`.
2. `generate_automation_from_testcases` chỉ đọc TC có `Auto? = Y` trong cột H của Excel.
3. App URL phải accessible trực tiếp (không qua VPN). Nếu không → agent block tại Bước 2 (MCP DOM Recon).

---

## Automation framework commands

Tất cả lệnh chạy từ thư mục `automation-framework/`:

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

# Sinh JSON report cho sync-tc-results
npx playwright test --reporter=json > test-results/report.json

# Kiểm tra TypeScript
npm run lint

# Xem report
npm run test:report            # Playwright HTML report
npm run allure:generate && npm run allure:open
```

**Env vars** (`automation-framework/.env`): `BASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `VIEWER_EMAIL`, `VIEWER_PASSWORD`.

---

## Automation framework architecture

```
automation-framework/
├── src/
│   ├── pages/              # Page Object classes — extends BasePage
│   │   ├── base.page.ts    # Abstract base: clickElement, fillInput, navigate
│   │   ├── login.page.ts
│   │   ├── product-detail.page.ts   # UltraFast: cycle selector, Mua ngay
│   │   └── checkout-ultrafast.page.ts  # Phone, PTTT, submit
│   ├── fixtures/
│   │   ├── base.fixture.ts    # Page fixtures (loginPage, dashboardPage)
│   │   └── auth.fixture.ts    # Auth helper
│   ├── utils/
│   │   ├── env.config.ts      # Reads .env → exports config object
│   │   ├── test-data.ts       # TestDataGenerator — dynamic email/phone
│   │   └── helpers.ts
│   └── tests/
│       ├── auth/
│       ├── dashboard/
│       └── ultrafast/
│           └── ultrafast-checkout.spec.ts  (19/20 TCs stable)
└── test-data/users.json
```

**Pattern:** Test files import custom `test` from `fixtures/base.fixture.ts` (không dùng `@playwright/test` trực tiếp). Page Objects khai báo locators là `readonly` fields, methods không chứa assertions.

**MCP server:** `.mcp.json` cấu hình `@playwright/mcp@latest` — dùng để inspect DOM thực tế khi viết/debug locators.

---

## Active project: ecom-pdh

| Path | Purpose |
|---|---|
| `ecom-pdh/00_input/` | Read-only input — URD, BRD, FCP docs từ BA |
| `ecom-pdh/02_analyze-requirements/<module>/` | Output của analyze-requirement |
| `ecom-pdh/03_test-cases/` | Web/Mobile TC Excel |
| `ecom-pdh/03_test-cases/api/` | API TC Excel |
| `ecom-pdh/04_test-data/` | Test data assets |

**Modules đã analyze:**
- `chucnang_QLnoidunggoiban` — Quản lý Nội dung Gói bán
- `chucnang_QLdactinh` — Quản lý Đặc tính
- `chucnang_manhinhchitietthietbi` — Chi tiết Thiết bị
- `chucnang_Voucher` — Voucher/EVC Checkout (has `test_data_catalog.md`)
- `chucnang_dangkyultraFast` — Đăng ký dịch vụ UltraFast (automation 19/20 PASS)

**TC files hiện có:**
- `03_test-cases/AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx` — Web/Mobile (includes UltraFast)
- `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.2.xlsx` — API TC Voucher v1.2 (100 TCs)
- `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v2.0.xlsx` — API TC Voucher v2.0 từ ECP_API_Documentation_v4 (77 TCs)

---

## Python utility scripts

Tất cả scripts dùng `openpyxl` (không cần install thêm). Chạy từ root hoặc `ecom-pdh/`:

```powershell
python gen_tc_voucher_api_v2.py      # Sinh TC API Voucher từ ECP_API_Documentation_v4
python gen_tc_ultrafast.py           # Sinh TC Web UltraFast
python gen_tc_voucher_api_v12.py     # Sinh TC API Voucher v1.2
python ecom-pdh/build_tc_v2.py       # TC Gói bán
python ecom-pdh/build_tc_dactinh_v11.py  # TC Đặc tính
```

---

## Excel TC format

### Web/Mobile (`template-testcase-web_mobile.md`)
- Sheet = module; `D3` = Function ID (`TC_LOGIN`); `D4` = Function Name
- TC ID formula: `=IF(D10="","",$D$3&"."&COUNTA($D$10:D10))`
- Columns A–G: TC definition; **Column H: `Auto?`** (`Y`/`N`/blank)
- Round blocks: cols I–L per round; group headers in green `#A9D08E`

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

### 2026-05-25 — Gói bán / Đặc tính / Chi tiết Thiết bị
- Xem chi tiết trong `ecom-pdh/CLAUDE.md`

### 2026-05-28 — Voucher API (ECP_API_Documentation_v4)
- **Tài liệu:** `ecom-pdh/00_input/chucnang_Voucher/ECP_API_Documentation_v4.xlsx`
- **Tổng requirement:** 20 | **Tổng scenario:** 28 (P1:10, P2:18)
- **Vùng rủi ro cao:** API_18 voucher/apply (Score 20)
- **Clarifications chưa resolve:** 5 — quan trọng nhất CLA-2 (behavior is_valid=false trong voucher/check)
- **TC API sinh ra:** `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v2.0.xlsx` (77 TCs)
- **MEMORY:** `ecom-pdh/02_analyze-requirements/chucnang_Voucher/MEMORY.md`

### 2026-05-28 — Đăng ký UltraFast
- **Tài liệu:** `ecom-pdh/00_input/chucnang_dangkyultraFast/dang ky dich ultraFast.xlsx`
- **Tổng requirement:** 9 | **Tổng scenario:** 24 (P1:13, P2:9, P3:2)
- **Vùng rủi ro cao:** Luồng thanh toán Online 3rd party (Score 20)
- **Automation:** 19/20 TCs stable — xem `automation-framework/task.md` cho locator collection và defect log
- **Defect:** BUG-DANGKYUF-001 — COD hiển thị trong staging dù spec nói không có
- **MEMORY:** `ecom-pdh/02_analyze-requirements/chucnang_dangkyultraFast/MEMORY.md`
