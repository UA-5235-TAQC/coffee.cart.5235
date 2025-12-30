import { Page, Locator } from '@playwright/test';
import { BasePage } from "../page/BasePage";

export class PromoModal extends BasePage {
    public root: Locator;
    protected acceptButton: Locator;
    protected skipButton: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.promo'); 
        this.acceptButton = page.locator('button:has-text("Yes, of course!")');
        this.skipButton = page.locator('button:has-text("Nah, I\'ll skip.")');
    }

    async acceptPromo() {
        await this.acceptButton.click();
    }

    async skipPromo() {
        await this.skipButton.click();
    }
}
