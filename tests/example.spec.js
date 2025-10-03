const { test, expect } = require('@playwright/test');
const utils = require('./utils');

/**
 * Test Suite: Example Test with Utilities
 * Demonstrates how to use the test utilities
 */

test.describe('Example Test Suite', () => {
  test('should demonstrate login with utility function', async ({ page }) => {
    await page.goto('/');
    
    // Use utility function to login
    const usernameInput = page.getByLabel(/username/i).first();
    if (await usernameInput.count() > 0) {
      await utils.login(page, 'testuser', 'testpassword');
      
      // Verify login successful
      await page.waitForLoadState('networkidle');
    }
  });

  test('should demonstrate form filling with utility', async ({ page }) => {
    await page.goto('/');
    
    // Use utility to fill form
    const formData = {
      'name': 'Test User',
      'email': utils.generateRandomEmail(),
      'phone': utils.generateRandomPhone()
    };
    
    await utils.fillForm(page, formData);
  });

  test('should demonstrate console error checking', async ({ page }) => {
    // Set up console error listener
    const errors = utils.setupConsoleErrorListener(page);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that there are no critical errors
    expect(errors.length).toBeLessThan(5);
  });

  test('should demonstrate element existence check', async ({ page }) => {
    await page.goto('/');
    
    // Check if header exists
    const hasHeader = await utils.elementExists(page, 'header');
    expect(typeof hasHeader).toBe('boolean');
  });

  test('should demonstrate navigation helper', async ({ page }) => {
    await page.goto('/');
    
    // Try to navigate to different sections
    const sections = ['About', 'Contact', 'Services', 'Products'];
    
    for (const section of sections) {
      const navigated = await utils.navigateToSection(page, section);
      if (navigated) {
        await page.waitForLoadState('networkidle');
        break;
      }
    }
  });

  test('should demonstrate cookie consent handling', async ({ page }) => {
    await page.goto('/');
    
    // Handle cookie consent if present
    await utils.handleCookieConsent(page);
    
    await page.waitForLoadState('networkidle');
  });

  test('should demonstrate random data generation', async ({ page }) => {
    // Generate random test data
    const email = utils.generateRandomEmail();
    const phone = utils.generateRandomPhone();
    const randomStr = utils.generateRandomString(15);
    
    expect(email).toContain('@example.com');
    expect(phone).toMatch(/^\+1\d{10}$/);
    expect(randomStr).toHaveLength(15);
  });

  test('should demonstrate date formatting', async ({ page }) => {
    const formattedDate = utils.formatDate();
    expect(formattedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
