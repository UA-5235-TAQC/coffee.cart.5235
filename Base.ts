import { Page } from "@playwright/test";

export abstract class Base {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    abstract isVisible(): Promise<boolean>;
    abstract waitForVisible(): Promise<void>;
    abstract waitForHidden(): Promise<void>;
}
