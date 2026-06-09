---
name: init-manual-project
description: Initialize a new manual testing project with 4 core folders (input, analyze-requirements, test-cases, test-data) and a CLAUDE.md. Use this skill whenever the user wants to set up, scaffold, bootstrap, or create a new manual QA testing project. Also trigger when the user mentions "init project", "new test project", "manual testing setup", "QA project scaffold", or "test folder structure".
---

# Init Manual Project

Scaffold một manual testing project với 4 thư mục cốt lõi và CLAUDE.md.

---

## Vị trí trong Pipeline

```
★ init-project ★ → analyze-requirement → gen-testcase-webapp → update-testcase (lặp lại)
     (00_)               (02_)                 (03_)               (03_ update)
                            │                TC v1.0 (Web/Mobile) TC v2.0, v3.0...
                            └─► gen-testcase-api (03_test-cases/api/<module>/)
                                              TC_API v1.0 (REST API)
```

| Hướng | Skill | Đọc / Ghi |
|-------|-------|-----------|
| **Upstream** | (không có — bước đầu tiên) | — |
| **Downstream** | `analyze-requirement` | Đọc `00_input/`, `CLAUDE.md` → Ghi `02_analyze-requirements/` |
| **Downstream** | `gen-testcase-webapp` | Đọc `02_analyze-requirements/<module>/MEMORY.md` + `test_scenario_map.md` → Ghi `03_test-cases/functional/<module>/` |
| **Downstream** | `gen-testcase-api` | Đọc tài liệu API (cURL/Swagger/Word/Excel) → Ghi `03_test-cases/api/<module>/` |
| **Downstream** | `update-testcase` | Đọc `03_test-cases/functional|api/<module>/*.xlsx` + `00_input/` (URD mới) + `MEMORY.md` → Ghi `03_test-cases/functional|api/<module>/` |

---

## Workflow

### Step 1: Gather Project Info

Thu thập thông tin bằng cách hỏi **từng câu một**. Chờ user trả lời trước khi hỏi câu tiếp theo. Bỏ qua câu nào đã rõ từ context.

**Câu 1 — Project name**
Hỏi: "Tên dự án (project name) là gì? (Ví dụ: ecommerce-web, hrm-system, mobile-banking)"
→ Dùng làm tên thư mục root. Chuyển sang kebab-case nếu cần.

**Câu 2 — Environment**
Hỏi: "Dự án sẽ test trên môi trường nào? (Có thể chọn nhiều)"
→ Options: DEV, STG, UAT, PROD

**Câu 3 — URL**
Hỏi: "URL cho từng môi trường đã chọn là gì?"
→ Thu thập 1 URL/môi trường. Nếu chưa có → để trống, tiếp tục.

**Câu 4 — Test types in scope**
Hỏi: "Những loại kiểm thử nào nằm trong phạm vi? (Có thể chọn nhiều)"
→ Options: Functional, Regression, Smoke, UAT, Exploratory, Performance, API
→ Dùng để tạo subfolder trong `03_test-cases/`
→ Nếu chọn **API** → tạo thêm `03_test-cases/api/` (dành cho output của `gen-testcase-api`)

**Câu 5 — Project version**
Hỏi: "Version hiện tại của dự án là gì? (Ví dụ: v1.0, v2.3 — Enter để dùng v1.0)"
→ Dùng trong naming convention file TC: `AI_ISC_[project]_[version]_TC_[module]_v1.0.xlsx`
→ Default: `v1.0` nếu user bỏ qua

Sau khi thu thập đủ, **tóm tắt và xác nhận** với user trước khi chạy script.

### Step 2: Run the Scaffold Script

**2a. Tìm scaffold.py:**
```bash
SCRIPT=$(find . ~ -name "scaffold.py" -path "*/init-manual-project/*" 2>/dev/null | head -1)
echo "Found: $SCRIPT"
```

**2b. Chạy scaffold:**
```bash
python3 "$SCRIPT" \
  --project-name "<project-name>" \
  --project-version "<v1.0>" \
  --environments "<env1,env2>" \
  --urls "<url1,url2>" \
  --test-types "<Functional,Regression,Smoke,...>" \
  --output-dir "$(pwd)"
```

> **Lưu ý:** `--output-dir "$(pwd)"` tạo thư mục `<project-name>/` ngay trong thư mục làm việc hiện tại (nên chạy từ gốc `qc manual/`). `--project-version` optional, default `v1.0`.

