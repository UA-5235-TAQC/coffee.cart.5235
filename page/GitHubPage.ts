import { Page } from "@playwright/test";

export class GitHubPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Checks if the GitHub page is opened by verifying the URL
     */
    async isOpened(): Promise<boolean> {
        try {
            await this.page.waitForURL('**/github.com/**', { timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }
}