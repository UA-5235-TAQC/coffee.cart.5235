// CoffeeCartComponent.ts
import { Locator } from "@playwright/test";

export class CoffeeCartComponent {
    readonly cupClickArea: Locator;

    // Приймаємо конкретний LI, а не всю сторінку
    constructor(private root: Locator) {
        // Шукаємо елементи відносно цього LI
        this.cupClickArea = this.root.locator('.cup-body'); // приклад селектора
        // або просто this.root, якщо клікати треба по всьому li
    }

    async clickAdd(): Promise<void> {
        await this.cupClickArea.click();
    }

    async rightClick(): Promise<void> {
        await this.cupClickArea.click({ button: 'right' });
    }
}