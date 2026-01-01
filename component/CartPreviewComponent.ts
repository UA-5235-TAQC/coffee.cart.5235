import { Page, Locator } from "@playwright/test";
import { Base } from "../Base";

export class CartPreviewComponent extends Base {

    protected cartPreviewContainer: Locator;
    protected cartItems: Locator;

    constructor(page: Page) {
        super(page);
        this.cartPreviewContainer = page.locator(".pay-container .cart-preview");
        this.cartItems = this.cartPreviewContainer.locator("li.list-item");
    }

    isVisible(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    waitForVisible(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    waitForHidden(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    get cartPreviewElement() {
        return this.cartPreviewContainer;
    }

    // Returns a locator for a specific item (li) in the cart.
    getCartItem(itemName: string): Locator {
        return this.cartItems.filter({
            has: this.page.locator(`span:text-is("${itemName}")`),
        });
    }

    async increaseItemQuantity(itemName: string) {
        await this.getCartItem(itemName)
            .locator(`button[aria-label="Add one ${itemName}"]`)
            .click();
    }

    async decreaseItemQuantity(itemName: string) {
        await this.getCartItem(itemName)
            .locator(`button[aria-label="Remove one ${itemName}"]`)
            .click();
    }
}
