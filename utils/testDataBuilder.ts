/**
 * Builder pattern for test data to avoid hard-coded values in tests
 */
export class TestDataBuilder {
    /**
     * Returns valid payment details for successful checkout
     */
    static validPaymentDetails() {
        return {
            name: 'Test User',
            email: 'test@example.com',
            agreeToPromo: true,
        };
    }

    /**
     * Returns payment details with custom values
     * @param overrides - Partial payment details to override defaults
     */
    static customPaymentDetails(overrides: {
        name?: string;
        email?: string;
        agreeToPromo?: boolean;
    }) {
        return {
            ...TestDataBuilder.validPaymentDetails(),
            ...overrides,
        };
    }

    /**
     * Returns array of invalid email addresses for negative testing
     */
    static invalidEmails(): string[] {
        return [
            'plaintext',
            '@example.com',
            'test@',
            'test@@example.com',
            'test@.com',
            'test@com',
            'test example@gmail.com',
            'test@exam#ple.com',
            '',
            '   ',
        ];
    }

    /**
     * Returns array of valid email addresses for positive testing
     */
    static validEmails(): string[] {
        return [
            'test@example.com',
            'user+tag@example.co.uk',
            'firstname.lastname@example.com',
            'user123@test-domain.org',
            '123@example.com',
        ];
    }

    /**
     * Returns array of invalid names for negative testing
     */
    static invalidNames(): string[] {
        return [
            '',
            '   ',
            '123',
            '@#$%',
        ];
    }

    /**
     * Returns array of valid names including edge cases
     */
    static validNames(): string[] {
        return [
            'John Doe',
            'Mary-Jane',
            "O'Brien",
            'José García',
            'Müller',
            'Вася', // Cyrillic
            '王伟', // Chinese
            'A', // Single character
            'X'.repeat(100), // Long name
        ];
    }

    /**
     * Returns a random coffee name from the available options
     */
    static randomCoffeeName(): string {
        const coffeeNames = [
            'Espresso',
            'Espresso Macchiato',
            'Cappuccino',
            'Mocha',
            'Flat White',
            'Americano',
            'Cafe Latte',
            'Espresso Con Panna',
            'Cafe Breve',
        ];
        return coffeeNames[Math.floor(Math.random() * coffeeNames.length)];
    }

    /**
     * Returns an array of N random coffee names
     * @param count - Number of coffee names to return
     */
    static randomCoffeeNames(count: number): string[] {
        const result: string[] = [];
        for (let i = 0; i < count; i++) {
            result.push(TestDataBuilder.randomCoffeeName());
        }
        return result;
    }

    /**
     * Returns test data for URL parameters
     */
    static urlParameters() {
        return {
            adMode: '?ad=1',
            breakableMode: '?breakable=1',
            combined: '?ad=1&breakable=1',
        };
    }
}
