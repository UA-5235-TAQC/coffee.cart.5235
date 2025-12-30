import { Page, Locator } from '@playwright/test';
import { Base } from '../Base';

export class PromoModal extends Base {
    protected root: Locator;
    protected acceptButton: Locator;
    protected skipButton: Locator;

    constructor(page: Page) {
        super(page);
        this.root = page.locator('.promo');
        this.acceptButton = page.getByRole('button', { name: 'Yes, of course!' });
        this.skipButton = page.getByRole('button', { name: "Nah, I'll skip." });
    }

    async acceptPromo() {
        await this.acceptButton.click();
    }

    async skipPromo() {
        await this.skipButton.click();
    }
    isVisible(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    waitForVisible(): Promise<void> {
        throw new Error('Method not implemented.');
    }
    waitForHidden(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
