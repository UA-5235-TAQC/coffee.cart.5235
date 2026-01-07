import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartItemComponent } from "../component";

export class CartPage extends BasePage {
  private totalQuantity: Locator;
  private emptyCartMessage: Locator;
  private cartItem: Locator;
  private checkoutButton: Locator;
  private cartPageList: Locator;

  constructor(page: Page) {
    super(page);
    this.totalQuantity = this.page.getByRole("link", { name: "Cart" });
    this.emptyCartMessage = this.page.getByText("No coffee, go add some.");
    this.cartItem = this.page.locator('xpath=//*[@id="app"]/div[2]/div/ul/li');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.cartPageList = this.page.locator(".list");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/cart");
  }

  async getItemsList(): Promise<CartItemComponent[]> {
    const itemList: CartItemComponent[] = [];
    const all = await this.cartItem.all();
    for (const item of all) {
      itemList.push(new CartItemComponent(item));
    }
    return itemList;
  }

  async getTotalPrice(): Promise<number> {
    const empty = await this.isEmpty();
    if (!empty) {
      const price = (await this.checkoutButton.innerText()).split("$")[1];
      return parseFloat(price);
    }
    return 0;
  }

  async getTotalQuantity(): Promise<number> {
    let quantity = await this.totalQuantity.innerText();
    quantity = quantity.split(" ")[1].replace(/[()]/g, "");
    return Number(quantity);
  }

  async isEmpty(): Promise<boolean> {
    const isVisible = await this.emptyCartMessage.isVisible();
    const quantity = await this.getTotalQuantity();
    const status = isVisible && quantity === 0;
    return status;
  }

  async openCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async getItemByName(itemName: string): Promise<CartItemComponent | null> {
    const itemLocator = this.cartItem.filter({ hasText: itemName }).first();
    const count = await itemLocator.count();

    if (count === 0) {
      return null;
    }

    const parsedItem = new CartItemComponent(itemLocator);
    return parsedItem;
  }

  async isVisible(): Promise<boolean> {
    return this.cartPageList.isVisible();
  }

  async waitForVisible(): Promise<void> {
    await this.cartPageList.waitFor({ state: "visible" });
  }

  async waitForHidden(): Promise<void> {
    await this.cartPageList.waitFor({ state: "hidden" });
  }
}
