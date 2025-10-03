/**
 * EXAMPLE TEST 2: Test với Watchers
 * Ví dụ sử dụng WatcherManager để theo dõi events
 */

import { test, expect } from '../../src/core/base-test';
import { GoogleSearchPage } from './google-search.page';
import { NetworkWatcher } from '../../src/watchers/network-watcher';

test.describe('Google Search Tests - With Watchers', () => {
  test('should track network requests during search', async ({ page, watcherManager }) => {
    const googlePage = new GoogleSearchPage(page);
    
    // Navigate to Google
    await googlePage.navigate();
    
    // Start watchers
    await watcherManager.startAll();
    
    // Perform search
    await googlePage.search('Playwright framework');
    
    // Stop watchers
    await watcherManager.stopAll();
    
    // Get network watcher
    const networkWatcher = watcherManager.getWatcher<NetworkWatcher>('network');
    
    if (networkWatcher) {
      const events = networkWatcher.getEvents();
      console.log(`Total network requests: ${events.length}`);
      
      // Verify some network requests were made
      expect(events.length).toBeGreaterThan(0);
      
      // Check average response time
      const avgResponseTime = networkWatcher.getAverageResponseTime();
      console.log(`Average response time: ${avgResponseTime}ms`);
    }
    
    // Get summary
    const summary = watcherManager.getSummary();
    console.log('Watcher Summary:', summary);
  });
  
  test('should detect failed requests', async ({ page, watcherManager }) => {
    const googlePage = new GoogleSearchPage(page);
    
    await googlePage.navigate();
    await watcherManager.startAll();
    
    // Perform search
    await googlePage.search('Test framework');
    
    await watcherManager.stopAll();
    
    const networkWatcher = watcherManager.getWatcher<NetworkWatcher>('network');
    
    if (networkWatcher) {
      const failedRequests = networkWatcher.getFailedRequests();
      console.log(`Failed requests: ${failedRequests.length}`);
      
      // Log failed requests details
      failedRequests.forEach((req) => {
        console.log(`Failed: ${req.data.url} - Status: ${req.data.status}`);
      });
    }
  });
});
