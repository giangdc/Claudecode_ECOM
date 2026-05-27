# QC Manual — Workspace Root

Đây là workspace chứa toàn bộ skill và tài liệu QA Manual của team.

---

## Cấu trúc workspace

```
qc manual/                          ← Mở folder này trong Cowork / Claude Code
├── CLAUDE.md                       ← File này — context cho AI
├── commands/                       ← Skill definitions
│   ├── init-manual-project/        ← Khởi tạo project mới
│   ├── analyze-requirement.md      ← Phân tích URD/BRD/SRS
│   ├── gen-testcase-webapp.md      ← Tạo TC cho Web/Mobile
│   ├── gen-testcase-api.md         ← Tạo TC cho REST API
│   └── update-testcase.md      ← Cập nhật TC theo version mới
├── template/                       ← TC Excel templates (AI đọc khi gen file)
│   ├── template-testcase-web_mobile.md
│   └── template-testcase-api.md
│
└── <project-name>/                 ← Các project (do init-manual-project tạo)
    ├── 00_input/
    ├── 02_analyze-requirements/
    ├── 03_test-cases/
    ├── 04_test-data/
    └── CLAUDE.md
```

---

## Skills & cách dùng

| Skill | Khi nào dùng |
|-------|-------------|
| `init-manual-project` | Khởi tạo project mới từ đầu |
| `analyze-requirement` | Sau khi đặt URD vào `00_input/` |
| `gen-testcase-webapp` | Tạo TC Web/Mobile lần đầu (sau analyze) |
| `gen-testcase-api` | Tạo TC REST API từ tài liệu API / cURL / Swagger |
| `update-testcase` | Cập nhật TC khi có URD version mới |
| `gen-testcase-checkout-service` | Tạo TC riêng cho 1 dịch vụ Checkout mới — chỉ viết phần đặc thù, không clone common |

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
03_test-cases/*.xlsx             03_test-cases/api/*.xlsx
        │
        ├── gen-testcase-checkout-service  (dịch vụ Checkout mới)
        │   03_test-cases/*.xlsx  (sheet mới thêm vào TC_checkout.xlsx)
        │
        ▼
update-testcase  (khi có URD mới)
03_test-cases/*_TC_v2.0.xlsx, v3.0...
```

---

## Template path (quan trọng cho CLI)

Khi skills đọc template, path tương đối được tính từ **root của workspace này**:
- `./template/template-testcase-web_mobile.md`
- `./template/template-testcase-api.md`

→ Luôn chạy Claude Code từ thư mục `qc manual/` để path hoạt động đúng.

---

## Naming Conventions (toàn workspace)

- **TC Excel Web/Mobile:** `AI_ISC_[project]_[version]_TC_v[tc_version].xlsx`
- **TC Excel API:** `AI_ISC_[project]_[version]_TC_API_v[tc_version].xlsx`
- **TC ID (web):** `TC_[MODULE].[NNN]` — VD: `TC_LOGIN.1`
- **TC ID (api):** `API_[NN].[NNN]` — VD: `API_01.3`
- **Scenario ID:** `SC-[MODULE]-[NNN]`
- **Requirement ID:** `REQ-[MODULE]-[NNN]`

## Language Rule
- Nội dung TC, mô tả, steps, expected result: **Tiếng Việt**
- Technical terms, status (Pass/Fail/Blocked), priority, field names: **Tiếng Anh**
