import { test, expect } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";

const consoleErrors: string[] = [];


test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;


    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(`[${msg.type()}] ${msg.text()}`);
        }
    });


    page.on('pageerror', error => {
        consoleErrors.push(`[Page Error] ${error.message}`);
    });
});


test('Verify no console errors occur when adding a product to cart', async ({ menuPage, cartPage }) => {
    const americano = CoffeeTypes.Americano['en'];
    // 1. Verify that the product list is displayed
    await menuPage.navigate();
    // 2. Verify that the Americano product is displayed in the product list
    expect(await menuPage.getCoffeeItem(americano).isVisible()).toBe(true);
    // 3. Verify that the Americano product price is displayed
    expect(await menuPage.getCoffeeItem(americano).priceIsVisible()).toBe(true);
    // 4. Note the displayed price of the Americano product
    const americanoPrice = await menuPage.getCoffeeItem(americano).getPrice();
    // 5. Click on the Americano cup in the product list
    await menuPage.addCoffeeToCart(americano);
    // 6. Verify the total price displayed on the main page
    expect(await menuPage.getTotalBtnPrice()).toBeGreaterThan(0);
    // 7. Open the cart
    await menuPage.clickCartLink();
    // 8. Verify cart contents
    const cartItem = await cartPage.getItemByName(americano);
    expect(cartItem, `Product ${americano} should be in the cart`).not.toBeNull();
    expect(await cartItem!.getName()).toBe(americano);
    expect(await cartItem!.getUnitPrice()).toBe(americanoPrice);
    expect(consoleErrors, `Found console errors during test: ${consoleErrors.join(', ')}`).toHaveLength(0);
});


test.describe("MenuPage - Smoke Tests", () => {
    test('Verify promo coffee popup shows up when adding every 3rd item to the cart', async ({ menuPage, cartPage }) => {
        const coffee = CoffeeTypes.Espresso['en'];
        // 1. Verify that the product list is displayed
        await menuPage.navigate();
        // 2. Select a product and record its displayed price
        const coffePrice = await menuPage.getCoffeeItem(coffee).getPrice();
        // 3. Click on the product cup 2 times
        await menuPage.addCoffeeToCart(coffee);
        await menuPage.addCoffeeToCart(coffee);
        expect(await menuPage.promoModal.isVisible()).toBe(false);
        // 4. Click on the product cup 3rd time
        await menuPage.addCoffeeToCart(coffee);
        expect(await menuPage.promoModal.isVisible()).toBe(true);
        // 5. Close the promo popup by clicking the Nah, I'll skip button
        await menuPage.promoModal.skipPromo();
        expect(await menuPage.promoModal.isVisible()).toBe(false);
        expect(await cartPage.getTotalQuantity()).toBe(3);
        expect(await cartPage.getTotalPrice()).toBe(coffePrice * 3);
        // 6. Click on the product cup 3 more times to reach 6 units
        await menuPage.addCoffeeToCart(coffee);
        await menuPage.addCoffeeToCart(coffee);
        await menuPage.addCoffeeToCart(coffee);
        expect(await menuPage.promoModal.isVisible()).toBe(true);
        expect(await cartPage.getTotalQuantity()).toBe(6);
        expect(await cartPage.getTotalPrice()).toBe(coffePrice * 6);
        // 7. Record the discounted price displayed in the promo popup
        const discountedPrice = menuPage.promoModal.getPromoPrice();
        // 8. Accept the promo popup by clicking Yes, of course! button
        await menuPage.promoModal.acceptPromo();
        expect(await cartPage.getItemCount()).toBe(7);
        // 9. Click on the selected product cup 3 more times
        await menuPage.addCoffeeToCart(coffee);
        await menuPage.addCoffeeToCart(coffee);
        expect(await cartPage.getItemCount()).toBe(9);
        expect(await menuPage.promoModal.isVisible()).toBe(true);
        // 10. Close the promo popup
        await menuPage.promoModal.skipPromo();
        expect(await cartPage.getItemCount()).toBe(9);
        expect(await menuPage.promoModal.isVisible()).toBe(false);
        // 11. Open the cart
        await menuPage.clickCartLink();
        expect(await cartPage.isVisible()).toBe(true);
        expect(await cartPage.getItemCount()).toBe(9);
        // 12. Verify cart contents
        expect(await cartPage.getTotalPrice()).toBe(coffePrice * 8 + await discountedPrice);
    });
});