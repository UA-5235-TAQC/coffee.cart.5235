import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartItemComponent } from "../component";
import { CoffeeValue } from "../data/CoffeeTypes";

export class CartPage extends BasePage {
  private totalQuantity: Locator;
  private emptyCartMessage: Locator;
  private cartItem: Locator;
  private checkoutButton: Locator;
  protected cartItemList: Locator;

  constructor(page: Page) {
    super(page);
    this.totalQuantity = this.page.getByRole("link", { name: "Cart" });
    this.emptyCartMessage = this.page.getByText("No coffee, go add some.");
    this.cartItem = this.page.locator('xpath=//*[@id="app"]/div[2]/div/ul/li');
    this.checkoutButton = this.page.locator('[data-test="checkout"]');
    this.cartItemList = this.page.locator("div.list");
  }

  async getItemsList(): Promise<CartItemComponent[]> {
    const itemList: CartItemComponent[] = [];
    const all = await this.cartItem.all();

    for (const item of all) {
      const classAttr = await item.getAttribute("class");
      if (classAttr !== "list-header") {
        itemList.push(new CartItemComponent(item));
      }
    }
    return itemList;
  }

  async getTotalQuantity(): Promise<number> {
    let quantity = await this.totalQuantity.innerText();
    quantity = quantity.split(" ")[1].replace(/[()]/g, "");
    return Number(quantity);
  }

  async getTotalPrice(): Promise<number> {
    const empty = await this.isEmpty();
    if (!empty) {
      const price = (await this.checkoutButton.innerText()).split("$")[1];
      return parseFloat(price);
    }
    return 0;
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

  async getItemByName(itemName: CoffeeValue): Promise<CartItemComponent> {
    const itemLocator = this.cartItem.filter({ hasText: itemName }).first();
    const count = await itemLocator.count();

    if (count === 0) {
      throw new Error(`Item with name "${itemName}" not found in the cart.`);
    }

    const parsedItem = new CartItemComponent(itemLocator);
    return parsedItem;
  }

  async isVisible(): Promise<boolean> {
    return this.cartItemList.isVisible();
  }

  async waitForVisible(): Promise<void> {
    await this.cartItemList.waitFor({ state: "visible" });
  }

  async waitForHidden(): Promise<void> {
    await this.cartItemList.waitFor({ state: "hidden" });
  }

  get itemList(): Locator {
    return this.cartItemList;
  }
}
