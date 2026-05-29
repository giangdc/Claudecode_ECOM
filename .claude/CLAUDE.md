# QC Manual — Workspace Root

Đây là workspace chứa toàn bộ skill và tài liệu QA Manual của team.

---

## Cấu trúc workspace

```
E:\AI\Ecom\                           ← Workspace root (mở folder này trong Claude Code)
├── .claude/                            ← Config folder
│   ├── CLAUDE.md                       ← File này — context cho AI
│   ├── commands/                       ← Skill definitions (slash commands)
│   │   ├── init-manual-project/        ← Khởi tạo project mới
│   │   ├── analyze-requirement.md      ← Phân tích URD/BRD/SRS
│   │   ├── gen-testcase-webapp.md      ← Tạo TC cho Web/Mobile
│   │   ├── gen-testcase-api.md         ← Tạo TC cho REST API
│   │   ├── gen-testcase-api-v2.md      ← Tạo TC API (version 2)
│   │   ├── gen-testcase-api-v3.md      ← Tạo TC API (version 3 — enhanced security)
│   │   ├── gen-testcase-checkout-service.md ← TC riêng cho dịch vụ Checkout mới
│   │   ├── update-testcase.md          ← Cập nhật TC theo version mới
│   │   ├── generate_api_tests_from_swagger.md
│   │   ├── generate_automation_framework.md
│   │   ├── generate_automation_from_testcases.md
│   │   ├── generate_locator.md
│   │   ├── generate_manual_testcases_rbt.md
│   │   └── generate_testcases_from_requirements.md
│   ├── skills/                         ← Additional skill definitions
│   │   ├── flaky_test_analyzer/
│   │   ├── framework_architect/
│   │   ├── gen-testcase/
│   │   ├── jira_integration/
│   │   ├── locator_healer_agent/
│   │   ├── qa_automation_engineer/
│   │   ├── rbt_manual_testing/
│   │   ├── requirements_analyzer/
│   │   ├── smart_locator_agent/
│   │   ├── test_data_generator/
│   │   └── ui_debug_agent/
│   ├── rules/                          ← Automation rules (áp dụng tự động)
│   │   ├── automation_rules.md         ← Quy tắc chung cho mọi framework
│   │   ├── locator_strategy.md         ← Chiến lược chọn locator
│   │   ├── playwright_rules.md         ← Quy tắc riêng Playwright
│   │   ├── selenium_rules.md           ← Quy tắc riêng Selenium
│   │   └── appium_rules.md             ← Quy tắc riêng Appium
│   └── template/                       ← TC Excel templates (AI đọc khi gen file)
│       ├── template-testcase-web_mobile.md
│       └── template-testcase-api.md
│
└── <project-name>/                     ← Các project (do init-manual-project tạo)
    ├── 00_input/                       ← URD/BRD/SRS từ BA (có thể tổ chức theo chức năng)
    ├── 02_analyze-requirements/        ← Output của analyze-requirement
    ├── 03_test-cases/                  ← File TC xuất ra
    │   ├── functional/                 ← TC Web/Mobile
    │   └── api/                        ← TC API
    ├── 04_test-data/                   ← Dữ liệu test
    │   ├── valid/
    │   └── invalid/
    └── CLAUDE.md                       ← Context riêng của project
```

**Project hiện có:** `ecom-pdh/`

---

## Skills & cách dùng

### Pipeline chính (Manual QA)

| Skill | Khi nào dùng |
|-------|-------------|
| `init-manual-project` | Khởi tạo project mới từ đầu |
| `analyze-requirement` | Sau khi đặt URD vào `00_input/` |
| `gen-testcase-webapp` | Tạo TC Web/Mobile lần đầu (sau analyze) |
| `gen-testcase-api` | Tạo TC REST API từ tài liệu API / cURL / Swagger |
| `gen-testcase-checkout-service` | Tạo TC riêng cho 1 dịch vụ Checkout mới — chỉ viết phần đặc thù, không clone common |
| `update-testcase` | Cập nhật TC khi có URD version mới |

### Automation QA

