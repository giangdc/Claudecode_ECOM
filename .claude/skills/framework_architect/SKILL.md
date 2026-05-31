---
name: Framework Architect
description: Skill thiết kế và scaffold automation framework hoàn chỉnh cho Playwright, Selenium, và Appium — bao gồm project structure, base classes, config management, reporting, và CI/CD integration.
---

# Framework Architect

## Description

Skill chuyên biệt giúp agent thiết kế, scaffold và triển khai automation framework từ đầu. Hỗ trợ đa nền tảng (Web, Mobile, API) với các framework phổ biến nhất.

Agent có thể:

- Thiết kế project structure theo best practices
- Sinh base classes, config management, driver/browser management
- Tích hợp reporting (Allure, HTML Report, Playwright Report)
- Cấu hình CI/CD pipeline (GitHub Actions, GitLab CI, Jenkins)
- Sinh template Page Object Model, fixtures, helpers
- Tạo file cấu hình (package.json, pom.xml, build.gradle, playwright.config.ts)

---

## When to Use

Sử dụng skill này khi:

- User yêu cầu tạo/thiết kế automation framework mới
- User cần scaffold project structure cho test automation
- User muốn chuẩn hóa framework hiện tại
- User cần tích hợp reporting hoặc CI/CD vào framework
- User hỏi về best practices cho framework design

Trigger keywords: "create framework", "design framework", "scaffold project", "thiết kế framework", "tạo project mới"

---

## Supported Stacks

### 🌐 Web Automation

| Stack | Ngôn ngữ | Runner | Report | Build Tool |
|---|---|---|---|---|
| **Playwright + TypeScript** | TypeScript | Playwright Test | HTML Report, Allure | npm |
| **Playwright + Java** | Java | TestNG / JUnit5 | Allure Report | Maven / Gradle |
| **Playwright + Python** | Python | Pytest | Allure, pytest-html | pip |
| **Selenium + Java** | Java | TestNG | Allure, ExtentReports | Maven / Gradle |
| **Selenium + Python** | Python | Pytest | Allure, pytest-html | pip |

### 📱 Mobile Automation

| Stack | Ngôn ngữ | Runner | Report | Build Tool |
|---|---|---|---|---|
| **Appium + Java** | Java | TestNG | Allure, ExtentReports | Maven / Gradle |
| **Appium + Python** | Python | Pytest | Allure, pytest-html | pip |

### 🔌 API Automation

| Stack | Ngôn ngữ | Runner | Report |
|---|---|---|---|
| **REST Assured** | Java | TestNG | Allure |
| **Playwright API** | TypeScript | Playwright Test | HTML Report |
| **Requests + Pytest** | Python | Pytest | Allure |

---

## Framework Components

Mỗi framework PHẢI bao gồm các thành phần sau (tùy chỉnh theo stack):

### 1. Project Structure (Mandatory)
- Cấu trúc thư mục rõ ràng, phân tách pages/tests/utils/config
- **Domain-driven theo module:** `pages/` và `tests/` chia thành 1 folder / module (mirror 1:1 với `03_test-cases/functional/<module>/`), cộng lớp `common/` cho thành phần dùng chung. `fixtures/` và `utils/` là hạ tầng dùng chung — KHÔNG chia theo module.
- **Cấm import chéo giữa 2 module:** page/test chỉ được import từ `common/` hoặc trong cùng folder module của nó. Logic tái dùng ở nhiều module → đẩy lên `common/`.
- File README.md hướng dẫn setup + chạy test
- File .gitignore phù hợp

### 2. Configuration Management (Mandatory)
- Quản lý environment (dev/staging/prod) qua config file hoặc .env
- Centralized config — không hardcode giá trị trong test
- Sensitive data (credentials) qua environment variables, KHÔNG commit vào repo

### 3. Browser / Driver Management (Mandatory)
- **Playwright:** playwright.config.ts / conftest.py với browser setup
- **Selenium:** WebDriverManager hoặc Driver Factory pattern
- **Appium:** Desired Capabilities factory, Appium server config

### 4. Base Classes (Mandatory)
- Base Page — chứa common methods (wait, click, type, screenshot)
- Base Test — chứa setup/teardown, test lifecycle hooks
- Không hardcode waits — chỉ dùng smart waits

### 5. Page Object Model (Mandatory)
- Mỗi page/screen → 1 Page class
- Locators khai báo ở đầu class, không inline trong test
- Methods mô tả hành vi người dùng (không phải thao tác DOM)

