# Hướng dẫn Chi tiết - Playwright Test Automation Framework

## 📚 Mục lục

1. [Giới thiệu các thành phần](#giới-thiệu-các-thành-phần)
2. [Hướng dẫn sử dụng từng phần](#hướng-dẫn-sử-dụng-từng-phần)
3. [Ví dụ thực tế](#ví-dụ-thực-tế)
4. [Troubleshooting](#troubleshooting)

## Giới thiệu các thành phần

### PHẦN 1: Core Concept

**File chính:**
- `src/core/config.ts` - Quản lý cấu hình
- `src/core/base-page.ts` - Base class cho Page Objects
- `src/core/base-test.ts` - Base class và fixtures cho tests

**Mục đích:**
Cung cấp nền tảng cho toàn bộ framework, quản lý cấu hình toàn cục và các class cơ bản.

**Khi nào sử dụng:**
- Khi cần tạo Page Object mới: extend `BasePage`
- Khi cần custom test fixtures: sử dụng `test` từ `base-test.ts`
- Khi cần thay đổi cấu hình: sử dụng `ConfigManager`

### PHẦN 2: Advanced Watcher Implementation

**File chính:**
- `src/watchers/dom-mutation-watcher.ts` - Theo dõi DOM changes
- `src/watchers/network-watcher.ts` - Theo dõi network traffic
- `src/watchers/console-watcher.ts` - Theo dõi console logs
- `src/watchers/watcher-manager.ts` - Quản lý tất cả watchers

**Mục đích:**
Theo dõi và ghi lại tất cả sự kiện xảy ra trên trang web trong quá trình test.

**Khi nào sử dụng:**
- Debug các vấn đề về DOM không expected
- Phân tích network performance
- Tracking JavaScript errors
- Audit trail cho test execution

### PHẦN 3: Concurrent Execution Engine

**File chính:**
- `src/engine/worker-pool.ts` - Worker pool management
- `src/engine/test-executor.ts` - Test execution với retry

**Mục đích:**
Chạy tests song song để tối ưu thời gian execution, quản lý worker pool.

**Khi nào sử dụng:**
- Khi có nhiều independent tests cần chạy
- Cần optimize execution time
- Chạy tests với priority khác nhau

### PHẦN 4: Smart Element Handling

**File chính:**
- `src/elements/smart-locator.ts` - Locator strategies
- `src/elements/element-interactor.ts` - Element interaction với retry

**Mục đích:**
Xử lý element một cách thông minh với auto-retry, multiple strategies, và stability checking.

**Khi nào sử dụng:**
- Tương tác với dynamic elements
- Cần fallback strategies khi element không tìm thấy
- Elements cần time để stable (animations, transitions)

### PHẦN 5: Coordination với Main Flow

**File chính:**
- `src/coordination/flow-coordinator.ts` - Flow coordination

**Mục đích:**
Điều phối các bước test, integrate với watchers, hỗ trợ checkpoint recovery.

**Khi nào sử dụng:**
- Test flows phức tạp với nhiều bước
- Cần validation sau mỗi bước
- Cần resume từ checkpoint khi test fail
- Tích hợp watchers vào flow

### PHẦN 6: Advanced Patterns & Optimizations

**File chính:**
- `src/patterns/page-object.ts` - Enhanced Page Object Model
- `src/patterns/data-provider.ts` - Data-driven testing

**Mục đích:**
Implement các design patterns và best practices cho maintainable tests.

**Khi nào sử dụng:**
- Organize test code theo Page Object Model
- Chạy cùng test với nhiều data sets
- Reuse test logic

### PHẦN 7: Production-Ready Implementation

**File chính:**
- `src/utils/logger.ts` - Winston logging
- `src/utils/error-handler.ts` - Error handling
- `src/utils/report-generator.ts` - Report generation

**Mục đích:**
Cung cấp production-ready features: logging, error handling, reporting.

**Khi nào sử dụng:**
- Luôn luôn! Logging và error handling nên được dùng trong mọi test
- Generate reports sau khi chạy test suite
- Track và analyze errors

## Hướng dẫn sử dụng từng phần

### 1. Setup Framework

```typescript
// Step 1: Install dependencies
npm install

// Step 2: Configure framework
import { ConfigManager } from './src/core/config';

const config = ConfigManager.getInstance();
config.updateConfig({
  execution: {
    maxWorkers: 4,
    parallel: true,
  },
  watchers: {
    enabled: true,
  },
});
```

### 2. Tạo Page Object

```typescript
import { PageObject } from './src/patterns/page-object';
import { Page } from '@playwright/test';
import { LocatorStrategy } from './src/elements/smart-locator';

class LoginPage extends PageObject {
  // Define selectors
  private readonly USERNAME_INPUT = '#username';
  private readonly PASSWORD_INPUT = '#password';
  private readonly LOGIN_BUTTON = 'button[type="submit"]';
  
  constructor(page: Page) {
    super(page);
  }
  
  getUrl(): string {
    return 'https://example.com/login';
  }
  
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    const usernameInput = await this.findElement(this.USERNAME_INPUT);
    await this.waitForElement(usernameInput);
  }
  
  async login(username: string, password: string): Promise<void> {
    // Find elements with smart locator
    const usernameInput = await this.findElement(
      this.USERNAME_INPUT,
      LocatorStrategy.CSS
    );
    const passwordInput = await this.findElement(this.PASSWORD_INPUT);
    const loginButton = await this.findElement(this.LOGIN_BUTTON);
    
    // Interact with elements
    await this.fillElement(usernameInput, username);
    await this.fillElement(passwordInput, password);
    await this.clickElement(loginButton);
    
    // Wait for navigation
    await this.waitForNavigation();
  }
}
```

### 3. Viết Test với Watchers

```typescript
import { test, expect } from './src/core/base-test';
import { NetworkWatcher } from './src/watchers/network-watcher';
import { ConsoleWatcher } from './src/watchers/console-watcher';

test.describe('Login Tests', () => {
  test('login with network monitoring', async ({ page, watcherManager }) => {
    const loginPage = new LoginPage(page);
    
    // Navigate
    await loginPage.navigate();
    
    // Start watchers
    await watcherManager.startAll();
    
    // Perform login
    await loginPage.login('testuser', 'password123');
    
    // Stop watchers
    await watcherManager.stopAll();
    
    // Analyze watcher data
    const networkWatcher = watcherManager.getWatcher<NetworkWatcher>('network');
    if (networkWatcher) {
      const failedRequests = networkWatcher.getFailedRequests();
      expect(failedRequests.length).toBe(0);
      
      const avgResponseTime = networkWatcher.getAverageResponseTime();
      console.log(`Avg response time: ${avgResponseTime}ms`);
    }
    
    // Check console errors
    const consoleWatcher = watcherManager.getWatcher<ConsoleWatcher>('console');
    if (consoleWatcher) {
      expect(consoleWatcher.hasErrors()).toBe(false);
    }
  });
});
```

### 4. Sử dụng Flow Coordinator

```typescript
import { FlowCoordinator } from './src/coordination/flow-coordinator';

test('complete user flow', async ({ page, watcherManager }) => {
  const coordinator = new FlowCoordinator(page, watcherManager);
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);
  
  // Step 1: Navigate and login
  coordinator.addStep({
    name: 'Login',
    action: async () => {
      await loginPage.navigate();
      await loginPage.login('user@example.com', 'password');
    },
    validation: async () => {
      const url = await page.url();
      return url.includes('dashboard');
    },
    onError: async (error) => {
      await page.screenshot({ path: 'login-error.png' });
    },
  });
  
  // Step 2: Navigate to profile
  coordinator.addStep({
    name: 'Navigate to Profile',
    action: async () => {
      await dashboardPage.goToProfile();
    },
    validation: async () => {
      return await dashboardPage.isOnProfilePage();
    },
  });
  
  // Execute flow
  const result = await coordinator.execute();
  
  expect(result.success).toBe(true);
  console.log('Flow completed:', result.completedSteps);
  console.log('Watcher summary:', result.watcherSummary);
});
```

### 5. Data-Driven Testing

```typescript
import { DataProvider, CsvParser } from './src/patterns/data-provider';

test('login with multiple users', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dataProvider = new DataProvider();
  
  // Option 1: Load from array
  dataProvider.loadData('login-tests', [
    { username: 'user1@example.com', password: 'pass1', shouldSucceed: true },
    { username: 'user2@example.com', password: 'pass2', shouldSucceed: true },
    { username: 'invalid@example.com', password: 'wrong', shouldSucceed: false },
  ]);
  
  // Option 2: Load from CSV
  const csvData = `
    username,password,shouldSucceed
    user1@example.com,pass1,true
    user2@example.com,pass2,true
  `;
  const parsedData = CsvParser.parse(csvData);
  
  // Execute test with each dataset
  await dataProvider.executeWithData('login-tests', async (data) => {
    await loginPage.navigate();
    await loginPage.login(data.username, data.password);
    
    if (data.shouldSucceed) {
      // Verify successful login
      expect(page.url()).toContain('dashboard');
    } else {
      // Verify error message
      const errorMsg = await loginPage.getErrorMessage();
      expect(errorMsg).toBeTruthy();
    }
  });
});
```

### 6. Error Handling

```typescript
import { ErrorHandler, ErrorSeverity } from './src/utils/error-handler';

test('with error handling', async ({ page }) => {
  const errorHandler = new ErrorHandler();
  const loginPage = new LoginPage(page);
  
  try {
    await loginPage.navigate();
    await loginPage.login('test@example.com', 'password');
  } catch (error) {
    // Handle error with severity
    await errorHandler.handleError(
      error as Error,
      ErrorSeverity.HIGH,
      page,
      { step: 'login', user: 'test@example.com' }
    );
    
    // Retry with backoff
    await errorHandler.retryWithBackoff(
      async () => {
        await loginPage.login('test@example.com', 'password');
      },
      3,
      1000
    );
  }
  
  // Check for critical errors
  if (errorHandler.hasCriticalErrors()) {
    throw new Error('Critical errors occurred');
  }
});
```

### 7. Generate Reports

```typescript
import { ReportGenerator, TestReport } from './src/utils/report-generator';

// After test execution
const report: TestReport = {
  summary: {
    total: 10,
    passed: 8,
    failed: 2,
    skipped: 0,
    passRate: 80,
    duration: 45000,
    startTime: '2024-01-01 10:00:00',
    endTime: '2024-01-01 10:00:45',
  },
  tests: [
    {
      name: 'Login test',
      status: 'passed',
      duration: 3000,
      retries: 0,
    },
    // ... more tests
  ],
  errors: [],
  environment: {
    browser: 'chromium',
    platform: 'linux',
    timestamp: new Date().toISOString(),
  },
};

const reportGenerator = new ReportGenerator();
reportGenerator.generateHtmlReport(report, 'test-results/report.html');
reportGenerator.generateJsonReport(report, 'test-results/report.json');
```

## Ví dụ thực tế

### Complete E2E Test Example

```typescript
import { test, expect } from './src/core/base-test';
import { FlowCoordinator } from './src/coordination/flow-coordinator';
import { ErrorHandler, ErrorSeverity } from './src/utils/error-handler';

test.describe('E-commerce Purchase Flow', () => {
  test('complete purchase flow with monitoring', async ({ page, watcherManager }) => {
    const errorHandler = new ErrorHandler();
    const coordinator = new FlowCoordinator(page, watcherManager);
    
    // Define complete flow
    coordinator.addStep({
      name: 'Login',
      action: async () => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('buyer@example.com', 'password123');
      },
      validation: async () => page.url().includes('home'),
    });
    
    coordinator.addStep({
      name: 'Search Product',
      action: async () => {
        const homePage = new HomePage(page);
        await homePage.search('laptop');
      },
      validation: async () => {
        const results = await page.locator('.product-item').count();
        return results > 0;
      },
    });
    
    coordinator.addStep({
      name: 'Add to Cart',
      action: async () => {
        const productPage = new ProductPage(page);
        await productPage.selectFirstProduct();
        await productPage.addToCart();
      },
      validation: async () => {
        const cartCount = await page.locator('.cart-count').textContent();
        return parseInt(cartCount || '0') > 0;
      },
    });
    
    coordinator.addStep({
      name: 'Checkout',
      action: async () => {
        const checkoutPage = new CheckoutPage(page);
        await checkoutPage.navigate();
        await checkoutPage.fillShippingInfo({
          address: '123 Main St',
          city: 'NYC',
          zip: '10001',
        });
        await checkoutPage.completePurchase();
      },
      validation: async () => page.url().includes('confirmation'),
    });
    
    // Execute flow with watchers
    const result = await coordinator.execute();
    
    // Assertions
    expect(result.success).toBe(true);
    expect(result.completedSteps.length).toBe(4);
    
    // Analyze watchers
    console.log('Watcher Summary:', result.watcherSummary);
    
    // Check for errors
    expect(errorHandler.hasCriticalErrors()).toBe(false);
  });
});
```

## Troubleshooting

### Issue: Element không tìm thấy

**Solution:**
```typescript
// Sử dụng SmartLocator với fallback strategies
const element = await smartLocator.findElement('button', {
  strategy: LocatorStrategy.CSS,
  fallbackStrategies: [
    LocatorStrategy.TEXT,
    LocatorStrategy.ROLE,
  ],
});
```

### Issue: Test không stable, sometimes pass/fail

**Solution:**
```typescript
// Enable waitForStable
config.updateConfig({
  elements: {
    waitForStable: true,
    retryAttempts: 3,
  },
});
```

### Issue: Watchers không capture events

**Solution:**
```typescript
// Ensure watchers are started before actions
await watcherManager.initialize();
await watcherManager.startAll();

// Perform actions

await watcherManager.stopAll(); // Don't forget to stop
```

### Issue: Concurrent execution fails

**Solution:**
```typescript
// Reduce number of workers
config.updateConfig({
  execution: {
    maxWorkers: 2, // Reduce from 4
  },
});
```

### Issue: Logs không hiển thị

**Solution:**
```typescript
// Enable console logging
config.updateConfig({
  logging: {
    console: true,
    level: 'debug',
  },
});
```

## Best Practices

1. **Luôn sử dụng Page Object Model** - Dễ maintain và reuse
2. **Enable watchers cho debugging** - Giúp troubleshoot nhanh
3. **Sử dụng Flow Coordinator cho complex flows** - Dễ track và debug
4. **Data-driven testing cho test coverage** - Test nhiều scenarios
5. **Error handling ở mọi layer** - Graceful degradation
6. **Log đầy đủ** - Debug và audit
7. **Generate reports** - Track progress over time

## Next Steps

1. Tạo các Page Objects cho application của bạn
2. Viết test cases sử dụng framework
3. Enable watchers để monitor
4. Setup CI/CD pipeline
5. Customize config theo nhu cầu
6. Extend framework với custom components
