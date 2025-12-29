import { Page, Locator } from "@playwright/test";
import {Base} from "../Base";

export class SuccessSnackbarComponent extends Base {
    protected snackbarContainer: Locator;

    constructor(page: Page) {
        super(page);
        this.snackbarContainer = this.page.locator('div.snackbar.success');
    }

    async isVisible(): Promise<boolean> {
        return this.snackbarContainer.isVisible();
    }

    async waitForVisible(): Promise<void> {
        await this.snackbarContainer.waitFor({ state: "visible" });
    }

    async waitForHidden(): Promise<void> {
        await this.snackbarContainer.waitFor({ state: "hidden" });
    }

    async getMessage(): Promise<string> {
        const text = await this.snackbarContainer.textContent();
        return text ?? "";
    }
}
