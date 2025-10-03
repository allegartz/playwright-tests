# Playwright Test Automation Framework

Hệ thống auto test web toàn diện với Playwright, bao gồm các tính năng nâng cao như concurrent execution, smart element handling, watchers, và production-ready features.

## 📋 Tổng quan

Framework này được xây dựng với 7 phần chính:

1. **Core Concept**: Cấu trúc framework và các class chính
2. **Advanced Watcher Implementation**: Theo dõi thay đổi và sự kiện trên web
3. **Concurrent Execution Engine**: Thực thi test song song, tối ưu hiệu suất
4. **Smart Element Handling**: Xử lý thông minh các element với auto-retry
5. **Coordination với Main Flow**: Điều phối luồng chính và watchers
6. **Advanced Patterns & Optimizations**: Page Object Model, Data-driven testing
7. **Production-Ready Implementation**: Logging, error handling, reporting

## 🚀 Cài đặt

```bash
# Clone repository
git clone https://github.com/allegartz/playwright-tests.git
cd playwright-tests

# Cài đặt dependencies
npm install

# Cài đặt browsers
npx playwright install
```

## 📁 Cấu trúc thư mục

```
playwright-tests/
├── src/
│   ├── core/                    # PHẦN 1: Core framework classes
│   │   ├── config.ts            # Configuration management
│   │   ├── base-page.ts         # Base page object class
│   │   └── base-test.ts         # Base test class
│   │
│   ├── watchers/                # PHẦN 2: Watcher implementations
│   │   ├── base-watcher.ts      # Watcher interface
│   │   ├── dom-mutation-watcher.ts
│   │   ├── network-watcher.ts
│   │   ├── console-watcher.ts
│   │   └── watcher-manager.ts   # Quản lý tất cả watchers
│   │
│   ├── engine/                  # PHẦN 3: Concurrent execution
│   │   ├── worker-pool.ts       # Worker pool manager
│   │   └── test-executor.ts     # Test execution engine
│   │
│   ├── elements/                # PHẦN 4: Smart element handling
│   │   ├── smart-locator.ts     # Smart locator strategies
│   │   └── element-interactor.ts # Element interaction với retry
│   │
│   ├── coordination/            # PHẦN 5: Flow coordination
│   │   └── flow-coordinator.ts  # Flow coordinator
│   │
│   ├── patterns/                # PHẦN 6: Advanced patterns
│   │   ├── page-object.ts       # Page Object Model
│   │   └── data-provider.ts     # Data-driven testing
│   │
│   ├── utils/                   # PHẦN 7: Production utilities
│   │   ├── logger.ts            # Winston logger
│   │   ├── error-handler.ts     # Error handling
│   │   └── report-generator.ts  # Report generation
│   │
│   └── index.ts                 # Main exports
│
├── tests/
│   └── examples/                # Example test cases
│       ├── google-search.page.ts
│       ├── 01-basic-test.spec.ts
│       ├── 02-watcher-test.spec.ts
│       ├── 03-flow-coordinator-test.spec.ts
│       └── 04-data-driven-test.spec.ts
│
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Package dependencies
```

## 💡 Sử dụng Framework

### 1. Core Concept - Base Classes

```typescript
import { BasePage } from './src/core/base-page';
import { Page } from '@playwright/test';

class MyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
  
  async isLoaded(): Promise<boolean> {
    // Implement your page load validation
    return true;
  }
}
```

### 2. Advanced Watchers

```typescript
import { WatcherManager } from './src/watchers/watcher-manager';

test('with watchers', async ({ page }) => {
  const watcherManager = new WatcherManager(page);
  await watcherManager.initialize();
  await watcherManager.startAll();
  
  // Perform actions
  
  await watcherManager.stopAll();
  const summary = watcherManager.getSummary();
  console.log(summary);
});
```

### 3. Concurrent Execution

```typescript
import { WorkerPool } from './src/engine/worker-pool';

const pool = new WorkerPool(4); // 4 workers

pool.addTask({
  id: 'task-1',
  priority: 1,
  execute: async () => {
    // Your task logic
  }
});

await pool.executeAll();
```

### 4. Smart Element Handling

```typescript
import { SmartLocator, LocatorStrategy } from './src/elements/smart-locator';

const smartLocator = new SmartLocator(page);

const element = await smartLocator.findElement('button', {
  strategy: LocatorStrategy.CSS,
  fallbackStrategies: [LocatorStrategy.TEXT, LocatorStrategy.ROLE]
});
```

### 5. Flow Coordination

