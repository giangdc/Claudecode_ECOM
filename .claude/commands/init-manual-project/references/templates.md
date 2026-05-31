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
  ├─► gen-testcase-webapp  →  03_test-cases/functional/<module>/
  │       Output: AI_ISC_{project_name}_[version]_TC_<module>_v1.0.xlsx (Web/Mobile)
  │               (1 thư mục / module, mirror 1:1 với 02_analyze-requirements/)
  │               (cột H "Auto?" được điền Y/N cho từng TC)
  │
  ├─► gen-testcase-api     →  03_test-cases/api/<module>/
  │       Output: AI_ISC_{project_name}_[version]_TC_API_v1.0.xlsx (REST API)
  │
  ├─► update-testcase  →  03_test-cases/functional|api/<module>/
  │       Output: AI_ISC_{project_name}_[version]_TC_<module>_v2.0.xlsx (v3.0...)
  │
  └─► [Automation — Web UI] ──────────────────────────────────────
      [một lần] generate_automation_framework
        → automation-framework/  (ngang hàng với {project_name}/)
      generate_automation_from_testcases
        Input : 03_test-cases/*.xlsx  (chỉ TC có Auto? = Y)
        Input : URL ứng dụng (phải accessible)
        → automation-framework/src/pages/*.ts
        → automation-framework/src/tests/*.spec.ts
\`\`\`

## Naming Conventions
- **TC Excel:** `AI_ISC_{project_name}_[version]_TC_[module]_v[tc_version].xlsx` (đặt trong `functional/<module>/`)
- **TC ID:** `TC_[MODULE].[NNN]` — ví dụ: TC_LOGIN.1, TC_PAY.3
- **Scenario ID:** `SC-[MODULE]-[NNN]` — ví dụ: SC-LOGIN-001
- **Requirement ID:** `REQ-[MODULE]-[NNN]` — ví dụ: REQ-LOGIN-001

## Folder Reference
| Thư mục | Mục đích | Skill liên quan |
|---------|----------|----------------|
| `00_input/` | Tài liệu đầu vào: URD, SRS, specs từ BA | analyze-requirement (đọc) |
| `02_analyze-requirements/` | Output phân tích: MEMORY.md, scenario map, traceability, risk | analyze-requirement (ghi) |
| `03_test-cases/functional/<module>/` | TC Excel Web/Mobile (1 thư mục / module, mirror 02) | gen-testcase-webapp (ghi), update-testcase (đọc+ghi) |
| `03_test-cases/api/<module>/` | TC Excel API (1 thư mục / module, mirror 02) | gen-testcase-api (ghi) |
| `03_test-cases/_results/` | File `*_results_*.xlsx` từ sync-tc-results | sync-tc-results (ghi) |
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
