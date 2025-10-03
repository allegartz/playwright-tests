/**
 * Playwright Test Automation Framework
 * Main exports file
 */

// Core Concept
export { ConfigManager, FrameworkConfig, defaultConfig } from './core/config';
export { BasePage } from './core/base-page';
export { BaseTest, test, expect } from './core/base-test';

// Watchers
export { IWatcher, WatcherEvent, WatcherEventType } from './watchers/base-watcher';
export { DomMutationWatcher } from './watchers/dom-mutation-watcher';
export { NetworkWatcher } from './watchers/network-watcher';
export { ConsoleWatcher } from './watchers/console-watcher';
export { WatcherManager } from './watchers/watcher-manager';

// Elements
export { SmartLocator, LocatorStrategy } from './elements/smart-locator';
export { ElementInteractor } from './elements/element-interactor';

// Engine
export { WorkerPool, WorkerTask, WorkerResult } from './engine/worker-pool';
export { TestExecutor, TestCase, TestResult } from './engine/test-executor';

// Coordination
export { FlowCoordinator, FlowStep, FlowResult } from './coordination/flow-coordinator';

// Patterns
export { PageObject } from './patterns/page-object';
export { DataProvider, TestData, DataSet, CsvParser } from './patterns/data-provider';

// Utils
export { Logger } from './utils/logger';
export { ErrorHandler, ErrorSeverity } from './utils/error-handler';
export { ReportGenerator, TestReport } from './utils/report-generator';
