import { test, expect } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";
import { CartPreviewComponent } from "../component/CartPreviewComponent";

test.describe("Page reload - Cart items persistence", () => {


    test("the cart items are saved when the page is reloaded", async ({ page, menuPage, cartPage }) => {
        await menuPage.navigate();
        await expect(cartPage.getTotalQuantity()).resolves.toBe(0);

        const itemName = CoffeeTypes.EspressoConPanna.en;

        // add item
        await menuPage.addCoffeeToCart(itemName);

        // go to cart & reload
        await cartPage.navigate();
        await cartPage.reload();

        await expect(cartPage.getTotalQuantity()).resolves.toBe(1);

        // back to menu
        await menuPage.navigate();
        await menuPage.showCheckout();

        const cartPreview = new CartPreviewComponent(page);
        await expect(cartPreview.getCartItem(itemName)).toHaveCount(1);
    });
});