**Ví dụ thực tế:**
```bash
python3 "$SCRIPT" \
  --project-name "ecommerce-web" \
  --project-version "v2.1" \
  --environments "STG,UAT" \
  --urls "https://stg.myshop.com,https://uat.myshop.com" \
  --test-types "Functional,Regression,Smoke,API" \
  --output-dir "$(pwd)"
```

### Step 3: Post-Scaffold

Sau khi script chạy xong:

1. **Hiển thị cây thư mục** đã tạo cho user
2. **Xác nhận naming conventions** từ CLAUDE.md:
   - TC Excel files: `AI_ISC_[project]_[version]_TC_v[tc_version].xlsx`
   - TC ID: `TC_[MODULE].[NNN]` (e.g., `TC_LOGIN.1`, `TC_DASH.3`)
   - Scenario ID: `SC-[MODULE]-[NNN]`
   - Requirement ID: `REQ-[MODULE]-[NNN]`
3. **Hướng dẫn bước tiếp theo:** đặt URD vào `00_input/` rồi chạy `analyze-requirement`

---

## Folder Structure (output)

```
<project-name>/
├── 00_input/                    # URD, SRS, specs từ BA — đặt tài liệu vào đây
├── 02_analyze-requirements/     # Output của analyze-requirement skill
│   └── .gitkeep
├── 03_test-cases/               # TC Excel files (output của gen-testcase-webapp / gen-testcase-api)
│   ├── functional/              # mỗi module = 1 subfolder, mirror 1:1 với 02_analyze-requirements/
│   │   └── <chucnang_module>/   #   ← gen-testcase-webapp tạo on-demand khi sinh TC
│   ├── api/                     # mỗi module = 1 subfolder (output của gen-testcase-api)
│   │   └── <chucnang_module>/
│   └── _results/                # file *_results_*.xlsx do sync-tc-results sinh ra
├── 04_test-data/                # Dữ liệu test
│   ├── valid/
│   └── invalid/
└── CLAUDE.md                    # Project context — AI skills đọc file này đầu tiên
```

> **Lưu ý số thư mục:** nhảy `00` → `02` → `03` → `04` là có chủ ý — giữ số khớp với pipeline để dễ mở rộng sau (01 = test-plans, 05 = bug-reports... nếu cần thêm).

---

## Downstream Skill Integration

| Skill | Reads from | Writes to |
|-------|-----------|-----------|
| `analyze-requirement` | `00_input/`, `CLAUDE.md` | `02_analyze-requirements/` (MEMORY.md, test_scenario_map.md, requirement_traceability.md, risk_assessment.md) |
| `gen-testcase-webapp` | `02_analyze-requirements/<module>/MEMORY.md`, `test_scenario_map.md` | `03_test-cases/functional/<module>/` (`AI_ISC_*_TC_<module>_v1.0.xlsx`) |
| `gen-testcase-api` | Tài liệu API: cURL / Swagger / Word / Excel (từ `00_input/` hoặc do user cung cấp trực tiếp) | `03_test-cases/api/<module>/` (`AI_ISC_*_TC_API_v1.0.xlsx`) |
| `update-testcase` | `03_test-cases/functional|api/<module>/*.xlsx`, `00_input/` (URD mới), `02_analyze-requirements/<module>/MEMORY.md` | `03_test-cases/functional|api/<module>/` (`AI_ISC_*_TC_<module>_v2.0.xlsx`, v3.0...) |

---

## Cấu trúc workspace với nhiều dự án

```
qc manual/                       # Workspace root — mở folder này trong Cowork / Claude Code
├── commands/                    # Skill definitions (không phải project data)
│   ├── init-manual-project/     #   ← skill này
│   ├── analyze-requirement.md
│   ├── gen-testcase-webapp.md
│   ├── gen-testcase-api.md
│   └── update-testcase.md
├── template/                    # TC Excel templates
│   ├── template-testcase-web_mobile.md
│   └── template-testcase-api.md
│
├── ecommerce-web/               # Project 1 (output của init-manual-project)
├── hrm-system/                  # Project 2
└── mobile-banking/              # Project 3
```

Mỗi project là thư mục độc lập. Chạy skill từ gốc `qc manual/` để project được tạo đúng chỗ.

> **CLI (Claude Code):** Mở `qc manual/` làm working directory. Skills trong `commands/` sẽ được Claude đọc khi được nhắc đến trực tiếp hoặc qua CLAUDE.md root.

---

## Language Rule

Toàn bộ nội dung TC, mô tả, steps, expected result: **Tiếng Việt**.
Giữ tiếng Anh cho: technical terms, status (Pass/Fail/Blocked), priority (P1/P2/P3), field names, file/folder names.
