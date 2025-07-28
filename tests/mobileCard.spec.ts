import { test, expect, devices } from '@playwright/test';
import { GiftCardPage } from '../Page/giftCardPage';
import { TestData } from '../tests/testData';

test.use({ ...devices['iPhone 12'] });

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