### 6. Test Data Management (Mandatory)
- Data factory / builder pattern cho test data
- Data external (JSON/YAML/CSV) cho data-driven tests
- Data unique + traceable (timestamp/random prefix)

### 7. Utilities (Mandatory)
- Wait helpers (smart waits, custom conditions)
- Screenshot utilities (capture on failure)
- Logger (structured logging, không dùng print/console.log)
- Date/Time helpers, String generators

### 8. Reporting (Mandatory)
- Tích hợp ít nhất 1 reporting tool
- Screenshot attach on failure
- Test execution summary (pass/fail/skip counts)

### 9. CI/CD Pipeline (Optional — nhưng khuyến khích)
- GitHub Actions / GitLab CI / Jenkins pipeline template
- Parallel execution config
- Artifact upload (reports, screenshots)

---

## Project Structure Templates

### Playwright + TypeScript

```
project-root/
├── playwright.config.ts        # Playwright configuration
├── package.json                # Dependencies + scripts
├── .env.example                # Environment template
├── .gitignore
├── README.md
├── src/
│   ├── pages/                  # Page Object classes — domain-driven theo module
│   │   ├── common/             # Page DÙNG CHUNG mọi feature
│   │   │   ├── base.page.ts    # Base page (common methods)
│   │   │   ├── login.page.ts
│   │   │   └── dashboard.page.ts
│   │   └── <module-slug>/      # Page RIÊNG feature (1 folder / module, mirror 03_test-cases)
│   │       └── *.page.ts
│   ├── fixtures/               # Custom fixtures (hạ tầng dùng chung — KHÔNG chia theo module)
│   │   ├── auth.fixture.ts     # Authentication fixture
│   │   └── base.fixture.ts     # Extended test with all fixtures
│   ├── utils/                  # Helpers & utilities (dùng chung — KHÔNG chia theo module)
│   │   ├── test-data.ts        # Data generators
│   │   ├── env.config.ts       # Environment config reader
│   │   └── helpers.ts          # Common helper functions
│   └── tests/                  # Test specs — 1 folder / module (mirror 03_test-cases)
│       ├── common/             # Smoke/login dùng chung
│       │   ├── login.spec.ts
│       │   └── dashboard.spec.ts
│       └── <module-slug>/
│           └── *.spec.ts
├── test-data/                  # External test data (JSON/YAML)
│   ├── common/                 # Data dùng chung
│   │   └── users.json
│   └── <module-slug>/          # Data riêng feature
└── .github/
    └── workflows/
        └── playwright.yml      # CI pipeline
```

### Selenium + Java (Maven + TestNG)

```
project-root/
├── pom.xml                     # Maven config + dependencies
├── testng.xml                  # TestNG suite config
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── main/java/
│   │   └── com/project/
│   │       ├── pages/          # Page Object classes — domain-driven theo module
│   │       │   ├── common/     # Page DÙNG CHUNG mọi feature
│   │       │   │   ├── BasePage.java
│   │       │   │   ├── LoginPage.java
│   │       │   │   └── DashboardPage.java
│   │       │   └── <module>/   # Page RIÊNG feature (1 package / module, mirror 03_test-cases)
│   │       │       └── *Page.java
│   │       ├── drivers/        # Driver management (hạ tầng dùng chung)
│   │       │   └── DriverFactory.java
│   │       ├── config/         # Configuration (dùng chung)
│   │       │   └── ConfigReader.java
│   │       └── utils/          # Utilities (dùng chung)
│   │           ├── WaitHelper.java
│   │           ├── ScreenshotUtil.java
│   │           └── TestDataGenerator.java
│   └── test/java/
│       └── com/project/
│           ├── base/
│           │   └── BaseTest.java
│           └── tests/          # 1 package / module (mirror 03_test-cases)
│               ├── common/     # Smoke/login dùng chung
│               │   ├── LoginTest.java
│               │   └── DashboardTest.java
│               └── <module>/
│                   └── *Test.java
├── test-data/
│   ├── common/                 # Data dùng chung
│   │   └── users.json
│   └── <module>/               # Data riêng feature
└── .github/
    └── workflows/
        └── selenium.yml
```

### Appium + Java (Maven + TestNG)

