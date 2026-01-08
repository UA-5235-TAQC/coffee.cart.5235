import {expect} from "@playwright/test";
import {test} from "../../fixtures/fixturePage";
import {CoffeeTypes} from "../../data/CoffeeTypes";

test.describe("Cart Quantity Management", () => {

    test.beforeEach(async ({menuPage}) => {
        // Open the main page
        await menuPage.navigate();
        // Ensure the cart is empty
        const cartItemCount = await menuPage.getItemCount();
        expect(cartItemCount).toBe(0);
    });

    test("TC-39: Verify quantity update via plus/minus/X buttons", async ({menuPage, cartPage}) => {
        const espressoName = CoffeeTypes.Espresso.en;

        // Step 1: Click item "Espresso"
        await menuPage.addCoffeeToCart(espressoName);
        const espressoPrice = await menuPage.getCoffeeItem(espressoName).getPrice();
        const cartItemCount = await menuPage.getItemCount();
        const totalBtnPrice = await menuPage.getTotalBtnPrice();
        let amountOfEspresso = 1;
        expect(cartItemCount).toBe(amountOfEspresso);
        expect(totalBtnPrice).toBe(espressoPrice);

        // Step 2: Navigate to Cart page
        await menuPage.clickCartLink();
        await expect(cartPage.itemList).toBeVisible();

        let totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(1);
        let items = await cartPage.getItemsList();
        expect(items.length).toBe(1);

        const cartEspressoItem = await cartPage.getItemByName(espressoName);
        await expect(cartEspressoItem.container).toBeVisible();

        const cartEspressoItemQuantity = await cartEspressoItem.getQuantity();
        const cartEspressoItemTotalPrice = await cartEspressoItem.getTotalPrice();

        expect(cartEspressoItemQuantity).toBe(amountOfEspresso);
        expect(cartEspressoItemTotalPrice).toBe(espressoPrice);

        // Step 3: Increase item quantity using the "+" button
        await cartEspressoItem.increaseQuantity();
        amountOfEspresso += 1;
        let espressoTotal = espressoPrice * amountOfEspresso;

        let cartItemQuantity = await cartEspressoItem.getQuantity();
        let cartItemTotalPrice = await cartEspressoItem.getTotalPrice();

        expect(cartItemQuantity).toBe(amountOfEspresso);
        expect(cartItemTotalPrice).toBe(espressoTotal);
        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(amountOfEspresso);
        items = await cartPage.getItemsList();
        expect(items.length).toBe(1);

        // Step 4: Decrease item quantity using the "-" button
        await cartEspressoItem.decreaseQuantity();
        amountOfEspresso -= 1;
        espressoTotal = espressoPrice * amountOfEspresso;

        cartItemQuantity = await cartEspressoItem.getQuantity();
        cartItemTotalPrice = await cartEspressoItem.getTotalPrice();

        expect(cartItemQuantity).toBe(amountOfEspresso);
        expect(cartItemTotalPrice).toBe(espressoTotal);
        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(amountOfEspresso);

        // Step 5: Verify item removal via minus button
        await cartEspressoItem.decreaseQuantity();
        amountOfEspresso -= 1;
        let isCartEmpty = await cartPage.isEmpty();

        await expect(cartEspressoItem.container).toBeHidden();
        expect(isCartEmpty).toBe(true);

        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(amountOfEspresso);

        // Step 6: Perform rapid multiple clicks on the "+" button
        await cartPage.clickMenuLink();
        await menuPage.waitForVisible();
        await menuPage.addCoffeeToCart(espressoName);
        const updatedCartItemCount = await menuPage.getItemCount();
        const updatedTotalBtnPrice = await menuPage.getTotalBtnPrice();
        let updatedAmountOfEspresso = 1;
        expect(updatedCartItemCount).toBe(updatedAmountOfEspresso);
        expect(updatedTotalBtnPrice).toBe(espressoPrice);

        await menuPage.clickCartLink();
        await expect(cartPage.itemList).toBeVisible();

        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(updatedAmountOfEspresso);
        items = await cartPage.getItemsList();
        expect(items.length).toBe(1);

        const rapidClicks = 5;
        await cartEspressoItem.increaseQuantityBy(rapidClicks);
        updatedAmountOfEspresso += rapidClicks;
        espressoTotal = espressoPrice * updatedAmountOfEspresso;

        cartItemQuantity = await cartEspressoItem.getQuantity();
        cartItemTotalPrice = await cartEspressoItem.getTotalPrice();

        expect(cartItemQuantity).toBe(updatedAmountOfEspresso);
        expect(cartItemTotalPrice).toBe(espressoTotal);
        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(updatedAmountOfEspresso);
        items = await cartPage.getItemsList();
        expect(items.length).toBe(1);

        // Step 7: Validate cart empty state via minus button
        await cartEspressoItem.decreaseQuantityBy(updatedAmountOfEspresso);
        isCartEmpty = await cartPage.isEmpty();

        await expect(cartEspressoItem.container).toBeHidden();
        expect(isCartEmpty).toBe(true);

        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(0);

        // Step 8: Validate cart empty state via "X" button
        await cartPage.clickMenuLink();
        await menuPage.waitForVisible();
        await menuPage.addCoffeeToCart(espressoName);
        const newCartItemCount = await menuPage.getItemCount();
        const newTotalBtnPrice = await menuPage.getTotalBtnPrice();
        const newAmountOfEspresso = 1;
        expect(newCartItemCount).toBe(newAmountOfEspresso);
        expect(newTotalBtnPrice).toBe(espressoPrice);

        await menuPage.clickCartLink();
        await expect(cartPage.itemList).toBeVisible();

        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(1);
        items = await cartPage.getItemsList();
        expect(items.length).toBe(1);

        const updatedCartEspressoItem = await cartPage.getItemByName(espressoName);
        await expect(updatedCartEspressoItem.container).toBeVisible();

        const updatedCartEspressoItemQuantity = await updatedCartEspressoItem.getQuantity();
        const updatedCartEspressoItemTotalPrice = await updatedCartEspressoItem.getTotalPrice();

        expect(updatedCartEspressoItemQuantity).toBe(newAmountOfEspresso);
        expect(updatedCartEspressoItemTotalPrice).toBe(espressoPrice);

        await updatedCartEspressoItem.removeFromCart();

        isCartEmpty = await cartPage.isEmpty();

        await expect(updatedCartEspressoItem.container).toBeHidden();
        expect(isCartEmpty).toBe(true);

        totalQty = await cartPage.getItemCount();
        expect(totalQty).toBe(0);
    });

});
