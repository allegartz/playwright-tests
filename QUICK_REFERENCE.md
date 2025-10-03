# Quick Reference Guide

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/allegartz/playwright-tests.git
cd playwright-tests

# Install dependencies
npm install

# Install browsers
npx playwright install

# Run tests
npm test
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm test` | Chạy tất cả tests |
| `npm run test:ui` | Chạy tests với UI mode |
| `npm run test:headed` | Chạy tests hiển thị browser |
| `npm run test:debug` | Chạy tests với debug mode |
| `npm run test:report` | Xem test report |
| `npx playwright test --list` | List tất cả tests |
| `npx playwright test tests/login.spec.js` | Chạy test file cụ thể |
| `npx playwright test --project=chromium` | Chạy với browser cụ thể |
| `npx playwright test -g "login"` | Chạy tests có tên chứa "login" |

## 📁 File Structure

```
playwright-tests/
├── tests/
│   ├── login.spec.js              # 8 tests - Login functionality
│   ├── form-interactions.spec.js  # 15 tests - Form interactions
│   ├── ui-validation.spec.js      # 20 tests - UI validation
│   ├── user-flow.spec.js          # 15 tests - User flows
│   ├── example.spec.js            # 8 tests - Examples
│   ├── utils.js                   # Helper functions
│   └── testData.js                # Test data
├── .github/workflows/
│   └── playwright.yml             # CI/CD workflow
├── playwright.config.js           # Playwright config
├── package.json                   # Dependencies
├── README.md                      # Main documentation
├── CONTRIBUTING.md                # Contribution guide
├── TEST_CASES.md                  # Test cases documentation
└── .env.example                   # Environment variables example
```

## 🧪 Test Coverage

**Total: 330 tests** across 5 browsers (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari)

### By Category
- **Login Tests**: 8 tests
  - Form display, validation, login/logout, remember me, forgot password
  
- **Form Interaction Tests**: 15 tests
  - Text inputs, email, dropdowns, checkboxes, radio buttons, textarea, file upload, date picker, validation, submission

- **UI Validation Tests**: 20 tests
  - Page structure, responsive design, accessibility, images, navigation, console errors, meta tags

- **User Flow Tests**: 15 tests
  - Registration, profile update, search, shopping cart, form submission, pagination, modals, tabs, settings

- **Example Tests**: 8 tests
  - Demonstrating utility functions usage

## 🛠️ Test Utilities

```javascript
const utils = require('./utils');

// Login/Logout
await utils.login(page, 'username', 'password');
await utils.logout(page);

// Form operations
await utils.fillForm(page, { name: 'John', email: 'john@example.com' });
await utils.clearForm(page);

// Navigation
await utils.navigateToSection(page, 'Profile');
await utils.waitForNetworkIdle(page);

// Element checks
const exists = await utils.elementExists(page, 'selector');
const text = await utils.getTextContent(page, 'selector');

// Data generation
const email = utils.generateRandomEmail();
const phone = utils.generateRandomPhone();
const string = utils.generateRandomString(10);

// Helpers
await utils.handleCookieConsent(page);
await utils.scrollToElement(page, 'selector');
await utils.hoverElement(page, 'selector');
```

## 📊 Test Data

```javascript
const testData = require('./testData');

// Users
testData.users.validUser.username
testData.users.validUser.password

// Forms
testData.forms.registration.firstName
testData.forms.contact.email

// Messages
testData.errorMessages.requiredField
testData.successMessages.login

// Viewports
testData.viewports.mobile
testData.viewports.desktop
```

## ⚙️ Configuration

### Environment Variables
```bash
# Create .env file
cp .env.example .env

# Edit values
BASE_URL=https://your-website.com
TEST_USERNAME=your-username
TEST_PASSWORD=your-password
```

### Playwright Config
```javascript
// playwright.config.js
baseURL: process.env.BASE_URL || 'https://demo.playwright.dev',
```

## 🎯 Test Execution Strategies

### Run Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
```

### Run Specific Test Suite
```bash
npx playwright test tests/login.spec.js
npx playwright test tests/form-interactions.spec.js
npx playwright test tests/ui-validation.spec.js
npx playwright test tests/user-flow.spec.js
```

### Filter Tests by Name
```bash
npx playwright test -g "should display login form"
npx playwright test -g "form"
npx playwright test -g "validation"
```

### Parallel Execution
```bash
npx playwright test --workers=4
```

### Debug Mode
```bash
npx playwright test --debug
npx playwright test --debug tests/login.spec.js
```

## 📈 Test Reports

### HTML Report
```bash
npm run test:report
# Opens browser with test results
```

### CI Report
- Automatically generated on GitHub Actions
- Available in Actions tab
- Artifacts contain:
  - Test reports
  - Screenshots (on failure)
  - Videos (on failure)

## 🔍 Debugging

### Using UI Mode
```bash
npm run test:ui
# Interactive testing with time-travel debugging
```

### Using Inspector
```bash
npx playwright test --debug
# Step through tests, inspect locators
```

### Screenshots on Failure
Automatically captured in `test-results/`

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

## 📝 Writing New Tests

### Basic Template
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Your Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    const element = page.getByRole('button');
    
    // Act
    await element.click();
    
    // Assert
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

### Using Utilities
```javascript
const utils = require('./utils');
const testData = require('./testData');

test('should login and update profile', async ({ page }) => {
  await utils.login(page, testData.users.validUser.username, testData.users.validUser.password);
  await utils.navigateToSection(page, 'Profile');
  // Continue with test
});
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Write tests
4. Run all tests
5. Submit PR

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Selectors](https://playwright.dev/docs/selectors)
- [Assertions](https://playwright.dev/docs/test-assertions)

## 🆘 Troubleshooting

### Tests failing?
1. Check if browsers are installed: `npx playwright install`
2. Check base URL is correct
3. Check element selectors
4. Add proper waits

### Flaky tests?
1. Add `waitForLoadState('networkidle')`
2. Increase timeouts
3. Add explicit waits
4. Check for race conditions

### CI/CD failing?
1. Check GitHub Actions workflow
2. Review CI logs
3. Check environment variables
4. Review artifacts

## 📞 Support

- Create issue for bugs
- Create discussion for questions
- Check existing issues first

---

**Total Test Count**: 330 tests (66 unique test cases × 5 browsers)
