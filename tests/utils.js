/**
 * Test Utilities and Helper Functions
 * Common functions used across multiple test files
 */

/**
 * Login helper function
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} username - Username for login
 * @param {string} password - Password for login
 */
async function login(page, username = 'testuser', password = 'testpassword') {
  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /sign in|login/i }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Logout helper function
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function logout(page) {
  await page.getByRole('button', { name: /logout|sign out/i }).click();
  await page.waitForLoadState('networkidle');
}

/**
 * Fill form helper function
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} formData - Object containing form field data
 */
async function fillForm(page, formData) {
  for (const [field, value] of Object.entries(formData)) {
    const input = page.getByLabel(new RegExp(field, 'i')).first();
    if (await input.count() > 0) {
      await input.fill(value);
    }
  }
}

/**
 * Wait for element to be visible
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForElement(page, selector, timeout = 5000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Take screenshot with custom name
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
async function takeScreenshot(page, name) {
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Navigate to specific section
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} sectionName - Name of section to navigate to
 */
async function navigateToSection(page, sectionName) {
  const link = page.getByRole('link', { name: new RegExp(sectionName, 'i') }).first();
  if (await link.count() > 0) {
    await link.click();
    await page.waitForLoadState('networkidle');
    return true;
  }
  return false;
}

/**
 * Check if element exists
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @returns {Promise<boolean>} - True if element exists
 */
async function elementExists(page, selector) {
  return (await page.locator(selector).count()) > 0;
}

/**
 * Get text content of element
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @returns {Promise<string|null>} - Text content or null
 */
async function getTextContent(page, selector) {
  if (await elementExists(page, selector)) {
    return await page.locator(selector).first().textContent();
  }
  return null;
}

/**
 * Select random option from dropdown
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Dropdown selector
 */
async function selectRandomOption(page, selector) {
  const dropdown = page.locator(selector);
  if (await dropdown.count() > 0) {
    const options = await dropdown.locator('option').all();
    const randomIndex = Math.floor(Math.random() * options.length);
    await dropdown.selectOption({ index: randomIndex });
  }
}

/**
 * Clear all form fields
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function clearForm(page) {
  const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"], textarea');
  const count = await inputs.count();
  
  for (let i = 0; i < count; i++) {
    await inputs.nth(i).clear();
  }
}

/**
 * Check for console errors
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Array} - Array of console error messages
 */
function setupConsoleErrorListener(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  return errors;
}

/**
 * Wait for network idle
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function waitForNetworkIdle(page) {
  await page.waitForLoadState('networkidle', { timeout: 10000 });
}

/**
 * Scroll to element
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 */
async function scrollToElement(page, selector) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

/**
 * Hover over element
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} selector - Element selector
 */
async function hoverElement(page, selector) {
  await page.locator(selector).hover();
}

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} - Random string
 */
function generateRandomString(length = 10) {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Generate random email
 * @returns {string} - Random email address
 */
function generateRandomEmail() {
  return `test${generateRandomString(8)}@example.com`;
}

/**
 * Generate random phone number
 * @returns {string} - Random phone number
 */
function generateRandomPhone() {
  return `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`;
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Handle cookie consent banner
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function handleCookieConsent(page) {
  const acceptButton = page.getByRole('button', { name: /accept|agree|consent/i }).first();
  if (await acceptButton.count() > 0) {
    await acceptButton.click();
  }
}

/**
 * Dismiss notification/toast
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
async function dismissNotification(page) {
  const closeButton = page.locator('[class*="notification"] button, [class*="toast"] button').first();
  if (await closeButton.count() > 0) {
    await closeButton.click();
  }
}

module.exports = {
  login,
  logout,
  fillForm,
  waitForElement,
  takeScreenshot,
  navigateToSection,
  elementExists,
  getTextContent,
  selectRandomOption,
  clearForm,
  setupConsoleErrorListener,
  waitForNetworkIdle,
  scrollToElement,
  hoverElement,
  generateRandomString,
  generateRandomEmail,
  generateRandomPhone,
  formatDate,
  handleCookieConsent,
  dismissNotification
};
