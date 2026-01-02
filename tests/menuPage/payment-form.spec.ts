import {expect} from '@playwright/test';
import {CoffeeTypes} from "../../data";
import {test} from "../../fixtures/fixturePage";

test.describe('TC-23: Payment Form Validation', () => {

    test.beforeEach(async ({menuPage}) => {
        // Preconditions: Open the website
        await menuPage.navigate();
        // The cart is empty
        await expect.poll(() => menuPage.getItemCount()).toBe(0);
    });

    test('Validate payment form', async ({menuPage}) => {
        // Step 1: Add Espresso coffee to the cart
        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        const cafeEspressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
        await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(cafeEspressoPrice);

        // Step 2: Open the payment form
        const paymentModal = await menuPage.showPaymentModal();
        expect(await paymentModal.getTitle()).toContain('Payment details');

        // Step 3: Enter an excessive name (>1000 chars)
        const longName = 'A'.repeat(1001);
        await paymentModal.enterName(longName);
        expect(await paymentModal.getNameValue()).toBe(longName);

        // Step 4: Enter an excessive email (>300 chars)
        const longEmail = 'a'.repeat(301) + '@gmail.com';
        await paymentModal.enterEmail(longEmail);
        expect(await paymentModal.getEmailValue()).toBe(longEmail);

        // Step 5: Enter a name with special char
        const specialCharName = 'yaroslav@g';
        await paymentModal.enterName(specialCharName);
        expect(await paymentModal.getNameValue()).toBe(specialCharName);

        // Step 6: Invalid email (missing @)
        const invalidEmail = 'yaroslav_gmail.com';
        await paymentModal.enterEmail(invalidEmail);
        expect(await paymentModal.getEmailValue()).toBe(invalidEmail);
        await paymentModal.submitPayment();

        const validationMessage = await paymentModal.getEmailValidationMessage();
        expect(validationMessage).toContain("@");

        // Step 7: Submit with empty name
        const emptyInput = '';
        await paymentModal.enterName(emptyInput);
        expect(await paymentModal.getNameValue()).toBe(emptyInput);
        await paymentModal.submitPayment();

        const isNameValid = await paymentModal.isNameValid();
        expect(isNameValid).toBe(false);

        // Step 8: Enter valid name
        const validName = 'Yaroslav';
        await paymentModal.enterName(validName);
        expect(await paymentModal.getNameValue()).toBe(validName);

        // Step 9: Submit with empty email
        await paymentModal.enterEmail(emptyInput);
        expect(await paymentModal.getEmailValue()).toBe(emptyInput);
        await paymentModal.submitPayment();

        const isEmailValid = await paymentModal.isEmailValid();
        expect(isEmailValid).toBe(false);

        // Step 10: Enter valid email
        const validEmail = 'yaroslav@gmail.com';
        await paymentModal.enterEmail(validEmail);
        expect(await paymentModal.getEmailValue()).toBe(validEmail);

        // Step 11: Submit valid data
        await paymentModal.submitPayment();

        const snackbar = menuPage.successSnackbar;
        await snackbar.waitForVisible();
        expect(await snackbar.getMessage()).toContain('Thanks for your purchase');
    });
});
