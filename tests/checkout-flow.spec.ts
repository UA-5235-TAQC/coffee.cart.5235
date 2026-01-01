import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";
import env from "../config/env";

test.describe("Checkout and Promo Flow Tests", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
    await menuPage.waitForVisible();
  });

  test("Modify cart after starting checkout", async ({
    menuPage,
    cartPage,
  }) => {
    await menuPage.addCoffeeToCart();
    expect(await cartPage.getItemCount()).toBe(1);

    await menuPage.clickCartLink();
    await cartPage.waitForVisible();
    await menuPage.showPaymentModal();
    expect(await menuPage.paymentModal.isVisible()).toBe(true);

    await menuPage.paymentModal.closeModal();
    expect(await menuPage.paymentModal.isVisible()).toBe(false);

    await menuPage.clickMenuLink();
    await menuPage.waitForVisible();
    await menuPage.addCoffeeToCart();
    expect(await cartPage.getItemCount()).toBe(2);

    await menuPage.clickCartLink();
    await cartPage.waitForVisible();
    await menuPage.showPaymentModal();
    expect(await menuPage.paymentModal.isVisible()).toBe(true);

    await menuPage.paymentModal.enterName(env.VALID_USER_NAME);
    await menuPage.paymentModal.enterEmail(env.VALID_USER_EMAIL);
    await menuPage.paymentModal.submitPayment();

    expect(await menuPage.paymentModal.isVisible()).toBe(false);
    await menuPage.successSnackbar.waitForVisible();
    await menuPage.successSnackbar.waitForHidden();
  });
  test("Verify appearance of the pop-up with the discount product after every 3 products added to the cart", async ({
    menuPage,
  }) => {
    const coffee = CoffeeTypes.Americano.en;
    await menuPage.navigate();
    await menuPage.waitForVisible();

    for (let i = 0; i < 3; i++) {
      await menuPage.addCoffeeToCart(coffee);
    }
    await menuPage.promoModal.acceptPromo();
    expect(await menuPage.getItemCount()).toBe(4);

    await menuPage.addCoffeeToCart(coffee);
    await menuPage.showConfirmModal(coffee); // Adding via modal (left-click) breaks promo flow
    await menuPage.confirmModal.accept();
    for (let i = 0; i < 3; i++) {
      await menuPage.addCoffeeToCart(coffee);
    }
    await menuPage.promoModal.acceptPromo();
    expect(await menuPage.getItemCount()).toBe(10);
  });
});
