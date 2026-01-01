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
     * Returns valid success snackbar message
     */
    static validSuccessSnackbarMessage() {
        return "Thanks for your purchase. Please check your email for payment.";
    }
}