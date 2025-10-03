# Contributing to Playwright Test Automation Framework

Thank you for your interest in contributing! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Code Style](#code-style)
8. [Architecture Guidelines](#architecture-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git
- TypeScript knowledge
- Playwright experience

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/playwright-tests.git
cd playwright-tests

# Add upstream remote
git remote add upstream https://github.com/allegartz/playwright-tests.git
```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Build the Project

```bash
npm run build
```

### Run Tests

```bash
# Run all tests
npm test

# Run specific test
npx playwright test tests/examples/01-basic-test.spec.ts

# Run in headed mode
npm run test:headed
```

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make changes
# ...

# Build and test
npm run build
npm test

# Commit changes
git add .
git commit -m "Add new feature"

# Push to your fork
git push origin feature/my-new-feature
```

## Making Changes

### What to Contribute

#### Bug Fixes
- Fix TypeScript compilation errors
- Fix failing tests
- Fix documentation errors
- Fix performance issues

#### New Features
- New watchers
- New locator strategies
- New patterns
- Enhanced reporting
- Better error handling

#### Documentation
- Improve README
- Add examples
- Fix typos
- Add tutorials

#### Tests
- Add test coverage
- Add integration tests
- Add example tests

### Before You Start

1. **Check existing issues**: See if someone is already working on it
2. **Create an issue**: Discuss your idea before implementing
3. **Get feedback**: Wait for maintainer approval for large changes

## Testing Guidelines

### Unit Tests

Write unit tests for new components:

```typescript
import { expect } from '@playwright/test';
import { MyComponent } from '../src/components/my-component';

describe('MyComponent', () => {
  test('should do something', () => {
    const component = new MyComponent();
    expect(component.doSomething()).toBe(expected);
  });
});
```

### Integration Tests

Write integration tests for features:

```typescript
import { test, expect } from '../src/core/base-test';

test('feature integration', async ({ page, watcherManager }) => {
  // Test the feature
});
```

### Test Coverage

- Aim for high test coverage
- Test edge cases
- Test error scenarios
- Test async operations

## Pull Request Process

### 1. Update Documentation

- Update README if adding features
- Update GUIDE.md with usage examples
- Add JSDoc comments to new code
- Update ARCHITECTURE.md if needed

### 2. Follow Code Style

- Use TypeScript
- Follow existing patterns
- Add types to everything
- Use ESLint rules

### 3. Write Good Commit Messages

```
feat: add new network watcher feature

- Implement HTTP/2 support
- Add request timing
- Update documentation

Fixes #123
```

**Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Build process, etc.

### 4. Create Pull Request

1. Push to your fork
2. Create PR from your branch to `main`
3. Fill in PR template
4. Link related issues
5. Request review

### 5. Code Review

- Address review comments
- Update based on feedback
- Keep discussion professional
- Be patient

### 6. Merge

- Maintainer will merge when approved
- Delete your branch after merge

## Code Style

### TypeScript

```typescript
// ✅ Good
export class MyClass {
  private myProperty: string;
  
  constructor(value: string) {
    this.myProperty = value;
  }
  
  public myMethod(): void {
    // Implementation
  }
}

// ❌ Bad
export class myclass {
  myProperty;
  
  constructor(value) {
    this.myProperty = value;
  }
  
  myMethod() {
    // Implementation
  }
}
```

### Naming Conventions

- **Classes**: PascalCase (`MyClass`)
- **Interfaces**: PascalCase with `I` prefix (`IMyInterface`)
- **Methods**: camelCase (`myMethod`)
- **Variables**: camelCase (`myVariable`)
- **Constants**: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Files**: kebab-case (`my-file.ts`)

### Comments

```typescript
/**
 * Brief description of the class/method
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * @throws Description of exceptions
 * 
 * @example
 * const result = myFunction('value');
 */
```

### File Organization

```typescript
// 1. Imports
import { Something } from 'somewhere';

// 2. Interfaces/Types
export interface MyInterface {
  // ...
}

// 3. Constants
const MY_CONSTANT = 'value';

// 4. Main class/function
export class MyClass {
  // ...
}

// 5. Helper functions (if any)
function helperFunction() {
  // ...
}
```

## Architecture Guidelines

### Adding New Components

#### 1. Create Interface

```typescript
// src/components/base-component.ts
export interface IComponent {
  initialize(): Promise<void>;
  cleanup(): Promise<void>;
}
```

#### 2. Implement Component

```typescript
// src/components/my-component.ts
import { IComponent } from './base-component';
import { Logger } from '../utils/logger';

export class MyComponent implements IComponent {
  private logger: Logger;
  
  constructor() {
    this.logger = Logger.getInstance();
  }
  
  async initialize(): Promise<void> {
    this.logger.info('Initializing MyComponent');
  }
  
  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up MyComponent');
  }
}
```

#### 3. Add to Index

```typescript
// src/index.ts
export { MyComponent } from './components/my-component';
```

#### 4. Write Tests

```typescript
// tests/components/my-component.spec.ts
import { test, expect } from '../../src/core/base-test';
import { MyComponent } from '../../src/components/my-component';

test.describe('MyComponent', () => {
  test('should initialize', async () => {
    const component = new MyComponent();
    await component.initialize();
    // Assertions
  });
});
```

#### 5. Document

```typescript
/**
 * PHẦN X: COMPONENT NAME
 * Description of the component
 * 
 * Purpose: What this component does
 * When to use: When you need X
 */
```

### Design Principles

1. **Single Responsibility**: One class, one purpose
2. **DRY**: Don't Repeat Yourself
3. **SOLID**: Follow SOLID principles
4. **Type Safety**: Use TypeScript features
5. **Error Handling**: Always handle errors
6. **Logging**: Log important events
7. **Documentation**: Document public APIs

### Performance

- Avoid unnecessary async/await
- Use efficient data structures
- Clean up resources
- Cache when appropriate
- Monitor memory usage

### Security

- Never commit secrets
- Validate inputs
- Sanitize outputs
- Use parameterized queries
- Follow security best practices

## Common Tasks

### Adding a New Watcher

1. Create watcher file in `src/watchers/`
2. Implement `IWatcher` interface
3. Add to `WatcherManager`
4. Write tests
5. Update documentation

### Adding a New Pattern

1. Create pattern file in `src/patterns/`
2. Implement the pattern
3. Export from `src/index.ts`
4. Add example in `tests/examples/`
5. Update GUIDE.md

### Adding a New Utility

1. Create utility file in `src/utils/`
2. Implement the utility
3. Export from `src/index.ts`
4. Write tests
5. Document usage

## Getting Help

- **Questions**: Open an issue with `question` label
- **Bugs**: Open an issue with `bug` label
- **Features**: Open an issue with `enhancement` label
- **Discussion**: Start a discussion in GitHub Discussions

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
