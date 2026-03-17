import { expect as baseExpect, test as baseTest } from "./fixtureBase";
import { GitHubPage } from "../page/GitHubPage";
import { MenuPage } from "../page/MenuPage";
import { CartPage } from "../page/CartPage";
import { PaymentDetailsModalComponent,
         SuccessSnackbarComponent, 
         AddToCartModal,
         PromoModal, 
         CartPreviewComponent } from "../component";

type Pages = {
    gitHubPage: GitHubPage;
    menuPage: MenuPage;
    cartPage: CartPage;
    paymentModal: PaymentDetailsModalComponent;
    snackbar: SuccessSnackbarComponent;
    addToCartModal: AddToCartModal;
    promoModal: PromoModal;
    cartPreview: CartPreviewComponent;
};

export const test = baseTest.extend<Pages>({
    gitHubPage: async ({page}, use) => {
        const gitHubPage = new GitHubPage(page);
        await use(gitHubPage);
    },
    menuPage: async ({page}, use) => {
        const menuPage = new MenuPage(page);
        await use(menuPage);
    },
    cartPage: async ({page}, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    paymentModal: async ({page}, use) => {
        const paymentModal = new PaymentDetailsModalComponent(page);
        await use(paymentModal);
    },
    snackbar: async ({page}, use) => {
        const snackbar = new SuccessSnackbarComponent(page);
        await use(snackbar);
    },
    addToCartModal: async ({page}, use) => {
        const addToCartModal = new AddToCartModal(page);
        await use(addToCartModal);
    },
    promoModal: async ({page}, use) => {
        const promoModal = new PromoModal(page);
        await use(promoModal);
    },
    cartPreview: async ({page}, use) => {
        const cartPreview = new CartPreviewComponent(page);
        await use(cartPreview);
    },
});

export const expect = baseExpect;
