/**
 * EXAMPLE: Page Object cho Google Search
 * Ví dụ sử dụng PageObject pattern
 */

import { Page } from '@playwright/test';
import { PageObject } from '../../src/patterns/page-object';
import { LocatorStrategy } from '../../src/elements/smart-locator';

export class GoogleSearchPage extends PageObject {
  // Selectors
  private readonly SEARCH_INPUT = 'textarea[name="q"]';
  private readonly SEARCH_BUTTON = 'input[value="Google Search"]';
  private readonly SEARCH_RESULTS = '#search';
  
  constructor(page: Page) {
    super(page);
  }
  
  /**
   * Get URL của page
   */
  getUrl(): string {
    return 'https://www.google.com';
  }
  
  /**
   * Wait for page load
   */
  async waitForPageLoad(): Promise<void> {
    await super.waitForPageLoad();
    const searchInput = await this.findElement(this.SEARCH_INPUT, LocatorStrategy.CSS);
    await this.waitForElement(searchInput);
  }
  
  /**
   * Perform search
   */
  async search(query: string): Promise<void> {
    this.logger.info(`Searching for: ${query}`);
    
    // Find search input
    const searchInput = await this.findElement(this.SEARCH_INPUT, LocatorStrategy.CSS);
    
    // Fill search query
    await this.fillElement(searchInput, query);
    
    // Press Enter
    await this.page.keyboard.press('Enter');
    
    // Wait for results
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Get search results count
   */
  async getResultsCount(): Promise<number> {
    const results = this.page.locator('#search .g');
    return await results.count();
  }
  
  /**
   * Get first result title
   */
  async getFirstResultTitle(): Promise<string> {
    const firstResult = this.page.locator('#search .g h3').first();
    return await firstResult.textContent() || '';
  }
}
