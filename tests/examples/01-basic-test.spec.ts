/**
 * EXAMPLE TEST 1: Basic Test với Framework
 * Ví dụ sử dụng các tính năng cơ bản của framework
 */

import { test, expect } from '../../src/core/base-test';
import { GoogleSearchPage } from './google-search.page';

test.describe('Google Search Tests - Basic Example', () => {
  test('should perform a simple search', async ({ page }) => {
    // Initialize page object
    const googlePage = new GoogleSearchPage(page);
    
    // Navigate to Google
    await googlePage.navigate();
    
    // Perform search
    await googlePage.search('Playwright automation');
    
    // Verify results
    const resultsCount = await googlePage.getResultsCount();
    expect(resultsCount).toBeGreaterThan(0);
    
    // Take screenshot
    await googlePage.takeScreenshot('search-results');
  });
  
  test('should display search results title', async ({ page }) => {
    const googlePage = new GoogleSearchPage(page);
    
    await googlePage.navigate();
    await googlePage.search('TypeScript testing');
    
    const firstResultTitle = await googlePage.getFirstResultTitle();
    expect(firstResultTitle).toBeTruthy();
  });
});
