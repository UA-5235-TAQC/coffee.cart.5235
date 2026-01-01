import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import env from "../config/env";

test("Modify cart after starting checkout", async ({ menuPage, cartPage }) => {
  await menuPage.navigate();
  await menuPage.waitForVisible();

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
