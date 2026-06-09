# FPT.VN — URD: Tự động áp dụng Voucher Checkout

**Mã hiệu:**  
**Phiên bản:** 1.1  

---

## REVISION HISTORY

> **Chú thích:**  
> - [A]: Add – Thêm mới  
> - [U]: Update – Cập nhật, thay đổi  
> - [D]: Delete – Xóa  

| Date | Version | Author | Approver | Change Description |
|---|---|---|---|---|
| | | | | |

---

# A. GIỚI THIỆU

## I. Mục đích tài liệu

Tài liệu này mô tả yêu cầu nghiệp vụ và đặc tả kỹ thuật cho tính năng **Tự động áp dụng voucher** vào luồng thanh toán trên nền tảng FCP (Ftel Commerce Platform).

Tài liệu dành cho PM, BA, DEV và QA tham gia phát triển module CO (Checkout).

## II. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Tên tính năng** | Tự động áp dụng voucher có giá trị giảm giá tối ưu vào checkout |
| **Module** | CO – Checkout |
| **Phiên bản** | 1.1 |
| **Tác giả** | Yến Nguyễn – BA ECOM Team |
| **Ngày cập nhật** | 25/05/2026 |
| **Stakeholder** | Chị Linh – Trưởng phòng Growth; Team Vận hành; PM LongNH |
| **Phụ thuộc** | QLCS API (GetListEvoucher, GetEvoucherInfor, Recheck); UC-04 Manual Apply EVC; UC-05 Cancel EVC |

## III. Bối cảnh & Lý do thực hiện

Theo dữ liệu vận hành từ 01/04/2026 đến 22/05/2026:

| Chỉ số | Số liệu | Ghi chú |
|---|---|---|
| Tổng đơn online trong kỳ | ~200 đơn | |
| Voucher được sử dụng | ~100 lượt | 50% tổng đơn |
| Voucher không được sử dụng | ~100 lượt | 50% — user có voucher nhưng không dùng |
| Số voucher active / KH tại 1 thời điểm | 3 – 5 voucher | Confirm từ vận hành |

50% voucher được phát hành nhưng không được sử dụng cho thấy rào cản chính nằm ở UX: user không biết, không nhớ, hoặc không muốn tự browse danh sách voucher khi checkout. **Tính năng tự động áp dụng voucher giải quyết trực tiếp vấn đề này.**

Stakeholder chính: Chị Linh (Trưởng phòng Growth) đề xuất hệ thống tự động chọn và áp dụng 1 voucher giảm giá tối ưu cho KH, thay vì để KH tự chọn thủ công.

## IV. Tài liệu tham khảo

| STT | Tài liệu | Mô tả |
|---|---|---|
| 1 | FCP Ver1.1 – Tích hợp Evoucher Checkout | UC-04 Manual Apply, UC-05 Cancel, UC-06 Recheck |
| 2 | recheck-voucher.docx | API Recheck QLCS |
| 3 | get-list-evoucher-api.docx | API GetListEvoucher QLCS |
| 4 | get-info-evoucher.docx | API GetEvoucherInfor QLCS |
| 5 | Đề xuất thay đổi API QLCS – EVC | Yêu cầu bổ sung field QLCS để hỗ trợ tính năng này |
| 6 | AutoApply_Voucher_Sequence.drawio | Sequence diagram 5 kịch bản (file đính kèm) |

## V. Thuật ngữ, từ ngữ viết tắt

| Thuật ngữ | Mô tả |
|---|---|
| FCP | Ftel Commerce Platform – nền tảng thương mại điện tử backend của FPT Telecom |
| CO | Checkout module – module xử lý luồng thanh toán trong FCP |
| QLCS | Quản lý Chính sách – module quản lý giá và voucher, cung cấp API EVC |
| EVC | E-Voucher – mã giảm giá điện tử do QLCS quản lý |
| Auto-apply | Tự động áp dụng voucher – CO tự chọn và apply voucher tốt nhất, không cần user thao tác |
| Manual apply | Áp dụng thủ công – user chủ động chọn voucher từ danh sách (UC-04) |
| `hasManualVoucher` | Flag trong Checkout model: `true` nếu có ít nhất 1 voucher được user manual apply. CO dùng để quyết định có chạy auto-apply không. |
| DiscountVAT | Số tiền chiết khấu đã bao gồm VAT, trả về từ GetEvoucherInfor. Dùng để so sánh và chọn voucher tốt nhất. |
| Context checkout | Bộ thông tin xác định điều kiện áp dụng voucher: gói dịch vụ + PTTT + địa chỉ lắp đặt |
| PTTT | Phương thức thanh toán |
| BR | Business Rule – quy tắc nghiệp vụ |
| AC | Acceptance Criteria – tiêu chí nghiệm thu |

