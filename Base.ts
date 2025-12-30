import { Page } from "@playwright/test";

export abstract class Base {
    constructor(protected page: Page) {}

    abstract isVisible(): Promise<boolean>;
    abstract waitForVisible(): Promise<void>;
    abstract waitForHidden(): Promise<void>;
}
