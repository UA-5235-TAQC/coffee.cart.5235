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

  get cartPreviewElement() {
    return this.cartPreviewContainer;
  }

  private async ensureCartPreviewVisible() {
    if (!(await this.cartPreviewContainer.isVisible())) {
      await this.menuPage.showCheckout();
    }
  }

  // Returns a locator for a specific item (li) in the cart.
  getCartItem(itemName: string): Locator {
    return this.cartItems.filter({
      has: this.page.locator(`span:text-is("${itemName}")`),
    });
  }

  async increaseItemQuantity(itemName: string) {
    await this.ensureCartPreviewVisible();
    await this.getCartItem(itemName)
      .locator(`button[aria-label="Add one ${itemName}"]`)
      .click();
  }

  async decreaseItemQuantity(itemName: string) {
    await this.ensureCartPreviewVisible();
    await this.getCartItem(itemName)
      .locator(`button[aria-label="Remove one ${itemName}"]`)
      .click();
  }
}