---

# B. TỔNG QUAN

## I. Sơ đồ tổng quan

> https://app.diagrams.net/#G1TVg6W4BG45VYyAJE-QDz6xXrRfxuhiMv

## II. Nguyên tắc xử lý cốt lõi

Toàn bộ logic auto-apply dựa trên **1 flag duy nhất** trong Checkout model:

| Flag | Giá trị | Ý nghĩa | Hành vi khi context thay đổi |
|---|---|---|---|
| `hasManualVoucher` | `false` | Chưa có voucher, hoặc chỉ có voucher auto | CO tự detect và chạy lại auto-apply |
| `hasManualVoucher` | `true` | Có ít nhất 1 voucher manual trong checkout | FE chủ động `apply=[]` → `getlistvoucher` → apply lại. CO xử lý theo request. |

> **Lý do thiết kế:** Khi có voucher manual, FE đã có flow xử lý context change riêng (`apply=[]` → `getlistvoucher` → apply lại) theo pattern UC-04 hiện tại. CO không cần tự detect để tránh conflict với flow FE.

## III. Danh sách kịch bản (UC)

| Scenario | Tên kịch bản | `hasManualVoucher` | Actor xử lý | Mô tả |
|---|---|---|---|---|
| 1 | Lần đầu vào màn thanh toán | `false` | CO tự động | CO auto-apply voucher tốt nhất khi chưa có voucher |
| 2 | Thay đổi context, chỉ có voucher auto | `false` | CO tự động | CO tự detect, xóa voucher cũ, chạy lại auto-apply |
| 3 | Thay đổi context, có voucher auto + manual | `true` | FE chủ động + CO xử lý | FE `apply=[]` → `getlistvoucher` → apply lại [auto+manual]. CO GetEvoucherInfor + Recheck từng voucher. |
| 4 | User chủ động bỏ voucher | `true`/`false` | User + CO | CO remove voucher, không auto-apply lại |
| 5 | Thay đổi context, user đã bỏ voucher auto, chỉ còn voucher manual | `true` | FE chủ động + CO xử lý | FE `apply=[]` → `getlistvoucher` → apply lại [manual]. CO GetEvoucherInfor + Recheck voucher manual. |

---

# C. YÊU CẦU CHI TIẾT

## UC 1 — Lần đầu vào màn thanh toán (chưa có voucher)

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user vào màn thanh toán lần đầu (checkout chưa có voucher), CO tự động gọi QLCS để lấy danh sách voucher hợp lệ, tính toán và apply voucher có `DiscountVAT` cao nhất. |
| **Actor** | CO (tự động) |
| **Trigger** | Calculate Checkout được gọi, `hasManualVoucher = false`, không có voucher nào trong checkout |
| **Pre-condition** | Checkout đã tạo, có lineitem hợp lệ, context đầy đủ: gói + PTTT + địa chỉ |
| **Post-condition** | Checkout hiển thị giá đã giảm. Response trả `autoApplied = true` + thông tin voucher. Nếu không có voucher hợp lệ → giá gốc, không báo lỗi. |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | FE → CO | Gọi Calculate Checkout | CO nhận request, kiểm tra `hasManualVoucher = false`, không có voucher → trigger auto-apply |
| 2 | CO → QLCS | `GetListEvoucher` (full context: gói + PTTT + địa chỉ) | QLCS trả list voucher hợp lệ `[V1, V2, V3...]` |
| 3 | CO → QLCS | `GetEvoucherInfor` từng voucher đơn lẻ (loop) | QLCS trả `DiscountVAT` của từng voucher |
| 4 | CO | Sort theo `DiscountVAT` giảm dần → chọn voucher cao nhất | Xác định voucher tốt nhất |
| 5 | CO → QLCS | Recheck voucher tốt nhất | QLCS xác nhận còn quota/budget |
| 6a | CO | `result = 1`: Apply voucher, set `autoApplied = true`, Calculate giá mới | Giá checkout được giảm |
| 6b | CO | `result = 0/-1`: Không apply, fallback giá gốc, không báo lỗi user | |
| 7 | CO → FE | Trả response: giá mới + `autoApplied = true` (hoặc giá gốc) | FE hiển thị kết quả |

