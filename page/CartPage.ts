import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {


    constructor(page: Page) {
        super(page);
    }
    async navigate(): Promise<void> {
        await this.page.goto("/cart");
    }
}
