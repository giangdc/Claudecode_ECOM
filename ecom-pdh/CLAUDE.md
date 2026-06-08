# ecom-pdh — Project Context

> Vai trò file này: **context riêng của project ecom-pdh** — thông tin dự án, index MEMORY, và toàn bộ kết quả phân tích requirement per-module.
> Kiến trúc workspace / pipeline / naming / language / tooling / Excel format → xem **`../CLAUDE.md`** (root, canonical).
> Catalog skill + cây thư mục + template path → xem **`../.claude/CLAUDE.md`**.

## Thông tin dự án
- **Tên dự án:** ecom-pdh — FPT Telecom ISC/ECP | **Version:** v1.1 | **Loại:** Functional
- **Môi trường STG:** http://ecp-stag.fpt.net/
- **Checkout (web khách hàng):** staging.tongdaiwifi.vn, staging.fpt.vn/checkout
- **Scaffolded** bởi `init-manual-project` (2026-05-25)

## Index MEMORY (bridge files cho mỗi module)
- `02_analyze-requirements/MEMORY.md` — Gói bán (QLnoidunggoiban)
- `02_analyze-requirements/chucnang_QLdactinh/MEMORY.md` — Quản lý Đặc tính
- `02_analyze-requirements/chucnang_manhinhchitietthietbi/MEMORY.md` — Chi tiết Thiết bị
- `02_analyze-requirements/chucnang_Voucher/MEMORY.md` — Voucher (EVC Checkout)
- `02_analyze-requirements/chucnang_checkout/MEMORY.md` — Checkout đa dịch vụ

---

# Kết quả phân tích requirement (per-module)

## 2026-05-25 — Gói bán (QLnoidunggoiban)
- **Tài liệu:** DOC-01 TongHop_NoidungGoiban_v1.1_prep.md | DOC-02 [Sprint V1.2] URD Product Offering Content
- **Sprint:** V1.2 | **Requirement:** 33 | **Scenario:** 52 (P1:26 P2:21 P3:5)
- **Modules:** DANHSACH (không đổi) | TAOMOI (nhiều thay đổi) | CHINHSUA (nhiều thay đổi)
- **Rủi ro cao:** Kênh bán multi-select + Lưu N records (25); Hình ảnh SKU per line-item (20); Chỉnh sửa Load data + Read-only (20)
- **Clarifications chưa resolve:** 9 (CLA-001→009) — cần BA confirm trước khi gen TC
- **MEMORY:** `02_analyze-requirements/MEMORY.md`

## 2026-05-25 — Chi tiết Thiết bị (manhinhchitietthietbi)
- **Tài liệu:** DOC-CSTHIETBI-01 QC_chi tiết thiết bị.docx | DOC-CSTHIETBI-02 ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx (reference)
- **Đặc thù:** Giống Chi tiết Dịch vụ SA, thêm 1 feature: Popup Thông số kỹ thuật
- **Requirement:** 13 (9 reuse SA + 4 mới) | **Scenario mới:** 10 (P1:5 P2:4 P3:1) | **Module:** CSTHIETBI
- **Rủi ro cao:** không có (max 12: Thông số 2 cột load PDH)
- **Clarifications:** 4 (CLA-CSTHIETBI-001→004) — resolve 001 & 004 trước khi gen TC
- **MEMORY:** `02_analyze-requirements/chucnang_manhinhchitietthietbi/MEMORY.md`

## 2026-05-25 — Quản lý Đặc tính (QLdactinh)
- **Tài liệu:** DOC-04 [Sprint V1.2] URD - Specification Management (1).docx
- **Sprint:** V1.2 — thêm "Icon đặc tính" vào Tạo mới/Chi tiết/Chỉnh sửa; xác nhận Kiểu dữ liệu "Text" (3 loại)
- **Requirement:** 15 | **Scenario:** 37 (P1:14 P2:22 P3:1 blocked)
- **Modules:** DACTINH-DANHSACH | TAOMOI | CHITIET | CHINHSUA
- **Rủi ro cao:** Chỉnh sửa validation + save flow (16); Tên unique trim+case (15)
- **Clarifications:** 6 (CLA-DACTINH-001→006) — 4 high priority cần BA confirm
- **MEMORY:** `02_analyze-requirements/chucnang_QLdactinh/MEMORY.md`

