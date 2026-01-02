import { test, expect } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("MenuPage - Smoke Tests", () => {
    test('Add multiple different products to the cart and verify cart update', async ({ menuPage, cartPage }) => {
        const americano = CoffeeTypes.Americano['en'];
        const capuccino = CoffeeTypes.Cappuccino['en'];

        // 1. Verify that the product list is displayed
        await menuPage.navigate();
        await expect(menuPage.root).toBeVisible();
        // 2. Verify that Product A (e.g., Americano) is displayed in the product list
        await expect(menuPage.getCoffeeItem(americano).root).toBeVisible();
        // 3. Verify that Product B (e.g., Cappuccino) is displayed in the product list
        await expect(menuPage.getCoffeeItem(capuccino).root).toBeVisible();
        // 4. Verify that the prices of Product A and Product B are displayed
        await expect(menuPage.getCoffeeItem(americano).getPriceLocator).toBeVisible();
        await expect(menuPage.getCoffeeItem(capuccino).getPriceLocator).toBeVisible();
        // 5. Note the displayed prices of Product A and Product B
        const americanoPrice = await menuPage.getCoffeeItem(americano).getPrice();
        const capuccinoPrice = await menuPage.getCoffeeItem(capuccino).getPrice();
        // 6. Click on the Product A cup in the product list
        await menuPage.addCoffeeToCart(americano);
        expect(await menuPage.getItemCount()).toBe(1);
        // 7. Click on the Product B cup in the product list
        await menuPage.addCoffeeToCart(capuccino);
        expect(await menuPage.getItemCount()).toBe(2);
        // 8. Verify the total price displayed on the main page
        expect(await menuPage.getTotalBtnPrice()).toBe(americanoPrice + capuccinoPrice)
        // 9. Open the cart
        await menuPage.clickCartLink();
        await expect(cartPage.root).toBeVisible();
        // 10. Verify cart contents
        expect(await cartPage.getTotalQuantity()).toBe(2);
        await expect(cartPage.getItemByName(americano).root).toBeVisible();
        expect(await cartPage.getItemByName(americano).getUnitPrice()).toBe(americanoPrice);
        expect(await cartPage.getItemByName(americano).getQuantity()).toBe(1);
        expect(await cartPage.getItemByName(americano).getTotalPrice()).toBe(americanoPrice);

        await expect(cartPage.getItemByName(capuccino).root).toBeVisible();
        expect(await cartPage.getItemByName(capuccino).getUnitPrice()).toBe(capuccinoPrice);
        expect(await cartPage.getItemByName(capuccino).getQuantity()).toBe(1);
        expect(await cartPage.getItemByName(capuccino).getTotalPrice()).toBe(capuccinoPrice);
    });
});