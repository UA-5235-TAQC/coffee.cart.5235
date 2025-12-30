import { test, expect } from "@playwright/test";
import { CartPreviewComponent } from "../component/cartPreviewComponent";
import { MenuPage } from "../page/MenuPage";
import env from "../config/env";

test.describe("CartPreview - Smoke Tests", () => {
  let cartPreview: CartPreviewComponent;
  let menuPage: MenuPage;
  const baseClientUrl = env.BASE_CLIENT_URL;

  test.beforeEach(async ({ page }) => {
    await page.goto(baseClientUrl);
    menuPage = new MenuPage(page);
    cartPreview = new CartPreviewComponent(page);
  });

  test("cart preview initially hidden", async () => {
    await expect(cartPreview.cartPreviewElement).toBeHidden();
  });

  test("cart preview is showed on hover", async () => {
    await menuPage.addCoffeeToCart("Espresso");
    await menuPage.showCheckout();
    await expect(cartPreview.cartPreviewElement).toBeVisible();
  });

  test("remove item from cart when quantity reaches zero", async () => {
    const itemName = "Espresso";
    await menuPage.addCoffeeToCart(itemName);
    await cartPreview.decreaseItemQuantity(itemName);
    await expect(cartPreview.cartPreviewElement).toBeHidden();
  });

  test("total updates when increasing item quantity", async () => {
    await menuPage.addCoffeeToCart("Espresso");
    const initialTotal = await menuPage.getTotalBtnPrice();
    await cartPreview.increaseItemQuantity("Espresso");
    const newTotal = await menuPage.getTotalBtnPrice();
    expect(newTotal).toBeCloseTo(initialTotal * 2, 1);
  });
});
