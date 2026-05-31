import { chromium } from 'playwright';

const PRODUCT_URL = 'https://staging.tongdaiwifi.vn/dich-vu-so/goi-hyperfast-2';

async function recon() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('=== STEP 1: Product detail page ===');
  await page.goto(PRODUCT_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.screenshot({ path: 'recon_step1_product.png', fullPage: false });

  const productElements = await page.evaluate(() => {
    const els = document.querySelectorAll('button, a, select, input, [role], h1, h2, h3');
    return Array.from(els).map(el => ({
      tag: el.tagName,
      id: el.id || null,
      name: el.getAttribute('name') || null,
      testid: el.getAttribute('data-testid') || null,
      ariaLabel: el.getAttribute('aria-label') || null,
      role: el.getAttribute('role') || null,
      placeholder: el.getAttribute('placeholder') || null,
      className: el.className?.substring(0, 80) || null,
      text: el.innerText?.trim()?.substring(0, 60) || null,
      type: el.getAttribute('type') || null,
    })).filter(e => e.text || e.ariaLabel || e.placeholder || e.id);
  });

  console.log('Product page elements:');
  productElements.forEach(e => console.log(JSON.stringify(e)));

  // Click "Mua ngay" button
  console.log('\n=== STEP 2: Click Mua ngay ===');
  const muaNgayBtn = page.getByRole('button', { name: /mua ngay/i })
    .or(page.locator('button:has-text("Mua ngay")'))
    .or(page.locator('a:has-text("Mua ngay")'));

  const btnCount = await muaNgayBtn.count();
  console.log('Mua ngay buttons found:', btnCount);

  if (btnCount > 0) {
    await muaNgayBtn.first().click();
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(2000);
    console.log('After click URL:', page.url());
    await page.screenshot({ path: 'recon_step2_after_click.png', fullPage: false });

    console.log('\n=== STEP 3: Checkout page elements ===');
    const checkoutElements = await page.evaluate(() => {
      const els = document.querySelectorAll(
        'button, input, select, textarea, label, [role="radio"], [role="button"], h1, h2, h3, h4, p, span, div[class*="block"], div[class*="Block"], div[class*="payment"], div[class*="checkout"]'
      );
      return Array.from(els).map(el => ({
        tag: el.tagName,
        id: el.id || null,
        name: el.getAttribute('name') || null,
        testid: el.getAttribute('data-testid') || null,
        ariaLabel: el.getAttribute('aria-label') || null,
        role: el.getAttribute('role') || null,
        placeholder: el.getAttribute('placeholder') || null,
        className: el.className?.substring(0, 100) || null,
        text: el.innerText?.trim()?.substring(0, 80) || null,
        type: el.getAttribute('type') || null,
        disabled: el.disabled || null,
        href: el.getAttribute('href') || null,
      })).filter(e => (e.text || e.ariaLabel || e.placeholder || e.id) &&
        !['SCRIPT','STYLE','META','LINK'].includes(e.tag));
    });

    console.log('\nCheckout page elements:');
    checkoutElements.forEach(e => console.log(JSON.stringify(e)));

    await page.screenshot({ path: 'recon_step3_checkout_full.png', fullPage: true });
  } else {
    console.log('ERROR: Mua ngay button not found. Trying all buttons:');
    const allBtns = await page.evaluate(() =>
      Array.from(document.querySelectorAll('button, a[href]')).map(el => ({
        tag: el.tagName, text: el.innerText?.trim()?.substring(0, 60),
        href: el.getAttribute('href'), className: el.className?.substring(0, 60)
      }))
    );
    allBtns.forEach(b => console.log(JSON.stringify(b)));
  }

  await browser.close();
}

recon().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
