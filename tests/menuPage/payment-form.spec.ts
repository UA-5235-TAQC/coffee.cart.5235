import {expect} from '@playwright/test';
import {CoffeeTypes} from "../../data";
import {test} from "../../fixtures/fixturePage";
import {TestDataBuilder} from "../../data";

test.describe('TC-23: Payment Form Validation', () => {

    test.beforeEach(async ({menuPage}) => {
        // Preconditions: Open the website
        await menuPage.navigate();
        // The cart is empty
        const cartItemCount = await menuPage.getItemCount();
        expect(cartItemCount).toBe(0);
    });

    test('Validate payment form', async ({menuPage}) => {
        // Step 1: Add Espresso coffee to the cart
        const espressoName = CoffeeTypes.Espresso.en;
        await menuPage.addCoffeeToCart(espressoName);
        const espressoPrice = await menuPage.getCoffeeItem(espressoName).getPrice();
        await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(espressoPrice);

        // Step 2: Open the payment form
        await menuPage.showPaymentModal();
        const paymentModal = menuPage.paymentModal;
        expect(await paymentModal.getTitle()).toContain('Payment details');

        // Step 3: Enter an excessive name (>1000 chars)
        const longName = TestDataBuilder.longName();
        await paymentModal.enterName(longName);
        expect(await paymentModal.getNameValue()).toBe(longName);

        // Step 4: Enter an excessive email (>300 chars)
        const longEmail = TestDataBuilder.longEmail();
        await paymentModal.enterEmail(longEmail);
        expect(await paymentModal.getEmailValue()).toBe(longEmail);

        // Step 5: Enter a name with special character
        const specialCharName = 'yaroslav@g';
        await paymentModal.enterName(specialCharName);
        expect(await paymentModal.getNameValue()).toBe(specialCharName);

        // Step 6: Invalid email (missing @)
        const invalidEmail = TestDataBuilder.invalidEmail();
        await paymentModal.enterEmail(invalidEmail);
        expect(await paymentModal.getEmailValue()).toBe(invalidEmail);
        await paymentModal.submitPayment();

        const validationMessage = await paymentModal.getEmailValidationMessage();
        expect(validationMessage).toBeTruthy();

        // Step 7: Submit with empty name
        const emptyInput = TestDataBuilder.emptyInput();
        await paymentModal.enterName(emptyInput);
        expect(await paymentModal.getNameValue()).toBe(emptyInput);
        await paymentModal.submitPayment();

        const isNameValid = await paymentModal.isNameValid();
        expect(isNameValid).toBe(false);

        // Step 8: Enter valid name
        const validPayment = TestDataBuilder.validPaymentDetailsAlternative();
        await paymentModal.enterName(validPayment.name);
        expect(await paymentModal.getNameValue()).toBe(validPayment.name);

        // Step 9: Submit with empty email
        await paymentModal.enterEmail(emptyInput);
        expect(await paymentModal.getEmailValue()).toBe(emptyInput);
        await paymentModal.submitPayment();

        const isEmailValid = await paymentModal.isEmailValid();
        expect(isEmailValid).toBe(false);

        // Step 10: Enter valid email
        await paymentModal.enterEmail(validPayment.email);
        expect(await paymentModal.getEmailValue()).toBe(validPayment.email);

        // Step 11: Submit valid data
        await paymentModal.submitPayment();

        const snackbar = menuPage.successSnackbar;
        await snackbar.waitForVisible();
        expect(await snackbar.getMessage()).toContain(
            TestDataBuilder.validSuccessSnackbarMessage()
        );
    });
});
