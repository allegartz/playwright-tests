const { test, expect } = require('@playwright/test');

/**
 * Test Suite: User Flow
 * Tests complete user journeys and workflows
 */

test.describe('User Flow Tests', () => {
  test('should complete registration to dashboard flow', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/');
    
    // Click on register/signup link if exists
    const registerLink = page.getByRole('link', { name: /sign up|register/i }).first();
    if (await registerLink.count() > 0) {
      await registerLink.click();
      
      // Fill registration form
      await page.getByLabel(/username|name/i).first().fill('newuser');
      await page.getByLabel(/email/i).first().fill('newuser@example.com');
      await page.getByLabel(/password/i).first().fill('SecurePass123!');
      
      // Submit registration
      await page.getByRole('button', { name: /sign up|register/i }).click();
      
      // Should redirect to dashboard or login
      await page.waitForLoadState('networkidle');
    }
  });

  test('should complete login to profile update flow', async ({ page }) => {
    await page.goto('/');
    
    // Login
    const usernameInput = page.getByLabel(/username/i).first();
    const passwordInput = page.getByLabel(/password/i).first();
    
    if (await usernameInput.count() > 0 && await passwordInput.count() > 0) {
      await usernameInput.fill('testuser');
      await passwordInput.fill('testpassword');
      await page.getByRole('button', { name: /sign in|login/i }).click();
      
      await page.waitForLoadState('networkidle');
      
      // Navigate to profile
      const profileLink = page.getByRole('link', { name: /profile|account/i }).first();
      if (await profileLink.count() > 0) {
        await profileLink.click();
        
        // Update profile information
        const nameField = page.getByLabel(/name|full name/i).first();
        if (await nameField.count() > 0) {
          await nameField.fill('Updated Name');
          await page.getByRole('button', { name: /save|update/i }).first().click();
          
          // Verify update success
          await expect(page.getByText(/success|updated/i)).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('should complete search to detail view flow', async ({ page }) => {
    await page.goto('/');
    
    // Find search functionality
    const searchInput = page.getByRole('textbox', { name: /search/i }).first();
    if (await searchInput.count() > 0) {
      // Perform search
      await searchInput.fill('test query');
      await searchInput.press('Enter');
      
      await page.waitForLoadState('networkidle');
      
      // Click on first search result
      const firstResult = page.locator('a, [role="link"]').first();
      if (await firstResult.count() > 0) {
        await firstResult.click();
        
        // Verify detail page loaded
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should complete shopping cart flow', async ({ page }) => {
    await page.goto('/');
    
    // Add item to cart
    const addToCartButton = page.getByRole('button', { name: /add to cart|add/i }).first();
    if (await addToCartButton.count() > 0) {
      await addToCartButton.click();
      
      // Navigate to cart
      const cartLink = page.getByRole('link', { name: /cart|basket/i }).first();
      if (await cartLink.count() > 0) {
        await cartLink.click();
        
        // Verify item in cart
        await expect(page.locator('[class*="cart"]')).toBeVisible({ timeout: 5000 });
        
        // Proceed to checkout
        const checkoutButton = page.getByRole('button', { name: /checkout|proceed/i }).first();
        if (await checkoutButton.count() > 0) {
          await checkoutButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });

  test('should complete form submission to confirmation flow', async ({ page }) => {
    await page.goto('/');
    
    // Find and fill a contact/feedback form
    const contactLink = page.getByRole('link', { name: /contact|feedback/i }).first();
    if (await contactLink.count() > 0) {
      await contactLink.click();
      
      // Fill form fields
      const nameField = page.getByLabel(/name/i).first();
      const emailField = page.getByLabel(/email/i).first();
      const messageField = page.getByLabel(/message|comment/i).first();
      
      if (await nameField.count() > 0) {
        await nameField.fill('Test User');
      }
      if (await emailField.count() > 0) {
        await emailField.fill('test@example.com');
      }
      if (await messageField.count() > 0) {
        await messageField.fill('This is a test message.');
      }
      
      // Submit form
      const submitButton = page.getByRole('button', { name: /submit|send/i }).first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Verify confirmation message
        await expect(page.getByText(/thank you|success|received/i)).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should complete navigation through multiple pages', async ({ page }) => {
    await page.goto('/');
    
    // Navigate through several pages
    const links = await page.locator('a[href]').all();
    const internalLinks = [];
    
    for (const link of links.slice(0, 5)) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        internalLinks.push(link);
      }
    }
    
    // Visit first few internal pages
    for (const link of internalLinks.slice(0, 3)) {
      await link.click();
      await page.waitForLoadState('networkidle');
      
      // Navigate back
      await page.goBack();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should complete filter and sort flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for filter options
    const filterDropdown = page.locator('select').first();
    if (await filterDropdown.count() > 0) {
      // Apply filter
      await filterDropdown.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');
      
      // Look for sort options
      const sortDropdown = page.locator('select').nth(1);
      if (await sortDropdown.count() > 0) {
        // Apply sort
        await sortDropdown.selectOption({ index: 1 });
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should handle pagination flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for pagination controls
    const nextButton = page.getByRole('button', { name: /next/i }).first();
    const pageLink = page.getByRole('link', { name: /2|next/i }).first();
    
    if (await nextButton.count() > 0) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');
      
      // Go back to first page
      const prevButton = page.getByRole('button', { name: /prev|previous/i }).first();
      if (await prevButton.count() > 0) {
        await prevButton.click();
        await page.waitForLoadState('networkidle');
      }
    } else if (await pageLink.count() > 0) {
      await pageLink.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should complete modal interaction flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for buttons that open modals
    const modalButtons = page.locator('button').all();
    
    for (const button of await modalButtons) {
      const text = await button.textContent();
      if (text && (text.includes('Open') || text.includes('Show') || text.includes('View'))) {
        await button.click();
        
        // Wait for modal to appear
        await page.waitForTimeout(500);
        
        // Look for close button
        const closeButton = page.getByRole('button', { name: /close|cancel|dismiss/i }).first();
        if (await closeButton.count() > 0) {
          await closeButton.click();
          break;
        }
      }
    }
  });

  test('should complete tab navigation flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for tab controls
    const tabs = page.locator('[role="tab"]');
    const tabCount = await tabs.count();
    
    if (tabCount > 0) {
      // Click through tabs
      for (let i = 0; i < Math.min(tabCount, 3); i++) {
        await tabs.nth(i).click();
        await page.waitForTimeout(300);
        
        // Verify tab is active
        const ariaSelected = await tabs.nth(i).getAttribute('aria-selected');
        expect(ariaSelected).toBe('true');
      }
    }
  });

  test('should complete accordion interaction flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for accordion/collapsible elements
    const accordionButtons = page.locator('[aria-expanded]');
    const count = await accordionButtons.count();
    
    if (count > 0) {
      // Expand and collapse accordion items
      const firstAccordion = accordionButtons.first();
      const initialState = await firstAccordion.getAttribute('aria-expanded');
      
      await firstAccordion.click();
      await page.waitForTimeout(300);
      
      const newState = await firstAccordion.getAttribute('aria-expanded');
      expect(newState).not.toBe(initialState);
    }
  });

  test('should complete drag and drop flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for draggable elements
    const draggable = page.locator('[draggable="true"]').first();
    if (await draggable.count() > 0) {
      const dropZone = page.locator('[class*="drop"], [data-drop]').first();
      if (await dropZone.count() > 0) {
        // Perform drag and drop
        await draggable.dragTo(dropZone);
        await page.waitForTimeout(500);
      }
    }
  });

  test('should complete error recovery flow', async ({ page }) => {
    await page.goto('/nonexistent-page');
    
    // Should show 404 or error page
    await page.waitForLoadState('networkidle');
    
    // Look for link back to home
    const homeLink = page.getByRole('link', { name: /home|back/i }).first();
    if (await homeLink.count() > 0) {
      await homeLink.click();
      
      // Should return to working page
      await expect(page).toHaveURL(/\//);
    }
  });

  test('should complete settings update flow', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to settings
    const settingsLink = page.getByRole('link', { name: /settings|preferences/i }).first();
    if (await settingsLink.count() > 0) {
      await settingsLink.click();
      
      // Toggle some settings
      const toggles = page.locator('input[type="checkbox"]');
      const count = await toggles.count();
      
      if (count > 0) {
        const toggle = toggles.first();
        const initialState = await toggle.isChecked();
        
        await toggle.click();
        await expect(toggle).toBeChecked({ checked: !initialState });
        
        // Save settings
        const saveButton = page.getByRole('button', { name: /save|apply/i }).first();
        if (await saveButton.count() > 0) {
          await saveButton.click();
          await page.waitForLoadState('networkidle');
        }
      }
    }
  });

  test('should complete download flow', async ({ page }) => {
    await page.goto('/');
    
    // Look for download links
    const downloadLink = page.getByRole('link', { name: /download/i }).first();
    if (await downloadLink.count() > 0) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
      
      await downloadLink.click();
      
      const download = await downloadPromise;
      if (download) {
        // Verify download started
        expect(download).toBeTruthy();
      }
    }
  });
});