```
project-root/
├── pom.xml
├── testng.xml
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── main/java/
│   │   └── com/project/
│   │       ├── screens/        # Screen Object classes (mobile POM) — domain-driven theo module
│   │       │   ├── common/     # Screen DÙNG CHUNG mọi feature
│   │       │   │   ├── BaseScreen.java
│   │       │   │   ├── LoginScreen.java
│   │       │   │   └── HomeScreen.java
│   │       │   └── <module>/   # Screen RIÊNG feature (1 package / module, mirror 03_test-cases)
│   │       │       └── *Screen.java
│   │       ├── drivers/        # Appium driver management (hạ tầng dùng chung)
│   │       │   ├── AppiumDriverFactory.java
│   │       │   └── CapabilitiesManager.java
│   │       ├── config/         # (dùng chung)
│   │       │   └── AppConfig.java
│   │       └── utils/          # (dùng chung)
│   │           ├── MobileGestures.java    # Swipe, scroll, tap
│   │           ├── ScreenshotUtil.java
│   │           └── TestDataGenerator.java
│   └── test/java/
│       └── com/project/
│           ├── base/
│           │   └── BaseTest.java
│           └── tests/          # 1 package / module (mirror 03_test-cases)
│               ├── common/     # Smoke/login dùng chung
│               │   ├── LoginTest.java
│               │   └── HomeTest.java
│               └── <module>/
│                   └── *Test.java
├── apps/                       # APK/IPA files
│   └── .gitkeep
├── test-data/
│   ├── common/                 # Data dùng chung
│   │   └── users.json
│   └── <module>/               # Data riêng feature
└── .github/
    └── workflows/
        └── appium.yml
```

### Playwright + Python (Pytest)

```
project-root/
├── playwright.config.py        # Pytest-playwright config (nếu có)
├── pyproject.toml              # Python project config
├── requirements.txt            # Dependencies
├── conftest.py                 # Root fixtures + browser setup
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── pages/                  # domain-driven theo module
│   │   ├── common/             # Page DÙNG CHUNG mọi feature
│   │   │   ├── base_page.py
│   │   │   ├── login_page.py
│   │   │   └── dashboard_page.py
│   │   └── <module>/           # Page RIÊNG feature (1 folder / module, mirror 03_test-cases)
│   │       └── *_page.py
│   ├── utils/                  # (dùng chung — KHÔNG chia theo module)
│   │   ├── config.py           # Env config reader
│   │   ├── test_data.py        # Data generators
│   │   └── helpers.py
│   └── tests/                  # 1 folder / module (mirror 03_test-cases)
│       ├── conftest.py         # Test-level fixtures (dùng chung)
│       ├── common/             # Smoke/login dùng chung
│       │   ├── test_login.py
│       │   └── test_dashboard.py
│       └── <module>/
│           └── test_*.py
├── test-data/
│   ├── common/                 # Data dùng chung
│   │   └── users.json
│   └── <module>/               # Data riêng feature
└── .github/
    └── workflows/
        └── playwright.yml
```

---

## Design Principles

1. **DRY (Don't Repeat Yourself)** — Mỗi logic chỉ viết 1 lần, tái sử dụng qua Base classes và Utils
2. **Single Responsibility** — Mỗi class/module làm 1 việc (Page chỉ chứa UI interaction, Test chỉ chứa test logic)
3. **Open/Closed** — Framework dễ mở rộng (thêm page, thêm test) mà không sửa core
4. **Configuration over Code** — Env, browser, timeout... quản lý qua config, không hardcode
5. **Fail Fast, Log Rich** — Screenshot on failure, structured logging, clear assertion messages

---

## Anti-Patterns (FORBIDDEN)

| ❌ Anti-Pattern | ✅ Đúng cách |
|---|---|
| Hardcode URL/credentials trong code | Đọc từ .env hoặc config file |
| Locator inline trong test | Khai báo trong Page class |
| `Thread.sleep()` / `waitForTimeout()` | Smart waits (`expect()`, `WebDriverWait`) |
| Global mutable state | Isolated fixtures/setup per test |
| Monolithic test file (1 file 500+ dòng) | Tách theo module/feature |
| `System.out.println()` / `console.log()` | Logger framework (Log4j, winston, logging) |

---

## Rules References

Agent PHẢI tuân thủ các rules chi tiết:

- `.claude/rules/automation_rules.md` — General automation best practices
- `.claude/rules/locator_strategy.md` — Locator selection priority
- `.claude/rules/playwright_rules.md` — Playwright-specific rules
- `.claude/rules/selenium_rules.md` — Selenium-specific rules
- `.claude/rules/appium_rules.md` — Appium mobile automation rules
