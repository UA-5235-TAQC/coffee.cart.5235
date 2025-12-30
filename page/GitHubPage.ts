import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class GitHubPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }
    
    async navigate(): Promise<void> {
        await this.page.goto("/github");
    }

    async isVisible(): Promise<boolean> {
        return this.page.isVisible("");
    }

    async waitForVisible(): Promise<void> {}
    async waitForHidden(): Promise<void> {}
}
