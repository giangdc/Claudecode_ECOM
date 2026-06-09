# FPT.VN — URD: Tích hợp Evoucher Checkout

**Mã hiệu:** 1.0-B M/PM/HDCV/FTEL  
**Phiên bản:** 1.0  

---

## REVISION HISTORY

> **Chú thích:**  
> - [A]: Add – Thêm mới  
> - [U]: Update – Cập nhật  
> - [D]: Delete – Xóa  

| Date | Version | Author | Reviewer | Approver | Change Description |
|---|---|---|---|---|---|
| 07/04/2026 | 0.1 | BA ECOM | PO | PO | Khởi tạo |

---

# A. GIỚI THIỆU

## I. Mục tiêu

| STT | Hạng mục | Mô tả |
|---|---|---|
| 1 | **Giới thiệu tổng quan** | Tài liệu mô tả yêu cầu nghiệp vụ cho chức năng tích hợp lấy danh sách và áp dụng evoucher giữa FCP và module EVC của QLCS. |
| 2 | **Hiện trạng** |  |
| 3 | **Mục tiêu & Hiệu quả kỳ vọng của dự án** |  |
| 4 | **Phạm vi triển khai** | Phạm vi bao gồm: Đơn Checkout — Đếm số lượng — Lấy danh sách EVC hợp lệ theo đơn hàng — Lấy thông tin chi tiết 1 EVC — Kiểm tra áp dụng hợp lệ 1 EVC — Hủy áp dụng EVC. **Note:** Giữ nguyên luồng trừ quota Evoucher như luồng FPT.vn hiện tại. |

## II. Tài liệu tham khảo

| Tài liệu | Đường dẫn |
|---|---|
| Get list voucher QLCS | https://fptsoftware362-my.sharepoint.com/:w:/r/personal/ecom_fpt_com/_layouts/15/Doc.aspx?sourcedoc=%7BEF280E2E-4798-450A-98D8-C56E46D3A79C%7D&file=get-list-evoucher-api.docx |
| Get infor voucher QLCS | https://fptsoftware362-my.sharepoint.com/:w:/r/personal/ecom_fpt_com/_layouts/15/Doc.aspx?sourcedoc=%7BCF9D6883-BA92-4B2D-89F7-613D586EBBD9%7D&file=get-info-evoucher.docx |
| GetVoucherContent | https://fptsoftware362-my.sharepoint.com/:w:/r/personal/ecom_fpt_com/_layouts/15/Doc.aspx?sourcedoc=%7BCF9D6883-BA92-4B2D-89F7-613D586EBBD9%7D&file=get-info-evoucher.docx |
| Sơ đồ tổng quan | https://app.diagrams.net/#G1TVg6W4BG45VYyAJE-QDz6xXrRfxuhiMv |

## III. Thuật ngữ chung

| Thuật ngữ | Mô tả |
|---|---|
| FCP | Ftel Commerce Platform – nền tảng TMĐT đa kênh của FPT Telecom |
| CO | Checkout – module điều phối luồng mua hàng trong FCP |
| QLCS | Quản lý Chính sách Bán hàng – module quản lý giá, voucher của FPT Telecom |
| EVC | eVoucher – phiếu ưu đãi điện tử |
| SC / Kênh | SaleChannel – kênh bán hàng (FE), ví dụ: fpt.vn, tongdaiwifi |
| BFF | Backend for Frontend – CO đóng vai trò này khi giao tiếp với QLCS |
| CTKM | Chương trình khuyến mãi – box hiển thị EVC trên giao diện SaleChannel |
| UC | Use Case – trường hợp sử dụng |
| BR | Business Rule – quy tắc nghiệp vụ |
| API | Application Programming Interface |
| N/A | Not Applicable – Không áp dụng |

---

# B. TỔNG QUAN CHỨC NĂNG

| STT | Tên chức năng | Task Jira |
|---|---|---|
| UC-01 | Đếm số voucher khả dụng theo đơn hàng | https://foxproject.atlassian.net/browse/EP-777 |
| UC-02 | Lấy danh sách voucher khả dụng theo đơn hàng | https://foxproject.atlassian.net/browse/EP-783 |
| UC-03 | Xem chi tiết voucher | https://foxproject.atlassian.net/browse/EP-191 |
| UC-04 | Áp dụng voucher, kiểm tra tính hợp lệ của voucher | https://foxproject.atlassian.net/browse/EP-746 |
| UC-05 | Hủy áp dụng voucher đang áp dụng trên đơn hàng | https://foxproject.atlassian.net/browse/EP-1064 |

