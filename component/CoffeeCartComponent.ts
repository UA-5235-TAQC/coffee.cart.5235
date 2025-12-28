import { Locator, Page } from '@playwright/test';
import { CoffeeTypes } from '../data/CoffeeTypes';
/**
 * Represents the coffee card component on the menu page.
 */
export class CoffeeCartComponent {
    readonly root: Locator;

    private readonly nameHeader: Locator;
    private readonly priceLabel: Locator;
    private readonly cupClickArea: Locator; // button area for adding coffee (it`s not a button element)
    private readonly ingredients: Locator;

    constructor(root: Locator) {
        this.root = root;

        this.nameHeader = root.locator('h4');
        this.priceLabel = root.locator('h4 small');
        
        // Target the .cup-body as it carries the click event listener
        this.cupClickArea = root.locator('.cup-body'); 

        this.ingredients = root.locator('.ingredient');
    }

    // Retrieves the clean coffee name, excluding the price tag. 
    
    async getName(): Promise<string> {
        const fullText = await this.nameHeader.innerText();
        const priceText = await this.priceLabel.innerText();
        return fullText.replace(priceText, '').trim();
    }

    // Retrieves the coffee price as a numeric value. 
    async getPrice(): Promise<number> {
        const text = await this.priceLabel.innerText();
        return Number(text.replace('$', '').trim());
    }

    // Adds the coffee to the cart by clicking the cup area. 
    async clickAdd(): Promise<void> {
        await this.cupClickArea.click();
    }

    // Performs a double-click on the name. 
    async doubleClickName(): Promise<void> {
        await this.nameHeader.dblclick();
    }

    // Opens the context menu (right-click) to trigger the Confirmation Modal. 
    
    async rightClick(): Promise<void> {
        // Clicks on the cup body to invoke the context menu
        await this.cupClickArea.click({ button: 'right' });
    }

    // Retrieves the list of ingredients as an array of strings. 
    
    async getIngredients(): Promise<string[]> {
        // Optimized way to fetch all text contents at once
        const texts = await this.ingredients.allTextContents();
        return texts.map(t => t.trim()).filter(t => t !== '');
    }

    // Checks if a specific ingredient is present (case-insensitive). 
    
    async hasIngredient(name: string): Promise<boolean> {
        const ingredients = await this.getIngredients();
        return ingredients.some(ing => ing.toLowerCase() === name.toLowerCase());
    }

    // Finds the list item `Locator` for a coffee by name using a `Page`.
    static findLocator(page: Page, name: CoffeeTypes): Locator {
        return page.locator('ul > li').filter({
            has: page.locator('h4', { hasText: new RegExp(`^${name}`) })
        });
    }

    // Convenience factory: returns a `CoffeeCartComponent` instance for the named coffee.
    static forName(page: Page, name: CoffeeTypes): CoffeeCartComponent {
        const locator = CoffeeCartComponent.findLocator(page, name);
        return new CoffeeCartComponent(locator);
    }

}