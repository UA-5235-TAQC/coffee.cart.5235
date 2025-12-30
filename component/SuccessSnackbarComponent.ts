import { Page, Locator } from "@playwright/test";
import { Base } from "../Base";

export class SuccessSnackbarComponent extends Base {
    protected root: Locator;

    constructor(page: Page) {
        super(page);
        this.root = this.page.locator('div.snackbar.success');
    }

    async isVisible(): Promise<boolean> {
        return this.root.isVisible();
    }

    async waitForVisible(): Promise<void> {
        await this.root.waitFor({ state: "visible" });
    }

    async waitForHidden(): Promise<void> {
        await this.root.waitFor({ state: "hidden" });
    }

    async getMessage(): Promise<string> {
        await this.waitForVisible();
        return (await this.root.innerText()).trim();
    }
}
