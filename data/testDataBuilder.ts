/**
 * Builder pattern for test data to avoid hard-coded values in tests
 */
export class TestDataBuilder {
    /**
     * Returns valid payment details for successful checkout (Yaroslav)
     */
    static validPaymentDetailsYaroslav() {
        return {
            name: 'Yaroslav',
            email: 'yaroslav@gmail.com',
            agreeToPromo: true,
        };
    }

    /**
     * Returns valid payment details for successful checkout (Test User)
     */
    static validPaymentDetails() {
        return {
            name: 'Test User',
            email: 'test@example.com',
            agreeToPromo: true,
        };
    }

    /**
     * Returns long name (>1000 chars) for negative testing
     */
    static longName(length = 1001) {
        return 'A'.repeat(length);
    }

    /**
     * Returns long email (>300 chars) for negative testing
     */
    static longEmail(length = 301) {
        return 'a'.repeat(length) + '@gmail.com';
    }

    /**
     * Returns invalid email (missing @) for negative testing
     */
    static invalidEmail() {
        return 'yaroslav_gmail.com';
    }

    /**
     * Returns empty string for testing empty input
     */
    static emptyInput() {
        return '';
    }

    /**
     * Returns valid success snackbar message
     */
    static validSuccessSnackbarMessage() {
        return "Thanks for your purchase. Please check your email for payment.";
    }
}