| Skill | Khi nào dùng |
|-------|-------------|
| `framework_architect` | Thiết kế kiến trúc automation framework |
| `qa_automation_engineer` | Viết automation test code |
| `generate_automation_framework` | **[Một lần]** Scaffold automation framework (Playwright TS mặc định) vào `automation-framework/` |
| `generate_automation_from_testcases` | Convert TC Excel Web (cột `Auto?=Y`) thành Page Objects + Test scripts |
| `generate_locator` | Sinh locator ổn định cho 1 element cụ thể (dùng khi locator bị break) |
| `generate_data_verify` | Sinh script verify data live web vs Excel data file — nhiều dịch vụ cùng layout, thêm gói chỉ cần thêm dòng Excel |
| `sync-tc-results` | Đọc Playwright JSON report → điền Pass/Fail vào cột Actual Result của TC Excel |
| `locator_healer_agent` | Tự động sửa locator bị broken |
| `flaky_test_analyzer` | Phân tích và fix flaky tests |
| `smart_locator_agent` | Tìm locator thông minh |
| `ui_debug_agent` | Debug UI issues |
| `jira_integration` | Tích hợp với Jira/Xray |
| `rbt_manual_testing` | Sinh manual TC theo phương pháp RBT |
| `requirements_analyzer` | Phân tích requirements từ web/module |
| `test_data_generator` | Sinh test data tự động |

---

## Pipeline tổng quát

```
[BA cung cấp URD] → 00_input/
        │
        ▼
analyze-requirement  →  02_analyze-requirements/
        │                   MEMORY.md, test_scenario_map.md, ...
        ├──────────────────────────────────────┐
        ▼                                      ▼
gen-testcase-webapp              gen-testcase-api
03_test-cases/functional/        03_test-cases/api/
*.xlsx                           *.xlsx
        │
        ├── gen-testcase-checkout-service  (dịch vụ Checkout mới)
        │   03_test-cases/functional/*.xlsx  (sheet mới thêm vào TC_checkout.xlsx)
        │
        ▼
update-testcase  (khi có URD mới)
03_test-cases/*_TC_v2.0.xlsx, v3.0...
        │
        ▼  ── Automation lane (Web UI) ──────────────────────────
        │  [một lần] generate_automation_framework
        │  → automation-framework/  (ngang hàng với <project>/, ngoài project folder)
        │
        ▼
generate_automation_from_testcases
  └─ Input: 03_test-cases/*.xlsx  (chỉ TC có cột H "Auto?" = Y)
  └─ Input: URL ứng dụng (phải accessible, không sau VPN)
  → automation-framework/src/pages/*.ts    (Page Object classes)
  → automation-framework/src/tests/*.spec.ts  (Test scripts, đã chạy PASS)

generate_data_verify   (nhiều dịch vụ cùng layout, khác data)
  └─ Input: test-data/service_data.xlsx    (mỗi gói/dịch vụ = 1 dòng)
  └─ Input: Base URL
  → automation-framework/src/utils/service-data-reader.ts
  → automation-framework/src/tests/service-data-verify.spec.ts
  [thêm gói mới: chỉ thêm dòng vào Excel, không chạy lại skill]
        │
        ▼ (sau khi chạy npx playwright test --reporter=json)
sync-tc-results
  └─ Input: test-results/report.json
  └─ Input: 03_test-cases/*.xlsx
  → 03_test-cases/*_results_{date}.xlsx   (Pass/Fail điền vào cột Actual Result)
```

**Prerequisite automation lane:**
- `automation-framework/` chưa tồn tại → chạy `generate_automation_framework` trước
- App URL accessible trực tiếp từ máy (MCP browser tool cần inspect DOM thực tế)
- TC Excel đã được đánh dấu cột H `Auto? = Y/N`

---

## Template path (quan trọng cho CLI)

Khi skills đọc template, path tương đối được tính từ **root của workspace này**:
- `.claude/template/template-testcase-web_mobile.md`
- `.claude/template/template-testcase-api.md`

---

## Naming Conventions (toàn workspace)

- **TC Excel Web/Mobile:** `AI_ISC_[project]_[version]_TC_v[tc_version].xlsx`
- **TC Excel API:** `AI_ISC_[project]_[version]_TC_API_v[tc_version].xlsx`
- **TC ID (web):** `TC_[MODULE].[NNN]` — VD: `TC_LOGIN.1`
- **TC ID (api):** `API_[NN].[NNN]` — VD: `API_01.3`
- **Scenario ID:** `SC-[MODULE]-[NNN]`
- **Requirement ID:** `REQ-[MODULE]-[NNN]`

## Language Rule
- Nội dung TC, mô tả, steps, expected result: **Tiếng Việt có dấu**
- Technical terms, status (Pass/Fail/Blocked), priority, field names: **Tiếng Anh**
