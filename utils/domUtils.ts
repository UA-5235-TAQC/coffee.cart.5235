import { Locator } from '@playwright/test';

/**
 * Retrieves the list of ingredients as an array of strings.
 */
export async function getIngredientsFromLocator(locator: Locator): Promise<string[]> {
    const texts = await locator.allTextContents();
    return texts.map(t => t.trim()).filter(t => t !== '');
}
