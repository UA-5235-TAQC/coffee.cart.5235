import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import {CoffeeTypes} from "../data/CoffeeTypes";
import {TestDataBuilder} from "../data/testDataBuilder";

test.describe("TC-24: Promo logic & cart management", () => {

    test.beforeEach(async ({ menuPage }) => {
        // Open the main page
        await menuPage.navigate();
        // Ensure the cart is empty
        const cartItemCount = await menuPage.getItemCount();
        expect(cartItemCount).toBe(0);
    });

    test("Functional test of promo + cart + payment flow", async ({ menuPage, cartPage }) => {

        // Step 1: Add 3 Espresso
        for (let i = 0; i < 3; i++) {
            await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        }
        const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();

        const amountOfEspresso = 3;
        const espressoTotal = espressoPrice * amountOfEspresso;

        const cartItemCount = await menuPage.getItemCount();
        const totalBtnPrice = await menuPage.getTotalBtnPrice();

        expect(cartItemCount).toBe(amountOfEspresso);
        expect(totalBtnPrice).toBe(espressoTotal);

        // Step 2: Accept the promo offer
        await menuPage.showPromoModal();
        await menuPage.promoModal.acceptPromo();
        await menuPage.promoModal.waitForHidden();
        expect(await menuPage.getItemCount()).toBe(4);
        const mochaPrice = 4;
        const expectedPromoTotal = espressoTotal + mochaPrice;
        expect(await menuPage.getTotalBtnPrice()).toBe(expectedPromoTotal);

        // Step 3: Add 2 Cappuccino
        for (let i = 0; i < 2; i++) {
            await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);
        }
        expect(await menuPage.getItemCount()).toBe(6);

        const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();
        let amountOfCappuccino = 2;
        let cappuccinoTotal = cappuccinoPrice * amountOfCappuccino;
        const expectedTotal = expectedPromoTotal + cappuccinoTotal;
        expect(await menuPage.getTotalBtnPrice()).toBe(expectedTotal);

        // Step 4: Navigate to Cart page
        await menuPage.clickCartLink();
        await expect(cartPage.itemList).toBeVisible();
        const totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(6);
        const items = await cartPage.getItemsList();
        expect(items.length).toBe(3);

        const cartEspressoItem = await cartPage.getItemByName(CoffeeTypes.Espresso.en);
        await expect(cartEspressoItem.container).toBeVisible();

        const cartEspressoItemQuantity = await cartEspressoItem.getQuantity();
        const cartEspressoItemTotalPrice = await cartEspressoItem.getTotalPrice();

        expect(cartEspressoItemQuantity).toBe(amountOfEspresso);
        expect(cartEspressoItemTotalPrice).toBe(espressoTotal);

        const cartCappuccinoItem = await cartPage.getItemByName(CoffeeTypes.Cappuccino.en);
        await expect(cartCappuccinoItem.container).toBeVisible();

        const cartCappuccinoItemQuantity = await cartCappuccinoItem.getQuantity();
        const cartCappuccinoItemTotalPrice = await cartCappuccinoItem.getTotalPrice();

        expect(cartCappuccinoItemQuantity).toBe(amountOfCappuccino);
        expect(cartCappuccinoItemTotalPrice).toBe(cappuccinoTotal);

        const cartMochaItem = await cartPage.getItemByName(CoffeeTypes.Mocha.en);
        await expect(cartMochaItem.container).toBeVisible();

        const cartMochaItemQuantity = await cartMochaItem.getQuantity();
        const cartMochaItemTotalPrice = await cartMochaItem.getTotalPrice();

        expect(cartMochaItemQuantity).toBe(1);
        expect(cartMochaItemTotalPrice).toBe(mochaPrice);
        expect(await cartPage.getTotalPrice()).toBe(expectedTotal);

        // Step 5: Increase Cappuccino quantity by 1
        await cartCappuccinoItem.increaseQuantity();
        amountOfCappuccino += 1;
        cappuccinoTotal = cappuccinoPrice * amountOfCappuccino;

        const cartItemQuantityAfterIncrease = await cartCappuccinoItem.getQuantity();
        const cartItemTotalPriceAfterIncrease = await cartCappuccinoItem.getTotalPrice();

        expect(cartItemQuantityAfterIncrease).toBe(amountOfCappuccino);
        expect(cartItemTotalPriceAfterIncrease).toBe(cappuccinoTotal);

        // Step 6: Delete all Cappuccino
        for (let i = 0; i < amountOfCappuccino; i++) {
            await cartCappuccinoItem.decreaseQuantity();
        }
        const updatedItems = await cartPage.getItemsList();
        expect(updatedItems.length).toEqual(2);
        await expect(async () => {
            await cartPage.getItemByName(CoffeeTypes.Cappuccino.en);
        }).rejects.toThrow(
            `Item with name "${CoffeeTypes.Cappuccino.en}" not found in the cart.`
        );
        expect(await cartPage.getTotalPrice()).toBe(expectedPromoTotal);

        // Step 7: Open Payment Form
        const paymentModal = await menuPage.showPaymentModal();
        await paymentModal.waitForVisible();
        expect(await paymentModal.isVisible()).toBe(true);

        // Steps 8: Enter valid name
        const promoData = TestDataBuilder.validPaymentDetailsYaroslav();
        await paymentModal.enterName(promoData.name);
        expect(await paymentModal.getNameValue()).toBe(promoData.name);

        // Steps 9: Enter valid email
        await paymentModal.enterEmail(promoData.email);
        expect(await paymentModal.getEmailValue()).toBe(promoData.email);

        // Step 10: Submit Payment
        await paymentModal.submitPayment();

        // Verify success snackbar
        const snackbar = menuPage.successSnackbar;
        await snackbar.waitForVisible();
        expect(await snackbar.getMessage()).toContain(TestDataBuilder.validSuccessSnackbarMessage());
    });
});
