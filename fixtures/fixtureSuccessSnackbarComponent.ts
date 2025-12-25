import { test as baseTest } from "./fixtureBase";
import { SuccessSnackbarComponent } from "../component/SuccessSnackbarComponent";

type MyFixturesPage = {
    successSnackbar: SuccessSnackbarComponent;
};

/**
 * Provides access to the Success Snackbar component.
 *
 * This fixture does NOT trigger the snackbar automatically, only after successful payment.
 */
export const test = baseTest.extend<MyFixturesPage>({
    successSnackbar: async ({ page }, use) => {
        const snackbar = new SuccessSnackbarComponent(page);
        await use(snackbar);
    },
});
