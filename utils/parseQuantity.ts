/** Extracts a quantity number from a string like "$10.00 x 1" or "Espresso x 1" */
export function parseQuantity(quantityText: string): number {
    const match = quantityText.match(/x\s*(\d+)/);
    
    if (!match) {
        throw new Error(`Cannot parse quantity from "${quantityText}"`);
    }

    return parseInt(match[1], 10);
}