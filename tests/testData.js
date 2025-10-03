/**
 * Test Data for Playwright Tests
 * Centralized test data management
 */

const testData = {
  // User credentials for testing
  users: {
    validUser: {
      username: 'testuser',
      password: 'testpassword',
      email: 'testuser@example.com'
    },
    invalidUser: {
      username: 'invaliduser',
      password: 'wrongpassword',
      email: 'invalid@example.com'
    },
    admin: {
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com'
    }
  },

  // Form test data
  forms: {
    registration: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      address: '123 Main St',
      city: 'New York',
      zipCode: '10001',
      country: 'USA'
    },
    contact: {
      name: 'Test User',
      email: 'contact@example.com',
      subject: 'Test Subject',
      message: 'This is a test message for contact form.'
    },
    profile: {
      displayName: 'Test Display Name',
      bio: 'This is a test bio description.',
      website: 'https://example.com',
      location: 'San Francisco, CA'
    }
  },

  // Search queries
  searchQueries: {
    valid: ['test', 'playwright', 'automation', 'testing'],
    invalid: ['xyzabc123', 'nonexistent', '!@#$%^&*()'],
    special: ['test@123', 'hello world', 'test-query']
  },

  // URLs for testing
  urls: {
    home: '/',
    login: '/login',
    register: '/register',
    profile: '/profile',
    dashboard: '/dashboard',
    settings: '/settings',
    notFound: '/nonexistent-page'
  },

  // Error messages
  errorMessages: {
    requiredField: /required|must|cannot be empty/i,
    invalidEmail: /invalid.*email|email.*invalid/i,
    invalidCredentials: /invalid.*credentials|incorrect.*username.*password/i,
    notFound: /not found|404/i,
    serverError: /server error|500/i
  },

  // Success messages
  successMessages: {
    login: /welcome|login successful|signed in/i,
    registration: /registration successful|account created/i,
    update: /updated successfully|changes saved/i,
    submission: /submitted|received|thank you/i
  },

  // Test products (for e-commerce testing)
  products: {
    product1: {
      name: 'Test Product 1',
      price: '$99.99',
      quantity: 2
    },
    product2: {
      name: 'Test Product 2',
      price: '$49.99',
      quantity: 1
    }
  },

  // Viewport sizes for responsive testing
  viewports: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
    largeDesktop: { width: 2560, height: 1440 }
  },

  // Timeouts
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
    veryLong: 30000
  }
};

module.exports = testData;
