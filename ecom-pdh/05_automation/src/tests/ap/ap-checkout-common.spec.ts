import { runCkcommonSuite } from '../common/ckcommon.shared';

const SLUG = process.env.AP_PRODUCT_SLUG || 'access-point-ax1800az';

runCkcommonSuite({
  serviceLabel: 'AP',
  registerUrl:  process.env.AP_REGISTER_URL || `https://staging.fpt.vn/checkout/register/${SLUG}?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn`,
  productUrl:   process.env.AP_PRODUCT_URL  || `https://staging.tongdaiwifi.vn/thiet-bi-thong-minh/${SLUG}`,
});
