# Risk Assessment — Chi tiết Thiết bị

## Hướng dẫn: Risk Score = Business Impact (1-5) × Complexity (1-5)

---

## Ma trận rủi ro

| Module/Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|----------------|-----------------|------------|------------|---------|
| Popup Thông số kỹ thuật — Trigger (2 entry points) & Đóng | 3 | 2 | 6 | Test P1: cả 2 entry points đều mở đúng popup |
| Popup — Hiển thị hình ảnh kỹ thuật (max 5, optional) | 3 | 3 | 9 | Test boundary 5 ảnh + case không có ảnh |
| Popup — Thông số 2 cột load từ PDH | 4 | 3 | 12 | Test layout 2 cột + data đúng; dễ vỡ layout trên mobile |
| Block Thông số kỹ thuật ẩn khi không có data PDH | 3 | 2 | 6 | Smoke test nhanh |
| Selector Số lượng (non-camera) thay thế Chu kỳ | 4 | 3 | 12 | Test min = 1, tăng/giảm; confirm giá có thay đổi theo SL không |
| Toàn bộ layout reuse từ SA | 4 | 2 | 8 | Regression smoke test bằng SA TC |
| Block Chu kỳ (camera) — hiển thị, chọn, truyền sang Mua Ngay | 4 | 2 | 8 | Test chọn chu kỳ → highlight + giá đổi; Mua Ngay truyền đúng chu kỳ |
| Block Cloud lưu trữ (camera) — hiển thị, chọn, kết hợp giá | 4 | 4 | 16 | Feature MỚI không có trong SA; logic giá phức tạp (Chu kỳ × Cloud); cần BA confirm options |

---

## Vùng rủi ro cao (Score ≥ 15)

| Feature | Risk Score | Lý do |
|---------|------------|-------|
| Block Cloud lưu trữ (camera) | 16 | Feature MỚI hoàn toàn, không có trong SA; logic giá kết hợp Chu kỳ × Cloud phức tạp; 4 CLA chưa resolve (options, default, PDH no-config, combined price) |

---

## Vùng rủi ro trung bình (Score 8–14)

| Feature | Risk Score | Lý do |
|---------|------------|-------|
| Popup Thông số 2 cột load từ PDH | 12 | PDH data structure mới, layout 2 cột dễ vỡ trên mobile |
| Selector Số lượng (non-camera) | 12 | Logic khác biệt so với SA (Chu kỳ → Số lượng), ảnh hưởng flow Mua Ngay |
| Popup hình ảnh kỹ thuật (max 5, optional) | 9 | Boundary + optional field |
| Layout reuse SA | 8 | Nhiều blocks cần regression khi code chi tiết thiết bị được build |

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|-----------|--------------|-------------------|
| Popup Thông số kỹ thuật | PDH cấu hình đúng data thông số + ảnh kỹ thuật | Popup rỗng hoặc không load |
| Block Thông số kỹ thuật ẩn/hiện | Logic ẩn/hiện từ PDH config | Nếu không ẩn → UI lộn xộn với button trống |
| Selector Số lượng | Business rule: loại thiết bị (camera vs non-camera) | Nếu hiển thị sai → Chu kỳ xuất hiện cho non-camera hoặc ngược lại |
| Selector Số lượng → Mua Ngay | CLA-CSTHIETBI-005: có max số lượng không, giá thay đổi theo SL? | Ảnh hưởng SC-012, SC-013 |
| Block Cloud lưu trữ | PDH cấu hình options + logic giá kết hợp (CLA-006, 007, 008) | Options sai → giá sai; Mua Ngay truyền sai gói Cloud |
| Giá tổng hợp camera (Chu kỳ + Cloud) | CLA-CSTHIETBI-007: hiển thị 1 giá tổng hay 2 dòng giá? | Giao diện giá sai → user nhầm khi mua |

---

## Thứ tự test đề xuất

1. **Smoke P1** — Layout tổng quan (reuse SA), Số lượng mặc định = 1, trigger popup (SC-001, SC-002), đóng popup (SC-009, SC-010)
2. **Risk trung bình — Thông số KT** — 2 cột (SC-007), ảnh max 5 (SC-005, SC-006)
3. **Risk trung bình — Số lượng** — tăng (SC-012), giảm về min (SC-013)
4. **Negative/Edge** — Không có ảnh KT (SC-004), block ẩn khi no data (SC-008), Chu kỳ/Cloud ẩn trên non-camera (SC-017, SC-020)
5. **Camera blocks** — Chu kỳ options + chọn (SC-014, SC-015, SC-016), Cloud lưu trữ + chọn (SC-018, SC-019), giá tổng hợp (SC-022)
6. **Regression SA reuse** — Chạy lại bộ TC từ `ISC_ECP_chucnang_ChitietdichvuSA_V1.0.xlsx` (bỏ qua TCs về Chu kỳ cho non-camera)
