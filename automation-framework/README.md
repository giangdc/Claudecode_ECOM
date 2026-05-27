# Automation Framework — ecom-pdh

Playwright + TypeScript automation framework cho dự án ISC/ECP ecom-pdh.

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x

## Cài đặt

```bash
npm install
npx playwright install chromium
```

## Cấu hình môi trường

```bash
cp .env.example .env
```

Điền giá trị thực vào `.env`:

```
BASE_URL=https://your-app-url.com
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=your_admin_password
```

## Chạy test

```bash
# Chạy tất cả test (headless)
npm test

# Chạy có hiển thị browser (debug)
npm run test:headed

# Mở Playwright UI mode
npm run test:ui

# Chạy debug step-by-step
npm run test:debug

# Chạy 1 file cụ thể
npx playwright test src/tests/auth/login.spec.ts

# Chạy theo tên test
npx playwright test -g "Check đăng nhập thành công"
```

## Xem report

```bash
# HTML Report (Playwright built-in)
npm run test:report

# Allure Report
npm run allure:generate
npm run allure:open
```

## Cấu trúc project

```
automation-framework/
├── playwright.config.ts        # Cấu hình Playwright
├── package.json
├── tsconfig.json
├── .env.example                # Template biến môi trường
├── src/
│   ├── pages/                  # Page Object classes
│   │   ├── base.page.ts        # Base class chứa common methods
│   │   ├── login.page.ts
│   │   └── dashboard.page.ts
│   ├── fixtures/               # Custom fixtures
│   │   ├── base.fixture.ts     # Page fixtures
│   │   └── auth.fixture.ts     # Auth helper fixture
│   ├── utils/                  # Tiện ích
│   │   ├── env.config.ts       # Đọc biến môi trường
│   │   ├── test-data.ts        # Sinh dữ liệu test động
│   │   └── helpers.ts          # Helper functions
│   └── tests/                  # Test specs
│       ├── auth/
│       │   └── login.spec.ts
│       └── dashboard/
│           └── dashboard.spec.ts
└── test-data/
    └── users.json              # Dữ liệu test tĩnh (data-driven)
```

## Conventions

- **Locators**: `getByRole` > `getByLabel` > `getByTestId` > CSS (không dùng XPath vị trí)
- **Waits**: `expect()` assertions tự động — không dùng `waitForTimeout()`
- **Test data**: sinh động qua `TestDataGenerator` cho email/username unique
- **Viewport**: 1920x1080 (mặc định trong playwright.config.ts)
- **Headed mode**: dùng khi debug; headless cho CI

## Thêm Page Object mới

1. Tạo file `src/pages/<name>.page.ts` extends `BasePage`
2. Khai báo locators ở đầu class
3. Export class và import vào fixture nếu cần
4. Viết test trong `src/tests/<module>/<name>.spec.ts`
