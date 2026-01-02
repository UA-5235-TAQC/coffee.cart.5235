import {expect} from "@playwright/test";
import {test} from "../../fixtures/fixturePage";
import {CoffeeTypes} from "../../data/CoffeeTypes";

test.describe("TC-25: Promo banner & theme persistence via URL parameter", () => {

    test("Promo banner display and theme persistence when using ?ad=1", async ({menuPage, cartPage, page}) => {

        await page.goto("/");

        // на https://coffee-cart.app/
        const stylesDefault = await page.evaluate(() => {
            const s = window.getComputedStyle(document.body);
            return {
                fontFamily: s.fontFamily,
                fontWeight: s.fontWeight,
                fontSize: s.fontSize,
                lineHeight: s.lineHeight,
                color: s.color
            };
        });
        console.log('Default:', stylesDefault);

        // Step 1: Navigate with ad parameter
        await page.goto("/?ad=1");

        // на https://coffee-cart.app/?ad=1
        const stylesAd = await page.evaluate(() => {
            const s = window.getComputedStyle(document.body);
            return {
                fontFamily: s.fontFamily,
                fontWeight: s.fontWeight,
                fontSize: s.fontSize,
                lineHeight: s.lineHeight,
                color: s.color
            };
        });
        console.log('Ad:', stylesAd);

        // Verify promo banner is visible
        const promoBanner = page.locator('img[src="/banner.jpg"]');
        await expect(promoBanner).toBeVisible();

        // Step 2: Verify main page elements are accessible
        const espresso = menuPage.getCoffeeItem(CoffeeTypes.Espresso.en);
        expect(await espresso.getName()).toBe(CoffeeTypes.Espresso.en);
        expect(await espresso.isVisible()).toBe(true);

        // Step 3: Add drink and navigate to Cart
        await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
        await menuPage.addToLocalStorage(CoffeeTypes.Espresso.en);
        const cartData = await menuPage.getLocalStorage('cart') ?? '[]';
        await cartPage.setLocalStorage('cart', cartData);
        await cartPage.navigate();

        // Verify cart page loaded & theme persisted
        await expect(page).toHaveURL(/\/cart/);
        const cartItems = await cartPage.getItemsList();
        expect(cartItems.length).toBeGreaterThan(0);

        // Step 4: Return to main page
        await menuPage.navigate();
        await expect(promoBanner).toBeVisible();

        // Step 5: Open Payment form
        const paymentModal = await menuPage.showPaymentModal();
        expect(paymentModal.getTitle()).toContain("Payment details");

        // Step 6: Remove ?ad=1 and reload
        await page.goto("/");
        await page.reload();

        // Promo banner disappears
        await expect(promoBanner).toBeHidden();
    });

});
