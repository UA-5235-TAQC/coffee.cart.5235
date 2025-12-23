import {expect as baseExpect, test as baseTest} from "@playwright/test";
import env from "../config/env";

type Fixtures = {
    baseClientUrl: string;
};

export const test = baseTest.extend<Fixtures>({
    // eslint-disable-next-line no-empty-pattern
    baseClientUrl: async ({}, use) => {
        await use(env.BASE_CLIENT_URL);
    },
});

export const expect = baseExpect;
