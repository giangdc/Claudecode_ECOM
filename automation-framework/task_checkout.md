# Automation Generation Progress — Checkout (CKCOMMON + INTERNET)

> Nguồn TC: `ecom-pdh/03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx`
> 2 sheet: Checkout_Common (TC_CKCOMMON, 78 TC) + Checkout_Internet (TC_INTERNET, 18 TC). Auto=Y: 83 TC.
> Scope (user 2026-06-01): **toàn bộ 83 TC Auto=Y**. Nhóm phụ thuộc data/3rd-party → skeleton + skip/TODO nếu thiếu data.

## Checklist 6 bước
- [x] Bước 1: Phân tích TC + nạp skill + xác định scope
- [x] Bước 2: MCP UI Recon — DONE. Entry: gói goi-giga → `staging.fpt.vn/checkout/register/goi-giga?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn` → session `/checkout/{id}/register` (B1) → `/payment` (B2)
- [x] Bước 3: Thiết kế POM (slug `internet`) — 3 page objects
- [x] Bước 4: Test data (hằng số hợp lệ + maxlength verify)
- [x] Bước 5: Sinh automation scripts — 37 test
- [x] Bước 6: Chạy test + Auto-heal (3 vòng) → **37/37 PASS** (2 lần liên tiếp stable)

## Tái dùng từ UltraFast (đã verify)
- `src/pages/common/base.page.ts`
- `src/pages/ultrafast/checkout-ultrafast.page.ts` — phone `input[name="phone"]`, email `input[name="email"]`, PTTT `#payment-method-{CODE}`, submit `button[type=submit]` filter text, nav (logo/quay lại/terms), section collapse `getByRole('button',{name:'Thông tin ...'})`. → Phần SĐT/Email/PTTT/nav DÙNG LẠI; cần recon thêm Block Địa chỉ lắp đặt + popup địa chỉ cũ + tiến trình 3 bước.

## Mapping slug (mới)
| Module 03 | Slug automation | Ghi chú |
|---|---|---|
| chucnang_checkout (CKCOMMON) | `checkout` | màn checkout chung có địa chỉ — page đẩy lên `common/` nếu Internet+UltraFast cùng dùng |
| chucnang_checkout (INTERNET) | `internet` | luồng 3 bước |

## Phân loại TC theo khả năng auto ổn định
| Nhóm | TC | Auto ngay | Cần data backend | 3rd-party / external |
|---|---|---|---|---|
| Hiển thị/UI/visual | .1 .5 .78 / INT .1 .3 .18 | — | — | N (visual) |
| Validate field | CKCOMMON .8–.40 | ✅ | địa chỉ có chính sách (để qua bước) | — |
| Dropdown địa chỉ + popup cũ | .23–.46 | ✅ | data ĐCHC | — |
| PTTT block | .50–.54 | ✅ | gói ≤4 & >4 PTTT, CTKM | — |
| Mã ưu đãi | .57–.60 | phần UI ✅ | voucher hợp lệ (.59) | — |
| Luồng TT COD | .62 / INT .15 | ✅ | — | — |
| Luồng TT Online redirect | .63 | ✅ (check redirect) | — | hoàn tất cần 3rd-party |
| 3rd-party hủy/thất bại/countdown | .66 .67 .68 / INT .16 .17 | — | — | N |
| Chính sách hết hiệu lực | .69 | ✅ | gói có CS expired | — |
| Đối soát webadmin/inside | .34 .74 | — | — | N (tool ngoài) |
| Internet 3 bước | INT .2 .4–.14 | ✅ | gói trả trước & trả sau | — |
| BLOCKED (chờ BA) | .33 .76 .77 | skeleton + skip | — | — |

## Data cần user cung cấp (cho nhóm phụ thuộc backend)
1. **URL gói Internet** (detail hoặc checkout/register) — bắt buộc để recon.
2. Địa chỉ **có chính sách** (Tỉnh/Phường-Xã/Tên đường) để qua được bước thanh toán.
3. Địa chỉ **không có chính sách** (cho .33 popup).
4. Gói cấu hình **≤4 PTTT** và **>4 PTTT** (cho .51/.52).
5. **Voucher hợp lệ** cho gói (cho .59).
6. Gói có **chính sách hết hiệu lực** (cho .69).
7. Gói Internet **trả trước** và **trả sau** (cho INT .9/.10).
8. (SC .29 pre-fill) account có địa chỉ lưu sẵn — hoặc xác nhận bỏ qua.

