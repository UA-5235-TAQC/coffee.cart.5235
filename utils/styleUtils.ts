import { Locator, Page } from "@playwright/test";

const LOBSTER_CHECK = `Array.from(document.querySelectorAll("style"))
  .some(s => s.innerText.includes("font-family: 'Lobster'"))`;

export async function evaluateLobsterFont(page: Page): Promise<boolean> {
    try {
        return await page.evaluate(LOBSTER_CHECK);
    } catch {
        return false;
    }
}

export async function expectLobsterFont(
    pageOrLocator: Page | Locator,
    timeout = 5000
): Promise<boolean> {
    try {
        if ('waitForFunction' in pageOrLocator) {
            // Page
            await pageOrLocator.waitForFunction(LOBSTER_CHECK, { timeout });
            return await pageOrLocator.evaluate<boolean>(LOBSTER_CHECK);
        } else {
            // Locator
            return await pageOrLocator.evaluate<boolean>(LOBSTER_CHECK);
        }
    } catch {
        return false;
    }
}
