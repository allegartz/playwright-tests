# Architecture Overview

## Framework Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Test Execution Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  BaseTest (test fixtures) ──> Test Specs (.spec.ts files)      │
│           │                                                      │
│           ├──> WatcherManager Fixture                          │
│           ├──> Logger Fixture                                   │
│           └──> Config Fixture                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Coordination Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  FlowCoordinator                                                │
│    │                                                             │
│    ├──> Flow Steps (action + validation)                       │
│    ├──> Checkpoint Management                                   │
│    └──> Watcher Integration                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Page Object Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  PageObject (Base)                                              │
│    │                                                             │
│    ├──> Smart Locator                                           │
│    ├──> Element Interactor                                      │
│    └──> Custom Page Objects (LoginPage, etc.)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Element Handling Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  SmartLocator               │    ElementInteractor              │
│    │                        │         │                         │
│    ├──> Multiple Strategies│         ├──> Auto Retry           │
│    ├──> Fallback Support   │         ├──> Stability Check      │
│    └──> Element Validation │         └──> Error Recovery       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Watcher Layer                              │
├─────────────────────────────────────────────────────────────────┤
│  WatcherManager                                                 │
│    │                                                             │
│    ├──> DomMutationWatcher (DOM changes)                       │
│    ├──> NetworkWatcher (requests/responses)                     │
│    └──> ConsoleWatcher (logs/errors)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Execution Engine Layer                       │
├─────────────────────────────────────────────────────────────────┤
│  WorkerPool                 │    TestExecutor                   │
│    │                        │         │                         │
│    ├──> Task Queue          │         ├──> Retry Logic         │
│    ├──> Worker Management   │         ├──> Result Tracking     │
│    └──> Concurrent Execution│         └──> Statistics          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core Services Layer                        │
├─────────────────────────────────────────────────────────────────┤
│  ConfigManager  │  Logger    │  ErrorHandler  │  ReportGen     │
│       │         │     │      │       │        │      │         │
│       ├─Config  │     ├─Log  │       ├─Error  │      ├─HTML   │
│       │         │     │      │       │        │      │         │
│       └─Merge   │     └─File │       └─Retry  │      └─JSON   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Test Execution Flow

```
1. Test Start
   └──> Initialize Fixtures (Config, Logger, WatcherManager)
        └──> Setup Test Environment
             └──> Execute Test Steps
                  ├──> Page Object Methods
                  │    └──> Smart Element Handling
                  │         └──> Element Interactions
                  │
                  ├──> Watchers Monitoring (parallel)
                  │    ├──> DOM Mutations
                  │    ├──> Network Traffic
                  │    └──> Console Logs
                  │
                  └──> Flow Coordination
                       ├──> Step Execution
                       ├──> Validation
                       └──> Error Handling
```

### Watcher Data Flow

```
Page Events (Browser)
   │
   ├──> DOM Mutations ──────┐
   ├──> Network Requests ───┤
   └──> Console Messages ───┼──> WatcherManager
                             │      │
                             │      ├──> Collect Events
                             │      ├──> Store Timeline
                             │      └──> Generate Summary
                             │
                             └──> Available to Tests
                                     │
                                     ├──> Assertions
                                     ├──> Debugging
                                     └──> Reporting
```

## Component Responsibilities

### Core Components

#### ConfigManager
- **Purpose**: Centralized configuration management
- **Features**: Singleton pattern, merge configs, type-safe
- **Used by**: All components

#### BasePage
- **Purpose**: Base class for Page Objects
- **Features**: Common page methods, navigation, element handling
- **Extended by**: All Page Objects

#### BaseTest
- **Purpose**: Test fixtures and setup/teardown
- **Features**: Custom fixtures, hooks, utilities
- **Used by**: All test specs

### Watcher Components

#### WatcherManager
- **Purpose**: Coordinate all watchers
- **Features**: Lifecycle management, event aggregation
- **Manages**: All watcher instances

#### Individual Watchers
- **DomMutationWatcher**: Track DOM changes
- **NetworkWatcher**: Monitor network traffic
- **ConsoleWatcher**: Capture console logs/errors

### Element Components

#### SmartLocator
- **Purpose**: Intelligent element location
- **Features**: Multiple strategies, fallback support
- **Used by**: PageObject, Element Interactor

