import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";

test.describe("Cart item", () => {
    test.beforeEach(async ({ menuPage }) => {
        await menuPage.navigate();
        const cartItemCount = await menuPage.getItemCount();
        expect(cartItemCount).toBe(0);
    });

    test("TC-006: Managing the number of items in the cart", async ({ menuPage, cartPage }) => {
        const coffeeName = CoffeeTypes.Cappuccino.en;
        const cappuccinoPrice = await menuPage.getCoffeeItem(coffeeName).getPrice();

        await menuPage.addCoffeeToCart(coffeeName);
        await menuPage.addCoffeeToCart(coffeeName);
        await menuPage.addCoffeeToCart(coffeeName);

        let amountOfItemsInCart = 3;
        let expectedTotalPrice = cappuccinoPrice * amountOfItemsInCart;

        expect(await menuPage.getItemCount()).toBe(amountOfItemsInCart);
        expect(await menuPage.getTotalBtnPrice()).toBe(expectedTotalPrice);

        await menuPage.clickCartLink();
        await cartPage.waitForVisible();

        const cartItem = await cartPage.getItemByName(coffeeName);
        if (!cartItem) throw new Error(`"${coffeeName}" is not found`);

        expect(await cartItem.getQuantity()).toBe(amountOfItemsInCart);
        expect(await cartItem.getTotalPrice()).toBe(expectedTotalPrice);

        await cartItem.increaseQuantity();
        amountOfItemsInCart += 1;
        expectedTotalPrice = cappuccinoPrice * amountOfItemsInCart;

        expect(await cartItem.getQuantity()).toBe(amountOfItemsInCart);
        expect(await cartItem.getTotalPrice()).toBe(expectedTotalPrice); // Тепер буде 76 === 76

        await cartItem.decreaseQuantityBy(amountOfItemsInCart);

        await expect(cartItem.container).toBeHidden();
        const isCartEmpty = await cartPage.isEmpty();
        expect(isCartEmpty).toBe(true);
    });
});