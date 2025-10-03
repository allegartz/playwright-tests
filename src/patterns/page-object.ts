/**
 * PHẦN 6: ADVANCED PATTERNS & OPTIMIZATIONS
 * Page Object Model Pattern
 * Base class cho Page Object Pattern
 */

import { Page, Locator } from '@playwright/test';
import { SmartLocator, LocatorStrategy } from '../elements/smart-locator';
import { ElementInteractor } from '../elements/element-interactor';
import { Logger } from '../utils/logger';

/**
 * Enhanced Page Object với Smart Element Handling
 */
export abstract class PageObject {
  protected page: Page;
  protected smartLocator: SmartLocator;
  protected interactor: ElementInteractor;
  protected logger: Logger;
  
  constructor(page: Page) {
    this.page = page;
    this.smartLocator = new SmartLocator(page);
    this.interactor = new ElementInteractor();
    this.logger = Logger.getInstance();
  }
  
  /**
   * Navigate to page
   */
  async navigate(url?: string): Promise<void> {
    const targetUrl = url || this.getUrl();
    this.logger.info(`Navigating to: ${targetUrl}`);
    await this.page.goto(targetUrl);
    await this.waitForPageLoad();
  }
  
  /**
   * Get page URL - mỗi page object phải implement
   */
  abstract getUrl(): string;
  
  /**
   * Wait for page to load - mỗi page object có thể override
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }
  
  /**
   * Find element với smart locator
   */
  async findElement(selector: string, strategy?: LocatorStrategy): Promise<Locator> {
    return await this.smartLocator.findElement(selector, { strategy });
  }
  
  /**
   * Click element
   */
  async clickElement(locator: Locator): Promise<void> {
    await this.interactor.click(locator);
  }
  
  /**
   * Fill element
   */
  async fillElement(locator: Locator, text: string): Promise<void> {
    await this.interactor.fill(locator, text);
  }
  
  /**
   * Get element text
   */
  async getElementText(locator: Locator): Promise<string> {
    return await this.interactor.getText(locator);
  }
  
  /**
   * Wait for element
   */
  async waitForElement(locator: Locator, state: 'visible' | 'hidden' = 'visible'): Promise<void> {
    await this.interactor.waitForState(locator, state);
  }
  
  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    const path = `test-results/screenshots/${name}-${Date.now()}.png`;
    await this.page.screenshot({ path, fullPage: true });
    this.logger.info(`Screenshot saved: ${path}`);
  }
  
  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }
  
  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
