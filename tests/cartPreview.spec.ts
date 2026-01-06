import { expect } from "@playwright/test";
import { test } from "../fixtures/fixturePage";
import { CoffeeTypes } from "../data/CoffeeTypes";
import { CartPreviewComponent } from "../component";

test.describe("CartPreview - Smoke Tests", () => {
  const coffee = CoffeeTypes.Americano.en;
  let cartPreview: CartPreviewComponent;

  test.beforeEach(async ({ menuPage, page }) => {
    cartPreview = new CartPreviewComponent(page);
    await menuPage.navigate();
    await menuPage.waitForVisible();
  });

  test("TC-01 - Cart preview initially hidden", async () => {
    await expect(cartPreview.getCartPreview).toBeHidden();
  });

  test("TC-02 - Cart preview is shown on hover", async ({ menuPage }) => {
    await menuPage.addCoffeeToCart(coffee);
    await menuPage.showCheckout();
    await expect(cartPreview.getCartPreview).toBeVisible();
  });

  test("TC-03 - Remove item from cart when quantity reaches zero", async ({
    menuPage,
  }) => {
    await menuPage.addCoffeeToCart(coffee);
    expect(await menuPage.getItemCount()).toBe(1);

    await menuPage.showCheckout();
    await cartPreview.decreaseItemQuantity(coffee);

    // Verify item removed and cart preview hidden
    expect(await menuPage.getItemCount()).toBe(0);
    await cartPreview.waitForHidden();
    await expect(cartPreview.getCartPreview).toBeHidden();
  });

  test("TC-04 - Total updates when increasing item quantity", async ({
    menuPage,
  }) => {
    await menuPage.addCoffeeToCart(coffee);
    const initialTotal = await menuPage.getTotalBtnPrice();

    // Increase quantity and verify total doubled
    await menuPage.showCheckout();
    await cartPreview.increaseItemQuantity(coffee);
    const newTotal = await menuPage.getTotalBtnPrice();
    expect(newTotal).toBeCloseTo(initialTotal * 2, 1);
  });
});
