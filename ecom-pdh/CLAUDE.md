# ecom-pdh -- Project Context

## Thong tin du an
- **Ten du an:** ecom-pdh
- **Version:** v1.1
- **Loai kiem thu:** Functional
- **Moi truong & URL:**
- **STG:** http://ecp-stag.fpt.net/

## QA Testing Pipeline
```
00_input/  (dat URD/BRD/SRS tu BA vao day)
  |
  |-> analyze-requirement  ->  02_analyze-requirements/
  |       Output: MEMORY.md, test_scenario_map.md,
  |               requirement_traceability.md, risk_assessment.md
  |
  |-> gen-testcase-webapp  ->  03_test-cases/
  |       Output: AI_ISC_ecom-pdh_v1.1_TC_v1.0.xlsx (Web/Mobile)
  |
  |-> gen-testcase-api     ->  03_test-cases/api/
  |       Output: AI_ISC_ecom-pdh_v1.1_TC_API_v1.0.xlsx (REST API)
  |
  `-> update-testcase  ->  03_test-cases/
          Output: AI_ISC_ecom-pdh_v1.1_TC_v2.0.xlsx (v3.0...)
```

## Naming Conventions
- **TC Excel:** `AI_ISC_ecom-pdh_v1.1_TC_v[tc_version].xlsx`
- **TC ID (web):** `TC_[MODULE].[NNN]` -- vi du: TC_LOGIN.1, TC_PAY.3
- **TC ID (api):** `API_[NN].[NNN]` -- vi du: API_01.3
- **Scenario ID:** `SC-[MODULE]-[NNN]` -- vi du: SC-LOGIN-001
- **Requirement ID:** `REQ-[MODULE]-[NNN]` -- vi du: REQ-LOGIN-001

## Folder Reference
| Thu muc | Muc dich | Skill lien quan |
|---------|----------|-----------------|
| `00_input/` | Tai lieu dau vao: URD, SRS, specs tu BA | analyze-requirement (doc) |
| `02_analyze-requirements/` | Output: MEMORY.md, scenario map, traceability, risk | analyze-requirement (ghi) |
| `03_test-cases/` | TC Excel Web/Mobile | gen-testcase-webapp (ghi), update-testcase (doc+ghi) |
| `03_test-cases/api/` | TC Excel API | gen-testcase-api (ghi) |
| `04_test-data/` | Du lieu test (valid / invalid) | -- |

## MEMORY Files
- `02_analyze-requirements/MEMORY.md` -- bridge file cho module Goi ban
- `02_analyze-requirements/chucnang_QLdactinh/MEMORY.md` -- bridge file cho module Quan ly Dac tinh
- `02_analyze-requirements/chucnang_manhinhchitietthietbi/MEMORY.md` -- bridge file cho module Chi tiet Thiet bi
- `02_analyze-requirements/chucnang_Voucher/MEMORY.md` -- bridge file cho module Voucher (EVC Checkout)

## Language Rule
- Noi dung TC, mo ta, steps: **Tieng Viet**
- Technical terms, status (Pass/Fail/Blocked), priority (P1/P2/P3): **Tieng Anh**

## Tools
- Scaffolded by `init-manual-project` skill
- Created: 2026-05-25

## Ket qua phan tich requirement — 2026-05-25
- **Tai lieu:** DOC-01 TongHop_NoidungGoiban_v1.1_prep.md | DOC-02 [Sprint V1.2] URD Product Offering Content
- **Sprint:** V1.2 — cac tinh nang thay doi / bo sung so voi v1.0
- **Tong requirement:** 33 | **Tong scenario:** 52 (P1: 26 | P2: 21 | P3: 5)
- **Modules:** DANHSACH (khong thay doi) | TAOMOI (nhieu thay doi) | CHINHSUA (nhieu thay doi)
- **Vung rui ro cao:** Kenh ban multi-select + Luu N records (Score 25); Hinh anh SKU per line-item (20); Chinhsua Load data + Read-only (20)
- **Clarifications chua resolve:** 9 (CLA-001 den CLA-009) — can BA confirm truoc khi gen TC
- **MEMORY:** `02_analyze-requirements/MEMORY.md`

## Ket qua phan tich requirement — 2026-05-25 (Chi tiet Thiet bi)
- **Tai lieu:** DOC-CSTHIETBI-01 QC_chi tiết thiết bị.docx | DOC-CSTHIETBI-02 ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx (reference)
- **Dac thu:** Module tuong tu Chi tiet Dich vu SA — chi co them 1 feature moi: Popup Thong so ky thuat
- **Tong requirement:** 13 (9 reuse SA + 4 moi) | **Tong scenario moi:** 10 (P1:5 P2:4 P3:1)
- **Modules:** CSTHIETBI
- **Vung rui ro cao:** Khong co (max score = 12: Thong so 2 cot load PDH)
- **Clarifications chua resolve:** 4 (CLA-CSTHIETBI-001 den 004) — resolve CLA-001 va CLA-004 truoc khi gen TC
- **MEMORY:** `02_analyze-requirements/chucnang_manhinhchitietthietbi/MEMORY.md`

## Ket qua phan tich requirement — 2026-05-25 (Quan ly Dac tinh)
- **Tai lieu:** DOC-04 [Sprint V1.2] URD - Specification Management (1).docx
- **Sprint:** V1.2 — thay doi chinh: them "Icon dac tinh" vao Tao moi / Chi tiet / Chinh sua; xac nhan Kieu du lieu "Text" (3 loai)
- **Tong requirement:** 15 | **Tong scenario:** 37 (P1: 14 | P2: 22 | P3: 1 blocked)
- **Modules:** DACTINH-DANHSACH | DACTINH-TAOMOI | DACTINH-CHITIET | DACTINH-CHINHSUA
- **Vung rui ro cao:** Chinh sua validation + save flow (Score 16); Ten unique trim+case (Score 15)
- **Clarifications chua resolve:** 6 (CLA-DACTINH-001 den 006) — 4 high priority can BA confirm truoc khi gen TC
- **MEMORY:** `02_analyze-requirements/chucnang_QLdactinh/MEMORY.md`

## Ket qua phan tich requirement — 2026-05-26 (Chuc nang Voucher) [Updated: 2026-05-27]
- **Tai lieu:** DOC-VOUCHER-01 FCP_Ver1.1_Auto_Voucher_Checkout.md | DOC-VOUCHER-02 FCP_Ver1.1_Tich_hop_Evoucher_Checkout.md | DOC-VOUCHER-03/04/05/06 api doc v1.xlsx (3 API sheets + header rules)
- **Tong requirement:** 45 | **Tong scenario:** 49 (P1: 36 | P2: 13)
- **Modules:** VOUCHER-LIST | VOUCHER-DETAIL | VOUCHER-APPLY | VOUCHER-CANCEL | VOUCHER-RECHECK | VOUCHER-AUTO | VOUCHER-API
- **API Output BA yeu cau (bat buoc trong TC):** API_01 data[]: 8 fields (voucherCode Y, voucherType Y, description, note, expiredDate dd/MM/yyyy, applyTypeId, promotionTypeId, policyGroupId) | API_02 + API_03 response: 17 top-level fields + applies[] 10 sub-fields (chi tiet xem MEMORY.md §5.1)
- **Vung rui ro cao:** VOUCHER-AUTO 5 UCs (Score 25); VOUCHER-APPLY + VOUCHER-RECHECK output validation (Score 20); hasManualVoucher flag logic (Score 20)
- **Clarifications chua resolve:** 10 total — 5 CLA-VOUCHER (001, 003, 004, 005, 006) + 5 CLA-APISPEC (001..005 tu phan tich sau api doc v1.xlsx — Accept-Language rule, voucher_type string vs integer mapping, API_02/03 schema giong nhau, error response format, API_01 context source)
- **TC API da gen + cap nhat 2026-05-26:** 03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.0.xlsx (109 TC) — Da sua: (1) xoa HTTP code 93 TC; (2) API_01.19 bo sung applyTypeId/promotionTypeId/policyGroupId; (3) API_02.25-28 rewrite dung BA spec discount/applies[]; (4) API_03.28 bo sung du 17 fields + 10 sub-fields
- **Phan tich bo sung 2026-05-27:** Tao moi test_data_catalog.md (valid/invalid/boundary data cho 3 API + headers); bo sung CLA-APISPEC-001..005 vao traceability + MEMORY §6
- **MEMORY:** `02_analyze-requirements/chucnang_Voucher/MEMORY.md`
