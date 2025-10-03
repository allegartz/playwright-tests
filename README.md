# Playwright Tests - Automated Web Testing

Dự án test tự động sử dụng Playwright Framework để kiểm thử các chức năng web bao gồm đăng nhập, thao tác form, kiểm tra UI và luồng người dùng.

## 📋 Tính năng

- ✅ **Login Tests**: Kiểm thử chức năng đăng nhập với các kịch bản khác nhau
- ✅ **Form Interaction Tests**: Kiểm thử các loại form input và tương tác
- ✅ **UI Validation Tests**: Kiểm tra UI elements, layout, styling và accessibility
- ✅ **User Flow Tests**: Kiểm thử các luồng người dùng hoàn chỉnh
- ✅ **Test Utilities**: Thư viện hàm tiện ích để tái sử dụng trong tests

## 🚀 Cài đặt

### Yêu cầu
- Node.js 18 hoặc cao hơn
- npm hoặc yarn

### Các bước cài đặt

1. Clone repository:
```bash
git clone https://github.com/allegartz/playwright-tests.git
cd playwright-tests
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cài đặt Playwright browsers:
```bash
npx playwright install
```

Hoặc cài đặt với system dependencies:
```bash
npx playwright install --with-deps
```

## 📂 Cấu trúc dự án

```
playwright-tests/
├── tests/
│   ├── login.spec.js              # Tests chức năng đăng nhập
│   ├── form-interactions.spec.js  # Tests tương tác form
│   ├── ui-validation.spec.js      # Tests kiểm tra UI
│   ├── user-flow.spec.js          # Tests luồng người dùng
│   ├── example.spec.js            # Ví dụ sử dụng utilities
│   └── utils.js                   # Thư viện hàm tiện ích
├── playwright.config.js           # Cấu hình Playwright
├── package.json
└── README.md
```

## 🧪 Chạy Tests

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests với UI mode (interactive)
```bash
npm run test:ui
```

### Chạy tests với headed mode (hiển thị browser)
```bash
npm run test:headed
```

### Chạy tests với debug mode
```bash
npm run test:debug
```

### Chạy test cụ thể
```bash
npx playwright test tests/login.spec.js
```

### Chạy test với browser cụ thể
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Xem test report
```bash
npm run test:report
```

## 📝 Chi tiết Test Suites

### 1. Login Tests (`login.spec.js`)
Kiểm thử các tính năng đăng nhập:
- Hiển thị form elements
- Validation với form rỗng
- Credentials không hợp lệ
- Đăng nhập thành công
- Tính năng remember me
- Forgot password
- Logout functionality

### 2. Form Interaction Tests (`form-interactions.spec.js`)
Kiểm thử các loại form interactions:
- Text inputs
- Email inputs với validation
- Dropdowns/selects
- Checkboxes
- Radio buttons
- Textareas
- File uploads
- Date pickers
- Form validation
- Form submission
- Form reset

### 3. UI Validation Tests (`ui-validation.spec.js`)
Kiểm thử UI elements và accessibility:
- Page title
- Header/footer
- Navigation menu
- Images và alt text
- Heading hierarchy
- Responsive design
- Button styling
- Color contrast
- Form labels
- Links
- Console errors
- CSS resources
- Meta tags
- Focus indicators

### 4. User Flow Tests (`user-flow.spec.js`)
Kiểm thử các luồng người dùng hoàn chỉnh:
- Registration to dashboard flow
- Login to profile update flow
- Search to detail view flow
- Shopping cart flow
- Form submission to confirmation flow
- Navigation through multiple pages
- Filter and sort flow
- Pagination flow
- Modal interactions
- Tab navigation
- Accordion interactions
- Drag and drop
- Error recovery
- Settings update
- Download flow

### 5. Test Utilities (`utils.js`)
Thư viện các hàm tiện ích:
- `login()` - Login helper
- `logout()` - Logout helper
- `fillForm()` - Fill form with data
- `waitForElement()` - Wait for element visibility
- `navigateToSection()` - Navigate to specific section
- `elementExists()` - Check element existence
- `generateRandomEmail()` - Generate test email
- `generateRandomPhone()` - Generate test phone
- `handleCookieConsent()` - Handle cookie banners
- và nhiều hơn...

## ⚙️ Cấu hình

### Base URL
Để cấu hình base URL cho tests, set biến môi trường:
```bash
BASE_URL=https://your-website.com npm test
```

Hoặc sửa trong `playwright.config.js`:
```javascript
baseURL: 'https://your-website.com',
```

### Browsers
Mặc định tests chạy trên:
- Chromium
- Firefox
- WebKit
- Mobile Chrome
- Mobile Safari

Có thể tùy chỉnh trong `playwright.config.js`.

## 📊 Test Reports

Sau khi chạy tests, reports được tạo tại:
- HTML Report: `playwright-report/`
- Test Results: `test-results/`
- Screenshots: `screenshots/` (khi test fail)

## 🔧 Tùy chỉnh Tests

### Thêm test credentials
Cập nhật trong test files hoặc sử dụng environment variables:
```javascript
const username = process.env.TEST_USERNAME || 'testuser';
const password = process.env.TEST_PASSWORD || 'testpassword';
```

### Thêm test mới
Tạo file mới trong thư mục `tests/` với tên `*.spec.js`:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Your Test Suite', () => {
  test('your test case', async ({ page }) => {
    // Test code here
  });
});
```

## 🤝 Đóng góp

Contributions, issues và feature requests đều được chào đón!

## 📄 License

ISC

## 📞 Liên hệ

- Repository: [allegartz/playwright-tests](https://github.com/allegartz/playwright-tests)

---

**Lưu ý:** Tests được thiết kế để hoạt động với demo website. Để sử dụng với website thực tế, cần cập nhật selectors và test data cho phù hợp.

