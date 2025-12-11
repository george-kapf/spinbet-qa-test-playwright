import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/registration';
import { REGISTRATION_DATA, REGISTRATION_TEXT } from '../utils/data/registrationData';
import { generateUniqueUsername, generateUniqueEmail, generateRandomPhone } from '../utils/testHelpers';

test.describe('User Registration Process', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  let registrationPage: RegistrationPage;
  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.goto();
  });

  test('TC-REG-001: Verify successful user registration with valid data and bonus selection (Happy Path)', { tag: '@Prod' }, async ({ page }) => {
    const { user } = REGISTRATION_DATA;

    const username = generateUniqueUsername(user.usernamePrefix);
    const email = generateUniqueEmail(user.emailPrefix);
    const phone = generateRandomPhone();

    await test.step('1. Navigate to landing page', async () => {
      // Done in beforeEach
      await expect(page).toHaveURL('/');
    });

    await test.step('2. Click Sign Up button', async () => {
      await registrationPage.openRegistrationModal();
      await expect(page).toHaveURL(REGISTRATION_TEXT.steps.accountDetails);
    });

    await test.step('3. Fill in all the fields with valid data', async () => {
      await registrationPage.fillAccountDetails({ username: username, email: email, password: user.password, phone: phone });
    });

    await test.step('4. Click Next', async () => {
      await registrationPage.clickNext();
      await expect(page).toHaveURL(REGISTRATION_TEXT.steps.bonusSelection);
    });

    await test.step('5. Check "I agree and understand the Terms of Conditions"', async () => {
      await registrationPage.selectBonusAndTerms();
    });

    await test.step('6. Click Next', async () => {
      await registrationPage.clickNext();
      await expect(page).toHaveURL(REGISTRATION_TEXT.steps.personalInfo);
    });

    await test.step('7. Fill Personal Info', async () => {
      await registrationPage.fillPersonalDetails({ firstName: user.firstName, lastName: user.lastName, dob: user.dob });
    });

    await test.step('8. Click Next', async () => {
      await registrationPage.clickNext();
      await expect(page).toHaveURL(REGISTRATION_TEXT.steps.addressDetails);
    });

    await test.step('9. Fill Address Details', async () => {
      await registrationPage.fillAddressDetails({ address: user.address, city: user.city, zipcode: user.zipcode, region: user.region });
    });

    await test.step('10. Click Next', async () => {
      await registrationPage.clickNext();
      await expect(page).toHaveURL(REGISTRATION_TEXT.steps.paymentInfo);
    });

    await test.step('11. Fill Payment Details', async () => {
      await registrationPage.fillPaymentDetails({ amount: user.amount, cardName: user.cardName });
    });

    await test.step('12. Submit Registration', async () => {
      await registrationPage.submitRegistration();
    });

    await test.step('13. Verify Registration Success', async () => {
      await expect(registrationPage.snackbarSuccess).toHaveText('Your deposit has been settled successfully. Enjoy the games.', { timeout: 30_000 });
    });
  });
});
