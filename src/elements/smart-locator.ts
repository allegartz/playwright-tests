/**
 * PHẦN 4: SMART ELEMENT HANDLING
 * Smart Locator Strategies
 * Xử lý thông minh element với nhiều strategies
 */

import { Page, Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config';

export enum LocatorStrategy {
  CSS = 'css',
  XPATH = 'xpath',
  TEXT = 'text',
  ROLE = 'role',
  TEST_ID = 'testid',
  LABEL = 'label',
  PLACEHOLDER = 'placeholder',
}

export interface SmartLocatorOptions {
  strategy?: LocatorStrategy;
  timeout?: number;
  autoRetry?: boolean;
  waitForStable?: boolean;
  fallbackStrategies?: LocatorStrategy[];
}

export class SmartLocator {
  private page: Page;
  private logger: Logger;
  private config: ConfigManager;
  
  constructor(page: Page) {
    this.page = page;
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
  }
  
  /**
   * Tìm element với smart strategies
   * Tự động thử nhiều strategies nếu không tìm thấy
   */
  async findElement(
    selector: string,
    options: SmartLocatorOptions = {}
  ): Promise<Locator> {
    const strategy = options.strategy || LocatorStrategy.CSS;
    const fallbacks = options.fallbackStrategies || [];
    
    this.logger.debug(`Finding element with strategy: ${strategy}, selector: ${selector}`);
    
    // Try primary strategy
    try {
      const locator = this.getLocatorByStrategy(selector, strategy);
      await this.waitForElementStable(locator, options);
      return locator;
    } catch (error) {
      this.logger.warn(`Failed to find element with ${strategy}: ${selector}`);
      
      // Try fallback strategies
      for (const fallbackStrategy of fallbacks) {
        try {
          this.logger.debug(`Trying fallback strategy: ${fallbackStrategy}`);
          const locator = this.getLocatorByStrategy(selector, fallbackStrategy);
          await this.waitForElementStable(locator, options);
          this.logger.info(`Found element with fallback strategy: ${fallbackStrategy}`);
          return locator;
        } catch (fallbackError) {
          this.logger.debug(`Fallback strategy ${fallbackStrategy} failed`);
        }
      }
      
      throw new Error(`Failed to find element: ${selector}`);
    }
  }
  
  /**
   * Get locator based on strategy
   */
  private getLocatorByStrategy(selector: string, strategy: LocatorStrategy): Locator {
    switch (strategy) {
      case LocatorStrategy.CSS:
        return this.page.locator(selector);
      
      case LocatorStrategy.XPATH:
        return this.page.locator(`xpath=${selector}`);
      
      case LocatorStrategy.TEXT:
        return this.page.getByText(selector);
      
      case LocatorStrategy.ROLE:
        return this.page.getByRole(selector as any);
      
      case LocatorStrategy.TEST_ID:
        return this.page.getByTestId(selector);
      
      case LocatorStrategy.LABEL:
        return this.page.getByLabel(selector);
      
      case LocatorStrategy.PLACEHOLDER:
        return this.page.getByPlaceholder(selector);
      
      default:
        return this.page.locator(selector);
    }
  }
  
  /**
   * Wait for element to be stable (không thay đổi vị trí)
   */
  private async waitForElementStable(
    locator: Locator,
    options: SmartLocatorOptions
  ): Promise<void> {
    const timeout = options.timeout || this.config.getConfig().browser.defaultTimeout;
    
    // Wait for visible
    await locator.waitFor({ state: 'visible', timeout });
    
    // Wait for stable if enabled
    if (options.waitForStable !== false && this.config.getConfig().elements.waitForStable) {
      await this.page.waitForTimeout(100); // Small delay
      
      // Check if element is stable (position không đổi)
      const box1 = await locator.boundingBox();
      await this.page.waitForTimeout(50);
      const box2 = await locator.boundingBox();
      
      if (box1 && box2) {
        const isStable = 
          box1.x === box2.x && 
          box1.y === box2.y && 
          box1.width === box2.width && 
          box1.height === box2.height;
        
        if (!isStable) {
          this.logger.debug('Element not stable, waiting...');
          await this.page.waitForTimeout(200);
        }
      }
    }
  }
  
  /**
   * Find multiple elements
   */
  async findElements(
    selector: string,
    options: SmartLocatorOptions = {}
  ): Promise<Locator> {
    const strategy = options.strategy || LocatorStrategy.CSS;
    return this.getLocatorByStrategy(selector, strategy);
  }
  
  /**
   * Check if element exists
   */
  async elementExists(selector: string, strategy: LocatorStrategy = LocatorStrategy.CSS): Promise<boolean> {
    try {
      const locator = this.getLocatorByStrategy(selector, strategy);
      await locator.waitFor({ state: 'attached', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}
