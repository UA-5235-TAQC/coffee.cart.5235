import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";
import { TestDataBuilder } from "../data";

test.describe('Checking the possibility of unauthorized addition of several units of promotional goods', () => {
    test.beforeEach(async ({ menuPage }) => {
        await menuPage.navigate();
    });

    test("TC-22: Checking of infinite addition of discounted items in the cart", async ({
        menuPage,
        cartPage,
    }) => {
        const { promoModal } = menuPage;

        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);

        await promoModal.waitForVisible();

        await promoModal.acceptPromo();

        await promoModal.waitForHidden();

        await menuPage.clickCartLink();
        await cartPage.waitForVisible();

        const discountedMocha = await cartPage.getItemByName(CoffeeTypes.Mocha.en);
        expect(discountedMocha).not.toBeNull();

        for (let i = 0; i < 5; i++) {
            await discountedMocha!.increaseQuantity();
        }

        const { paymentModal, successSnackbar } = menuPage;
        const { name, email } = TestDataBuilder.validPaymentDetails();

        await menuPage.showPaymentModal();
        await paymentModal.waitForVisible();

        await paymentModal.enterName(name);
        await paymentModal.enterEmail(email);
        await paymentModal.togglePromotionAgreement();

        await paymentModal.submitPayment();
        await successSnackbar.waitForVisible();

        const snackbarMessage = await successSnackbar.getMessage();

        expect(snackbarMessage).toBe(TestDataBuilder.validSuccessSnackbarMessage());
    });
});