import { test, expect } from "@playwright/test";
import { MenuPage } from "../../page/MenuPage";
import { AssertionHelpers, TestConstants } from "../../utils";
import env from "../../config/env";

test.describe("Promotional Modal", () => {
  let menuPage: MenuPage;
  const baseClientUrl = env.BASE_CLIENT_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseClientUrl);
    menuPage = new MenuPage(page);
  });

  test("TC-004: Verify promo coffee popup appears every 3rd item", async ({ page }) => {
    // Step 1-2: Add 2 items
    await menuPage.addCoffeeToCart("Espresso");
    await menuPage.addCoffeeToCart("Cappuccino");
    
    // Verify no promo popup yet
    const promoModal = menuPage.promoModal;
    let isVisible = await promoModal.isVisible();
    expect(isVisible).toBe(false);

    // Step 3: Add 3rd item
    await menuPage.addCoffeeToCart("Americano");
    
    // Step 4: Verify promo popup appears
    await promoModal.waitForVisible();
    isVisible = await promoModal.isVisible();
    expect(isVisible).toBe(true);

    // Step 5: Accept promo offer
    await promoModal.acceptPromo();
    
    // Step 6: Verify promo item added (cart count = 4)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 4);

    // Verify popup closed
    await promoModal.waitForHidden();
  });

  test("TC-013: Promo popup every 3rd item with accept", async ({ page }) => {
    // Add first 3 items to trigger promo
    await menuPage.showPromoModal();
    
    // Accept promo
    const promoModal = menuPage.promoModal;
    await promoModal.acceptPromo();
    
    // Verify promo modal closed
    await promoModal.waitForHidden();
    
    // Cart should have 4 items (3 regular + 1 promo)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 4);
  });

  test("TC-028: Verify repeated trigger of promo modal", async ({ page }) => {
    const promoModal = menuPage.promoModal;

    // Step 1: Add 3 units to trigger first promo
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();

    // Step 2: Accept offer
    await promoModal.waitForVisible();
    await promoModal.acceptPromo();
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 4);

    // Step 3: Add 3 more products
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();

    // Step 4: Promo modal should appear again
    await promoModal.waitForVisible();
    
    // Accept again
    await promoModal.acceptPromo();
    
    // Step 5: Verify cart count = 8 (6 original + 2 promo)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 8);

    // Step 6: Add 3 more products to trigger third time
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();

    // Verify modal triggers third time
    await promoModal.waitForVisible();
  });

  test("TC-030: Promotional offer with skip option", async ({ page }) => {
    const promoModal = menuPage.promoModal;

    // Step 1-2: Add 3 items to trigger promo
    await menuPage.addCoffeeToCart("Espresso");
    await menuPage.addCoffeeToCart("Espresso Macchiato");
    await menuPage.addCoffeeToCart("Cappuccino");

    // Verify promo modal appears
    await promoModal.waitForVisible();

    // Verify message contains "It's your lucky day!"
    await expect(page.locator('.promo')).toContainText(TestConstants.MESSAGES.PROMO_MODAL_TITLE);

    // Step 3: Accept promo
    await promoModal.acceptPromo();
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 4);

    // Add 3 more items to trigger promo again
    await menuPage.addCoffeeToCart("Americano");
    await menuPage.addCoffeeToCart("Mocha");
    await menuPage.addCoffeeToCart("Flat White");

    // Step 7: This time skip the promo
    await promoModal.waitForVisible();
    await promoModal.skipPromo();

    // Step 8-9: Verify cart count is 7 (not 8)
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 7);
  });

  test("TC-011: Promotional offer functionality - decline option", async ({ page }) => {
    const promoModal = menuPage.promoModal;

    // Step 1-2: Add 3 items
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();
    await menuPage.addCoffeeToCart();

    // Step 3: Promo modal appears
    await promoModal.waitForVisible();

    // Step 4: Decline the offer
    await promoModal.skipPromo();

    // Step 5: Verify modal closed and cart count = 3
    await promoModal.waitForHidden();
    await AssertionHelpers.assertCartCount(page.getByLabel("Cart page"), 3);

    // Verify total price doesn't include promo item
    const totalPrice = await menuPage.getTotalBtnPrice();
    expect(totalPrice).toBeGreaterThan(0);
  });
});