> Xem sơ đồ tổng quan tại: https://app.diagrams.net/#G1TVg6W4BG45VYyAJE-QDz6xXrRfxuhiMv

---

# C. YÊU CẦU CHỨC NĂNG

## US 02 – Lấy danh sách voucher khả dụng theo đơn hàng

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Actor** | SaleChannel (FE) — xử lý hoàn toàn phía FE, không cần gọi CO hay QLCS thêm |
| **Description** | Khi user bấm mở box CTKM, SaleChannel hiển thị popup danh sách EVC hợp lệ từ dữ liệu đã lấy sẵn ở UC-01. Không gọi lại API. |
| **Trigger** | User bấm vào box CTKM / nút "Xem ưu đãi" trên màn hình Thanh toán |
| **Pre-condition** | • UC-01 đã chạy thành công và SC đã nhận được `items[]` từ CO  <br>• `count > 0` (có ít nhất 1 EVC hợp lệ) |
| **Post-condition** | Popup danh sách EVC hiển thị đầy đủ thông tin các EVC hợp lệ cho user chọn |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | Khách hàng | Bấm vào box CTKM hoặc nút "Xem ưu đãi" | Trigger mở popup |
| 2 | SaleChannel | Đọc `items[]` đã lưu từ UC-01, render popup danh sách EVC | KHÔNG gọi lại API CO hay QLCS |
| 3 | SaleChannel | Hiển thị popup với danh sách EVC: Mã EVC, Mô tả, Ghi chú, Hạn dùng | User thấy popup đầy đủ thông tin |
| 4a | Khách hàng | [Chọn 1 EVC] Bấm "Đồng ý" → Trigger UC-04 | Chuyển sang UC-04 |
| 4b | Khách hàng | [Xem chi tiết] Bấm "Điều kiện" → Trigger UC-03 | Chuyển sang UC-03 |
| 4c | Khách hàng | [Đóng popup] Bấm X hoặc ra ngoài | Popup đóng, quay lại màn Thanh toán |

### 3. Acceptance Criteria

| AC ID | Mô tả AC | Given | When | Then |
|---|---|---|---|---|
| AC-01 | CO trả đúng danh sách EVC hợp lệ theo context checkout | Checkout đã tạo, có ít nhất 1 lineitem hợp lệ, channelCode xác định | Hệ thống gọi API `getlistvoucher` | `result = 1`, `data[]` chứa ít nhất 1 item. Số lượng item trong `data[]` = số voucher hiển thị. Không trả lẫn voucher kênh khác. |
| AC-02 | CO gọi lại QLCS và trả danh sách mới khi context thay đổi | Checkout đã có context cũ; lineitem hợp lệ | Hệ thống gọi API `getlistvoucher` | `data[]` phản ánh đúng context mới. Khác biệt với `data[]` lần gọi trước nếu PTTT/Gói chu kỳ ảnh hưởng đến EVC. |
| AC-03 | CO trả `result = 0` và `data[]` rỗng khi không có EVC hợp lệ | Checkout hợp lệ nhưng QLCS không có EVC nào khớp context | Hệ thống gọi API `getlistvoucher` | `result = 0`, `data[] = []` hoặc `null`, `error field` rỗng, HTTP 200 (không phải 4xx/5xx). |
| AC-04 | CO trả đầy đủ các field bắt buộc trong từng item EVC | Checkout hợp lệ, QLCS có ít nhất 1 EVC khớp context | Hệ thống gọi API `getlistvoucher` | Mỗi item trong `data[]` có đủ: `voucherCode`, `voucherType`, `Description`, `Note`, `Todate`. Không có field null bắt buộc. `voucherType` chỉ là `1` hoặc `2`. |

### 4. Trường dữ liệu được ghi nhận/khởi tạo

