# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace overview

This is a **QA Manual Testing workspace** for FPT Telecom's ecom platform (ISC/ECP). It contains:
- AI-driven skills (custom slash commands) for the full QA pipeline
- Templates and rules for generating standardized test case Excel files
- Project `ecom-pdh/` — the active QA project (v1.1, Sprint 2)

The full skill reference is in `.claude/CLAUDE.md`. This root file covers architecture, conventions, and the Python tooling.

---

## Skill pipeline (the core workflow)

```
BA drops URD/spec → ecom-pdh/00_input/
        ↓
/analyze-requirement   → ecom-pdh/02_analyze-requirements/<module>/
                         MEMORY.md, test_scenario_map.md, requirement_traceability.md,
                         risk_assessment.md, test_data_catalog.md
        ↓                          ↓
/gen-testcase-webapp       /gen-testcase-api
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

/generate_data_verify                   (nhiều dịch vụ cùng layout, khác data)
  Input : test-data/service_data.xlsx   (mỗi gói = 1 dòng)
  Input : Base URL
→ automation-framework/src/utils/service-data-reader.ts
→ automation-framework/src/tests/service-data-verify.spec.ts
  ↑ Thêm gói mới: chỉ thêm dòng vào Excel — không chạy lại skill

/sync-tc-results                        (sau khi chạy test)
  Input : test-results/report.json      (Playwright --reporter=json)
  Input : 03_test-cases/*.xlsx
→ 03_test-cases/*_results_{date}.xlsx  (Pass/Fail điền vào cột Actual Result)
```

**Key rule — manual pipeline:** always run `analyze-requirement` before `gen-testcase-*` for a new module. Skills read from `02_analyze-requirements/<module>/MEMORY.md` as their primary input (Option A). Skipping analyze means Option B (direct URD read) — lower quality output.

**Key rule — automation lane:**
1. `generate_automation_framework` chỉ chạy **một lần** khi chưa có `automation-framework/` folder.
2. `generate_automation_from_testcases` chỉ đọc TC có `Auto? = Y` trong cột H của Excel.
3. App URL phải accessible trực tiếp từ máy đang chạy Claude Code (không qua VPN/proxy chặn). Nếu không → agent sẽ block tại Bước 2 (MCP DOM Recon).

---

## Active project: ecom-pdh

| Path | Purpose |
|---|---|
| `ecom-pdh/00_input/` | Read-only input — URD, BRD, FCP docs from BA |
| `ecom-pdh/02_analyze-requirements/<module>/` | analyze-requirement output per module |
| `ecom-pdh/03_test-cases/` | Web/Mobile TC Excel files |
| `ecom-pdh/03_test-cases/api/` | API TC Excel files |
| `ecom-pdh/04_test-data/` | Test data assets |

**Current modules analyzed:**
- `chucnang_QLnoidunggoiban` — Quản lý Nội dung Gói bán
- `chucnang_QLdactinh` — Quản lý Đặc tính
- `chucnang_manhinhchitietthietbi` — Chi tiết Thiết bị
- `chucnang_Voucher` — Voucher/EVC Checkout (most complete, has `test_data_catalog.md`)

**TC files generated so far:**
- `03_test-cases/AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx` — Web/Mobile TC
- `03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.1.xlsx` — API TC (100 TCs, gen-testcase-api-v3)

---

## Python utility scripts

Located in `ecom-pdh/` and root. These are one-off diagnostic/build scripts — not a maintained application.

| Script | Purpose |
|---|---|
| `gen_tc_voucher_api.py` | Generate Voucher API TC Excel programmatically |
| `gen_tc_checkout_camera.py` | Generate Checkout camera-service TC Excel |
| `ecom-pdh/build_tc_v2.py` | Build TC Excel v2 (Gói bán module) |
| `ecom-pdh/build_tc_dactinh_v11.py` | Build TC Excel for Đặc tính v1.1 |
| `ecom-pdh/verify_*.py` | Verify/validate existing Excel outputs |
| `ecom-pdh/read_*.py` | Read and inspect URD/TC Excel files |
| `ecom-pdh/diag*.py`, `diff*.py` | Diagnostic/diff helpers |

Run Python scripts from the repo root or `ecom-pdh/`:
```powershell
python ecom-pdh/build_tc_v2.py
python gen_tc_voucher_api.py
```

No package install needed — scripts use only `openpyxl` (and stdlib).

---

## Excel TC format

