import { test as baseTest } from "./fixtureBase";
import { PaymentDetailsModalComponent } from "../component/PaymentDetailsModalComponent";

type MyFixturesPage = {
    paymentDetailsModal: PaymentDetailsModalComponent;
};

/**
 * Provides access to the Payment Details modal component.
 *
 * This fixture DOES NOT open the modal automatically.
 * The test is responsible for triggering the modal appearance
 * and controlling when it should be visible or hidden.
 */
export const test = baseTest.extend<MyFixturesPage>({
    paymentDetailsModal: async ({ page }, use) => {
        const modal = new PaymentDetailsModalComponent(page);
        await use(modal);
    },
});
