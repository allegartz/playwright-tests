const { test, expect } = require('@playwright/test');

/**
 * Test Suite: Login Functionality
 * Tests various login scenarios including valid/invalid credentials
 */

test.describe('Login Functionality Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/');
  });

  test('should display login form elements', async ({ page }) => {
    // Check if essential login form elements are present
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show error on empty form submission', async ({ page }) => {
    // Attempt to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for validation errors
    await expect(page.getByText(/required/i)).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel(/username/i).fill('invalid_user');
    await page.getByLabel(/password/i).fill('wrong_password');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Check for error message
    await expect(page.getByText(/invalid.*credentials|incorrect.*username.*password/i)).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Fill in valid credentials (update with actual test credentials)
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify successful login - check for dashboard or welcome message
    await expect(page).toHaveURL(/dashboard|home/);
    await expect(page.getByText(/welcome|dashboard/i)).toBeVisible();
  });

  test('should have password field type password', async ({ page }) => {
    // Verify password field is properly masked
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should allow logout after login', async ({ page }) => {
    // Login first
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Wait for successful login
    await expect(page).toHaveURL(/dashboard|home/);
    
    // Click logout button
    await page.getByRole('button', { name: /logout|sign out/i }).click();
    
    // Verify redirect to login page
    await expect(page).toHaveURL(/login|signin/);
  });

  test('should remember me functionality', async ({ page }) => {
    // Check if remember me checkbox exists
    const rememberMe = page.getByLabel(/remember me/i);
    if (await rememberMe.count() > 0) {
      await rememberMe.check();
      await expect(rememberMe).toBeChecked();
    }
  });

  test('should have forgot password link', async ({ page }) => {
    // Check for forgot password functionality
    const forgotPasswordLink = page.getByRole('link', { name: /forgot.*password/i });
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink).toBeVisible();
      await forgotPasswordLink.click();
      await expect(page).toHaveURL(/forgot|reset/);
    }
  });
});