| Object | Field | Required | Type | Mô tả |
|---|---|---|---|---|
| voucher | `voucherCode` | Y | string | Mã EVC. ⚠ Client cần lưu lại để dùng khi apply. |
| voucher | `description` | N | string | Mô tả nội dung khuyến mãi. |
| voucher | `note` | N | string | Ghi chú (có thể rỗng). Mapping: Note. |
| voucher | `expiredDate` | N | string | Ngày hết hạn voucher, format `dd/MM/yyyy`. |
| voucher | `voucherType` | Y | integer | Loại EVC. ⚠ Client phải lưu lại — bắt buộc truyền vào khi apply. |
| voucher | `applyTypeId` | N | integer | Hình thức áp dụng EVC. |
| voucher | `promotionTypeId` | N | integer | Loại khuyến mãi. |
| voucher | `policyGroupId` | N | integer | Nhóm chính sách. |

---

## US 03 – Lấy thông tin chi tiết 1 voucher

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user bấm nút "Điều kiện" của 1 EVC trong popup danh sách, hệ thống lấy và hiển thị nội dung chi tiết điều kiện áp dụng (`contents[]`) của EVC đó theo kênh bán hàng hiện tại. |
| **Actor** | Checkout (CO) — SaleChannel trigger khi user bấm "Điều kiện", QLCS cung cấp nội dung content. |
| **Trigger** | User bấm nút "Điều kiện" của 1 EVC trong popup danh sách EVC (UC-02). |
| **Pre-condition** | • UC-02 đã chạy thành công và popup danh sách EVC đang hiển thị  <br>• User đang xem ít nhất 1 EVC trong popup  <br>• `voucherCode` của EVC được chọn đã có trong `items[]` từ UC-02 |
| **Post-condition** | • Nếu thành công: popup/màn chi tiết hiển thị các điều kiện áp dụng của EVC  <br>• Nếu không có content: hiển thị thông báo "Không có thông tin điều kiện"  <br>• Nếu lỗi: hiển thị thông báo lỗi cụ thể, popup danh sách vẫn giữ nguyên |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | Khách hàng | Bấm nút "Điều kiện" của 1 EVC trong popup danh sách | Trigger gọi UC-03 |
| 2 | SaleChannel → CO | Gọi: `GET /public/v1/checkout/{checkoutId}/evouchers/{voucherCode}` | CO nhận `checkoutId` và `voucherCode` từ path param |
| 3 | CO | Đọc `CheckoutContext.channelCode` nội bộ → map sang `SaleChannelId` (integer) | `SaleChannelId` được xác định (không cần client truyền) |
| 4 | CO → QLCS | Gọi: `POST GetVoucherContent` — Payload: `[{ "VoucherCode": "...", "SaleChannelId": N }]` | QLCS nhận request và tìm kiếm content theo kênh |
| 5a | QLCS → CO | [result = 1] Trả `data[0]` gồm `Content1–Content6` (các trường có thể rỗng `""`) | CO nhận response thành công |
| 5b | QLCS → CO | [result ≠ 1] Trả lỗi với `error field` | CO nhận response lỗi |
| 6 | CO | [result = 1] Lọc `Content1–6`: bỏ trường rỗng (`""`) và `null` → gộp theo thứ tự vào mảng `contents[]` | Mảng `contents[]` sạch, chỉ có giá trị thực |
| 7a | CO → SC | [Thành công] Trả về: `{ success: true, voucherCode, contents[] }` | SC hiển thị từng phần tử trong `contents[]` |
| 7b | CO → SC | [contents[] rỗng] Trả về: `{ success: true, voucherCode, contents: [] }` | SC hiển thị "Không có thông tin điều kiện" |
| 7c | CO → SC | [Lỗi] Trả về: `{ success: false, voucherCode, contents: [], errorMessage }` | SC hiển thị thông báo lỗi. Popup danh sách vẫn giữ nguyên. |

### 3. Acceptance Criteria

| AC ID | Mô tả AC | Given | When | Then |
|---|---|---|---|---|
| AC-01 | CO chỉ gọi QLCS `GetVoucherContent` khi nhận request — không tự động gọi | `voucherCode` hợp lệ lấy từ `GET /list_evouchers` | Hệ thống gọi get chi tiết voucher | CO log không có request nào gọi QLCS `GetVoucherContent` trước khi API này được trigger. HTTP 200, `success = true`, `contents[]` có ít nhất 1 phần tử. |
| AC-02 | CO lọc đúng Content null/rỗng từ QLCS — `contents[]` chỉ chứa giá trị có nghĩa | QLCS trả `Content3=''`, `Content4=null` cho voucher này | Hệ thống gọi get chi tiết voucher | `contents[]` không chứa chuỗi rỗng hoặc `null`. Thứ tự đúng: `Content1` trước `Content6`. Client không cần xử lý `null`. |

