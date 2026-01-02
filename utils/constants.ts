/**
 * Common test constants to avoid magic numbers and duplicated values
 */
export const TestConstants = {
    /**
     * Coffee prices (in USD)
     */
    PRICES: {
        ESPRESSO: 10.00,
        ESPRESSO_MACCHIATO: 12.00,
        CAPPUCCINO: 19.00,
        MOCHA: 8.00,
        FLAT_WHITE: 18.00,
        AMERICANO: 7.00,
        CAFE_LATTE: 16.00,
        ESPRESSO_CON_PANNA: 14.00,
        CAFE_BREVE: 15.00,
        PROMO_MOCHA: 4.00,
    },

    /**
     * Timeouts (in milliseconds)
     */
    TIMEOUTS: {
        DEFAULT_TEST: 30000,
        ASSERTION: 5000,
        MODAL_APPEAR: 3000,
        NETWORK_IDLE: 10000,
    },

    /**
     * Promotional offer settings
     */
    PROMO: {
        /** Number of items required to trigger promo modal */
        TRIGGER_EVERY_N_ITEMS: 3,
        /** Maximum attempts to add items to trigger promo modal in tests */
        MAX_ATTEMPTS_TO_TRIGGER: 10,
        /** Default promo item name */
        DEFAULT_PROMO_ITEM: 'Mocha',
    },

    /**
     * UI Messages
     */
    MESSAGES: {
        EMPTY_CART: 'No coffee, go add some.',
        PURCHASE_SUCCESS: 'Thanks for your purchase. Please check your email for payment',
        PROMO_MODAL_TITLE: "It's your lucky day!",
    },

    /**
     * Test data for forms
     */
    TEST_DATA: {
        VALID_NAME: 'Test User',
        VALID_EMAIL: 'test@example.com',
        INVALID_EMAILS: [
            'plaintext',
            '@example.com',
            'test@',
            'test@@example.com',
            'test@.com',
            'test@com',
        ],
    },

    /**
     * Precision for price comparisons
     */
    PRICE_PRECISION_DECIMALS: 2,
};
