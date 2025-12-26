import { Page, Locator } from "@playwright/test";

export class SuccessSnackbarComponent {
    protected snackbarContainer: Locator;

    constructor(page: Page) {
        this.snackbarContainer = page.locator('div.snackbar.success');
    }

    async isVisible(): Promise<boolean> {
        return this.snackbarContainer.isVisible();
    }

    async getMessage(): Promise<string> {
        const text = await this.snackbarContainer.textContent();
        return text ?? "";
    }

    async waitForVisible(): Promise<void> {
        await this.snackbarContainer.waitFor({ state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        await this.snackbarContainer.waitFor({ state: 'hidden' });
    }
}
