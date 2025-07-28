import { Page, Locator, expect } from '@playwright/test';

export class GiftCardPage {
  readonly page: Page;
  
  // Amount selection
  readonly amount100Button: Locator;
  readonly mostPopularButton: Locator;
  
  // Delivery options
  readonly emailDeliveryOption: Locator;
  readonly nowDeliveryOption: Locator;
  
  // Sender information
  readonly senderNameInput: Locator;
  readonly senderEmailInput: Locator;
  
  // Recipient information
  readonly recipientNameInput: Locator;
  readonly recipientEmailInput: Locator;
  
  // Form controls
  readonly continueToPaymentButton: Locator;
  readonly purchaseGiftCardButton: Locator;
  readonly allowPaymentRequestButton : Locator;

  // Payment fields
  readonly cardNumberInput: Locator;
  readonly expiryDateInput: Locator;
  readonly cvvInput: Locator;
  readonly countryDropdown: Locator;
  
  // Messages and confirmations
  readonly errorMessages: Locator;
  readonly successMessage: Locator;
  readonly orderSummary: Locator;
  readonly confirmationPage: Locator;
  
  // Validation error messages
  readonly insufficientFundErrorMessage: Locator;
  readonly cardNumberError: Locator;
  readonly expiryError: Locator;
  readonly cvvError: Locator;

  //Headings
  readonly purchasePageHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Amount buttons - these selectors need to be updated based on actual page
    this.mostPopularButton = page.locator('//label[contains(@class,"active")]');
    
    // Delivery options
    this.emailDeliveryOption = page.locator('//div[contains(@class,"focus") and text()="By Email"]');
    this.nowDeliveryOption = page.locator('button[class="btn btn-primary btn-amt btn-gap delivery"]');
    
    // Form inputs
    this.senderNameInput = page.locator('div[class*="col-"]:nth-of-type(2) > div[class="form-group"]:nth-of-type(1) > input[class*="form-control"]');
    this.senderEmailInput = page.locator('div[class="form-group"]:nth-of-type(2) > input[required]');
    this.recipientNameInput = page.locator('div[class="form-group"]:nth-of-type(4) > input[required]');
    this.recipientEmailInput = page.locator('div[class="row justify-content-center"]:nth-of-type(4) input[class*="form-control"]');
    
    // Buttons
    this.continueToPaymentButton = page.locator('span[class="sentence-case"]');
    this.purchaseGiftCardButton = page.locator('button[id="submit"] > span[class="sentence-case"]');
    this.allowPaymentRequestButton = page
  .frameLocator('(//iframe[contains(@name,"__privateStripeFrame")])[1]')
  .frameLocator('iframe[name="stripe-challenge-frame"]')
  .locator('button[id="test-source-authorize-3ds"]');
    
    // Payment fields
    this.cardNumberInput = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('input[id="Field-numberInput"]');
    this.expiryDateInput = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('input[id="Field-expiryInput"]');
    this.cvvInput = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('input[id="Field-cvcInput"]');
    this.countryDropdown = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('select[id="Field-countryInput"]');
    
    // Messages
    this.errorMessages = page.locator('div[class="invalid-feedback"]');
    this.successMessage = page.locator('.success, .success-message, [class*="success"]');
    this.orderSummary = page.locator('div[class*="col-"] > h4[class="gc-info-header"]');
    this.confirmationPage = page.locator('div[class="gift-card-purchase"] > div > h1');
    
    // Specific error messages
    this.cardNumberError = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('p[id="Field-numberError"]');
    this.expiryError = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('p[id="Field-expiryError"]');
    this.cvvError = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('p[id="Field-cvcError"]');
    this.insufficientFundErrorMessage = page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('div[id="error-message"]');
    //Heading 
    this.purchasePageHeading = page.locator('h2[class="complete-purchase"]');
  }

  async goto() {
    await this.page.goto('/gift');
  }

  async verifyEmailDeliverySelected() {
    const emailOption = this.emailDeliveryOption;
    await expect(emailOption).toBeVisible();
    await expect(emailOption).toHaveClass(/focus/);
  }

  async fillSenderInfo(name: string, email: string) {
    await this.senderNameInput.fill(name);
    await this.senderEmailInput.fill(email);
  }

  async fillRecipientInfo(name: string, email: string) {
    await this.recipientNameInput.fill(name);
    await this.recipientEmailInput.fill(email);
  }

  async selectNowDelivery() {
    await this.nowDeliveryOption.click();
    await expect(this.nowDeliveryOption).toHaveClass(/primary/);
  }

  async continueToPayment() {
    await this.continueToPaymentButton.click();
  }

  async verifyOrderSummary() {
    await expect(this.orderSummary).toBeVisible();
    await expect(this.page.locator('div[class*="col-"] > p:nth-of-type(2)')).toHaveText(' $100');
    await expect(this.page.locator('div:nth-of-type(2) > p:nth-of-type(4)')).toBeVisible();
  }

  async fillPaymentInfo(cardNumber: string, expiry: string, cvv: string) {
    await this.cardNumberInput.fill(cardNumber);
    await this.expiryDateInput.fill(expiry);
    await this.cvvInput.fill(cvv);
  }

  async selectCountry(country: string = 'Canada') {
    await this.countryDropdown.selectOption({ label: country });
  }

  async purchaseGiftCard() {
    await this.purchaseGiftCardButton.click();
    
  }

  async verifyConfirmationPage() {
    await expect(this.confirmationPage).toBeVisible({ timeout: 15000 });
    await expect(this.confirmationPage).toHaveText('Your gift card purchase is complete!');
  }

async expectError(errorText: string) {
    await expect(this.page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('p').filter({ hasText: errorText })).toBeVisible({ timeout: 10000 });

}

async insufficientErrorMessage() {
    await expect(this.insufficientFundErrorMessage).toBeVisible({ timeout: 15000 });

}

async allowPaymentRequest() {
    await expect(this.allowPaymentRequestButton).toBeVisible({ timeout: 55000 });
    await this.allowPaymentRequestButton.click();

    
  }
  async expectValidationErrors() {
  await expect(this.errorMessages).toHaveCount(4);
  const errorCount = await this.errorMessages.count();
  for (let i = 0; i < errorCount; i++) {
    await expect(this.errorMessages.nth(i)).toBeVisible();
  }
}
  async expectPaymentValidationErrors() {
  
    await expect(this.cardNumberError).toBeVisible({ timeout: 15000 });
    await expect(this.expiryError).toBeVisible({ timeout: 15000 });
    await expect(this.cvvError).toBeVisible({ timeout: 15000 });
}
}

