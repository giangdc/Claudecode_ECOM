# Requirement Traceability Matrix — Chi tiết Thiết bị

## Tài liệu nguồn

| DOC ID | File | Loại | Phiên bản | Ngày phân tích |
|--------|------|------|-----------|----------------|
| DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx | QC Spec (diff vs SA) | v1.0 | 2026-05-25 |
| DOC-CSTHIETBI-02 | ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx | TC Reference (SA base) | v1.0 | 2026-05-25 |

> **Lưu ý đặc thù module:** DOC-CSTHIETBI-01 chỉ mô tả các điểm KHÁC so với Chi tiết Dịch vụ SA.
> Tất cả blocks không đề cập → rule giống SA, reuse `ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx`.

---

## Ma trận truy vết

### Nhóm A — Giống Chi tiết Dịch vụ SA (Reuse TC)

| Req ID | Mô tả | DOC Source | Nguồn (file + section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|------------|------------------------|------|-----------|------------|
| REQ-CSTHIETBI-001 | Layout tổng thể màn hình chi tiết thiết bị tương tự SA: Header, Breadcrumb, Hình ảnh & Video, Thông tin SP, Giá bán, Đặc quyền, Ưu đãi, KMTT, Mua ngay, Thông tin SP block, Thông tin hay, Đã xem gần đây, FAQ, Footer | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 | Medium |
| REQ-CSTHIETBI-002 | Breadcrumb: hiển thị đúng danh mục, điều hướng, không click điểm cuối | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §Breadcrumb | Low |
| REQ-CSTHIETBI-003 | Hình ảnh & Video: max 10 mục, navigation, video popup | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §Hình Ảnh & Video | Medium |
| REQ-CSTHIETBI-004 | Thông tin SP: tên, mô tả load từ PDH; Giá bán theo location; format VNĐ | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §Thông Tin + §Giá Bán | Medium |
| REQ-CSTHIETBI-005 | Button Mua Ngay → điều hướng đăng ký | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §Button Mua Ngay | High |
| REQ-CSTHIETBI-006 | Block Thông Tin SP: expand/collapse "Xem thêm"/"Thu gọn" | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §Block Thông Tin Sản Phẩm | Low |
| REQ-CSTHIETBI-007 | Block Đã xem gần đây: session-based, max 10, không hiện trang hiện tại | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §Block Đã Xem Gần Đây | Low |
| REQ-CSTHIETBI-008 | FAQ: accordion expand/collapse, load từ CMS, ẩn khi không có data | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Functional | Reuse DOC-CSTHIETBI-02 §FAQ | Low |
| REQ-CSTHIETBI-009 | UI/UX: responsive mobile (375px) và tablet (768px), loading skeleton | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — dòng 1 | Non-functional | Reuse DOC-CSTHIETBI-02 §UI/UX | Medium |

### Nhóm B — MỚI / KHÁC so với Chi tiết Dịch vụ SA (Cần TC mới)

| Req ID | Mô tả | DOC Source | Nguồn (file + section) | Loại | Scenarios | Mức rủi ro |
|--------|-------|------------|------------------------|------|-----------|------------|
| REQ-CSTHIETBI-010 | Button "Xem tất cả thông số" (trong section Thông số kỹ thuật) và "Thông số kỹ thuật" (entry point khác) — cả 2 đều trigger mở cùng 1 popup | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — Mô tả popup; UI image1, image2 | Functional | SC-CSTHIETBI-001, SC-CSTHIETBI-002 | Medium |
| REQ-CSTHIETBI-011 | Block Thông số kỹ thuật nằm dưới block Hình Ảnh & Video Sản Phẩm trong layout trang | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — UI image1, image2; CLA-CSTHIETBI-002 | UI | SC-CSTHIETBI-001 | Low |
| REQ-CSTHIETBI-012 | Popup Thông số kỹ thuật hiển thị hình ảnh kỹ thuật: cài đặt riêng trên PDH, optional, giới hạn max 5 ảnh | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — "Hình ảnh kỹ thuật cài đặt riêng trên PDH (optional), giới hạn max 5 ảnh" | Functional | SC-CSTHIETBI-003, SC-CSTHIETBI-004, SC-CSTHIETBI-005, SC-CSTHIETBI-006 | Medium |
| REQ-CSTHIETBI-013 | Popup Thông số kỹ thuật hiển thị thông số kỹ thuật chi tiết cài đặt trên PDH với 2 cột: nội dung + thông số | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — "Thông số kỹ thuật chi tiết cài đặt trên PDH với 2 cột nội dung + thông số" | Functional | SC-CSTHIETBI-007, SC-CSTHIETBI-008 | Medium |
| REQ-CSTHIETBI-014 | Khi PDH không cấu hình thông số kỹ thuật → block Thông số kỹ thuật và button ẩn hoàn toàn | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx; CLA-CSTHIETBI-003 | Business Rule | SC-CSTHIETBI-008 | Low |
| REQ-CSTHIETBI-015 | Đóng popup Thông số kỹ thuật: tap vào vùng ngoài popup hoặc click button X | DOC-CSTHIETBI-01 | QC_chi tiết thiết bị.docx — "Tap vào vùng ngoài popup hoặc button X để tắt" | Functional | SC-CSTHIETBI-009, SC-CSTHIETBI-010 | Low |
| REQ-CSTHIETBI-016 | Thiết bị non-camera hiển thị selector "Số lượng" (mặc định = 1) thay vì "Chu kỳ gói" — one-time purchase | DOC-CSTHIETBI-01 | UI image2 (TV Samsung) + annotation "nếu không phải camera chỉ hiển thị số lượng"; CLA-CSTHIETBI-004 | Business Rule | SC-CSTHIETBI-011, SC-CSTHIETBI-012 | Medium |
| REQ-CSTHIETBI-017 | Selector Số lượng có button tăng (+) và giảm (-); giá trị tối thiểu = 1 | DOC-CSTHIETBI-01 | UI image2 (TV Samsung) — "Số lượng: 1" với +/- buttons | Functional | SC-CSTHIETBI-012, SC-CSTHIETBI-013 | Medium |
| REQ-CSTHIETBI-018 | Thiết bị Camera hiển thị block "Chu kỳ" với các option chu kỳ (VD: 1 tháng, 3 tháng…); chọn chu kỳ → highlight; giá bán thay đổi theo chu kỳ đã chọn — rule giống SA service | DOC-CSTHIETBI-01 | UI image1 (Camera) — hàng selector Chu kỳ; CLA-CSTHIETBI-004 (Camera giữ Chu kỳ) | Functional | SC-CSTHIETBI-014, SC-CSTHIETBI-015, SC-CSTHIETBI-016, SC-CSTHIETBI-017 | High |
| REQ-CSTHIETBI-019 | Thiết bị Camera hiển thị block "Cloud lưu trữ" với các option lưu trữ (VD: Không / 7 ngày / 30 ngày…); chọn option → highlight; giá bán phản ánh option đã chọn | DOC-CSTHIETBI-01 | UI image1 (Camera) — hàng selector thứ 2 phía trên giá | Functional | SC-CSTHIETBI-018, SC-CSTHIETBI-019, SC-CSTHIETBI-020, SC-CSTHIETBI-021 | High |
| REQ-CSTHIETBI-020 | Giá bán camera = tổng hợp từ Chu kỳ đã chọn + Cloud lưu trữ đã chọn | DOC-CSTHIETBI-01 | UI image1 (Camera) — giá hiển thị sau khi chọn cả 2 option | Business Rule | SC-CSTHIETBI-022 | High |

---

## Clarifications Needed

| # | Req ID | DOC Source | Câu hỏi | Answer | Status | Ngày resolve | Ảnh hưởng TC |
|---|--------|------------|---------|--------|--------|--------------|--------------|
| CLA-CSTHIETBI-001 | REQ-CSTHIETBI-010 | DOC-CSTHIETBI-01 | Tên button chính xác là "Xem tất cả thông số" hay "Thông số kỹ thuật"? Hai tên dùng trong ngữ cảnh nào khác nhau? | Là 2 entry point khác nhau trên cùng màn hình, click vào đều mở cùng 1 popup. UI có mô tả rõ vị trí từng button | Resolved | 2026-05-25 | SC-001, SC-002 — giữ nguyên 2 scenarios |
| CLA-CSTHIETBI-002 | REQ-CSTHIETBI-011 | DOC-CSTHIETBI-01 | Block "Thông số kỹ thuật" nằm ở vị trí nào trong layout trang? | Nằm dưới block Hình Ảnh & Video Sản Phẩm | Resolved | 2026-05-25 | REQ-CSTHIETBI-011 updated |
| CLA-CSTHIETBI-003 | REQ-CSTHIETBI-012, REQ-CSTHIETBI-013 | DOC-CSTHIETBI-01 | Khi PDH không cấu hình thông số kỹ thuật → block/button có ẩn không? | Ẩn đi — block và button không hiển thị | Resolved | 2026-05-25 | SC-008 unblocked, cập nhật scenario |
| CLA-CSTHIETBI-004 | REQ-CSTHIETBI-016 | DOC-CSTHIETBI-01 | Thiết bị có block "Chu kỳ gói" không? | Non-camera: hiển thị "Số lượng" thay vì Chu kỳ (one-time purchase). Camera: có Chu kỳ. Confirmed từ UI image2 + annotation | Resolved (partial) | 2026-05-25 | REQ-CSTHIETBI-016, 017 mới |
| CLA-CSTHIETBI-005 | REQ-CSTHIETBI-016, REQ-CSTHIETBI-017 | DOC-CSTHIETBI-01 | Selector Số lượng có giới hạn tối đa không? Hệ thống xử lý ra sao khi số lượng = 0 (giảm dưới 1)? | — | Open | — | SC-CSTHIETBI-012, SC-CSTHIETBI-013 |
| CLA-CSTHIETBI-006 | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | Block Cloud lưu trữ có các option cụ thể nào? (VD: Không / 7 ngày / 30 ngày?) Option mặc định là gì? | — | Open | — | SC-CSTHIETBI-018, SC-CSTHIETBI-019 |
| CLA-CSTHIETBI-007 | REQ-CSTHIETBI-020 | DOC-CSTHIETBI-01 | Giá bán camera được tính thế nào khi kết hợp Chu kỳ + Cloud lưu trữ? Hiển thị 1 giá tổng hay 2 dòng giá riêng? | — | Open | — | SC-CSTHIETBI-022 |
| CLA-CSTHIETBI-008 | REQ-CSTHIETBI-019 | DOC-CSTHIETBI-01 | Khi PDH không cấu hình Cloud lưu trữ cho camera → block ẩn hay hiện với option mặc định "Không"? | — | Open | — | SC-CSTHIETBI-021 |
