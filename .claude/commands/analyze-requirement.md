---
name: analyze-requirement
description: "Đọc tài liệu requirement từ BA (URD/BRD/SRS/wireframe), phân tích và tạo deliverables trong 02_analyze-requirements/ làm nền tảng cho gen-testcase và update-testcase"
---

# ROLE
Senior QA/Test Analyst. Nhiệm vụ: phân tích requirement, tạo scenario, KHÔNG tạo TC.

---

# VỊ TRÍ TRONG PIPELINE

```
analyze-requirement → gen-testcase-webapp → update-testcase (lặp lại)
      (02_/)               (TC v1.0)            (TC v2.0, v3.0...)
                ↘ gen-testcase-api (TC_API v1.0 — nếu có API cần test)
```

Input đọc từ: `00_input/` (read-only, không sửa file gốc)
Output ghi vào: `02_analyze-requirements/`
Downstream dùng: `MEMORY.md` + `test_scenario_map.md` + `test_data_catalog.md` (nếu có)

---

# 3 MODES — TỰ DETECT

```
Có MEMORY.md trong 02_analyze-requirements/?
├── KHÔNG → Mode 1: INIT
└── CÓ → User nhắc file mới chưa có trong Document Registry?
         ├── CÓ  → Mode 1: INIT (append, không ghi đè)
         └── KHÔNG → User yêu cầu sửa/cập nhật/feedback?
                    ├── CÓ  → Mode 2: UPDATE
                    └── KHÔNG → Mode 3: REVIEW
                                (nếu không rõ → hỏi user)
```

---

# MODE 1: INIT

## Step 1 — Đọc Project Context
Đọc `CLAUDE.md` ở root (tên dự án, môi trường, URL, quy ước đặt tên).
Nếu không có → hỏi user: tên dự án, môi trường, URL.

## Step 2 — Scan & Xác nhận Input
Scan `00_input/`, hỏi **một câu duy nhất**:
```
Tôi tìm thấy: [list files]. Phân tích tất cả hay chỉ một số?
Có thêm wireframe/mockup nào không?
```

## Step 3 — Phân tích & Phân rã Requirement
Cấu trúc: `Module → Feature → Requirement → Acceptance Criteria → Test Scenario`

Với mỗi requirement:
- **ID:** dùng ID gốc nếu có, không thì tạo `REQ-[MODULE]-[NNN]`
- **Loại:** Functional / Non-functional / UI / Business Rule / Integration
- **Risk:** High / Medium / Low
- **Nếu mơ hồ:** ghi vào Clarifications Needed, KHÔNG đoán

Tạo scenario:
- Mỗi acceptance criteria → tối thiểu 1 positive + 1 negative
- **Scenario ID:** `SC-[MODULE]-[NNN]` | **Priority:** P1/P2/P3
- **Test Type:** Functional / Negative / Boundary / UI / Integration

## Step 4 — Tạo Deliverables
Hỏi user **một câu duy nhất** trước khi tạo:
```
Bạn có muốn tạo test_data_catalog.md (data valid/invalid/boundary)?
A) Có  B) Không — tôi tự nhập khi execute
```

Tạo trong `02_analyze-requirements/`:

| # | File | Bắt buộc? |
|---|------|-----------|
| 1 | `requirement_traceability.md` | ✅ |
| 2 | `test_scenario_map.md` | ✅ |
| 3 | `test_data_catalog.md` | ⚙️ Optional |
| 4 | `risk_assessment.md` | ✅ |
| 5 | `MEMORY.md` | ✅ |

## Step 5 — Review & Vòng lặp Clarification
```
📊 Kết quả phân tích [module]:
- Tổng requirements: [N] | Tổng scenarios: [N] (P1:[n] P2:[n] P3:[n])
- Clarifications cần BA xác nhận: [N]
⚠️ Open items: [list câu hỏi]
```

Khi BA trả lời → cập nhật theo thứ tự:
`requirement_traceability.md → test_scenario_map.md → test_data_catalog.md → risk_assessment.md → MEMORY.md`

Lặp đến khi user xác nhận: *"OK, tiếp tục viết test case."*

## Step 6 — Handoff

Cập nhật `CLAUDE.md` ở root (append, không ghi đè):
```markdown
## Kết quả phân tích requirement — [date]
- **Tài liệu:** [list files]
- **Tổng requirement:** [N] | **Tổng scenario:** [N]
- **Modules:** [list]
- **Vùng rủi ro cao:** [list]
- **Clarifications chưa resolve:** [N]
- **MEMORY:** `02_analyze-requirements/MEMORY.md`
```
> Nếu đã có block từ lần trước → upsert theo ngày, không append trùng.

Sau đó hiển thị:
```
📋 Analyze hoàn tất. Files trong 02_analyze-requirements/:
  ✅ requirement_traceability.md
  ✅ test_scenario_map.md  
  [✅ test_data_catalog.md]
  ✅ risk_assessment.md
  ✅ MEMORY.md

→ Viết TC Web/Mobile lần đầu: dùng gen-testcase-webapp với MEMORY.md + test_scenario_map.md
→ Viết TC API: dùng gen-testcase-api với tài liệu API (cURL/Swagger/Word/Excel)
→ Update TC đã có: dùng update-testcase với MEMORY.md + TC Excel cũ + URD mới
```

---

# MODE 2: UPDATE

Trigger: feedback từ BA/Dev, scope thay đổi, scenario cần sửa.

