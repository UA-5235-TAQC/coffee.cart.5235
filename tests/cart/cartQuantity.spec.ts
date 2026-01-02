import {test, expect} from "@playwright/test";
import {MenuPage} from "../../page/MenuPage";
import {CartPage} from "../../page/CartPage";
import {AssertionHelpers, TestConstants} from "../../utils";
import env from "../../config/env";
import {CoffeeTypes} from "../../data/CoffeeTypes";

test.describe("Cart Quantity Management", () => {
    let menuPage: MenuPage;
    let cartPage: CartPage;
    const baseClientUrl = env.BASE_CLIENT_URL;

    test.beforeEach(async ({page}) => {
        await page.goto(baseClientUrl);
        menuPage = new MenuPage(page);
        cartPage = new CartPage(page);
    });

    test("TC-39: Verify quantity update via plus/minus/X buttons", async ({page}) => {
        const itemName = CoffeeTypes.Espresso.en;
        const itemPrice = TestConstants.PRICES.ESPRESSO;

        // Step 1: Click item "Espresso"
        await menuPage.addCoffeeToCart(itemName);
        await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 1);
        const cafeEspressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
        await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(cafeEspressoPrice);

        // Step 2: Navigate to Cart page
        await cartPage.navigate();
        await cartPage.waitForVisible();

        // Verify page has chosen item
        let cartItem = await cartPage.getItemByName(itemName);
        expect(cartItem).not.toBeNull();

        // Step 3: Increase item quantity using the "+" button
        if (cartItem) {
            await cartItem.increaseQuantity();

            // Verify quantity is now 2
            const quantity = await cartItem.getQuantity();
            expect(quantity).toBe(2);

            // Verify price is $20.00
            const totalPrice = await cartItem.getTotalPrice();
            expect(totalPrice).toBeCloseTo(itemPrice * 2, TestConstants.PRICE_PRECISION_DECIMALS);

            // Verify header shows cart(2)
            await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 2);
        }

        // Step 4: Decrease item quantity using the "-" button
        cartItem = await cartPage.getItemByName(itemName);
        if (cartItem) {
            await cartItem.decreaseQuantity();

            // Verify quantity is now 1
            const quantity = await cartItem.getQuantity();
            expect(quantity).toBe(1);

            // Verify price is $10.00
            const totalPrice = await cartItem.getTotalPrice();
            expect(totalPrice).toBeCloseTo(itemPrice, TestConstants.PRICE_PRECISION_DECIMALS);
        }

        // Step 5: Verify item removal via minus button
        if (cartItem) {
            await cartItem.decreaseQuantity();
        }

        // Verify item disappeared from cart
        const isEmpty = await cartPage.isEmpty();
        expect(isEmpty).toBe(true);

        // Verify "No coffee, go add some" message appears
        await AssertionHelpers.assertContainsText(
            page.getByText(TestConstants.MESSAGES.EMPTY_CART),
            TestConstants.MESSAGES.EMPTY_CART
        );

        // Verify header shows cart(0)
        await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 0);

        // Step 6: Perform rapid multiple clicks on the "+" button
        if (cartItem) {
            for (let i = 0; i < 5; i++) {
                await cartItem.increaseQuantity();
            }

            // Verify quantity is now 6 (1 initial + 5 clicks)
            const rapidQuantity = await cartItem.getQuantity();
            expect(rapidQuantity).toBe(6);

            // Verify total price updated correctly
            const rapidTotalPrice = await cartItem.getTotalPrice();
            expect(rapidTotalPrice).toBeCloseTo(itemPrice * 6, TestConstants.PRICE_PRECISION_DECIMALS);

            // Verify cart header shows correct count
            await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 6);
        }

        // Step 7: Validate cart empty state via minus button
        if (cartItem) {
            for (let i = 0; i < 6; i++) {
                await cartItem.decreaseQuantity();
            }
        }

        // Verify cart is empty
        let isCartEmpty = await cartPage.isEmpty();
        expect(isCartEmpty).toBe(true);

        // Verify empty cart message
        await AssertionHelpers.assertContainsText(
            page.getByText(TestConstants.MESSAGES.EMPTY_CART),
            TestConstants.MESSAGES.EMPTY_CART
        );

        // Verify header shows cart(0)
        await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 0);

        // Step 8: Validate cart empty state via "X" button
        await menuPage.navigate();
        await menuPage.waitForVisible();
        await menuPage.addCoffeeToCart(itemName);
        cartItem = await cartPage.getItemByName(itemName);
        if (cartItem) {
            await cartItem.removeFromCart();
        }

        // Verify cart is empty
        isCartEmpty = await cartPage.isEmpty();
        expect(isCartEmpty).toBe(true);

        // Verify empty cart message
        await AssertionHelpers.assertContainsText(
            page.getByText(TestConstants.MESSAGES.EMPTY_CART),
            TestConstants.MESSAGES.EMPTY_CART
        );

        // Verify header shows cart(0)
        await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 0);
    });

});
