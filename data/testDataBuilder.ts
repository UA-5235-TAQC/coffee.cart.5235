/**
 * Builder pattern for test data to avoid hard-coded values in tests
 */
export class TestDataBuilder {
    /**
     * Returns valid payment details for successful checkout
     */
    static validPaymentDetails() {
        return {
            name: 'Yaroslav',
            email: 'yaroslav@gmail.com',
        };
    }

    /**
     * Returns valid success snackbar message
     */
    static validSuccessSnackbarMessage() {
        return "Thanks for your purchase. Please check your email for payment.";
    }
}