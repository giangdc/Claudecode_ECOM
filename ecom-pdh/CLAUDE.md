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
- **Tai lieu:** DOC-VOUCHER-01 FCP_Ver1.1_Auto_Voucher_Checkout.md | DOC-VOUCHER-02 FCP_Ver1.1_Tich_hop_Evoucher_Checkout.md | DOC-VOUCHER-03/04/05/06 api doc v1.xlsx (3 API sheets + header rules) | DOC-VOUCHER-07 FCP_ Ver1.1_Tich hop Evoucher Checkout.docx (ban goc) | DOC-VOUCHER-08 FCP__Ver1.1_Auto Voucher_Checkout.docx (ban goc, 5 images: sequence diagrams + UI screenshots)
- **Tong requirement:** 60 | **Tong scenario:** 63 (P1: 42 | P2: 21)
- **Modules:** VOUCHER-LIST | VOUCHER-DETAIL | VOUCHER-APPLY | VOUCHER-CANCEL | VOUCHER-RECHECK | VOUCHER-AUTO | VOUCHER-API | VOUCHER-AUTO-UI | VOUCHER-UI
- **API Output BA yeu cau (bat buoc trong TC):** API_01 data[]: 8 fields (voucherCode Y, voucherType Y 1=Ma chung/2=Ma le, description, note, expiredDate dd/MM/yyyy, applyTypeId, promotionTypeId, policyGroupId) | API_02 response: voucher_code + Content1-Content6 | API_03 response: 17 top-level fields + applies[] 10 sub-fields (chi tiet xem MEMORY.md §5.1)
- **Vung rui ro cao:** VOUCHER-AUTO 5 UCs (Score 25); VOUCHER-APPLY + VOUCHER-RECHECK output validation (Score 20); hasManualVoucher flag logic (Score 20); VOUCHER-AUTO-UI source="auto" + silent fail (Score 20)
- **Clarifications chua resolve:** 15 total (13 Open) — CLA-VOUCHER: 002, 003, 004, 005, 006, 007 (expiredDate conflict), 008 (applies[] Required conflict) | CLA-APISPEC: 002, 004, 005 | CLA-AUTO: 001 (source field spec), 002 (badge count API), 003 (notify wording) | Resolved: CLA-VOUCHER-001, CLA-APISPEC-001, CLA-APISPEC-003
- **TC API da gen + cap nhat:** 03_test-cases/api/AI_ISC_ecom-pdh_v1.1_TC_API_v1.1.xlsx (100 TC, gen-testcase-api-v3)
- **UI thuc te xac nhan tu screenshots DOC-VOUCHER-08:** "Ap dung voucher uu dai thanh cong" (green box), voucher code + "-500.000d" (red), badge "3" tren "Chon uu dai", "Can thanh toan: 2.480.000d" updated, "Thanh toan" button
- **Bo sung 2026-05-27:** DOC-VOUCHER-07 → CLA-VOUCHER-007/008, enrich voucherType + is_deduct_order; DOC-VOUCHER-08 → VOUCHER-AUTO-UI (6 SC), VOUCHER-UI (12 SC), CLA-AUTO-001/002/003
- **MEMORY:** `02_analyze-requirements/chucnang_Voucher/MEMORY.md`
