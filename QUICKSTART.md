# Quick Start Guide

## Bước 1: Cài đặt

```bash
# Clone repository
git clone https://github.com/allegartz/playwright-tests.git
cd playwright-tests

# Install dependencies
npm install

# Install browsers
npx playwright install chromium
```

## Bước 2: Build Framework

```bash
npm run build
```

## Bước 3: Tạo Test đầu tiên

Tạo file `tests/my-first-test.spec.ts`:

```typescript
import { test, expect } from '../src/core/base-test';

test.describe('My First Test Suite', () => {
  test('should load Google homepage', async ({ page }) => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
  });
});
```

## Bước 4: Chạy Test

```bash
# Chạy test
npm test

# Hoặc chạy một test cụ thể
npx playwright test tests/my-first-test.spec.ts

# Chạy với headed mode để xem browser
npm run test:headed
```

## Bước 5: Xem Report

```bash
npm run report
```

## Example: Test với Watchers

```typescript
import { test, expect } from '../src/core/base-test';

test('Google search with watchers', async ({ page, watcherManager }) => {
  // Start watchers
  await watcherManager.startAll();
  
  // Navigate to Google
  await page.goto('https://www.google.com');
  
  // Perform search
  await page.fill('textarea[name="q"]', 'Playwright');
  await page.press('textarea[name="q"]', 'Enter');
  
  // Wait for results
  await page.waitForLoadState('networkidle');
  
  // Stop watchers
  await watcherManager.stopAll();
  
  // Get watcher summary
  const summary = watcherManager.getSummary();
  console.log('Watcher Summary:', summary);
  
  // Verify results
  const resultsCount = await page.locator('#search .g').count();
  expect(resultsCount).toBeGreaterThan(0);
});
```

## Example: Page Object Pattern

```typescript
// pages/login.page.ts
import { PageObject } from '../src/patterns/page-object';
import { Page } from '@playwright/test';

export class LoginPage extends PageObject {
  private readonly USERNAME = '#username';
  private readonly PASSWORD = '#password';
  private readonly SUBMIT = 'button[type="submit"]';
  
  constructor(page: Page) {
    super(page);
  }
  
  getUrl(): string {
    return 'https://example.com/login';
  }
  
  async login(username: string, password: string): Promise<void> {
    const usernameInput = await this.findElement(this.USERNAME);
    const passwordInput = await this.findElement(this.PASSWORD);
    const submitButton = await this.findElement(this.SUBMIT);
    
    await this.fillElement(usernameInput, username);
    await this.fillElement(passwordInput, password);
    await this.clickElement(submitButton);
  }
}

// tests/login.spec.ts
import { test, expect } from '../src/core/base-test';
import { LoginPage } from '../pages/login.page';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL(/dashboard/);
});
```

## Tips

1. **Sử dụng fixtures**: Framework cung cấp custom fixtures như `watcherManager`, `logger`, `config`
2. **Enable watchers**: Bật watchers để debug và monitor
3. **Page Object Model**: Tạo page objects cho mỗi page trong app
4. **Data-driven tests**: Sử dụng DataProvider cho test với nhiều datasets
5. **Flow Coordinator**: Sử dụng cho complex test flows

## Troubleshooting

### Lỗi "Browser not found"
```bash
npx playwright install chromium
```

### Lỗi TypeScript compilation
```bash
npm run build
```

### Test timeout
Tăng timeout trong `playwright.config.ts`:
```typescript
timeout: 60 * 1000, // 60 seconds
```

## Next Steps

1. Đọc [GUIDE.md](./GUIDE.md) để hiểu chi tiết về framework
2. Xem các example tests trong `tests/examples/`
3. Tạo page objects cho application của bạn
4. Viết tests sử dụng framework features
5. Customize config trong `src/core/config.ts`

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framework Guide](./GUIDE.md)
- [README](./README.md)
