# FreshPrep Gift Card Automation

A comprehensive Playwright automation testing suite for FreshPrep's gift card functionality, built with TypeScript and following Page Object Model design pattern.

## Project Overview

This automation framework tests the complete gift card purchase workflow on FreshPrep's website, including validation scenarios, payment processing, and error handling. The tests cover both desktop (Chrome) and mobile (iPhone 12 Safari) platforms.

## Project Structure

```
FreshPrep/
├── Page/
│   └── giftCardPage.ts          # Page Object Model for gift card functionality
├── playwright-report/
│   ├── data/                    # Test execution data
│   └── index.html              # HTML test reports
├── testData/
│   └── testData.ts             # Test data constants and configurations
├── tests/
│   └── giftCard.spec.ts        # Main test specifications
├── test-results/               # Test execution results
├── node_modules/               # Dependencies
├── package.json                # Project configuration and scripts
├── package-lock.json          # Dependency lock file
└── playwright.config.js       # Playwright configuration
```

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FreshPrep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

##  Test Scenarios Covered

| Test Case | Description | Validation Points |
|-----------|-------------|-------------------|
| **TC01** | Complete gift card purchase workflow | Navigation, amount selection, delivery options, form submission, payment processing |
| **TC02** | Invalid credit card number rejection |  Card validation, error message display |
| **TC03** | Expired card rejection |  Expiry date validation, error handling |
| **TC04** | CVV validation |  Security code format validation |
| **TC05** | Required field validations |  Form validation, mandatory field checks |

##  Running Tests

### All Tests
```bash
npm test
```

### Headed Mode (Browser Visible)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### UI Mode (Interactive)
```bash
npm run test:ui
```

### Platform-Specific Tests

**Desktop Only:**
```bash
npx playwright test --project="Desktop Chrome"
```

**Mobile Only:**
```bash
npx playwright test --project="Mobile Web (iPhone 12)"
```

## Test Reporting

### View HTML Reports
```bash
npm run report
```

### Report Location
- HTML Report: `playwright-report/index.html`
- Test Results: `test-results/` directory

##  Configuration

### Base Configuration
- **Target URL:** `https://www.freshdev.ca/gift`
- **Timeout:** 60 seconds per test
- **Retries:** 2 attempts in CI, 0 locally
- **Workers:** 1 in CI, unlimited locally

### Browser Support
- **Desktop Chrome:** 1920x1080 viewport
- **Mobile Safari (iPhone 12):** 390x844 viewport

### Test Data
Centralized test data management in `testData/testData.ts`:
- Valid/Invalid card numbers
- User information (sender/recipient)
- Expiry dates and CVV codes
- Gift card amounts

##  Page Object Model

The framework uses Page Object Model (POM) pattern with `giftCardPage.ts` containing:

### Key Components
- **Element Locators:** Centralized element identification
- **Action Methods:** Reusable interaction functions
- **Verification Methods:** Assertion and validation logic
- **Error Handling:** Expected error scenarios

### Example Usage
```typescript
const giftCardPage = new GiftCardPage(page);
await giftCardPage.goto();
await giftCardPage.fillSenderInfo(name, email);
await giftCardPage.verifyOrderSummary();
```

## Debugging

### Debug Specific Test
```bash
npx playwright test tests/giftCard.spec.ts --debug
```

##  CI/CD Integration

The project includes CI-optimized configuration:
- Parallel execution disabled in CI
- HTML and JUnit reporters
- Automatic retries on failure
- Artifact collection (screenshots, videos, traces)

##  Known Issues & Limitations

1. **Payment Processing:** Uses test card numbers for Stripe integration
2. **Environment:** Currently configured for staging environment
3. **Mobile Testing:** Limited to iPhone 12 Safari simulation

##  Contributing

1. Follow the existing Page Object Model pattern
2. Add test data to `testData.ts`
3. Include appropriate assertions and error handling
4. Run linting and formatting before commits
5. Ensure all tests pass in both desktop and mobile configurations


## Test Data Reference

### Valid Test Cards
- **Visa:** 4000056655665556
- **Expired Card:** 4000000000000069
- **Invalid Card:** 1234567890123456

### Test Users
- **Sender:** John Doe (john@test.com)
- **Recipient:** Jane Doe (jane@test.com)
