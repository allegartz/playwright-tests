/**
 * EXAMPLE TEST 4: Data-Driven Test
 * Ví dụ sử dụng DataProvider cho data-driven testing
 */

import { test, expect } from '../../src/core/base-test';
import { DataProvider } from '../../src/patterns/data-provider';
import { GoogleSearchPage } from './google-search.page';

test.describe('Google Search Tests - Data Driven', () => {
  test('should search with multiple queries', async ({ page }) => {
    const googlePage = new GoogleSearchPage(page);
    const dataProvider = new DataProvider();
    
    // Load test data
    dataProvider.loadData('search-test', [
      { query: 'Playwright automation', minResults: 5 },
      { query: 'TypeScript testing', minResults: 5 },
      { query: 'Web automation framework', minResults: 5 },
    ]);
    
    // Execute test with each dataset
    await dataProvider.executeWithData('search-test', async (data) => {
      console.log(`Testing with query: ${data.query}`);
      
      await googlePage.navigate();
      await googlePage.search(data.query);
      
      const resultsCount = await googlePage.getResultsCount();
      expect(resultsCount).toBeGreaterThanOrEqual(data.minResults);
      
      console.log(`Query: "${data.query}" - Results: ${resultsCount}`);
    });
  });
});
