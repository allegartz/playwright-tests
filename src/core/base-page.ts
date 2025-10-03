/**
 * PHẦN 1: CORE CONCEPT
 * Base Page Object
 * Class cha cho tất cả Page Objects, cung cấp các method cơ bản
 */

import { Page, Locator } from '@playwright/test';
import { ConfigManager } from './config';
import { Logger } from '../utils/logger';

export abstract class BasePage {
  protected page: Page;
  protected config: ConfigManager;
  protected logger: Logger;
  
  /**
   * Constructor
   * @param page - Playwright Page object
   */
  constructor(page: Page) {
    this.page = page;
    this.config = ConfigManager.getInstance();
    this.logger = Logger.getInstance();
  }
  
  /**
   * Navigate đến URL
   * @param url - URL để navigate
   */
  async navigate(url: string): Promise<void> {
    this.logger.info(`Navigating to: ${url}`);
    await this.page.goto(url, {
      timeout: this.config.getConfig().browser.navigationTimeout,
      waitUntil: 'domcontentloaded',
    });
  }
  
  /**
   * Lấy page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
  
  /**
   * Lấy current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
  
  /**
   * Wait for element to be visible
   * @param locator - Playwright Locator
   * @param timeout - Optional timeout
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({
      state: 'visible',
      timeout: timeout || this.config.getConfig().browser.defaultTimeout,
    });
  }
  
  /**
   * Click on element
   * @param locator - Playwright Locator
   */
  async click(locator: Locator): Promise<void> {
    this.logger.debug('Clicking element');
    await this.waitForElement(locator);
    await locator.click();
  }
  
  /**
   * Fill text into element
   * @param locator - Playwright Locator
   * @param text - Text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    this.logger.debug(`Filling text: ${text}`);
    await this.waitForElement(locator);
    await locator.fill(text);
  }
  
  /**
   * Get text from element
   * @param locator - Playwright Locator
   */
  async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }
  
  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    const config = this.config.getConfig();
    if (config.reporting.screenshots) {
      const path = `${config.reporting.reportPath}/screenshots/${name}.png`;
      await this.page.screenshot({ path, fullPage: true });
      this.logger.info(`Screenshot saved: ${path}`);
    }
  }
  
  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Execute JavaScript
   * @param script - JavaScript code to execute
   */
  async executeScript<T>(script: string | Function): Promise<T> {
    return await this.page.evaluate(script);
  }
  
  /**
   * Abstract method - mỗi page phải implement
   * Validate rằng page đã load đúng
   */
  abstract isLoaded(): Promise<boolean>;
}
