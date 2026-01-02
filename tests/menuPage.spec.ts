import { test, expect } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("MenuPage - Smoke Tests", () => {
    test('Add 1 Americano to the cart and verify cart update', async ({ menuPage, cartPage }) => {
        const americano = CoffeeTypes.Espresso['en'];

        // 1. Verify that the product list is displayed
        await menuPage.navigate();
        await expect(menuPage.root).toBeVisible();
        // 2. Verify that the Americano product is displayed in the product list
        await expect(menuPage.getCoffeeItem(americano).root).toBeVisible();
        // 3. Verify that the Americano product price is displayed
        await expect(menuPage.getCoffeeItem(americano).getPriceLocator).toBeVisible();
        // 4. Note the displayed price of the Americano product
        const americanoPrice = await menuPage.getCoffeeItem(americano).getPrice();
        // 5. Click on the Americano cup in the product list
        await menuPage.addCoffeeToCart(americano);
        expect(await menuPage.getItemCount()).toBe(1);
        // 6. Verify the total price displayed on the main page
        expect(await menuPage.getTotalBtnPrice()).toBe(americanoPrice)
        // 7. Open the cart
        await menuPage.clickCartLink();
        await expect(cartPage.root).toBeVisible();
        // 8. Verify cart contents
        expect(await cartPage.getTotalQuantity()).toBe(1);
        await expect(cartPage.getItemByName(americano).root).toBeVisible();
        expect(await cartPage.getItemByName(americano).getUnitPrice()).toBe(americanoPrice);
        expect(await cartPage.getItemByName(americano).getQuantity()).toBe(1);
        expect(await cartPage.getItemByName(americano).getTotalPrice()).toBe(americanoPrice);
    });
});