### Web/Mobile template (`template-testcase-web_mobile.md`)
- Sheet = module; `D3` = Function ID (e.g. `TC_LOGIN`); `D4` = Function Name
- TC ID formula: `=IF(D10="","",$D$3&"."&COUNTA($D$10:D10))` → `TC_LOGIN.1`, `TC_LOGIN.2`
- Columns A–G: TC definition; **Column H: `Auto?`** (`Y` / `N` / blank)
- Header rows 7–8 with merged Round blocks (I–L per round, shifted by `Auto?` column), group headers in green (`#A9D08E`)
- `Auto?` values: `Y` = automatable (agent sẽ convert), `N` = manual-only, blank = chưa phân loại

### API template (`template-testcase-api.md`)
- Sheet = endpoint; `D4` = API code (e.g. `API_01`)
- TC ID formula keyed to Expected Response column (F): `=IF(F12="","",$D$4&"."&COUNTA($F$12:F12))`
- Groups: Authentication, Validation (Required/Format/Boundary), Business Flow, Error Handling

---

## Naming conventions

| Artifact | Pattern | Example |
|---|---|---|
| Web/Mobile Excel | `AI_ISC_[project]_[ver]_TC_v[tcver].xlsx` | `AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx` |
| API Excel | `AI_ISC_[project]_[ver]_TC_API_v[tcver].xlsx` | `AI_ISC_ecom-pdh_v1.1_TC_API_v1.1.xlsx` |
| TC ID (web) | `TC_[MODULE].[NNN]` | `TC_LOGIN.1` |
| TC ID (api) | `API_[NN].[NNN]` | `API_01.3` |
| Scenario ID | `SC-[MODULE]-[NNN]` | `SC-VOUCHER-001` |
| Requirement ID | `REQ-[MODULE]-[NNN]` | `REQ-VOUCHER-001` |

---

## Language rule

- TC content (title, steps, expected result, descriptions): **Tiếng Việt**
- Status values, priority, field names, technical terms: **English** (`Pass`, `Fail`, `Block`, `N/A`, `High`, `Medium`, `Low`)

---

## Automation rules (when writing test code)

Detailed rules live in `.claude/rules/`. Key points:
- **Framework:** Page Object Model mandatory for all automation
- **Locators:** `accessibility id` → `data-testid` → `id/name` → CSS → XPath (last resort). Never use positional XPath or dynamic CSS class hashes.
- **Waits:** Playwright auto-wait + `expect()` assertions; Selenium `WebDriverWait`; Appium explicit waits. `Thread.sleep()` / `waitForTimeout()` are **banned**.
- **Test data:** Never hardcode unique fields (email, username). Use UUID/timestamp format: `auto_[testName]_[timestamp]_[random]@test.com`
- **Headed mode** required during debug; headless only in CI or after 100% pass on headed.

---

## Kết quả phân tích requirement — 2026-05-28

- **Tài liệu:** `ecom-pdh/02_analyze-requirements/chucnang_Voucher/ECP_API_voucher_v1.xlsx`
- **Tổng requirement:** 6 | **Tổng scenario:** 33 (P1:14 P2:16 P3:3)
- **Modules:** VOUCHER_API — 4 endpoints: voucher/list, voucher/content, voucher/apply, voucher/check
- **Vùng rủi ro cao:** POST /voucher/apply (Score=20), Authentication X-Checkout-Token (Score=15)
- **Clarifications chưa resolve:** 5 (CLARY-001..005, xem requirement_traceability.md)
- **MEMORY:** `ecom-pdh/02_analyze-requirements/chucnang_Voucher/MEMORY.md`

## Kết quả phân tích requirement — 2026-05-28 (Đăng ký UltraFast)

- **Tài liệu:** `ecom-pdh/00_input/chucnang_dangkyultraFast/dang ky dich ultraFast.xlsx` (2 sheets: Đăng ký UltraFast + Rule common)
- **Tổng requirement:** 9 | **Tổng scenario:** 24 (P1:13 P2:9 P3:2)
- **Modules:** DANGKYUF — Checkout flow UltraFast (B1 navigate → B2 thanh toán)
- **Vùng rủi ro cao:** Luồng thanh toán Online 3rd party (Score=20); Block PTTT Online-only load theo QLCS (Score=15)
- **Clarifications chưa resolve:** 5 (CLARY-DANGKYUF-001..005) — CLARY-001 ưu tiên cao (địa chỉ/họ tên có áp dụng không)
- **MEMORY:** `ecom-pdh/02_analyze-requirements/chucnang_dangkyultraFast/MEMORY.md`
