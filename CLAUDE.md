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
→ automation-framework/   (outside ecom-pdh/, sibling folder)

/generate_automation_from_testcases
  Input : 03_test-cases/*.xlsx  (chỉ các TC có cột Auto? = Y)
  Input : URL ứng dụng (phải accessible — không sau VPN)
→ automation-framework/src/pages/*.ts   (Page Object classes)
→ automation-framework/src/tests/*.spec.ts  (Test scripts)

/sync-tc-results                        (sau khi chạy test)
  Input : test-results/report.json      (Playwright --reporter=json)
  Input : 03_test-cases/functional/<module>/*.xlsx
→ 03_test-cases/_results/*_results_{date}.xlsx  (Pass/Fail điền vào cột Actual Result)
```

**Key rule — manual pipeline:** always run `analyze-requirement` before `gen-testcase-*` for a new module. Skills read from `02_analyze-requirements/<module>/MEMORY.md` as their primary input. Skipping analyze → Option B (direct URD read) = lower quality output.

**Key rule — folder mirror (02 ↔ 03):** `03_test-cases/` phản chiếu 1:1 cấu trúc module của `02_analyze-requirements/`, nhưng tách theo loại test:
- `03_test-cases/functional/<chucnang_module>/` — TC Web/Mobile, mỗi module 1 thư mục đúng tên với `02_analyze-requirements/<chucnang_module>/`.
- `03_test-cases/api/<chucnang_module>/` — TC API (chỉ module nào có API).
- `03_test-cases/_results/` — file `*_results_*.xlsx` từ sync-tc-results.
- Mỗi module = 1 file TC riêng (không gộp nhiều module vào 1 file); 1 module nhiều nhóm chức năng → nhiều sheet trong cùng file.

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

**Tổ chức domain-driven:** `pages/` và `tests/` chia 1 folder / module (mirror 1:1 với `03_test-cases/functional/<module>/`), cộng lớp `common/` cho thành phần dùng chung. `fixtures/` + `utils/` là hạ tầng dùng chung. **Cấm import chéo giữa 2 module** — chỉ import từ `common/` hoặc trong cùng folder module.

```
automation-framework/
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
| chucnang_Voucher | `voucher` |
| chucnang_QLnoidunggoiban | `goiban` |
| chucnang_QLdactinh | `dactinh` |
| chucnang_manhinhchitietthietbi | `chitietthietbi` |
| (login / dashboard — cross-cutting) | `common` |

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
| `ecom-pdh/03_test-cases/_results/` | File `*_results_*.xlsx` từ sync-tc-results |
| `ecom-pdh/04_test-data/` | Test data assets |

**Modules đã analyze:**
- `chucnang_QLnoidunggoiban` — Quản lý Nội dung Gói bán
- `chucnang_QLdactinh` — Quản lý Đặc tính
- `chucnang_manhinhchitietthietbi` — Chi tiết Thiết bị
- `chucnang_Voucher` — Voucher/EVC Checkout (has `test_data_catalog.md`)
- `chucnang_checkout` — Luồng checkout đa dịch vụ: UltraFast (automation 19/20 PASS) + CKCOMMON + Internet + **Camera + AP** (phân tích 2026-06-03, TC chưa tạo)

**TC files hiện có (cấu trúc mới — mirror 02 theo module):**
- `03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_dangkyUF_v1.0.xlsx` — Checkout UltraFast (tách từ TC_v1.0 cũ)
- `03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx` — Checkout Common (78 TC) + Internet (18 TC) — 2 sheet, gen 2026-06-01
- `03_test-cases/functional/chucnang_Voucher/AI_ISC_ecom-pdh_v1.1_TC_voucher_ui_v1.0.xlsx` — Voucher UI Checkout (tách từ TC_v1.0 cũ)
- `03_test-cases/functional/chucnang_manhinhchitietthietbi/AI_ISC_ecom-pdh_v1.1_TC_chitietthietbi_v1.0.xlsx`
- `03_test-cases/functional/chucnang_QLdactinh/AI_ISC_ecom-pdh_v1.1_TC_dactinh_v1.1.xlsx`
- `03_test-cases/functional/chucnang_QLnoidunggoiban/AI_ISC_ecom-pdh_v1.1_TC_goiban_v2.0.xlsx` (đổi tên từ TC_v2.0)
- `03_test-cases/api/chucnang_Voucher/AI_ISC_ecom-pdh_v1.1_TC_API_v1.2.xlsx` — API TC Voucher v1.2 (100 TCs)
- `03_test-cases/api/chucnang_Voucher/AI_ISC_ecom-pdh_v1.1_TC_API_v2.0.xlsx` — API TC Voucher v2.0 từ ECP_API_Documentation_v4 (77 TCs)

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

### 2026-06-01 — Checkout đa dịch vụ (re-baseline, gồm UltraFast)
- **Tài liệu:** DOC-CK-01 `Chucnangcheckout.xlsx` (Rule common + UltraFast + camera + internet) | DOC-CK-02 `TC_checkout.xlsx` (TC tham chiếu BA) | DOC-CK-03 `camera.png` (mockup). Lưu ý: `dang ky dich ultraFast.xlsx` đã **merge vào DOC-CK-01** và xóa.
- **Phạm vi đã phân tích:** UltraFast (DANGKYUF) + Màn checkout chung (CKCOMMON) + Internet (INTERNET). **Chưa phân tích:** Camera, Smart Home, Smart Tivi (chờ đủ tài liệu).
- **Tổng requirement:** 30 active (1 deferred) | **Tổng scenario:** 116 định nghĩa — 111 active (P1:50, P2:47, P3:12), 4 deferred (Chung cư), 1 blocked (voucher)
- **Vùng rủi ro cao:** CKCOMMON Luồng thanh toán (Score 25); CKCOMMON Phường/Xã + kiểm tra chính sách giá (20); INTERNET B2 trả trước/sau + giá động (20); DANGKYUF Online 3rd party (20); Popup Địa chỉ hành chính cũ (16); Block PTTT (15)
- **Clarifications:** 8/9 resolved 2026-06-01 (Số nhà max 50; SĐT lỗi = "Số điện thoại không hợp lệ"; Internet không Email; Chung cư deferred; trả trước/sau theo QLCS; session/countdown mọi DV; pre-fill điền toàn bộ +SC-076). Còn **1 pending: CLA-CKCOMMON-007** (nội dung popup "Chưa hỗ trợ chính sách!")
- **UltraFast:** giữ nguyên SC-DANGKYUF-001..024 (TC + automation 19/20 đã chạy). Defect BUG-DANGKYUF-001 (COD hiển thị staging) vẫn Open.
- **MEMORY:** `ecom-pdh/02_analyze-requirements/chucnang_checkout/MEMORY.md`

### 2026-06-03 — Checkout: thêm Camera + AP (bản revise `Chucnangcheckout_0306.xlsx`)
- **Tài liệu:** DOC-CK-04 `Chucnangcheckout_0306.xlsx` (revise của DOC-CK-01, thêm sheet "Đăng ký AP"; sheet "Đăng ký camera" revise thêm địa chỉ lắp đặt) + DOC-CK-03 mockup `camera.png`. Rule common / UltraFast / Internet **không đổi**.
- **Phạm vi thêm:** **CAMERA** (20 SC) + **AP** (18 SC). Tổng module checkout: **154 SC định nghĩa** — active 146 (P1:70 P2:61 P3:15), 5 deferred (Chung cư), 3 blocked (voucher).
- **Đặc thù:** Camera có chu kỳ + COD + địa chỉ lắp đặt + note giao hàng 3-7 ngày + "Thời gian lắp đặt", màn 2 bước; AP chỉ số lượng (không chu kỳ), còn lại như Camera. Field validation **tái dùng CKCOMMON** → khi gen TC chỉ viết phần đặc thù (giống `gen-testcase-checkout-service`).
- **Vùng rủi ro cao:** CAMERA/AP — Địa chỉ lắp đặt + chính sách giá (20) và B3 Luồng thanh toán COD/Online 3rd party (20).
- **Clarifications mới:** 3 Pending — CLA-CAMERA-001 ("Thời gian lắp đặt" set ở đâu), CLA-AP-001 (AP không chu kỳ), CLA-AP-002 (note giao hàng/Thời gian lắp đặt AP). Resolved-by-mockup: Block TTCN = Họ tên + SĐT.
- **MEMORY:** `ecom-pdh/02_analyze-requirements/chucnang_checkout/MEMORY.md`
