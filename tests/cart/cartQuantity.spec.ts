import { test, expect } from "@playwright/test";
import { MenuPage } from "../../page/MenuPage";
import { CartPage } from "../../page/CartPage";
import { AssertionHelpers, TestConstants } from "../../utils";
import env from "../../config/env";

test.describe("Cart Quantity Management", () => {
  let menuPage: MenuPage;
  let cartPage: CartPage;
  const baseClientUrl = env.BASE_CLIENT_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseClientUrl);
    menuPage = new MenuPage(page);
    cartPage = new CartPage(page);
  });

  test("TC-039: Verify quantity update via plus/minus/X buttons", async ({ page }) => {
    const itemName = "Espresso";
    const itemPrice = TestConstants.PRICES.ESPRESSO;

    // Step 1: Click item "Espresso"
    await menuPage.addCoffeeToCart(itemName);
    
    // Verify cart link shows cart(1)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 1);

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
    cartItem = await cartPage.getItemByName(itemName);
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
  });

  test("TC-006: Managing cart item quantities - increase, decrease, delete", async ({ page }) => {
    const itemName = "Cappuccino";

    // Step 1: Open main page
    await menuPage.navigate();

    // Step 2: Click on "Cappuccino" three times
    await menuPage.addCoffeeToCart(itemName);
    await menuPage.addCoffeeToCart(itemName);
    await menuPage.addCoffeeToCart(itemName);

    // Step 3: Check counter shows (3)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 3);

    // Step 5: Open cart
    await cartPage.navigate();

    // Step 6: Find "Cappuccino" line
    let cartItem = await cartPage.getItemByName(itemName);
    expect(cartItem).not.toBeNull();
    
    if (cartItem) {
      let quantity = await cartItem.getQuantity();
      expect(quantity).toBe(3);

      // Step 7: Press "+" button once
      await cartItem.increaseQuantity();
      
      // Refresh item reference
      cartItem = await cartPage.getItemByName(itemName);
      if (cartItem) {
        quantity = await cartItem.getQuantity();
        expect(quantity).toBe(4);
      }

      // Step 8: Press "-" button 4 times
      for (let i = 0; i < 4; i++) {
        cartItem = await cartPage.getItemByName(itemName);
        if (cartItem) {
          await cartItem.decreaseQuantity();
        }
      }

      // Step 9: Check that product disappeared
      const isEmpty = await cartPage.isEmpty();
      expect(isEmpty).toBe(true);
    }
  });

  test("TC-009: Cart functionality verification - rapid clicks", async ({ page }) => {
    const items = [
      { name: "Flat White" as const, quantity: 2 },
      { name: "Cafe Latte" as const, quantity: 2 },
      { name: "Cafe Breve" as const, quantity: 2 },
      { name: "Americano" as const, quantity: 2 },
    ];

    // Step 1: Add 4 different products with quantity 2 each
    for (const item of items) {
      for (let i = 0; i < item.quantity; i++) {
        await menuPage.addCoffeeToCart(item.name);
      }
    }

    // Verify total count
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 8);

    // Step 2: Navigate to Cart page
    await cartPage.navigate();
    await cartPage.waitForVisible();

    // Step 3: Increase quantity of first product by 1
    let firstItem = await cartPage.getItemByName(items[0].name);
    if (firstItem) {
      await firstItem.increaseQuantity();
      firstItem = await cartPage.getItemByName(items[0].name);
      if (firstItem) {
        const quantity = await firstItem.getQuantity();
        expect(quantity).toBe(3);
      }
    }

    // Step 4: Decrease quantity of second product by 1
    let secondItem = await cartPage.getItemByName(items[1].name);
    if (secondItem) {
      await secondItem.decreaseQuantity();
      secondItem = await cartPage.getItemByName(items[1].name);
      if (secondItem) {
        const quantity = await secondItem.getQuantity();
        expect(quantity).toBe(1);
      }
    }

    // Step 5: Decrease quantity of third product by 2 (remove it)
    let thirdItem = await cartPage.getItemByName(items[2].name);
    if (thirdItem) {
      await thirdItem.decreaseQuantity();
      await thirdItem.decreaseQuantity();
      // Item should be removed
      thirdItem = await cartPage.getItemByName(items[2].name);
      expect(thirdItem).toBeNull();
    }

    // Step 6: Delete fourth product using delete button
    const fourthItem = await cartPage.getItemByName(items[3].name);
    if (fourthItem) {
      await fourthItem.removeFromCart();
      // Item should be removed
      const removedItem = await cartPage.getItemByName(items[3].name);
      expect(removedItem).toBeNull();
    }

    // Step 7: Verify final quantities (3 + 1 = 4 items total)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 4);
  });
});
