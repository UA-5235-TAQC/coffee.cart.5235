import {expect, test} from "../fixtures/fixturePage";


test("has title", async ({baseClientUrl, menuPage, cartPage, gitHubPage}) => {
    await menuPage.page.goto(baseClientUrl);

    // Expect a title "to contain" a substring.
    await expect(menuPage.getTitleText()).toEqual("Coffee cart");
    await expect(menuPage.page).toHaveURL(`${baseClientUrl}/`);

    await menuPage.clickCartLink();
    await expect(cartPage.page).toHaveURL(`${baseClientUrl}/cart`);

    await cartPage.clickGitHubLink();
    await expect(gitHubPage.page).toHaveURL(`${baseClientUrl}/github`);
});
