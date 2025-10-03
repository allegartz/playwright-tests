/**
 * PHẦN 4: SMART ELEMENT HANDLING
 * Element Interactor
 * Xử lý tương tác với element có auto-retry
 */

import { Locator } from '@playwright/test';
import { Logger } from '../utils/logger';
import { ConfigManager } from '../core/config';

export interface InteractionOptions {
  retryAttempts?: number;
  retryDelay?: number;
  waitForStable?: boolean;
  force?: boolean;
}

export class ElementInteractor {
  private logger: Logger;
  private config: ConfigManager;
  
  constructor() {
    this.logger = Logger.getInstance();
    this.config = ConfigManager.getInstance();
  }
  
  /**
   * Click với auto-retry
   */
  async click(locator: Locator, options: InteractionOptions = {}): Promise<void> {
    const retryAttempts = options.retryAttempts || this.config.getConfig().elements.retryAttempts;
    const retryDelay = options.retryDelay || this.config.getConfig().elements.retryDelay;
    
    await this.retryOperation(
      async () => {
        await locator.click({ force: options.force });
        this.logger.debug('Click successful');
      },
      retryAttempts,
      retryDelay,
      'click'
    );
  }
  
  /**
   * Fill với auto-retry
   */
  async fill(locator: Locator, text: string, options: InteractionOptions = {}): Promise<void> {
    const retryAttempts = options.retryAttempts || this.config.getConfig().elements.retryAttempts;
    const retryDelay = options.retryDelay || this.config.getConfig().elements.retryDelay;
    
    await this.retryOperation(
      async () => {
        await locator.fill(text, { force: options.force });
        this.logger.debug(`Fill successful: ${text}`);
      },
      retryAttempts,
      retryDelay,
      'fill'
    );
  }
  
  /**
   * Select option với auto-retry
   */
  async selectOption(locator: Locator, value: string | string[], options: InteractionOptions = {}): Promise<void> {
    const retryAttempts = options.retryAttempts || this.config.getConfig().elements.retryAttempts;
    const retryDelay = options.retryDelay || this.config.getConfig().elements.retryDelay;
    
    await this.retryOperation(
      async () => {
        await locator.selectOption(value, { force: options.force });
        this.logger.debug('Select option successful');
      },
      retryAttempts,
      retryDelay,
      'selectOption'
    );
  }
  
  /**
   * Check/Uncheck với auto-retry
   */
  async setChecked(locator: Locator, checked: boolean, options: InteractionOptions = {}): Promise<void> {
    const retryAttempts = options.retryAttempts || this.config.getConfig().elements.retryAttempts;
    const retryDelay = options.retryDelay || this.config.getConfig().elements.retryDelay;
    
    await this.retryOperation(
      async () => {
        await locator.setChecked(checked, { force: options.force });
        this.logger.debug(`Set checked: ${checked}`);
      },
      retryAttempts,
      retryDelay,
      'setChecked'
    );
  }
  
  /**
   * Hover với auto-retry
   */
  async hover(locator: Locator, options: InteractionOptions = {}): Promise<void> {
    const retryAttempts = options.retryAttempts || this.config.getConfig().elements.retryAttempts;
    const retryDelay = options.retryDelay || this.config.getConfig().elements.retryDelay;
    
    await this.retryOperation(
      async () => {
        await locator.hover({ force: options.force });
        this.logger.debug('Hover successful');
      },
      retryAttempts,
      retryDelay,
      'hover'
    );
  }
  
  /**
   * Get text với auto-retry
   */
  async getText(locator: Locator, options: InteractionOptions = {}): Promise<string> {
    const retryAttempts = options.retryAttempts || this.config.getConfig().elements.retryAttempts;
    const retryDelay = options.retryDelay || this.config.getConfig().elements.retryDelay;
    
    return await this.retryOperation(
      async () => {
        const text = await locator.textContent();
        this.logger.debug(`Get text successful: ${text}`);
        return text || '';
      },
      retryAttempts,
      retryDelay,
      'getText'
    );
  }
  
  /**
   * Wait for element state
   */
  async waitForState(
    locator: Locator,
    state: 'visible' | 'hidden' | 'attached' | 'detached',
    timeout?: number
  ): Promise<void> {
    await locator.waitFor({ state, timeout });
    this.logger.debug(`Element state: ${state}`);
  }
  
  /**
   * Generic retry operation
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    retryAttempts: number,
    retryDelay: number,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`${operationName} failed, attempt ${attempt}/${retryAttempts}`);
        
        if (attempt < retryAttempts) {
          await this.sleep(retryDelay);
        }
      }
    }
    
    this.logger.error(`${operationName} failed after ${retryAttempts} attempts`, lastError);
    throw lastError;
  }
  
  /**
   * Sleep utility
   */
  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
