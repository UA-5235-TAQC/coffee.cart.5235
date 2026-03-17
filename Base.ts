import { Page } from "@playwright/test";

export abstract class Base {

    protected _page: Page;

    constructor(page: Page) {
        this._page = page;
    }
    get page(): Page {
        return this._page;
    }

    abstract isVisible(): Promise<boolean>;
    abstract waitForVisible(): Promise<void>;
    abstract waitForHidden(): Promise<void>;
}