## Locator Collection (Verified từ DOM thực tế — gói goi-giga)
| Page | Element | Locator | Verified |
|---|---|---|---|
| B1 Register | Họ tên | `input[name="full_name"]` (max 100, placeholder "Nhập họ tên") | ✅ |
| B1 Register | Số điện thoại | `input[name="phone"]` (max 10) — giống UltraFast | ✅ |
| B1 Register | Số nhà | `input[name="detailAddress"]` (max **50**, placeholder "Nhập Số nhà") | ✅ |
| B1 Register | Ghi chú | `textarea[name="note"]` (max 100, placeholder "Gọi cho tôi trước 30 phút nhé!") | ✅ |
| B1 Register | Tỉnh/TP trigger | `getByRole('button',{name:'Chọn tỉnh thành phố'})` → sau chọn đổi tên = giá trị | ✅ |
| B1 Register | Phường/Xã trigger | `getByRole('button',{name:'Chọn phường/xã'})` (hiện sau khi chọn Tỉnh) | ✅ |
| B1 Register | Tên đường trigger | `getByRole('button',{name:'Chọn tên đường'})` (hiện sau khi chọn P/X) | ✅ |
| B1 Register | Dropdown địa chỉ | `[role=dialog]` chứa `textbox "Nhập thông tin"` + `<p>` options (HCM/HN/ĐN đầu) | ✅ |
| B1 Register | Link địa chỉ cũ | `getByText('Địa chỉ trước sáp nhập')` | ✅ |
| B1 Register | Tiếp tục | `button[type=submit]` text "Tiếp tục" → **`.first()` là bản visible** (khác UltraFast) | ✅ |
| B1 Register | Logo | `a[href*="tongdaiwifi"] img[alt="logo"]` | ✅ |
| Popup địa chỉ cũ | Dialog | `getByRole('dialog',{name:'Địa chỉ hành chính cũ'})` | ✅ |
| Popup địa chỉ cũ | 4 dropdown | buttons "Chọn tỉnh thành phố/quận-huyện/phường-xã/tên đường" | ✅ |
| Popup địa chỉ cũ | Xác nhận / Close | `getByRole('button',{name:'Xác nhận'})` [disabled mặc định] / `{name:'Close'}` | ✅ |
| B2 Payment | Sản phẩm trả sau/trước | radiogroup; radio `#package-{id}-{2=sau\|1=trước}-{tháng}`; locate `getByRole('radio',{name:/N tháng/})` | ✅ |
| B2 Payment | PTTT | `#payment-method-DOMESTIC-Online` (ATM,default) / `-COD-COD` / `-MOMO-Online` / `-VIETQR-Online` + "Xem thêm" — giống UltraFast | ✅ |
| B2 Payment | Quay lại | `getByText('Quay lại',{exact:true})` (div) | ✅ |
| B2 Payment | Thanh toán | `getByRole('button',{name:'Thanh toán',exact:true})` | ✅ |
| B2 Payment | Điều khoản | `a[href*="privacy-policy"]` (`/internet`) | ✅ |
| B2 Payment | Thông tin lắp đặt | text Họ tên/SĐT/Địa chỉ load từ B1 | ✅ |

## Recon findings quan trọng
- Internet **KHÔNG có radio Nhà riêng/Chung cư** (Số nhà luôn hiện sau khi chọn Tỉnh) → SC-CKCOMMON.37 N/A cho Internet; Chung cư confirmed deferred.
- Internet **KHÔNG có ô mã ưu đãi/voucher** ở B2 → SC-CKCOMMON.55–.60 (voucher) N/A cho Internet (đặc thù thiết bị/Camera).
- Internet **KHÔNG có Email** ở B1 → SC-CKCOMMON.19–.22 N/A cho Internet.
- Trả sau = Gói Giga 1 tháng (cước hàng tháng 235.000đ) checked default; B2 "Cần thanh toán" = **Phí lắp đặt 299.000đ** (đúng SC-INTERNET.9). Trả trước = 3/6/13 tháng.
- COD ("Thanh toán khi triển khai") **CÓ** trong Internet (khác UltraFast) → đúng SC-INTERNET.13.

