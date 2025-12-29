import { Page, Locator } from "@playwright/test";
import { MenuPage } from "../page/MenuPage";

export class CartPreviewComponent {
  protected page: Page;
  protected menuPage: MenuPage;
  protected cartPreviewContainer: Locator;
  protected cartItems: Locator;

  constructor(page: Page, menuPage: MenuPage) {
    this.page = page;
    this.menuPage = menuPage;
    this.cartPreviewContainer = page.locator(".pay-container .cart-preview");
    this.cartItems = this.cartPreviewContainer.locator("li.list-item");
  }

  // Returns a locator for a specific item (li) in the cart.
  getCartItem(itemName: string): Locator {
    return this.cartItems.filter({ hasText: itemName });
  }

  async increaseItemQuantity(itemName: string) {
    if (!(await this.cartPreviewContainer.isVisible())) {
      await this.menuPage.showCheckout();
    }
    await this.getCartItem(itemName)
      .locator(`button[aria-label="Add one ${itemName}"]`)
      .click();
  }

  async decreaseItemQuantity(itemName: string) {
    if (!(await this.cartPreviewContainer.isVisible())) {
      await this.menuPage.showCheckout();
    }
    await this.getCartItem(itemName)
      .locator(`button[aria-label="Remove one ${itemName}"]`)
      .click();
  }
}
