import { Page, Locator } from '@playwright/test';
import { MenuPage } from "../page/MenuPage";

export class CartPreviewComponent {
  readonly page: Page;
  readonly menuPage: MenuPage;
  readonly cartPreviewContainer: Locator;        

  constructor(page: Page,  menuPage: MenuPage) {
    this.page = page;
    this.menuPage = menuPage;

    this.cartPreviewContainer = page.locator('.pay-container .cart-preview');     
  }

  // Returns a locator for a specific item in the cart.
  getCartItem(itemName: string): Locator {
     const escapedItemName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
     const regex = new RegExp(`^${escapedItemName}\\s*x\\s*\\d+$`);

     return this.cartPreviewContainer.locator('li.list-item').filter({ hasText: regex });
  }

  async increaseItemQuantity(itemName: string) {
    await this.menuPage.showCheckout();
    await this.getCartItem(itemName).locator('button:has-text("+")').click();
  }
  
  async decreaseItemQuantity(itemName: string){
    await this.menuPage.showCheckout();
    await this.getCartItem(itemName).locator('button:has-text("-")').click();
  }
}
