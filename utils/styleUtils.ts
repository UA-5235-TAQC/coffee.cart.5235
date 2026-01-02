import {Locator, Page} from "@playwright/test";

export async function expectLobsterFont(pageOrLocator: Page | Locator, timeout = 5000): Promise<boolean> {
    if ('waitForFunction' in pageOrLocator) {
        // Page
        try {
            await pageOrLocator.waitForFunction(
                () => Array.from(document.querySelectorAll("style")).some(s =>
                    s.innerText.includes("font-family: 'Lobster'")
                ),
                { timeout }
            );
            return true;
        } catch {
            return false;
        }
    } else {
        // Locator
        try {
            return await pageOrLocator.evaluate(() =>
                Array.from(document.querySelectorAll("style")).some(s =>
                    s.innerText.includes("font-family: 'Lobster'")
                )
            );
        } catch {
            return false;
        }
    }
}
