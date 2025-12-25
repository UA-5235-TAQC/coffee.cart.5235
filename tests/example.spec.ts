import {expect, test} from "../fixtures/fixturePage";


test("has title", async ({baseClientUrl, menuPage, cartPage, gitHubPage}) => {
    //await menuPage.page.goto(baseClientUrl);
    await menuPage.navigate();

    // Expect a title "to contain" a substring.
    await expect(await menuPage.getTitleText()).toEqual("Coffee cart");
    //await expect(menuPage.page).toHaveURL(`${baseClientUrl}/`);

    await menuPage.clickCartLink();
    await expect(cartPage.instance).toHaveURL(`${baseClientUrl}/cart`);

    await cartPage.clickGitHubLink();
    await expect(gitHubPage.instance).toHaveURL(`${baseClientUrl}/github`);

    console.log(">=>=>-------------> [Item COUNT] - " + await menuPage.getItemCount())
});
