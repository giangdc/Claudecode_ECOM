import { runCkcommonSuite } from '../common/ckcommon.shared';

const SLUG = process.env.SMARTTV_PRODUCT_SLUG || 'tv-samsung-qa55q60bakxxv';

runCkcommonSuite({
  serviceLabel: 'SmartTV',
  registerUrl:  process.env.SMARTTV_REGISTER_URL || `https://staging.fpt.vn/checkout/register/${SLUG}?salechannelcode=tongdaiwifi&url=http://staging.tongdaiwifi.vn`,
  productUrl:   process.env.SMARTTV_PRODUCT_URL  || `https://staging.tongdaiwifi.vn/thiet-bi-thong-minh/${SLUG}`,
});
