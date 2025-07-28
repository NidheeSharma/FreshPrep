import { test, expect } from '@playwright/test';
import { GiftCardPage } from '../Page/giftCardPage';
import { TestData } from '../testData/testData';

test.describe('FreshPrep Gift Card Tests', () => {
  let giftCardPage: GiftCardPage;
  test.use({
  viewport: { width: 390, height: 844 }, 
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  isMobile: true,
  hasTouch: true,
});

  test.beforeEach(async ({ page }) => {
    giftCardPage = new GiftCardPage(page);
    await giftCardPage.goto();
  });

  test('T01 - Complete gift card purchase workflow', async ({ page }) => {
    await test.step('Navigate to freshprep.ca/gift', async () => {
      await expect(page).toHaveURL(/.*\/gift/);
    });

    await test.step('By default $100 amount selected', async () => {      
      await expect(giftCardPage.mostPopularButton).toHaveClass(/selected|active|highlighted/);
    });

    await test.step('Verify "By Email" delivery option is pre-selected', async () => {
      await giftCardPage.verifyEmailDeliverySelected();
    });

    await test.step('Enter sender full name and email', async () => {
      await giftCardPage.fillSenderInfo(TestData.users.sender.name, TestData.users.sender.email);
      
      // Verify fields accept valid data
      await expect(giftCardPage.senderNameInput).toHaveValue(TestData.users.sender.name);
      await expect(giftCardPage.senderEmailInput).toHaveValue(TestData.users.sender.email);
    });

    await test.step('Enter recipient name and email', async () => {
      await giftCardPage.fillRecipientInfo(TestData.users.recipient.name, TestData.users.recipient.email);
      
      // Verify fields accept valid data
      await expect(giftCardPage.recipientNameInput).toHaveValue(TestData.users.recipient.name);
      await expect(giftCardPage.recipientEmailInput).toHaveValue(TestData.users.recipient.email);
    });

    await test.step('Select "Now" as delivery timing', async () => {
      await giftCardPage.selectNowDelivery();
    });

    await test.step('Click "Continue to payment"', async () => {
      await giftCardPage.continueToPayment();
    });

    await test.step('Verify order summary reflects $100 gift card and correct recipient info', async () => {
      await giftCardPage.verifyOrderSummary();
    });

    await test.step('Enter valid card details', async () => {
      await giftCardPage.fillPaymentInfo(TestData.cards.validVisa, TestData.expiry.valid, TestData.cvv.valid);
      await expect(giftCardPage.cardNumberInput).toHaveValue(/4000/);
      await expect(giftCardPage.expiryDateInput).toHaveValue(/12.*26/);
      await expect(giftCardPage.cvvInput).toHaveValue(TestData.cvv.valid);


    });


    await test.step('Select "Australia" from country dropdown', async () => {
      await giftCardPage.selectCountry('Australia');
    });

    await test.step('Click Purchase Gift Card button', async () => {
      await giftCardPage.purchaseGiftCard();
    });

    await test.step('Verify confirmation page', async () => {
      await giftCardPage.verifyConfirmationPage();
    });
  });

  test('TC02 - Invalid credit card number rejection', async ({ page }) => {
    await test.step('Complete gift card form with valid info', async () => {
      await giftCardPage.fillSenderInfo(TestData.users.sender.name, TestData.users.sender.email);
      await giftCardPage.fillRecipientInfo(TestData.users.recipient.name, TestData.users.recipient.email);
      await giftCardPage.selectNowDelivery();
      await giftCardPage.continueToPayment();
    });

    await test.step('Enter invalid card number', async () => {
      await giftCardPage.fillPaymentInfo(TestData.cards.invalidCard, TestData.expiry.valid, TestData.cvv.valid);
    });

    await test.step('Verify error message appears', async () => {
      await giftCardPage.expectError('Your card number is invalid.');
    });
  });

  test('TC03 - Expired card rejection', async ({ page }) => {
    await test.step('Complete gift card form with valid info', async () => {
      await giftCardPage.fillSenderInfo(TestData.users.sender.name, TestData.users.sender.email);
      await giftCardPage.fillRecipientInfo(TestData.users.recipient.name, TestData.users.recipient.email);
      await giftCardPage.selectNowDelivery();
      await giftCardPage.continueToPayment();
    });

    await test.step('Enter valid card number', async () => {
      await giftCardPage.fillPaymentInfo(TestData.cards.expiredCard, TestData.expiry.expired, TestData.cvv.valid);
    });

    await test.step('Click purchase', async () => {
      await giftCardPage.purchaseGiftCard();
    });

    await test.step('Verify error message appears', async () => {
      await giftCardPage.expectError('Your card’s expiration year is in the past.');
    });
  });

  test('TC04 - CVV validation', async ({ page }) => {
    await test.step('Complete gift card form with valid info', async () => {
      await giftCardPage.fillSenderInfo(TestData.users.sender.name, TestData.users.sender.email);
      await giftCardPage.fillRecipientInfo(TestData.users.recipient.name, TestData.users.recipient.email);
      await giftCardPage.selectNowDelivery();
      await giftCardPage.continueToPayment();
    });

    await test.step('Enter 2-digit CVV', async () => {
      await giftCardPage.fillPaymentInfo(TestData.cards.validVisa, TestData.expiry.valid, TestData.cvv.invalid);
      await giftCardPage.purchaseGiftCard();
    });

    await test.step('Verify CVV error message', async () => {
      await giftCardPage.expectError('Your card’s security code is incomplete.');
    });
  });

  test('TC05 - Required field validations', async ({ page }) => {
    await test.step('Leave all sender and recipient fields blank and click continue', async () => {
      await giftCardPage.continueToPayment();
    });

    await test.step('Verify required field errors for gift card form', async () => {
      await giftCardPage.expectValidationErrors();
      
      // Check for specific field errors
      const requiredFieldErrors = [
        'Please enter your name',
        'Please enter your email', 
        'Please enter the recipient\'s name',
        'Please enter a valid email address'
      ];
      
      for (const error of requiredFieldErrors) {
        await expect(page.locator(`text=${error}`)).toBeVisible();
      }
    });

    await test.step('Fill sender/recipient fields and navigate to payment', async () => {
      await giftCardPage.fillSenderInfo(TestData.users.sender.name, TestData.users.sender.email);
      await giftCardPage.fillRecipientInfo(TestData.users.recipient.name, TestData.users.recipient.email);
      await giftCardPage.selectNowDelivery();
      await giftCardPage.continueToPayment();
    });

    await test.step('Leave payment fields blank and click purchase', async () => {
      await giftCardPage.purchaseGiftCard();

    });

    await test.step('Verify payment field validation errors', async () => {
      await giftCardPage.expectPaymentValidationErrors();
    });
  });
});
