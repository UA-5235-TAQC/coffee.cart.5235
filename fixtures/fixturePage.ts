import { expect as baseExpect, test as baseTest } from "./fixtureBase";
import { GitHubPage } from "../page/GitHubPage";
import { MenuPage } from "../page/MenuPage";
import { CartPage } from "../page/CartPage";
import { PaymentDetailsModalComponent } from "../component/PaymentDetailsModalComponent";
import { PromoModal } from "../component/PromoModalComponent";
import { SuccessSnackbarComponent as SuccessSnackbar } from "../component/SuccessSnackbarComponent";

type MyFixturesPage = {
  gitHubPage: GitHubPage;
  menuPage: MenuPage;
  cartPage: CartPage;
  paymentDetailsModal: PaymentDetailsModalComponent;
  promoModal: PromoModal;
  successSnackbar: SuccessSnackbar;
};
export const test = baseTest.extend<MyFixturesPage>({
  gitHubPage: async ({ page }, use) => {
    const gitHubPage = new GitHubPage(page);
    await use(gitHubPage);
  },
  menuPage: async ({ page }, use) => {
    const menuPage = new MenuPage(page);
    await use(menuPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  //components
  paymentDetailsModal: async ({ page }, use) => {
    const paymentDetailsModal = new PaymentDetailsModalComponent(page);
    await use(paymentDetailsModal);
  },
  promoModal: async ({ page }, use) => {
    const promoModal = new PromoModal(page);
    await use(promoModal);
  },
  successSnackbar: async ({ page }, use) => {
    const successSnackbar = new SuccessSnackbar(page);
    await use(successSnackbar);
  },
});
export const expect = baseExpect;
