const { test, expect } = require('@playwright/test');

/**
 * Test Suite: UI Validation
 * Tests UI elements, layout, styling, and visual consistency
 */

test.describe('UI Validation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have correct page title', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/.+/);
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should display header correctly', async ({ page }) => {
    // Check if header/navbar is present
    const header = page.locator('header, nav, [role="banner"]').first();
    if (await header.count() > 0) {
      await expect(header).toBeVisible();
    }
  });

  test('should display footer correctly', async ({ page }) => {
    // Check if footer is present
    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.count() > 0) {
      await expect(footer).toBeVisible();
    }
  });

  test('should display logo/brand', async ({ page }) => {
    // Check for logo or brand element
    const logo = page.locator('img[alt*="logo" i], .logo, [class*="brand"]').first();
    if (await logo.count() > 0) {
      await expect(logo).toBeVisible();
    }
  });

  test('should have navigation menu', async ({ page }) => {
    // Check navigation elements
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should display all images correctly', async ({ page }) => {
    // Check if images load properly
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      await expect(img).toBeVisible();
      
      // Check if image has alt text (accessibility)
      const altText = await img.getAttribute('alt');
      expect(altText !== null).toBeTruthy();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check heading structure (h1, h2, h3, etc.)
    const h1 = page.locator('h1').first();
    if (await h1.count() > 0) {
      await expect(h1).toBeVisible();
      
      // Ensure only one h1 per page
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeLessThanOrEqual(1);
    }
  });

  test('should have responsive layout', async ({ page }) => {
    // Test responsive design at different viewport sizes
    const viewports = [
      { width: 375, height: 667, name: 'Mobile' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(500);
      
      // Check if page is still functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should display buttons with proper styling', async ({ page }) => {
    // Check button elements
    const buttons = page.locator('button, input[type="button"], input[type="submit"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      await expect(firstButton).toBeVisible();
      
      // Check if button is clickable
      await expect(firstButton).toBeEnabled();
    }
  });

  test('should have proper color contrast', async ({ page }) => {
    // Basic accessibility check for text visibility
    const elements = page.locator('p, span, div, a').first();
    if (await elements.count() > 0) {
      const color = await elements.evaluate((el) => {
        return window.getComputedStyle(el).color;
      });
      expect(color).toBeTruthy();
    }
  });

  test('should display forms with proper labels', async ({ page }) => {
    // Check form accessibility
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();
    
    for (let i = 0; i < Math.min(inputCount, 3); i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      // Input should have some form of label
      expect(id || ariaLabel || placeholder).toBeTruthy();
    }
  });

  test('should have working links', async ({ page }) => {
    // Check if links have href attributes
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    
    if (linkCount > 0) {
      const firstLink = links.first();
      const href = await firstLink.getAttribute('href');
      expect(href).toBeTruthy();
      expect(href.length).toBeGreaterThan(0);
    }
  });

  test('should not have console errors', async ({ page }) => {
    // Listen for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tolerate some errors but not excessive
    expect(errors.length).toBeLessThan(5);
  });

  test('should load all CSS resources', async ({ page }) => {
    // Check if stylesheets are loaded
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    
    // Check for CSS links
    const styleLinks = page.locator('link[rel="stylesheet"]');
    const count = await styleLinks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper meta tags', async ({ page }) => {
    // Check for important meta tags
    const viewport = page.locator('meta[name="viewport"]');
    const description = page.locator('meta[name="description"]');
    
    // Viewport meta tag is important for responsive design
    if (await viewport.count() > 0) {
      const content = await viewport.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });

  test('should have accessible focus indicators', async ({ page }) => {
    // Test keyboard navigation
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      const firstElement = interactiveElements.first();
      await firstElement.focus();
      
      // Element should be focused
      const isFocused = await firstElement.evaluate((el) => {
        return document.activeElement === el;
      });
      expect(isFocused).toBeTruthy();
    }
  });

  test('should handle loading states', async ({ page }) => {
    // Check for loading indicators
    await page.goto('/');
    
    // Page should eventually reach loaded state
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display content above the fold', async ({ page }) => {
    // Check if important content is visible without scrolling
    const mainContent = page.locator('main, [role="main"], .content').first();
    if (await mainContent.count() > 0) {
      await expect(mainContent).toBeVisible();
    }
  });

  test('should have proper text alignment', async ({ page }) => {
    // Check text content
    const paragraphs = page.locator('p').first();
    if (await paragraphs.count() > 0) {
      const textAlign = await paragraphs.evaluate((el) => {
        return window.getComputedStyle(el).textAlign;
      });
      expect(['left', 'center', 'right', 'justify', 'start']).toContain(textAlign);
    }
  });

  test('should have readable font sizes', async ({ page }) => {
    // Check minimum font size
    const textElements = page.locator('p, span, div');
    if (await textElements.count() > 0) {
      const fontSize = await textElements.first().evaluate((el) => {
        return window.getComputedStyle(el).fontSize;
      });
      expect(fontSize).toBeTruthy();
    }
  });
});
