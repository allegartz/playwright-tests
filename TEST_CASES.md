# Test Cases Documentation

## Overview
Tài liệu này mô tả chi tiết các test cases trong dự án Playwright Tests.

## Test Suites

### 1. Login Tests (`login.spec.js`)

| Test ID | Test Case | Mục đích | Expected Result |
|---------|-----------|----------|-----------------|
| LOGIN-001 | Display login form elements | Kiểm tra hiển thị form đăng nhập | Form có đầy đủ username, password fields và submit button |
| LOGIN-002 | Empty form submission | Kiểm tra validation khi submit form rỗng | Hiển thị lỗi "required" |
| LOGIN-003 | Invalid credentials | Kiểm tra xử lý credentials sai | Hiển thị lỗi "invalid credentials" |
| LOGIN-004 | Valid login | Kiểm tra đăng nhập thành công | Redirect đến dashboard, hiển thị welcome message |
| LOGIN-005 | Password field masking | Kiểm tra password field type="password" | Password được ẩn khi nhập |
| LOGIN-006 | Logout functionality | Kiểm tra đăng xuất | Redirect về login page |
| LOGIN-007 | Remember me checkbox | Kiểm tra tính năng remember me | Checkbox có thể check/uncheck |
| LOGIN-008 | Forgot password link | Kiểm tra link forgot password | Link tồn tại và redirect đúng |

### 2. Form Interaction Tests (`form-interactions.spec.js`)

| Test ID | Test Case | Mục đích | Expected Result |
|---------|-----------|----------|-----------------|
| FORM-001 | Fill text input | Kiểm tra input text fields | Có thể nhập và lưu text |
| FORM-002 | Fill email input | Kiểm tra email validation | Accept email hợp lệ, reject email không hợp lệ |
| FORM-003 | Select dropdown | Kiểm tra dropdown selection | Có thể chọn option |
| FORM-004 | Check/uncheck checkbox | Kiểm tra checkbox interaction | Có thể check và uncheck |
| FORM-005 | Select radio button | Kiểm tra radio button | Chỉ một option được chọn |
| FORM-006 | Fill textarea | Kiểm tra textarea input | Có thể nhập multiline text |
| FORM-007 | File upload | Kiểm tra upload file | File được upload thành công |
| FORM-008 | Date input | Kiểm tra date picker | Có thể chọn ngày |
| FORM-009 | Clear input fields | Kiểm tra clear functionality | Fields được clear thành công |
| FORM-010 | Required field validation | Kiểm tra validation | Hiển thị lỗi cho required fields |
| FORM-011 | Form submission | Kiểm tra submit form | Form được submit thành công |
| FORM-012 | Form reset | Kiểm tra reset form | Form được reset về trạng thái ban đầu |
| FORM-013 | Autocomplete | Kiểm tra autocomplete suggestions | Hiển thị suggestions khi type |
| FORM-014 | Multiple select | Kiểm tra multiple selection | Có thể chọn nhiều options |

### 3. UI Validation Tests (`ui-validation.spec.js`)

| Test ID | Test Case | Mục đích | Expected Result |
|---------|-----------|----------|-----------------|
| UI-001 | Page title | Kiểm tra page title | Title tồn tại và không rỗng |
| UI-002 | Header display | Kiểm tra header | Header hiển thị đúng |
| UI-003 | Footer display | Kiểm tra footer | Footer hiển thị đúng |
| UI-004 | Logo/brand | Kiểm tra logo | Logo hiển thị |
| UI-005 | Navigation menu | Kiểm tra navigation | Nav links tồn tại |
| UI-006 | Images loading | Kiểm tra images | Images load với alt text |
| UI-007 | Heading hierarchy | Kiểm tra headings | Có h1, hierarchy đúng |
| UI-008 | Responsive design | Kiểm tra responsive | Layout responsive trên các devices |
| UI-009 | Button styling | Kiểm tra buttons | Buttons hiển thị và clickable |
| UI-010 | Color contrast | Kiểm tra contrast (accessibility) | Text có color contrast |
| UI-011 | Form labels | Kiểm tra form accessibility | Inputs có labels |
| UI-012 | Links functionality | Kiểm tra links | Links có href hợp lệ |
| UI-013 | Console errors | Kiểm tra console errors | Ít hơn 5 console errors |
| UI-014 | CSS resources | Kiểm tra stylesheets | CSS load thành công |
| UI-015 | Meta tags | Kiểm tra meta tags | Có viewport và description |
| UI-016 | Focus indicators | Kiểm tra keyboard navigation | Elements có focus indicators |
| UI-017 | Loading states | Kiểm tra page loading | Page đạt loaded state |
| UI-018 | Above the fold content | Kiểm tra visible content | Content hiển thị không cần scroll |

