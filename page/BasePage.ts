import { Locator, Page } from "@playwright/test";
import { StringUtils } from '../utils/stringUtils';

export abstract class BasePage {
    protected page: Page; //page should be protected according POM principles
    protected menuPageLink: Locator;
    protected cartPageLink: Locator;
    protected gitHubPageLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuPageLink = page.getByLabel("Menu page");
        this.cartPageLink = page.getByLabel("Cart page");
        this.gitHubPageLink = page.getByLabel("GitHub page");
    }

    async navigate(path: string = '/'): Promise<void> {
        await this.page.goto(path);
    }

    async isVisible(): Promise<boolean> {
        if (!this.root) {
            throw new Error("Cannot check visibility: 'root' locator is not defined in this class.");
        }
        return await this.root.isVisible();
    }

    async waitForVisible(): Promise<void> {
        if (!this.root) {
            throw new Error("Cannot wait for visibility: 'root' locator is not defined.");
        }
        await this.root.waitFor({ state: 'visible' });
    }

    async waitForHidden(): Promise<void> {
        if (this.root) {
            await this.root.waitFor({ state: 'hidden' });
        }
    }

    async clickMenuLink () {
        await this.menuPageLink.click();
    }
    async clickCartLink() {
        await this.cartPageLink.click();
    }
    async clickGitHubLink() {
        await this.gitHubPageLink.click();
    }
    async getTitleText() {
        return await this.page.title();
<<<<<<< Updated upstream
    }

    async getItemCount(): Promise<number> {
        const text = await this.cartPageLink.textContent();
        return StringUtils.extractNumbers(text ?? ""); // Return 0 if there is no text
    }

    public get instance(): Page {   //getter for Page object
        return this.page;
=======
>>>>>>> Stashed changes
    }

    async getItemCount(): Promise<number> {
        const text = await this.cartPageLink.textContent();
        return StringUtils.extractNumbers(text ?? '0'); 
    }

    public get instance(): Page {   //getter for Page object
        if (!this.page) throw new Error("Page not initialized!");
        return this.page;
    }
}

