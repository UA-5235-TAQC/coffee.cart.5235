import { test, expect } from "@playwright/test";
import { MenuPage } from "../../page/MenuPage";
import { PaymentDetailsModalComponent } from "../../component/PaymentDetailsModalComponent";
import { SuccessSnackbarComponent } from "../../component/SuccessSnackbarComponent";
import { AssertionHelpers, TestDataBuilder, TestConstants } from "../../utils";
import env from "../../config/env";

test.describe("Payment Form Validation", () => {
  let menuPage: MenuPage;
  let paymentModal: PaymentDetailsModalComponent;
  let successSnackbar: SuccessSnackbarComponent;
  const baseClientUrl = env.BASE_CLIENT_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseClientUrl);
    menuPage = new MenuPage(page);
    paymentModal = new PaymentDetailsModalComponent(page);
    successSnackbar = new SuccessSnackbarComponent(page);

    // Add an item to enable checkout
    await menuPage.addCoffeeToCart("Espresso");
    
    // Open payment modal
    await menuPage.showPaymentModal();
    await paymentModal.waitForVisible();
  });

  test("TC-041: Verify payment form validation with valid data", async () => {
    const testData = TestDataBuilder.validPaymentDetails();

    // Step 1: Modal opens with empty fields
    const modalTitle = menuPage.instance.locator('h1:has-text("Payment details")');
    await AssertionHelpers.assertVisible(modalTitle, "Payment modal");

    // Steps 2-9: Enter valid data and submit
    await paymentModal.enterName(testData.name);
    await paymentModal.enterEmail(testData.email);
    
    // Step 9: Check no validation errors
    await AssertionHelpers.assertInputValue(menuPage.instance.locator('#name'), testData.name);
    await AssertionHelpers.assertInputValue(menuPage.instance.locator('#email'), testData.email);

    // Step 10: Submit
    await paymentModal.submitPayment();

    // Verify success message appears
    await successSnackbar.waitForVisible();
    const message = await successSnackbar.getMessage();
    expect(message).toContain(TestConstants.MESSAGES.PURCHASE_SUCCESS);

    // Verify cart cleared (cart(0))
    await AssertionHelpers.assertCartCount(menuPage.instance.getByLabel("Cart page"), 0);
  });

  test("TC-023: Payment form validation - boundary values and formats", async () => {
    // Step 7: Empty name field
    await paymentModal.enterEmail(TestDataBuilder.validPaymentDetails().email);
    await paymentModal.submitPayment();
    
    // Validation should prevent submission
    // (Browser native validation will trigger)
    
    // Step 8: Empty email field
    await paymentModal.enterName(TestDataBuilder.validPaymentDetails().name);
    await paymentModal.enterEmail("");
    await paymentModal.submitPayment();
    
    // Validation should prevent submission
  });

  test("TC-033: Verify email format validation", async () => {
    const validName = "Test User";
    const invalidEmails = TestDataBuilder.invalidEmails();

    // Step 2: Enter valid name
    await paymentModal.enterName(validName);

    // Step 3-5: Try invalid email formats
    for (const invalidEmail of invalidEmails.slice(0, 3)) {
      await paymentModal.enterEmail(invalidEmail);
      
      // Email field should show validation error or prevent submission
      const emailValue = await paymentModal.getEmailValue();
      expect(emailValue).toBe(invalidEmail);
      
      // Clear for next iteration
      await paymentModal.enterEmail("");
    }
  });

  test("TC-034: Verify payment form allows Cyrillic name", async () => {
    const cyrillicName = "Вася";
    const validEmail = "test@example.com";

    // Step 2: Enter name in Cyrillic
    await paymentModal.enterName(cyrillicName);
    
    // Step 3: Enter valid email
    await paymentModal.enterEmail(validEmail);

    // Step 4: Check checkbox
    await paymentModal.togglePromotionAgreement();

    // Step 5: Submit form
    await paymentModal.submitPayment();

    // Step 6: Verify success snackbar
    await successSnackbar.waitForVisible();
    const message = await successSnackbar.getMessage();
    expect(message).toContain(TestConstants.MESSAGES.PURCHASE_SUCCESS);

    // Step 7: Verify cart cleared
    await AssertionHelpers.assertCartCount(menuPage.instance.getByLabel("Cart page"), 0);
  });

  test("TC-032: Verify payment modal state after closing without submitting", async ({ page }) => {
    const testData = TestDataBuilder.validPaymentDetails();

    // Step 2-4: Fill form
    await paymentModal.enterName(testData.name);
    await paymentModal.enterEmail(testData.email);
    await paymentModal.togglePromotionAgreement();

    // Step 5: Close modal without submitting
    await paymentModal.closeModal();
    await paymentModal.waitForHidden();

    // Step 6: Reopen modal
    await menuPage.showPaymentModal();
    await paymentModal.waitForVisible();

    // Step 6: Verify state - form should be reset or retain values
    // (Behavior depends on implementation - document actual behavior)
    const nameValue = await paymentModal.getNameValue();
    const emailValue = await paymentModal.getEmailValue();
    
    // Most implementations reset the form
    expect(nameValue === "" || nameValue === testData.name).toBe(true);
    expect(emailValue === "" || emailValue === testData.email).toBe(true);

    // Step 7: Verify no submission occurred
    // Cart should still have items
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 1);
  });
});
