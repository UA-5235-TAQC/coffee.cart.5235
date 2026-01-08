import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";
import { TestDataBuilder } from "../../data";

test.describe("Coffee Purchase", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();

    const cartItemCount = await menuPage.getItemCount();

    expect(cartItemCount).toBe(0);
  });

  test("TC-001: Successful purchase of one product", async ({ menuPage }) => {
    const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();

    await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);

    const cartItemCount = await menuPage.getItemCount();
    const totalBtnPrice = await menuPage.getTotalBtnPrice();

    expect(cartItemCount).toBe(1);
    expect(totalBtnPrice).toBe(espressoPrice);

    const { paymentModal, successSnackbar } = menuPage;
    const { name, email } = TestDataBuilder.validPaymentDetails();

    await menuPage.showPaymentModal();
    await paymentModal.waitForVisible();

    await paymentModal.enterName(name);
    await paymentModal.enterEmail(email);
    await paymentModal.togglePromotionAgreement();

    await paymentModal.submitPayment();
    await successSnackbar.waitForVisible();

    const snackbarMessage = await successSnackbar.getMessage();

    expect(snackbarMessage).toBe(TestDataBuilder.validSuccessSnackbarMessage());
  });
});
