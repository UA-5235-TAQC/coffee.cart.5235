import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartItemComponent } from "../component";
import { CoffeeValue } from "../data/CoffeeTypes";


export class CartPage extends BasePage {
    private _root: Locator;
    private totalQuantity: Locator;
    private emptyCartMessage: Locator;
    private cartItem: Locator;
    private checkoutButton: Locator;

    constructor(page: Page) {
        super(page);
        this._root = this.page.locator('div.list').first();
        this.totalQuantity = this.page.getByRole("link", { name: "Cart" })
        this.emptyCartMessage = this.page.getByText('No coffee, go add some.');
        this.cartItem = this.page.locator('xpath=//*[@id="app"]/div[2]/div/ul/li');
        this.checkoutButton = this.page.locator('[data-test="checkout"]');
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
        return itemList
    }

    async getTotalPrice(): Promise<number> {
        const empty = await this.isEmpty()
        if (!empty) {
            const price = (await this.checkoutButton.innerText()).split('$')[1]
            return parseFloat(price)
        }
        return 0
    }

    async getTotalQuantity(): Promise<number> {
        let quantity = await this.totalQuantity.innerText()
        quantity = quantity.split(' ')[1].replace(/[()]/g, '')
        return Number(quantity)
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

    getItemByName(itemName: CoffeeValue): CartItemComponent {
        const itemLocator = this.cartItem.filter({ hasText: itemName }).first();
        return new CartItemComponent(itemLocator);
    }

    get root(): Locator {
        return this._root;
    }
}