### 4. Trường dữ liệu được ghi nhận/khởi tạo

| Field | Required | Type | Mô tả |
|---|---|---|---|
| `voucherCode` | Y | string | Mã EVC. ⚠ Client cần lưu lại để dùng khi apply. |

---

## US 04 – Áp dụng voucher kèm kiểm tra tính hợp lệ của voucher

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Thực hiện thao tác chọn voucher, thay đổi thông tin checkout. |
| **Actor** | Khách hàng: chọn EVC và bấm áp dụng. SaleChannel (FE): trigger API apply, hiển thị kết quả. CO (Backend): validate QLCS, gọi Calculate, trả response. QLCS: validate EVC, trả `data[]` = danh sách voucher hợp lệ. |
| **Trigger** | User bấm "Đồng ý" trong popup danh sách voucher. User thay đổi phương thức thanh toán/gói bán sau khi đã áp EVC. |
| **Pre-condition** | Checkout đã được tạo và có ít nhất 1 lineitem hợp lệ. SaleChannel đã có `voucherCode` và `voucherType` từ UC-02. |
| **Post-condition** | **Hợp lệ:** Promotion cập nhật. SC hiển thị `newOrderTotal` và `totalDiscount` mới. |

### 2. Workflow

#### UC-04.a: Áp dụng voucher lần đầu

**Pre-condition:** Checkout chưa có voucher áp dụng.  
**Trigger:** User chọn voucher.

**Flow:**
1. FE gọi API apply voucher.
2. CO nhận request từ FE.
3. CO gọi `getinforvoucher` và recheck sang QLCS validate.
4. QLCS validate voucher và tính toán promotion.
5. QLCS trả thông tin:
   - 5.1: Kết quả hợp lệ → CO thực hiện bước 6.
   - 5.2: Kết quả không hợp lệ → CO trả lỗi cho FE.
6. CO tính toán Calculator.
7. CO trả kết quả giá trị đơn hàng mới và voucher áp dụng cho FE.

#### UC-04.b: Áp dụng thêm voucher khi đã có voucher trước đó

**Pre-condition:** Checkout đã có voucher áp dụng thành công.  
**Trigger:** User chọn thêm voucher mới.

**Flow:**
1. FE gọi API apply voucher với voucher mới.
2. CO nhận request từ FE.
3. CO gửi toàn bộ voucher sang QLCS validate (gồm voucher cũ và mới).
4. QLCS validate và trả kết quả:
   - 4.1: Hợp lệ → thực hiện bước 5.1.
   - 4.2: Không hợp lệ → thực hiện bước 5.2.
5. CO xử lý:
   - 5.1: CO thực hiện calculate và trả ra cho FE giá trị đơn hàng mới + voucher áp dụng (sử dụng session cũ).
   - 5.2: CO trả ra voucher cũ vẫn áp dụng và lỗi voucher mới không hợp lệ.

#### UC-04.c: Revalidate voucher khi thay đổi checkout context

**Trigger:** User thay đổi Gói/Package hoặc Phương thức thanh toán.  
**Pre-condition:** Checkout đã có voucher áp dụng thành công.

**Flow:**
1. User thay đổi context.
2. FE gọi CO:
   - a. API get list voucher cho context mới.
   - b. API cancel voucher hiện tại.
   - c. API apply lại voucher.
3. CO xử lý và trả thông tin tương tự kịch bản UC-04.a.

### 3. Acceptance Criteria

| AC ID | Mô tả AC | Given | When | Then |
|---|---|---|---|---|
| AC-01 | CO cập nhật `PromotionInfor` + `Promotion.apply` cho từng service và tính lại checkout khi EVC hợp lệ | QLCS trả `result = 1` kèm `data[]` | Hệ thống tính toán checkout | `success = true`. `appliedVoucher.voucherCode` khớp input. `discountLines[].discountAmount > 0`. `newOrderTotal = giá gốc - tổng discount`. Promotion và `PromotionInfor.apply` được ghi nhận trong model checkout. |
| AC-02 | CO trả lỗi và không thay đổi checkout khi EVC không hợp lệ | QLCS trả `result ≠ 1` | Hệ thống xử lý | `success = false`. `errorMessage` có nội dung tiếng Việt, không lộ cấu trúc QLCS. Model checkout không thay đổi (Promotion vẫn như cũ). |
| AC-03 | CO giữ nguyên voucher cũ khi voucher mới thất bại | Checkout đang có voucher A hợp lệ trong Promotion | Hệ thống xử lý | `success = false` (cho B). `appliedVoucher` vẫn là voucher A. `newOrderTotal` vẫn = giá sau giảm của A. Không bị xóa voucher A. |

