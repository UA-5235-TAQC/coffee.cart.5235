import { Locator } from "@playwright/test";
import { parsePrice, parseQuantity } from "../utils";

export class CartItemComponent {
    protected _root: Locator;
    protected name: Locator;
    protected unitDescription: Locator;
    protected totalPrice: Locator;
    protected addOneButton: Locator;
    protected removeOneButton: Locator;
    protected deleteButton: Locator;

    constructor(_root: Locator) {
        this._root = _root;
        this.name = this._root.locator("div >> nth=0"); // item name is the 1st div in the row
        this.unitDescription = this._root.locator(".unit-desc");
        this.totalPrice = this._root.locator("div >> nth=3"); // total price is the 4th div in the row
        this.addOneButton = this._root.locator("button[aria-label^=\"Add one\"]");
        this.removeOneButton = this._root.locator("button[aria-label^=\"Remove one\"]");
        this.deleteButton = this._root.locator("button.delete");
    }

    async getName(): Promise<string> {
        const name = await this.name.textContent();

        if (!name) {
            throw new Error("Cart item name text is null");
        }

        return name;
    }

    async getUnitDescription(): Promise<string> {
        const unitDescText = await this.unitDescription.textContent();

        if (!unitDescText) {
            throw new Error("Cart item unit description text is null");
        }

        return unitDescText;
    }

    async getUnitPrice(): Promise<number> {
        const unitDescText = await this.getUnitDescription();

        return parsePrice(unitDescText);
    }

    async getQuantity(): Promise<number> {
        const unitDescText = await this.getUnitDescription();

        return parseQuantity(unitDescText);
    }

    async getTotalPrice(): Promise<number> {
        const totalPriceText = await this.totalPrice.textContent();

        if (!totalPriceText) {
            throw new Error("Cart item total price text is null");
        }

        return parsePrice(totalPriceText);
    }

    async increaseQuantity(): Promise<void> {
        await this.addOneButton.click();
    }

    async decreaseQuantity(): Promise<void> {
        await this.removeOneButton.click();
    }

    async removeFromCart(): Promise<void> {
        await this.deleteButton.click();
    }

     get root(): Locator {
        return this._root;
    }
}
