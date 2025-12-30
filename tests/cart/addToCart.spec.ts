import { test, expect } from "@playwright/test";
import { MenuPage } from "../../page/MenuPage";
import { CartPage } from "../../page/CartPage";
import { AssertionHelpers, TestConstants } from "../../utils";
import env from "../../config/env";

test.describe("Basic Cart Operations", () => {
  let menuPage: MenuPage;
  let cartPage: CartPage;
  const baseClientUrl = env.BASE_CLIENT_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseClientUrl);
    menuPage = new MenuPage(page);
    cartPage = new CartPage(page);
  });

  test("TC-002: Add 1 Americano to cart and verify cart update", async ({ page }) => {
    const itemName = "Americano";
    const expectedPrice = TestConstants.PRICES.AMERICANO;

    // Step 1-4: Verify Americano is displayed with price
    const coffeeItem = menuPage.getCoffeeItem(itemName);
    const actualPrice = await coffeeItem.getPrice();
    expect(actualPrice).toBe(expectedPrice);

    // Step 5: Click on Americano
    await menuPage.addCoffeeToCart(itemName);

    // Verify cart counter increases to 1
    await AssertionHelpers.assertCartCount(menuPage.instance.getByLabel("Cart page"), 1);

    // Step 6: Verify total price
    await AssertionHelpers.assertTotalPrice(
      menuPage.instance.getByLabel('Proceed to checkout'),
      expectedPrice,
      TestConstants.PRICE_PRECISION_DECIMALS
    );

    // Step 7: Open cart
    await page.click('[aria-label="Cart page"]');
    await cartPage.waitForVisible();

    // Step 8: Verify cart contents
    const cartItem = await cartPage.getItemByName(itemName);
    expect(cartItem).not.toBeNull();
    
    if (cartItem) {
      const cartItemName = await cartItem.getName();
      expect(cartItemName).toContain(itemName);
      
      const quantity = await cartItem.getQuantity();
      expect(quantity).toBe(1);
      
      const totalPrice = await cartItem.getTotalPrice();
      expect(totalPrice).toBeCloseTo(expectedPrice, TestConstants.PRICE_PRECISION_DECIMALS);
    }
  });

  test("TC-003: Add multiple different products to cart and verify", async ({ page }) => {
    const itemA = "Americano";
    const itemB = "Cappuccino";
    const priceA = TestConstants.PRICES.AMERICANO;
    const priceB = TestConstants.PRICES.CAPPUCCINO;
    const expectedTotal = priceA + priceB;

    // Steps 1-5: Add items to cart
    await menuPage.addCoffeeToCart(itemA);
    await AssertionHelpers.assertCartCount(menuPage.instance.getByLabel("Cart page"), 1);
    
    await menuPage.addCoffeeToCart(itemB);
    await AssertionHelpers.assertCartCount(menuPage.instance.getByLabel("Cart page"), 2);

    // Step 6-8: Verify total price on main page
    await AssertionHelpers.assertTotalPrice(
      menuPage.instance.getByLabel('Proceed to checkout'),
      expectedTotal,
      TestConstants.PRICE_PRECISION_DECIMALS
    );

    // Step 9: Open cart
    await page.click('[aria-label="Cart page"]');
    await cartPage.waitForVisible();

    // Step 10: Verify cart contents
    const items = await cartPage.getItemsList();
    expect(items.length).toBe(2);

    const totalPrice = await cartPage.getTotalPrice();
    expect(totalPrice).toBeCloseTo(expectedTotal, TestConstants.PRICE_PRECISION_DECIMALS);
  });

  test("TC-036: Verify correct Total Calculation with multiple items", async () => {
    const itemA = "Espresso";
    const itemB = "Cappuccino";
    const priceA = TestConstants.PRICES.ESPRESSO;
    const priceB = TestConstants.PRICES.CAPPUCCINO;
    const expectedTotal = priceA + priceB;

    // Step 1-2: Add items
    await menuPage.addCoffeeToCart(itemA);
    await menuPage.addCoffeeToCart(itemB);

    // Step 3: Hover over Total or click cart link
    await menuPage.showCheckout();

    // Step 4: Verify total amount
    await AssertionHelpers.assertTotalPrice(
      menuPage.instance.getByLabel('Proceed to checkout'),
      expectedTotal,
      TestConstants.PRICE_PRECISION_DECIMALS
    );
  });

  test("TC-038: Verify grouping logic when adding same item multiple times", async ({ page }) => {
    const itemName = "Espresso";
    const price = TestConstants.PRICES.ESPRESSO;

    // Step 1-2: Add same item twice
    await menuPage.addCoffeeToCart(itemName);
    await menuPage.addCoffeeToCart(itemName);

    // Verify cart counter
    await AssertionHelpers.assertCartCount(menuPage.instance.getByLabel("Cart page"), 2);

    // Verify total price (2 items)
    await AssertionHelpers.assertTotalPrice(
      menuPage.instance.getByLabel('Proceed to checkout'),
      price * 2,
      TestConstants.PRICE_PRECISION_DECIMALS
    );

    // Step 3: Open cart
    await page.click('[aria-label="Cart page"]');
    await cartPage.waitForVisible();

    // Step 4: Verify items are grouped
    const items = await cartPage.getItemsList();
    expect(items.length).toBe(1); // Should be grouped into single row

    const cartItem = items[0];
    const quantity = await cartItem.getQuantity();
    expect(quantity).toBe(2); // Quantity should be x2

    const totalPrice = await cartItem.getTotalPrice();
    expect(totalPrice).toBeCloseTo(price * 2, TestConstants.PRICE_PRECISION_DECIMALS);
  });

  test("TC-029: Verify cart link displays correct total item count", async () => {
    const cartLink = menuPage.instance.getByLabel("Cart page");

    // Step 1: Add 1 unit of first product
    await menuPage.addCoffeeToCart("Espresso");
    await AssertionHelpers.assertCartCount(cartLink, 1);

    // Step 2: Add 2 more units of same product
    await menuPage.addCoffeeToCart("Espresso");
    await menuPage.addCoffeeToCart("Espresso");
    await AssertionHelpers.assertCartCount(cartLink, 3);

    // Step 3: Add 2 units of second product
    await menuPage.addCoffeeToCart("Mocha");
    await menuPage.addCoffeeToCart("Mocha");
    await AssertionHelpers.assertCartCount(cartLink, 5);

    // Step 4: Navigate to cart and verify count persists
    await cartPage.navigate();
    await AssertionHelpers.assertCartCount(cartLink, 5);
  });
});