### 4. Trường dữ liệu được ghi nhận/khởi tạo

| Field | Sub-field | Required | Type | Mô tả |
|---|---|---|---|---|
| `promotion_id` | | N | string | Mã promotion |
| `promotion_title` | | N | string | Tiêu đề chương trình khuyến mãi |
| `voucher_code` | | Y | string | Mã EVC |
| `referrer_code` | | N | string | Mã giới thiệu |
| `discount_type` | | N | string | Loại giảm giá (ví dụ: Amount) |
| `discount_value` | | N | number | Tổng giá trị giảm đã bao gồm VAT (VNĐ) |
| `discount_ex_vat_value` | | N | number | Tổng giá trị giảm chưa bao gồm VAT (VNĐ) |
| `discount_rate` | | N | number | Tỷ lệ giảm giá (%) |
| `apply_type` | | N | string | Hình thức áp dụng (ví dụ: immediate) |
| `apply_from` | | N | string | Thời điểm bắt đầu áp dụng |
| `apply_to` | | N | string | Thời điểm kết thúc áp dụng |
| `original_discount_value` | | N | number | Tổng giá trị giảm gốc đã VAT |
| `original_discount_ex_vat` | | N | number | Tổng giá trị giảm gốc chưa VAT |
| `voucher_type` | | Y | integer | Loại EVC cấp 1 |
| `voucher_type_l2` | | N | integer | Loại EVC cấp 2 |
| `type_id` | | N | integer | ID loại voucher |
| `applies` | `service_id` | N | integer | ID dịch vụ được áp chiết khấu |
| `applies` | `sub_service_type_id` | N | integer | ID loại sub-service |
| `applies` | `sub_service_id` | N | integer | ID sub-service cụ thể |
| `applies` | `service_code` | N | integer | Mã dịch vụ |
| `applies` | `discount_ex_vat` | N | number | Tiền giảm chưa VAT |
| `applies` | `discount` | N | number | Tiền giảm đã VAT |
| `applies` | `dismonth` | N | integer | Số tháng giảm (0 = áp 1 lần) |
| `applies` | `is_deduct_order` | N | integer | 1 = khấu trừ thẳng vào tổng đơn |
| `applies` | `original_discount_value` | N | number | Giá trị giảm gốc đã VAT theo dịch vụ |
| `applies` | `original_discount_ex_vat` | N | number | Giá trị giảm gốc chưa VAT theo dịch vụ |

---

## US 05 – Hủy áp dụng voucher

> Sử dụng API `/public/v1/voucher/apply` với voucher bằng số voucher hiện tại của checkout.

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | User bỏ chọn EVC đang áp dụng và xác nhận hủy. CO reset thông tin EVC trong model Checkout và tính lại tổng đơn hàng về giá gốc. Không cần gọi QLCS vì EVC chưa bị lock. |
| **Actor** | SaleChannel trigger → CO xử lý hoàn toàn nội bộ. Không gọi QLCS. |
| **Trigger** | User bỏ chọn (uncheck) EVC đang áp dụng trong popup danh sách EVC và bấm "Đồng ý". |
| **Pre-condition** | • UC-04 đã chạy thành công — có EVC đang được áp dụng trong model Checkout (`PromotionInfor` có `VoucherCode`)  <br>• User chưa hoàn tất đơn hàng |
| **Post-condition** | Promotion trong model Checkout điều chỉnh giảm số voucher áp dụng. Tổng đơn hàng giảm. |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | Khách hàng | Bỏ chọn EVC trong popup danh sách và bấm "Đồng ý" | Trigger UC-05 |
| 2 | SC → CO | Gọi API apply với voucher bằng số voucher hiện tại | CO nhận request hủy EVC |
| 3 | CO | Tính toán Calculate | Giá trị đơn hàng |
| 4 | CO | Gửi thông tin FE | |

### 3. Acceptance Criteria

