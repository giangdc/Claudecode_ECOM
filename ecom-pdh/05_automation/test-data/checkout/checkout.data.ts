/**
 * Test data cho luồng Checkout thiết bị (AP / Smart TV / Camera).
 * Nguồn: ecom-pdh/04_test-data/Checkout_datatest.xlsx
 */
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
    atm: {
      cardNumber:  '9704 0000 0000 0018',
      cardName:    'Nguyen van A',
      expiryDate:  '03/2026',
    },
    international: {
      cardNumber:  '4000000000001091',
      cardName:    'Nguyen van A',
      expiryDate:  '12/2026',
      cvv:         '111',
      otp:         '1234',
    },
  },
} as const;
