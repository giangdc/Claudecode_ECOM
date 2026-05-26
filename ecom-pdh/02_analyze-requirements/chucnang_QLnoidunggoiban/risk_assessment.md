# Risk Assessment
> Dự án: ecom-pdh | Sprint: V1.2 | Phân tích: 2026-05-25  
> **Hướng dẫn: Risk Score = Business Impact (1–5) × Complexity (1–5)**

---

## Ma trận rủi ro

| Module / Feature | Business Impact | Complexity | Risk Score | Đề xuất |
|-----------------|----------------|-----------|-----------|---------|
| TAOMOI — Kênh bán multi-select + Lưu N records | 5 | 5 | **25** | Test P1 sớm nhất; cần test data đa dạng |
| TAOMOI — Hình ảnh SKU nhận trong gói (per line-item) | 5 | 4 | **20** | Cần chuẩn bị SKU có ảnh và SKU không có ảnh |
| CHINHSUA — Load data + Read-only constraint | 5 | 4 | **20** | Phụ thuộc vào TAOMOI đã có data; test ngay sau P1 TAOMOI |
| TAOMOI — Sản phẩm nhận trong gói (checkbox → ảnh hưởng kênh bán) | 5 | 3 | **15** | Tác động trực tiếp đến dữ liệu hiển thị trên kênh |
| TAOMOI — Phương thức hiển thị: SKU con kế thừa + validate min 1 cha | 4 | 4 | **16** | Business rule quan trọng; test cả happy path và boundary |
| CHINHSUA — Lưu: cập nhật record + ghi log | 4 | 3 | **12** | Đặc biệt test trường hợp lưu không thay đổi (QA-003) |
| TAOMOI — Block Đặc quyền (CRUD, max 10) | 3 | 3 | **9** | Tối đa 10 row; validate Tiêu đề bắt buộc |
| TAOMOI — Banner giữa trang (Section/Group + Toggle) | 3 | 3 | **9** | Cấu trúc phức tạp hơn banner đầu trang |
| TAOMOI — Link video (URL validation) | 3 | 2 | **6** | Regex validation http/https |
| TAOMOI — Hình ảnh banner đầu trang | 3 | 2 | **6** | Rule giống Banner gói bán (v1.0) |
| TAOMOI — Icon gói bán (SVG mới) | 2 | 2 | **4** | Thêm SVG là định dạng mới so với v1.0 |
| DANHSACH — Toàn bộ | 2 | 1 | **2** | Không thay đổi trong Sprint V1.2; smoke test đủ |

---

## Vùng rủi ro cao (Score ≥ 15)

1. **TAOMOI — Kênh bán multi-select + Lưu N records** (Score 25)
   - Kênh bán thay đổi từ single → multi-select
   - Lưu N kênh → N records trong DB: nguy cơ duplicate, thiếu record, hoặc lưu sai kênh
   - Kênh đã sử dụng phải lọc ra khỏi dropdown: nguy cơ hiển thị sai
   - Phụ thuộc CLA-004 (dependency giữa Kênh bán và Gói bán) và CLA-005 (N records trong Danh sách)

2. **TAOMOI — Hình ảnh SKU nhận trong gói** (Score 20)
   - Per line-item: logic khác hoàn toàn so với upload ảnh gói bán
   - Auto-load từ SKU config: cần dữ liệu test SKU có ảnh và không có ảnh
   - Giới hạn 1 ảnh/SKU: dễ sai khi có nhiều SKU trong 1 gói

3. **CHINHSUA — Load data + Read-only** (Score 20)
   - Nếu load sai data → mọi scenario Chỉnh sửa đều fail
   - Kênh bán và Gói bán phải tuyệt đối read-only
   - Phụ thuộc vào TAOMOI đã tạo data thành công

4. **TAOMOI — Phương thức hiển thị validate** (Score 16)
   - Validate: tối thiểu 1 sản phẩm cha = "Hiển thị toàn bộ"
   - SKU con kế thừa nhóm SKU: dễ miss nếu không có test case Nhóm SKU

5. **TAOMOI — Sản phẩm nhận trong gói** (Score 15)
   - Uncheck ảnh hưởng trực tiếp đến dữ liệu kênh bán nhận được
   - Cần verify behavior phía kênh bán (ngoài scope UI test, cần confirm với dev)

