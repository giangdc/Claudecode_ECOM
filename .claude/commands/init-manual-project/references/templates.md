# Templates Reference

Template duy nhất được tạo bởi scaffold: **CLAUDE.md**

Các template khác (test plan, bug report, checklist...) không nằm trong scope hiện tại.
Thêm vào sau nếu cần.

---

## CLAUDE.md

File: `CLAUDE.md` (ở root của mỗi project)

```markdown
# {project_name} — Project Context

## Thông tin dự án
- **Tên dự án:** {project_name}
- **Loại kiểm thử:** {test_types}
- **Môi trường & URL:**
- **{ENV1}:** {url1}
- **{ENV2}:** {url2}

## QA Testing Pipeline
\`\`\`
00_input/  (đặt URD/BRD/SRS từ BA vào đây)
  │
  ├─► analyze-requirement  →  02_analyze-requirements/
  │       Output: MEMORY.md, test_scenario_map.md,
  │               requirement_traceability.md, risk_assessment.md
  │
  ├─► gen-testcase-webapp  →  03_test-cases/
  │       Output: AI_ISC_{project_name}_[version]_TC_v1.0.xlsx (Web/Mobile)
  │
  ├─► gen-testcase-api     →  03_test-cases/api/
  │       Output: AI_ISC_{project_name}_[version]_TC_API_v1.0.xlsx (REST API)
  │
  └─► update-testcase  →  03_test-cases/
          Output: AI_ISC_{project_name}_[version]_TC_v2.0.xlsx (v3.0...)
\`\`\`

## Naming Conventions
- **TC Excel:** `AI_ISC_{project_name}_[version]_TC_v[tc_version].xlsx`
- **TC ID:** `TC_[MODULE].[NNN]` — ví dụ: TC_LOGIN.1, TC_PAY.3
- **Scenario ID:** `SC-[MODULE]-[NNN]` — ví dụ: SC-LOGIN-001
- **Requirement ID:** `REQ-[MODULE]-[NNN]` — ví dụ: REQ-LOGIN-001

## Folder Reference
| Thư mục | Mục đích | Skill liên quan |
|---------|----------|----------------|
| `00_input/` | Tài liệu đầu vào: URD, SRS, specs từ BA | analyze-requirement (đọc) |
| `02_analyze-requirements/` | Output phân tích: MEMORY.md, scenario map, traceability, risk | analyze-requirement (ghi) |
| `03_test-cases/` | TC Excel Web/Mobile `AI_ISC_*_TC_v*.xlsx` | gen-testcase-webapp (ghi), update-testcase (đọc+ghi) |
| `03_test-cases/api/` | TC Excel API `AI_ISC_*_TC_API_v*.xlsx` | gen-testcase-api (ghi) |
| `04_test-data/` | Dữ liệu test (valid / invalid) | — |

## MEMORY Files
- `02_analyze-requirements/MEMORY.md` — bridge file, downstream skills đọc file này

## Language Rule
- Nội dung TC, mô tả, steps: **Tiếng Việt**
- Technical terms, status (Pass/Fail/Blocked), priority (P1/P2/P3): **Tiếng Anh**

## Tools
- Scaffolded by `init-manual-project` skill
- Created: {date}
```