### 3. Acceptance Criteria

| AC ID | Mô tả | Given | When | Then |
|---|---|---|---|---|
| AC-01 | Auto-apply voucher có `DiscountVAT` cao nhất | Checkout chưa có voucher, `hasManualVoucher = false`, KH có ít nhất 1 voucher hợp lệ | Calculate Checkout được gọi | CO apply 1 voucher có `DiscountVAT` cao nhất, trả FE giá đã giảm + `autoApplied = true` |
| AC-02 | Không apply khi không có voucher hợp lệ | `GetListEvoucher` trả list rỗng | CO hoàn tất flow | CO không apply, checkout hiển thị giá gốc, không báo lỗi user |
| AC-03 | Không apply khi Recheck fail | Voucher được chọn nhưng Recheck trả `result = 0` hoặc `-1` | CO nhận kết quả Recheck | CO không apply, checkout hiển thị giá gốc, không báo lỗi user |
| AC-04 | Chỉ apply đúng 1 voucher | KH có nhiều voucher hợp lệ | CO hoàn tất auto-apply | CO chỉ apply 1 voucher có `DiscountVAT` cao nhất, không stack combo |

---

## UC 2 — Thay đổi context, chỉ có voucher tự động

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user thay đổi gói/PTTT/địa chỉ và checkout chỉ có voucher tự động (`hasManualVoucher = false`), CO tự detect, xóa voucher cũ và chạy lại toàn bộ auto-apply để tìm voucher tốt nhất cho context mới. |
| **Actor** | CO (tự động) |
| **Trigger** | User thay đổi gói / PTTT / địa chỉ. `hasManualVoucher = false`. |
| **Pre-condition** | Checkout đang có voucher auto. `hasManualVoucher = false`. |
| **Post-condition** | Checkout hiển thị giá giảm theo voucher tốt nhất của context mới (có thể khác voucher cũ). |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | User | Thay đổi gói / PTTT / địa chỉ | Trigger context change |
| 2 | CO | Detect context change, kiểm tra `hasManualVoucher = false` → chạy lại auto-apply | Quyết định re-apply |
| 3 | CO | Xóa voucher auto cũ | Checkout về trạng thái không có voucher |
| 4–7 | CO → QLCS | Chạy lại toàn bộ flow UC1 với context mới (`GetListEvoucher` → `GetEvoucherInfor` loop → Sort → Recheck) | Apply voucher tốt nhất cho context mới |
| 8 | CO → FE | Trả response: giá mới + `autoApplied = true` | FE hiển thị giá đã giảm mới |

### 3. Acceptance Criteria

| AC ID | Mô tả | Given | When | Then |
|---|---|---|---|---|
| AC-01 | Chạy lại auto-apply với context mới | Checkout có voucher auto, `hasManualVoucher = false` | User đổi gói / PTTT / địa chỉ | CO xóa voucher cũ, chạy lại auto-apply, apply voucher tốt nhất của context mới |
| AC-02 | Voucher mới có thể khác voucher cũ | Context mới có voucher tốt hơn voucher đang apply | CO hoàn tất re-apply | CO apply voucher mới, không giữ voucher cũ nếu không phải tốt nhất |
| AC-03 | Không có voucher phù hợp context mới | `GetListEvoucher` context mới trả rỗng hoặc Recheck fail | CO hoàn tất re-apply | CO không apply voucher, checkout hiển thị giá gốc, không báo lỗi user |

---

