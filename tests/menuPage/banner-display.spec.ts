import { test, expect } from "../../fixtures/fixturePage";
import {CoffeeTypes} from "../../data/CoffeeTypes";
import {PaymentDetailsModalComponent} from "../../component";
import {expectLobsterFont} from "../../utils/styleUtils";

test.describe("TC-25: Promo banner & theme persistence via URL parameter", () => {

    test("Promo banner display and theme persistence when using ?ad=1", async ({menuPage, cartPage, page}) => {

        await menuPage.navigate();

        // Check Lobster font is NOT applied initially
        const initialStyleExists = await menuPage.instance.evaluate(() =>
            Array.from(document.querySelectorAll("style")).some(s =>
                s.innerText.includes("font-family: 'Lobster'")
            )
        );
        expect(initialStyleExists).toBe(false);

        // Step 1: Navigate with ad parameter
        await menuPage.navigate("/?ad=1");
        const styleExistsAfter = await expectLobsterFont(menuPage.instance);
        expect(styleExistsAfter).toBe(true);


        // Step 2: Verify main page elements are visible
        const promoBanner = menuPage.instance.locator('img[alt*="free 1 bag of coffe beans"]');
        await expect(promoBanner).toBeVisible();
        const expectedCoffeeCount = Object.keys(CoffeeTypes).length;
        const coffeeItems = await menuPage.getVisibleCoffeeItems();
        expect(coffeeItems.length).toBe(expectedCoffeeCount);
        for (const item of coffeeItems) {
            expect(await item.isVisible()).toBe(true);
        }

        // Step 3: Add Espresso to cart
        const espressoName = CoffeeTypes.Espresso.en;
        await menuPage.addCoffeeToCart(espressoName);

        const espresso = menuPage.getCoffeeItem(espressoName);
        const espressoPrice = await espresso.getPrice();

        expect(await espresso.isVisible()).toBe(true);
        expect(await espresso.getName()).toBe(espressoName);

        const cartItemCount = await menuPage.getItemCount();
        const totalBtnPrice = await menuPage.getTotalBtnPrice();

        expect(cartItemCount).toBe(1);
        expect(totalBtnPrice).toBe(espressoPrice);

        await menuPage.clickCartLink();
        await expect(page).toHaveURL(/\/cart/);
        await expect(cartPage.itemList).toBeVisible();

        const cartItem = await cartPage.getItemByName(espressoName);
        await expect(cartItem.container).toBeVisible();
        expect(await cartItem.getQuantity()).toBe(1);
        expect(await cartItem.getTotalPrice()).toBe(espressoPrice);

        // Step 4: Return to main page
        await menuPage.clickMenuLink();
        await expect(promoBanner).toBeHidden();

        // Lobster font still persists on main page
        const styleExists = await expectLobsterFont(menuPage.instance);
        expect(styleExists).toBe(true);

        // Step 5: Open Payment form
        await menuPage.instance.getByLabel('Proceed to checkout').click();
        const paymentModal = new PaymentDetailsModalComponent(menuPage.instance);
        await paymentModal.waitForVisible();
        expect(await paymentModal.getTitle()).toContain("Payment details");

        const styleExistsPaymentModal = await expectLobsterFont(paymentModal.pageInstance);
        expect(styleExistsPaymentModal).toBe(true);
    });
});
