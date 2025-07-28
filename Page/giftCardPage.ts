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
  readonly senderNameError: Locator;
  readonly senderEmailError: Locator;
  readonly recipientNameError: Locator;
  readonly recipientEmailError: Locator;
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
    this.senderNameInput = page.locator('div[class*="col-"]:nth-of-type(2) > div[class="form-group"]:nth-of-type(1) > input[class="form-control"]');
    this.senderEmailInput = page.locator('div[class="form-group"]:nth-of-type(2) > input[required]');
    this.recipientNameInput = page.locator('div[class="form-group"]:nth-of-type(4) > input[required]');
    this.recipientEmailInput = page.locator('div[class="row justify-content-center"]:nth-of-type(4) input[class="form-control"]');
    
    // Buttons
    this.continueToPaymentButton = page.locator('span[class="sentence-case"]');
    this.purchaseGiftCardButton = page.locator('button[id="submit"] > span[class="sentence-case"]');
    this.allowPaymentRequestButton = page.frameLocator('iframe[id="challengeFrame"]').locator('button[id="test-source-authorize-3ds"]')
    
    // Payment fields (likely in iframes for Stripe)
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
    this.senderNameError = page.locator('[data-error="sender-name"], .sender-name-error');
    this.senderEmailError = page.locator('[data-error="sender-email"], .sender-email-error');
    this.recipientNameError = page.locator('[data-error="recipient-name"], .recipient-name-error');
    this.recipientEmailError = page.locator('[data-error="recipient-email"], .recipient-email-error');
    this.cardNumberError = page.locator('[data-error="card-number"], .card-number-error');
    this.expiryError = page.locator('[data-error="expiry"], .expiry-error');
    this.cvvError = page.locator('[data-error="cvv"], .cvv-error');

    //Heading 
    this.purchasePageHeading = page.locator('h2[class="complete-purchase"]');
  }

  async goto() {
    await this.page.goto('/gift');
  }

  async verifyEmailDeliverySelected() {
    // Check if email delivery is pre-selected (green highlight)
    const emailOption = this.emailDeliveryOption;
    await expect(emailOption).toBeVisible();
    
    // Check for various ways the selection might be indicated
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
    // Verify "Now" is highlighted/selected
    await expect(this.nowDeliveryOption).toHaveClass(/primary/);
  }

  async continueToPayment() {
    await this.continueToPaymentButton.click();
    
    // Verify we're on payment page by checking for payment elements
    await expect(this.purchasePageHeading).toBeVisible({ timeout: 10000 });
  }

  async verifyOrderSummary() {
    await expect(this.orderSummary).toBeVisible();
    
    // Check for $100 amount
    await expect(this.page.locator('div[class*="col-"] > p:nth-of-type(2)')).toHaveText(' $100');
    
    // Check for recipient info
    await expect(this.page.locator('div:nth-of-type(2) > p:nth-of-type(4)')).toBeVisible();
  }

  async fillPaymentInfo(cardNumber: string, expiry: string, cvv: string) {
    // Fill card number
    await this.cardNumberInput.fill(cardNumber);
    
    // Fill expiry
    await this.expiryDateInput.fill(expiry);
    
    // Fill CVV
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

async insufficientErrorMessage(errorText: string) {
    await expect(this.page.frameLocator('iframe[allow="payment *; publickey-credentials-get *"]').locator('div[id="error-message"]').filter({ hasText: errorText })).toBeVisible({ timeout: 10000 });

}

async allowPaymentRequest() {
    await expect(this.allowPaymentRequestButton).toBeVisible({ timeout: 15000 });
    await this.allowPaymentRequestButton.click();
    
  }
  async expectValidationErrors() {
    // Check for required field errors
    await expect(this.errorMessages).toBeVisible();
  }
}