#### ElementInteractor
- **Purpose**: Element interaction with retry
- **Features**: Auto-retry, stability check, error recovery
- **Used by**: PageObject

### Execution Components

#### WorkerPool
- **Purpose**: Concurrent test execution
- **Features**: Worker management, task queue, priority
- **Used by**: TestExecutor

#### TestExecutor
- **Purpose**: Test execution with retry
- **Features**: Retry logic, result tracking, statistics
- **Used by**: Test framework

### Coordination

#### FlowCoordinator
- **Purpose**: Orchestrate complex test flows
- **Features**: Step management, validation, checkpoints
- **Integrates**: Watchers, Page Objects

### Patterns

#### PageObject
- **Purpose**: Enhanced Page Object pattern
- **Features**: Smart locator integration, common methods
- **Extended by**: Specific page objects

#### DataProvider
- **Purpose**: Data-driven testing
- **Features**: CSV parsing, dataset management
- **Used by**: Tests

### Utilities

#### Logger (Winston)
- **Purpose**: Comprehensive logging
- **Features**: Multiple levels, file/console output
- **Used by**: All components

#### ErrorHandler
- **Purpose**: Error handling and recovery
- **Features**: Severity levels, retry with backoff
- **Used by**: All components

#### ReportGenerator
- **Purpose**: Test result reporting
- **Features**: HTML/JSON reports, statistics
- **Used by**: Post-test execution

## Design Patterns Used

### 1. Singleton Pattern
- **Where**: ConfigManager, Logger
- **Why**: Single source of truth, resource management

### 2. Page Object Model
- **Where**: BasePage, PageObject, specific pages
- **Why**: Maintainability, reusability, separation of concerns

### 3. Strategy Pattern
- **Where**: SmartLocator (locator strategies)
- **Why**: Flexible element location, fallback support

### 4. Observer Pattern
- **Where**: Watchers (event observation)
- **Why**: Monitor without tight coupling

### 5. Factory Pattern
- **Where**: Test execution (page creation)
- **Why**: Consistent object creation

### 6. Command Pattern
- **Where**: FlowCoordinator (flow steps)
- **Why**: Encapsulate actions, undo/redo capability

### 7. Chain of Responsibility
- **Where**: SmartLocator (fallback strategies)
- **Why**: Try multiple approaches sequentially

## Extensibility Points

### Adding New Watchers
```typescript
class CustomWatcher implements IWatcher {
  // Implement interface methods
}

// Register in WatcherManager
```

### Adding New Locator Strategies
```typescript
enum LocatorStrategy {
  CUSTOM = 'custom',
}

// Implement in SmartLocator.getLocatorByStrategy()
```

### Adding New Page Objects
```typescript
class MyPage extends PageObject {
  getUrl(): string { return 'https://...'; }
  // Add custom methods
}
```

### Custom Test Fixtures
```typescript
export const test = base.extend<{ myFixture: MyType }>({
  myFixture: async ({}, use) => {
    // Setup
    await use(myValue);
    // Teardown
  },
});
```

## Performance Considerations

### Concurrent Execution
- **Worker Pool**: Configurable worker count
- **Priority Queue**: High-priority tests first
- **Resource Management**: Proper cleanup

### Element Handling
- **Smart Retry**: Exponential backoff
- **Stability Check**: Avoid flaky tests
- **Caching**: Reuse located elements

### Watchers
- **Efficient Storage**: Store only necessary data
- **Cleanup**: Clear events after use
- **Conditional Enable**: Enable only needed watchers

## Security Considerations

### Credentials
- **Never hardcode**: Use environment variables
- **Secure storage**: Use secret management
- **Logging**: Mask sensitive data

### Data Privacy
- **Screenshots**: May contain sensitive info
- **Logs**: Filter sensitive data
- **Reports**: Control access

## Best Practices

### Code Organization
- One Page Object per page
- Group related tests in describe blocks
- Keep tests independent

### Error Handling
- Use try-catch where needed
- Log errors with context
- Graceful degradation

### Maintenance
- Regular dependency updates
- Keep documentation updated
- Review and refactor

### Testing
- Write atomic tests
- Use descriptive names
- Avoid test interdependencies