| AC ID | Mô tả AC | Given | When | Then |
|---|---|---|---|---|
| AC-01 | CO reset Promotion và tính lại checkout về giá gốc | Checkout đang có voucher áp dụng (Promotion có `VoucherCode`) | Hệ thống xử lý | `success = true`. `Promotion = []` trong model checkout. `DiscountAllocation = 0`. `DiscountType/Value/Rate` của lineitem `= 0`. `newOrderTotal = giá gốc trước UC-04`. |
| AC-02 | `newOrderTotal` sau DELETE bằng chính xác giá trước khi apply — không sai lệch | Đã ghi nhận giá gốc trước UC-04 (GT) | Hệ thống xử lý | `newOrderTotal` trong response `== GT`. Không có sai lệch (kể cả floating point). `CalculationSummary` cập nhật đúng. |
| AC-03 | CO không gọi QLCS khi hủy voucher — xử lý nội bộ hoàn toàn | Checkout có voucher đang áp dụng | Hệ thống xử lý | CO log không có outbound request nào đến QLCS trong quá trình xử lý DELETE (`KeepStatus = 0` nên không cần Release phía QLCS). |
| AC-04 | CO trả lỗi khi gọi DELETE nhưng chưa có EVC nào đang áp dụng | Checkout không có voucher (`PromotionInfor` rỗng) | Hệ thống xử lý | CO trả lỗi hoặc bỏ qua gracefully. Không crash, không thay đổi trạng thái checkout. `errorCode/message` rõ ràng. |

---

## US 06 – Recheck voucher khi complete checkout

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user bấm nút "Thanh toán", hệ thống thực hiện check voucher đã áp dụng vào checkout còn ngân sách hay quota không. |
| **Actor** | Checkout (CO). SaleChannel trigger khi user bấm "Thanh toán". |
| **Trigger** | User bấm nút "Thanh toán". |
| **Pre-condition** | • UC-04 đã áp dụng thành công — checkout có ít nhất 1 voucher được áp dụng. |
| **Post-condition** | Thành công: Đơn hàng được tạo thành công với checkout. Không thành công: Gửi thông báo lý do FE. |

### 2. Workflow

| Bước | Actor | Hành động |
|---|---|---|
| 1 | Khách hàng | Bấm nút "Thanh toán" |
| 2 | SaleChannel → CO | Gọi API complete checkout |
| 3 | CO → QLCS | Gọi QLCS API recheck voucher |
| 4 | QLCS → CO | Trả thông tin danh sách áp dụng vào checkout (True hoặc False): `Result = 1` → 5a; `Result = 0` → 5b; `Result = -1` → 5c |
| 5a | CO | Tiếp tục xử lý luồng Complete checkout |
| 5b | CO | Lỗi nghiệp vụ → Dừng Complete checkout, Remove Voucher, Calculate → Gửi thông tin voucher lỗi + thông tin đơn hàng mới (FE thực hiện gọi Get detail checkout để lấy thông tin mới nhất) |
| 5c | CO | Lỗi hệ thống → Dừng Complete checkout → Gửi thông tin lỗi FE |

### 3. Acceptance Criteria

| AC ID | Mô tả AC | When | Then | Given |
|---|---|---|---|---|
| AC-01 | CO tiếp tục luồng Complete khi QLCS recheck trả `result = 1` | Checkout có voucher, user trigger Complete Checkout (chọn Thanh toán) | Hệ thống xử lý | CO gọi QLCS recheck trước khi tạo order. QLCS trả `result = 1` → CO tiếp tục tạo order thành công. Order được tạo với đúng giá đã giảm. |
| AC-02 | CO dừng tạo order, tự xóa voucher và tính lại khi QLCS trả `result = 0` | QLCS recheck trả `result = 0` (hết quota/budget) | Hệ thống xử lý | Order không được tạo. CO tự remove voucher khỏi Promotion. CO calculate lại → `newOrderTotal = giá gốc`. Response FE: lỗi voucher + thông tin checkout mới nhất. |
| AC-03 | CO dừng tạo order và giữ nguyên checkout khi QLCS trả `result = -1` | QLCS recheck trả `result = -1` (lỗi hệ thống) | Hệ thống xử lý | Order không được tạo. Checkout giữ nguyên trạng thái hiện tại (voucher vẫn còn). Response FE: thông báo lỗi hệ thống. Không xóa voucher. |

---

*FPT Telecom — Tài liệu nội bộ*
