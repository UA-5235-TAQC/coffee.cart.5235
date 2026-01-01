import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";

test.describe('Promo Modal – full flow', () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
    await expect.poll(() => menuPage.getItemCount()).toBe(0);
  });

  test('TC-PROMO-001: Promo modal accept, repeat, remove, skip', async ({
    menuPage,
    cartPage,
  }) => {
    const { promoModal } = menuPage;

    /* =======================
       Step 1–2: add 3 coffees
       ======================= */
    await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Mocha.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);

    await promoModal.waitForVisible();

    /* =======================
       Step 3: accept promo
       ======================= */
    await promoModal.acceptPromo();
    await promoModal.waitForHidden();

    await expect.poll(() => menuPage.getItemCount()).toBe(4);

    const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();
    const mochaPrice = await menuPage.getCoffeeItem(CoffeeTypes.Mocha.en).getPrice();
    const cappuccinoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Cappuccino.en).getPrice();

    const promoMochaPrice = mochaPrice * 0.5;

    const expectedTotalFirst =
      espressoPrice + mochaPrice + cappuccinoPrice + promoMochaPrice;

    /* =======================
       Step 4: go to Cart
       ======================= */
    await cartPage.navigate();

    /* =======================
       Step 5: verify items
       ======================= */
    const items = await cartPage.getItemsList();
    expect(items.length).toBe(4);

    /* =======================
       Step 6: verify total
       ======================= */
    await expect.poll(() => cartPage.getTotalPrice()).toBe(expectedTotalFirst);
    
    /* =======================
       Step 7: add 2 more items
       ======================= */
    await menuPage.navigate();

    await menuPage.addCoffeeToCart(CoffeeTypes.Americano.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);

    await promoModal.waitForVisible();
    await promoModal.acceptPromo();
    await promoModal.waitForHidden();

    await expect.poll(() => menuPage.getItemCount()).toBe(7);

    /* =======================
       Step 8: remove items < 3
       ======================= */
    await cartPage.navigate();

    // remove items until less than 3 remain
    while ((await cartPage.getItemsList()).length >= 3) {
      const firstItem = (await cartPage.getItemsList())[0];
      await firstItem.removeFromCart();
    }

    const finalCount = await cartPage.getTotalQuantity();
    expect(finalCount).toBeLessThan(3);

    /* =======================
       Step 9: trigger promo and skip
       ======================= */
    await menuPage.navigate();

    await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Mocha.en);
    await menuPage.addCoffeeToCart(CoffeeTypes.Cappuccino.en);

    await promoModal.waitForVisible();
    await promoModal.skipPromo();
    await promoModal.waitForHidden();

    await expect.poll(() => menuPage.getItemCount()).toBe(3);

    /* =======================
       Postconditions
       ======================= */
    await cartPage.navigate();
    while ((await cartPage.getItemsList()).length >= 0) {
      const firstItem = (await cartPage.getItemsList())[0];
      await firstItem.removeFromCart();
    }

    await expect.poll(() => cartPage.getTotalQuantity()).toBe(0);
  });
});