---

## Dependencies

| Feature A | Phụ thuộc vào | Ảnh hưởng nếu fail |
|-----------|--------------|-------------------|
| TAOMOI — Kênh bán multi-select | Gói bán có giá bán đã cấu hình trên các kênh | Không test được SC-TAOMOI-001, 002 |
| TAOMOI — Hình ảnh SKU auto-load | SKU trong hệ thống đã có ảnh cấu hình | Không test được SC-TAOMOI-012 (chỉ test SC-TAOMOI-013) |
| TAOMOI — Phương thức hiển thị (SKU con kế thừa) | Gói bán chứa Nhóm SKU với ít nhất 1 SKU con | Không test được SC-TAOMOI-010 |
| CHINHSUA — Tất cả | TAOMOI đã tạo thành công ít nhất 1 bản ghi | Không có data để chỉnh sửa |
| CHINHSUA — Lưu log | QA-003 đã confirm: "lưu không thay đổi vẫn ghi log" | Cần STG có audit log |
| DANHSACH — Hiển thị N records | CLA-005 (confirmed: mỗi kênh = 1 dòng riêng) | Không verify được behavior đúng sau khi lưu |

---

## Test data cần chuẩn bị (STG: http://ecp-stag.fpt.net/)

| # | Loại data | Mô tả | Dùng cho |
|---|-----------|-------|---------|
| 1 | Gói bán active + đã có giá trên ≥2 kênh | VD: 1 gói có giá FPT.vn + tongdaiwifi.vn | SC-TAOMOI-001 |
| 2 | Gói bán inactive hoặc chưa có giá | Dùng để test filter dropdown | SC-TAOMOI-003 |
| 3 | Gói bán có SKU đơn (có Display name) | Để test auto-fill | SC-TAOMOI-004 |
| 4 | Gói bán có Nhóm SKU + SKU con | Để test kế thừa phương thức hiển thị | SC-TAOMOI-010 |
| 5 | SKU có ảnh trong cấu hình SKU | Để test auto-load hình ảnh | SC-TAOMOI-012 |
| 6 | SKU chưa có ảnh trong cấu hình SKU | Để test hiển thị nút Thêm | SC-TAOMOI-013 |
| 7 | Bản ghi nội dung đã tạo (TAOMOI) | Để test màn hình Chỉnh sửa | SC-CHINHSUA-001 đến 011 |

---

## Thứ tự test đề xuất

```
1. [Smoke P1]    TAOMOI: Lưu cơ bản 1 kênh (SC-033)
                 CHINHSUA: Load data (SC-001)
                 → Nếu Smoke fail → STOP, báo dev

2. [P1 TAOMOI]   Kênh bán multi-select (SC-001, 002)
                 Auto-fill (SC-004, 005)
                 Sản phẩm nhận trong gói (SC-008, 009)
                 Hình ảnh SKU (SC-012, 013, 014, 015)
                 Phương thức hiển thị validate (SC-011)
                 Đặc quyền CRUD (SC-019, 020, 021, 022)
                 Lưu N records (SC-033, 034)
                 Hủy popup (SC-035, 036)

3. [P1 CHINHSUA] Read-only constraint (SC-002)
                 Checkbox + ảnh SKU (SC-004, 005)
                 Lưu + log (SC-009, 010)
                 Hủy popup (SC-011)

4. [P2 TAOMOI]   Upload icon (SC-006, 007)
                 SKU con kế thừa (SC-010), giới hạn 1 ảnh (SC-016)
                 Đặc tính (SC-017, 018), icon/ảnh đặc quyền (SC-023, 024)
                 Mô tả boundary (SC-025)
                 Banner đầu trang (SC-026, 027)
                 Link video (SC-028, 029)
                 Banner giữa trang (SC-030, 031, 032)

5. [P2 CHINHSUA] Tên hiển thị (SC-003)
                 Đặc quyền (SC-006)
                 Banner đầu/giữa trang (SC-007, 008)

6. [P3 DANHSACH] Danh sách, tìm kiếm, empty state (SC-001 đến 005)
```
