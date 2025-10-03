# Contributing to Playwright Tests

Cảm ơn bạn quan tâm đến việc đóng góp cho dự án này!

## 🛠️ Thiết lập môi trường phát triển

1. Fork repository
2. Clone repository của bạn:
   ```bash
   git clone https://github.com/your-username/playwright-tests.git
   cd playwright-tests
   ```
3. Cài đặt dependencies:
   ```bash
   npm install
   npx playwright install
   ```

## 📝 Hướng dẫn viết tests

### Quy tắc chung

1. **Tên file test**: Sử dụng pattern `*.spec.js`
2. **Cấu trúc test**: Sử dụng `test.describe` để nhóm các test liên quan
3. **Tên test case**: Sử dụng mô tả rõ ràng, bắt đầu với "should..."
4. **Sử dụng utilities**: Tận dụng các hàm trong `tests/utils.js` để tránh code trùng lặp

### Ví dụ cấu trúc test

```javascript
const { test, expect } = require('@playwright/test');
const utils = require('./utils');

test.describe('Feature Name Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something specific', async ({ page }) => {
    // Arrange
    const element = page.getByRole('button', { name: /click me/i });
    
    // Act
    await element.click();
    
    // Assert
    await expect(page.getByText(/success/i)).toBeVisible();
  });
});
```

### Best Practices

1. **Sử dụng selectors có ý nghĩa**:
   - Ưu tiên: `getByRole`, `getByLabel`, `getByText`
   - Tránh: CSS selectors phức tạp, XPath

2. **Xử lý async đúng cách**:
   - Luôn sử dụng `await` với Playwright actions
   - Sử dụng `waitForLoadState` khi cần

3. **Assertions rõ ràng**:
   - Sử dụng `expect` từ Playwright
   - Thêm timeout khi cần thiết

4. **Xử lý điều kiện**:
   - Kiểm tra element tồn tại trước khi tương tác
   - Sử dụng conditional checks cho optional elements

5. **Tránh hardcode**:
   - Sử dụng environment variables cho URLs, credentials
   - Sử dụng data generators từ utilities

## 🧪 Chạy tests

Trước khi submit PR, đảm bảo:

```bash
# Chạy tất cả tests
npm test

# Chạy linter (nếu có)
npm run lint

# Chạy tests cụ thể
npx playwright test tests/your-test.spec.js
```

## 📋 Pull Request Process

1. Tạo branch mới cho feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Commit changes với message rõ ràng:
   ```bash
   git commit -m "Add: description of what you added"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Tạo Pull Request với mô tả chi tiết:
   - Mô tả thay đổi
   - Lý do thay đổi
   - Cách test

## 🐛 Báo cáo bugs

Khi báo cáo bug, vui lòng bao gồm:

- Mô tả bug chi tiết
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (nếu có)
- Environment (OS, browser, Node version)

## 💡 Đề xuất features

Khi đề xuất feature mới:

- Mô tả feature rõ ràng
- Use case cụ thể
- Lợi ích của feature
- Cách implement (nếu có ý tưởng)

## 📚 Thêm test utilities

Khi thêm helper functions vào `utils.js`:

1. Thêm JSDoc comments
2. Export function
3. Thêm example trong `example.spec.js`
4. Cập nhật README nếu cần

Ví dụ:

```javascript
/**
 * Description of what the function does
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {string} paramName - Parameter description
 * @returns {Promise<ReturnType>} - Return value description
 */
async function yourFunction(page, paramName) {
  // Implementation
}

module.exports = {
  // ... other exports
  yourFunction
};
```

## ✅ Checklist trước khi submit PR

- [ ] Code chạy được và pass tất cả tests
- [ ] Thêm tests cho code mới
- [ ] Cập nhật documentation nếu cần
- [ ] Follow coding style của project
- [ ] Commit messages rõ ràng
- [ ] PR description đầy đủ

## 📞 Liên hệ

Nếu có câu hỏi, hãy tạo issue hoặc discussion trong repository.

Cảm ơn bạn đã đóng góp! 🎉
