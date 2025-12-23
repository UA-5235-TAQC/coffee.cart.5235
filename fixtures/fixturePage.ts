import {expect as baseExpect, test as baseTest} from "./fixtureBase";
import {GitHubPage} from "../page/GitHubPage";
import {MenuPage} from "../page/MenuPage";
import {CartPage} from "../page/CartPage";

type MyFixturesPage = {
    gitHubPage: GitHubPage;
    menuPage: MenuPage;
    cartPage: CartPage;
};
export const test = baseTest.extend<MyFixturesPage>({
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
});
export const expect = baseExpect;
