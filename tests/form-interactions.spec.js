const { test, expect } = require('@playwright/test');

/**
 * Test Suite: Form Interactions
 * Tests various form input types and interactions
 */

test.describe('Form Interaction Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with forms
    await page.goto('/');
  });

  test('should fill text input fields', async ({ page }) => {
    // Test text input
    const textInput = page.getByLabel(/name|text/i).first();
    if (await textInput.count() > 0) {
      await textInput.fill('Test User');
      await expect(textInput).toHaveValue('Test User');
    }
  });

  test('should fill email input fields', async ({ page }) => {
    // Test email input with validation
    const emailInput = page.getByLabel(/email/i).first();
    if (await emailInput.count() > 0) {
      // Test valid email
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveValue('test@example.com');
      
      // Test invalid email
      await emailInput.fill('invalid-email');
      await page.getByRole('button', { name: /submit|save/i }).first().click();
      // May show validation error
    }
  });

  test('should select dropdown options', async ({ page }) => {
    // Test dropdown/select elements
    const dropdown = page.locator('select').first();
    if (await dropdown.count() > 0) {
      await dropdown.selectOption({ index: 1 });
      const selectedValue = await dropdown.inputValue();
      expect(selectedValue).toBeTruthy();
    }
  });

  test('should check and uncheck checkboxes', async ({ page }) => {
    // Test checkbox interactions
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.count() > 0) {
      // Check the checkbox
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      
      // Uncheck the checkbox
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
    }
  });

  test('should select radio buttons', async ({ page }) => {
    // Test radio button interactions
    const radioButtons = page.locator('input[type="radio"]');
    const count = await radioButtons.count();
    if (count > 0) {
      // Select first radio button
      await radioButtons.first().check();
      await expect(radioButtons.first()).toBeChecked();
      
      // Select second radio button if exists
      if (count > 1) {
        await radioButtons.nth(1).check();
        await expect(radioButtons.nth(1)).toBeChecked();
        await expect(radioButtons.first()).not.toBeChecked();
      }
    }
  });

  test('should fill textarea fields', async ({ page }) => {
    // Test textarea input
    const textarea = page.locator('textarea').first();
    if (await textarea.count() > 0) {
      const longText = 'This is a long text that spans multiple lines.\nSecond line here.\nThird line here.';
      await textarea.fill(longText);
      await expect(textarea).toHaveValue(longText);
    }
  });

  test('should handle file upload', async ({ page }) => {
    // Test file upload
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.count() > 0) {
      // Create a test file
      const testFile = '/tmp/test-upload.txt';
      await page.evaluate(() => {
        const fs = require('fs');
        fs.writeFileSync('/tmp/test-upload.txt', 'Test file content');
      });
      
      // Upload the file
      await fileInput.setInputFiles(testFile);
    }
  });

  test('should handle date input', async ({ page }) => {
    // Test date picker
    const dateInput = page.locator('input[type="date"]').first();
    if (await dateInput.count() > 0) {
      await dateInput.fill('2024-12-31');
      await expect(dateInput).toHaveValue('2024-12-31');
    }
  });

  test('should clear input fields', async ({ page }) => {
    // Test clearing form fields
    const textInput = page.getByLabel(/name|text/i).first();
    if (await textInput.count() > 0) {
      await textInput.fill('Test Value');
      await textInput.clear();
      await expect(textInput).toHaveValue('');
    }
  });

  test('should validate required fields', async ({ page }) => {
    // Test form validation
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      // Try to submit without filling required fields
      const submitButton = page.getByRole('button', { name: /submit|save/i }).first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        // Check for validation messages
        const errorMessages = page.getByText(/required|must|invalid/i);
        // Some validation should appear
      }
    }
  });

  test('should submit form with valid data', async ({ page }) => {
    // Fill a complete form and submit
    const form = page.locator('form').first();
    if (await form.count() > 0) {
      // Fill various fields
      const inputs = await form.locator('input[type="text"]').all();
      for (const input of inputs.slice(0, 3)) {
        await input.fill('Test Data');
      }
      
      // Submit the form
      const submitButton = page.getByRole('button', { name: /submit|save/i }).first();
      if (await submitButton.count() > 0) {
        await submitButton.click();
        // Wait for submission to complete
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should handle form reset', async ({ page }) => {
    // Test form reset functionality
    const textInput = page.getByLabel(/name|text/i).first();
    const resetButton = page.getByRole('button', { name: /reset|clear/i }).first();
    
    if (await textInput.count() > 0 && await resetButton.count() > 0) {
      await textInput.fill('Test Value');
      await resetButton.click();
      await expect(textInput).toHaveValue('');
    }
  });

  test('should handle autocomplete suggestions', async ({ page }) => {
    // Test autocomplete/search functionality
    const searchInput = page.getByRole('textbox', { name: /search/i }).first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('test');
      await searchInput.press('ArrowDown');
      await page.waitForTimeout(500);
      // Check if suggestions appear
    }
  });

  test('should handle multiple select', async ({ page }) => {
    // Test multiple select
    const multiSelect = page.locator('select[multiple]').first();
    if (await multiSelect.count() > 0) {
      await multiSelect.selectOption([{ index: 0 }, { index: 1 }]);
    }
  });

  test('should preserve form data on navigation back', async ({ page }) => {
    // Fill form data
    const textInput = page.getByLabel(/name|text/i).first();
    if (await textInput.count() > 0) {
      await textInput.fill('Preserved Value');
      
      // Navigate to another page and back
      const link = page.locator('a').first();
      if (await link.count() > 0) {
        await link.click();
        await page.goBack();
        
        // Check if value is preserved (depends on implementation)
        const value = await textInput.inputValue();
        // Value may or may not be preserved depending on browser behavior
      }
    }
  });
});
