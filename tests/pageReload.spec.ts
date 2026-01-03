import { test, expect } from "@playwright/test";
import { MenuPage } from "../page/MenuPage";
import env from "../config/env";
import { CartPreviewComponent } from "../component/CartPreviewComponent";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("Page reload - Cart items persistence", () => {
    let cartPreview: CartPreviewComponent;
    let menuPage: MenuPage;
    const baseClientUrl = env.BASE_CLIENT_URL;

    test.beforeEach(async ({ page }) => {
        await page.goto(baseClientUrl);
        menuPage = new MenuPage(page);
        cartPreview = new CartPreviewComponent(page);
    });


    test("the cart items are saved when the page is reloaded", async ({ page }) => {
        const itemName = CoffeeTypes.Espresso.en;

        await menuPage.addCoffeeToCart(itemName);

        // cart page
        await page.goto(`${baseClientUrl}/cart`);
        await page.reload();

        await expect(
            page.locator('li.list-item', { hasText: itemName })
        ).toHaveCount(1);

        // back to menu
        await page.goto(baseClientUrl);
        await menuPage.showCheckout();

        await expect(cartPreview.getCartItem(itemName)).toHaveCount(1);
    });
});