## Auto-heal log (Rule E3)
- Vòng 1: 14/37 PASS. Bug: dropdown địa chỉ strict-mode (2 popover dialog cùng chứa "Nhập thông tin") → scope `[data-state="open"]`. + nhiều flaky do staging throttle.
- Vòng 2: 31/37 PASS (retries=1). Fix 6 lỗi thật: link "Đăng ký ngay" 0-size, SĐT field cho nhập chữ, ward trigger aria-label cố định, "Phí lắp đặt"/"Cần thanh toán" strict-mode, radio "3 tháng" khớp "13 tháng", terms link ẩn.
- Vòng 3: 37/37 PASS. Confirm chạy lại full suite **37/37 stable**.

## Kết quả — 37 test PASS (gói goi-giga)
| TC ID | Title | Status |
|---|---|---|
| TC_INTERNET.2/.4/.5/.6 | Điều hướng + B1 hiển thị/validate | ✅ |
| TC_INTERNET.7/.9/.10/.12/.13 | B2: lắp đặt load, trả sau/trước, Quay lại giữ data, PTTT đủ Online+COD | ✅ |
| TC_INTERNET.15 (=CK.62) | COD → màn Hoàn tất | ✅ |
| TC_CKCOMMON.8/.9/.11/.12 | Họ tên valid/required/max100/clear | ✅ |
| TC_CKCOMMON.13–.18 | SĐT valid/required/ký tự/đầu khác 0/max10/clear | ✅ |
| TC_CKCOMMON.23/.25/.26/.27 | Tỉnh placeholder/load HCM-HN-ĐN/search/cascade | ✅ |
| TC_CKCOMMON.31/.38/.39/.40 | Phường/Xã chọn, Số nhà required/max50, Ghi chú max100 | ✅ |
| TC_CKCOMMON.41/.43/.45 | Popup địa chỉ cũ: UI/Xác nhận disabled/Close | ✅ |
| TC_CKCOMMON.50/.52/.54/.63 | PTTT UI/>4 Xem thêm/chỉ chọn 1/Online redirect | ✅ |
| TC_CKCOMMON.2/.55 | Logo, điều khoản | ✅ |

## TC Auto=Y CHƯA tự động hóa (lý do)
| TC | Lý do |
|---|---|
| CK.19–.22 (Email) | **N/A trên Internet** — màn Internet không có trường Email (chỉ Hyperfast/UF) |
| CK.55–.60 (Mã ưu đãi/voucher) | **N/A trên Internet** — B2 Internet không có ô voucher (đặc thù thiết bị/Camera) |
| CK.37 (radio Nhà riêng) | **N/A trên Internet** — không có radio Nhà riêng/Chung cư |
| CK.28/.30/.32/.35/.36/.42/.44/.46/.47/.48/.49/.51/.53 | Cần data backend / hành vi cần verify thêm (giá đổi theo địa chỉ, ≤4 PTTT config, CTKM order, popup convert đẩy địa chỉ) — có POM sẵn, bổ sung sau khi có data |
| CK.69, INT.8/.11/.14 | Cần data: gói chính sách hết hạn, địa chỉ nhiều mức giá, gói trả trước riêng |
| CK.64/.65/.70–.73, INT (hoàn tất) | Cần hoàn tất đơn hàng thật / session 20p — tránh tạo nhiều đơn rác staging |
| CK.34/.66/.67/.68/.74, INT.16/.17 | **Auto=N** — 3rd-party (Momo/VietQR), verify web-admin/inside |
| CK.33/.76/.77 | **BLOCKED** — chờ BA (nội dung popup, empty/error state) |
| CK.1/.5/.78, INT.1/.3/.18 | **Auto=N** — visual/màu sắc/mobile responsive |

## Files tạo ra
- `src/pages/internet/internet-product.page.ts`
- `src/pages/internet/checkout-register.page.ts` (B1 + popup địa chỉ cũ)
- `src/pages/internet/checkout-payment.page.ts` (B2)
- `src/tests/internet/internet-checkout.spec.ts` (37 test)
- `test-results/internet-checkout-report.json` (cho sync-tc-results)
