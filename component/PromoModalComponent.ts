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
        await this.waitForVisible();
        await this.acceptButton.click();
        await this.waitForHidden();  
    }

    async skipPromo() {
        await this.skipButton.click();
    }
    isVisible(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    async waitForVisible(): Promise<void> {
        await this.root.waitFor({ state: 'visible'});
    }

    async waitForHidden(): Promise<void> {
        await this.root.waitFor({ state: 'hidden'});
    }
}
