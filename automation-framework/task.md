# Automation Generation Progress — Đăng ký UltraFast

## Checklist
- [x] Bước 1: Phân tích TC (20 TCs Auto=Y từ functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_dangkyUF_v1.0.xlsx — tách từ TC_v1.0.xlsx cũ)
- [x] Bước 2: UI Recon — staging.tongdaiwifi.vn + staging.fpt.vn/checkout
- [x] Bước 3: Thiết kế POM
- [x] Bước 4: Test data
- [x] Bước 5: Sinh automation scripts
- [x] Bước 6: Chạy test + Auto-heal (5 vòng, 19/20 stable)

## Locator Collection (Verified từ DOM thực tế)

| Page | Element | Locator | Verified |
|---|---|---|---|
| ProductDetailPage | Cycle "1 tháng" | `getByRole('button', {name: '1 tháng'})` | ✅ |
| ProductDetailPage | Cycle "3 tháng" | `getByRole('button', {name: '3 tháng'})` | ✅ |
| ProductDetailPage | Mua ngay btn | `getByRole('button', {name: 'Mua ngay'})` | ✅ |
| ProductDetailPage | Register link | `locator('a[href*="checkout/register"]').first()` | ✅ |
| CheckoutPage | Phone input | `locator('input[name="phone"]')` | ✅ |
| CheckoutPage | Email input | `locator('input[name="email"]')` | ✅ |
| CheckoutPage | Clear phone btn | `getByRole('button', {name: 'Clear'}).first()` | ✅ |
| CheckoutPage | PTTT ATM | `locator('#payment-method-DOMESTIC-Online')` | ✅ |
| CheckoutPage | PTTT COD | `locator('#payment-method-COD-COD')` | ✅ |
| CheckoutPage | PTTT Momo | `locator('#payment-method-MOMO-Online')` | ✅ |
| CheckoutPage | PTTT VietQR | `locator('#payment-method-VIETQR-Online')` | ✅ |
| CheckoutPage | Submit/Tiếp tục | `locator('button[type="submit"]').filter({hasText:'Tiếp tục'})` | ✅ |
| CheckoutPage | Thanh toán btn | `locator('button[type="submit"]').filter({hasText:'Thanh toán'})` | ✅ |
| CheckoutPage | Back / Quay lại | `getByRole('link', {name: 'Quay lại'})` | ✅ |
| CheckoutPage | Terms link | `locator('a[href*="privacy-policy"]').first()` | ✅ |
| CheckoutPage | FPT Logo link | `locator('a:has(img[alt="logo"])')` | ✅ |
| CheckoutPage | Cookie accept | `getByRole('button', {name: 'Đồng ý'})` | ✅ |
| CheckoutPage | Product name | `getByText('gói hyperfast 2', {exact: false})` | ✅ |
| CheckoutPage | Cycle label | `getByText(/Chu kỳ:/)` | ✅ |
| CheckoutPage | Total amount | `locator('.text-\\[32px\\]')` | ✅ |

## Notes
- Checkout URL: `https://staging.fpt.vn/checkout/register/{slug}?salechannelcode=tongdaiwifi&url=...&month={N}`
- Session redirect: register URL → `staging.fpt.vn/checkout/{sessionId}/payment`
- COD hiển thị trong DOM thực tế (dù spec nói không có) → TC_DANGKYUF.12 sẽ verify COD absent
- "Tiếp tục" button cần scrollIntoViewIfNeeded trước khi click

## Kết quả cuối

| TC ID | Title | Status | Ghi chú |
|---|---|---|---|
| TC_DANGKYUF.2 | Navigate sang checkout | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.3 | Load đúng chu kỳ + tiền | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.4 | Block sản phẩm hiển thị | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.5 | SĐT hợp lệ | ✅ PASS 2/2 stable | pressSequentially fix |
| TC_DANGKYUF.6 | SĐT trống → error | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.7 | SĐT < 10 số | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.8 | SĐT bắt đầu 1 | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.9 | Max 10 ký tự | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.10 | Icon X xóa | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.11 | PTTT load đúng | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.12 | No COD | ❌ FAIL — DEFECT | COD hiển thị trong staging, spec nói không có |
| TC_DANGKYUF.13 | N PTTT theo QLCS | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.14 | TTKH có data | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.15 | TTKH rỗng | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.16 | Cần TT = tổng tiền | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.17 | Block khi thiếu required | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.19 | Redirect 3rd party | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.23 | Quay lại | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.24 | Logo FPT | ✅ PASS 2/2 stable | |
| TC_DANGKYUF.25 | Terms link | ✅ PASS 2/2 stable | |

## Defect phát hiện
**BUG-DANGKYUF-001:** Option "Thanh toán khi triển khai" (COD) hiển thị trong Block PTTT của checkout gói HyperFast 2.
- **Expected (theo spec):** Không có COD, chỉ có PTTT Online
- **Actual (staging):** COD (`#payment-method-COD-COD`) visible = true
- **Ảnh hưởng:** User UltraFast có thể chọn COD, khác với spec định nghĩa

## Files tạo ra
- `src/pages/product-detail.page.ts`
- `src/pages/checkout-ultrafast.page.ts`
- `src/tests/ultrafast/ultrafast-checkout.spec.ts`
