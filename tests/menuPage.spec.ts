import { test, expect } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("MenuPage - Smoke Tests", () => {
    test('Add multiple different products to the cart and verify cart update', async ({ menuPage, cartPage }) => {
        const americano = CoffeeTypes.Americano['en'];
        const cappuccino = CoffeeTypes.Cappuccino['en'];

        // 1. Verify that the product list is displayed
        await menuPage.navigate();
        await menuPage.waitForVisible();
        // 2. Verify that Product A (e.g., Americano) is displayed in the product list
        expect(await menuPage.getCoffeeItem(americano).isVisible()).toBe(true);
        // 3. Verify that Product B (e.g., Cappuccino) is displayed in the product list
        expect(await menuPage.getCoffeeItem(cappuccino).isVisible()).toBe(true);
        // 4. Verify that the prices of Product A and Product B are displayed
        expect(await menuPage.getCoffeeItem(cappuccino).priceIsVisible()).toBe(true);
        expect(await menuPage.getCoffeeItem(americano).priceIsVisible()).toBe(true);
        // 5. Note the displayed prices of Product A and Product B
        const americanoPrice = await menuPage.getCoffeeItem(americano).getPrice();
        const cappuccinoPrice = await menuPage.getCoffeeItem(cappuccino).getPrice();
        // 6. Click on the Product A cup in the product list
        await menuPage.addCoffeeToCart(americano);
        expect(await menuPage.getItemCount()).toBe(1);
        // 7. Click on the Product B cup in the product list
        await menuPage.addCoffeeToCart(cappuccino);
        expect(await menuPage.getItemCount()).toBe(2);
        // 8. Verify the total price displayed on the main page
        expect(await menuPage.getTotalBtnPrice()).toBe(americanoPrice + cappuccinoPrice)
        // 9. Open the cart
        await menuPage.clickCartLink();
        expect(await cartPage.isVisible());
        // 10. Verify cart contents
        expect(await cartPage.getTotalQuantity()).toBe(2);
        expect(await cartPage.getItemByName(americano).isVisible()).toBe(true);
        expect(await cartPage.getItemByName(cappuccino).isVisible()).toBe(true);
        expect(await cartPage.getItemByName(americano).getUnitPrice()).toBe(americanoPrice);
        expect(await cartPage.getItemByName(cappuccino).getUnitPrice()).toBe(cappuccinoPrice);
        expect(await cartPage.getItemByName(americano).getQuantity()).toBe(1);
        expect(await cartPage.getItemByName(cappuccino).getQuantity()).toBe(1);
        expect(await cartPage.getItemByName(americano).getTotalPrice()).toBe(americanoPrice);
        expect(await cartPage.getItemByName(cappuccino).getTotalPrice()).toBe(cappuccinoPrice);
    });
});