```
User nói                    → Cập nhật files
"BA confirm [câu trả lời]"  → traceability.md → scenario_map.md → data_catalog.md → MEMORY.md
"Sửa scenario SC-xxx"       → scenario_map.md → MEMORY.md §4
"Thêm scenario [feature]"   → scenario_map.md → MEMORY.md §3+4
"Xóa scenario SC-xxx"       → scenario_map.md → MEMORY.md §3+4
"Dev nói [thay đổi kỹ thuật]" → scenario_map.md → data_catalog.md → MEMORY.md
"Đổi priority/risk module X"  → risk_assessment.md → scenario_map.md → MEMORY.md §3
"Xóa module X khỏi scope"     → tất cả files → MEMORY.md → CLAUDE.md
```

**Quy tắc:**
- KHÔNG tạo lại file từ đầu — chỉ sửa phần bị ảnh hưởng
- Luôn đồng bộ `MEMORY.md` sau mỗi thay đổi (cập nhật timestamp header: `> Cập nhật lần cuối: [date] — [lý do]`)
- Nếu thay đổi ảnh hưởng TC đã generate → cảnh báo: `"⚠️ Cần chạy lại update-testcase cho module [X]."`

---

# MODE 3: REVIEW

Đọc `MEMORY.md` → trình bày thông tin → KHÔNG sửa file.

Trigger: "Xem kết quả phân tích", "Còn bao nhiêu clarification?", "Module nào risk cao?"

---

# DELIVERABLES — FORMAT

### requirement_traceability.md
```markdown
# Requirement Traceability Matrix
## Tài liệu nguồn
| DOC ID | File | Loại | Phiên bản | Ngày phân tích |

## Ma trận truy vết
| Req ID | Mô tả | DOC Source | Nguồn (file + section) | Loại | Scenarios | Mức rủi ro |

## Clarifications Needed
| # | Req ID | DOC Source | Câu hỏi | Answer | Status | Ngày resolve | Ảnh hưởng TC |
```

### test_scenario_map.md
```markdown
# Test Scenario Map
## Tổng quan: [N] scenarios — P1:[n] P2:[n] P3:[n]

## [Module]
| Scenario ID | Feature | Req ID | DOC Source | Given | When | Then | Priority | Test Type |
```
> Given/When/Then phải đủ cụ thể để convert trực tiếp thành steps trong TC Excel.

### test_data_catalog.md *(optional)*
```markdown
# Test Data Catalog
## [Module]
| Field | Data Type | DOC Source | Ràng buộc | Valid | Invalid | Boundary | Scenarios |

## Test Accounts cần chuẩn bị
| Vai trò | Mục đích | Scenarios |
```

### risk_assessment.md
```markdown
# Risk Assessment
## Hướng dẫn: Risk Score = Business Impact (1-5) × Complexity (1-5)

## Ma trận rủi ro
| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |

## Vùng rủi ro cao (Score ≥ 15): [list]

## Dependencies
| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |

## Thứ tự test đề xuất: [1. Smoke P1 → 2. Risk cao nhất → ...]
```

### MEMORY.md *(bridge file — downstream skills đọc file này)*
```markdown
# MEMORY — Analyze Requirements Output
> Cập nhật lần cuối: [date] — [lý do]

## 1. Project Overview
- Dự án: [tên] | Môi trường: [DEV/STG/UAT] | URL: [url]

## 2. Document Registry
| DOC ID | File | Loại | Ngày phân tích | Status | Modules liên quan |

## 3. Module Summary
| Module | DOC Source | Tổng Req | Tổng Scenarios | P1 | P2 | P3 | Risk Level |

## 4. Scenario Index
| Scenario ID | Tên ngắn | Module | DOC Source | Priority | Test Type | TC Status |
> TC Status: ⏳ Chưa tạo / ✅ Đã tạo / 🔄 Cần update / 🚫 Blocked
> Chi tiết Given/When/Then → xem test_scenario_map.md

## 5. Test Data Summary *(chỉ có nếu đã tạo test_data_catalog.md)*
| Module | Fields chính | Có boundary? | Ghi chú |

## 6. Clarifications & Blockers
| # | Req ID | DOC Source | Vấn đề | Answer | Status | Ảnh hưởng TC |

## 7. TC Generation Log
| DOC ID | Ngày tạo/cập nhật | Tổng TC | File Excel | TC Version | Ghi chú |
```
> Khi phân tích thêm document: KHÔNG ghi đè — append rows vào §2, §3, §4. Cập nhật dòng Tổng và timestamp.

---

# NGUYÊN TẮC BẮT BUỘC

**Nội dung:**
- Chỉ tạo scenario từ requirement có trong tài liệu — không sáng tạo thêm
- Nếu mơ hồ → Clarifications Needed, không đoán
- Mọi scenario phải trace về requirement source (file + section)

**Format:**
- Viết tiếng Việt, giữ tiếng Anh cho: field names, status, priority, technical terms
- ID nhất quán: `REQ-[MODULE]-[NNN]`, `SC-[MODULE]-[NNN]`

---

# CHECKLIST — Tự kiểm tra sau Step 4
```
[ ] Mọi scenario có Req ID trỏ về requirement_traceability.md
[ ] Mọi requirement có ít nhất 1 positive + 1 negative (nếu applicable)
[ ] (Nếu có data_catalog) Cover tất cả input fields từ scenarios
[ ] risk_assessment.md có risk score cho mọi module
[ ] MEMORY.md đầy đủ §1→§7, timestamp đã cập nhật
[ ] CLAUDE.md đã upsert (không append trùng)
[ ] Không có scenario nào tạo ngoài requirement
[ ] Tất cả file nằm trong 02_analyze-requirements/
```
