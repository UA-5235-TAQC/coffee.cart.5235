import { expect, test } from "../fixtures/fixturePage";
import { CoffeeTypes, CoffeeValue } from "../data/CoffeeTypes";
import { VALID_USER_NAME, VALID_USER_EMAIL } from "../config/env";

test.describe("Checkout and Promo Flow Tests", () => {
  test.beforeEach(async ({ menuPage }) => {
    await menuPage.navigate();
  });

  test("TC-15 - Modify cart after starting checkout", async ({
    menuPage,
    cartPage,
    paymentDetailsModal,
    successSnackbar,
  }) => {
    const coffee = CoffeeTypes.Americano.en;

    // Add first coffee to cart and verify count
    await menuPage.addCoffeeToCart(coffee);
    expect(await menuPage.getItemCount()).toBe(1);

    // Navigate to cart and open checkout
    await menuPage.clickCartLink();
    await cartPage.waitForVisible();
    await cartPage.openCheckout();
    expect(await paymentDetailsModal.isVisible()).toBe(true);

    // Close checkout modal without completing payment
    await paymentDetailsModal.closeModal();
    expect(await paymentDetailsModal.isVisible()).toBe(false);

    // Return to menu and add another coffee
    await cartPage.clickMenuLink();
    await menuPage.waitForVisible();
    await menuPage.addCoffeeToCart(coffee);
    expect(await menuPage.getItemCount()).toBe(2);

    // Navigate back to cart and open checkout again
    await menuPage.clickCartLink();
    await cartPage.waitForVisible();
    await cartPage.openCheckout();
    expect(await paymentDetailsModal.isVisible()).toBe(true);

    // Complete payment with valid data
    await paymentDetailsModal.enterName(VALID_USER_NAME);
    await paymentDetailsModal.enterEmail(VALID_USER_EMAIL);
    await paymentDetailsModal.submitPayment();
    await paymentDetailsModal.waitForHidden();
    expect(await paymentDetailsModal.isVisible()).toBe(false);

    // Verify success notification and cart is cleared
    await successSnackbar.waitForVisible();
    expect(await successSnackbar.isVisible()).toBe(true);
    await successSnackbar.waitForHidden();
    expect(await menuPage.getItemCount()).toBe(0);
  });

  test("TC-14 - Promo modal appears after every 3 items added to cart", async ({
    menuPage,
    promoModal,
  }) => {
    const coffee = CoffeeTypes.Americano.en;

    // Add 3 items → promo modal should appear
    for (let i = 0; i < 3; i++) {
      await menuPage.addCoffeeToCart(coffee);
    }

    await promoModal.waitForVisible();
    await promoModal.acceptPromo();
    expect(await menuPage.getItemCount()).toBe(4); // 3 items + 1 promo

    await menuPage.addCoffeeToCart(coffee);

    // Show confirm modal via right-click and accept
    await menuPage.showConfirmModal(coffee);
    await menuPage.confirmModal.accept();

    // Add next 3 items → promo modal appears again
    for (let i = 0; i < 3; i++) {
      await menuPage.addCoffeeToCart(coffee);
    }
    await promoModal.waitForVisible();
    await promoModal.acceptPromo();
    expect(await menuPage.getItemCount()).toBe(10);
  });

  test("TC-9 - Cart functionality verification", async ({
    menuPage,
    cartPage,
  }) => {
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

    // 1st item: increase quantity by 1
    const firstItem = await cartPage.getItemByName(coffees[0]);
    await firstItem.increaseQuantity();
    expect(await firstItem.getQuantity()).toBe(3);

    // 2nd item: decrease quantity
    const secondItem = await cartPage.getItemByName(coffees[1]);
    await secondItem.decreaseQuantity();
    expect(await secondItem.getQuantity()).toBe(1);

    // 3rd item: remove by decreasing to 0
    const thirdItem = await cartPage.getItemByName(coffees[2]);
    await thirdItem.decreaseQuantity();
    await thirdItem.decreaseQuantity();
    await expect(async () => {
      await cartPage.getItemByName(coffees[2]);
    }).rejects.toThrow();

    // 4th item: remove directly
    const fourthItem = await cartPage.getItemByName(coffees[3]);
    await fourthItem.removeFromCart();
    await expect(async () => {
      await cartPage.getItemByName(coffees[3]);
    }).rejects.toThrow();

    // Get totals from cartPage
    const cartTotalItems = await cartPage.getTotalQuantity();
    const cartTotalPrice = await cartPage.getTotalPrice();

    // Go back to menu page and check cart preview
    await cartPage.clickMenuLink();
    await menuPage.showCheckout();

    // Get totals from menuPage
    const menuTotalItems = await menuPage.getItemCount();
    const menuTotalPrice = await menuPage.getTotalBtnPrice();

    // Compare totals and quantities between menuPage and cartPage
    expect(menuTotalItems).toBe(cartTotalItems);
    expect(menuTotalPrice).toBe(cartTotalPrice);
  });
});
