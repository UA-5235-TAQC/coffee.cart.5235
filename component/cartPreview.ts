import { Page, Locator, expect } from '@playwright/test';

export class CartPreviewComponent {
  readonly page: Page;
  readonly increaseButtons: Locator;      
  readonly decreaseButtons: Locator;
  readonly cartPreviewContainer: Locator; 
  readonly totalButton: Locator;          

  constructor(page: Page) {
    this.page = page;
    // Locate all "-"  and "+" buttons inside the cart preview
    this.increaseButtons = page.locator('.cart-preview .unit-controller button:has-text("+")'); 
    this.decreaseButtons = page.locator('.cart-preview .unit-controller button:has-text("-")');
    // The main cart preview container (not visible when cart is empty)
    this.cartPreviewContainer = page.locator('.pay-container .cart-preview');     
    this.totalButton = page.locator('.pay-container [data-test="checkout"]');
  }

  async openCartPreview() {
    await this.totalButton.hover();
    await this.cartPreviewContainer.waitFor({ state: 'visible', timeout: 3000 });
  }

  // Returns the cart row for a specific item
  getCartItem(itemName: string): Locator {
    const safeName = itemName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.cartPreviewContainer
      .locator('li.list-item')
      .filter({ hasText: new RegExp(`${safeName}.*x.*\\d+`) });
  }

  // Adds a product to the cart from the catalog
  async addProduct(productName: string) {
    const productLocator = this.page.locator(`.cup-body[aria-label="${productName}"]`);
    await expect(productLocator).toBeVisible({ timeout: 3000 });
    await productLocator.click();
  }

  async increaseItemQuantity(itemName: string) {
    await this.openCartPreview();
    await this.getCartItem(itemName)
      .locator('button:has-text("+")')
      .click();
  }
  
  // Decreases item quantity by 1
  async decreaseItemQuantity(itemName: string){
    await this.openCartPreview();
    await this.getCartItem(itemName)
      .locator('button:has-text("-")')
      .click();
  }

  // Returns total cart amount
  async getTotalAmount() {
    const match = (await this.totalButton.textContent())?.match(/\$\s*([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }
}