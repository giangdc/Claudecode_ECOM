import { runCkcommonSuite } from '../common/ckcommon.shared';
import { checkoutData, productUrl, registerUrl } from '../../../test-data/checkout/checkout.data';

const CAMERA = checkoutData.services.camera;

runCkcommonSuite({
  serviceLabel: 'Camera',
  registerUrl:  registerUrl(CAMERA.slug),
  productUrl:   productUrl(CAMERA.slug),
});
