import { Page, Locator } from "@playwright/test";
import { Base } from "../Base";

export class CartPreviewComponent extends Base {
    protected root: Locator;
    protected cartItems: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator(".pay-container .cart-preview");
        this.cartItems = this.root.locator("li.list-item");
    }

    async isVisible(): Promise<boolean> {
        return await this.root.isVisible();
    }

    async waitForVisible(): Promise<void> {
        await this.root.waitFor({ state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        await this.root.waitFor({ state: 'hidden' });
    }

    get cartPreviewElement() {
        return this.root;
    }

    // Returns a locator for a specific item (li) in the cart.
    getCartItem(itemName: string): Locator {
        return this.cartItems.filter({
            has: this.page.locator(`span:text-is("${itemName}")`),
        });
    }

    async increaseItemQuantity(itemName: string): Promise<void> {
        await this.getCartItem(itemName)
            .locator(`button[aria-label="Add one ${itemName}"]`)
            .click();
    }

    async decreaseItemQuantity(itemName: string): Promise<void> {
        await this.getCartItem(itemName)
            .locator(`button[aria-label="Remove one ${itemName}"]`)
            .click();
    }
}
