/**
 * EXAMPLE TEST 3: Flow Coordinator Test
 * Ví dụ sử dụng FlowCoordinator để điều phối test flow
 */

import { test, expect } from '../../src/core/base-test';
import { FlowCoordinator } from '../../src/coordination/flow-coordinator';
import { GoogleSearchPage } from './google-search.page';

test.describe('Google Search Tests - Flow Coordination', () => {
  test('should execute search flow with coordinator', async ({ page, watcherManager }) => {
    const googlePage = new GoogleSearchPage(page);
    const flowCoordinator = new FlowCoordinator(page, watcherManager);
    
    // Define flow steps
    flowCoordinator.addStep({
      name: 'Navigate to Google',
      action: async () => {
        await googlePage.navigate();
      },
      validation: async () => {
        const title = await googlePage.getTitle();
        return title.includes('Google');
      },
    });
    
    flowCoordinator.addStep({
      name: 'Perform search',
      action: async () => {
        await googlePage.search('Playwright test automation');
      },
      validation: async () => {
        const resultsCount = await googlePage.getResultsCount();
        return resultsCount > 0;
      },
    });
    
    flowCoordinator.addStep({
      name: 'Verify results',
      action: async () => {
        const firstResultTitle = await googlePage.getFirstResultTitle();
        expect(firstResultTitle).toBeTruthy();
      },
    });
    
    // Execute flow
    const result = await flowCoordinator.execute();
    
    // Verify flow executed successfully
    expect(result.success).toBe(true);
    expect(result.completedSteps.length).toBe(3);
    
    console.log('Flow Result:', {
      success: result.success,
      completedSteps: result.completedSteps,
      duration: result.duration,
      watcherSummary: result.watcherSummary,
    });
  });
  
  test('should handle flow errors gracefully', async ({ page, watcherManager }) => {
    const googlePage = new GoogleSearchPage(page);
    const flowCoordinator = new FlowCoordinator(page, watcherManager);
    
    flowCoordinator.addStep({
      name: 'Navigate to Google',
      action: async () => {
        await googlePage.navigate();
      },
    });
    
    flowCoordinator.addStep({
      name: 'Intentional failure',
      action: async () => {
        throw new Error('This is an intentional error for testing');
      },
      onError: async (error) => {
        console.log('Error handled:', error.message);
      },
    });
    
    const result = await flowCoordinator.execute();
    
    // Verify flow failed at the right step
    expect(result.success).toBe(false);
    expect(result.failedStep).toBe('Intentional failure');
    expect(result.completedSteps.length).toBe(1);
  });
});
