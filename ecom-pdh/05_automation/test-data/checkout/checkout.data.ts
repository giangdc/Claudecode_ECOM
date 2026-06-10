/**
 * Test data cho luồng Checkout thiết bị (AP / Smart TV / Camera).
 * Nguồn: ecom-pdh/04_test-data/Checkout_datatest.xlsx
 *
 * NGUỒN SỰ THẬT DUY NHẤT cho data checkout — đổi bộ data chỉ sửa file này (không sửa .env).
 * .env chỉ giữ cấu hình môi trường thật: BASE_URL + credentials.
 */

// Host cố định của storefront (trang SP) và cổng checkout. Đổi domain staging/prod ở đây.
const STOREFRONT_HOST = 'https://staging.tongdaiwifi.vn';
const CHECKOUT_HOST   = 'https://staging.fpt.vn';

/** URL trang chi tiết sản phẩm trên storefront, build từ slug. */
export function productUrl(slug: string): string {
  return `${STOREFRONT_HOST}/thiet-bi-thong-minh/${slug}`;
}

/** URL /checkout/register/{slug} (redirect thẳng /payment), build từ slug. */
export function registerUrl(slug: string): string {
  return `${CHECKOUT_HOST}/checkout/register/${slug}?salechannelcode=tongdaiwifi&url=${STOREFRONT_HOST.replace('https://', 'http://')}`;
}

export const checkoutData = {
  validName:  'Nguyen Van Auto',
  validPhone: '0964633310',

  /** Địa chỉ hành chính cũ (4 cấp) dùng để test popup ĐCHC. */
  oldAddress: {
    province:         'Tây Ninh - Long An',
    provinceKeyword:  'Tây Ninh',
    district:         'Huyện Đức Hòa',
    districtKeyword:  'Đức Hòa',
    ward:             'Thị trấn Hiệp Hòa',
    wardKeyword:      'Hiệp Hòa',
    area:             'Khu vực 3',
    /** Giá trị xuất hiện trong dropdown Province (form chính) sau khi xác nhận ĐCHC cũ. */
    expectedProvince: 'Tây Ninh',
    /** Giá trị xuất hiện trong dropdown Ward (2 cấp mới) sau khi xác nhận. */
    expectedWardNew:  'Xã Hiệp Hòa',
  },

  payment: {
    // Thẻ nội địa NAPAS sandbox — dùng cho PTTT "Thanh toán online" (DOMESTIC-Online) qua cổng FoxPay.
    atm: {
      cardNumber: '9704000000000018',
      cardName:   'NGUYEN VAN A',
      // ⚠️ Ngày hiệu lực CHUẨN của thẻ test NAPAS = 03/07 (MM/YY). KHÔNG phải '03/2026':
      // file 04_test-data ghi "2026-03-07" do Excel tự convert "03/07" thành ngày → cổng báo
      // "Sai thông tin ngày hết hạn thẻ", và đây là lý do case online trước đây không chạy được.
      issueDate:  '03/07',
      // OTP magic của NAPAS sandbox (nhập đúng chuỗi "otp" để xác thực thành công).
      otp:        'otp',
    },
    international: {
      cardNumber:  '4000000000001091',
      cardName:    'NGUYEN VAN A',
      expiryDate:  '12/26',
      cvv:         '111',
      otp:         '1234',
    },
  },

  /**
   * Tham số sản phẩm từng dịch vụ — đổi bộ data test thì chỉ sửa khối này.
   * slug → productUrl()/registerUrl() tự sinh URL. productName dùng cho assert block SP trên checkout.
   */
  services: {
    ap: {
      slug:        'access-point-ax1800az',
      productName: 'Access Point AX1800AZ Gb',
      price:       '1.100.000đ',
    },
    smarttv: {
      slug:        'tv-samsung-ua75bu8000kxxvtest',
      // Khớp duy nhất tiêu đề SP trên block checkout (tránh strict-mode trùng với dòng "- 1 cái").
      productName: 'UA75BU8000KXXV_Test',
      price:       '4.500.000đ',
    },
    camera: {
      slug:           'camera-play-4',
      productName:    'Camera Play 4',
      defaultPackage: '3D FPT Camera Only',
      defaultCycle:   '6 tháng',
      // Giá combo (device + gói lưu trữ) trên block SP; total = thêm phí lắp đặt 165.000đ.
      comboPrice:     '640.000đ',
      totalPrice:     '805.000đ',
    },
  },
} as const;
