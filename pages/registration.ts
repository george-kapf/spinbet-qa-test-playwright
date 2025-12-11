import { type Page, type Locator, expect } from '@playwright/test';
import type { AccountDetails, PersonalDetails, AddressDetails, PaymentDetails } from '../utils/types';

export class RegistrationPage {
  readonly page: Page;
  readonly signUpButton: Locator;
  readonly modal: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly closeButton: Locator;

  // Step 1: Account Details
  readonly username: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly phoneCode: Locator;
  readonly phone: Locator;

  // Step 2: Bonus Selection
  readonly termsCheckbox: Locator;
  readonly termsLink: Locator;

  // Step 3: Personal Information
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly dob: Locator;

  // Step 4: Address Details
  readonly address: Locator;
  readonly city: Locator;
  readonly region: Locator;
  readonly selectRegion: Locator;
  readonly zipcode: Locator;

  // Step 5: Payment Information (Assuming standardized fields)
  readonly creditCardOption: Locator;
  readonly amount: Locator;
  readonly cardName: Locator;
  readonly cardNumber: Locator;
  readonly cardExpiry: Locator;
  readonly cardCvv: Locator;
  readonly amountValue: Locator;
  readonly feeValue: Locator;
  readonly totalValue: Locator;
  readonly submitButton: Locator;
  readonly snackbarSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });
    this.modal = page.locator('div[role="dialog"]');

    // Use text locator for Next/Back/Close as they may not be semantic buttons
    //this.nextButton = page.getByTestId('next-button')
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.backButton = page.getByTestId('back-button');
    this.closeButton = page.getByTestId('close-button');

    // Step 1 - Adding robustness
    this.username = page.getByPlaceholder('e.g. John Doe');
    this.email = page.getByRole('textbox', { name: 'your@email.address' });
    this.password = page.getByRole('textbox', { name: 'Min 6 characters' });
    this.phoneCode = page.getByText('+64');
    this.phone = page.getByTestId('phone_number');

    // Step 2
    this.termsCheckbox = page.getByRole('checkbox', { name: 'I agree and understand the' });
    this.termsLink = page.getByRole('link', { name: 'Terms of Conditions' });

    // Step 3
    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.dob = page.getByRole('textbox', { name: 'DD/MM/YYYY' });

    // Step 4
    this.address = page.getByRole('textbox', { name: 'Address' });
    this.city = page.getByRole('textbox', { name: 'City' });
    this.region = page.getByRole('combobox', { name: 'Region' });
    this.selectRegion = page.getByRole('option', { name: 'Auckland Region' });
    this.zipcode = page.getByRole('textbox', { name: 'Zip Code' });

    // Step 5
    this.creditCardOption = page.getByText(/Credit Card/i);
    this.amount = page.locator('#cashierIframe').contentFrame().getByRole('textbox', { name: '$2 - $' });
    this.cardName = page
      .locator('#cashierIframe')
      .contentFrame()
      .locator('iframe[name="hosted-field-single-iframe"]')
      .contentFrame()
      .getByRole('textbox', { name: 'Name' });
    this.cardNumber = page
      .locator('#cashierIframe')
      .contentFrame()
      .locator('iframe[name="hosted-field-single-iframe"]')
      .contentFrame()
      .getByRole('textbox', { name: 'Card number' });
    this.cardExpiry = page
      .locator('#cashierIframe')
      .contentFrame()
      .locator('iframe[name="hosted-field-single-iframe"]')
      .contentFrame()
      .getByRole('textbox', { name: '•• / ••' });
    this.cardCvv = page
      .locator('#cashierIframe')
      .contentFrame()
      .locator('iframe[name="hosted-field-single-iframe"]')
      .contentFrame()
      .getByRole('textbox', { name: 'Security Code' });
    this.amountValue = page.frameLocator('#cashierIframe').locator('.summary-row.amount-container .value');
    this.feeValue = page.frameLocator('#cashierIframe').locator('.summary-row.fee-container .value');
    this.totalValue = page.frameLocator('#cashierIframe').locator('.summary-row.total-container .value');
    this.submitButton = page.locator('#cashierIframe').contentFrame().getByRole('button', { name: 'Deposit' });
    this.snackbarSuccess = page.getByTestId('snackbar-success');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openRegistrationModal() {
    await this.signUpButton.click();
    await expect(this.modal).toBeVisible();
  }

  async fillAccountDetails(details: AccountDetails) {
    // Ensure modal is stable
    await expect(this.username).toBeVisible();
    await this.username.fill(details.username);
    await this.email.fill(details.email);
    if (details.password) {
      await this.password.fill(details.password);
    }
    await expect(this.phoneCode).toBeVisible({ timeout: 30_000 });
    await this.phone.fill(details.phone);
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async selectBonusAndTerms() {
    await this.termsCheckbox.click();
    await expect(this.termsLink).toBeVisible();
  }

  async fillPersonalDetails(details: PersonalDetails) {
    await this.firstName.fill(details.firstName);
    await this.lastName.fill(details.lastName);
    await this.dob.fill(details.dob);
  }

  async fillAddressDetails(details: AddressDetails) {
    await this.address.fill(details.address);
    await this.city.fill(details.city);
    await expect(this.region).toBeVisible({ timeout: 60_000 });
    await this.region.click();
    // If region is dynamic, we might want to make this configurable, but for now we click the locator
    if (details.region) {
      await this.page.getByRole('option', { name: details.region }).click();
    } else {
      await this.selectRegion.click();
    }
    await this.zipcode.fill(details.zipcode);
  }

  async fillPaymentDetails(details: PaymentDetails) {
    await this.creditCardOption.click();
    await this.amount.fill(details.amount);
    await this.cardName.fill(details.cardName);

    await this.cardNumber.fill(details.cardNumber || '4242424242424242'); // Default test card if not provided
    await this.cardExpiry.fill(details.cardExpiry || '12/25');
    await this.cardCvv.fill(details.cardCvv || '123');

    await expect(this.amountValue).toHaveText(`$${details.amount}`);
    await expect(this.feeValue).toHaveText('$5');
    await expect(this.totalValue).toHaveText(`$${parseFloat(details.amount) + 5}`);
  }

  async submitRegistration() {
    await this.submitButton.click();
  }
}
