import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data";

test.describe("TC-24: Promo logic & cart management", () => {

    test.beforeEach(async ({ menuPage }) => {
        // Open the main page
        await menuPage.navigate();
        // Ensure the cart is empty
        await expect.poll(() => menuPage.getItemCount()).toBe(0);
    });

    test("Functional test of promo + cart + payment flow", async ({ menuPage, cartPage }) => {

        // Step 1: Add 3 Espresso
        for (let i = 0; i < 3; i++) {
            await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
            await menuPage.addToLocalStorage(CoffeeTypes.Espresso.en);
        }
        await expect.poll(() => menuPage.getItemCount()).toBe(3);

        // Wait for Total button price to update
        const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
        const espressoTotal = espressoPrice * 3;
        await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(espressoTotal);

        // Step 2: Accept the promo offer
        await menuPage.showPromoModal();
        await menuPage.promoModal.acceptPromo();
        await expect.poll(() => menuPage.getItemCount()).toBe(4);
        const expectedPromoTotal = espressoTotal + 4;
        await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(expectedPromoTotal);
        await menuPage.addToLocalStorage(CoffeeTypes.Mocha.en);

        // Step 3: Add 2 Cappuccino
        for (let i = 0; i < 2; i++) {
            await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
            await menuPage.addToLocalStorage(CoffeeTypes.Cappuccino.en);
        }
        await expect.poll(() => menuPage.getItemCount()).toBe(6);

        // Check total price updated
        const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();
        const expectedTotal = expectedPromoTotal + cappuccinoPrice * 2;
        await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(expectedTotal);

        // Step 4: Navigate to Cart page
        const cartData = await menuPage.getLocalStorage('cart') ?? '[]';
        await cartPage.setLocalStorage('cart', cartData);
        await cartPage.navigate();
        const items = await cartPage.getItemsList();
        expect(items.length).toEqual(6);

        // Step 5: Increase Cappuccino quantity by 1
        const cappuccinoItem = await cartPage.getItemByName(CoffeeTypes.Cappuccino.en);
        if (cappuccinoItem) {
            await cappuccinoItem.increaseQuantity();
            const quantity = await cappuccinoItem.getQuantity();
            expect(quantity).toBe(3);
        }

        // Step 6: Delete all Cappuccino
        if (cappuccinoItem) {
            let quantity = await cappuccinoItem.getQuantity();
            while (quantity > 0) {
                await cappuccinoItem.decreaseQuantity();
                quantity = await cappuccinoItem.getQuantity();
            }
            const deleted = await cartPage.getItemByName(CoffeeTypes.Cappuccino.en);
            expect(deleted).toBeNull();
        }

        // Step 7: Open Payment Form
        const paymentModal = await menuPage.showPaymentModal();
        await expect(paymentModal.getRoot()).toBeVisible();

        // Step 8: Enter valid name
        const validName = "Yaroslav";
        await paymentModal.enterName(validName);
        expect(await paymentModal.getNameValue()).toBe(validName);

        // Step 9: Enter valid email
        const validEmail = "yaroslav@gmail.com";
        await paymentModal.enterEmail(validEmail);
        expect(await paymentModal.getEmailValue()).toBe(validEmail);

        // Step 10: Submit Payment
        await paymentModal.submitPayment();

        // Verify success snackbar
        const snackbar = menuPage.successSnackbar;
        await snackbar.waitForVisible();
        expect(await snackbar.getMessage()).toContain("Thanks for your purchase");
    });
});
