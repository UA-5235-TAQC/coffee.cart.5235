import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { CoffeeTypes, CoffeeValue } from "../data/CoffeeTypes";
import {VALID_USER_NAME, VALID_USER_EMAIL} from "../config/env";

test.describe("Checkout and Promo Flow Tests", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
  });

  test("TC-15 - Modify cart after starting checkout", async ({
    menuPage,
    cartPage,
  }) => {
    const coffee = CoffeeTypes.Americano.en;

    await menuPage.addCoffeeToCart(coffee);
    expect(await cartPage.getItemCount()).toBe(1);

    await menuPage.clickCartLink();
    await cartPage.waitForVisible();

    await menuPage.showPaymentModal();
    expect(await menuPage.paymentModal.isVisible()).toBe(true);

    await menuPage.paymentModal.closeModal();
    expect(await menuPage.paymentModal.isVisible()).toBe(false);

    await menuPage.clickMenuLink();

    await menuPage.addCoffeeToCart(coffee);
    expect(await cartPage.getItemCount()).toBe(2);

    await menuPage.clickCartLink();
    await cartPage.waitForVisible();

    await menuPage.showPaymentModal();
    expect(await menuPage.paymentModal.isVisible()).toBe(true);

    await menuPage.paymentModal.enterName(VALID_USER_NAME);
    await menuPage.paymentModal.enterEmail(VALID_USER_EMAIL);
    await menuPage.paymentModal.submitPayment();

    // Verify payment modal is closed and success snackbar appears
    expect(await menuPage.paymentModal.isVisible()).toBe(false);
    await menuPage.successSnackbar.waitForVisible();
    await menuPage.successSnackbar.waitForHidden();
  });
  test("TC-14 - Promo modal appears after every 3 items added to cart", async ({
    menuPage,
  }) => {
    const coffee = CoffeeTypes.Americano.en;

    for (let i = 0; i < 3; i++) {
      await menuPage.addCoffeeToCart(coffee);
    }
    await menuPage.promoModal.acceptPromo();
    expect(await menuPage.getItemCount()).toBe(4);

    await menuPage.addCoffeeToCart(coffee);
    await menuPage.showConfirmModal(coffee);
    await menuPage.confirmModal.accept();
    for (let i = 0; i < 3; i++) {
      await menuPage.addCoffeeToCart(coffee);
    }
    await menuPage.promoModal.acceptPromo();
    expect(await menuPage.getItemCount()).toBe(10);
  });
  test("TC-9 - Cart functionality verification", async ({ menuPage, cartPage }) => {
    const coffees: CoffeeValue[] = [
      CoffeeTypes.FlatWhite.en,
      CoffeeTypes.CafeLatte.en,
      CoffeeTypes.CafeBreve.en,
      CoffeeTypes.Americano.en,
    ];
  
    // Add 2 of each coffee to cart
    for (const coffee of coffees) {
      await menuPage.addCoffeeToCart(coffee);
      await menuPage.addCoffeeToCart(coffee);
    }
  
    expect(await menuPage.getItemCount()).toBe(8);
  
    await menuPage.clickCartLink();
  
    const firstItem = await cartPage.getItemByName(coffees[0]);
    expect(firstItem).not.toBeNull();
    await firstItem!.increaseQuantity();
    expect(await firstItem!.getQuantity()).toBe(3);
  
    // 2nd item: decrease quantity
    const secondItem = await cartPage.getItemByName(coffees[1]);
    expect(secondItem).not.toBeNull();
    await secondItem!.decreaseQuantity();
    expect(await secondItem!.getQuantity()).toBe(1);
  
    // 3rd item: remove by decreasing to 0
    const thirdItem = await cartPage.getItemByName(coffees[2]);
    expect(thirdItem).not.toBeNull();
    await thirdItem!.decreaseQuantity();
    await thirdItem!.decreaseQuantity();
    expect(await cartPage.getItemByName(coffees[2])).toBeNull();
  
    // 4th item: remove directly
    const fourthItem = await cartPage.getItemByName(coffees[3]);
    expect(fourthItem).not.toBeNull();
    await fourthItem!.removeFromCart();
    expect(await cartPage.getItemByName(coffees[3])).toBeNull();
  
    // Get totals from cartPage
    const cartTotalItems = await cartPage.getTotalQuantity();
    const cartTotalPrice = await cartPage.getTotalPrice();
  
    // Go back to menu page and check cart preview
    await menuPage.clickMenuLink();
    await menuPage.showCheckout();
  
    // Get totals from menuPage
    const menuTotalItems = await menuPage.getItemCount();
    const menuTotalPrice = await menuPage.getTotalBtnPrice();
  
    // Compare totals and quantities between menuPage and cartPage
    expect(menuTotalItems).toBe(cartTotalItems);
    expect(menuTotalPrice).toBe(cartTotalPrice);
  });
});


