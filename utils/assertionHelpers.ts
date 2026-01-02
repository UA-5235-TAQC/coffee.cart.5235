import { expect, Locator } from '@playwright/test';
import { StringUtils } from './stringUtils';

/**
 * Reusable assertion helpers for common test scenarios
 */
export class AssertionHelpers {
    /**
     * Assert cart counter shows expected count
     * @param cartLink - The cart link locator (usually from header)
     * @param expectedCount - Expected number of items in cart
     */
    static async assertCartCount(cartLink: Locator, expectedCount: number): Promise<void> {
        const text = await cartLink.textContent();
        const actualCount = StringUtils.extractNumbers(text ?? '0');
        expect(actualCount, `Cart count should be ${expectedCount}`).toBe(expectedCount);
    }

    /**
     * Assert total price matches expected value (with precision)
     * @param totalElement - Element containing the total price
     * @param expectedPrice - Expected price value
     * @param precision - Number of decimal places to compare (default: 2)
     */
    static async assertTotalPrice(
        totalElement: Locator,
        expectedPrice: number,
        precision: number = 2
    ): Promise<void> {
        const text = await totalElement.textContent();
        if (!text) {
            throw new Error('Total element text is null');
        }
        const actualPrice = StringUtils.extractNumbers(text);
        expect(actualPrice, `Total price should be $${expectedPrice.toFixed(precision)}`).toBeCloseTo(
            expectedPrice,
            precision
        );
    }

    /**
     * Assert element contains specific text
     * @param element - Element to check
     * @param expectedText - Text that should be contained
     */
    static async assertContainsText(element: Locator, expectedText: string): Promise<void> {
        await expect(element, `Element should contain text "${expectedText}"`).toContainText(
            expectedText
        );
    }

    /**
     * Assert element is visible
     * @param element - Element to check
     * @param elementName - Name for error messages
     */
    static async assertVisible(element: Locator, elementName: string = 'Element'): Promise<void> {
        await expect(element, `${elementName} should be visible`).toBeVisible();
    }

    /**
     * Assert element is hidden
     * @param element - Element to check
     * @param elementName - Name for error messages
     */
    static async assertHidden(element: Locator, elementName: string = 'Element'): Promise<void> {
        await expect(element, `${elementName} should be hidden`).toBeHidden();
    }

    /**
     * Assert current URL matches pattern
     * @param page - Playwright Page object
     * @param urlPattern - String or RegExp to match
     */
    static async assertUrl(
        page: { url(): string },
        urlPattern: string | RegExp
    ): Promise<void> {
        const currentUrl = page.url();
        if (typeof urlPattern === 'string') {
            expect(currentUrl, `URL should contain "${urlPattern}"`).toContain(urlPattern);
        } else {
            expect(currentUrl, `URL should match pattern ${urlPattern}`).toMatch(urlPattern);
        }
    }

    /**
     * Assert number of items in a list
     * @param listLocator - Locator for list items
     * @param expectedCount - Expected number of items
     */
    static async assertListCount(listLocator: Locator, expectedCount: number): Promise<void> {
        const count = await listLocator.count();
        expect(count, `List should contain ${expectedCount} items`).toBe(expectedCount);
    }

    /**
     * Assert element has specific attribute value
     * @param element - Element to check
     * @param attributeName - Attribute name
     * @param expectedValue - Expected attribute value
     */
    static async assertAttribute(
        element: Locator,
        attributeName: string,
        expectedValue: string
    ): Promise<void> {
        await expect(
            element,
            `Element should have ${attributeName}="${expectedValue}"`
        ).toHaveAttribute(attributeName, expectedValue);
    }

    /**
     * Assert input field has specific value
     * @param inputElement - Input element locator
     * @param expectedValue - Expected input value
     */
    static async assertInputValue(inputElement: Locator, expectedValue: string): Promise<void> {
        await expect(inputElement, `Input should have value "${expectedValue}"`).toHaveValue(
            expectedValue
        );
    }

    /**
     * Assert checkbox is checked
     * @param checkboxElement - Checkbox element locator
     */
    static async assertChecked(checkboxElement: Locator): Promise<void> {
        await expect(checkboxElement, 'Checkbox should be checked').toBeChecked();
    }

    /**
     * Assert checkbox is not checked
     * @param checkboxElement - Checkbox element locator
     */
    static async assertNotChecked(checkboxElement: Locator): Promise<void> {
        await expect(checkboxElement, 'Checkbox should not be checked').not.toBeChecked();
    }
}
