import {Locator} from '@playwright/test';
import { getIngredientsFromLocator } from '../utils/domUtils';

/**
 * Represents the coffee card component on the menu page.
 */
export class CoffeeCartComponent {
    private root: Locator;
    private nameHeader: Locator;
    private priceLabel: Locator;
    private cupClickArea: Locator; // button area for adding coffee (it's not a button element)
    private ingredients: Locator;

    constructor(root: Locator) {
        this.root = root;

        this.nameHeader = this.root.locator('h4');
        this.priceLabel = this.root.locator('h4 small');

        // Target the .cup-body as it carries the click event listener
        this.cupClickArea = this.root.locator('.cup-body');
        this.ingredients = this.root.locator('.ingredient');
    }

    /**
     * Retrieves the clean coffee name, excluding the price tag.
     */
    async getName(): Promise<string> {
        const aria = await this.root.getAttribute('aria-label');
        if (aria) {
            return aria.replace('(Discounted)', '').trim();
        }

        const fullText = await this.nameHeader.innerText();
        const priceText = await this.priceLabel.innerText();
        return fullText.replace(priceText, '').trim();
    }

    /**
     * Retrieves the coffee price as a numeric value.
     */
    async getPrice(): Promise<number> {
        const text = await this.priceLabel.innerText();
        return Number(text.replace('$', '').trim());
    }

    /**
     * Adds the coffee to the cart by clicking the cup area.
     */
    async clickAdd(): Promise<void> {
        await this.cupClickArea.click();
    }

    /**
     * Performs a double-click on the name.
     */
    async doubleClickName(): Promise<void> {
        await this.nameHeader.dblclick();
    }

    /**
     * Opens the context menu (right-click) to trigger the Confirmation Modal.
     */
    async rightClick(): Promise<void> {
        // Clicks on the cup body to invoke the context menu
        await this.cupClickArea.click({button: 'right'});
    }

    async getIngredients(): Promise<string[]> {
        return getIngredientsFromLocator(this.ingredients);
    }

    /**
     * Checks whether the coffee has the specified ingredient.
     * @param name The ingredient name to look for.
     */
    async hasIngredient(name: string): Promise<boolean> {
        const ingredients = await this.getIngredients();
        return ingredients.some(ing => ing.toLowerCase() === name.toLowerCase());
    }

    async isVisible(): Promise<boolean> {
        return this.root.isVisible();
    }

    async priceIsVisible(): Promise<boolean> {
        return this.priceLabel.isVisible();
    }   
}
