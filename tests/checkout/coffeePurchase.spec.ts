import { expect } from "@playwright/test";
import { test } from "../../fixtures/fixturePage";
import { CoffeeTypes } from "../../data/CoffeeTypes";
import { TestDataBuilder } from "../../data";

test.describe("Coffee Purchase: ", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
    await expect.poll(() => menuPage.getItemCount()).toBe(0);
  });

  test("TC-001: Successful purchase of one product", async ({ menuPage }) => {
    const espressoPrice = await menuPage.getCoffeeItem(CoffeeTypes.Espresso.en).getPrice();

    await menuPage.addCoffeeToCart(CoffeeTypes.Espresso.en);

    await expect.poll(() => menuPage.getItemCount()).toBe(1);
    await expect.poll(() => menuPage.getTotalBtnPrice()).toBe(espressoPrice);

    const { paymentModal, successSnackbar } = menuPage;
    const { name, email } = TestDataBuilder.validPaymentDetails();

    await menuPage.showPaymentModal();
    await paymentModal.waitForVisible();

    await paymentModal.enterName(name);
    await paymentModal.enterEmail(email);
    await paymentModal.togglePromotionAgreement();

    await paymentModal.submitPayment();
    await successSnackbar.waitForVisible();

    await expect.poll(() => successSnackbar.getMessage()).toBe(TestDataBuilder.validSuccessSnackbarMessage());
  });
});
