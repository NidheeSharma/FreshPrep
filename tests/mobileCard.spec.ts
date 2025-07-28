import { test, expect, devices } from '@playwright/test';
import { GiftCardPage } from '../Page/giftCardPage';
import { TestData } from '../tests/testData';

test.use({
  viewport: { width: 390, height: 844 }, // iPhone 12 resolution
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  isMobile: true,
  hasTouch: true,
});

test.describe('Mobile Gift Card Tests', () => {

  test('Mobile gift card purchase flow', async ({ page }) => {
    const giftCardPage = new GiftCardPage(page);
    await giftCardPage.goto();

    // Complete mobile purchase flow
    await giftCardPage.fillSenderInfo(TestData.users.sender.name, TestData.users.sender.email);
    await giftCardPage.fillRecipientInfo(TestData.users.recipient.name, TestData.users.recipient.email);
    await giftCardPage.selectNowDelivery();
    await giftCardPage.continueToPayment();
    
    // Fill payment info
    await giftCardPage.fillPaymentInfo(TestData.cards.validVisa, TestData.expiry.valid, TestData.cvv.valid);
    await giftCardPage.selectCountry('Canada');
    await giftCardPage.purchaseGiftCard();
    
    // Verify success
    await giftCardPage.verifyConfirmationPage();
  });
});

