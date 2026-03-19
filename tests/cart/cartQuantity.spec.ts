import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";

test.describe("Cart Quantity Management", () => {

    test.beforeEach(async ({ menuPage }) => {
        await menuPage.navigate();
        // Ensure the cart is empty using the base page method
        const cartItemCount = await menuPage.getItemCount();
        expect(cartItemCount).toBe(0);
    });

    test("TC-39: Verify quantity update via plus/minus/X buttons", async ({ menuPage, cartPage }) => {
        const espressoName = CoffeeTypes.Espresso.en;

        // Step 1: Add Espresso
        await menuPage.addCoffeeToCart(espressoName);
        const espressoPrice = await menuPage.getCoffeeItem(espressoName).getPrice();

        expect(await menuPage.getItemCount()).toBe(1);
        expect(await menuPage.getTotalBtnPrice()).toBe(espressoPrice);

        // Step 2: Navigate to the cart
        await menuPage.clickCartLink();
        await cartPage.waitForVisible();

        let amountOfEspresso = 1;
        const items = await cartPage.getItemsList();
        expect(items.length).toBe(1);

        // Retrieve the item and check for null
        let cartEspressoItem = await cartPage.getItemByName(espressoName);
        if (!cartEspressoItem) throw new Error("Espresso not found in the cart");

        expect(await cartEspressoItem.getQuantity()).toBe(amountOfEspresso);
        expect(await cartEspressoItem.getTotalPrice()).toBe(espressoPrice);

        // Step 3: Increase quantity using the "+" button
        await cartEspressoItem.increaseQuantity();
        amountOfEspresso++;

        expect(await cartEspressoItem.getQuantity()).toBe(amountOfEspresso);
        expect(await cartEspressoItem.getTotalPrice()).toBe(espressoPrice * amountOfEspresso);
        expect(await cartPage.getItemCount()).toBe(amountOfEspresso);

        // Step 4: Decrease quantity using the "-" button
        await cartEspressoItem.decreaseQuantity();
        amountOfEspresso--;

        expect(await cartEspressoItem.getQuantity()).toBe(amountOfEspresso);
        expect(await cartPage.getItemCount()).toBe(amountOfEspresso);

        // Step 5: Remove item by decreasing quantity to zero
        await cartEspressoItem.decreaseQuantity();
        await expect(cartEspressoItem.container).toBeHidden();
        expect(await cartPage.isEmpty()).toBe(true);

        // Step 6: Rapid clicks (multiple additions)
        await cartPage.clickMenuLink();
        await menuPage.waitForVisible();
        await menuPage.addCoffeeToCart(espressoName);

        await menuPage.clickCartLink();
        await cartPage.waitForVisible();

        // Re-initialize the locator after navigation to avoid stale element errors
        cartEspressoItem = await cartPage.getItemByName(espressoName);
        if (!cartEspressoItem) throw new Error("Espresso disappeared after navigation");

        const rapidClicks = 5;
        await cartEspressoItem.increaseQuantityBy(rapidClicks);
        amountOfEspresso = 1 + rapidClicks;

        expect(await cartEspressoItem.getQuantity()).toBe(amountOfEspresso);
        expect(await cartPage.getItemCount()).toBe(amountOfEspresso);

        // Step 7: Clear cart using decreaseQuantityBy method
        await cartEspressoItem.decreaseQuantityBy(amountOfEspresso);
        await expect(cartEspressoItem.container).toBeHidden();
        expect(await cartPage.isEmpty()).toBe(true);

        // Step 8: Remove item via the "X" button (Remove)
        await cartPage.clickMenuLink();
        await menuPage.waitForVisible();
        await menuPage.addCoffeeToCart(espressoName);

        await menuPage.clickCartLink();
        await cartPage.waitForVisible();

        const itemToDelete = await cartPage.getItemByName(espressoName);
        if (!itemToDelete) throw new Error("Item to delete not found");

        await itemToDelete.removeFromCart(); // Click the "X" button

        await expect(itemToDelete.container).toBeHidden();
        expect(await cartPage.isEmpty()).toBe(true);
        expect(await cartPage.getItemCount()).toBe(0);
    });
})