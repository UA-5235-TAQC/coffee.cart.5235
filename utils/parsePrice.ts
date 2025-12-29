/** Extracts a price number from a string like "$10.00" or "$10.00 x 1" */
export function parsePrice(priceText: string): number {
    const match = priceText.match(/\$(\d+(?:\.\d+)?)/);
    
    if (!match) {
        throw new Error(`Cannot parse price from "${priceText}"`);
    }

    return parseFloat(match[1]);
}