## 2026-05-26 — Voucher (Checkout) [Updated 2026-05-27]
- **Tài liệu:** DOC-VOUCHER-01 FCP Auto Voucher | -02 Tích hợp Evoucher | -03/04/05/06 api doc v1.xlsx | -07/08 bản gốc .docx (8 SC từ screenshots)
- **Requirement:** 60 | **Scenario:** 63 (P1:42 P2:21)
- **Modules:** VOUCHER-LIST/DETAIL/APPLY/CANCEL/RECHECK/AUTO/API/AUTO-UI/UI
- **API Output BA bắt buộc trong TC:** API_01 data[] 8 fields (voucherCode, voucherType 1=chung/2=lẻ...); API_02 voucher_code + Content1-6; API_03 17 top-level + applies[] 10 sub (chi tiết MEMORY §5.1)
- **Rủi ro cao:** VOUCHER-AUTO 5 UCs (25); APPLY+RECHECK output (20); hasManualVoucher flag (20); AUTO-UI source="auto" silent fail (20)
- **Clarifications:** 15 total (13 Open) — CLA-VOUCHER 002-008, CLA-APISPEC 002/004/005, CLA-AUTO 001/002/003
- **TC API:** `03_test-cases/api/.../AI_ISC_ecom-pdh_v1.1_TC_API_v1.2.xlsx` (100 TC) + `_v2.0.xlsx` (77 TC từ ECP_API_Documentation_v4)
- **MEMORY:** `02_analyze-requirements/chucnang_Voucher/MEMORY.md`

## Checkout đa dịch vụ (re-baseline 2026-06-01 → cập nhật 06-03, 06-06, 06-08)
- **Tài liệu:** DOC-CK-01 Chucnangcheckout.xlsx | -02 TC_checkout.xlsx (BA ref) | -03 camera.png (mockup) | -04 Chucnangcheckout_0306.xlsx (revise: +AP, +địa chỉ Camera) | -05 Mô tả luồng checkout tongdaiwifi 0606.xlsx (confirm + label AP)
- **Phạm vi phân tích:** UltraFast (DANGKYUF) + Màn chung (CKCOMMON) + Internet + Camera + AP + **Smart TV (clone AP, 2026-06-08)**. Chưa: Smart Home.
- **Khác biệt cốt lõi giữa dịch vụ:**
  - UltraFast: online-only (không COD), chỉ SĐT (+Email), 1 bước
  - Internet: COD+Online, có địa chỉ lắp đặt, 3 bước, trả trước/sau (QLCS)
  - Camera: COD+Online, **có chu kỳ** + địa chỉ lắp đặt, 2 bước, note giao hàng 3-7 ngày, **có "Thời gian lắp đặt"**
  - AP: COD+Online, **chỉ số lượng (không chu kỳ)** + địa chỉ lắp đặt, 2 bước, **KHÔNG có "Thời gian lắp đặt"**
  - **Smart TV: rule = AP** (chỉ khác label SP/giá/slug trên UI). Field validation Camera/AP/Smart TV tái dùng CKCOMMON.
- **Tổng (sau 06-06):** **155 SC** định nghĩa — active 147 (P1:70 P2:62 P3:15), 5 deferred (Chung cư), 3 blocked (voucher).
- **Rủi ro cao:** CKCOMMON Luồng thanh toán (25); CKCOMMON Phường/Xã + chính sách giá (20); INTERNET B2 trả trước/sau (20); DANGKYUF Online 3rd party (20); Camera/AP Địa chỉ lắp đặt + chính sách giá (20)
- **Pending:** CLA-CKCOMMON-007 (nội dung popup "Chưa hỗ trợ chính sách!"); CLA-CAMERA-001 ("Thời gian lắp đặt" nguồn data); CLA-AP-001 (AP không chu kỳ)
- **Automation đã chạy (2026-06-08):** UltraFast 19/20; AP+CKCOMMON 47 pass/5 skip; Smart TV 8 pass/1 skip. Sheet TC + spec: xem mapping slug ở root CLAUDE.md.
- **Defect Open:** BUG-DANGKYUF-001 (COD hiển thị staging)
- **MEMORY:** `02_analyze-requirements/chucnang_checkout/MEMORY.md`