```typescript
import { FlowCoordinator } from './src/coordination/flow-coordinator';

const coordinator = new FlowCoordinator(page, watcherManager);

coordinator.addStep({
  name: 'Login',
  action: async (page) => {
    // Login logic
  },
  validation: async (page) => {
    return page.url().includes('dashboard');
  }
});

const result = await coordinator.execute();
```

### 6. Page Object Pattern

```typescript
import { PageObject } from './src/patterns/page-object';

class LoginPage extends PageObject {
  getUrl(): string {
    return 'https://example.com/login';
  }
  
  async login(username: string, password: string) {
    const usernameInput = await this.findElement('#username');
    const passwordInput = await this.findElement('#password');
    
    await this.fillElement(usernameInput, username);
    await this.fillElement(passwordInput, password);
    
    const submitButton = await this.findElement('button[type="submit"]');
    await this.clickElement(submitButton);
  }
}
```

### 7. Data-Driven Testing

```typescript
import { DataProvider } from './src/patterns/data-provider';

const dataProvider = new DataProvider();

dataProvider.loadData('login-test', [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
]);

await dataProvider.executeWithData('login-test', async (data) => {
  await loginPage.login(data.username, data.password);
});
```

## 🔧 Configuration

Cấu hình framework trong `src/core/config.ts`:

```typescript
import { ConfigManager } from './src/core/config';

const config = ConfigManager.getInstance();

config.updateConfig({
  execution: {
    maxWorkers: 4,
    retries: 2,
    parallel: true,
  },
  watchers: {
    enabled: true,
    domMutation: true,
    networkMonitoring: true,
  },
  logging: {
    level: 'info',
    console: true,
  }
});
```

## 🧪 Chạy Tests

```bash
# Chạy tất cả tests
npm test

# Chạy tests song song
npm run test:parallel

# Chạy với headed mode
npm run test:headed

# Debug mode
npm run test:debug

# Xem report
npm run report
```

## 📊 Reports & Logging

Framework tự động tạo:
- **HTML Reports**: Chi tiết kết quả test
- **JSON Reports**: Dữ liệu structured cho integration
- **Screenshots**: Tự động chụp khi test fail
- **Logs**: Winston logger với multiple levels

## 🎯 Features

### Core Features
- ✅ Base classes cho Page Objects và Tests
- ✅ Configuration management hệ thống
- ✅ TypeScript support toàn bộ

### Watchers
- ✅ DOM Mutation tracking
- ✅ Network request/response monitoring
- ✅ Console log & error tracking
- ✅ Centralized watcher management

### Execution Engine
- ✅ Worker pool cho concurrent execution
- ✅ Test priority và queueing
- ✅ Auto retry với configurable attempts
- ✅ Performance statistics

### Element Handling
- ✅ Multiple locator strategies
- ✅ Auto-retry mechanisms
- ✅ Element stability checking
- ✅ Fallback strategies

### Patterns
- ✅ Page Object Model
- ✅ Data-driven testing
- ✅ Flow coordination
- ✅ Checkpoint recovery

### Production Ready
- ✅ Winston logging system
- ✅ Error handling với severity levels
- ✅ HTML & JSON report generation
- ✅ Screenshot on failure
- ✅ Comprehensive error tracking

## 🛠️ Mở rộng Framework

Framework được thiết kế để dễ dàng mở rộng:

### Thêm Custom Watcher

```typescript
import { IWatcher, WatcherEvent } from './src/watchers/base-watcher';

class CustomWatcher implements IWatcher {
  async initialize(): Promise<void> { }
  async start(): Promise<void> { }
  async stop(): Promise<void> { }
  async cleanup(): Promise<void> { }
  getEvents(): WatcherEvent[] { return []; }
  clearEvents(): void { }
}
```

### Thêm Custom Page Object

```typescript
import { PageObject } from './src/patterns/page-object';

class CustomPage extends PageObject {
  getUrl(): string {
    return 'https://your-app.com';
  }
  
  // Add your custom methods
}
```

## 📝 Best Practices

1. **Sử dụng Page Object Model**: Tách biệt logic page và test logic
2. **Enable Watchers**: Theo dõi và debug hiệu quả hơn
3. **Data-Driven Tests**: Tái sử dụng test logic với nhiều data sets
4. **Flow Coordination**: Tổ chức test flows phức tạp
5. **Error Handling**: Sử dụng ErrorHandler cho graceful degradation
6. **Logging**: Log đầy đủ để debug và audit

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👥 Author

Developed for comprehensive Playwright test automation
