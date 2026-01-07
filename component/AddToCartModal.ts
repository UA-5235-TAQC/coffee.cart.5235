import { Locator, Page } from '@playwright/test';
import { Base } from '../Base';

export class AddToCartModal extends Base {
    protected modalContainer: Locator;
    protected acceptButton: Locator;
    protected declineButton: Locator;

    constructor(page: Page) {
        super(page);
        this.modalContainer = page.locator('[data-cy="add-to-cart-modal"]');
        this.acceptButton = this.modalContainer.getByRole('button', { name: 'Yes' });
        this.declineButton = this.modalContainer.getByRole('button', { name: 'No' });
    }

    /**
     * Clicks the accept button inside the modal
     */
    async accept(): Promise<void> {
        await this.acceptButton.waitFor({ state: 'visible' });
        await this.acceptButton.click();
    }

    /**
     * Clicks the decline button inside the modal
     */
    async decline(): Promise<void> {
        await this.declineButton.click();
    }

    async isVisible(): Promise<boolean> {
        return await this.modalContainer.isVisible();
    }
    async waitForVisible(): Promise<void> {
        await this.modalContainer.waitFor({ state: 'visible' });
    }
    async waitForHidden(): Promise<void> {
        await this.modalContainer.waitFor({ state: 'hidden' });

    }
}
