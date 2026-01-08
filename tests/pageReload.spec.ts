import { test, expect } from "../fixtures/fixturePage";
import { CartPreviewComponent } from "../component";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe("Page reload - Cart items persistence", () => {
    let cartPreview: CartPreviewComponent;

    test.beforeEach(async ({ menuPage }) => {
        await menuPage.navigate();
        cartPreview = new CartPreviewComponent(menuPage.page);
    });


    test("the cart items are saved when the page is reloaded", async ({ menuPage, cartPage }) => {
        const itemName = CoffeeTypes.Espresso.en;

        await menuPage.addCoffeeToCart(itemName);

        // cart page
        await menuPage.clickCartLink();
        await cartPage.page.reload();

        await expect(
            cartPage.page.locator('li.list-item', { hasText: itemName })
        ).toHaveCount(1);

        // back to menu
        await cartPage.clickMenuLink();
        await menuPage.showCheckout();

        await expect(cartPreview.getCartItem(itemName)).toHaveCount(1);
    });
});