## UC 3 — Thay đổi context, có voucher tự động + thủ công

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user thay đổi context và checkout có cả voucher auto lẫn manual (`hasManualVoucher = true`), FE chủ động xử lý: `apply=[]` → `getlistvoucher` → apply lại [auto+manual]. CO nhận request và thực hiện `GetEvoucherInfor` + Recheck từng voucher. Voucher invalid bị remove kèm thông báo. |
| **Actor** | FE (chủ động trigger); CO (xử lý theo request) |
| **Trigger** | User thay đổi gói / PTTT / địa chỉ. `hasManualVoucher = true`. Checkout có cả voucher auto và manual. |
| **Pre-condition** | Checkout đang có ít nhất 1 voucher manual và 1 voucher auto. |
| **Post-condition** | Voucher còn valid được giữ lại. Voucher invalid bị remove. FE được thông báo nếu có voucher bị remove. CO không tự động apply voucher mới. |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | User | Thay đổi gói / PTTT / địa chỉ | Trigger context change |
| 2 | CO | Kiểm tra `hasManualVoucher = true` → không auto-apply | Chờ FE xử lý |
| 3 | FE → CO | Gọi Apply voucher `= []` (remove tất cả) | CO xóa toàn bộ voucher trong checkout |
| 4 | FE → CO | Gọi `GetListVoucher` (context mới) | CO trả list voucher hợp lệ với context mới |
| 5 | FE → CO | Gọi Apply lại voucher cũ [auto + manual] | CO nhận request apply list voucher |
| 6 | CO → QLCS | `GetEvoucherInfor` từng voucher (auto + manual) | QLCS trả True/False từng voucher |
| 7 | CO → QLCS | Recheck tất cả voucher trả True ở bước 6 | QLCS xác nhận quota/budget |
| 8a | CO | Voucher valid (True): giữ nguyên | |
| 8b | CO | Voucher invalid (False): remove + set flag thông báo FE | |
| 9 | CO → FE | Trả response: giá mới + danh sách voucher bị remove (nếu có) | FE hiển thị thông báo phù hợp |

### 3. Acceptance Criteria

| AC ID | Mô tả | Given | When | Then |
|---|---|---|---|---|
| AC-01 | CO không tự auto-apply khi `hasManualVoucher = true` | Checkout có voucher manual, user đổi context | Context thay đổi | CO không tự chạy auto-apply. Chờ FE gửi request apply lại. |
| AC-02 | Giữ voucher còn valid sau context change | FE apply lại [auto+manual], voucher vẫn hợp lệ với context mới | CO hoàn tất `GetEvoucherInfor` + Recheck | Voucher được giữ nguyên trong checkout, giá được tính với voucher đó. |
| AC-03 | Remove voucher invalid và notify FE | Voucher không còn hợp lệ với context mới (result = False) | CO nhận kết quả invalid | CO remove voucher, Calculate lại, trả FE thông báo "Voucher X không còn phù hợp với lựa chọn hiện tại". |
| AC-04 | Không auto-apply thay thế voucher bị remove | Một số voucher bị remove sau revalidate | CO hoàn tất xử lý | CO không tự động tìm và apply voucher mới để thay thế. Checkout về giá theo voucher còn lại (hoặc giá gốc nếu tất cả bị remove). |

---

## UC 4 — User chủ động bỏ voucher

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user chủ động bỏ voucher (dù là auto hay manual), CO remove voucher đó và không tự động apply lại. User phải chủ động chọn lại nếu muốn dùng voucher. |
| **Actor** | User; CO |
| **Trigger** | User bấm bỏ/xóa voucher đang áp dụng → FE gọi Apply voucher = rỗng (UC-05) |
| **Pre-condition** | Checkout đang có ít nhất 1 voucher được apply. |
| **Post-condition** | Voucher bị remove. Checkout tính lại giá. CO không auto-apply lại. `hasManualVoucher` cập nhật theo số voucher manual còn lại. |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | User | Bấm bỏ voucher | FE trigger UC-05 Cancel EVC |
| 2 | FE → CO | Gọi Apply voucher = rỗng | CO nhận request remove |
| 3 | CO | Remove voucher. Nếu là voucher manual cuối cùng → `hasManualVoucher = false` | Checkout không còn voucher đó |
| 4 | CO | Không auto-apply lại dù `hasManualVoucher = false` | Checkout về giá gốc (hoặc giá theo voucher còn lại) |
| 5 | CO → FE | Trả response giá mới | FE hiển thị giá mới |