### 4. User Flow Tests (`user-flow.spec.js`)

| Test ID | Test Case | Mục đích | Expected Result |
|---------|-----------|----------|-----------------|
| FLOW-001 | Registration flow | Kiểm tra luồng đăng ký | Đăng ký thành công, redirect dashboard |
| FLOW-002 | Login to profile update | Kiểm tra luồng update profile | Login -> Profile -> Update thành công |
| FLOW-003 | Search to detail | Kiểm tra luồng search | Search -> Click result -> Detail page |
| FLOW-004 | Shopping cart | Kiểm tra luồng mua hàng | Add to cart -> Cart -> Checkout |
| FLOW-005 | Form submission flow | Kiểm tra luồng submit form | Fill form -> Submit -> Confirmation |
| FLOW-006 | Multi-page navigation | Kiểm tra navigation | Navigate qua nhiều pages |
| FLOW-007 | Filter and sort | Kiểm tra filter/sort | Apply filters -> Apply sort |
| FLOW-008 | Pagination | Kiểm tra pagination | Next -> Previous pages |
| FLOW-009 | Modal interaction | Kiểm tra modal | Open -> Close modal |
| FLOW-010 | Tab navigation | Kiểm tra tabs | Switch giữa tabs |
| FLOW-011 | Accordion | Kiểm tra accordion | Expand/collapse items |
| FLOW-012 | Drag and drop | Kiểm tra drag & drop | Drag item to drop zone |
| FLOW-013 | Error recovery | Kiểm tra error handling | 404 page -> Back to home |
| FLOW-014 | Settings update | Kiểm tra settings | Change settings -> Save |
| FLOW-015 | Download flow | Kiểm tra download | Click download -> File downloads |

## Test Data

Test data được quản lý tập trung trong `tests/testData.js`:
- User credentials
- Form data
- Search queries
- URLs
- Error/Success messages
- Products
- Viewports
- Timeouts

## Test Utilities

Các helper functions trong `tests/utils.js`:
- `login()` - Đăng nhập
- `logout()` - Đăng xuất
- `fillForm()` - Fill form data
- `waitForElement()` - Đợi element
- `navigateToSection()` - Navigate đến section
- `elementExists()` - Check element tồn tại
- `generateRandomEmail()` - Generate email
- `generateRandomPhone()` - Generate phone
- `handleCookieConsent()` - Xử lý cookie banner

## Test Execution

### Chạy tất cả tests
```bash
npm test
```

### Chạy test suite cụ thể
```bash
npx playwright test tests/login.spec.js
npx playwright test tests/form-interactions.spec.js
npx playwright test tests/ui-validation.spec.js
npx playwright test tests/user-flow.spec.js
```

### Chạy test case cụ thể
```bash
npx playwright test -g "should display login form elements"
```

### Chạy với browser cụ thể
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Reports

Sau khi chạy tests, xem reports:
```bash
npm run test:report
```

Reports bao gồm:
- Test results summary
- Screenshots (khi fail)
- Videos (khi fail)
- Traces (khi retry)

## Maintenance

### Cập nhật test data
Edit `tests/testData.js` để cập nhật test data

### Thêm test mới
1. Tạo file `*.spec.js` trong `tests/`
2. Follow naming convention
3. Use utilities và test data
4. Cập nhật documentation này

### Troubleshooting

#### Tests fail do element không tìm thấy
- Check selector
- Thêm wait/timeout
- Check page load state

#### Tests fail intermittently
- Thêm proper waits
- Check network conditions
- Increase timeouts

#### Browser không launch
- Run `npx playwright install`
- Check system dependencies

## Best Practices

1. ✅ Sử dụng meaningful selectors (role, label, text)
2. ✅ Thêm proper waits
3. ✅ Handle conditional elements
4. ✅ Use test data từ testData.js
5. ✅ Use utilities để avoid duplication
6. ✅ Add comments cho complex logic
7. ✅ Keep tests independent
8. ✅ Clean up test data after tests
