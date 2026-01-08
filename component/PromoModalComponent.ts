import { Page, Locator } from '@playwright/test';
import { Base } from '../Base';
import { StringUtils } from '../utils/stringUtils';
import { getIngredientsFromLocator } from "../utils/domUtils";

export class PromoModal extends Base {
    protected root: Locator;
    protected acceptButton: Locator;
    protected skipButton: Locator;
    protected promoTextSpan: Locator;
    protected promoCup: Locator;
    private ingredients: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.promo');
        this.acceptButton = page.getByRole('button', { name: 'Yes, of course!' });
        this.skipButton = page.getByRole('button', { name: "Nah, I'll skip." });
        this.promoTextSpan = this.root.locator('span').filter({ hasText: "It's your lucky day!" });
        this.promoCup = this.root.locator('.cup-body');
        this.ingredients = this.promoCup.locator('.ingredient');
    }

    async acceptPromo() {
        await this.acceptButton.click();
    }

    async skipPromo() {
        await this.skipButton.click();
    }

    async getPromoPrice(): Promise<number> {
        const text = await this.promoTextSpan.textContent();
        return StringUtils.extractNumbers(text || "");
    }

    async isVisible(): Promise<boolean> {
        return this.root.isVisible();
    }

    async waitForVisible(): Promise<void> {
        await this.root.waitFor({ state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        await this.root.waitFor({ state: 'hidden' });
    }

    async getIngredients(): Promise<string[]> {
        return getIngredientsFromLocator(this.ingredients);
    }
}