### 3. Acceptance Criteria

| AC ID | Mô tả | Given | When | Then |
|---|---|---|---|---|
| AC-01 | Remove và không auto-apply lại | Checkout có voucher auto, không có voucher manual | User bỏ voucher auto | CO remove voucher. Dù `hasManualVoucher = false`, CO không auto-apply lại. |
| AC-02 | User bỏ voucher manual, voucher auto vẫn giữ | Checkout có cả voucher manual và auto | User bỏ voucher manual | CO chỉ remove voucher manual. Voucher auto vẫn giữ nguyên. `hasManualVoucher` cập nhật theo số voucher manual còn lại. |
| AC-03 | User bỏ xong rồi đổi context | User vừa bỏ voucher, `hasManualVoucher = false`, sau đó đổi gói/PTTT/địa chỉ | CO nhận context change | CO **KHÔNG** auto-apply (user đã chủ động bỏ = quyết định không dùng voucher). Checkout giữ giá gốc. |

---

## UC 5 — Thay đổi context, user đã bỏ voucher auto, chỉ còn voucher thủ công

### 1. Thông tin chung

| Thuộc tính | Nội dung |
|---|---|
| **Description** | Khi user thay đổi context sau khi đã bỏ voucher auto, checkout chỉ còn voucher manual (`hasManualVoucher = true`). FE chủ động xử lý `apply=[]` → `getlistvoucher` → apply lại [manual]. CO `GetEvoucherInfor` + Recheck voucher manual. Không auto-apply thêm. |
| **Actor** | FE (chủ động trigger); CO (xử lý theo request) |
| **Trigger** | User thay đổi gói / PTTT / địa chỉ. `hasManualVoucher = true`. Checkout chỉ có voucher manual (voucher auto đã bị user bỏ trước đó). |
| **Pre-condition** | Checkout có ít nhất 1 voucher manual. Không có voucher auto (user đã bỏ). |
| **Post-condition** | Voucher manual còn valid được giữ. Voucher manual invalid bị remove kèm thông báo. Không có voucher auto mới được apply. |

### 2. Workflow

| Bước | Actor | Hành động | Kết quả |
|---|---|---|---|
| 1 | User | Thay đổi gói / PTTT / địa chỉ | Trigger context change |
| 2 | CO | Kiểm tra `hasManualVoucher = true` → không auto-apply | Chờ FE xử lý |
| 3 | FE → CO | Gọi Apply voucher `= []` (remove tất cả) | CO xóa toàn bộ voucher |
| 4 | FE → CO | Gọi `GetListVoucher` (context mới) | CO trả list voucher hợp lệ với context mới |
| 5 | FE → CO | Gọi Apply lại chỉ voucher manual cũ | CO nhận request apply voucher manual |
| 6 | CO → QLCS | `GetEvoucherInfor` voucher manual | QLCS trả True/False |
| 7 | CO → QLCS | Recheck voucher manual (nếu True) | QLCS xác nhận quota/budget |
| 8a | CO | Voucher valid: giữ nguyên | |
| 8b | CO | Voucher invalid: remove + thông báo FE | |
| 9 | CO → FE | Trả response: giá mới + thông báo nếu có remove | FE hiển thị kết quả |

### 3. Acceptance Criteria

| AC ID | Mô tả | Given | When | Then |
|---|---|---|---|---|
| AC-01 | Chỉ revalidate voucher manual, không auto-apply | Checkout chỉ có voucher manual, `hasManualVoucher = true`, user đổi context | FE apply lại chỉ voucher manual | CO `GetEvoucherInfor` + Recheck voucher manual. Không apply voucher auto mới. |
| AC-02 | Giữ voucher manual còn valid | Voucher manual vẫn hợp lệ với context mới | CO hoàn tất revalidate | Voucher manual được giữ nguyên, giá được tính với voucher đó. |
| AC-03 | Remove voucher manual invalid và notify | Voucher manual không còn hợp lệ với context mới | CO nhận kết quả invalid | CO remove voucher manual, Calculate lại giá gốc, trả FE thông báo phù hợp. |

---

*FPT Telecom — Bảo mật nội bộ*
