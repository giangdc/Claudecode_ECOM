import { runCkcommonSuite } from '../common/ckcommon.shared';
import { checkoutData, productUrl, registerUrl } from '../../../test-data/checkout/checkout.data';

const SMARTTV = checkoutData.services.smarttv;

runCkcommonSuite({
  serviceLabel: 'SmartTV',
  registerUrl:  registerUrl(SMARTTV.slug),
  productUrl:   productUrl(SMARTTV.slug),
});
