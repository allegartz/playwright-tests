/**
 * PHẦN 1: CORE CONCEPT
 * Base Test Class
 * Class cha cho tất cả test cases, setup/teardown hooks
 */

import { test as base, Page, Browser, BrowserContext } from '@playwright/test';
import { ConfigManager } from './config';
import { Logger } from '../utils/logger';
import { WatcherManager } from '../watchers/watcher-manager';

/**
 * Custom test fixtures
 * Extend Playwright test với custom fixtures
 */
export const test = base.extend<{
  logger: Logger;
  config: ConfigManager;
  watcherManager: WatcherManager;
}>({
  // Logger fixture
  logger: async ({}, use) => {
    const logger = Logger.getInstance();
    await use(logger);
  },
  
  // Config fixture
  config: async ({}, use) => {
    const config = ConfigManager.getInstance();
    await use(config);
  },
  
  // Watcher Manager fixture
  watcherManager: async ({ page }, use) => {
    const watcherManager = new WatcherManager(page);
    await watcherManager.initialize();
    await use(watcherManager);
    await watcherManager.cleanup();
  },
});

/**
 * Base Test Class
 * Cung cấp setup và teardown hooks
 */
export abstract class BaseTest {
  protected page!: Page;
  protected browser!: Browser;
  protected context!: BrowserContext;
  protected config: ConfigManager;
  protected logger: Logger;
  
  constructor() {
    this.config = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }
  
  /**
   * Setup trước mỗi test
   * Override method này để custom setup
   */
  async beforeEach(page: Page, context: BrowserContext): Promise<void> {
    this.page = page;
    this.context = context;
    this.logger.info('Test started');
  }
  
  /**
   * Teardown sau mỗi test
   * Override method này để custom teardown
   */
  async afterEach(): Promise<void> {
    // Take screenshot on failure
    if (this.config.getConfig().reporting.screenshots) {
      await this.page.screenshot({
        path: `${this.config.getConfig().reporting.reportPath}/screenshots/final-${Date.now()}.png`,
      });
    }
    this.logger.info('Test completed');
  }
  
  /**
   * Setup trước tất cả tests trong suite
   */
  async beforeAll(): Promise<void> {
    this.logger.info('Test suite started');
  }
  
  /**
   * Teardown sau tất cả tests trong suite
   */
  async afterAll(): Promise<void> {
    this.logger.info('Test suite completed');
  }
}

/**
 * Export các utilities
 */
export { expect } from '@playwright/test';
