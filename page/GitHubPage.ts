import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { TIMEOUT } from "../config/env"; 

export class GitHubPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    /**
     * Checks if the GitHub page is opened by verifying the URL
     */
    async isOpened(): Promise<boolean> {
        try {
            await this.page.waitForURL('**/github', { timeout: TIMEOUT });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Navigates directly to the GitHub page route.
     */
    async navigate(): Promise<void> {
        await this.page.goto('/github');
    }
}